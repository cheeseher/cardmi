<template>
  <div class="customer-management">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
          <el-form-item label="客户ID：" prop="customerId">
            <el-input
              v-model="filterForm.customerId"
              placeholder="请输入客户ID"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          
          <el-form-item label="商户号：" prop="merchantNo">
            <el-input
              v-model="filterForm.merchantNo"
              placeholder="请输入商户号"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          
          <el-form-item label="昵称：" prop="customerName">
            <el-input
              v-model="filterForm.customerName"
              placeholder="请输入昵称"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          
          <el-form-item label="邮箱：" prop="customerEmail">
            <el-input
              v-model="filterForm.customerEmail"
              placeholder="请输入邮箱"
              clearable
              style="width: 200px"
            />
          </el-form-item>
        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="filterForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 168px"
            >
              <el-option label="全部" value="" />
              <el-option label="正常" value="active" />
              <el-option label="禁用" value="disabled" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="注册时间：" prop="dateRange">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 280px"
            />
          </el-form-item>
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" @click="handleSearch" :loading="searchLoading">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button plain @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="left">
          <el-button type="primary" @click="handleAddCustomer">
            <el-icon><Plus /></el-icon>
            新增客户
          </el-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="customerId" label="客户ID" min-width="120" show-overflow-tooltip />
        <el-table-column prop="merchantNo" label="商户号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="merchantKey" label="商户密钥" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: monospace; font-size: 12px;">{{ row.merchantKey }}</span>
              <el-button type="primary" link size="small" @click="copyMerchantKey(row.merchantKey)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户昵称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="customerEmail" label="客户邮箱" min-width="220" show-overflow-tooltip />
        <el-table-column prop="balance" label="余额" min-width="120" sortable>
          <template #default="{ row }">
            <span style="color: var(--el-color-primary); font-weight: 500;">¥{{ parseFloat(row.balance).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" min-width="180" sortable />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button link type="primary" @click="handleEditCustomer(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link @click="handleViewBalance(row)">
              <el-icon><Money /></el-icon>
              余额详情
            </el-button>
            <el-popconfirm title="确认删除该客户？" @confirm="handleDeleteCustomer(row)">
              <template #reference>
                <el-button link type="danger">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
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

    <!-- 新增客户弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增客户"
      width="500px"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="商户号" prop="merchantNo">
          <el-input
            v-model="addForm.merchantNo"
            placeholder="系统自动生成"
            readonly
            style="background-color: #ffffff;"
          >
            <template #append>
              <el-button @click="generateMerchantNo" :icon="Refresh" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商户密钥" prop="merchantKey">
          <el-input
            v-model="addForm.merchantKey"
            placeholder="系统自动生成"
            readonly
            style="background-color: #ffffff;"
          >
            <template #append>
              <el-button @click="generateMerchantKey" :icon="Refresh" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户昵称" prop="customerName">
          <el-input
            v-model="addForm.customerName"
            placeholder="请输入客户昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户邮箱" prop="customerEmail">
          <el-input
            v-model="addForm.customerEmail"
            placeholder="请输入客户邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户余额" prop="balance">
          <el-input
            v-model="addForm.balance"
            placeholder="请输入初始余额"
            clearable
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑客户弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑客户"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="客户昵称" prop="customerName">
          <el-input
            v-model="editForm.customerName"
            placeholder="请输入客户昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户邮箱" prop="customerEmail">
          <el-input
            v-model="editForm.customerEmail"
            placeholder="请输入客户邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户余额">
          <div style="display: flex; align-items: center; gap: var(--el-component-size-small);">
            <span style="color: var(--el-color-primary); font-weight: 500;">{{ editForm.balance }}元</span>
            <el-button type="primary" link @click="handleAdjustBalance">
              <el-icon><Edit /></el-icon>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 余额详情弹窗 -->
    <el-dialog
      v-model="balanceDetailVisible"
      title="余额详情"
      width="800px"
    >
      <el-table :data="balanceDetailData" border stripe>
        <el-table-column prop="editTime" label="编辑时间" width="180" />
        <el-table-column prop="amount" label="数额" width="120">
          <template #default="{ row }">
            <span :class="row.amount > 0 ? 'amount-positive' : 'amount-negative'">
              {{ row.amount > 0 ? '+' : '' }}{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="200" />
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="balancePagination.currentPage"
          v-model:page-size="balancePagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="balancePagination.total"
          layout="total, sizes, prev, pager, next"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="balanceDetailVisible = false">取消</el-button>
          <el-button type="primary" @click="balanceDetailVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 余额调整弹窗 -->
    <el-dialog
      v-model="adjustBalanceVisible"
      title="余额调整"
      width="500px"
    >
      <div class="adjust-balance-form">
        <div class="current-balance">
          <span class="label">当前余额:</span>
          <span class="value">{{ currentBalance }}元</span>
        </div>
        <div class="adjust-type">
          <span class="label">余额增减:</span>
          <el-radio-group v-model="adjustType">
            <el-radio value="increase">余额增加</el-radio>
            <el-radio value="decrease">余额减少</el-radio>
          </el-radio-group>
        </div>
        <div class="adjust-amount">
          <span class="label">修改数额:</span>
          <el-input
            v-model="adjustAmount"
            placeholder="请输入"
            style="width: 200px"
            clearable
          >
            <template #append>元</template>
          </el-input>
        </div>
        <div class="result-balance">
          <span class="label">修改后余额:</span>
          <span class="value">{{ resultBalance }}元</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="adjustBalanceVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdjustConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Refresh, 
  Plus, 
  Delete, 
  Download, 
  Upload,
  View, 
  Edit,
  CopyDocument 
} from '@element-plus/icons-vue'

// 响应式数据
const tableLoading = ref(false)
const searchLoading = ref(false)
const selectedRows = ref([])

// 筛选表单
const filterForm = reactive({
  customerId: '',
  merchantNo: '',
  customerName: '',
  customerEmail: '',
  status: '',
  dateRange: []
})

// 表格数据
const tableData = ref([
  {
    customerId: '1001',
    merchantNo: 'M17408123456',
    merchantKey: 'test_key_1234567890abcdef1234567890abcdef',
    customerName: 'asd',
    customerEmail: '123@qq.com',
    balance: '9.900',
    status: 'active',
    registerTime: '2025-02-25 00:28:27'
  },
  {
    customerId: '1002',
    merchantNo: 'M17408234567',
    merchantKey: 'test_key_abcdef1234567890abcdef1234567890',
    customerName: 'aaa',
    customerEmail: '888@gmail.com',
    balance: '0.000',
    status: 'active',
    registerTime: '2025-02-25 17:55:35'
  },
  {
    customerId: '1003',
    merchantNo: 'M17408345678',
    merchantKey: 'test_key_9876543210fedcba9876543210fedcba',
    customerName: 'bbb',
    customerEmail: '999@gmail.com',
    balance: '0.000',
    status: 'disabled',
    registerTime: '2025-02-25 18:09:00'
  }
])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 新增客户弹窗
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({
  merchantNo: '',
  merchantKey: '',
  customerName: '',
  customerEmail: '',
  balance: ''
})

const addFormRules = {
  merchantNo: [{ required: true, message: '商户号不能为空', trigger: 'blur' }],
  merchantKey: [{ required: true, message: '商户密钥不能为空', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户昵称', trigger: 'blur' }],
  customerEmail: [{ required: true, message: '请输入客户邮箱', trigger: 'blur' }]
}

// 编辑客户弹窗
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  customerId: '',
  customerName: '',
  customerEmail: '',
  balance: ''
})

const editFormRules = {
  customerName: [{ required: true, message: '请输入客户昵称', trigger: 'blur' }],
  customerEmail: [{ required: true, message: '请输入客户邮箱', trigger: 'blur' }]
}

// 余额详情弹窗
const balanceDetailVisible = ref(false)
const balanceDetailData = ref([
  {
    editTime: '2025-02-25 14:32:33',
    amount: -0.1,
    type: '后台编辑-生成卡包(CB1001)'
  },
  {
    editTime: '2025-02-25 00:28:27',
    amount: 10,
    type: '新增客户：初始余额'
  }
])

const balancePagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 2
})

// 余额调整弹窗
const adjustBalanceVisible = ref(false)
const currentBalance = ref('9.900')
const adjustType = ref('increase')
const adjustAmount = ref('')

const resultBalance = computed(() => {
  const current = parseFloat(currentBalance.value) || 0
  const adjust = parseFloat(adjustAmount.value) || 0
  if (adjustType.value === 'increase') {
    return (current + adjust).toFixed(3)
  } else {
    return (current - adjust).toFixed(3)
  }
})

// 方法
const handleSearch = async () => {
  searchLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('搜索客户', filterForm)
    ElMessage.success('查询成功')
  } catch (error) {
    ElMessage.error('查询失败，请重试')
  } finally {
    searchLoading.value = false
  }
}

const handleReset = () => {
  Object.assign(filterForm, {
    customerId: '',
    merchantNo: '',
    customerName: '',
    customerEmail: '',
    status: '',
    dateRange: []
  })
  ElMessage.info('筛选条件已重置')
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个客户？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    console.log('批量删除客户', selectedRows.value)
    ElMessage.success(`成功删除 ${selectedRows.value.length} 个客户`)
    selectedRows.value = []
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handleImport = () => {
  ElMessage.info('导入功能开发中...')
}

const handleRefresh = async () => {
  tableLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('数据已刷新')
  } finally {
    tableLoading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleView = (row) => {
  console.log('查看客户详情', row)
  ElMessage.info('查看功能开发中...')
}

// 生成商户号的函数
const generateMerchantNo = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  addForm.merchantNo = `M${timestamp.slice(-8)}${random}`
}

// 生成商户密钥的函数
const generateMerchantKey = () => {
  const prefix = 'test_key_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  addForm.merchantKey = result
}

// 复制商户密钥到剪贴板
const copyMerchantKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key)
    ElMessage.success('商户密钥已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const handleAddCustomer = () => {
  addDialogVisible.value = true
  Object.assign(addForm, {
    merchantNo: '',
    merchantKey: '',
    customerName: '',
    customerEmail: '',
    balance: ''
  })
  // 自动生成商户号和商户密钥
  generateMerchantNo()
  generateMerchantKey()
}

const handleAddConfirm = async () => {
  try {
    await addFormRef.value.validate()
    console.log('新增客户', addForm)
    ElMessage.success('新增客户成功')
    addDialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

const handleEditCustomer = (row) => {
  editDialogVisible.value = true
  Object.assign(editForm, {
    customerId: row.customerId,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    balance: row.balance
  })
}

const handleEditConfirm = async () => {
  try {
    await editFormRef.value.validate()
    console.log('编辑客户', editForm)
    ElMessage.success('编辑客户成功')
    editDialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

const handleDeleteCustomer = (row) => {
  ElMessageBox.confirm(
    `确定要删除客户 ${row.customerName} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除客户', row)
    ElMessage.success('删除成功')
  })
}

const handleViewBalance = (row) => {
  balanceDetailVisible.value = true
  console.log('查看余额详情', row)
}

const handleAdjustBalance = () => {
  adjustBalanceVisible.value = true
  currentBalance.value = editForm.balance
  adjustType.value = 'increase'
  adjustAmount.value = ''
}

const handleAdjustConfirm = () => {
  console.log('调整余额', {
    type: adjustType.value,
    amount: adjustAmount.value,
    result: resultBalance.value
  })
  ElMessage.success('余额调整成功')
  editForm.balance = resultBalance.value
  adjustBalanceVisible.value = false
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  console.log('页面大小改变', size)
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
  console.log('当前页改变', page)
}

// 初始化
onMounted(() => {
  console.log('客户管理页面已加载')
})
</script>

<style scoped>
.customer-management {
  padding: var(--el-padding-large);
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.filter-container {
  margin-bottom: 16px;
}

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

.pagination-container {
  margin-top: var(--el-margin-large);
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.adjust-balance-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adjust-balance-form .label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 12px;
  color: var(--el-text-color-regular);
}

.adjust-balance-form .value {
  color: var(--el-color-primary);
  font-weight: 500;
}

.action-btn {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--el-component-size-small);
}

.action-btn .el-icon {
  font-size: 24px;
}

.action-btn span {
  font-size: 12px;
}
</style>