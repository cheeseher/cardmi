import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)
  
  // 设备类型
  const device = ref('desktop') // desktop, tablet, mobile
  
  // 主题模式
  const theme = ref('light') // light, dark
  
  // 页面加载状态
  const pageLoading = ref(false)
  
  // 面包屑导航
  const breadcrumbs = ref([])
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  // 设置设备类型
  const setDevice = (deviceType) => {
    device.value = deviceType
  }
  
  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  // 设置页面加载状态
  const setPageLoading = (loading) => {
    pageLoading.value = loading
  }
  
  // 设置面包屑
  const setBreadcrumbs = (crumbs) => {
    breadcrumbs.value = crumbs
  }
  
  return {
    sidebarCollapsed,
    device,
    theme,
    pageLoading,
    breadcrumbs,
    toggleSidebar,
    setSidebarCollapsed,
    setDevice,
    toggleTheme,
    setPageLoading,
    setBreadcrumbs
  }
})