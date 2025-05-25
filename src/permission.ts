import router from './router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta?.title as string)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      NProgress.done()
      return '/'
    } else {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()
      
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        return true
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await userStore.getUserInfo()

          // generate accessible routes map based on roles
          const accessRoutes = await permissionStore.generateRoutes(roles)

          // dynamically add accessible routes
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // hack method to ensure that addRoute is complete
          // set the replace: true, so the navigation will not leave a history record
          return { ...to, replace: true }
        } catch (error) {
          // remove token and go to login page to re-login
          // await userStore.resetToken()
          ElMessage.error((error as Error)?.message || 'Has Error')
          NProgress.done()
          return `/login?redirect=${to.path}`
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      return true
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      NProgress.done()
      return `/login?redirect=${to.path}`
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
}) 