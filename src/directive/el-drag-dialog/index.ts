import drag from './drag'
import type { App } from 'vue'

const install = function(app: App) {
  app.directive('el-drag-dialog', drag)
}

export default {
  install
}

export { drag } 