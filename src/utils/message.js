import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

/**
 * 全局消息提示工具
 * 提供统一的消息提示、确认对话框和通知功能
 */

// 消息提示配置
const messageConfig = {
  duration: 3000,
  showClose: true,
  grouping: true
}

// 通知配置
const notificationConfig = {
  duration: 4500,
  showClose: true
}

/**
 * 成功消息
 * @param {string} message - 消息内容
 * @param {object} options - 额外配置
 */
export const showSuccess = (message, options = {}) => {
  return ElMessage.success({
    message,
    ...messageConfig,
    ...options
  })
}

/**
 * 错误消息
 * @param {string} message - 消息内容
 * @param {object} options - 额外配置
 */
export const showError = (message, options = {}) => {
  return ElMessage.error({
    message,
    ...messageConfig,
    duration: 5000, // 错误消息显示时间更长
    ...options
  })
}

/**
 * 警告消息
 * @param {string} message - 消息内容
 * @param {object} options - 额外配置
 */
export const showWarning = (message, options = {}) => {
  return ElMessage.warning({
    message,
    ...messageConfig,
    ...options
  })
}

/**
 * 信息消息
 * @param {string} message - 消息内容
 * @param {object} options - 额外配置
 */
export const showInfo = (message, options = {}) => {
  return ElMessage.info({
    message,
    ...messageConfig,
    ...options
  })
}

/**
 * 确认对话框
 * @param {string} message - 确认消息
 * @param {string} title - 对话框标题
 * @param {object} options - 额外配置
 * @returns {Promise}
 */
export const showConfirm = (message, title = '提示', options = {}) => {
  const defaultOptions = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showCancelButton: true,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }
  
  return ElMessageBox.confirm(message, title, {
    ...defaultOptions,
    ...options
  })
}

/**
 * 删除确认对话框
 * @param {string} message - 确认消息
 * @param {object} options - 额外配置
 * @returns {Promise}
 */
export const showDeleteConfirm = (message = '此操作将永久删除该数据，是否继续？', options = {}) => {
  return showConfirm(message, '删除确认', {
    type: 'error',
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
    ...options
  })
}

/**
 * 批量删除确认对话框
 * @param {number} count - 删除数量
 * @param {object} options - 额外配置
 * @returns {Promise}
 */
export const showBatchDeleteConfirm = (count, options = {}) => {
  const message = `此操作将永久删除选中的 ${count} 条数据，是否继续？`
  return showDeleteConfirm(message, options)
}

/**
 * 成功通知
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {object} options - 额外配置
 */
export const showSuccessNotification = (title, message = '', options = {}) => {
  return ElNotification.success({
    title,
    message,
    ...notificationConfig,
    ...options
  })
}

/**
 * 错误通知
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {object} options - 额外配置
 */
export const showErrorNotification = (title, message = '', options = {}) => {
  return ElNotification.error({
    title,
    message,
    ...notificationConfig,
    duration: 6000, // 错误通知显示时间更长
    ...options
  })
}

/**
 * 警告通知
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {object} options - 额外配置
 */
export const showWarningNotification = (title, message = '', options = {}) => {
  return ElNotification.warning({
    title,
    message,
    ...notificationConfig,
    ...options
  })
}

/**
 * 信息通知
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {object} options - 额外配置
 */
export const showInfoNotification = (title, message = '', options = {}) => {
  return ElNotification.info({
    title,
    message,
    ...notificationConfig,
    ...options
  })
}

/**
 * 处理API错误响应
 * @param {Error|object} error - 错误对象
 * @param {string} defaultMessage - 默认错误消息
 */
export const handleApiError = (error, defaultMessage = '操作失败，请稍后重试') => {
  let message = defaultMessage
  
  if (error?.response?.data?.message) {
    message = error.response.data.message
  } else if (error?.message) {
    message = error.message
  }
  
  showError(message)
}

/**
 * 处理API成功响应
 * @param {string} message - 成功消息
 * @param {boolean} useNotification - 是否使用通知形式
 */
export const handleApiSuccess = (message = '操作成功', useNotification = false) => {
  if (useNotification) {
    showSuccessNotification('操作成功', message)
  } else {
    showSuccess(message)
  }
}

// 默认导出所有方法
export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showDeleteConfirm,
  showBatchDeleteConfirm,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  handleApiError,
  handleApiSuccess
}