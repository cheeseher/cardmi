import { useUserStore } from '@/stores/user'

/**
 * 检查用户是否有指定权限
 * @param {string|Array} permission 权限标识
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const userStore = useUserStore()
  
  if (!permission) return true
  
  if (Array.isArray(permission)) {
    return permission.some(p => userStore.hasPermission(p))
  }
  
  return userStore.hasPermission(permission)
}

/**
 * 权限指令
 */
export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding
    
    if (!hasPermission(value)) {
      el.style.display = 'none'
    }
  },
  
  updated(el, binding) {
    const { value } = binding
    
    if (!hasPermission(value)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}