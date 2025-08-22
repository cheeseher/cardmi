<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标和代码 -->
      <div class="error-icon">
        <el-icon :size="120" color="#409EFF">
          <DocumentDelete />
        </el-icon>
      </div>
      
      <div class="error-code">404</div>
      
      <div class="error-title">页面不存在</div>
      
      <div class="error-description">
        抱歉，您访问的页面不存在或已被删除
      </div>
      
      <!-- 操作按钮 -->
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        
        <el-button @click="goBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
        
        <el-button @click="refresh">
          <el-icon><Refresh /></el-icon>
          刷新页面
        </el-button>
      </div>
      
      <!-- 快捷导航 -->
      <div class="quick-nav">
        <div class="nav-title">快捷导航</div>
        <div class="nav-links">
          <el-link type="primary" @click="$router.push('/dashboard')">
            <el-icon><House /></el-icon>
            首页
          </el-link>
          <el-link type="primary" @click="$router.push('/user')">
            <el-icon><User /></el-icon>
            用户管理
          </el-link>
          <el-link type="primary" @click="$router.push('/order')">
            <el-icon><ShoppingCart /></el-icon>
            订单管理
          </el-link>
          <el-link type="primary" @click="$router.push('/system')">
            <el-icon><Setting /></el-icon>
            系统管理
          </el-link>
        </div>
      </div>
      
      <!-- 联系信息 -->
      <div class="contact-info">
        <div class="contact-title">需要帮助？</div>
        <div class="contact-content">
          <span>如果您认为这是一个错误，请联系系统管理员</span>
          <br>
          <span>邮箱：admin@example.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  DocumentDelete, 
  House, 
  Back, 
  Refresh, 
  User, 
  ShoppingCart, 
  Setting 
} from '@element-plus/icons-vue'

const router = useRouter()

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
  padding: 20px;
}

.error-container {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.error-icon {
  margin-bottom: 30px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.error-actions .el-button {
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 8px;
}

.quick-nav {
  margin-bottom: 40px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.nav-links {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-links .el-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-links .el-link:hover {
  background-color: #f0f9ff;
  transform: translateY(-2px);
}

.contact-info {
  border-top: 1px solid #EBEEF5;
  padding-top: 30px;
}

.contact-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.contact-content {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: 40px 20px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
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
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .error-page {
    padding: 10px;
  }
  
  .error-container {
    padding: 30px 15px;
  }
  
  .error-code {
    font-size: 60px;
  }
  
  .error-title {
    font-size: 20px;
  }
}
</style>