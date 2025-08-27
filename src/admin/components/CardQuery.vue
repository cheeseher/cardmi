<template>
  <div class="card-query">


    <!-- 筛选区域 -->
    <el-card shadow="never" class="filter-container">
      <el-form :model="filterForm" class="multi-line-filter-form">
        <!-- 第一行筛选项 -->
        <div class="filter-line">
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
          <el-form-item label="使用状态：" prop="status">
            <el-select
              v-model="filterForm.status"
              placeholder="请选择使用状态"
              clearable
              style="width: 168px"
            >
              <el-option label="未使用" value="0" />
              <el-option label="已使用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="核销状态：" prop="verificationStatus">
            <el-select
              v-model="filterForm.verificationStatus"
              placeholder="请选择核销状态"
              clearable
              style="width: 168px"
            >
              <el-option label="未核销" value="0" />
              <el-option label="已核销" value="1" />
            </el-select>
          </el-form-item>
        </div>
        
        <!-- 第二行筛选项 -->
        <div class="filter-line">
          <el-form-item label="锁卡状态：" prop="lockStatus">
            <el-select
              v-model="filterForm.lockStatus"
              placeholder="请选择锁卡状态"
              clearable
              style="width: 168px"
            >
              <el-option label="正常" value="0" />
              <el-option label="已锁定" value="1" />
            </el-select>
          </el-form-item>
          <!-- 操作按钮组，靠右对齐 -->
          <div class="filter-buttons">
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button plain :icon="Refresh" @click="handleReset">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="left">
          <el-button 
            type="warning" 
            :disabled="selectedRows.length === 0 || !hasUnlockedCards"
            @click="handleBatchLock"
          >
            批量锁卡
          </el-button>
          <el-button 
            type="success" 
            :disabled="selectedRows.length === 0 || !hasLockedCards"
            @click="handleBatchUnlock"
          >
            批量解锁
          </el-button>
          <el-button 
            type="primary" 
            :disabled="selectedRows.length === 0"
            @click="handleBatchExport"
          >
            批量导出
          </el-button>
        </div>
        <div class="right">
          <span class="selected-info">已选择 {{ selectedRows.length }} 项</span>
        </div>
      </div>
      
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cardNumber" label="卡号" width="180" show-overflow-tooltip />
        <el-table-column prop="password" label="密码" width="120" align="center" />
        <el-table-column prop="orderNumber" label="订单编号" min-width="160" show-overflow-tooltip />
        <el-table-column prop="customerId" label="客户ID" width="100" align="center" />
        <el-table-column prop="status" label="使用状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === '已使用' ? 'success' : row.status === '未使用' ? '' : 'warning'"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="verificationStatus" label="核销状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.verificationStatus === '已核销' ? 'success' : 'warning'"
            >
              {{ row.verificationStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lockStatus" label="锁卡状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.lockStatus === '已锁定' ? 'danger' : 'success'"
            >
              {{ row.lockStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productValue" label="商品面值" width="120" align="center">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning); font-weight: 500;">{{ row.productValue }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              @click="handleViewDetail(row)"
            >
              查看详情
            </el-button>
            <el-button 
              v-if="row.lockStatus === '正常'"
              link 
              type="warning" 
              @click="handleLockCard(row)"
            >
              锁卡
            </el-button>
            <el-button 
              v-else
              link 
              type="success" 
              @click="handleUnlockCard(row)"
            >
              解锁
            </el-button>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'



// 筛选表单
const filterForm = reactive({
  cardSecret: '',
  cardId: '',
  status: '',
  verificationStatus: '',
  lockStatus: ''
})

// 选中的行数据
const selectedRows = ref([])

// 计算属性：是否有未锁定的卡
const hasUnlockedCards = computed(() => {
  return selectedRows.value.some(row => row.lockStatus === '正常')
})

// 计算属性：是否有已锁定的卡
const hasLockedCards = computed(() => {
  return selectedRows.value.some(row => row.lockStatus === '已锁定')
})

// 表格数据
const tableData = ref([
  {
    cardNumber: '939684006576672442',
    password: 'p60wXO8T',
    orderNumber: 'sf174047748858929',
    customerId: '1001',
    status: '已使用',
    verificationStatus: '已核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:59:20'
  },
  {
    cardNumber: '736779794793920531',
    password: 'pXSi3Y20',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:58:15'
  },
  {
    cardNumber: '679706886397601293',
    password: 'ASXKK8D7',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '已锁定',
    productValue: '10',
    createTime: '2025-02-25 17:57:42'
  },
  {
    cardNumber: '762829251215552704',
    password: 'XmJUg6eO',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:57:18'
  },
  {
    cardNumber: '332906932136546258',
    password: 'jzWOEfI',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:56:54'
  },
  {
    cardNumber: '613038240784082504',
    password: 'E8ca7Mpw',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '已锁定',
    productValue: '10',
    createTime: '2025-02-25 17:56:31'
  },
  {
    cardNumber: '550864709398981014',
    password: 'jMSMZj2',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:56:08'
  },
  {
    cardNumber: '752222246573346743',
    password: 'DXE7gTt8',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:55:44'
  },
  {
    cardNumber: '688099941296756970',
    password: 'Mre8h3Mc',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
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
    // 执行查询逻辑
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

// 选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 批量锁卡
const handleBatchLock = () => {
  const unlocked = selectedRows.value.filter(row => row.lockStatus === '正常')
  if (unlocked.length === 0) {
    ElMessage.warning('请选择未锁定的卡密')
    return
  }
  
  ElMessageBox.confirm(`确认锁定选中的 ${unlocked.length} 张卡密？`, '批量锁卡', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    unlocked.forEach(row => {
      row.lockStatus = '已锁定'
    })
    ElMessage.success(`成功锁定 ${unlocked.length} 张卡密`)
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 批量解锁
const handleBatchUnlock = () => {
  const locked = selectedRows.value.filter(row => row.lockStatus === '已锁定')
  if (locked.length === 0) {
    ElMessage.warning('请选择已锁定的卡密')
    return
  }
  
  ElMessageBox.confirm(`确认解锁选中的 ${locked.length} 张卡密？`, '批量解锁', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    locked.forEach(row => {
      row.lockStatus = '正常'
    })
    ElMessage.success(`成功解锁 ${locked.length} 张卡密`)
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 批量导出
const handleBatchExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的数据')
    return
  }
  
  // 模拟导出功能
  ElMessage.success(`正在导出 ${selectedRows.value.length} 条数据...`)
  // 导出选中数据
}

// 查看详情
const handleViewDetail = (row) => {
  ElMessage.info(`查看卡号 ${row.cardNumber} 的详情`)
  // 查看卡密详情
}

// 锁卡
const handleLockCard = (row) => {
  ElMessageBox.confirm(`确认锁定卡号 ${row.cardNumber}？`, '锁卡确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.lockStatus = '已锁定'
    ElMessage.success('锁卡成功')
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 解锁
const handleUnlockCard = (row) => {
  ElMessageBox.confirm(`确认解锁卡号 ${row.cardNumber}？`, '解锁确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.lockStatus = '正常'
    ElMessage.success('解锁成功')
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
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
  padding: 12px 0;
}

.table-toolbar .left {
  display: flex;
  align-items: center;
}

.table-toolbar .left .el-button + .el-button {
  margin-left: 12px;
}

.table-toolbar .right {
  display: flex;
  align-items: center;
}

.selected-info {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

/* 分页器样式 */
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>