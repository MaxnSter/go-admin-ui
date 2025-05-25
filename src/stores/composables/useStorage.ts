import Cookies from 'js-cookie'
// @ts-ignore - storage.js 没有类型声明
import storage from '@/utils/storage'

/**
 * 存储相关的共享逻辑
 */
export function useStorage() {
  /**
   * Cookie 操作
   */
  const cookie = {
    get: (key: string): string | undefined => {
      return Cookies.get(key)
    },
    set: (key: string, value: string | number, options?: Cookies.CookieAttributes): void => {
      Cookies.set(key, String(value), options)
    },
    remove: (key: string): void => {
      Cookies.remove(key)
    }
  }

  /**
   * LocalStorage 操作
   */
  const local = {
    get: <T = any>(key: string): T | null => {
      return storage.get(key)
    },
    set: (key: string, value: any): void => {
      storage.set(key, value)
    },
    remove: (key: string): void => {
      storage.remove(key)
    },
    clear: (): void => {
      storage.clear()
    }
  }

  /**
   * SessionStorage 操作
   */
  const session = {
    get: <T = any>(key: string): T | null => {
      try {
        const item = sessionStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    },
    set: (key: string, value: any): void => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('SessionStorage set error:', error)
      }
    },
    remove: (key: string): void => {
      sessionStorage.removeItem(key)
    },
    clear: (): void => {
      sessionStorage.clear()
    }
  }

  return {
    cookie,
    local,
    session
  }
} 