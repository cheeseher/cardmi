<template>
  <div class="page-container">
    <!-- 系统设置标签页 -->
    <el-card shadow="never">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基础设置 -->
        <el-tab-pane label="基础设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
            label-position="right"
            style="max-width: 600px"
          >
            <el-form-item label="系统名称" prop="systemName" required>
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统描述" prop="systemDesc">
              <el-input 
                v-model="basicForm.systemDesc" 
                type="textarea" 
                :rows="3" 
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-form-item label="系统版本" prop="version">
              <el-input v-model="basicForm.version" placeholder="请输入系统版本" />
            </el-form-item>
            
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="basicForm.companyName" placeholder="请输入公司名称" />
            </el-form-item>
            
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input v-model="basicForm.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
            
            <el-form-item label="系统Logo" prop="logo">
              <el-upload
                class="logo-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :on-success="handleLogoSuccess"
              >
                <img v-if="basicForm.logo" :src="basicForm.logo" class="logo" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-form-item>
            
            <el-form-item label="时区设置" prop="timezone">
              <el-select v-model="basicForm.timezone" placeholder="请选择时区" style="width: 100%">
                <el-option
                  v-for="item in timezoneOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleBasicSubmit" :loading="basicLoading">
                保存设置
              </el-button>
              <el-button @click="resetBasicForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            :rules="securityRules"
            label-width="150px"
            label-position="right"
            style="max-width: 600px"
          >
            <el-form-item label="密码最小长度" prop="minPasswordLength">
              <el-input-number 
                v-model="securityForm.minPasswordLength" 
                :min="6" 
                :max="20" 
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="密码复杂度要求" prop="passwordComplexity">
              <el-checkbox-group v-model="securityForm.passwordComplexity">
                <el-checkbox label="uppercase">包含大写字母</el-checkbox>
                <el-checkbox label="lowercase">包含小写字母</el-checkbox>
                <el-checkbox label="number">包含数字</el-checkbox>
                <el-checkbox label="special">包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="登录失败锁定" prop="loginFailLock">
              <el-switch v-model="securityForm.loginFailLock" />
              <span class="form-tip">启用后，连续登录失败将锁定账户</span>
            </el-form-item>
            
            <el-form-item label="最大失败次数" prop="maxFailAttempts" v-if="securityForm.loginFailLock">
              <el-input-number 
                v-model="securityForm.maxFailAttempts" 
                :min="3" 
                :max="10" 
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="锁定时长(分钟)" prop="lockDuration" v-if="securityForm.loginFailLock">
              <el-input-number 
                v-model="securityForm.lockDuration" 
                :min="5" 
                :max="1440" 
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="会话超时(分钟)" prop="sessionTimeout">
              <el-input-number 
                v-model="securityForm.sessionTimeout" 
                :min="10" 
                :max="480" 
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="强制HTTPS" prop="forceHttps">
              <el-switch v-model="securityForm.forceHttps" />
              <span class="form-tip">强制使用HTTPS协议访问</span>
            </el-form-item>
            
            <el-form-item label="IP白名单" prop="ipWhitelist">
              <el-input 
                v-model="securityForm.ipWhitelist" 
                type="textarea" 
                :rows="3" 
                placeholder="请输入IP地址，多个IP用换行分隔"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSecuritySubmit" :loading="securityLoading">
                保存设置
              </el-button>
              <el-button @click="resetSecurityForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notification">
          <el-form
            ref="notificationFormRef"
            :model="notificationForm"
            label-width="150px"
            label-position="right"
            style="max-width: 600px"
          >
            <el-form-item label="邮件通知" prop="emailNotification">
              <el-switch v-model="notificationForm.emailNotification" />
              <span class="form-tip">启用邮件通知功能</span>
            </el-form-item>
            
            <div v-if="notificationForm.emailNotification" class="notification-config">
              <el-form-item label="SMTP服务器" prop="smtpHost">
                <el-input v-model="notificationForm.smtpHost" placeholder="请输入SMTP服务器地址" />
              </el-form-item>
              
              <el-form-item label="SMTP端口" prop="smtpPort">
                <el-input-number v-model="notificationForm.smtpPort" :min="1" :max="65535" style="width: 100%" />
              </el-form-item>
              
              <el-form-item label="发件人邮箱" prop="senderEmail">
                <el-input v-model="notificationForm.senderEmail" placeholder="请输入发件人邮箱" />
              </el-form-item>
              
              <el-form-item label="邮箱密码" prop="emailPassword">
                <el-input v-model="notificationForm.emailPassword" type="password" placeholder="请输入邮箱密码" show-password />
              </el-form-item>
            </div>
            
            <el-form-item label="短信通知" prop="smsNotification">
              <el-switch v-model="notificationForm.smsNotification" />
              <span class="form-tip">启用短信通知功能</span>
            </el-form-item>
            
            <div v-if="notificationForm.smsNotification" class="notification-config">
              <el-form-item label="短信服务商" prop="smsProvider">
                <el-select v-model="notificationForm.smsProvider" placeholder="请选择短信服务商" style="width: 100%">
                  <el-option label="阿里云" value="aliyun" />
                  <el-option label="腾讯云" value="tencent" />
                  <el-option label="华为云" value="huawei" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="AccessKey" prop="smsAccessKey">
                <el-input v-model="notificationForm.smsAccessKey" placeholder="请输入AccessKey" />
              </el-form-item>
              
              <el-form-item label="SecretKey" prop="smsSecretKey">
                <el-input v-model="notificationForm.smsSecretKey" type="password" placeholder="请输入SecretKey" show-password />
              </el-form-item>
            </div>
            
            <el-form-item label="通知类型" prop="notificationTypes">
              <el-checkbox-group v-model="notificationForm.notificationTypes">
                <el-checkbox label="login">登录通知</el-checkbox>
                <el-checkbox label="order">订单通知</el-checkbox>
                <el-checkbox label="system">系统通知</el-checkbox>
                <el-checkbox label="security">安全通知</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleNotificationSubmit" :loading="notificationLoading">
                保存设置
              </el-button>
              <el-button @click="resetNotificationForm">重置</el-button>
              <el-button type="success" @click="testNotification" v-if="notificationForm.emailNotification">
                测试邮件
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 系统信息 -->
        <el-tab-pane label="系统信息" name="info">
          <div class="system-info">
            <el-descriptions title="系统运行信息" :column="2" border>
              <el-descriptions-item label="系统版本">{{ systemInfo.version }}</el-descriptions-item>
              <el-descriptions-item label="运行时间">{{ systemInfo.uptime }}</el-descriptions-item>
              <el-descriptions-item label="服务器时间">{{ systemInfo.serverTime }}</el-descriptions-item>
              <el-descriptions-item label="数据库版本">{{ systemInfo.dbVersion }}</el-descriptions-item>
              <el-descriptions-item label="CPU使用率">
                <el-progress :percentage="systemInfo.cpuUsage" :color="getProgressColor(systemInfo.cpuUsage)" />
              </el-descriptions-item>
              <el-descriptions-item label="内存使用率">
                <el-progress :percentage="systemInfo.memoryUsage" :color="getProgressColor(systemInfo.memoryUsage)" />
              </el-descriptions-item>
              <el-descriptions-item label="磁盘使用率">
                <el-progress :percentage="systemInfo.diskUsage" :color="getProgressColor(systemInfo.diskUsage)" />
              </el-descriptions-item>
              <el-descriptions-item label="在线用户数">{{ systemInfo.onlineUsers }}</el-descriptions-item>
            </el-descriptions>
            
            <div class="info-actions">
              <el-button type="primary" @click="refreshSystemInfo">
                刷新信息
              </el-button>
              <el-button type="warning" @click="clearCache">
                清理缓存
              </el-button>
              <el-button type="success" @click="exportLogs">
                导出日志
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('basic')
const basicLoading = ref(false)
const securityLoading = ref(false)
const notificationLoading = ref(false)
const basicFormRef = ref()
const securityFormRef = ref()
const notificationFormRef = ref()

// 基础设置表单
const basicForm = reactive({
  systemName: 'CardMi 后台管理系统',
  systemDesc: '基于 Vue 3 + Element Plus 的现代化后台管理系统',
  version: '1.0.0',
  companyName: 'CardMi Technology',
  contactEmail: 'admin@cardmi.com',
  logo: '',
  timezone: 'Asia/Shanghai'
})

// 安全设置表单
const securityForm = reactive({
  minPasswordLength: 8,
  passwordComplexity: ['lowercase', 'number'],
  loginFailLock: true,
  maxFailAttempts: 5,
  lockDuration: 30,
  sessionTimeout: 120,
  forceHttps: false,
  ipWhitelist: ''
})

// 通知设置表单
const notificationForm = reactive({
  emailNotification: true,
  smtpHost: 'smtp.qq.com',
  smtpPort: 587,
  senderEmail: '',
  emailPassword: '',
  smsNotification: false,
  smsProvider: '',
  smsAccessKey: '',
  smsSecretKey: '',
  notificationTypes: ['login', 'system']
})

// 系统信息
const systemInfo = reactive({
  version: '1.0.0',
  uptime: '7天 12小时 30分钟',
  serverTime: new Date().toLocaleString(),
  dbVersion: 'MySQL 8.0.28',
  cpuUsage: 35,
  memoryUsage: 68,
  diskUsage: 45,
  onlineUsers: 23
})

// 时区选项
const timezoneOptions = [
  { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
  { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
  { label: '纽约时间 (UTC-5)', value: 'America/New_York' },
  { label: '伦敦时间 (UTC+0)', value: 'Europe/London' },
  { label: '巴黎时间 (UTC+1)', value: 'Europe/Paris' }
]

// 表单验证规则
const basicRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const securityRules = {
  minPasswordLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, message: '请设置会话超时时间', trigger: 'blur' }
  ]
}

// Logo上传前检查
const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Logo只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// Logo上传成功
const handleLogoSuccess = (response, file) => {
  basicForm.logo = URL.createObjectURL(file.raw)
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// 保存基础设置
const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return
  
  try {
    const valid = await basicFormRef.value.validate()
    if (!valid) return
    
    basicLoading.value = true
    
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('基础设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    basicLoading.value = false
  }
}

// 保存安全设置
const handleSecuritySubmit = async () => {
  if (!securityFormRef.value) return
  
  try {
    const valid = await securityFormRef.value.validate()
    if (!valid) return
    
    securityLoading.value = true
    
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    securityLoading.value = false
  }
}

// 保存通知设置
const handleNotificationSubmit = async () => {
  notificationLoading.value = true
  
  try {
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('通知设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    notificationLoading.value = false
  }
}

// 测试邮件通知
const testNotification = async () => {
  try {
    // 模拟发送测试邮件
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('测试邮件发送成功')
  } catch (error) {
    ElMessage.error('测试邮件发送失败')
  }
}

// 重置表单
const resetBasicForm = () => {
  basicFormRef.value?.resetFields()
}

const resetSecurityForm = () => {
  securityFormRef.value?.resetFields()
}

const resetNotificationForm = () => {
  notificationFormRef.value?.resetFields()
}

// 刷新系统信息
const refreshSystemInfo = async () => {
  try {
    // 模拟获取系统信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新随机数据
    systemInfo.cpuUsage = Math.floor(Math.random() * 100)
    systemInfo.memoryUsage = Math.floor(Math.random() * 100)
    systemInfo.diskUsage = Math.floor(Math.random() * 100)
    systemInfo.onlineUsers = Math.floor(Math.random() * 50) + 10
    systemInfo.serverTime = new Date().toLocaleString()
    
    ElMessage.success('系统信息已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  }
}

// 清理缓存
const clearCache = () => {
  ElMessageBox.confirm(
    '确认清理系统缓存？此操作可能会影响系统性能。',
    '清理缓存',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 模拟清理缓存
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('缓存清理成功')
    } catch (error) {
      ElMessage.error('缓存清理失败')
    }
  })
}

// 导出日志
const exportLogs = () => {
  ElMessage.success('日志导出功能开发中...')
}

// 组件挂载时初始化
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.logo-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.logo {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-config {
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid var(--el-border-color-light);
}

.system-info {
  padding: 20px 0;
}

.info-actions {
  margin-top: 30px;
  text-align: center;
}

.info-actions .el-button {
  margin: 0 8px;
}
</style>