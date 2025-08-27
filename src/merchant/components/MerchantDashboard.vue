<template>
  <el-container class="merchant-layout-container">
    <el-aside width="200px" class="merchant-layout-aside">
      <div class="merchant-layout-logo">
        <span>商户后台</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="product-management">
            <el-icon><Shop /></el-icon>
            <span>产品管理</span>
          </el-menu-item>
          <el-menu-item index="order-management">
            <el-icon><Document /></el-icon>
            <span>产品统计</span>
          </el-menu-item>
          <el-menu-item index="withdrawal-records">
            <el-icon><DocumentCopy /></el-icon>
            <span>提卡记录</span>
          </el-menu-item>
          <el-menu-item index="reset-password">
            <el-icon><Lock /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="merchant-layout-header">
        <div class="header-left">
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="toolbar">
          <el-dropdown @command="handleUserMenuCommand">
            <div class="user-info">
              <el-avatar :size="32" icon="User" class="user-avatar" />
              <span class="user-nickname">{{ merchantInfo.customerName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="reset-password">
                  <el-icon><Lock /></el-icon>
                  <span>修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="merchant-layout-main">
        <el-scrollbar>
          <component :is="currentComponent" :merchant-info="merchantInfo" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Shop, 
  Document, 
  Wallet, 
  DocumentCopy, 
  Setting, 
  User, 
  Lock, 
  SwitchButton 
} from '@element-plus/icons-vue'
import MerchantProductManagement from './MerchantProductManagement.vue'
import ProductStatistics from './ProductStatistics.vue'
import WithdrawalRecords from './WithdrawalRecords.vue'
import ResetPassword from './ResetPassword.vue'

// 商户信息状态
const merchantInfo = ref({
  merchantNo: '',
  merchantKey: '',
  customerName: '',
  customerId: ''
})

// 初始化商户信息
onMounted(() => {
  // 从 URL 参数获取商户信息
  const urlParams = new URLSearchParams(window.location.search)
  const merchantNo = urlParams.get('merchantNo')
  const merchantKey = urlParams.get('merchantKey')
  const customerName = urlParams.get('customerName')
  const customerId = urlParams.get('customerId')
  
  if (merchantNo && merchantKey && customerName && customerId) {
    // 使用从管理员后台传递的商户信息
    merchantInfo.value = {
      merchantNo,
      merchantKey,
      customerName,
      customerId
    }
    ElMessage.success(`欢迎进入商户后台系统，${customerName}`)
  } else {
    // 设置默认商户信息
    merchantInfo.value = {
      merchantNo: 'MERCHANT001',
      merchantKey: 'KEY001',
      customerName: '测试商户',
      customerId: '001'
    }
    ElMessage.success('欢迎进入商户后台系统')
  }
})

const activeMenu = ref('product-management')
const currentComponent = shallowRef(MerchantProductManagement)

const components = {
  'product-management': MerchantProductManagement,
  'order-management': ProductStatistics,
  'withdrawal-records': WithdrawalRecords,
  'reset-password': ResetPassword,
  // 其他组件可以后续添加
}

const menuTitles = {
  'product-management': '产品管理',
  'order-management': '产品统计',
  'balance-management': '余额管理',
  'withdrawal-records': '提卡记录',
  'reset-password': '重置密码',
  'api-docs': 'API文档',
  'account-settings': '账户设置',
  'security-settings': '安全设置'
}

const pageTitle = computed(() => {
  return menuTitles[activeMenu.value] || '商户后台'
})

const handleMenuSelect = (index) => {
  if (components[index]) {
    activeMenu.value = index
    currentComponent.value = components[index]
  } else {
    // 暂未实现的功能
    ElMessage.info(`${menuTitles[index] || '该功能'}正在开发中...`)
  }
}

const handleUserMenuCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'reset-password':
      activeMenu.value = 'reset-password'
      currentComponent.value = ResetPassword
      break
    case 'logout':
      ElMessage.success('退出登录成功')
      // 这里可以添加退出登录的逻辑
      break
  }
}
</script>

<style scoped>
.merchant-layout-container {
  height: 100vh;
  width: 100%;
}

.merchant-layout-aside {
  display: flex;
  flex-direction: column;
  background-color: #304156;
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s;
}

.merchant-layout-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  flex-shrink: 0;
  background-color: #304156;
}

.el-menu {
  border-right: none;
  background-color: #304156;
}

.el-menu .el-menu-item,
.el-menu .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  color: #bfcbd9;
  background-color: transparent;
}

.el-menu .el-sub-menu__title span {
  color: #bfcbd9 !important;
}

.el-menu .el-sub-menu__title .el-icon {
  color: #bfcbd9 !important;
}

.el-menu .el-menu-item.is-active {
  background-color: var(--el-color-primary);
  color: #ffffff;
}

.el-menu .el-menu-item:hover,
.el-menu .el-sub-menu__title:hover {
  background-color: #263445;
  color: #ffffff;
}

.el-menu .el-sub-menu__title:hover .el-icon {
  color: #ffffff !important;
}

.el-menu .el-sub-menu .el-menu-item {
  background-color: #1f2d3d;
  color: #bfcbd9 !important;
}

.el-menu .el-sub-menu .el-menu-item span {
  color: #bfcbd9 !important;
}

.el-menu .el-sub-menu .el-menu-item:hover {
  background-color: #001528;
  color: #ffffff !important;
}

.el-menu .el-sub-menu .el-menu-item:hover span {
  color: #ffffff !important;
}

.el-menu .el-sub-menu .el-menu-item.is-active {
  background-color: var(--el-color-primary);
  color: #ffffff !important;
}

.el-menu .el-sub-menu .el-menu-item.is-active span {
  color: #ffffff !important;
}

.merchant-layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0;
}

.toolbar {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  margin-right: 8px;
}

.user-nickname {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.merchant-layout-main {
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.el-main > .el-scrollbar {
  padding: 0;
}
</style>