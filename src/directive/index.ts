import permission from './permission'
import elDragDialog from './el-drag-dialog'
import elTable from './el-table'
import sticky from './sticky'
import wavesDirective from './waves'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.use(permission)
    app.use(elDragDialog)
    app.use(elTable)
    app.use(sticky)
    app.use(wavesDirective)
  }
}

export {
  permission,
  elDragDialog,
  elTable,
  sticky,
  wavesDirective as waves
} 