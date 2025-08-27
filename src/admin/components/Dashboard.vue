<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon primary">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
        
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon success">
              <el-icon><CreditCard /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCards }}</div>
              <div class="stat-label">总卡密数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon warning">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon danger">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="日期范围：" prop="dateRange">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        
        <el-form-item label="数据类型：" prop="dataType">
          <el-select
            v-model="filterForm.dataType"
            placeholder="请选择数据类型"
            clearable
            style="width: 168px"
          >
            <el-option label="用户数据" value="users" />
            <el-option label="订单数据" value="orders" />
            <el-option label="收入数据" value="revenue" />
            <el-option label="卡密数据" value="cards" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleQuery" :loading="queryLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button plain @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  User, 
  CreditCard, 
  Document, 
  Money, 
  Search, 
  Refresh
} from '@element-plus/icons-vue'

// 响应式数据
const stats = reactive({
  totalUsers: 1234,
  totalCards: 5678,
  totalOrders: 890,
  totalRevenue: 123456
})

const filterForm = reactive({
  dateRange: [],
  dataType: ''
})

const queryLoading = ref(false)

// 方法
const handleQuery = async () => {
  queryLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('数据查询成功')
    // 执行查询逻辑
  } catch (error) {
    ElMessage.error('查询失败，请重试')
  } finally {
    queryLoading.value = false
  }
}

const handleReset = () => {
  filterForm.dateRange = []
  filterForm.dataType = ''
  ElMessage.info('筛选条件已重置')
}

// 生命周期
onMounted(() => {
  // Dashboard 组件已挂载
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--el-component-size);
  padding: var(--el-padding-large);
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.stats-row {
  margin-bottom: 0;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--el-border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--el-component-size);
  color: var(--el-color-white);
  font-size: 20px;
}

.stat-icon.primary {
  background-color: var(--el-color-primary);
}

.stat-icon.success {
  background-color: var(--el-color-success);
}

.stat-icon.warning {
  background-color: var(--el-color-warning);
}

.stat-icon.danger {
  background-color: var(--el-color-danger);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  margin-top: 4px;
}

.filter-container {
  margin-bottom: 16px;
}

.filter-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.filter-form .el-form-item:last-child {
  margin-right: 0;
}




</style>