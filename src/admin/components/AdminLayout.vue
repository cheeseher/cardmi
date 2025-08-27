<!-- 管理员后台主布局 - 使用现有页面组件 -->
<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <h2>卡密核销系统</h2>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            admin
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="customer-management">
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </el-menu-item>
          <el-menu-item index="card-management">
            <el-icon><Shop /></el-icon>
            <span>卡密产品管理</span>
          </el-menu-item>
          <el-menu-item index="order-management">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="card-query">
            <el-icon><Search /></el-icon>
            <span>卡密查询</span>
          </el-menu-item>
          <el-sub-menu index="system-settings">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="subaccount-management">
              <el-icon><UserFilled /></el-icon>
              <span>子账户管理</span>
            </el-menu-item>
            <el-menu-item index="operation-log">
              <el-icon><List /></el-icon>
              <span>操作日志</span>
            </el-menu-item>
            <el-menu-item index="reset-password">
              <el-icon><Lock /></el-icon>
              <span>重置密码</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="main-content">
        <component :is="currentComponent" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  ArrowDown,
  Odometer,
  Shop,
  Document,
  Search,
  UserFilled,
  List,
  Lock,
  Setting
} from '@element-plus/icons-vue'

// 导入您现有的页面组件
import Dashboard from './Dashboard.vue'
import CustomerManagement from './CustomerManagement.vue'
import CardManagement from './CardManagement.vue'
import OrderManagement from './OrderManagement.vue'
import CardQuery from './CardQuery.vue'
import SubAccountManagement from './SubAccountManagement.vue'
import OperationLog from './OperationLog.vue'
import ResetPassword from './ResetPassword.vue'

// 当前激活的菜单和组件
const activeMenu = ref('dashboard')
const currentComponent = shallowRef(Dashboard)

// 组件映射 - 使用您现有的页面
const components = {
  'dashboard': Dashboard,
  'customer-management': CustomerManagement,
  'card-management': CardManagement,
  'order-management': OrderManagement,
  'card-query': CardQuery,
  'subaccount-management': SubAccountManagement,
  'operation-log': OperationLog,
  'reset-password': ResetPassword
}

// 菜单选择处理
const handleMenuSelect = (key) => {
  activeMenu.value = key
  currentComponent.value = components[key]
}

// 下拉菜单处理
const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      ElMessage.success('退出登录成功')
      break
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  display: flex;
  align-items: center;
}

.sidebar {
  background: #f5f5f5;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  border-right: none;
}

.main-content {
  background: #f0f2f5;
  padding: 20px;
}
</style>