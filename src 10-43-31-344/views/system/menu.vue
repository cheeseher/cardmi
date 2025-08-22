<template>
  <PageContainer
    title="菜单管理"
    description="管理系统菜单结构和权限配置"
  >
    <template #extra>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增菜单
      </el-button>
    </template>

    <!-- 搜索表单 -->
    <SearchForm
      :form-items="searchFormItems"
      :model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 菜单树表格 -->
    <el-card class="mt-4">
      <el-table
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column prop="title" label="菜单名称" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-icon v-if="row.icon" class="mr-2">
                <component :is="row.icon" />
              </el-icon>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" />
        <el-table-column prop="component" label="组件路径" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="type" label="菜单类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeTag(row.type)">{{ getMenuTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusTag :status="row.status" :status-map="statusMap" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="primary" link size="small" @click="handleAddChild(row)" v-if="row.type !== 'button'">
              添加子菜单
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单详情/编辑弹窗 -->
    <Dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :form-items="formItems"
      :form-data="formData"
      :loading="dialogLoading"
      :readonly="dialogMode === 'view'"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import { formatDate } from '@/utils'

// 响应式数据
const loading = ref(false)
const menuList = ref([])
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogMode = ref('add') // add, edit, view
const selectedMenu = ref(null)

// 搜索表单
const searchForm = reactive({
  title: '',
  status: '',
  type: ''
})

// 表单数据
const formData = reactive({
  id: '',
  parentId: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  type: 'menu',
  status: 'active',
  permission: '',
  hidden: false,
  cache: true,
  affix: false,
  breadcrumb: true
})

// 状态映射
const statusMap = {
  active: { text: '启用', type: 'success' },
  inactive: { text: '禁用', type: 'danger' }
}

// 搜索表单配置
const searchFormItems = [
  {
    prop: 'title',
    label: '菜单名称',
    type: 'input',
    placeholder: '请输入菜单名称'
  },
  {
    prop: 'type',
    label: '菜单类型',
    type: 'select',
    placeholder: '请选择菜单类型',
    options: [
      { label: '目录', value: 'catalog' },
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' }
    ]
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

// 表单配置
const formItems = computed(() => [
  {
    prop: 'parentId',
    label: '上级菜单',
    type: 'tree-select',
    placeholder: '请选择上级菜单',
    data: getMenuTreeData(),
    props: {
      value: 'id',
      label: 'title',
      children: 'children'
    },
    checkStrictly: true
  },
  {
    prop: 'type',
    label: '菜单类型',
    type: 'radio',
    options: [
      { label: '目录', value: 'catalog' },
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' }
    ],
    rules: [{ required: true, message: '请选择菜单类型' }]
  },
  {
    prop: 'title',
    label: '菜单名称',
    type: 'input',
    placeholder: '请输入菜单名称',
    rules: [{ required: true, message: '请输入菜单名称' }]
  },
  {
    prop: 'icon',
    label: '菜单图标',
    type: 'input',
    placeholder: '请输入图标名称',
    show: formData.type !== 'button'
  },
  {
    prop: 'path',
    label: '路由路径',
    type: 'input',
    placeholder: '请输入路由路径',
    show: formData.type !== 'button',
    rules: [{ required: true, message: '请输入路由路径' }]
  },
  {
    prop: 'component',
    label: '组件路径',
    type: 'input',
    placeholder: '请输入组件路径',
    show: formData.type === 'menu'
  },
  {
    prop: 'permission',
    label: '权限标识',
    type: 'input',
    placeholder: '请输入权限标识'
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
  },
  {
    prop: 'hidden',
    label: '是否隐藏',
    type: 'switch',
    activeText: '隐藏',
    inactiveText: '显示'
  },
  {
    prop: 'cache',
    label: '是否缓存',
    type: 'switch',
    activeText: '缓存',
    inactiveText: '不缓存',
    show: formData.type === 'menu'
  },
  {
    prop: 'affix',
    label: '是否固定',
    type: 'switch',
    activeText: '固定',
    inactiveText: '不固定',
    show: formData.type === 'menu'
  },
  {
    prop: 'breadcrumb',
    label: '显示面包屑',
    type: 'switch',
    activeText: '显示',
    inactiveText: '隐藏',
    show: formData.type !== 'button'
  }
])

// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: '新增菜单',
    edit: '编辑菜单',
    view: '查看菜单'
  }
  return titles[dialogMode.value]
})

// 方法
const getMenuList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    menuList.value = [
      {
        id: '1',
        parentId: '',
        title: '系统管理',
        path: '/system',
        component: '',
        icon: 'Setting',
        sort: 1,
        type: 'catalog',
        status: 'active',
        permission: 'system',
        hidden: false,
        cache: true,
        affix: false,
        breadcrumb: true,
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: '11',
            parentId: '1',
            title: '用户管理',
            path: '/system/user',
            component: '@/views/user/index.vue',
            icon: 'User',
            sort: 1,
            type: 'menu',
            status: 'active',
            permission: 'system:user',
            hidden: false,
            cache: true,
            affix: false,
            breadcrumb: true,
            createTime: '2024-01-01 10:00:00',
            children: [
              {
                id: '111',
                parentId: '11',
                title: '新增用户',
                path: '',
                component: '',
                icon: '',
                sort: 1,
                type: 'button',
                status: 'active',
                permission: 'system:user:add',
                hidden: false,
                cache: false,
                affix: false,
                breadcrumb: false,
                createTime: '2024-01-01 10:00:00'
              },
              {
                id: '112',
                parentId: '11',
                title: '编辑用户',
                path: '',
                component: '',
                icon: '',
                sort: 2,
                type: 'button',
                status: 'active',
                permission: 'system:user:edit',
                hidden: false,
                cache: false,
                affix: false,
                breadcrumb: false,
                createTime: '2024-01-01 10:00:00'
              },
              {
                id: '113',
                parentId: '11',
                title: '删除用户',
                path: '',
                component: '',
                icon: '',
                sort: 3,
                type: 'button',
                status: 'active',
                permission: 'system:user:delete',
                hidden: false,
                cache: false,
                affix: false,
                breadcrumb: false,
                createTime: '2024-01-01 10:00:00'
              }
            ]
          },
          {
            id: '12',
            parentId: '1',
            title: '菜单管理',
            path: '/system/menu',
            component: '@/views/system/menu.vue',
            icon: 'Menu',
            sort: 2,
            type: 'menu',
            status: 'active',
            permission: 'system:menu',
            hidden: false,
            cache: true,
            affix: false,
            breadcrumb: true,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: '13',
            parentId: '1',
            title: '系统设置',
            path: '/system/settings',
            component: '@/views/system/index.vue',
            icon: 'Tools',
            sort: 3,
            type: 'menu',
            status: 'active',
            permission: 'system:settings',
            hidden: false,
            cache: true,
            affix: false,
            breadcrumb: true,
            createTime: '2024-01-01 10:00:00'
          }
        ]
      },
      {
        id: '2',
        parentId: '',
        title: '业务管理',
        path: '/business',
        component: '',
        icon: 'Briefcase',
        sort: 2,
        type: 'catalog',
        status: 'active',
        permission: 'business',
        hidden: false,
        cache: true,
        affix: false,
        breadcrumb: true,
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: '21',
            parentId: '2',
            title: '订单管理',
            path: '/business/order',
            component: '@/views/order/index.vue',
            icon: 'Document',
            sort: 1,
            type: 'menu',
            status: 'active',
            permission: 'business:order',
            hidden: false,
            cache: true,
            affix: false,
            breadcrumb: true,
            createTime: '2024-01-01 10:00:00'
          }
        ]
      }
    ]
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

const getMenuTreeData = () => {
  const buildTree = (list, parentId = '') => {
    return list
      .filter(item => item.parentId === parentId && item.type !== 'button')
      .map(item => ({
        ...item,
        children: buildTree(list, item.id)
      }))
  }
  return [{ id: '', title: '根目录', children: buildTree(menuList.value) }]
}

const getMenuTypeText = (type) => {
  const typeMap = {
    catalog: '目录',
    menu: '菜单',
    button: '按钮'
  }
  return typeMap[type] || type
}

const getMenuTypeTag = (type) => {
  const tagMap = {
    catalog: '',
    menu: 'success',
    button: 'warning'
  }
  return tagMap[type] || ''
}

const resetFormData = () => {
  Object.assign(formData, {
    id: '',
    parentId: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    type: 'menu',
    status: 'active',
    permission: '',
    hidden: false,
    cache: true,
    affix: false,
    breadcrumb: true
  })
}

// 事件处理
const handleSearch = () => {
  getMenuList()
}

const handleReset = () => {
  Object.assign(searchForm, {
    title: '',
    status: '',
    type: ''
  })
  getMenuList()
}

const handleAdd = () => {
  dialogMode.value = 'add'
  resetFormData()
  dialogVisible.value = true
}

const handleAddChild = (row) => {
  dialogMode.value = 'add'
  resetFormData()
  formData.parentId = row.id
  dialogVisible.value = true
}

const handleView = (row) => {
  dialogMode.value = 'view'
  selectedMenu.value = row
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  selectedMenu.value = row
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${row.title}" 吗？`,
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
    getMenuList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
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
    getMenuList()
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
  getMenuList()
})
</script>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.mr-2 {
  margin-right: 8px;
}

.mt-4 {
  margin-top: 16px;
}
</style>