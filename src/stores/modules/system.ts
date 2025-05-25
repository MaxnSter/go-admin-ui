import { defineStore } from 'pinia'
import { getSetting } from '@/api/login'
import storage from '@/utils/storage'

export const useSystemStore = defineStore('system', {
  state: () => ({
    info: storage.get('app_info')
  }),
  actions: {
    async settingDetail() {
      const { data } = await getSetting()
      this.info = data
      storage.set('app_info', data)
      return data
    }
  }
})
