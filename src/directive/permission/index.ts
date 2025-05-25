import type { App } from 'vue'
import permission from './permission'
import permisaction from './permisaction'

export default {
  install(app: App) {
    app.directive('permission', permission)
    app.directive('permisaction', permisaction)
  }
}
