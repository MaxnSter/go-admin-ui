import { createApp } from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/styles/admin.scss'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import { getDicts } from '@/api/admin/dict/data'
import { getItems, setItems } from '@/api/table'
import { getConfigKey } from '@/api/admin/sys-config'
import { parseTime, resetForm, addDateRange, selectDictLabel, /* download,*/ selectItemsLabel } from '@/utils/costum'

import Icons from './icons' // icon
import './permission' // permission control
import ErrorLog from './utils/error-log' // error log

import Viser from 'viser-vue'

import * as filters from './filters' // global filters

import Pagination from '@/components/Pagination'
import BasicLayout from '@/layout/BasicLayout'

import VueParticles from 'vue-particles'

import '@/utils/dialog'

// 全局方法
const app = createApp(App)
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.getItems = getItems
app.config.globalProperties.setItems = setItems
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectItemsLabel = selectItemsLabel

// 全局组件
app.component('Pagination', Pagination)
app.component('BasicLayout', BasicLayout)

app.config.globalProperties.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

app.config.globalProperties.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

app.config.globalProperties.msgInfo = function(msg) {
  this.$message.info(msg)
}

app.use(permission)

app.use(ElementPlus, {
  size: Cookies.get('size') || 'medium'
})

import VueDND from 'awe-dnd'
app.use(VueDND)

import 'remixicon/fonts/remixicon.css'

console.info(`欢迎使用go-admin，谢谢您对我们的支持，在使用过程中如果有什么问题，
请访问https://github.com/go-admin-team/go-admin 或者
 https://github.com/go-admin-team/go-admin-ui 向我们反馈，
 谢谢！`)

// register global utility filters
Object.keys(filters).forEach(key => {
  app.config.globalProperties[key] = filters[key]
})

app.config.productionTip = false

app
  .use(Viser)
  .use(VueCodemirror)
  .use(VueParticles)
  .use(Icons)
  .use(ErrorLog)
  .use(router)
  .use(store)
  .mount('#app')
