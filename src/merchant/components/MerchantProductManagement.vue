<template>
  <div class="merchant-product-management">
    <!-- 商户信息卡片 -->
    <el-card shadow="never" class="merchant-info-card">
      <div class="merchant-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">商户号</span>
            <span class="value">{{ merchantInfo.merchantNo }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.merchantNo, '商户号')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">签名密钥</span>
            <span class="value">{{ merchantInfo.signPassword }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.signPassword, '签名密钥')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">AES密钥</span>
            <span class="value">{{ merchantInfo.aesPassword }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.aesPassword, 'AES密钥')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">IP白名单</span>
            <span class="value ip-list">{{ merchantInfo.ipWhitelist }}</span>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">商户余额</span>
            <span class="value balance-amount">¥{{ merchantInfo.balance || '0.00' }}</span>
            <el-button type="primary" size="small" @click="showBalanceDetailDialog = true">余额详情</el-button>
          </div>
        </div>
      </div>
      

      
      <!-- 操作按钮 -->
      <div class="action-buttons">

        <el-button type="warning" @click="handleSettings">设置IP白名单</el-button>
      </div>
    </el-card>

    <!-- 产品费率表格 -->
    <el-card shadow="never" class="product-rate-card">
      <div class="card-header">
        <h3>产品费率：</h3>
      </div>
      
      <el-table
        :data="productRateData"
        border
        stripe
        style="width: 100%"
        height="400"
      >
        <el-table-column prop="productName" label="产品名称" min-width="200">
          <template #default="{ row }">
            <span class="product-name">{{ row.productName }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="productCode" label="产品编码" min-width="150" />
        
        <el-table-column prop="rate" label="费率" min-width="120" align="center">
          <template #default="{ row }">
            <span class="rate-value">{{ row.rate }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 余额详情弹窗 -->
    <el-dialog
      v-model="showBalanceDetailDialog"
      title="余额详情"
      width="1000px"
      :before-close="handleCloseBalanceDialog"
    >
      <!-- 筛选区域 -->
      <el-card shadow="never" class="filter-container">
        <el-form :model="balanceFilterForm" inline>
          <el-form-item label="流水类型：">
            <el-select
              v-model="balanceFilterForm.flowType"
              placeholder="请选择流水类型"
              clearable
              style="width: 168px"
            >
              <el-option label="全部" value="" />
              <el-option label="余额调整" value="余额调整" />
              <el-option label="交易增减" value="交易增减" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBalanceFilter">查询</el-button>
            <el-button @click="resetBalanceFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 余额详情表格 -->
      <el-table
        :data="filteredBalanceDetailData"
        border
        stripe
        style="margin-top: 16px"
      >
        <el-table-column prop="flowType" label="流水类型" width="120" />
        <el-table-column prop="beforeAmount" label="交易前金额" width="120">
          <template #default="{ row }">
            ¥{{ row.beforeAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="变动金额" width="120">
          <template #default="{ row }">
            <span :class="{ 'positive-amount': row.amount > 0, 'negative-amount': row.amount < 0 }">
              {{ row.amount > 0 ? '+' : '' }}¥{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="afterAmount" label="变动后金额" width="120">
          <template #default="{ row }">
            ¥{{ row.afterAmount }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="200">
          <template #default="{ row }">
            <span v-if="row.flowType === '交易增减'">
              {{ row.amount > 0 ? `锁卡返还余额，单号：${row.type}` : `提卡单号：${row.type}` }}
            </span>
            <span v-else>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="editTime" label="修改时间" width="180" />
      </el-table>

      <!-- 分页器 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="balancePagination.currentPage"
          v-model:page-size="balancePagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="balancePagination.total"
          @size-change="handleBalanceSizeChange"
          @current-change="handleBalanceCurrentChange"
        />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBalanceDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- IP白名单设置弹窗 -->
    <el-dialog
      v-model="ipWhitelistDialogVisible"
      title="设置IP白名单"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ipWhitelistFormRef"
        :model="ipWhitelistForm"
        :rules="ipWhitelistRules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="IP地址列表" prop="ipList">
          <el-input
            v-model="ipWhitelistForm.ipList"
            type="textarea"
            :rows="6"
            placeholder="请输入IP地址，多个IP地址之间用英文逗号(,)分隔&#10;&#10;示例：192.168.1.1,192.168.1.2,10.0.0.1"
            clearable
          />
          <div class="form-tip">
            <el-text type="info" size="small">
              <el-icon><InfoFilled /></el-icon>
              多个IP地址之间请用英文逗号(,)分隔，支持IPv4格式
            </el-text>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelIpWhitelist">取消</el-button>
          <el-button type="primary" @click="handleConfirmIpWhitelist">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument, InfoFilled } from '@element-plus/icons-vue'

// 接收商户信息
const props = defineProps({
  merchantInfo: {
    type: Object,
    default: () => null
  }
})

// 商户信息
const merchantInfo = computed(() => {
  if (props.merchantInfo) {
    return {
      merchantId: props.merchantInfo.customerId,
      merchantNo: props.merchantInfo.merchantNo,
      signPassword: props.merchantInfo.signKey || 'YOUR_SIGN_KEY_HERE',
      aesPassword: props.merchantInfo.merchantKey || 'YOUR_AES_KEY_HERE',
      ipWhitelist: '39.98.76.22,39.98.76.22',
      balance: '15680.50'
    }
  }
  return {
    merchantId: '10',
    merchantNo: 'M17408123456',
    signPassword: 'YOUR_SIGN_KEY_HERE',
    aesPassword: 'YOUR_AES_KEY_HERE',
    ipWhitelist: '39.98.76.22,39.98.76.22',
    balance: '15680.50'
  }
})

// 产品费率数据
const productRateData = ref([
  {
    productName: '产品A-[10]',
    productCode: 'PD1001',
    rate: '0.9760',
    status: '已开启',
    faceValue: 10,
    productId: 'PD1001'
  },
  {
    productName: '产品A-[20]',
    productCode: 'PD1002',
    rate: '0.9760',
    status: '已开启',
    faceValue: 20,
    productId: 'PD1002'
  },
  {
    productName: '产品A-[30]',
    productCode: 'PD1003',
    rate: '0.9760',
    status: '已开启',
    faceValue: 30,
    productId: 'PD1003'
  },
  {
    productName: '产品B-[50]',
    productCode: 'PD1004',
    rate: '0.9760',
    status: '已开启',
    faceValue: 50,
    productId: 'PD1004'
  },
  {
    productName: '产品B-[100]',
    productCode: 'PD1005',
    rate: '0.9760',
    status: '已开启',
    faceValue: 100,
    productId: 'PD1005'
  },
  {
    productName: '产品B-[200]',
    productCode: 'PD1006',
    rate: '0.9760',
    status: '已开启',
    faceValue: 200,
    productId: 'PD1006'
  },
  {
    productName: '产品C-[200]',
    productCode: 'PD1007',
    rate: '0.9760',
    status: '已开启',
    faceValue: 200,
    productId: 'PD1007'
  },
  {
    productName: '产品C-[100]',
    productCode: 'PD1008',
    rate: '0.9760',
    status: '已开启',
    faceValue: 100,
    productId: 'PD1008'
  }
])

// 下载API文档
const handleDownloadApi = () => {
  ElMessage.success('API文档下载中...')
}

// IP白名单设置弹窗
const ipWhitelistDialogVisible = ref(false)
const ipWhitelistForm = reactive({
  ipList: ''
})
const ipWhitelistFormRef = ref()

// 余额详情相关
const showBalanceDetailDialog = ref(false)
const balanceFilterForm = ref({
  flowType: ''
})
const balancePagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 模拟余额详情数据
const balanceDetailData = ref([
  {
    id: 1,
    flowType: '余额调整',
    beforeAmount: '10000.00',
    amount: 5000.00,
    afterAmount: '15000.00',
    operator: '管理员',
    type: '手动调整',
    editTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    flowType: '交易增减',
    beforeAmount: '15000.00',
    amount: 680.50,
    afterAmount: '15680.50',
    operator: '系统',
    type: 'ORD20240115001',
    editTime: '2024-01-15 14:20:00'
  },
  {
    id: 3,
    flowType: '交易增减',
    beforeAmount: '15680.50',
    amount: -200.00,
    afterAmount: '15480.50',
    operator: '系统',
    type: 'ORD20240115002',
    editTime: '2024-01-15 16:45:00'
  },
  {
    id: 4,
    flowType: '余额调整',
    beforeAmount: '15480.50',
    amount: 200.00,
    afterAmount: '15680.50',
    operator: '管理员',
    type: '补偿调整',
    editTime: '2024-01-15 17:10:00'
  }
])

// 筛选后的余额详情数据
const filteredBalanceDetailData = computed(() => {
  let filtered = balanceDetailData.value
  
  if (balanceFilterForm.value.flowType) {
    filtered = filtered.filter(item => item.flowType === balanceFilterForm.value.flowType)
  }
  
  balancePagination.value.total = filtered.length
  
  const start = (balancePagination.value.currentPage - 1) * balancePagination.value.pageSize
  const end = start + balancePagination.value.pageSize
  
  return filtered.slice(start, end)
})

// 设置IP白名单
const handleSettings = () => {
  // 初始化表单数据
  ipWhitelistForm.ipList = merchantInfo.value.ipWhitelist || ''
  ipWhitelistDialogVisible.value = true
}

// 确认设置IP白名单
const handleConfirmIpWhitelist = async () => {
  try {
    await ipWhitelistFormRef.value.validate()
    // 这里可以添加API调用来保存IP白名单
    // await updateIpWhitelist(ipWhitelistForm.ipList)
    
    ElMessage.success('IP白名单设置成功')
    ipWhitelistDialogVisible.value = false
    
    // 更新本地显示的IP白名单
    if (props.merchantInfo) {
      // 如果有props传入，可以emit事件通知父组件更新
    } else {
      // 更新本地数据
      merchantInfo.value.ipWhitelist = ipWhitelistForm.ipList
    }
  } catch (error) {
    console.error('IP白名单设置失败:', error)
  }
}

// 取消设置IP白名单
const handleCancelIpWhitelist = () => {
  ipWhitelistDialogVisible.value = false
  // 重置表单
  ipWhitelistForm.ipList = ''
}

// 余额详情相关方法
const handleCloseBalanceDialog = () => {
  showBalanceDetailDialog.value = false
}

const handleBalanceFilter = () => {
  balancePagination.value.currentPage = 1
}

const resetBalanceFilter = () => {
  balanceFilterForm.value.flowType = ''
  balancePagination.value.currentPage = 1
}

const handleBalanceSizeChange = (size) => {
  balancePagination.value.pageSize = size
  balancePagination.value.currentPage = 1
}

const handleBalanceCurrentChange = (page) => {
  balancePagination.value.currentPage = page
}

// IP白名单表单验证规则
const ipWhitelistRules = {
  ipList: [
    {
      validator: (rule, value, callback) => {
        if (!value || value.trim() === '') {
          callback(new Error('请输入IP地址'))
          return
        }
        
        // 验证IP地址格式
        const ips = value.split(',').map(ip => ip.trim()).filter(ip => ip)
        const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        
        for (let ip of ips) {
          if (!ipRegex.test(ip)) {
            callback(new Error(`IP地址格式不正确: ${ip}`))
            return
          }
        }
        
        callback()
      },
      trigger: 'blur'
    }
  ]
}

// 复制到剪贴板
const copyToClipboard = async (text, fieldName) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${fieldName}已复制到剪贴板`)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success(`${fieldName}已复制到剪贴板`)
  }
}

onMounted(() => {
  // 商户产品管理页面已加载
})
</script>

<style scoped>
.merchant-product-management {
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color-page);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.merchant-info-card {
  margin-bottom: 16px;
}

.merchant-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  min-width: 80px;
}

.value {
  color: var(--el-text-color-regular);
  font-weight: 600;
  margin-right: 8px;
}

.merchant-no {
  color: #909399;
  font-size: 12px;
  margin-right: 12px;
}

.value.masked {
  font-family: monospace;
  letter-spacing: 2px;
}

.value.ip-list {
  color: var(--el-color-warning);
  font-weight: 500;
}

.copy-icon {
  margin-left: 8px;
  cursor: pointer;
  color: var(--el-color-primary);
  font-size: 16px;
  transition: color 0.3s;
}

.copy-icon:hover {
  color: var(--el-color-primary-light-3);
}

.el-tag {
  margin-left: 8px;
}

.notice-section {
  background-color: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-number {
  color: var(--el-color-danger);
  margin-right: 8px;
  font-weight: 500;
}

.notice-text {
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.product-rate-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.product-rate-card .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.product-rate-card .el-table {
  flex: 1;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.product-name {
  color: var(--el-color-danger);
  font-weight: 500;
}

.rate-value {
  color: var(--el-color-danger);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

/* IP白名单弹窗样式 */
.form-tip {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-tip .el-icon {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹窗内表单样式优化 */
.el-dialog .el-form-item__label {
  font-weight: 500;
  color: #303133;
}

.el-dialog .el-textarea__inner {
  resize: vertical;
  min-height: 120px;
}

/* 余额相关样式 */
.balance-amount {
  font-weight: bold;
  color: #409eff;
  font-size: 16px;
  margin-right: 12px;
}

.filter-container {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.positive-amount {
  color: #67c23a;
}

.negative-amount {
  color: #f56c6c;
}
</style>