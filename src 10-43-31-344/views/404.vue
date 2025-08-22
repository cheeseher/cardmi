<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 404图标 -->
      <div class="error-icon">
        <svg viewBox="0 0 1024 1024" width="200" height="200">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#f5f5f5"/>
          <path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" fill="#ff6b6b"/>
        </svg>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被删除。
          <br>
          请检查URL是否正确，或返回首页继续浏览。
        </p>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button size="large" @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
        </div>
        
        <!-- 快捷导航 -->
        <div class="quick-nav">
          <h3>快捷导航</h3>
          <div class="nav-links">
            <el-link 
              v-for="link in quickLinks" 
              :key="link.path"
              :href="link.path"
              :underline="false"
              class="nav-link"
            >
              <el-icon><component :is="link.icon" /></el-icon>
              {{ link.title }}
            </el-link>
          </div>
        </div>
        
        <!-- 联系信息 -->
        <div class="contact-info">
          <p>如果问题持续存在，请联系系统管理员</p>
          <p>
            <el-icon><Message /></el-icon>
            邮箱：admin@cardmi.com
          </p>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  House, 
  ArrowLeft, 
  Refresh, 
  DataAnalysis, 
  User, 
  ShoppingCart, 
  Setting, 
  Message 
} from '@element-plus/icons-vue'

const router = useRouter()

// 快捷导航链接
const quickLinks = [
  {
    title: '仪表盘',
    path: '/dashboard',
    icon: DataAnalysis
  },
  {
    title: '用户管理',
    path: '/user',
    icon: User
  },
  {
    title: '订单管理',
    path: '/order',
    icon: ShoppingCart
  },
  {
    title: '系统设置',
    path: '/system',
    icon: Setting
  }
]

// 返回首页
const goHome = () => {
  router.push('/dashboard')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

// 刷新页面
const refresh = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.error-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  position: relative;
  z-index: 10;
}

.error-icon {
  margin-bottom: 30px;
  animation: bounce 2s infinite;
}

.error-title {
  font-size: 120px;
  font-weight: bold;
  color: #ff6b6b;
  margin: 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

.error-subtitle {
  font-size: 32px;
  color: #333;
  margin: 20px 0;
  font-weight: 600;
}

.error-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.error-actions .el-button {
  min-width: 120px;
}

.quick-nav {
  margin-bottom: 30px;
}

.quick-nav h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #666 !important;
  text-decoration: none;
}

.nav-link:hover {
  background: var(--el-color-primary);
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.contact-info {
  font-size: 14px;
  color: #888;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.contact-info p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 10%;
  animation-delay: 3s;
}

/* 动画效果 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: 40px 20px;
    margin: 20px;
  }
  
  .error-title {
    font-size: 80px;
  }
  
  .error-subtitle {
    font-size: 24px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 200px;
  }
  
  .nav-links {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 200px;
    justify-content: center;
  }
}
</style>