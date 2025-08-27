<template>
  <div class="sub-account-management">
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
          
          <el-form-item label="启用状态：" prop="status">
            <el-select
              v-model="filterForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 168px"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
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
    <el-card shadow="never" class="table-card">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        style="width: 100%; height: calc(100vh - 280px);"
        :height="'calc(100vh - 280px)'"
      >
      <el-table-column prop="accountId" label="账户ID" width="100" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'">
            {{ row.status === 'enabled' ? '已启用' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="200" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
          <el-popconfirm title="确认删除该账户？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
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

    <!-- 新增账户弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增账户"
      width="500px"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch
            v-model="addForm.status"
            active-value="enabled"
            inactive-value="disabled"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑账户弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑账户"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch
            v-model="editForm.status"
            active-value="enabled"
            inactive-value="disabled"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'



// 筛选表单
const filterForm = reactive({
  username: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    accountId: 1,
    username: 'admin',
    status: 'enabled',
    createTime: '1970-01-01 00:00:00'
  },
  {
    accountId: 2,
    username: 'user001',
    status: 'disabled',
    createTime: '2024-01-15 10:30:00'
  },
  {
    accountId: 3,
    username: 'manager',
    status: 'enabled',
    createTime: '2024-02-20 14:20:00'
  }
])

const tableLoading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 新增弹窗
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({
  username: '',
  status: 'enabled'
})

const addFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
}

// 编辑弹窗
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  accountId: null,
  username: '',
  status: 'enabled'
})

const editFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
}

// 筛选操作
function handleSearch() {
  // 执行搜索逻辑
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

function handleReset() {
  Object.assign(filterForm, {
    username: '',
    status: ''
  })
  ElMessage.info('筛选条件已重置')
}

// 表格操作
function handleAdd() {
  Object.assign(addForm, {
    username: '',
    status: 'enabled'
  })
  addDialogVisible.value = true
}

function handleEdit(row) {
  Object.assign(editForm, {
    accountId: row.accountId,
    username: row.username,
    status: row.status
  })
  editDialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(
    `确定要删除账户 "${row.username}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.accountId === row.accountId)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total--
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页操作
function handleSizeChange(size) {
  pagination.pageSize = size
  // 页面大小改变
}

function handleCurrentChange(page) {
  pagination.currentPage = page
  // 当前页改变
}

// 新增确认
function handleAddConfirm() {
  addFormRef.value.validate((valid) => {
    if (valid) {
      const newAccount = {
        accountId: Date.now(),
        username: addForm.username,
        status: addForm.status,
        createTime: new Date().toLocaleString('zh-CN')
      }
      tableData.value.unshift(newAccount)
      pagination.total++
      addDialogVisible.value = false
      ElMessage.success('新增成功')
    }
  })
}

// 编辑确认
function handleEditConfirm() {
  editFormRef.value.validate((valid) => {
    if (valid) {
      const index = tableData.value.findIndex(item => item.accountId === editForm.accountId)
      if (index > -1) {
        tableData.value[index].username = editForm.username
        tableData.value[index].status = editForm.status
        editDialogVisible.value = false
        ElMessage.success('编辑成功')
      }
    }
  })
}

onMounted(() => {
  // 子账户管理页面已加载
})
</script>

<style scoped>
.sub-account-management {
  padding: var(--el-padding-large);
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-container {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-card :deep(.el-card__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
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

/* 表格工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-toolbar .left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-toolbar .right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 分页器样式 */
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  padding: 16px;
  flex-shrink: 0;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button + .el-button {
  margin-left: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--el-margin-small);
}

.action-btn .el-icon {
  font-size: var(--el-font-size-base);
}

.action-btn span {
  font-size: var(--el-font-size-small);
}
</style>