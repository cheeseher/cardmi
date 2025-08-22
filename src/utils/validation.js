/**
 * 表单验证工具
 * 提供统一的验证规则和验证方法
 */

// 常用正则表达式
const patterns = {
  // 手机号
  phone: /^1[3-9]\d{9}$/,
  // 邮箱
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 身份证号
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 密码（8-20位，包含字母和数字）
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/,
  // 用户名（3-20位字母数字下划线）
  username: /^[a-zA-Z0-9_]{3,20}$/,
  // 中文姓名
  chineseName: /^[\u4e00-\u9fa5]{2,10}$/,
  // 数字
  number: /^\d+$/,
  // 小数
  decimal: /^\d+(\.\d+)?$/,
  // URL
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  // IP地址
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
}

/**
 * 创建必填验证规则
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {object} 验证规则
 */
export const createRequiredRule = (message = '此项为必填项', trigger = 'blur') => {
  return {
    required: true,
    message,
    trigger
  }
}

/**
 * 创建长度验证规则
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {object} 验证规则
 */
export const createLengthRule = (min, max, message, trigger = 'blur') => {
  const defaultMessage = `长度在 ${min} 到 ${max} 个字符`
  return {
    min,
    max,
    message: message || defaultMessage,
    trigger
  }
}

/**
 * 创建正则验证规则
 * @param {RegExp} pattern - 正则表达式
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {object} 验证规则
 */
export const createPatternRule = (pattern, message, trigger = 'blur') => {
  return {
    pattern,
    message,
    trigger
  }
}

/**
 * 创建自定义验证规则
 * @param {function} validator - 验证函数
 * @param {string} trigger - 触发方式
 * @returns {object} 验证规则
 */
export const createCustomRule = (validator, trigger = 'blur') => {
  return {
    validator,
    trigger
  }
}

/**
 * 手机号验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const phoneRules = (message = '请输入正确的手机号', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入手机号'))
  }
  rules.push(createPatternRule(patterns.phone, message))
  return rules
}

/**
 * 邮箱验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const emailRules = (message = '请输入正确的邮箱地址', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入邮箱地址'))
  }
  rules.push(createPatternRule(patterns.email, message))
  return rules
}

/**
 * 密码验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const passwordRules = (message = '密码必须包含字母和数字，长度8-20位', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入密码'))
  }
  rules.push(createLengthRule(8, 20, '密码长度在8到20个字符'))
  rules.push(createPatternRule(patterns.password, message))
  return rules
}

/**
 * 用户名验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const usernameRules = (message = '用户名只能包含字母、数字和下划线，长度3-20位', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入用户名'))
  }
  rules.push(createLengthRule(3, 20, '用户名长度在3到20个字符'))
  rules.push(createPatternRule(patterns.username, message))
  return rules
}

/**
 * 中文姓名验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const chineseNameRules = (message = '请输入正确的中文姓名', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入姓名'))
  }
  rules.push(createPatternRule(patterns.chineseName, message))
  return rules
}

/**
 * 身份证号验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const idCardRules = (message = '请输入正确的身份证号', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入身份证号'))
  }
  rules.push(createPatternRule(patterns.idCard, message))
  return rules
}

/**
 * 数字验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const numberRules = (message = '请输入正确的数字', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入数字'))
  }
  rules.push(createPatternRule(patterns.number, message))
  return rules
}

/**
 * URL验证规则
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const urlRules = (message = '请输入正确的URL地址', required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入URL地址'))
  }
  rules.push(createPatternRule(patterns.url, message))
  return rules
}

/**
 * 确认密码验证规则
 * @param {string} password - 原密码字段名
 * @param {string} message - 错误消息
 * @returns {array} 验证规则数组
 */
export const confirmPasswordRules = (password = 'password', message = '两次输入密码不一致') => {
  return [
    createRequiredRule('请再次输入密码'),
    createCustomRule((rule, value, callback) => {
      if (value !== rule.form[password]) {
        callback(new Error(message))
      } else {
        callback()
      }
    })
  ]
}

/**
 * 数值范围验证规则
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} message - 错误消息
 * @param {boolean} required - 是否必填
 * @returns {array} 验证规则数组
 */
export const rangeRules = (min, max, message, required = true) => {
  const rules = []
  if (required) {
    rules.push(createRequiredRule('请输入数值'))
  }
  
  const defaultMessage = `数值范围在 ${min} 到 ${max} 之间`
  rules.push(createCustomRule((rule, value, callback) => {
    const num = Number(value)
    if (isNaN(num) || num < min || num > max) {
      callback(new Error(message || defaultMessage))
    } else {
      callback()
    }
  }))
  
  return rules
}

/**
 * 验证表单
 * @param {object} formRef - 表单引用
 * @returns {Promise<boolean>} 验证结果
 */
export const validateForm = async (formRef) => {
  if (!formRef) {
    console.warn('表单引用不存在')
    return false
  }
  
  try {
    await formRef.validate()
    return true
  } catch (error) {
    console.warn('表单验证失败:', error)
    return false
  }
}

/**
 * 重置表单
 * @param {object} formRef - 表单引用
 */
export const resetForm = (formRef) => {
  if (formRef) {
    formRef.resetFields()
  }
}

/**
 * 清除表单验证
 * @param {object} formRef - 表单引用
 */
export const clearValidation = (formRef) => {
  if (formRef) {
    formRef.clearValidate()
  }
}

// 导出正则表达式模式
export { patterns }

// 默认导出所有方法
export default {
  patterns,
  createRequiredRule,
  createLengthRule,
  createPatternRule,
  createCustomRule,
  phoneRules,
  emailRules,
  passwordRules,
  usernameRules,
  chineseNameRules,
  idCardRules,
  numberRules,
  urlRules,
  confirmPasswordRules,
  rangeRules,
  validateForm,
  resetForm,
  clearValidation
}