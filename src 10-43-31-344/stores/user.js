import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref({
    id: 1,
    username: 'admin',
    nickname: '管理员',
    avatar: '',
    email: 'admin@cardmi.com',
    roles: ['admin']
  })

  // 登录状态
  const isLoggedIn = ref(true)

  // 权限列表
  const permissions = ref([
    'user:view',
    'user:add',
    'user:edit',
    'user:delete',
    'order:view',
    'order:add',
    'order:edit',
    'order:delete'
  ])

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info }
  }

  // 设置登录状态
  const setLoginStatus = (status) => {
    isLoggedIn.value = status
  }

  // 设置权限
  const setPermissions = (perms) => {
    permissions.value = perms
  }

  // 检查权限
  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 登出
  const logout = () => {
    userInfo.value = {}
    isLoggedIn.value = false
    permissions.value = []
  }

  return {
    userInfo,
    isLoggedIn,
    permissions,
    setUserInfo,
    setLoginStatus,
    setPermissions,
    hasPermission,
    logout
  }
})