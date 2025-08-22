<template>
  <div class="page-container">
    <!-- 筛选区 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
          <el-form-item label="订单号：" prop="orderNo">
            <el-input
              v-model="filterForm.orderNo"
              placeholder="请输入订单号"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="客户名称：" prop="customerName">
            <el-input
              v-model="filterForm.customerName"
              placeholder="请输入客户名称"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          
          <el-form-item label="订单状态：" prop="status">
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
          <el-form-item label="支付方式：" prop="paymentMethod">
            <el-select
              v-model="filterForm.paymentMethod"
              placeholder="请选择支付方式"
              clearable
              style="width: 168px"
            >
              <el-option
                v-for="item in paymentOptions"
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
          <el-button type="primary" @click="handleAdd" v-permission="['order:add']">
            新增订单
          </el-button>
          <el-button 
            type="danger" 
            @click="handleBatchDelete" 
            :disabled="selectedOrders.length === 0"
            v-permission="['order:delete']"
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
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="customerName" label="客户名称" min-width="120" />
        <el-table-column prop="productName" label="商品名称" min-width="150" />
        <el-table-column prop="quantity" label="数量" width="80" align="center" />
        <el-table-column prop="totalAmount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100">
          <template #default="{ row }">
            <el-tag :type="getPaymentTagType(row.paymentMethod)">{{ getPaymentLabel(row.paymentMethod) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)" v-permission="['order:edit']">
              编辑
            </el-button>
            <el-button 
              link 
              type="warning" 
              @click="handleUpdateStatus(row)"
              v-permission="['order:edit']"
            >
              更新状态
            </el-button>
            <el-popconfirm title="确认删除该订单？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" :icon="Delete" v-permission="['order:delete']">
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
    
    <!-- 订单详情/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="orderFormRef"
        :model="orderForm"
        :rules="orderRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单号" prop="orderNo" required>
              <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" :disabled="dialogMode === 'view'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName" required>
              <el-input v-model="orderForm.customerName" placeholder="请输入客户名称" :disabled="dialogMode === 'view'" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="productName" required>
              <el-input v-model="orderForm.productName" placeholder="请输入商品名称" :disabled="dialogMode === 'view'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="quantity" required>
              <el-input-number 
                v-model="orderForm.quantity" 
                :min="1" 
                :max="9999" 
                :disabled="dialogMode === 'view'"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="unitPrice" required>
              <el-input-number 
                v-model="orderForm.unitPrice" 
                :precision="2" 
                :min="0" 
                :disabled="dialogMode === 'view'"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单金额" prop="totalAmount">
              <el-input 
                :model-value="(orderForm.quantity * orderForm.unitPrice).toFixed(2)" 
                disabled 
                style="width: 100%"
              >
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentMethod" required>
              <el-select v-model="orderForm.paymentMethod" placeholder="请选择支付方式" :disabled="dialogMode === 'view'" style="width: 100%">
                <el-option
                  v-for="item in paymentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态" prop="status">
              <el-select v-model="orderForm.status" placeholder="请选择状态" :disabled="dialogMode === 'view'" style="width: 100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注" prop="remark">
          <el-input 
            v-model="orderForm.remark" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入备注信息" 
            :disabled="dialogMode === 'view'"
          />
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
    
    <!-- 状态更新弹窗 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="更新订单状态"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusTagType(currentOrder.status)">{{ getStatusLabel(currentOrder.status) }}</el-tag>
        </el-form-item>
        <el-form-item label="新状态" required>
          <el-select v-model="newStatus" placeholder="请选择新状态" style="width: 100%">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmStatusUpdate" :loading="statusUpdateLoading">
          确认更新
        </el-button>
      </template>
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
const statusUpdateLoading = ref(false)
const dialogVisible = ref(false)
const statusDialogVisible = ref(false)
const dialogMode = ref('add') // add, edit, view
const dialogTitle = ref('新增订单')
const selectedOrders = ref([])
const orderFormRef = ref()
const currentOrder = ref({})
const newStatus = ref('')

// 筛选表单
const filterForm = reactive({
  orderNo: '',
  customerName: '',
  status: '',
  paymentMethod: '',
  createTime: []
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 订单表单
const orderForm = reactive({
  id: null,
  orderNo: '',
  customerName: '',
  productName: '',
  quantity: 1,
  unitPrice: 0,
  totalAmount: 0,
  paymentMethod: '',
  status: 'pending',
  remark: ''
})

// 表格数据
const tableData = ref([])

// 下拉选项
const statusOptions = [
  { label: '待付款', value: 'pending' },
  { label: '已付款', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

const paymentOptions = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechat' },
  { label: '银行卡', value: 'bank' },
  { label: '现金', value: 'cash' }
]

// 表单验证规则
const orderRules = {
  orderNo: [
    { required: true, message: '请输入订单号', trigger: 'blur' }
  ],
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ],
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const labelMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labelMap[status] || '未知'
}

// 获取支付方式标签类型
const getPaymentTagType = (method) => {
  const typeMap = {
    alipay: 'primary',
    wechat: 'success',
    bank: 'warning',
    cash: 'info'
  }
  return typeMap[method] || 'info'
}

// 获取支付方式标签文本
const getPaymentLabel = (method) => {
  const labelMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡',
    cash: '现金'
  }
  return labelMap[method] || '未知'
}

// 模拟数据
const mockData = [
  {
    id: 1,
    orderNo: 'ORD202401150001',
    customerName: '张三',
    productName: 'iPhone 15 Pro',
    quantity: 1,
    unitPrice: 8999.00,
    totalAmount: 8999.00,
    paymentMethod: 'alipay',
    status: 'completed',
    remark: '客户要求加急处理',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    orderNo: 'ORD202401150002',
    customerName: '李四',
    productName: 'MacBook Pro 14',
    quantity: 1,
    unitPrice: 15999.00,
    totalAmount: 15999.00,
    paymentMethod: 'wechat',
    status: 'shipped',
    remark: '',
    createTime: '2024-01-15 09:20:00'
  },
  {
    id: 3,
    orderNo: 'ORD202401140001',
    customerName: '王五',
    productName: 'iPad Air',
    quantity: 2,
    unitPrice: 4399.00,
    totalAmount: 8798.00,
    paymentMethod: 'bank',
    status: 'paid',
    remark: '需要开发票',
    createTime: '2024-01-14 14:15:00'
  },
  {
    id: 4,
    orderNo: 'ORD202401140002',
    customerName: '赵六',
    productName: 'AirPods Pro',
    quantity: 1,
    unitPrice: 1899.00,
    totalAmount: 1899.00,
    paymentMethod: 'alipay',
    status: 'pending',
    remark: '',
    createTime: '2024-01-14 16:45:00'
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
    
    if (filterForm.orderNo) {
      filteredData = filteredData.filter(item => 
        item.orderNo.includes(filterForm.orderNo)
      )
    }
    
    if (filterForm.customerName) {
      filteredData = filteredData.filter(item => 
        item.customerName.includes(filterForm.customerName)
      )
    }
    
    if (filterForm.status) {
      filteredData = filteredData.filter(item => 
        item.status === filterForm.status
      )
    }
    
    if (filterForm.paymentMethod) {
      filteredData = filteredData.filter(item => 
        item.paymentMethod === filterForm.paymentMethod
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
    orderNo: '',
    customerName: '',
    status: '',
    paymentMethod: '',
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
  selectedOrders.value = selection
}

// 新增订单
const handleAdd = () => {
  dialogMode.value = 'add'
  dialogTitle.value = '新增订单'
  resetOrderForm()
  dialogVisible.value = true
}

// 查看订单
const handleView = (row) => {
  dialogMode.value = 'view'
  dialogTitle.value = '查看订单'
  Object.assign(orderForm, row)
  dialogVisible.value = true
}

// 编辑订单
const handleEdit = (row) => {
  dialogMode.value = 'edit'
  dialogTitle.value = '编辑订单'
  Object.assign(orderForm, row)
  dialogVisible.value = true
}

// 删除订单
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
    `确认删除选中的 ${selectedOrders.value.length} 个订单？`,
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

// 更新状态
const handleUpdateStatus = (row) => {
  currentOrder.value = row
  newStatus.value = row.status
  statusDialogVisible.value = true
}

// 确认状态更新
const handleConfirmStatusUpdate = async () => {
  if (!newStatus.value) {
    ElMessage.warning('请选择新状态')
    return
  }
  
  statusUpdateLoading.value = true
  try {
    // 模拟状态更新请求
    await new Promise(resolve => setTimeout(resolve, 500))
    currentOrder.value.status = newStatus.value
    ElMessage.success('状态更新成功')
    statusDialogVisible.value = false
    fetchTableData()
  } catch (error) {
    ElMessage.error('状态更新失败')
  } finally {
    statusUpdateLoading.value = false
  }
}

// 导出数据
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 提交表单
const handleSubmit = async () => {
  if (!orderFormRef.value) return
  
  try {
    const valid = await orderFormRef.value.validate()
    if (!valid) return
    
    submitLoading.value = true
    
    // 计算总金额
    orderForm.totalAmount = orderForm.quantity * orderForm.unitPrice
    
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
  resetOrderForm()
}

// 重置订单表单
const resetOrderForm = () => {
  Object.assign(orderForm, {
    id: null,
    orderNo: '',
    customerName: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    paymentMethod: '',
    status: 'pending',
    remark: ''
  })
  orderFormRef.value?.clearValidate()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped>
.amount-text {
  font-weight: 600;
  color: var(--el-color-success);
}
</style>