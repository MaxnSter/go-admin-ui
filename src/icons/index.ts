import type { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 自动导入所有svg图标
const modules = import.meta.glob('./svg/*.svg', { eager: true })

export default {
  install(app: App) {
    // 全局注册SvgIcon组件
    app.component('SvgIcon', SvgIcon)
  }
} 