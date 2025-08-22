<template>
  <div class="page-container" :class="containerClass">
    <!-- 页面头部 -->
    <div v-if="showHeader" class="page-header">
      <!-- 面包屑导航 -->
      <el-breadcrumb v-if="showBreadcrumb" separator="/" class="page-breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
          :to="item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- 页面标题区域 -->
      <div class="page-title-wrapper">
        <div class="page-title-content">
          <!-- 返回按钮 -->
          <el-button
            v-if="showBack"
            :icon="ArrowLeft"
            @click="handleBack"
            class="back-button"
          >
            返回
          </el-button>
          
          <!-- 页面标题 -->
          <div class="page-title">
            <el-icon v-if="titleIcon" class="title-icon">
              <component :is="titleIcon" />
            </el-icon>
            <h1 class="title-text">{{ title }}</h1>
            <el-tag v-if="titleTag" :type="titleTag.type" class="title-tag">
              {{ titleTag.text }}
            </el-tag>
          </div>
          
          <!-- 页面描述 -->
          <p v-if="description" class="page-description">{{ description }}</p>
        </div>
        
        <!-- 页面操作区域 -->
        <div v-if="$slots.extra || showRefresh" class="page-extra">
          <slot name="extra" />
          <el-button
            v-if="showRefresh"
            :icon="Refresh"
            @click="handleRefresh"
            :loading="refreshLoading"
            class="refresh-button"
          >
            刷新
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 页面内容区域 -->
    <div class="page-content" :class="contentClass">
      <!-- 加载状态 -->
      <div v-if="loading" class="page-loading">
        <el-skeleton :rows="skeletonRows" animated />
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="page-error">
        <el-result
          icon="error"
          :title="errorTitle"
          :sub-title="errorMessage"
        >
          <template #extra>
            <el-button type="primary" @click="handleRetry">
              重新加载
            </el-button>
          </template>
        </el-result>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="empty" class="page-empty">
        <el-empty
          :image="emptyImage"
          :description="emptyDescription"
        >
          <template v-if="$slots.empty" #default>
            <slot name="empty" />
          </template>
        </el-empty>
      </div>
      
      <!-- 正常内容 -->
      <div v-else class="page-main">
        <slot />
      </div>
    </div>
    
    <!-- 页面底部 -->
    <div v-if="$slots.footer" class="page-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 基础配置
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  titleIcon: {
    type: [String, Object],
    default: null
  },
  titleTag: {
    type: Object,
    default: null
  },
  
  // 显示控制
  showHeader: {
    type: Boolean,
    default: true
  },
  showBreadcrumb: {
    type: Boolean,
    default: true
  },
  showBack: {
    type: Boolean,
    default: false
  },
  showRefresh: {
    type: Boolean,
    default: false
  },
  
  // 状态控制
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Boolean,
    default: false
  },
  
  // 错误状态配置
  errorTitle: {
    type: String,
    default: '加载失败'
  },
  errorMessage: {
    type: String,
    default: '页面加载出现错误，请稍后重试'
  },
  
  // 空状态配置
  emptyDescription: {
    type: String,
    default: '暂无数据'
  },
  emptyImage: {
    type: String,
    default: ''
  },
  
  // 加载配置
  skeletonRows: {
    type: Number,
    default: 8
  },
  refreshLoading: {
    type: Boolean,
    default: false
  },
  
  // 样式配置
  containerClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  
  // 面包屑配置
  breadcrumbList: {
    type: Array,
    default: () => []
  },
  
  // 布局配置
  fluid: {
    type: Boolean,
    default: false
  },
  ghost: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits([
  'back',
  'refresh',
  'retry'
])

// 路由相关
const router = useRouter()
const route = useRoute()

// 响应式数据
const refreshTimer = ref(null)

// 计算属性
const computedBreadcrumbList = computed(() => {
  if (props.breadcrumbList.length > 0) {
    return props.breadcrumbList
  }
  
  // 自动生成面包屑
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    title: item.meta.title,
    path: item.path
  }))
})

// 事件处理
const handleBack = () => {
  emit('back')
  if (!props.showBack) return
  
  // 默认返回上一页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleRefresh = () => {
  emit('refresh')
}

const handleRetry = () => {
  emit('retry')
}

// 自动刷新功能
const startAutoRefresh = (interval = 30000) => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
  
  refreshTimer.value = setInterval(() => {
    if (!props.loading && !props.error) {
      handleRefresh()
    }
  }, interval)
}

const stopAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

// 公开方法
const scrollToTop = () => {
  const container = document.querySelector('.page-container')
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToElement = (selector) => {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 暴露方法给父组件
defineExpose({
  scrollToTop,
  scrollToElement,
  startAutoRefresh,
  stopAutoRefresh
})

// 生命周期
onMounted(() => {
  // 设置页面标题
  if (props.title) {
    document.title = props.title
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.page-container.fluid {
  padding: 0;
}

.page-container.ghost {
  background: transparent;
}

/* 页面头部 */
.page-header {
  background: #fff;
  padding: 16px 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.page-breadcrumb {
  margin-bottom: 16px;
}

.page-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title-content {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.back-button {
  margin-right: 12px;
}

.title-icon {
  margin-right: 8px;
  font-size: 20px;
  color: var(--el-color-primary);
}

.title-text {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.title-tag {
  margin-left: 12px;
}

.page-description {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.5;
}

.page-extra {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 24px;
}

.refresh-button {
  margin-left: 8px;
}

/* 页面内容 */
.page-content {
  flex: 1;
  padding: 0 24px;
}

.page-content.no-padding {
  padding: 0;
}

.page-loading,
.page-error,
.page-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.page-loading {
  padding: 40px;
}

.page-main {
  min-height: 400px;
}

/* 页面底部 */
.page-footer {
  background: #fff;
  padding: 16px 24px;
  margin-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 16px;
  }
  
  .page-content {
    padding: 0 16px;
  }
  
  .page-footer {
    padding: 12px 16px;
  }
  
  .page-title-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-extra {
    margin-left: 0;
    margin-top: 16px;
    justify-content: flex-end;
  }
  
  .title-text {
    font-size: 18px;
  }
  
  .page-title {
    flex-wrap: wrap;
  }
  
  .title-tag {
    margin-left: 0;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 8px 12px;
  }
  
  .page-content {
    padding: 0 12px;
  }
  
  .page-footer {
    padding: 8px 12px;
  }
  
  .page-extra {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-extra .el-button {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>