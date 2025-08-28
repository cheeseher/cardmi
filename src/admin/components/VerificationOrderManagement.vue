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
          
          <el-form-item label="产品：" prop="product">
            <el-select
              v-model="filterForm.product"
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

        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
          <el-form-item label="订单面值：" prop="orderValue">
            <el-select
              v-model="filterForm.orderValue"
              placeholder="请选择订单面值"
              clearable
              style="width: 168px"
            >
              <el-option label="10元" value="10" />
              <el-option label="20元" value="20" />
              <el-option label="50元" value="50" />
              <el-option label="100元" value="100" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="卡号：" prop="cardNo">
            <el-input
              v-model="filterForm.cardNo"
              placeholder="请输入卡号"
              clearable
              style="width: 220px"
            />
          </el-form-item>
        </div>
        
        <!-- 第三行筛选项 -->
        <div class="filter-line">
          <el-form-item label="下单时间：" prop="orderTime">
            <el-date-picker
              v-model="filterForm.orderTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 350px"
            />
          </el-form-item>
          
          <el-form-item label="核销时间：" prop="verificationTime">
            <el-date-picker
              v-model="filterForm.verificationTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 350px"
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
      >
        <el-table-column prop="orderNo" label="订单号" min-width="180">
          <template #default="{ row }">
            {{ row.orderNo }}
          </template>
        </el-table-column>
        

        
        <el-table-column prop="productName" label="产品" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <div class="product-name">{{ row.productName }}</div>
              <div class="product-code">编码：{{ row.productCode }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="orderValue" label="订单面值" min-width="100">
          <template #default="{ row }">
            ¥{{ row.orderValue }}
          </template>
        </el-table-column>
        
        <el-table-column prop="verificationStatus" label="核销状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getVerificationStatusType(row.verificationStatus)">
              {{ getVerificationStatusText(row.verificationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="cardInfo" label="卡密信息" min-width="200">
          <template #default="{ row }">
            <div class="card-info">
              <div class="card-number">{{ row.cardNumber }}</div>
              <div class="card-password">{{ row.cardPassword }}</div>
            </div>
          </template>
        </el-table-column>
        

        
        <el-table-column prop="timeInfo" label="时间" min-width="200">
          <template #default="{ row }">
            <div class="time-info">
              <div class="order-time">下单：{{ row.orderTime }}</div>
              <div class="verification-time">核销：{{ getVerificationTimeDisplay(row) }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <!-- 未核销状态显示核销按钮 -->
            <el-button 
              v-if="row.verificationStatus === 'unverified'"
              link 
              type="primary" 
              @click="handleVerify(row)"
            >
              核销
            </el-button>
            <!-- 已核销状态显示核销日志按钮 -->
            <el-button 
              v-else-if="row.verificationStatus === 'verified'"
              link 
              type="info" 
              @click="handleVerificationLog(row)"
            >
              核销日志
            </el-button>
            <!-- 已锁定状态操作列为空 -->
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

// 响应式数据
const tableLoading = ref(false)
const searchLoading = ref(false)

// 筛选表单
const filterForm = reactive({
  orderNo: '',
  product: '',
  orderValue: '',
  cardNo: '',
  orderTime: [],
  verificationTime: []
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    orderNo: 'SF20241201001',
    productName: '产品A-[100]',
    productCode: 'PROD_A_100',
    orderValue: 100,
    cardNumber: '1234-5678-9012-3456',
    cardPassword: 'ABC123DEF456',
    orderTime: '2024-12-01 10:30:00',
    verificationTime: '2024-12-01 11:00:00',
    verificationStatus: 'verified'
  },
  {
    id: 2,
    orderNo: 'SF20241201002',
    productName: '产品A-[50]',
    productCode: 'PROD_A_50',
    orderValue: 50,
    cardNumber: '9876-5432-1098-7654',
    cardPassword: 'XYZ789GHI012',
    orderTime: '2024-12-01 11:15:00',
    verificationTime: null,
    verificationStatus: 'unverified'
  },
  {
    id: 3,
    orderNo: 'SF20241201003',
    productName: '产品A-[20]',
    productCode: 'PROD_A_20',
    orderValue: 20,
    cardNumber: '5555-4444-3333-2222',
    cardPassword: 'DEF456GHI789',
    orderTime: '2024-12-01 12:00:00',
    verificationTime: null,
    verificationStatus: 'locked'
  },
  {
    id: 4,
    orderNo: 'SF20241201004',
    productName: '产品A-[200]',
    productCode: 'PROD_A_200',
    orderValue: 200,
    cardNumber: '1111-2222-3333-4444',
    cardPassword: 'MNO345PQR678',
    orderTime: '2024-12-01 13:00:00',
    verificationTime: '2024-12-01 13:45:00',
    verificationStatus: 'verified'
  }
])

// 更新分页总数
pagination.total = tableData.value.length

// 事件处理函数
const handleFilter = () => {
  searchLoading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    searchLoading.value = false
    ElMessage.success('查询完成')
  }, 1000)
}

// 产品选项数据
const productOptions = [
  { label: '产品A', value: '产品A' },
  { label: '产品B', value: '产品B' },
  { label: '产品C', value: '产品C' },
  { label: '产品D', value: '产品D' }
]

const resetFilter = () => {
  Object.keys(filterForm).forEach(key => {
    if (Array.isArray(filterForm[key])) {
      filterForm[key] = []
    } else {
      filterForm[key] = ''
    }
  })
  ElMessage.info('筛选条件已重置')
}

const handleRefresh = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}



// 核销订单
const handleVerify = async (row) => {
  try {
    await ElMessageBox.confirm(
      '是否人工确定核销此卡密？',
      '核销确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 更新订单状态为已核销
    const orderIndex = tableData.value.findIndex(item => item.id === row.id)
    if (orderIndex !== -1) {
      tableData.value[orderIndex].verificationStatus = 'verified'
      tableData.value[orderIndex].verificationTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-')
    }
    
    ElMessage.success('核销成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('核销失败')
    }
  }
}

// 查看核销日志
const handleVerificationLog = (row) => {
  ElMessage.info(`查看核销日志：${row.orderNo}`)
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
}

// 核销状态相关函数
const getVerificationStatusText = (status) => {
  const statusMap = {
    'verified': '已核销',
    'unverified': '未核销',
    'locked': '已锁定'
  }
  return statusMap[status] || '未知状态'
}

const getVerificationStatusType = (status) => {
  const typeMap = {
    'verified': 'success',
    'unverified': 'warning',
    'locked': 'danger'
  }
  return typeMap[status] || 'info'
}

// 核销时间显示逻辑
const getVerificationTimeDisplay = (row) => {
  // 如果订单状态为"未核销"或"已锁定"时，显示为空
  if (row.verificationStatus === 'unverified' || row.verificationStatus === 'locked') {
    return ''
  }
  // 其他状态显示实际核销时间
  return row.verificationTime || ''
}

// 组件挂载时加载数据
onMounted(() => {
  // 初始化数据加载
})
</script>

<style scoped>
.page-container {
  padding: 0;
}

.filter-container {
  margin-bottom: 16px;
  padding: 16px 20px;
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

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.toolbar-right {
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

/* 客户信息样式 */
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

/* 产品信息样式 */
.product-info {
  line-height: 1.4;
}

.product-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
  font-weight: 500;
}

.product-code {
  font-size: 12px;
  color: var(--el-text-color-secondary);
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

/* 时间信息样式 */
.time-info {
  line-height: 1.4;
}

.order-time {
  font-size: 12px;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.verification-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
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
  
  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }
}
</style>