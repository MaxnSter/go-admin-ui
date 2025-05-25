import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 样式导入
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/styles/admin.scss'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 自定义指令
import directives from '@/directive'

// 图标
// @ts-ignore - icons 模块没有类型声明
import icons from './icons'

// 导入 SVG 图标虚拟模块
import 'virtual:svg-icons-register'

// 手动加载 SVG 图标（备用方案）
import { loadSvgIcons } from '@/utils/svg-icons'

// 权限控制
import './permission'

// 错误日志
import './utils/error-log'

// 全局组件
import Pagination from '@/components/Pagination/index.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(directives)
app.use(icons)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局组件
app.component('Pagination', Pagination)
app.component('BasicLayout', BasicLayout)

// 全局属性（Vue 3 方式）
app.config.globalProperties.msgSuccess = function(msg: string) {
  import('element-plus').then(({ ElMessage }) => {
    ElMessage({ showClose: true, message: msg, type: 'success' })
  })
}

app.config.globalProperties.msgError = function(msg: string) {
  import('element-plus').then(({ ElMessage }) => {
    ElMessage({ showClose: true, message: msg, type: 'error' })
  })
}

app.config.globalProperties.msgInfo = function(msg: string) {
  import('element-plus').then(({ ElMessage }) => {
    ElMessage.info(msg)
  })
}

console.info(`欢迎使用go-admin，谢谢您对我们的支持，在使用过程中如果有什么问题，
请访问https://github.com/go-admin-team/go-admin 或者
 https://github.com/go-admin-team/go-admin-ui 向我们反馈，
 谢谢！`)

// 挂载应用
app.mount('#app')

// 手动加载 SVG 图标（如果 vite-plugin-svg-icons 没有工作）
setTimeout(() => {
  if (!document.getElementById('__svg__icons__dom__')) {
    console.log('🔧 vite-plugin-svg-icons 未工作，使用手动加载')
    loadSvgIcons()
  }
}, 100) 