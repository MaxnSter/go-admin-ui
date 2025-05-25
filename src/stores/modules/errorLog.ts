import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ErrorLog } from '../types'

export const useErrorLogStore = defineStore('errorLog', () => {
  // 状态定义
  const logs = ref<ErrorLog[]>([])

  // Actions
  /**
   * 添加错误日志
   */
  const addErrorLog = (log: ErrorLog): void => {
    // 添加时间戳
    const logWithTime: ErrorLog = {
      ...log,
      time: log.time || new Date().toISOString()
    }
    logs.value.push(logWithTime)
  }

  /**
   * 清除错误日志
   */
  const clearErrorLog = (): void => {
    logs.value.splice(0)
  }

  /**
   * 删除指定错误日志
   */
  const removeErrorLog = (index: number): void => {
    if (index >= 0 && index < logs.value.length) {
      logs.value.splice(index, 1)
    }
  }

  /**
   * 获取错误日志数量
   */
  const getErrorLogCount = (): number => {
    return logs.value.length
  }

  /**
   * 获取最近的错误日志
   */
  const getRecentErrorLogs = (count: number = 10): ErrorLog[] => {
    return logs.value.slice(-count)
  }

  return {
    // 状态
    logs,
    
    // 方法
    addErrorLog,
    clearErrorLog,
    removeErrorLog,
    getErrorLogCount,
    getRecentErrorLogs
  }
}) 