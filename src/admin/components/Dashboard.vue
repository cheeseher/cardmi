<template>
  <div class="dashboard">
    <!-- 总用户余额卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon primary">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥888,888.88</div>
              <div class="stat-label">总用户余额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Money } from '@element-plus/icons-vue'

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






</style>