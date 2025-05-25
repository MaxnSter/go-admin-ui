import router from './router'
import { useUserStore, usePermissionStore } from './stores'
import { ElMessage } from 'element-plus'
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
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (hasToken) {
    if (to.path === '/login') {
      NProgress.done()
      return { path: '/' }
    }

    const hasRoles = userStore.roles && userStore.roles.length > 0
    if (hasRoles) {
      return true
    }
    try {
      const userInfo = await userStore.getInfo()
      const roles = userInfo?.roles || []
      const accessRoutes = await permissionStore.generateRoutes(roles)
      accessRoutes.forEach((route: any) => router.addRoute(route))
      return { ...to, replace: true }
    } catch (error) {
      ElMessage.error(error as string || 'Has Error')
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
