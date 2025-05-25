import router from './router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { useSystemStore } from '@/stores/modules/system'
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

  // 初始化系统信息（如果还没有加载）
  const systemStore = useSystemStore()
  if (!systemStore.info) {
    try {
      await systemStore.settingDetail()
    } catch (error) {
      console.warn('Failed to load system settings:', error)
    }
  }

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
      const hasRoutes = permissionStore.routes && permissionStore.routes.length > 0
      

      
              if (hasRoles && hasRoutes) {
          // 用户有角色且权限store中有路由数据，直接通过
          return true
        } else {
          try {
            // get user info (如果没有角色的话)
            let roles = userStore.roles
            if (!hasRoles) {
              const response = await userStore.getUserInfo()
              roles = response.data.roles
            }

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
    
    // 在开发环境下，如果没有token但不是登录页面，设置一个模拟token并继续
    if ((import.meta as any).env.DEV && to.path !== '/login') {
      const userStore = useUserStore()
      
      // 设置模拟token
      userStore.token = 'mock-dev-token'
      
      // 尝试获取用户信息和生成路由
      try {
        const { roles } = await userStore.getUserInfo()
        const permissionStore = usePermissionStore()
        
        const accessRoutes = await permissionStore.generateRoutes(roles)
        
        // dynamically add accessible routes
        accessRoutes.forEach(route => {
          router.addRoute(route)
        })
        
        return { ...to, replace: true }
      } catch (error) {
        // 如果模拟登录也失败，继续正常流程
      }
    }
    
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