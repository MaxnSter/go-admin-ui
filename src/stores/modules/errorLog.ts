import { defineStore } from 'pinia'

export const useErrorLogStore = defineStore('errorLog', {
  state: () => ({
    logs: [] as any[]
  }),
  actions: {
    addErrorLog(log: any) {
      this.logs.push(log)
    },
    clearErrorLog() {
      this.logs.splice(0)
    }
  }
})
