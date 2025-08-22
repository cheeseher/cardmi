import { ElLoading } from 'element-plus'
import { ref } from 'vue'

/**
 * 全局加载状态管理工具
 * 提供统一的加载状态控制和页面级加载遮罩
 */

// 全局加载状态
const globalLoading = ref(false)

// 页面级加载实例
let loadingInstance = null

/**
 * 显示全屏加载
 * @param {string} text - 加载文本
 * @param {object} options - 额外配置
 * @returns {object} 加载实例
 */
export const showLoading = (text = '加载中...', options = {}) => {
  const defaultOptions = {
    lock: true,
    text,
    background: 'rgba(0, 0, 0, 0.7)',
    spinner: 'el-icon-loading',
    customClass: 'global-loading'
  }
  
  loadingInstance = ElLoading.service({
    ...defaultOptions,
    ...options
  })
  
  globalLoading.value = true
  return loadingInstance
}

/**
 * 隐藏全屏加载
 */
export const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
  globalLoading.value = false
}

/**
 * 显示目标元素加载
 * @param {string|HTMLElement} target - 目标元素选择器或DOM元素
 * @param {string} text - 加载文本
 * @param {object} options - 额外配置
 * @returns {object} 加载实例
 */
export const showTargetLoading = (target, text = '加载中...', options = {}) => {
  const defaultOptions = {
    target,
    lock: true,
    text,
    background: 'rgba(255, 255, 255, 0.9)',
    customClass: 'target-loading'
  }
  
  return ElLoading.service({
    ...defaultOptions,
    ...options
  })
}

/**
 * 创建响应式加载状态
 * @param {boolean} initialValue - 初始值
 * @returns {object} 包含loading状态和控制方法的对象
 */
export const useLoading = (initialValue = false) => {
  const loading = ref(initialValue)
  
  const setLoading = (value) => {
    loading.value = value
  }
  
  const startLoading = () => {
    loading.value = true
  }
  
  const stopLoading = () => {
    loading.value = false
  }
  
  const withLoading = async (asyncFn) => {
    try {
      startLoading()
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }
  
  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading
  }
}

/**
 * 创建表格加载状态
 * @returns {object} 表格加载状态管理对象
 */
export const useTableLoading = () => {
  const { loading, startLoading, stopLoading, withLoading } = useLoading()
  
  const loadTableData = async (loadFn) => {
    return withLoading(loadFn)
  }
  
  return {
    tableLoading: loading,
    startTableLoading: startLoading,
    stopTableLoading: stopLoading,
    loadTableData
  }
}

/**
 * 创建表单提交加载状态
 * @returns {object} 表单提交加载状态管理对象
 */
export const useSubmitLoading = () => {
  const { loading, startLoading, stopLoading, withLoading } = useLoading()
  
  const submitForm = async (submitFn) => {
    return withLoading(submitFn)
  }
  
  return {
    submitLoading: loading,
    startSubmitLoading: startLoading,
    stopSubmitLoading: stopLoading,
    submitForm
  }
}

/**
 * 创建按钮加载状态
 * @returns {object} 按钮加载状态管理对象
 */
export const useButtonLoading = () => {
  const loadingStates = ref({})
  
  const setButtonLoading = (key, value) => {
    loadingStates.value[key] = value
  }
  
  const startButtonLoading = (key) => {
    loadingStates.value[key] = true
  }
  
  const stopButtonLoading = (key) => {
    loadingStates.value[key] = false
  }
  
  const withButtonLoading = async (key, asyncFn) => {
    try {
      startButtonLoading(key)
      const result = await asyncFn()
      return result
    } finally {
      stopButtonLoading(key)
    }
  }
  
  const isButtonLoading = (key) => {
    return loadingStates.value[key] || false
  }
  
  return {
    loadingStates,
    setButtonLoading,
    startButtonLoading,
    stopButtonLoading,
    withButtonLoading,
    isButtonLoading
  }
}

/**
 * 获取全局加载状态
 * @returns {Ref<boolean>} 全局加载状态
 */
export const getGlobalLoading = () => {
  return globalLoading
}

// 默认导出所有方法
export default {
  showLoading,
  hideLoading,
  showTargetLoading,
  useLoading,
  useTableLoading,
  useSubmitLoading,
  useButtonLoading,
  getGlobalLoading
}