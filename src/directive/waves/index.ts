import waves from './waves'
import type { App } from 'vue'

const install = function(app: App) {
  app.directive('waves', waves)
}

export default {
  install
}

export { waves } 