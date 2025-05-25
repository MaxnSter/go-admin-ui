import { defineStore } from 'pinia'
import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, topNav, tagsView, fixedHeader, sidebarLogo, themeStyle } = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: (variables as any).theme,
    showSettings,
    topNav,
    tagsView,
    fixedHeader,
    sidebarLogo,
    themeStyle
  }),
  actions: {
    changeSetting(data: { key: string; value: any }) {
      if (Object.prototype.hasOwnProperty.call(this, data.key)) {
        // @ts-ignore
        this[data.key] = data.value
      }
    }
  }
})
