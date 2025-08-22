<template>
  <div class="common-table">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="left">
        <slot name="toolbar-left">
          <el-button 
            v-if="showAdd" 
            type="primary" 
            @click="handleAdd"
            v-permission="addPermission"
          >
            <el-icon><Plus /></el-icon>
            {{ addText }}
          </el-button>
          <el-button 
            v-if="showBatchDelete" 
            type="danger" 
            @click="handleBatchDelete" 
            :disabled="selectedRows.length === 0"
            v-permission="deletePermission"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button v-if="showExport" type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </slot>
      </div>
      <div class="right">
        <slot name="toolbar-right">
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </slot>
      </div>
    </div>
    
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :size="size"
      :height="height"
      :max-height="maxHeight"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      v-bind="$attrs"
    >
      <!-- 选择列 -->
      <el-table-column 
        v-if="showSelection" 
        type="selection" 
        width="55" 
        :selectable="selectable"
      />
      
      <!-- 序号列 -->
      <el-table-column 
        v-if="showIndex" 
        type="index" 
        label="序号" 
        width="80" 
        :index="indexMethod"
      />
      
      <!-- 动态列 -->
      <template v-for="column in columns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'left'"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template #default="scope" v-if="column.slot">
            <slot :name="column.slot" :row="scope.row" :column="column" :$index="scope.$index" />
          </template>
          <template #default="scope" v-else-if="column.formatter">
            {{ column.formatter(scope.row, column, scope.row[column.prop], scope.$index) }}
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column 
        v-if="showActions" 
        label="操作" 
        :width="actionsWidth" 
        :fixed="actionsFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index">
            <el-button 
              v-if="showView" 
              link 
              type="primary" 
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              v-if="showEdit" 
              link 
              type="primary" 
              @click="handleEdit(scope.row)"
              v-permission="editPermission"
            >
              编辑
            </el-button>
            <el-popconfirm 
              v-if="showDelete" 
              title="确认删除该记录？" 
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button 
                  link 
                  type="danger" 
                  v-permission="deletePermission"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </slot>
        </template>
      </el-table-column>
      
      <!-- 空数据 -->
      <template #empty>
        <slot name="empty">
          <el-empty description="暂无数据" />
        </slot>
      </template>
    </el-table>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Refresh } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 表格列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 表格样式
  border: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  maxHeight: {
    type: [String, Number],
    default: undefined
  },
  // 功能开关
  showToolbar: {
    type: Boolean,
    default: true
  },
  showSelection: {
    type: Boolean,
    default: true
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  // 工具栏按钮
  showAdd: {
    type: Boolean,
    default: true
  },
  showBatchDelete: {
    type: Boolean,
    default: true
  },
  showExport: {
    type: Boolean,
    default: true
  },
  addText: {
    type: String,
    default: '新增'
  },
  // 操作列按钮
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
  actionsWidth: {
    type: [String, Number],
    default: 200
  },
  actionsFixed: {
    type: String,
    default: 'right'
  },
  // 权限控制
  addPermission: {
    type: [String, Array],
    default: ''
  },
  editPermission: {
    type: [String, Array],
    default: ''
  },
  deletePermission: {
    type: [String, Array],
    default: ''
  },
  // 分页配置
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
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
    default: 'total, sizes, prev, pager, next'
  },
  // 其他配置
  selectable: {
    type: Function,
    default: undefined
  },
  indexMethod: {
    type: Function,
    default: undefined
  }
})

// Emits 定义
const emit = defineEmits([
  'add',
  'edit',
  'delete',
  'view',
  'batch-delete',
  'export',
  'refresh',
  'selection-change',
  'sort-change',
  'row-click',
  'row-dblclick',
  'size-change',
  'current-change',
  'update:currentPage',
  'update:pageSize'
])

// 响应式数据
const tableRef = ref()
const selectedRows = ref([])

// 计算属性
const currentPageModel = computed({
  get: () => props.currentPage,
  set: (value) => emit('update:currentPage', value)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:pageSize', value)
})

// 事件处理
const handleAdd = () => {
  emit('add')
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  emit('delete', row)
}

const handleView = (row) => {
  emit('view', row)
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedRows.value.length} 条记录？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    emit('batch-delete', selectedRows.value)
  })
}

const handleExport = () => {
  emit('export')
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleSortChange = (sortInfo) => {
  emit('sort-change', sortInfo)
}

const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}

const handleRowDblclick = (row, column, event) => {
  emit('row-dblclick', row, column, event)
}

const handleSizeChange = (size) => {
  pageSizeModel.value = size
  emit('size-change', size)
}

const handleCurrentChange = (page) => {
  currentPageModel.value = page
  emit('current-change', page)
}

// 公开方法
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

const toggleRowSelection = (row, selected) => {
  tableRef.value?.toggleRowSelection(row, selected)
}

const toggleAllSelection = () => {
  tableRef.value?.toggleAllSelection()
}

const setCurrentRow = (row) => {
  tableRef.value?.setCurrentRow(row)
}

const clearSort = () => {
  tableRef.value?.clearSort()
}

const doLayout = () => {
  tableRef.value?.doLayout()
}

const sort = (prop, order) => {
  tableRef.value?.sort(prop, order)
}

// 暴露方法给父组件
defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  clearSort,
  doLayout,
  sort,
  selectedRows
})
</script>

<style scoped>
.common-table {
  width: 100%;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.table-toolbar .left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-toolbar .right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .table-toolbar .left,
  .table-toolbar .right {
    justify-content: center;
  }
  
  .pagination-container {
    justify-content: center;
  }
}
</style>