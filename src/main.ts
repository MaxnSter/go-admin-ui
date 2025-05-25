import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

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
import icons from './icons'

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
app.use(createPinia())
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

// 全局属性（替代 Vue.prototype）
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