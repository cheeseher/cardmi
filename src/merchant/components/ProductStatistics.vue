<template>
  <div class="page-container">
    <!-- 筛选区 -->
    <el-card class="filter-container" shadow="never">
      <el-form :model="filterForm" inline class="multi-line-filter-form">
        <div class="filter-line">
          <el-form-item label="日期时间：" prop="dateRange">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 350px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleToday">今天</el-button>
            <el-button @click="handleYesterday">昨天</el-button>
            <el-button @click="handleLast7Days">最近7天</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 统计表格 -->
    <el-card shadow="never" class="table-card">
      <div class="card-header">
        <h3>产品统计</h3>
      </div>
      
      <el-table 
        :data="statisticsData" 
        border 
        stripe
        v-loading="tableLoading"
        class="statistics-table"
      >
        <el-table-column prop="date" label="统计日期" min-width="120" align="center" />
        <el-table-column prop="totalCount" label="总笔数" min-width="100" align="center">
          <template #default="{ row }">
            <span class="count-text">{{ row.totalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" min-width="120" align="center">
          <template #default="{ row }">
            <span class="amount-text">{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="成功笔数" min-width="100" align="center">
          <template #default="{ row }">
            <span class="success-text">{{ row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="successAmount" label="成功金额" min-width="120" align="center">
          <template #default="{ row }">
            <span class="success-amount-text">{{ row.successAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realSuccessCount" label="实际成功笔数" min-width="120" align="center">
          <template #default="{ row }">
            <span class="real-success-text">{{ row.realSuccessCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realSuccessAmount" label="实际成功金额" min-width="120" align="center">
          <template #default="{ row }">
            <span class="real-success-amount-text">{{ row.realSuccessAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="失败笔数" min-width="100" align="center">
          <template #default="{ row }">
            <span class="fail-text">{{ row.failCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failAmount" label="失败金额" min-width="120" align="center">
          <template #default="{ row }">
            <span class="fail-amount-text">{{ row.failAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="processingCount" label="处理中笔数" min-width="120" align="center">
          <template #default="{ row }">
            <span class="processing-text">{{ row.processingCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="processingAmount" label="处理中金额" min-width="120" align="center">
          <template #default="{ row }">
            <span class="processing-amount-text">{{ row.processingAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 筛选表单
const filterForm = reactive({
  dateRange: []
})

// 表格数据
const statisticsData = ref([
  {
    date: '2025-08-27',
    totalCount: 913,
    totalAmount: '39330',
    successCount: 913,
    successAmount: '39330',
    realSuccessCount: '38396.0500',
    realSuccessAmount: 0,
    failCount: 0,
    failAmount: 0,
    processingCount: 0,
    processingAmount: 0
  }
])

const tableLoading = ref(false)

// 查询方法
const handleQuery = () => {
  tableLoading.value = true
  // 模拟API调用
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('查询完成')
  }, 1000)
}

// 今天
const handleToday = () => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  
  filterForm.dateRange = [
    startOfDay.toISOString().slice(0, 19).replace('T', ' '),
    endOfDay.toISOString().slice(0, 19).replace('T', ' ')
  ]
  handleQuery()
}

// 昨天
const handleYesterday = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0)
  const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
  
  filterForm.dateRange = [
    startOfDay.toISOString().slice(0, 19).replace('T', ' '),
    endOfDay.toISOString().slice(0, 19).replace('T', ' ')
  ]
  handleQuery()
}

// 最近7天
const handleLast7Days = () => {
  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)
  
  const startOfDay = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0)
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  
  filterForm.dateRange = [
    startOfDay.toISOString().slice(0, 19).replace('T', ' '),
    endOfDay.toISOString().slice(0, 19).replace('T', ' ')
  ]
  handleQuery()
}

// 初始化
onMounted(() => {
  handleToday()
})
</script>

<style scoped>
.page-container {
  padding: 0;
}

.filter-container {
  margin-bottom: 16px;
}

.multi-line-filter-form .filter-line {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.multi-line-filter-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.table-card {
  margin-bottom: 16px;
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

.statistics-table {
  width: 100%;
}

/* 数据样式 */
.count-text {
  color: var(--el-color-success);
  font-weight: 500;
}

.amount-text {
  color: var(--el-color-success);
  font-weight: 500;
}

.success-text {
  color: var(--el-color-success);
  font-weight: 500;
}

.success-amount-text {
  color: var(--el-color-danger);
  font-weight: 500;
}

.real-success-text {
  color: var(--el-color-warning);
  font-weight: 500;
}

.real-success-amount-text {
  color: var(--el-color-warning);
  font-weight: 500;
}

.fail-text {
  color: var(--el-color-info);
  font-weight: 500;
}

.fail-amount-text {
  color: var(--el-color-info);
  font-weight: 500;
}

.processing-text {
  color: var(--el-color-info);
  font-weight: 500;
}

.processing-amount-text {
  color: var(--el-color-info);
  font-weight: 500;
}
</style>