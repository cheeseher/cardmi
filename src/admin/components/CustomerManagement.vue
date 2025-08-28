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
              placeholder="请输入客户昵称"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          
          <el-form-item label="邮箱：" prop="customerEmail">
            <el-input
              v-model="filterForm.customerEmail"
              placeholder="请输入客户邮箱"
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
              style="width: 140px"
            >
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="注册时间：" prop="registerTimeRange">
            <el-date-picker
              v-model="filterForm.registerTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
          
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" @click="handleFilter">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button plain @click="resetFilter">
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
        <el-table-column prop="customerId" label="客户ID" width="100" show-overflow-tooltip />
        <el-table-column prop="merchantNo" label="商户号" width="160" show-overflow-tooltip />
        <el-table-column prop="merchantKey" label="商户密钥" width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: monospace; font-size: 12px;">{{ row.merchantKey }}</span>
              <el-button type="primary" link size="small" @click="copyMerchantKey(row.merchantKey)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户昵称" width="140" show-overflow-tooltip />
        <el-table-column prop="customerEmail" label="客户邮箱" width="200" show-overflow-tooltip />
        <el-table-column prop="balance" label="余额" width="120" sortable align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-primary); font-weight: 500;">¥{{ parseFloat(row.balance).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商户后台" width="110" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleMerchantBackend(row)">
              <el-icon><Link /></el-icon>
              进入后台
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="160" sortable />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(command) => handleDropdownCommand(command, row)">
              <el-button text type="primary" style="font-size: 14px;">
                操作
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="adjustBalance">
                    <el-icon><Edit /></el-icon>
                    余额操作
                  </el-dropdown-item>
                  <el-dropdown-item command="balance">
                    <el-icon><Money /></el-icon>
                    余额详情
                  </el-dropdown-item>
                  <el-dropdown-item command="productConfig">
                    <el-icon><Setting /></el-icon>
                    产品配置
                  </el-dropdown-item>
                  <el-dropdown-item command="resetKey">
                    <el-icon><Refresh /></el-icon>
                    重置密钥
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon><Delete /></el-icon>
                    <span style="color: var(--el-color-danger)">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
      title="编辑客户信息"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="edit-customer-content">
        <!-- 基本信息表单 -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="客户ID">
            <el-input
              v-model="editForm.customerId"
              disabled
              style="background-color: var(--el-fill-color-light);"
            />
          </el-form-item>
          <el-form-item label="商户号">
            <el-input
              v-model="editForm.merchantNo"
              disabled
              style="background-color: var(--el-fill-color-light);"
            />
          </el-form-item>
          <el-form-item label="密钥">
            <el-input
              v-model="editForm.merchantKey"
              disabled
              style="background-color: var(--el-fill-color-light);"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="客户昵称" prop="customerName">
            <el-input
              v-model="editForm.customerName"
              placeholder="请输入客户昵称"
              clearable
              :prefix-icon="Edit"
            />
          </el-form-item>
          <el-form-item label="客户邮箱" prop="customerEmail">
            <el-input
              v-model="editForm.customerEmail"
              placeholder="请输入客户邮箱"
              clearable
              type="email"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="editForm.status"
              active-text="启用"
              inactive-text="禁用"
              active-value="active"
              inactive-value="inactive"
              style="--el-switch-on-color: var(--el-color-primary); --el-switch-off-color: var(--el-color-info)"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm" :loading="editLoading">
            保存修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 余额详情弹窗 -->
    <el-dialog
      v-model="balanceDetailVisible"
      title="余额详情"
      width="900px"
    >
      <el-table :data="balanceDetailData" border stripe>
        <el-table-column prop="operator" label="操作人" width="120" />
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

    <!-- 产品配置抽屉 -->
    <el-drawer
      v-model="productConfigVisible"
      title="产品配置"
      direction="rtl"
      size="60%"
      :before-close="handleProductConfigClose"
    >
      <div class="product-config-content">
        <div class="customer-info">
          <h4>客户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户ID">{{ currentCustomer.customerId }}</el-descriptions-item>
            <el-descriptions-item label="客户昵称">{{ currentCustomer.customerName }}</el-descriptions-item>
            <el-descriptions-item label="商户号">{{ currentCustomer.merchantNo }}</el-descriptions-item>
            <el-descriptions-item label="客户邮箱">{{ currentCustomer.customerEmail }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="product-config-section">
          <div class="section-header">
            <h4>卡密产品配置</h4>
            <el-button type="primary" :icon="Plus" @click="handleAddProduct">
              新增产品
            </el-button>
          </div>
          <el-table
            :data="productConfigData"
            border
            stripe
            style="width: 100%"
            v-loading="productConfigLoading"
          >
            <el-table-column prop="productCode" label="产品编码" width="120" />
            <el-table-column prop="productName" label="产品名称" min-width="150" />
            <el-table-column prop="faceValue" label="面值" width="100" align="right">
              <template #default="{ row }">
                <span>¥{{ parseFloat(row.faceValue).toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column label="折扣比例" width="150" align="center">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.discountRate"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  :precision="2"
                  size="small"
                  style="width: 120px"
                  @change="handleDiscountChange(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="扣款价格" width="120" align="right">
              <template #default="{ row }">
                <span style="color: var(--el-color-primary); font-weight: 500;">
                  ¥{{ (parseFloat(row.faceValue) * row.discountRate).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template #default="{ row, $index }">
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handleRemoveProduct($index)"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="handleProductConfigClose">取消</el-button>
          <el-button type="primary" @click="handleProductConfigSave" :loading="saveLoading">
            保存配置
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 产品选择对话框 -->
    <el-dialog
      v-model="productSelectVisible"
      title="选择产品"
      width="500px"
      :before-close="handleProductSelectClose"
    >
      <div class="product-select-content">
        <el-form label-width="80px">
          <el-form-item label="选择产品：">
            <el-select
              v-model="selectedProductIds"
              multiple
              filterable
              placeholder="请选择产品"
              style="width: 100%"
              :loading="productListLoading"
            >
              <el-option
                v-for="product in availableProducts"
                :key="product.productId"
                :label="`${product.productName} - ¥${product.faceValue}`"
                :value="product.productId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleProductSelectClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="confirmProductSelection"
            :disabled="selectedProductIds.length === 0"
          >
            确认选择 ({{ selectedProductIds.length }})
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Refresh, 
  Plus, 
  Delete, 
  Download, 
  Upload,
  Edit,
  CopyDocument,
  Money,
  Link,
  ArrowDown,
  Setting
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
const editLoading = ref(false)
const editForm = reactive({
  customerId: '',
  customerName: '',
  customerEmail: '',
  balance: '',
  merchantNo: '',
  merchantKey: '',
  status: 'active'
})

const editFormRules = {
  customerName: [{ required: true, message: '请输入客户昵称', trigger: 'blur' }],
  customerEmail: [{ required: true, message: '请输入客户邮箱', trigger: 'blur' }]
}

// 余额详情弹窗
const balanceDetailVisible = ref(false)
const balanceDetailData = ref([
  {
    operator: 'admin',
    editTime: '2025-02-25 14:32:33',
    amount: -0.1,
    type: '余额增加或余额扣减'
  },
  {
    operator: 'manager',
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

// 产品配置抽屉相关
const productConfigVisible = ref(false)
const productConfigLoading = ref(false)
const saveLoading = ref(false)
const currentCustomer = ref({})
const productConfigData = ref([
  {
    id: 1,
    productCode: 'CARD001',
    productName: '产品A-[100]',
    faceValue: '100.00',
    discountRate: 0.95
  },
  {
    id: 2,
    productCode: 'CARD002', 
    productName: '产品B-[50]',
    faceValue: '50.00',
    discountRate: 0.90
  },
  {
    id: 3,
    productCode: 'CARD003',
    productName: '产品C-[200]',
    faceValue: '200.00',
    discountRate: 0.88
  }
])

// 产品选择模态窗口相关
const productSelectVisible = ref(false)
const selectedProductIds = ref([])
const availableProducts = ref([])
const productListLoading = ref(false)





// 方法
const handleSearch = async () => {
  searchLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    // 执行搜索逻辑
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
    
    // 执行批量删除逻辑
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

// 商户后台入口处理函数
const handleMerchantBackend = (row) => {
  // 使用路由导航到商户后台，传递商户信息参数
  const merchantParams = new URLSearchParams({
    merchantNo: row.merchantNo,
    merchantKey: row.merchantKey,
    customerName: row.customerName,
    customerId: row.customerId
  })
  
  // 在新标签页中打开商户后台
  window.open(`/merchant?${merchantParams.toString()}`, '_blank')
  
  ElMessage.success(`正在进入 ${row.customerName} 的商户后台系统`)
}

// 生成商户号的函数
const generateMerchantNo = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  addForm.merchantNo = `M${timestamp.slice(-8)}${random}`
}

// 生成商户密钥的函数
const generateMerchantKey = () => {
  const prefix = 'merchant_key_'
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
    // 新增客户成功
    ElMessage.success('新增客户成功')
    addDialogVisible.value = false
  } catch (error) {
    // 表单验证失败
  }
}

const handleEditCustomer = (row) => {
  editDialogVisible.value = true
  Object.assign(editForm, {
    customerId: row.customerId,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    balance: row.balance,
    merchantNo: row.merchantNo,
    merchantKey: row.merchantKey,
    status: row.status || 'active'
  })
}

const handleEditConfirm = async () => {
  try {
    await editFormRef.value.validate()
    editLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 编辑客户成功
    ElMessage.success('客户信息修改成功')
    editDialogVisible.value = false
  } catch (error) {
    if (error !== false) { // 不是表单验证失败
      ElMessage.error('修改失败，请重试')
    }
  } finally {
    editLoading.value = false
  }
}

const handleResetKey = (row) => {
  ElMessageBox.confirm(
    `确认重置客户 "${row.customerName}" 的密钥吗？重置后原密钥将失效。`,
    '重置密钥确认',
    {
      confirmButtonText: '确认重置',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 生成新密钥
    const newKey = generateMerchantKey()
    
    // 这里应该调用重置密钥API
    console.log('重置密钥:', { customerId: row.customerId, newKey })
    
    // 显示新密钥
    ElMessageBox.alert(
      `新密钥已生成，请妥善保管：\n${newKey}`,
      '密钥重置成功',
      {
        confirmButtonText: '我已保存',
        type: 'success',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }
    ).then(() => {
      // 刷新表格数据
      handleRefresh()
    })
    
    ElMessage.success('密钥重置成功')
  }).catch(() => {
    ElMessage.info('已取消重置')
  })
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
    // 删除客户
    ElMessage.success('删除成功')
  })
}

// 处理下拉菜单命令
const handleDropdownCommand = (command, row) => {
  switch (command) {
    case 'edit':
      handleEditCustomer(row)
      break
    case 'productConfig':
      handleProductConfig(row)
      break
    case 'balance':
      handleViewBalance(row)
      break
    case 'adjustBalance':
       handleAdjustBalance(row)
       break
    case 'resetKey':
      handleResetKey(row)
      break
    case 'delete':
      handleDeleteCustomer(row)
      break
    default:
      break
  }
}

// 处理产品配置
const handleProductConfig = (row) => {
  currentCustomer.value = {
    customerId: row.customerId,
    customerName: row.customerName,
    merchantNo: row.merchantNo,
    customerEmail: row.customerEmail
  }
  productConfigVisible.value = true
  // 模拟加载产品配置数据
  loadProductConfig(row.customerId)
}

// 加载产品配置数据
const loadProductConfig = async (customerId) => {
  productConfigLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 这里应该根据customerId加载对应的产品配置
    console.log('加载客户产品配置:', customerId)
  } catch (error) {
    ElMessage.error('加载产品配置失败')
  } finally {
    productConfigLoading.value = false
  }
}

// 处理折扣变化
const handleDiscountChange = (row) => {
  console.log('折扣变化:', row.productCode, row.discountRate)
}

// 新增产品配置 - 打开产品选择模态窗口
const handleAddProduct = async () => {
  productSelectVisible.value = true
  // 初始化可用产品数据
  await initAvailableProducts()
  // 清空已选产品
  selectedProductIds.value = []
}

// 初始化可用产品数据（从卡密产品管理页面获取）
const initAvailableProducts = async () => {
  productListLoading.value = true
  try {
    // 模拟从卡密产品管理页面获取的产品数据
    // 实际项目中应该调用API获取CardManagement页面的产品数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockProducts = [
      { productId: 'PD1001', productName: '产品A-[10]', faceValue: '10' },
      { productId: 'PD1002', productName: '产品B-[20]', faceValue: '20' },
      { productId: 'PD1003', productName: '产品C-[50]', faceValue: '50' },
      { productId: 'PD1004', productName: '产品D-[20]', faceValue: '20' },
      { productId: 'PD1005', productName: '产品E-[50]', faceValue: '50' }
    ]
    
    availableProducts.value = mockProducts
  } catch (error) {
    ElMessage.error('获取产品数据失败')
  } finally {
    productListLoading.value = false
  }
}

// 删除产品配置
const handleRemoveProduct = (index) => {
  if (productConfigData.value.length <= 1) {
    ElMessage.warning('至少需要保留一个产品配置')
    return
  }
  productConfigData.value.splice(index, 1)
  ElMessage.success('产品配置已删除')
}

// 关闭产品配置抽屉
const handleProductConfigClose = () => {
  productConfigVisible.value = false
  currentCustomer.value = {}
}

// 产品选择相关方法

// 获取分类标签类型


// 关闭产品选择模态窗口
const handleProductSelectClose = () => {
  productSelectVisible.value = false
  selectedProductIds.value = []
}

// 确认产品选择
const confirmProductSelection = () => {
  if (selectedProductIds.value.length === 0) {
    ElMessage.warning('请至少选择一个产品')
    return
  }
  
  // 将选择的产品添加到产品配置数据中
  selectedProductIds.value.forEach(productId => {
    const product = availableProducts.value.find(p => p.productId === productId)
    if (product) {
      const newProductConfig = {
        id: Date.now() + Math.random(), // 使用时间戳+随机数作为临时ID
        productCode: product.productId,
        productName: product.productName,
        faceValue: product.faceValue,
        discountRate: 1.00
      }
      productConfigData.value.push(newProductConfig)
    }
  })
  
  ElMessage.success(`成功添加 ${selectedProductIds.value.length} 个产品配置`)
  
  // 关闭模态窗口
  productSelectVisible.value = false
  selectedProductIds.value = []
}

// 保存产品配置
const handleProductConfigSave = async () => {
  saveLoading.value = true
  try {
    // 模拟保存API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('产品配置保存成功')
    productConfigVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    saveLoading.value = false
  }
}

const handleViewBalance = (row) => {
  balanceDetailVisible.value = true
  // 查看余额详情
}

const handleAdjustBalance = (row) => {
  adjustBalanceVisible.value = true
  currentBalance.value = row ? row.balance : editForm.balance
  adjustType.value = 'increase'
  adjustAmount.value = ''
}

const handleAdjustConfirm = () => {
  // 调整余额逻辑
  ElMessage.success('余额调整成功')
  editForm.balance = resultBalance.value
  adjustBalanceVisible.value = false
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  // 页面大小改变
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
  // 当前页改变
}

// 初始化
onMounted(() => {
  // 客户管理页面已加载
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

/* 编辑客户弹窗样式 */
.edit-customer-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section,
.balance-section {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.section-title .el-icon {
  color: var(--el-color-primary);
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.balance-display .label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.balance-display .amount {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.balance-actions {
  display: flex;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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

.pagination-wrapper {
  margin-top: 16px;
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

/* 产品配置抽屉样式 */
.product-config-content {
  padding: 0 20px;
}

.customer-info {
  margin-bottom: 24px;
}

.customer-info h4 {
  margin-bottom: 16px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.product-config-section h4 {
  margin-bottom: 16px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
}

.amount-positive {
  color: #67c23a;
  font-weight: 500;
}

.amount-negative {
  color: #f56c6c;
  font-weight: 500;
}

/* 下拉菜单响应式样式 */
.el-dropdown {
  width: 100%;
}

.el-dropdown .el-button {
  width: 100%;
  min-width: 80px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .el-dropdown-menu {
    min-width: 120px;
  }
  
  .el-dropdown-menu .el-dropdown-item {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .el-dropdown-menu .el-icon {
    margin-right: 8px;
  }
  
  .product-config-content {
    padding: 0 12px;
  }
  
  .drawer-footer {
    padding: 12px;
  }
}

/* 确保下拉菜单项的图标和文字对齐 */
.el-dropdown-menu .el-dropdown-item {
  display: flex;
  align-items: center;
}

.el-dropdown-menu .el-dropdown-item .el-icon {
  margin-right: 8px;
  font-size: 14px;
}

/* 产品选择模态窗口样式 */
.product-select-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}

.product-select-content {
  .search-filter-section {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 16px;
    
    .search-form {
      margin: 0;
      
      .el-form-item {
        margin-bottom: 0;
        margin-right: 16px;
      }
    }
  }
  
  .selected-products-section {
    margin-bottom: 16px;
    
    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
    
    .selected-products-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      background: #f0f9ff;
      border: 1px dashed var(--el-color-primary);
      border-radius: 6px;
      min-height: 60px;
      align-items: flex-start;
      align-content: flex-start;
      
      .selected-product-tag {
        margin: 0;
      }
    }
  }
  
  .product-list-section {
    .pagination-container {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>