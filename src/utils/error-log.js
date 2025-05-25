import { nextTick } from 'vue'
import store from '@/stores'
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

// Vue 3 中错误处理需要在应用实例上配置
// 这个文件现在只导出错误处理函数，在 main.js 中使用
export function setupErrorHandler(app) {
  if (checkNeed()) {
    app.config.errorHandler = function(err, vm, info) {
      // 使用 nextTick 来确保错误处理的正确性
      nextTick(() => {
        store.dispatch('errorLog/addErrorLog', {
          err,
          vm,
          info,
          url: window.location.href
        })
        console.error(err, info)
      })
    }
  }
}
