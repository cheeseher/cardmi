<template>
  <div class="operation-log">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" class="multi-line-filter-form">
        <div class="filter-line">
          <el-form-item label="用户名：" prop="username">
            <el-input
              v-model="filterForm.username"
              placeholder="请输入用户名"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="时间范围：" prop="timeRange">
            <el-date-picker
              v-model="filterForm.timeRange"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 300px"
            />
          </el-form-item>
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button plain :icon="Refresh" @click="handleReset">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        style="width: 100%"
      >
        <el-table-column prop="accountId" label="账户ID" width="120" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="operationType" label="操作类型" width="150" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="description" label="操作描述" min-width="200" />
      </el-table>
      
      <!-- 分页器 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
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
import { Search, Refresh } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = reactive({
  username: '',
  timeRange: []
})

// 表格数据
const tableData = ref([
  {
    accountId: 1,
    username: 'admin',
    operationType: '登录系统',
    operationTime: '2025-08-21 09:30:15',
    ipAddress: '192.168.1.100',
    description: '管理员登录后台管理系统'
  },
  {
    accountId: 2,
    username: 'user001',
    operationType: '查看订单',
    operationTime: '2025-08-21 10:15:22',
    ipAddress: '192.168.1.101',
    description: '查看订单列表，筛选条件：状态为已完成'
  },
  {
    accountId: 1,
    username: 'admin',
    operationType: '创建卡密',
    operationTime: '2025-08-21 11:20:45',
    ipAddress: '192.168.1.100',
    description: '批量创建卡密，数量：100张'
  },
  {
    accountId: 3,
    username: 'manager',
    operationType: '编辑用户',
    operationTime: '2025-08-21 14:35:18',
    ipAddress: '192.168.1.102',
    description: '修改用户权限，用户ID：12345'
  },
  {
    accountId: 2,
    username: 'user001',
    operationType: '导出数据',
    operationTime: '2025-08-21 15:42:33',
    ipAddress: '192.168.1.101',
    description: '导出订单数据，时间范围：2025-08-01至2025-08-21'
  }
])

const tableLoading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 5
})

// 筛选操作
function handleSearch() {
  console.log('搜索条件:', filterForm)
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

function handleReset() {
  Object.assign(filterForm, {
    username: '',
    timeRange: []
  })
  ElMessage.info('筛选条件已重置')
}

// 分页操作
function handleSizeChange(size) {
  pagination.pageSize = size
  console.log('每页条数:', size)
}

function handleCurrentChange(page) {
  pagination.currentPage = page
  console.log('当前页:', page)
}

onMounted(() => {
  console.log('操作日志页面已加载')
})
</script>

<style scoped>
.operation-log {
  padding: var(--el-padding-large);
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.filter-container {
  margin-bottom: 16px;
}

/* 筛选区域样式 */
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

/* 分页器样式 */
.pagination-container {
  margin-top: var(--el-margin-large);
  display: flex;
  justify-content: flex-end;
}
</style>