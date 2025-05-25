import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '../composables/useStorage'
import type { SidebarState } from '../types'

export const useAppStore = defineStore('app', () => {
  // 使用存储相关的 composable
  const { cookie } = useStorage()

  // 状态定义
  const sidebar = ref<SidebarState>({
    opened: cookie.get('sidebarStatus') ? !!+cookie.get('sidebarStatus')! : true,
    withoutAnimation: false
  })
  const device = ref<string>('desktop')
  const size = ref<string>(cookie.get('size') || 'medium')

  // Actions
  /**
   * 切换侧边栏
   */
  const toggleSideBar = (): void => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    if (sidebar.value.opened) {
      cookie.set('sidebarStatus', 1)
    } else {
      cookie.set('sidebarStatus', 0)
    }
  }

  /**
   * 关闭侧边栏
   */
  const closeSideBar = (withoutAnimation: boolean): void => {
    cookie.set('sidebarStatus', 0)
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  /**
   * 切换设备类型
   */
  const toggleDevice = (deviceType: string): void => {
    device.value = deviceType
  }

  /**
   * 设置尺寸
   */
  const setSize = (newSize: string): void => {
    size.value = newSize
    cookie.set('size', newSize)
  }

  return {
    // 状态
    sidebar,
    device,
    size,
    
    // 方法
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setSize
  }
}, {
  persist: {
    key: 'app-store',
    storage: localStorage
  }
}) 