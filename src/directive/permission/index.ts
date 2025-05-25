import permission from './permission'
import permisaction from './permisaction'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.directive('permission', permission)
    app.directive('permisaction', permisaction)
  }
}

export { permission, permisaction } 