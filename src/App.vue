<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="layout-aside">
      <div class="layout-logo">
        <span>产品管理系统</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表板</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </el-menu-item>
          <el-menu-item index="cards">
            <el-icon><CreditCard /></el-icon>
            <span>卡密产品管理</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="card-query">
            <el-icon><Search /></el-icon>
            <span>卡密查询</span>
          </el-menu-item>
          <el-sub-menu index="settings">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="subaccounts">
              <el-icon><UserFilled /></el-icon>
              <span>子账户管理</span>
            </el-menu-item>
            <el-menu-item index="operationlog">
              <el-icon><List /></el-icon>
              <span>操作日志</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <span class="page-title">仪表盘</span>
        </div>
        <div class="toolbar">
          <el-dropdown @command="handleUserMenuCommand">
            <el-avatar :size="32" icon="User" class="user-avatar" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="reset-password">
                  <el-icon><Lock /></el-icon>
                  <span>重置密码</span>
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

      <el-main class="layout-main">
        <el-scrollbar>
          <component :is="currentComponent" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import Dashboard from './components/Dashboard.vue'
import CustomerManagement from './components/CustomerManagement.vue'
import CardManagement from './components/CardManagement.vue'
import CardQuery from './components/CardQuery.vue'
import OrderManagement from './components/OrderManagement.vue'
import SubAccountManagement from './components/SubAccountManagement.vue'
import OperationLog from './components/OperationLog.vue'
import ResetPassword from './components/ResetPassword.vue'

const activeMenu = ref('dashboard')
const currentComponent = shallowRef(Dashboard)

const components = {
  dashboard: Dashboard,
  users: CustomerManagement,
  cards: CardManagement,
  orders: OrderManagement,
  'card-query': CardQuery,
  subaccounts: SubAccountManagement,
  operationlog: OperationLog,
  'reset-password': ResetPassword,
}

const handleMenuSelect = (index) => {
  if (components[index]) {
    activeMenu.value = index
    currentComponent.value = components[index]
  }
}

const handleUserMenuCommand = (command) => {
  if (command === 'logout') {
    console.log('Logout command received')
    // Implement logout logic here
  } else if (command === 'reset-password') {
    handleMenuSelect('reset-password')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}

.layout-aside {
  display: flex;
  flex-direction: column;
  background-color: #304156;
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s;
}

.layout-logo {
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

.el-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  color: #bfcbd9 !important;
}

.el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow {
  color: #ffffff !important;
}

/* 确保SVG图标颜色正确显示 - 使用最强选择器和内联样式级别的优先级 */
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  color: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow {
  color: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

/* 最强选择器确保SVG路径元素颜色正确 */
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow svg path {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow svg path {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* 针对所有可能的SVG子元素，使用最高优先级 */
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow svg *,
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow svg {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow svg *,
.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow svg {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* 使用属性选择器进一步加强 */
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow[class*="icon"] svg,
.layout-container .layout-aside .el-menu .el-sub-menu__title .el-sub-menu__icon-arrow[class*="icon"] svg * {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow[class*="icon"] svg,
.layout-container .layout-aside .el-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow[class*="icon"] svg * {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
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

.layout-header {
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
  color: #ffffff;
  margin: 0;
}

.toolbar {
  display: flex;
  align-items: center;
}

.user-avatar {
  cursor: pointer;
}

.layout-main {
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.el-main > .el-scrollbar {
  padding: 0;
}
</style>