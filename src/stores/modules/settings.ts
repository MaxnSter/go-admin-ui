import { defineStore } from 'pinia'
import { ref } from 'vue'
// 直接使用 CSS 变量，不再导入 SCSS 文件
// import variables from '@/styles/element-variables.scss'
// @ts-ignore - 设置文件没有类型声明
import defaultSettings from '@/settings'
import type { AppSettings } from '../types'

const { showSettings, topNav, tagsView, fixedHeader, sidebarLogo, themeStyle } = defaultSettings

export const useSettingsStore = defineStore('settings', () => {
  // 状态定义
  const theme = ref<string>('#1890ff') // 使用默认主题色
  const showSettingsPanel = ref<boolean>(showSettings)
  const topNavigation = ref<boolean>(topNav)
  const tagsViewEnabled = ref<boolean>(tagsView)
  const fixedHeaderEnabled = ref<boolean>(fixedHeader)
  const sidebarLogoEnabled = ref<boolean>(sidebarLogo)
  const themeStyleValue = ref<string>(themeStyle)

  // Actions
  /**
   * 修改设置
   */
  const changeSetting = (key: keyof AppSettings, value: any): void => {
    switch (key) {
      case 'theme':
        theme.value = value
        break
      case 'showSettings':
        showSettingsPanel.value = value
        break
      case 'topNav':
        topNavigation.value = value
        break
      case 'tagsView':
        tagsViewEnabled.value = value
        break
      case 'fixedHeader':
        fixedHeaderEnabled.value = value
        break
      case 'sidebarLogo':
        sidebarLogoEnabled.value = value
        break
      case 'themeStyle':
        themeStyleValue.value = value
        break
      default:
        console.warn(`Unknown setting key: ${key}`)
    }
  }

  /**
   * 重置设置为默认值
   */
  const resetSettings = (): void => {
    theme.value = '#1890ff' // 使用默认主题色
    showSettingsPanel.value = showSettings
    topNavigation.value = topNav
    tagsViewEnabled.value = tagsView
    fixedHeaderEnabled.value = fixedHeader
    sidebarLogoEnabled.value = sidebarLogo
    themeStyleValue.value = themeStyle
  }

  return {
    // 状态
    theme,
    showSettings: showSettingsPanel,
    topNav: topNavigation,
    tagsView: tagsViewEnabled,
    fixedHeader: fixedHeaderEnabled,
    sidebarLogo: sidebarLogoEnabled,
    themeStyle: themeStyleValue,
    
    // 方法
    changeSetting,
    resetSettings
  }
}, {
  persist: {
    key: 'settings-store',
    storage: localStorage
  }
}) 