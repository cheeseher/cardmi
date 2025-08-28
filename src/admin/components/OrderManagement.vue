<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
          <el-form-item label="订单号：" prop="orderNo">
            <el-input
              v-model="filterForm.orderNo"
              placeholder="请输入订单号"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="产品：" prop="productName">
            <el-select
              v-model="filterForm.productName"
              placeholder="请选择产品"
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="item in productOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="交易状态：" prop="transactionStatus">
            <el-select
              v-model="filterForm.transactionStatus"
              placeholder="请选择交易状态"
              clearable
              style="width: 168px"
            >
              <el-option label="处理成功" value="success" />
              <el-option label="处理中" value="processing" />
              <el-option label="处理失败" value="failed" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="核销状态：" prop="verificationStatus">
            <el-select
              v-model="filterForm.verificationStatus"
              placeholder="请选择核销状态"
              clearable
              style="width: 168px"
            >
              <el-option label="已核销" value="verified" />
              <el-option label="未核销" value="unverified" />
              <el-option label="已锁定" value="locked" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="商户号：" prop="merchantCode">
            <el-input
              v-model="filterForm.merchantCode"
              placeholder="请输入商户号"
              clearable
              style="width: 168px"
            />
          </el-form-item>
        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
          <el-form-item label="提卡时间：" prop="withdrawalTime">
            <el-date-picker
              v-model="filterForm.withdrawalTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 350px"
            />
          </el-form-item>
          
          <el-form-item label="商户单号：" prop="merchantOrderNo">
            <el-input
              v-model="filterForm.merchantOrderNo"
              placeholder="请输入商户单号"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="系统单号：" prop="systemOrderNo">
            <el-input
              v-model="filterForm.systemOrderNo"
              placeholder="请输入系统单号"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="商户名称：" prop="merchantName">
            <el-input
              v-model="filterForm.merchantName"
              placeholder="请输入商户名称"
              clearable
              style="width: 168px"
            />
          </el-form-item>
        </div>
        
        <!-- 第三行筛选项 -->
        <div class="filter-line">
          <el-form-item label="面值：" prop="faceValue">
            <el-select
              v-model="filterForm.faceValue"
              placeholder="请选择面值"
              clearable
              style="width: 168px"
            >
              <el-option label="10元" value="10" />
              <el-option label="20元" value="20" />
              <el-option label="30元" value="30" />
              <el-option label="50元" value="50" />
              <el-option label="100元" value="100" />
            </el-select>
          </el-form-item>
        </div>
        
        <!-- 第四行筛选项 -->
        <div class="filter-line">
          <el-form-item label="卡号：" prop="cardNo">
            <el-input
              v-model="filterForm.cardNo"
              type="textarea"
              placeholder="请输入卡号，多个卡号请换行分隔"
              :rows="3"
              :autosize="{ minRows: 3, maxRows: 6 }"
              style="width: 300px"
            />
          </el-form-item>
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" @click="handleFilter" :loading="searchLoading">查询</el-button>
            <el-button plain @click="resetFilter">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button 
            type="primary" 
            :disabled="!canLockSelected"
            @click="handleLockCard"
          >
            锁卡 ({{ lockableCount }})
          </el-button>
          <el-button 
            type="warning" 
            :disabled="!canUnlockSelected"
            @click="handleUnlockCard"
          >
            解锁 ({{ unlockableCount }})
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        style="margin-top: 16px; width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="orderNo" label="订单号" min-width="180">
          <template #default="{ row }">
            <div class="order-info">
              <div class="order-id">{{ row.orderNo }}</div>
              <div class="system-id">{{ row.systemId }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="merchantInfo" label="商户信息" min-width="200">
          <template #default="{ row }">
            <div class="merchant-info">
              <div class="merchant-id">{{ row.merchantId }}</div>
              <div class="merchant-code">{{ row.merchantCode }}</div>
              <div class="merchant-name">{{ row.merchantName }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="productName" label="产品" min-width="150">
          <template #default="{ row, $index }">
            <span>产品{{ String.fromCharCode(65 + $index) }}-[{{ row.faceValue }}]</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="cardInfo" label="卡密" min-width="200">
          <template #default="{ row }">
            <div class="card-info">
              <div class="card-number">{{ row.cardNumber }}</div>
              <div class="card-password">{{ row.cardPassword }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="transactionAmount" label="交易金额" min-width="100">
          <template #default="{ row }">
            ¥{{ row.transactionAmount }}
          </template>
        </el-table-column>
        
        <el-table-column prop="transactionQuantity" label="交易数量" min-width="100" />
        
        <el-table-column prop="transactionStatus" label="交易状态" min-width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getTransactionStatusType(row.transactionStatus)"
              size="small"
            >
              {{ getTransactionStatusText(row.transactionStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="withdrawalTime" label="提卡时间" min-width="160" />
        
        <el-table-column prop="verificationStatus" label="核销状态" min-width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getVerificationStatusType(row.verificationStatus)"
              size="small"
            >
              {{ getVerificationStatusText(row.verificationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="锁卡开关" min-width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-switch
              :model-value="row.verificationStatus === 'locked'"
              :disabled="row.verificationStatus === 'verified'"
              @change="(value) => handleSwitchChange(row, value)"
              active-text=""
              inactive-text=""
              :active-color="row.verificationStatus === 'verified' ? '#C0C4CC' : '#13CE66'"
              :inactive-color="row.verificationStatus === 'verified' ? '#C0C4CC' : '#DCDFE6'"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="withdrawalTimestamp" label="核销时间" min-width="180">
          <template #default="{ row }">
            {{ formatTimestamp(row.withdrawalTimestamp) }}
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 响应式数据
const tableLoading = ref(false)
const searchLoading = ref(false)
const selectedRows = ref([])

// 筛选表单
const filterForm = reactive({
  orderNo: '',
  productName: '',
  transactionStatus: '',
  verificationStatus: '',
  withdrawalTime: [],
  merchantOrderNo: '',
  systemOrderNo: '',
  faceValue: '',
  cardNo: '',
  merchantCode: '',
  merchantName: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 计算属性
const canLockSelected = computed(() => {
  return selectedRows.value.some(row => row.verificationStatus !== 'verified' && row.verificationStatus !== 'locked')
})

const canUnlockSelected = computed(() => {
  return selectedRows.value.some(row => row.verificationStatus === 'locked')
})

const lockableCount = computed(() => {
  return selectedRows.value.filter(row => row.verificationStatus !== 'verified' && row.verificationStatus !== 'locked').length
})

const unlockableCount = computed(() => {
  return selectedRows.value.filter(row => row.verificationStatus === 'locked').length
})

// 产品选项数据
const productOptions = ref([
  { label: '产品A', value: '产品A' },
  { label: '产品B', value: '产品B' },
  { label: '产品C', value: '产品C' },
  { label: '产品D', value: '产品D' }
])

// 表格数据
const tableData = ref([])

// 更新分页总数
pagination.total = tableData.value.length

// 辅助函数
const getTransactionStatusType = (status) => {
  const statusMap = {
    'success': 'success',
    'processing': 'warning',
    'failed': 'danger'
  }
  return statusMap[status] || 'info'
}

const getTransactionStatusText = (status) => {
  const statusMap = {
    'success': '处理成功',
    'processing': '处理中',
    'failed': '处理失败'
  }
  return statusMap[status] || '未知状态'
}

const getVerificationStatusType = (status) => {
  const statusMap = {
    'verified': 'success',
    'unverified': 'warning',
    'locked': 'danger'
  }
  return statusMap[status] || 'info'
}

const getVerificationStatusText = (status) => {
  const statusMap = {
    'verified': '已核销',
    'unverified': '未核销',
    'locked': '已锁定'
  }
  return statusMap[status] || '未知状态'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

// 数据加载
const loadTableData = async () => {
  try {
    tableLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据筛选
    let filteredData = mockTableData
    
    // 多卡号筛选
    if (filterForm.cardNo && filterForm.cardNo.trim()) {
      const cardNumbers = filterForm.cardNo
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      if (cardNumbers.length > 0) {
        filteredData = filteredData.filter(item => 
          cardNumbers.some(cardNo => 
            item.cardNumber && item.cardNumber.includes(cardNo)
          )
        )
      }
    }
    
    // 其他筛选条件
    if (filterForm.orderNo) {
      filteredData = filteredData.filter(item => 
        item.orderNo && item.orderNo.includes(filterForm.orderNo)
      )
    }
    
    if (filterForm.productName) {
      filteredData = filteredData.filter(item => 
        item.productName && item.productName.includes(filterForm.productName)
      )
    }
    
    if (filterForm.transactionStatus) {
      filteredData = filteredData.filter(item => 
        item.transactionStatus === filterForm.transactionStatus
      )
    }
    
    if (filterForm.verificationStatus) {
      filteredData = filteredData.filter(item => 
        item.verificationStatus === filterForm.verificationStatus
      )
    }
    
    if (filterForm.merchantOrderNo) {
      filteredData = filteredData.filter(item => 
        item.merchantOrderNo && item.merchantOrderNo.includes(filterForm.merchantOrderNo)
      )
    }
    
    if (filterForm.systemOrderNo) {
      filteredData = filteredData.filter(item => 
        item.systemId && item.systemId.includes(filterForm.systemOrderNo)
      )
    }
    
    if (filterForm.faceValue) {
      filteredData = filteredData.filter(item => 
        item.faceValue && item.faceValue.toString().includes(filterForm.faceValue)
      )
    }
    
    if (filterForm.merchantCode) {
      filteredData = filteredData.filter(item => 
        item.merchantCode && item.merchantCode.includes(filterForm.merchantCode)
      )
    }
    
    if (filterForm.merchantName) {
      filteredData = filteredData.filter(item => 
        item.merchantName && item.merchantName.includes(filterForm.merchantName)
      )
    }
    
    // 分页处理
    pagination.total = filteredData.length
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    tableLoading.value = false
  }
}

// 方法
const handleFilter = async () => {
  pagination.currentPage = 1
  await loadTableData()
}

const resetFilter = () => {
  Object.assign(filterForm, {
    orderNo: '',
    productName: '',
    transactionStatus: '',
    verificationStatus: '',
    withdrawalTime: [],
    merchantOrderNo: '',
    systemOrderNo: '',
    faceValue: '',
    cardNo: ''
  })
  pagination.currentPage = 1
  loadTableData()
}

const handleRefresh = async () => {
  await loadTableData()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleSwitchChange = async (row, value) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    row.verificationStatus = value ? 'locked' : 'unverified'
    ElMessage.success(value ? '锁卡成功' : '解锁成功')
  } catch (error) {
    // 恢复开关状态
    ElMessage.error(value ? '锁卡失败' : '解锁失败')
  }
}

const handleLockCard = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要锁卡的记录')
    return
  }
  
  const lockableRows = selectedRows.value.filter(row => row.verificationStatus !== 'verified' && row.verificationStatus !== 'locked')
  if (lockableRows.length === 0) {
    ElMessage.warning('选中的记录中没有可锁卡的项目')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要锁定选中的 ${lockableRows.length} 张卡吗？`,
      '批量锁卡确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    lockableRows.forEach(row => {
      row.verificationStatus = 'locked'
    })
    
    ElMessage.success(`成功锁定 ${lockableRows.length} 张卡`)
    selectedRows.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量锁卡失败')
    }
  }
}

const handleUnlockCard = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要解锁的记录')
    return
  }
  
  const unlockableRows = selectedRows.value.filter(row => row.verificationStatus === 'locked')
  if (unlockableRows.length === 0) {
    ElMessage.warning('选中的记录中没有可解锁的项目')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要解锁选中的 ${unlockableRows.length} 张卡吗？`,
      '批量解锁确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    unlockableRows.forEach(row => {
      row.verificationStatus = 'unverified'
    })
    
    ElMessage.success(`成功解锁 ${unlockableRows.length} 张卡`)
    selectedRows.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量解锁失败')
    }
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadTableData()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadTableData()
}

// 模拟数据
const mockTableData = [
  {
    id: 1,
    orderNo: 'ORD20241201001',
    systemId: 'SYS001',
    productName: '产品A',
    cardNumber: '1234-5678-9012-3456',
    cardPassword: 'ABC123DEF456',
    transactionAmount: 100.00,
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2024-12-01 10:30:00',
    verificationStatus: 'verified',
    withdrawalTimestamp: 1733025000,
    faceValue: 100,
    merchantOrderNo: 'MERCH001',
    systemOrderNo: 'SYS001',
    merchantId: 'M001',
    merchantCode: 'MC001',
    merchantName: '阿里巴巴'
  },
  {
    id: 2,
    orderNo: 'ORD20241201002',
    systemId: 'SYS002',
    productName: '产品B',
    cardNumber: '9876-5432-1098-7654',
    cardPassword: 'XYZ789GHI012',
    transactionAmount: 50.00,
    transactionQuantity: 1,
    transactionStatus: 'processing',
    withdrawalTime: '2024-12-01 11:15:00',
    verificationStatus: 'unverified',
    withdrawalTimestamp: 1733027700,
    faceValue: 50,
    merchantOrderNo: 'MERCH002',
    systemOrderNo: 'SYS002',
    merchantId: 'M002',
    merchantCode: 'MC002',
    merchantName: '腾讯科技'
  },
  {
    id: 3,
    orderNo: 'ORD20241201003',
    systemId: 'SYS003',
    productName: '产品C',
    cardNumber: '1111-2222-3333-4444',
    cardPassword: 'DEF456GHI789',
    transactionAmount: 30.00,
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2024-12-01 12:00:00',
    verificationStatus: 'locked',
    withdrawalTimestamp: 1733030400,
    faceValue: 30,
    merchantOrderNo: 'MERCH003',
    systemOrderNo: 'SYS003',
    merchantId: 'M003',
    merchantCode: 'MC003',
    merchantName: '字节跳动'
  },
  {
    id: 4,
    orderNo: 'ORD20241201004',
    systemId: 'SYS004',
    productName: '产品D',
    cardNumber: '5555-6666-7777-8888',
    cardPassword: 'JKL012MNO345',
    transactionAmount: 20.00,
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2024-12-01 13:30:00',
    verificationStatus: 'unverified',
    withdrawalTimestamp: 1733035800,
    faceValue: 20,
    merchantOrderNo: 'MERCH004',
    systemOrderNo: 'SYS004',
    merchantId: 'M004',
    merchantCode: 'MC004',
    merchantName: '美团科技'
  }
]

// 组件挂载时加载数据
onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.withdrawal-records {
  padding: 20px;
}

.filter-container {
  margin-bottom: 16px;
}

.multi-line-filter-form .filter-line {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.multi-line-filter-form .filter-line:last-child {
  margin-bottom: 0;
  justify-content: flex-start;
}

.multi-line-filter-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.filter-buttons {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.filter-buttons .el-button + .el-button {
  margin-left: 12px;
}

.table-container {
  background: #fff;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
}

.table-toolbar .left {
  display: flex;
  gap: 12px;
}

.table-toolbar .right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding: 16px;
}

.status-tag {
  font-weight: 500;
}

.amount-text {
  font-weight: 600;
  color: #409eff;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

.card-numbers-textarea {
  resize: vertical;
  min-height: 80px;
}

.lock-switch {
  display: flex;
  justify-content: center;
}

/* 时间戳信息样式 */
.timestamp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timestamp-value {
  font-size: 12px;
  color: #909399;
  font-family: 'Courier New', monospace;
}

.timestamp-readable {
  font-size: 13px;
  color: #606266;
}

/* 订单信息样式 */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-weight: 500;
  color: #303133;
}

.system-id {
  font-size: 12px;
  color: #909399;
}

.merchant-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.merchant-id {
  font-weight: 500;
  color: #303133;
  font-size: 12px;
}

.merchant-code {
  font-size: 12px;
  color: #606266;
}

.merchant-name {
  font-size: 12px;
  color: #909399;
}

/* 卡片信息样式 */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #303133;
}

.card-password {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #909399;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .filter-container {
    padding: 12px;
  }
  
  .multi-line-filter-form .filter-line {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .multi-line-filter-form .el-form-item {
    margin-right: 0;
    margin-bottom: 12px;
    width: 100%;
  }
  
  .filter-buttons {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }
  
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
  }
  
  .table-toolbar .left,
  .table-toolbar .right {
    width: 100%;
  }
}

.customer-info {
  line-height: 1.4;
}

.customer-id {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.customer-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>