<template>
  <div class="header-wrapper">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 折叠按钮 -->
      <el-button
        type="text"
        :icon="sidebarCollapsed ? Expand : Fold"
        @click="toggleSidebar"
        class="collapse-btn"
      />
      
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.path"
          :to="item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 全屏按钮 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button
          type="text"
          :icon="FullScreen"
          @click="toggleFullscreen"
          class="action-btn"
        />
      </el-tooltip>
      
      <!-- 主题切换 -->
      <el-tooltip content="主题切换" placement="bottom">
        <el-button
          type="text"
          :icon="theme === 'light' ? Moon : Sunny"
          @click="toggleTheme"
          class="action-btn"
        />
      </el-tooltip>
      
      <!-- 用户信息 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar
            :size="32"
            :src="userInfo.avatar"
            class="user-avatar"
          >
            {{ userInfo.nickname?.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ userInfo.nickname }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Fold,
  Expand,
  FullScreen,
  Moon,
  Sunny,
  ArrowDown,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 计算属性
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const breadcrumbs = computed(() => appStore.breadcrumbs)
const theme = computed(() => appStore.theme)
const userInfo = computed(() => userStore.userInfo)

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('退出登录成功')
  })
}
</script>

<style lang="scss" scoped>
.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 $spacing-xl;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .collapse-btn {
      margin-right: $spacing-lg;
      font-size: 18px;
      color: $text-color-regular;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    .breadcrumb {
      font-size: 14px;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .action-btn {
      font-size: 16px;
      color: $text-color-regular;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-base;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: $background-color-base;
      }
      
      .user-avatar {
        margin-right: $spacing-sm;
      }
      
      .user-name {
        margin-right: $spacing-xs;
        font-size: 14px;
        color: $text-color-primary;
      }
      
      .dropdown-icon {
        font-size: 12px;
        color: $text-color-secondary;
      }
    }
  }
}

// 响应式处理
@media (max-width: 768px) {
  .header-wrapper {
    padding: 0 $spacing-md;
    
    .breadcrumb {
      display: none;
    }
    
    .user-name {
      display: none;
    }
  }
}
</style>