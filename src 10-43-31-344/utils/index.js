/**
 * 通用工具函数库
 * 包含常用的格式化、验证、转换等工具方法
 */

/**
 * 日期时间格式化
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 相对时间格式化
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 数字格式化
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Number(num).toFixed(decimals)
}

/**
 * 千分位格式化
 */
export const formatThousands = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Number(num).toLocaleString()
}

/**
 * 文件大小格式化
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 货币格式化
 */
export const formatCurrency = (amount, currency = '¥', decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency}0.00`
  return `${currency}${Number(amount).toFixed(decimals)}`
}

/**
 * 百分比格式化
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${(Number(value) * 100).toFixed(decimals)}%`
}

/**
 * 手机号格式化（脱敏）
 */
export const formatPhone = (phone, mask = true) => {
  if (!phone) return ''
  
  const phoneStr = String(phone)
  if (phoneStr.length !== 11) return phoneStr
  
  if (mask) {
    return phoneStr.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  
  return phoneStr.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

/**
 * 身份证号格式化（脱敏）
 */
export const formatIdCard = (idCard, mask = true) => {
  if (!idCard) return ''
  
  const idStr = String(idCard)
  if (idStr.length !== 18) return idStr
  
  if (mask) {
    return idStr.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }
  
  return idStr
}

/**
 * 邮箱格式化（脱敏）
 */
export const formatEmail = (email, mask = true) => {
  if (!email) return ''
  
  if (!mask) return email
  
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : username
  
  return `${maskedUsername}@${domain}`
}

/**
 * 字符串截断
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * 首字母大写
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转下划线
 */
export const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * 下划线转驼峰
 */
export const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * 生成随机字符串
 */
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 深拷贝
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 防抖函数
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 数组去重
 */
export const unique = (arr, key) => {
  if (!Array.isArray(arr)) return []
  
  if (key) {
    const seen = new Set()
    return arr.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }
  
  return [...new Set(arr)]
}

/**
 * 数组分组
 */
export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {}
  
  return arr.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

/**
 * 数组排序
 */
export const sortBy = (arr, key, order = 'asc') => {
  if (!Array.isArray(arr)) return []
  
  return [...arr].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * 获取对象深层属性值
 */
export const get = (obj, path, defaultValue = undefined) => {
  if (!obj || !path) return defaultValue
  
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue
    }
    result = result[key]
  }
  
  return result
}

/**
 * 设置对象深层属性值
 */
export const set = (obj, path, value) => {
  if (!obj || !path) return obj
  
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
  return obj
}

/**
 * 验证函数
 */
export const validators = {
  // 邮箱验证
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },
  
  // 手机号验证
  phone: (phone) => {
    const re = /^1[3-9]\d{9}$/
    return re.test(phone)
  },
  
  // 身份证验证
  idCard: (idCard) => {
    const re = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return re.test(idCard)
  },
  
  // URL验证
  url: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  
  // 密码强度验证（至少8位，包含大小写字母和数字）
  password: (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return re.test(password)
  },
  
  // 中文验证
  chinese: (text) => {
    const re = /^[\u4e00-\u9fa5]+$/
    return re.test(text)
  },
  
  // 数字验证
  number: (value) => {
    return !isNaN(value) && isFinite(value)
  },
  
  // 整数验证
  integer: (value) => {
    return Number.isInteger(Number(value))
  },
  
  // 正整数验证
  positiveInteger: (value) => {
    const num = Number(value)
    return Number.isInteger(num) && num > 0
  }
}

/**
 * 本地存储工具
 */
export const storage = {
  // 设置localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },
  
  // 获取localStorage
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch (error) {
      console.error('localStorage get error:', error)
      return defaultValue
    }
  },
  
  // 删除localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },
  
  // 清空localStorage
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}

/**
 * 下载文件
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 导出数据为CSV
 */
export const exportCSV = (data, filename = 'export.csv') => {
  if (!Array.isArray(data) || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}

/**
 * 复制到剪贴板
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else {
      // 兼容旧浏览器
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    return true
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 获取浏览器信息
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)
  const isFirefox = /Firefox/.test(ua)
  const isSafari = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor)
  const isEdge = /Edg/.test(ua)
  const isIE = /Trident/.test(ua)
  
  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isIE,
    isMobile: /Mobi|Android/i.test(ua),
    userAgent: ua
  }
}

/**
 * 获取设备信息
 */
export const getDeviceInfo = () => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
    orientation: window.screen.orientation?.type || 'unknown',
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  }
}

export default {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatThousands,
  formatFileSize,
  formatCurrency,
  formatPercent,
  formatPhone,
  formatIdCard,
  formatEmail,
  truncate,
  capitalize,
  camelToSnake,
  snakeToCamel,
  randomString,
  generateUUID,
  deepClone,
  debounce,
  throttle,
  unique,
  groupBy,
  sortBy,
  get,
  set,
  validators,
  storage,
  downloadFile,
  exportCSV,
  copyToClipboard,
  getBrowserInfo,
  getDeviceInfo
}