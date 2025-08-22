<template>
  <el-card class="filter-container" shadow="never">
    <el-form :model="modelValue" inline class="multi-line-filter-form">
      <slot />
    </el-form>
  </el-card>
</template>

<script setup>
// 筛选区容器组件 - 提供标准的筛选表单布局
defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.filter-container {
  margin-bottom: 16px;
}

.multi-line-filter-form :deep(.filter-line) {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 20px;
}

.multi-line-filter-form :deep(.filter-line:last-child) {
  margin-bottom: 0;
  justify-content: flex-start;
}

.multi-line-filter-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.multi-line-filter-form :deep(.filter-buttons) {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .multi-line-filter-form :deep(.filter-line) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .multi-line-filter-form :deep(.el-form-item) {
    width: 100%;
  }
  
  .multi-line-filter-form :deep(.filter-buttons) {
    margin-left: 0;
    justify-content: center;
    width: 100%;
  }
}
</style>