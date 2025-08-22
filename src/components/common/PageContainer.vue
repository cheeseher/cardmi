<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<script setup>
// 页面容器组件 - 提供标准的页面外边距和背景
</script>

<style scoped>
.page-container {
  padding: var(--el-main-padding, 20px);
  background-color: var(--el-bg-color-page, #f5f7fa);
  min-height: calc(100vh - 60px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .page-container {
    padding: 12px;
  }
}
</style>