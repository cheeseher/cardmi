<template>
  <div class="page-container">
    <!-- 筛选区 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
          <el-form-item label="用户名：" prop="username">
            <el-input
              v-model="filterForm.username"
              placeholder="请输入用户名"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="邮箱：" prop="email">
            <el-input
              v-model="filterForm.email"
              placeholder="请输入邮箱"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="filterForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
          <el-form-item label="角色：" prop="role">
            <el-select
              v-model="filterForm.role"
              placeholder="请选择角色"
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker
              v-model="filterForm.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </el-form-item>
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button plain @click="resetFilter">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>
    
    <!-- 表格区 -->
    <el-card shadow="never" class="table-container">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="left">
          <el-button type="primary" @click="handleAdd" v-permission="['user:add']">
            新增用户
          </el-button>
          <el-button 
            type="danger" 
            @click="handleBatchDelete" 
            :disabled="selectedUsers.length === 0"
            v-permission="['user:delete']"
          >
            批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            导出数据
          </el-button>
        </div>
        <div class="right">
          <el-button @click="refreshTable">
            刷新
          </el-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)" v-permission="['user:edit']">
              编辑
            </el-button>
            <el-button 
              link 
              :type="row.status === 1 ? 'warning' : 'success'" 
              @click="handleToggleStatus(row)"
              v-permission="['user:edit']"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-popconfirm title="确认删除该用户？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" :icon="Delete" v-permission="['user:delete']">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户详情/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="dialogMode === 'view'" />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" :disabled="dialogMode === 'view'" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="userForm.email" placeholder="请输入邮箱" :disabled="dialogMode === 'view'" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" :disabled="dialogMode === 'view'" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role" required>
          <el-select v-model="userForm.role" placeholder="请选择角色" :disabled="dialogMode === 'view'" style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status" :disabled="dialogMode === 'view'">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="dialogMode !== 'view'">
          <div class="form-buttons">
            <el-button @click="handleDialogClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
              {{ dialogMode === 'add' ? '创建' : '保存' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
const tableLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref('add') // add, edit, view
const dialogTitle = ref('新增用户')
const selectedUsers = ref([])
const userFormRef = ref()

// 筛选表单
const filterForm = reactive({
  username: '',
  email: '',
  status: '',
  role: '',
  createTime: []
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 用户表单
const userForm = reactive({
  id: null,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  role: '',
  status: 1
})

// 表格数据
const tableData = ref([])

// 下拉选项
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '普通用户', value: 'user' }
]

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 获取角色标签类型
const getRoleTagType = (role) => {
  const typeMap = {
    admin: 'danger',
    editor: 'warning',
    user: 'info'
  }
  return typeMap[role] || 'info'
}

// 获取角色标签文本
const getRoleLabel = (role) => {
  const labelMap = {
    admin: '管理员',
    editor: '编辑者',
    user: '普通用户'
  }
  return labelMap[role] || '未知'
}

// 模拟数据
const mockData = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@cardmi.com',
    phone: '13800138000',
    role: 'admin',
    status: 1,
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'editor',
    nickname: '编辑者',
    email: 'editor@cardmi.com',
    phone: '13800138001',
    role: 'editor',
    status: 1,
    createTime: '2024-01-14 09:20:00'
  },
  {
    id: 3,
    username: 'user1',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138002',
    role: 'user',
    status: 0,
    createTime: '2024-01-13 14:15:00'
  },
  {
    id: 4,
    username: 'user2',
    nickname: '李四',
    email: 'lisi@example.com',
    phone: '13800138003',
    role: 'user',
    status: 1,
    createTime: '2024-01-12 16:45:00'
  }
]

// 获取表格数据
const fetchTableData = async () => {
  tableLoading.value = true
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟筛选逻辑
    let filteredData = [...mockData]
    
    if (filterForm.username) {
      filteredData = filteredData.filter(item => 
        item.username.includes(filterForm.username)
      )
    }
    
    if (filterForm.email) {
      filteredData = filteredData.filter(item => 
        item.email.includes(filterForm.email)
      )
    }
    
    if (filterForm.status !== '') {
      filteredData = filteredData.filter(item => 
        item.status === filterForm.status
      )
    }
    
    if (filterForm.role) {
      filteredData = filteredData.filter(item => 
        item.role === filterForm.role
      )
    }
    
    pagination.total = filteredData.length
    
    // 分页处理
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    tableLoading.value = false
  }
}

// 筛选
const handleFilter = () => {
  pagination.currentPage = 1
  fetchTableData()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm, {
    username: '',
    email: '',
    status: '',
    role: '',
    createTime: []
  })
  handleFilter()
}

// 刷新表格
const refreshTable = () => {
  fetchTableData()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchTableData()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchTableData()
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

// 新增用户
const handleAdd = () => {
  dialogMode.value = 'add'
  dialogTitle.value = '新增用户'
  resetUserForm()
  dialogVisible.value = true
}

// 查看用户
const handleView = (row) => {
  dialogMode.value = 'view'
  dialogTitle.value = '查看用户'
  Object.assign(userForm, row)
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogMode.value = 'edit'
  dialogTitle.value = '编辑用户'
  Object.assign(userForm, row)
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    // 模拟删除请求
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success('删除成功')
    fetchTableData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedUsers.value.length} 个用户？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 模拟批量删除请求
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success('批量删除成功')
      fetchTableData()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

// 切换状态
const handleToggleStatus = async (row) => {
  try {
    // 模拟状态切换请求
    await new Promise(resolve => setTimeout(resolve, 300))
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    const valid = await userFormRef.value.validate()
    if (!valid) return
    
    submitLoading.value = true
    
    // 模拟提交请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success(dialogMode.value === 'add' ? '创建成功' : '保存成功')
    dialogVisible.value = false
    fetchTableData()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
  resetUserForm()
}

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    id: null,
    username: '',
    nickname: '',
    email: '',
    phone: '',
    role: '',
    status: 1
  })
  userFormRef.value?.clearValidate()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTableData()
})
</script>