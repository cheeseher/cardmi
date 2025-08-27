<template>
  <div class="order-management">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="multi-line-filter-form">
        <div class="filter-line">
          <el-form-item label="订单编号：" prop="orderNumber">
            <el-input
              v-model="filterForm.orderNumber"
              placeholder="请输入订单编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="客户ID：" prop="customerId">
            <el-input
              v-model="filterForm.customerId"
              placeholder="请输入客户ID"
              clearable
              style="width: 168px"
            />
          </el-form-item>
          
          <el-form-item label="客户邮箱：" prop="customerEmail">
            <el-input
              v-model="filterForm.customerEmail"
              placeholder="请输入客户邮箱"
              clearable
              style="width: 200px"
            />
          </el-form-item>
        </div>
        
        <div class="filter-line">
          <el-form-item label="订单状态：" prop="orderStatus">
            <el-select
              v-model="filterForm.orderStatus"
              placeholder="请选择状态"
              clearable
              style="width: 168px"
            >
              <el-option label="全部" value="" />
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="创建时间：" prop="dateRange">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
          
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
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <el-space>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增订单
          </el-button>

        </el-space>
        <el-tooltip content="刷新数据">
          <el-button circle @click="handleRefresh" :loading="tableLoading">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
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
        <el-table-column prop="orderId" label="订单ID" width="90" show-overflow-tooltip />
        <el-table-column prop="orderNumber" label="订单编号" width="160" show-overflow-tooltip />
        <el-table-column prop="customerInfo" label="客户信息" width="180">
          <template #default="{ row }">
            <div class="customer-info">
              <div class="customer-id">ID: {{ row.customerId }}</div>
              <div class="customer-email">{{ row.customerEmail }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" width="120" show-overflow-tooltip />
        <el-table-column prop="orderAmount" label="订单金额" width="110" sortable align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-primary); font-weight: 500;">¥{{ parseFloat(row.orderAmount).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.orderStatus)"
            >
              {{ getStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cardPackage" label="卡包信息" width="120" show-overflow-tooltip />
        <el-table-column prop="createTime" label="下单时间" width="160" sortable />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link :icon="View" @click="handleViewDetail(row)">查看</el-button>
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm 
              title="确认删除该订单？" 
              @confirm="handleDelete(row)"
              confirm-button-text="确定"
              cancel-button-text="取消"
            >
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

    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="700px"
      :before-close="handleCloseDetail"
      destroy-on-close
    >
      <div v-if="currentOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">
            <el-text tag="b">{{ currentOrder.orderId }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="订单编号">
            <el-text tag="b">{{ currentOrder.orderNumber }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="客户ID">
            {{ currentOrder.customerId }}
          </el-descriptions-item>
          <el-descriptions-item label="客户邮箱">
            {{ currentOrder.customerEmail }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ currentOrder.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            <el-text type="primary" size="large" tag="b">¥{{ parseFloat(currentOrder.orderAmount).toLocaleString() }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.orderStatus)" size="large">
              {{ getStatusText(currentOrder.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="卡包信息">
            {{ currentOrder.cardPackage }}
          </el-descriptions-item>
          <el-descriptions-item label="下单时间" :span="2">
            {{ currentOrder.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDetail">关闭</el-button>
          <el-button type="primary" @click="handleEditFromDetail">编辑订单</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑订单弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.orderNumber ? '编辑订单' : '新增订单'"
      width="600px"
      :before-close="handleCloseEdit"
      destroy-on-close
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="订单编号" prop="orderNumber" v-if="editForm.orderNumber">
          <el-input v-model="editForm.orderNumber" disabled />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus" required>
          <el-select v-model="editForm.orderStatus" placeholder="请选择状态" style="width: 100%">
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="editForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseEdit">取消</el-button>
          <el-button type="primary" @click="handleSaveEdit" :loading="saveLoading">
            {{ editForm.orderNumber ? '保存' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Refresh, 
  Plus, 
  Delete, 
  Download, 
  View, 
  Edit 
} from '@element-plus/icons-vue'

// 响应式数据
const tableLoading = ref(false)
const searchLoading = ref(false)
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const saveLoading = ref(false)
const currentOrder = ref(null)
const editFormRef = ref(null)
const selectedRows = ref([])

// 筛选表单
const filterForm = reactive({
  orderNumber: '',
  customerId: '',
  customerEmail: '',
  orderStatus: '',
  orderValue: '',
  cardNumber: '',
  dateRange: []
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 编辑表单
const editForm = reactive({
  orderNumber: '',
  orderStatus: '',
  remark: ''
})

// 表单验证规则
const editRules = {
  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'change' }]
}

// 表格数据
const tableData = ref([
  {
    orderId: '1001',
    orderNumber: 'ORD202502251001',
    customerId: '1001',
    customerEmail: 'user1@example.com',
    productName: '电话卡',
    orderAmount: '10.00',
    orderStatus: 'completed',
    cardPackage: 'test',
    createTime: '2025-02-25 18:30:15'
  },
  {
    orderId: '1002',
    orderNumber: 'ORD202502251002',
    customerId: '1002',
    customerEmail: 'user2@example.com',
    productName: '电话卡',
    orderAmount: '20.00',
    orderStatus: 'paid',
    cardPackage: 'test2',
    createTime: '2025-02-25 18:25:30'
  },
  {
    orderId: '1003',
    orderNumber: 'ORD202502251003',
    customerId: '1003',
    customerEmail: 'user3@example.com',
    productName: '电话卡',
    orderAmount: '50.00',
    orderStatus: 'pending',
    cardPackage: 'test3',
    createTime: '2025-02-25 18:20:45'
  }
])

// 更新分页总数
pagination.total = tableData.value.length

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

// 方法
const handleSearch = async () => {
  searchLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    // 执行查询逻辑
    ElMessage.success('查询成功')
  } catch (error) {
    ElMessage.error('查询失败，请重试')
  } finally {
    searchLoading.value = false
  }
}

const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    if (key === 'dateRange') {
      filterForm[key] = []
    } else {
      filterForm[key] = ''
    }
  })
  ElMessage.info('筛选条件已重置')
}

const handleAdd = () => {
  Object.assign(editForm, {
    orderNumber: '',
    orderStatus: '',
    remark: ''
  })
  editDialogVisible.value = true
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 条订单？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 执行批量删除逻辑
    ElMessage.success(`成功删除 ${selectedRows.value.length} 条订单`)
    selectedRows.value = []
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
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

const handleViewDetail = (row) => {
  currentOrder.value = { ...row }
  detailDialogVisible.value = true
}

const handleEdit = (row) => {
  currentOrder.value = { ...row }
  editForm.orderNumber = row.orderNumber
  editForm.orderStatus = row.orderStatus
  editForm.remark = ''
  editDialogVisible.value = true
}

const handleEditFromDetail = () => {
  if (currentOrder.value) {
    Object.assign(editForm, {
      orderNumber: currentOrder.value.orderNumber,
      orderStatus: currentOrder.value.orderStatus,
      remark: ''
    })
    detailDialogVisible.value = false
    editDialogVisible.value = true
  }
}

const handleDelete = async (row) => {
  try {
    // 删除订单
    ElMessage.success('订单删除成功')
    // 这里可以添加删除逻辑
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  }
}

const handleCloseDetail = () => {
  detailDialogVisible.value = false
  currentOrder.value = null
}

const handleCloseEdit = () => {
  editDialogVisible.value = false
  currentOrder.value = null
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
}

const handleSaveEdit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    saveLoading.value = true
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存订单成功
    editDialogVisible.value = false
    
    const action = editForm.orderNumber ? '更新' : '创建'
    ElMessage.success(`订单${action}成功`)
    
    // 重置表单
    if (editFormRef.value) {
      editFormRef.value.resetFields()
    }
  } catch (error) {
    // 表单验证失败
  } finally {
    saveLoading.value = false
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  handleSearch()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}

// 组件挂载时加载数据
onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.order-management {
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

.customer-info {
  line-height: 1.4;
}

.customer-id {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.customer-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>