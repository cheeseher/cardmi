<template>
  <div class="page-container">
    <!-- 筛选区 -->
    <el-card class="filter-container" shadow="never">
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
            <el-input
              v-model="filterForm.productName"
              placeholder="请输入产品名称"
              clearable
              style="width: 168px"
            />
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
        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
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
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button plain @click="resetFilter">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>
    
    <!-- 表格区 -->
    <el-card class="table-container" shadow="never">
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="left">
          <el-button type="primary" @click="handleExport">导出记录</el-button>
          <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
            批量删除 ({{ selectedRows.length }})
          </el-button>
        </div>
        <div class="right">
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table 
        :data="tableData" 
        border 
        stripe
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        style="margin-top: 16px"
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
        
        <el-table-column prop="productName" label="产品" min-width="150" />
        
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
        
        <el-table-column prop="withdrawalTimestamp" label="提卡时间戳" min-width="180">
          <template #default="{ row }">
            <div class="timestamp-info">
              <div class="timestamp-value">{{ row.withdrawalTimestamp }}</div>
              <div class="timestamp-readable">{{ formatTimestamp(row.withdrawalTimestamp) }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link :icon="View" @click="handleView(row)">查看详情</el-button>
            <el-button 
              link 
              type="primary" 
              :icon="Edit" 
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
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
import { View, Edit, Refresh } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = reactive({
  orderNo: '',
  productName: '',
  transactionStatus: '',
  verificationStatus: '',
  withdrawalTime: []
})

// 表格数据
const tableData = ref([])
const tableLoading = ref(false)
const selectedRows = ref([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 模拟表格数据
const mockTableData = [
  {
    id: 1,
    orderNo: 'B1720300348648058428',
    systemId: '2024073651326773609',
    productName: '联通充值卡 【10元】',
    cardNumber: '626816800002319902',
    cardPassword: '••••••••1020',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2025-06-27 21:16:26',
    verificationStatus: 'verified',
    withdrawalTimestamp: '1719504986000'
  },
  {
    id: 2,
    orderNo: 'B1720300379060721406',
    systemId: '2024073651326907464',
    productName: '移动充值卡 【20元】',
    cardNumber: '654688700000616170',
    cardPassword: '••••••••9934',
    transactionAmount: '19.52',
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2025-06-27 21:16:19',
    verificationStatus: 'unverified',
    withdrawalTimestamp: '1719504979000'
  },
  {
    id: 3,
    orderNo: 'B1720300352624312456',
    systemId: '2024073651327704814',
    productName: '电信充值卡 【30元】',
    cardNumber: '654683000137951548',
    cardPassword: '••••••••7823',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'processing',
    withdrawalTime: '2025-06-27 21:15:52',
    verificationStatus: 'locked',
    withdrawalTimestamp: '1719504952000'
  },
  {
    id: 4,
    orderNo: 'B1720300342476025715',
    systemId: '2024073651326876567',
    productName: '联通充值卡 【20元】',
    cardNumber: '626816800002319903',
    cardPassword: '••••••••2031',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'failed',
    withdrawalTime: '2025-06-27 21:14:54',
    verificationStatus: 'unverified',
    withdrawalTimestamp: '1719504894000'
  },
  {
    id: 5,
    orderNo: 'B1720300348367603714',
    systemId: 'V1720300316764341412',
    productName: '移动充值卡 【20元】',
    cardNumber: '654688700000616171',
    cardPassword: '••••••••4567',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2025-06-27 21:14:48',
    verificationStatus: 'verified',
    withdrawalTimestamp: '1719504888000'
  }
]

// 获取交易状态类型
const getTransactionStatusType = (status) => {
  const statusMap = {
    success: 'success',
    processing: 'warning',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取交易状态文本
const getTransactionStatusText = (status) => {
  const statusMap = {
    success: '处理成功',
    processing: '处理中',
    failed: '处理失败'
  }
  return statusMap[status] || '未知状态'
}

// 获取核销状态类型
const getVerificationStatusType = (status) => {
  const statusMap = {
    verified: 'success',
    unverified: 'warning',
    locked: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取核销状态文本
const getVerificationStatusText = (status) => {
  const statusMap = {
    verified: '已核销',
    unverified: '未核销',
    locked: '已锁定'
  }
  return statusMap[status] || '未知状态'
}

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(parseInt(timestamp))
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 加载表格数据
const loadTableData = async () => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = mockTableData
    pagination.total = mockTableData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    tableLoading.value = false
  }
}

// 筛选查询
const handleFilter = () => {
  // 执行筛选逻辑
  loadTableData()
}

// 重置筛选
const resetFilter = () => {
  Object.keys(filterForm).forEach(key => {
    if (Array.isArray(filterForm[key])) {
      filterForm[key] = []
    } else {
      filterForm[key] = ''
    }
  })
  loadTableData()
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 导出记录
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedRows.value.length} 条记录？`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadTableData()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 刷新数据
const handleRefresh = () => {
  loadTableData()
}

// 查看详情
const handleView = (row) => {
  ElMessage.info(`查看订单 ${row.orderNo} 的详情`)
}

// 编辑记录
const handleEdit = (row) => {
  ElMessage.info(`编辑订单 ${row.orderNo}`)
}

// 分页大小变更
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadTableData()
}

// 当前页变更
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadTableData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.page-container {
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

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-toolbar .left {
  display: flex;
  align-items: center;
}

.table-toolbar .left .el-button + .el-button {
  margin-left: 12px;
}

.table-toolbar .right {
  display: flex;
  align-items: center;
}

.order-info {
  line-height: 1.4;
}

.order-id {
  color: #409EFF;
  font-weight: 500;
  font-size: 13px;
}

.system-id {
  color: #67C23A;
  font-size: 12px;
  margin-top: 2px;
}

.card-info {
  line-height: 1.4;
}

.card-number {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
}

.card-password {
  color: #909399;
  font-size: 12px;
  margin-top: 2px;
  font-family: monospace;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .filter-line {
    flex-wrap: wrap;
  }
  
  .filter-line > * {
    margin-bottom: 12px;
    width: 100% !important;
  }
  
  .el-form-item {
    margin-right: 0;
  }
  
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .table-toolbar .left,
  .table-toolbar .right {
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .table-toolbar .right {
    margin-bottom: 0;
  }
}
</style>