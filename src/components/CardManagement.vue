<template>
  <div class="card-management">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="卡包ID：" prop="cardId">
          <el-input
            v-model="filterForm.cardId"
            placeholder="请输入卡包ID"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卡包昵称：" prop="cardName">
          <el-input
            v-model="filterForm.cardName"
            placeholder="请输入卡包昵称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户ID：" prop="customerId">
          <el-input
            v-model="filterForm.customerId"
            placeholder="请输入客户ID"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button plain :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <!-- 工具栏 -->
      <div style="margin-bottom: var(--el-component-size); display: flex; justify-content: space-between; align-items: center;">
        <el-space>
          <el-button type="primary" :icon="Plus" @click="handleAddCard">新建卡包</el-button>
        </el-space>
      </div>

      <el-table
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
      >
      <el-table-column prop="cardId" label="卡包ID" width="100" />
      <el-table-column prop="cardName" label="卡包昵称" width="120" />
      <el-table-column prop="customerId" label="客户ID" width="100" />
      <el-table-column prop="productName" label="商品名称" width="120" />
      <el-table-column prop="faceValue" label="面值" width="80">
        <template #default="{ row }">
          <span style="color: var(--el-color-primary); font-weight: 500;">{{ row.faceValue }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣" width="80">
        <template #default="{ row }">
          <span style="color: var(--el-color-success); font-weight: 500;">{{ row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productLink" label="商品链接" min-width="120">
        <template #default="{ row }">
          <span style="color: var(--el-text-color-regular); word-break: break-all;">{{ row.productLink }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="soldCount" label="已售出/总数" width="120">
        <template #default="{ row }">
          <span style="font-weight: 500;">{{ row.soldCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-space>
            <el-button link @click="handleDownload(row)">下载</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页器 -->
    <div style="margin-top: var(--el-component-size); display: flex; justify-content: flex-end;">
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

    <!-- 新建卡包弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新建卡包"
      width="600px"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        label-position="right"
      >
        <!-- 客户信息 -->
        <el-divider content-position="left">客户信息</el-divider>
        <el-form-item label="客户ID" prop="customerId">
          <el-input
            v-model="addForm.customerId"
            placeholder="请输入客户ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户余额">
          <span style="color: var(--el-color-primary); font-weight: 500; font-size: 16px;">¥ {{ customerBalance }}</span>
        </el-form-item>

        <!-- 卡包信息 -->
        <el-divider content-position="left">卡包信息</el-divider>
        <el-form-item label="卡包名称" prop="cardName">
          <el-input
            v-model="addForm.cardName"
            placeholder="请输入卡包名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="addForm.productName"
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品链接" prop="productLink">
          <el-input
            v-model="addForm.productLink"
            type="textarea"
            :rows="3"
            placeholder="请输入商品链接"
          />
        </el-form-item>

        <!-- 商品面值 -->
        <el-divider content-position="left">商品面值</el-divider>
        <el-form-item label="商品面值" prop="faceValue">
          <el-radio-group v-model="addForm.faceValue">
            <el-radio value="10">10元</el-radio>
            <el-radio value="20">20元</el-radio>
            <el-radio value="30">30元</el-radio>
            <el-radio value="50">50元</el-radio>
            <el-radio value="100">100元</el-radio>
            <el-radio value="200">200元</el-radio>
            <el-radio value="300">300元</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="折扣比例" prop="discount">
          <el-input
            v-model="addForm.discount"
            placeholder="请输入折扣比例"
            style="width: 200px"
            clearable
          >
            <template #append>%</template>
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

    <!-- 编辑卡包弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑卡包"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="卡包名称" prop="cardName">
          <el-input
            v-model="editForm.cardName"
            placeholder="请输入卡包名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="editForm.productName"
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品链接" prop="productLink">
          <el-input
            v-model="editForm.productLink"
            type="textarea"
            :rows="3"
            placeholder="请输入商品链接"
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
import { Search, Refresh, Plus, Download, Edit } from '@element-plus/icons-vue'

// 响应式数据
const tableLoading = ref(false)

// 筛选表单
const filterForm = reactive({
  cardId: '',
  cardName: '',
  customerId: ''
})

// 表格数据
const tableData = ref([
  {
    cardId: 'CB1001',
    cardName: 'test',
    customerId: '1001',
    productName: '电话卡',
    faceValue: '10',
    discount: '1%',
    productLink: 'xxxxxx',
    soldCount: '1 / 1',
    createTime: '2025-02-25 14:32:33'
  },
  {
    cardId: 'CB1002',
    cardName: 'test2',
    customerId: '1002',
    productName: '流量卡',
    faceValue: '10',
    discount: '100%',
    productLink: 'www.baidu.com',
    soldCount: '0 / 100',
    createTime: '2025-02-25 18:08:34'
  },
  {
    cardId: 'CB1003',
    cardName: 'test3',
    customerId: '1003',
    productName: '大王卡',
    faceValue: '10',
    discount: '100%',
    productLink: 'www',
    soldCount: '0 / 100',
    createTime: '2025-02-25 18:09:54'
  }
])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 新建卡包弹窗
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({
  customerId: '',
  cardName: '',
  productName: '',
  productLink: '',
  faceValue: '10',
  discount: ''
})

const addFormRules = {
  customerId: [{ required: true, message: '请输入客户ID', trigger: 'blur' }],
  cardName: [{ required: true, message: '请输入卡包名称', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  productLink: [{ required: true, message: '请输入商品链接', trigger: 'blur' }],
  faceValue: [{ required: true, message: '请选择商品面值', trigger: 'change' }]
}

// 编辑卡包弹窗
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  cardId: '',
  cardName: '',
  productName: '',
  productLink: ''
})

const editFormRules = {
  cardName: [{ required: true, message: '请输入卡包名称', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  productLink: [{ required: true, message: '请输入商品链接', trigger: 'blur' }]
}

// 客户余额
const customerBalance = ref('0.00')

// 方法
const handleSearch = () => {
  console.log('搜索卡包', filterForm)
  // 这里添加搜索逻辑
}

const handleReset = () => {
  Object.assign(filterForm, {
    cardId: '',
    cardName: '',
    customerId: ''
  })
}

const handleAddCard = () => {
  addDialogVisible.value = true
  Object.assign(addForm, {
    customerId: '',
    cardName: '',
    productName: '',
    productLink: '',
    faceValue: '10',
    discount: ''
  })
  customerBalance.value = '0.00'
}

const handleAddConfirm = async () => {
  try {
    await addFormRef.value.validate()
    console.log('新建卡包', addForm)
    ElMessage.success('新建卡包成功')
    addDialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

const handleEdit = (row) => {
  editDialogVisible.value = true
  Object.assign(editForm, {
    cardId: row.cardId,
    cardName: row.cardName,
    productName: row.productName,
    productLink: row.productLink
  })
}

const handleEditConfirm = async () => {
  try {
    await editFormRef.value.validate()
    console.log('编辑卡包', editForm)
    ElMessage.success('编辑卡包成功')
    editDialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

const handleDownload = (row) => {
  console.log('下载卡包', row)
  ElMessage.success('下载成功')
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
  console.log('卡密管理页面已加载')
})
</script>

<style scoped>
.card-management {
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color-page);
}

.filter-container {
  margin-bottom: 16px;
}

.filter-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.filter-form .el-form-item:last-child {
  margin-right: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-btn .el-icon {
  font-size: 14px;
}

.action-btn span {
  font-size: 14px;
}
</style>