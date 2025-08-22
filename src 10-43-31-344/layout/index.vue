<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside 
      :width="sidebarWidth" 
      class="sidebar-container"
    >
      <Sidebar />
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header-container">
        <Header />
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

const appStore = useAppStore()

// 侧边栏宽度
const sidebarWidth = computed(() => {
  return appStore.sidebarCollapsed ? '64px' : '210px'
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  
  .sidebar-container {
    transition: width 0.3s;
    background-color: #001529;
    overflow: hidden;
  }
  
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .header-container {
      height: $header-height;
      padding: 0;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      z-index: 9;
    }
    
    .content-container {
      flex: 1;
      padding: 0;
      background-color: $background-color-base;
      overflow-y: auto;
    }
  }
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 响应式布局
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
    
    .sidebar-container {
      width: 100% !important;
      height: auto;
    }
  }
}
</style>