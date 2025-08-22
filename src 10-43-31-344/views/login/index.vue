<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="/vite.svg" alt="Logo" class="logo" />
        <h2 class="title">CardMi 管理系统</h2>
        <p class="subtitle">欢迎登录后台管理系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">
            记住密码
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loginLoading"
            @click="handleLogin"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <p>默认账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref()

// 登录加载状态
const loginLoading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loginLoading.value = true
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 验证用户名密码
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      // 设置用户信息
      userStore.setUserInfo({
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: '',
        email: 'admin@cardmi.com',
        roles: ['admin']
      })
      
      userStore.setLoginStatus(true)
      
      // 保存 token
      if (loginForm.remember) {
        localStorage.setItem('token', 'mock-token-123456')
      }
      
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loginLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  
  .login-box {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
      
      .logo {
        width: 64px;
        height: 64px;
        margin-bottom: $spacing-lg;
      }
      
      .title {
        font-size: 28px;
        font-weight: bold;
        color: $text-color-primary;
        margin: 0 0 $spacing-sm 0;
      }
      
      .subtitle {
        font-size: 14px;
        color: $text-color-secondary;
        margin: 0;
      }
    }
    
    .login-form {
      .login-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .login-footer {
      text-align: center;
      margin-top: $spacing-xl;
      
      p {
        font-size: 12px;
        color: $text-color-placeholder;
        margin: 0;
      }
    }
  }
}

// 响应式处理
@media (max-width: 480px) {
  .login-container {
    padding: $spacing-md;
    
    .login-box {
      padding: $spacing-xl;
    }
  }
}
</style>