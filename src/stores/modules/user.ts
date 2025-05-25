import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// @ts-ignore - API 模块没有类型声明
import { login, logout, getInfo, refreshtoken } from '@/api/user'
import { useAuth } from '../composables/useAuth'
import { useStorage } from '../composables/useStorage'
import router, { resetRouter } from '@/router'
import type { UserInfo, LoginCredentials } from '../types'

export const useUserStore = defineStore('user', () => {
  // 使用 composables
  const auth = useAuth()
  const { local } = useStorage()

  // 状态定义
  const token = ref<string>(auth.getStoredToken())
  const name = ref<string>('')
  const avatar = ref<string>('')
  const introduction = ref<string>('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const permisaction = ref<string[]>([])

  // 计算属性
  const isLoggedIn = computed(() => auth.isAuthenticated(token.value))
  const hasRole = computed(() => (role: string) => roles.value.includes(role))
  const hasPermission = computed(() => (permission: string) => permisaction.value.includes(permission))

  // Actions
  /**
   * 用户登录
   */
  const loginAction = async (userInfo: LoginCredentials): Promise<void> => {
    try {
      const response = await login(userInfo)
      const { token: newToken } = response
      
      // 更新状态
      token.value = newToken
      auth.saveToken(newToken)
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async (): Promise<any> => {
    try {
      const response = await getInfo()
      
      if (!response || !response.data) {
        // 清除无效token
        token.value = ''
        auth.clearToken()
        return
      }

      const { roles: userRoles, name: userName, avatar: userAvatar, introduction: userIntro, permissions: userPermissions } = response.data

      // 角色必须是非空数组
      if (!userRoles || userRoles.length <= 0) {
        throw new Error('getInfo: roles must be a non-null array!')
      }

      // 更新状态
      roles.value = userRoles
      name.value = userName
      avatar.value = auth.formatAvatarUrl(userAvatar)
      introduction.value = userIntro
      permisaction.value = userPermissions

      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * 用户登出
   */
  const logOut = async (): Promise<void> => {
    try {
      await logout(token.value)
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // 清除状态
      token.value = ''
      roles.value = []
      permisaction.value = []
      name.value = ''
      avatar.value = ''
      introduction.value = ''
      
      // 清除本地存储
      auth.clearToken()
      local.clear()
    }
  }

  /**
   * 刷新token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const response = await refreshtoken({ token: token.value })
      const { token: newToken } = response
      
      token.value = newToken
      auth.saveToken(newToken)
    } catch (error) {
      throw error
    }
  }

  /**
   * 重置token
   */
  const resetToken = (): void => {
    token.value = ''
    auth.clearToken()
  }

  /**
   * 动态修改权限（用于角色切换）
   */
  const changeRoles = async (role: string): Promise<void> => {
    const newToken = role + '-token'

    token.value = newToken
    auth.saveToken(newToken)

    // 获取新的用户信息
    const { roles: newRoles } = await getUserInfo()

    // 重置路由
    resetRouter()

    // 这里需要调用权限store的方法生成路由
    // 由于循环依赖问题，这部分逻辑可能需要在组件中处理
    // const permissionStore = usePermissionStore()
    // const accessRoutes = await permissionStore.generateRoutes(newRoles)
    // router.addRoute(accessRoutes)

    // 重置标签页
    // const tagsViewStore = useTagsViewStore()
    // tagsViewStore.delAllViews()
  }

  /**
   * 设置用户信息
   */
  const setUserInfo = (userInfo: Partial<UserInfo>): void => {
    if (userInfo.name !== undefined) name.value = userInfo.name
    if (userInfo.avatar !== undefined) avatar.value = auth.formatAvatarUrl(userInfo.avatar)
    if (userInfo.introduction !== undefined) introduction.value = userInfo.introduction
    if (userInfo.roles !== undefined) roles.value = userInfo.roles
    if (userInfo.permissions !== undefined) permissions.value = userInfo.permissions
    if (userInfo.permisaction !== undefined) permisaction.value = userInfo.permisaction
  }

  return {
    // 状态
    token,
    name,
    avatar,
    introduction,
    roles,
    permissions,
    permisaction,
    
    // 计算属性
    isLoggedIn,
    hasRole,
    hasPermission,
    
    // 方法
    login: loginAction,
    getUserInfo,
    logOut,
    refreshToken,
    resetToken,
    changeRoles,
    setUserInfo
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage
  }
}) 