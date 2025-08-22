<template>
  <PageContainer
    title="角色管理"
    description="管理系统角色和权限分配"
  >
    <template #extra>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </template>

    <!-- 搜索表单 -->
    <SearchForm
      :form-items="searchFormItems"
      :model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 角色表格 -->
    <Table
      :data="roleList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :selection="true"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @export="handleExport"
      @refresh="handleRefresh"
    />

    <!-- 角色详情/编辑弹窗 -->
    <Dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :form-items="formItems"
      :form-data="formData"
      :loading="dialogLoading"
      :readonly="dialogMode === 'view'"
      width="800px"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- 权限分配弹窗 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限分配"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedPermissions"
        :default-expand-all="true"
        class="permission-tree"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="permissionLoading" @click="handleSavePermissions">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Table from '@/components/Table/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import { formatDate } from '@/utils'

// 响应式数据
const loading = ref(false)
const roleList = ref([])
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogMode = ref('add') // add, edit, view
const selectedRole = ref(null)
const permissionDialogVisible = ref(false)
const permissionLoading = ref(false)
const permissionTreeRef = ref(null)
const permissionTree = ref([])
const checkedPermissions = ref([])
const currentRoleId = ref('')

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
  status: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 'active',
  sort: 0
})

// 树形控件配置
const treeProps = {
  children: 'children',
  label: 'title'
}

// 搜索表单配置
const searchFormItems = [
  {
    prop: 'name',
    label: '角色名称',
    type: 'input',
    placeholder: '请输入角色名称'
  },
  {
    prop: 'code',
    label: '角色编码',
    type: 'input',
    placeholder: '请输入角色编码'
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]

// 表格列配置
const columns = [
  {
    prop: 'name',
    label: '角色名称',
    minWidth: 120
  },
  {
    prop: 'code',
    label: '角色编码',
    minWidth: 120
  },
  {
    prop: 'description',
    label: '角色描述',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'sort',
    label: '排序',
    width: 80,
    align: 'center'
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    render: (row) => {
      const statusMap = {
        active: { text: '启用', type: 'success' },
        inactive: { text: '禁用', type: 'danger' }
      }
      return h(StatusTag, { status: row.status, statusMap })
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    align: 'center',
    render: (row) => formatDate(row.createTime)
  },
  {
    prop: 'actions',
    label: '操作',
    width: 250,
    align: 'center',
    fixed: 'right',
    render: (row) => [
      {
        text: '权限',
        type: 'primary',
        onClick: () => handlePermission(row)
      }
    ]
  }
]

// 表单配置
const formItems = [
  {
    prop: 'name',
    label: '角色名称',
    type: 'input',
    placeholder: '请输入角色名称',
    rules: [{ required: true, message: '请输入角色名称' }]
  },
  {
    prop: 'code',
    label: '角色编码',
    type: 'input',
    placeholder: '请输入角色编码',
    rules: [
      { required: true, message: '请输入角色编码' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '角色编码只能包含字母、数字和下划线' }
    ]
  },
  {
    prop: 'description',
    label: '角色描述',
    type: 'textarea',
    placeholder: '请输入角色描述',
    rows: 3
  },
  {
    prop: 'sort',
    label: '排序',
    type: 'number',
    placeholder: '请输入排序值',
    min: 0
  },
  {
    prop: 'status',
    label: '状态',
    type: 'radio',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]

// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: '新增角色',
    edit: '编辑角色',
    view: '查看角色'
  }
  return titles[dialogMode.value]
})

// 方法
const getRoleList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockData = [
      {
        id: '1',
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有系统所有权限',
        sort: 1,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '系统管理员',
        code: 'system_admin',
        description: '拥有系统管理权限',
        sort: 2,
        status: 'active',
        createTime: '2024-01-02 10:00:00'
      },
      {
        id: '3',
        name: '业务管理员',
        code: 'business_admin',
        description: '拥有业务管理权限',
        sort: 3,
        status: 'active',
        createTime: '2024-01-03 10:00:00'
      },
      {
        id: '4',
        name: '普通用户',
        code: 'user',
        description: '普通用户权限',
        sort: 4,
        status: 'active',
        createTime: '2024-01-04 10:00:00'
      },
      {
        id: '5',
        name: '访客',
        code: 'guest',
        description: '访客权限',
        sort: 5,
        status: 'inactive',
        createTime: '2024-01-05 10:00:00'
      }
    ]
    
    // 模拟分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size
    roleList.value = mockData.slice(start, end)
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const getPermissionTree = async () => {
  try {
    // 模拟获取权限树
    permissionTree.value = [
      {
        id: '1',
        title: '系统管理',
        children: [
          {
            id: '11',
            title: '用户管理',
            children: [
              { id: '111', title: '查看用户' },
              { id: '112', title: '新增用户' },
              { id: '113', title: '编辑用户' },
              { id: '114', title: '删除用户' }
            ]
          },
          {
            id: '12',
            title: '角色管理',
            children: [
              { id: '121', title: '查看角色' },
              { id: '122', title: '新增角色' },
              { id: '123', title: '编辑角色' },
              { id: '124', title: '删除角色' },
              { id: '125', title: '分配权限' }
            ]
          },
          {
            id: '13',
            title: '菜单管理',
            children: [
              { id: '131', title: '查看菜单' },
              { id: '132', title: '新增菜单' },
              { id: '133', title: '编辑菜单' },
              { id: '134', title: '删除菜单' }
            ]
          }
        ]
      },
      {
        id: '2',
        title: '业务管理',
        children: [
          {
            id: '21',
            title: '订单管理',
            children: [
              { id: '211', title: '查看订单' },
              { id: '212', title: '新增订单' },
              { id: '213', title: '编辑订单' },
              { id: '214', title: '删除订单' },
              { id: '215', title: '导出订单' }
            ]
          }
        ]
      }
    ]
  } catch (error) {
    ElMessage.error('获取权限树失败')
  }
}

const getRolePermissions = async (roleId) => {
  try {
    // 模拟获取角色权限
    const mockPermissions = {
      '1': ['111', '112', '113', '114', '121', '122', '123', '124', '125', '131', '132', '133', '134', '211', '212', '213', '214', '215'],
      '2': ['111', '112', '113', '121', '122', '123', '131', '132', '133', '211', '212', '213'],
      '3': ['211', '212', '213', '214', '215'],
      '4': ['111', '211'],
      '5': ['111']
    }
    return mockPermissions[roleId] || []
  } catch (error) {
    ElMessage.error('获取角色权限失败')
    return []
  }
}

const resetFormData = () => {
  Object.assign(formData, {
    id: '',
    name: '',
    code: '',
    description: '',
    status: 'active',
    sort: 0
  })
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  getRoleList()
}

const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    code: '',
    status: ''
  })
  pagination.current = 1
  getRoleList()
}

const handlePageChange = (page) => {
  pagination.current = page
  getRoleList()
}

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  getRoleList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleAdd = () => {
  dialogMode.value = 'add'
  resetFormData()
  dialogVisible.value = true
}

const handleView = (row) => {
  dialogMode.value = 'view'
  selectedRole.value = row
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  selectedRole.value = row
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟删除请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('删除成功')
    getRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个角色吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟批量删除请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('批量删除成功')
    getRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

const handleRefresh = () => {
  getRoleList()
}

const handlePermission = async (row) => {
  currentRoleId.value = row.id
  await getPermissionTree()
  checkedPermissions.value = await getRolePermissions(row.id)
  permissionDialogVisible.value = true
}

const handleSavePermissions = async () => {
  permissionLoading.value = true
  try {
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
    
    // 模拟保存权限请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限分配失败')
  } finally {
    permissionLoading.value = false
  }
}

const handleConfirm = async () => {
  dialogLoading.value = true
  try {
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const action = dialogMode.value === 'add' ? '新增' : '更新'
    ElMessage.success(`${action}成功`)
    
    dialogVisible.value = false
    getRoleList()
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    dialogLoading.value = false
  }
}

const handleCancel = () => {
  dialogVisible.value = false
  resetFormData()
}

// 生命周期
onMounted(() => {
  getRoleList()
})
</script>

<style scoped>
.permission-tree {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 10px;
}

.dialog-footer {
  text-align: right;
}
</style>