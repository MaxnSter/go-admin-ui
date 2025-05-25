import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './stores'
import ElementPlus, { ElMessage } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import '@/styles/element-variables.scss'

// 样式导入
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/styles/admin.scss'

// 图标
import './icons'
import { SvgIcon } from './icons'

// 权限控制
import './permission'
import PermissionDirective from '@/directive/permission'
import * as filters from '@/filters'

// 错误日志
import './utils/error-log'

// 全局组件
import Pagination from '@/components/Pagination/index.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

// 创建应用实例
const app = createApp(App)

// 使用插件
setupStore(app)
app.use(router)
app.use(ElementPlus)

// 注册所有图标组件
Object.entries(Icons).forEach(([key, component]) => {
  app.component(key, component)
})

// 注册 SvgIcon 组件
app.component('SvgIcon', SvgIcon)

app.use(PermissionDirective)

// 注册全局组件
app.component('Pagination', Pagination)
app.component('BasicLayout', BasicLayout)

Object.keys(filters).forEach((key) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.config.globalProperties[`$${key}`] = (filters as any)[key]
})

// 全局属性（替代 Vue.prototype）
app.config.globalProperties.msgSuccess = (msg: string) => {
  ElMessage.success(msg)
}

app.config.globalProperties.msgError = (msg: string) => {
  ElMessage.error(msg)
}

app.config.globalProperties.msgInfo = (msg: string) => {
  ElMessage.info(msg)
}

// 挂载应用
app.mount('#app')
