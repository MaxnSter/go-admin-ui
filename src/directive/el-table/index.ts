import adaptive from './adaptive'
import type { App } from 'vue'

const install = function(app: App) {
  app.directive('el-height-adaptive-table', adaptive)
}

export default {
  install
}

export { adaptive } 