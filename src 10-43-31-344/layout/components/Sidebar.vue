<template>
  <div class="sidebar-wrapper">
    <!-- Logo 区域 -->
    <div class="logo-container">
      <div class="logo">
        <img v-if="!sidebarCollapsed" src="/vite.svg" alt="Logo" class="logo-img" />
        <span v-if="!sidebarCollapsed" class="logo-text">CardMi</span>
        <img v-else src="/vite.svg" alt="Logo" class="logo-img-collapsed" />
      </div>
    </div>
    
    <!-- 菜单区域 -->
    <el-scrollbar class="menu-container">
      <el-menu
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        :unique-opened="true"
        :router="true"
        background-color="#001529"
        text-color="rgba(255, 255, 255, 0.65)"
        active-text-color="#fff"
        class="sidebar-menu"
      >
        <sidebar-item
          v-for="route in menuRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 计算属性
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const activeMenu = computed(() => route.path)

// 过滤菜单路由
const menuRoutes = computed(() => {
  return router.getRoutes().filter(route => {
    // 过滤隐藏的路由
    if (route.meta?.hidden) return false
    
    // 过滤没有权限的路由
    if (route.meta?.permissions) {
      return route.meta.permissions.some(permission => 
        userStore.hasPermission(permission)
      )
    }
    
    // 过滤登录页和错误页
    if (['/login', '/404'].includes(route.path)) return false
    
    return true
  })
})
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .logo-container {
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #1f1f1f;
    
    .logo {
      display: flex;
      align-items: center;
      
      .logo-img {
        width: 32px;
        height: 32px;
        margin-right: $spacing-sm;
      }
      
      .logo-img-collapsed {
        width: 32px;
        height: 32px;
      }
      
      .logo-text {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
  
  .menu-container {
    flex: 1;
    
    .sidebar-menu {
      border: none;
      
      :deep(.el-menu-item) {
        &.is-active {
          background-color: $primary-color !important;
        }
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      }
      
      :deep(.el-sub-menu__title) {
        &:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      }
      
      :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
        color: #fff !important;
      }
    }
  }
}
</style>