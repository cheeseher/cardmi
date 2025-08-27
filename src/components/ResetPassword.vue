<template>
  <div class="reset-password">
    <!-- 密码修改表单 -->
    <div class="form-container">
      <el-card class="form-card">
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
        >
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-space>
              <el-button
                type="primary"
                :loading="submitLoading"
                @click="handleSubmit"
              >
                保存
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-space>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 表单引用
const passwordFormRef = ref()

// 提交加载状态
const submitLoading = ref(false)

// 密码表单数据
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else if (value === passwordForm.currentPassword) {
    callback(new Error('新密码不能与当前密码相同'))
  } else {
    // 如果确认密码已填写，需要重新验证确认密码
    if (passwordForm.confirmPassword !== '') {
      passwordFormRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

// 表单验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  try {
    await passwordFormRef.value.validate()
    submitLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    handleReset()
  } catch (error) {
    console.log('表单验证失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  passwordFormRef.value?.resetFields()
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}
</script>

<style scoped>
.reset-password {
  padding: var(--el-padding-large);
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.form-container {
  max-width: 600px;
}

.form-card {
  margin-bottom: var(--el-margin-large);
}
</style>