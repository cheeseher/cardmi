<template>
  <el-card class="table-container" shadow="never">
    <!-- 表格工具栏 -->
    <div class="table-toolbar" v-if="$slots.toolbar">
      <slot name="toolbar" />
    </div>
    
    <!-- 表格内容 -->
    <slot />
    
    <!-- 分页器 -->
    <div class="pagination-container" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup>
// 表格容器组件 - 提供标准的表格布局和分页功能
const props = defineProps({
  // 分页相关
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'size-change', 'current-change'])

const handleSizeChange = (size) => {
  emit('update:pageSize', size)
  emit('size-change', size)
}

const handleCurrentChange = (page) => {
  emit('update:currentPage', page)
  emit('current-change', page)
}
</script>

<style scoped>
.table-container {
  background: #fff;
}

/* 表格工具栏 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 0;
}

.table-toolbar :deep(.left) {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-toolbar :deep(.right) {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 分页器 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .table-toolbar :deep(.left),
  .table-toolbar :deep(.right) {
    justify-content: center;
  }
  
  .pagination-container {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .table-toolbar :deep(.left) {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .table-toolbar :deep(.left .el-button) {
    flex: 1;
    min-width: 0;
  }
}
</style>