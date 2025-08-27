<template>
  <div class="card-query">


    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="卡密：" prop="cardSecret">
          <el-input
            v-model="filterForm.cardSecret"
            placeholder="请输入卡密"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卡包ID：" prop="cardId">
          <el-input
            v-model="filterForm.cardId"
            placeholder="请输入卡包ID"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 168px"
          >
            <el-option label="未使用" value="0" />
            <el-option label="已使用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button plain :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
      >
        <el-table-column prop="cardNumber" label="卡号" min-width="200" show-overflow-tooltip />
        <el-table-column prop="password" label="密码" min-width="120" />
        <el-table-column prop="orderNumber" label="订单编号" min-width="180" show-overflow-tooltip />
        <el-table-column prop="customerId" label="客户ID" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === '已使用' ? 'success' : row.status === '未使用' ? '' : 'warning'"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productValue" label="商品面值" min-width="120">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning); font-weight: 500;">{{ row.productValue }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />

      </el-table>
      
      <!-- 分页器 -->
      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'



// 筛选表单
const filterForm = reactive({
  cardSecret: '',
  cardId: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    cardNumber: '939684006576672442',
    password: 'p60wXO8T',
    orderNumber: 'sf174047748858929',
    customerId: '1001',
    status: '已使用',
    productValue: '10',
    createTime: '2025-02-25 17:59:20'
  },
  {
    cardNumber: '736779794793920531',
    password: 'pXSi3Y20',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:58:15'
  },
  {
    cardNumber: '679706886397601293',
    password: 'ASXKK8D7',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:57:42'
  },
  {
    cardNumber: '762829251215552704',
    password: 'XmJUg6eO',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:57:18'
  },
  {
    cardNumber: '332906932136546258',
    password: 'jzWOEfI',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:56:54'
  },
  {
    cardNumber: '613038240784082504',
    password: 'E8ca7Mpw',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:56:31'
  },
  {
    cardNumber: '550864709398981014',
    password: 'jMSMZj2',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:56:08'
  },
  {
    cardNumber: '752222246573346743',
    password: 'DXE7gTt8',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:55:44'
  },
  {
    cardNumber: '688099941296756970',
    password: 'Mre8h3Mc',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    productValue: '10',
    createTime: '2025-02-25 17:55:21'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 201
})

// 查询功能
const handleSearch = () => {
  tableLoading.value = true
  // 模拟查询请求
  setTimeout(() => {
    console.log('查询条件:', filterForm)
    tableLoading.value = false
  }, 1000)
}

// 重置功能
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  handleSearch()
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
.card-query {
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color-page);
}

.tabs-card {
  margin-bottom: 16px;
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