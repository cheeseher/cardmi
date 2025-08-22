<template>
  <div class="table-actions">
    <!-- 查看按钮 -->
    <el-button 
      v-if="showView"
      link 
      :icon="View" 
      @click="$emit('view', row)"
      :disabled="disabled"
    >
      查看
    </el-button>
    
    <!-- 编辑按钮 -->
    <el-button 
      v-if="showEdit"
      link 
      type="primary" 
      :icon="Edit" 
      @click="$emit('edit', row)"
      :disabled="disabled"
    >
      编辑
    </el-button>
    
    <!-- 自定义操作按钮 -->
    <slot :row="row" />
    
    <!-- 删除按钮 -->
    <el-popconfirm 
      v-if="showDelete"
      :title="deleteConfirmText" 
      @confirm="$emit('delete', row)"
      confirm-button-text="确定"
      cancel-button-text="取消"
    >
      <template #reference>
        <el-button 
          link 
          type="danger" 
          :icon="Delete"
          :disabled="disabled"
        >
          删除
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
import { View, Edit, Delete } from '@element-plus/icons-vue'

// 表格操作列组件 - 提供标准的操作按钮布局
defineProps({
  row: {
    type: Object,
    required: true
  },
  showView: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  deleteConfirmText: {
    type: String,
    default: '确认删除该条数据？'
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.table-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.table-actions :deep(.el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .table-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  
  .table-actions :deep(.el-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>