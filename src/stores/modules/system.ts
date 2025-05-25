import { defineStore } from 'pinia'
import { ref } from 'vue'
// @ts-ignore - API 模块没有类型声明
import { getSetting } from '@/api/login'
import { useStorage } from '../composables/useStorage'
import type { SystemInfo } from '../types'

export const useSystemStore = defineStore('system', () => {
  // 使用存储相关的 composable
  const { local } = useStorage()

  // 状态定义
  const info = ref<SystemInfo | null>(local.get('app_info'))

  // Actions
  /**
   * 设置系统信息
   */
  const setInfo = (data: SystemInfo): void => {
    info.value = data
    local.set('app_info', data)
  }

  /**
   * 获取系统设置详情
   */
  const settingDetail = async (): Promise<SystemInfo> => {
    try {
      const response = await getSetting()
      const { data } = response
      setInfo(data)
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * 清除系统信息
   */
  const clearInfo = (): void => {
    info.value = null
    local.remove('app_info')
  }

  return {
    // 状态
    info,
    
    // 方法
    setInfo,
    settingDetail,
    clearInfo
  }
}) 