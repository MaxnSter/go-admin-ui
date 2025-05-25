import { getToken, setToken, removeToken } from '@/utils/auth'

/**
 * 认证相关的共享逻辑
 */
export function useAuth() {
  /**
   * 获取存储的token
   */
  const getStoredToken = (): string => {
    return getToken() || ''
  }

  /**
   * 保存token到本地存储
   */
  const saveToken = (token: string): void => {
    setToken(token)
  }

  /**
   * 清除token
   */
  const clearToken = (): void => {
    removeToken()
  }

  /**
   * 检查是否已登录
   */
  const isAuthenticated = (token: string): boolean => {
    return !!token && token.length > 0
  }

  /**
   * 格式化头像URL
   */
  const formatAvatarUrl = (avatar: string): string => {
    if (!avatar) return ''
    if (avatar.indexOf('http') !== -1) {
      return avatar
    } else {
      return import.meta.env.VITE_APP_BASE_API + avatar
    }
  }

  return {
    getStoredToken,
    saveToken,
    clearToken,
    isAuthenticated,
    formatAvatarUrl
  }
} 