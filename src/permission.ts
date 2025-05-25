import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      NProgress.done()
      return { path: '/' }
    }

    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      return true
    }
    try {
      const { roles } = await store.dispatch('user/getInfo')
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      accessRoutes.forEach((route: any) => router.addRoute(route))
      return { ...to, replace: true }
    } catch (error) {
      Message.error(error || 'Has Error')
      NProgress.done()
      return `/login?redirect=${to.path}`
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      return true
    }
    NProgress.done()
    return `/login?redirect=${to.path}`
  }
})

router.afterEach(() => {
  NProgress.done()
})
