import { nextTick } from 'vue'
import { useErrorLogStore } from '@/stores/modules/errorLog'
import { isString, isArray } from '@/utils/validate'
import settings from '@/settings'

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  const errorLogStore = useErrorLogStore()
  
  // Vue 3 全局错误处理
  window.addEventListener('error', (event) => {
    nextTick(() => {
      errorLogStore.addErrorLog({
        err: event.error,
        vm: null,
        info: event.message,
        url: window.location.href
      })
      console.error(event.error, event.message)
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    nextTick(() => {
      errorLogStore.addErrorLog({
        err: event.reason,
        vm: null,
        info: 'Unhandled Promise Rejection',
        url: window.location.href
      })
      console.error(event.reason, 'Unhandled Promise Rejection')
    })
  })
}
