import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './stores'

// 样式导入
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/styles/admin.scss'

// Element Plus 按需导入（通过 unplugin-vue-components 自动处理）
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

// 图标
import './icons'

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
setupStore(app)
app.use(router)

// 注册全局组件
app.component('Pagination', Pagination)
app.component('BasicLayout', BasicLayout)

// 全局属性（替代 Vue.prototype）
app.config.globalProperties.msgSuccess = function(msg: string) {
  // 这里需要在任务3中实现 Element Plus 的 message 组件
  console.log('Success:', msg)
}

app.config.globalProperties.msgError = function(msg: string) {
  console.log('Error:', msg)
}

app.config.globalProperties.msgInfo = function(msg: string) {
  console.log('Info:', msg)
}

// 挂载应用
app.mount('#app') 
