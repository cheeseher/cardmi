<template>
  <div class="product-management">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
          <el-form-item label="产品编码：" prop="productId">
            <el-input
              v-model="filterForm.productId"
              placeholder="请输入产品编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="产品名称：" prop="productName">
            <el-input
              v-model="filterForm.productName"
              placeholder="请输入产品名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          

        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
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
          <el-button type="primary" :icon="Plus" @click="handleAddProduct">新建产品</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
      >
      <el-table-column prop="productId" label="产品编码" width="120" />
      <el-table-column prop="productName" label="产品名称" min-width="150">
        <template #default="{ row, $index }">
          <span>产品{{ String.fromCharCode(65 + $index) }}-[{{ row.faceValue }}]</span>
        </template>
      </el-table-column>

      <el-table-column prop="faceValue" label="面值" width="100" align="center">
        <template #default="{ row }">
          <span style="color: var(--el-color-primary); font-weight: 500;">{{ row.faceValue }}元</span>
        </template>
      </el-table-column>


      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="请解绑所有关联此产品的商户后操作" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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

    <!-- 新建产品弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新建产品"
      width="600px"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        label-position="right"
      >
        <!-- 产品信息 -->
        <el-divider content-position="left">产品信息</el-divider>
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="addForm.productName"
            placeholder="请输入产品名称"
            clearable
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

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑产品弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑产品"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="产品编码" prop="productId">
          <el-input
            v-model="editForm.productId"
            placeholder="产品编码"
            readonly
            disabled
          />
        </el-form-item>
        
        <el-form-item label="产品面值" prop="faceValue">
          <el-radio-group v-model="editForm.faceValue">
            <el-radio value="10">10元</el-radio>
            <el-radio value="20">20元</el-radio>
            <el-radio value="30">30元</el-radio>
            <el-radio value="50">50元</el-radio>
            <el-radio value="100">100元</el-radio>
            <el-radio value="200">200元</el-radio>
            <el-radio value="300">300元</el-radio>
          </el-radio-group>
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

// 响应式数据
const tableLoading = ref(false)
const searchLoading = ref(false)

// 筛选表单
const filterForm = reactive({
  productId: '',
  productName: ''
})

// 表格数据
const tableData = ref([
  {
    productId: 'PD1001',
    productName: '电话卡套餐A',
    faceValue: '10',
    productLink: 'xxxxxx',
    soldCount: '1 / 1',
    createTime: '2025-02-25 14:32:33'
  },
  {
    productId: 'PD1002',
    productName: '流量卡套餐B',
    faceValue: '20',
    productLink: 'www.baidu.com',
    soldCount: '0 / 100',
    createTime: '2025-02-25 18:08:34'
  },
  {
    productId: 'PD1003',
    productName: '游戏卡套餐C',
    faceValue: '50',
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

// 新建产品弹窗
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({
  productName: '',
  faceValue: '10'
})

const addFormRules = {
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  faceValue: [{ required: true, message: '请选择商品面值', trigger: 'change' }]
}

// 编辑产品弹窗
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  productId: '',
  productName: '',
  faceValue: '10'
})

const editFormRules = {
  faceValue: [{ required: true, message: '请选择商品面值', trigger: 'change' }]
}



// 方法
const handleSearch = () => {
  // 执行搜索逻辑
  // 这里添加搜索逻辑
}

const handleReset = () => {
  Object.assign(filterForm, {
    productId: '',
    productName: ''
  })
}

const handleAddProduct = () => {
  addDialogVisible.value = true
  Object.assign(addForm, {
    productName: '',
    faceValue: '10'
  })
}

const handleAddConfirm = async () => {
  try {
    await addFormRef.value.validate()
    // 新建产品成功
    ElMessage.success('新建产品成功')
    addDialogVisible.value = false
  } catch (error) {
    // 表单验证失败
  }
}

const handleEdit = (row) => {
  editDialogVisible.value = true
  Object.assign(editForm, {
    productId: row.productId,
    productName: row.productName,
    faceValue: row.faceValue
  })
}

const handleEditConfirm = async () => {
  try {
    await editFormRef.value.validate()
    // 编辑产品成功
    ElMessage.success('编辑产品成功')
    editDialogVisible.value = false
  } catch (error) {
    // 表单验证失败
  }
}



const handleDelete = (row) => {
  // 删除产品
  ElMessage.success('删除成功')
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
  // 产品管理页面已加载
})
</script>

<style scoped>
.product-management {
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color-page);
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 分页器样式 */
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 操作按钮样式 */
.operation-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>