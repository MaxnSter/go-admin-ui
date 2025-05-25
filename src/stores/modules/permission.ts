import { defineStore } from 'pinia'
import { ref } from 'vue'
// @ts-ignore - 路由模块没有类型声明
import { asyncRoutes, constantRoutes } from '@/router'
// @ts-ignore - API 模块没有类型声明
import { getRoutes } from '@/api/admin/sys-role'
// @ts-ignore - Layout 组件没有类型声明
import Layout from '@/layout'
import { usePermission } from '../composables/usePermission'
// 导入模拟数据
import { mockMenuData } from '@/mock/menu-data'

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 */
export function generaMenu(routes: any[], data: any[]): void {
  data.forEach(item => {
    const menu: any = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : loadView(item.component),
      hidden: item.visible !== '0',
      children: [],
      name: item.menuName,
      meta: {
        title: item.title,
        icon: item.icon,
        noCache: item.noCache
      }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

// 路由懒加载 - 使用 Vite 动态导入，兼容 Vite 的限制
export const loadView = (view: string) => {
  // 移除开头的斜杠
  const normalizedView = view.startsWith('/') ? view.slice(1) : view
  
  // 为了兼容 Vite 的动态导入限制，我们需要使用更具体的路径模式
  // Vite 要求动态导入的路径相对静态
  
  try {
    // 根据路径的不同部分来构建导入
    const pathParts = normalizedView.split('/')
    
    if (pathParts.length === 1) {
      // 单级路径，如 "dashboard"
      return () => import(`@/views/${pathParts[0]}.vue`)
    } else if (pathParts.length === 2) {
      // 二级路径，如 "admin/user"
      return () => import(`@/views/${pathParts[0]}/${pathParts[1]}.vue`)
    } else if (pathParts.length === 3) {
      // 三级路径，如 "admin/sys-config/set"
      return () => import(`@/views/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}.vue`)
    } else {
      // 更深层次的路径，使用通用处理
      console.warn(`路径过深，可能导致动态导入失败: ${view}`)
      // 尝试使用完整路径，但可能会失败
      return () => import(`@/views/${normalizedView}.vue`)
    }
  } catch (error) {
    console.error(`动态导入组件失败: ${view}`, error)
    // 返回一个默认的错误组件
    return () => Promise.resolve({ default: { template: '<div>组件加载失败</div>' } })
  }
}

export const usePermissionStore = defineStore('permission', () => {
  // 使用权限相关的 composable
  const permission = usePermission()

  // 状态定义 - 使用 any 类型避免复杂的路由类型转换
  const routes = ref<any[]>([])
  const addRoutes = ref<any[]>([])
  const defaultRoutes = ref<any[]>([])
  const topbarRouters = ref<any[]>([])
  const sidebarRouters = ref<any[]>([])

  // Actions
  /**
   * 设置路由
   */
  const setRoutes = (newRoutes: any[]): void => {
    addRoutes.value = newRoutes
    routes.value = (constantRoutes as any[]).concat(newRoutes)
  }

  /**
   * 设置默认路由
   */
  const setDefaultRoutes = (newRoutes: any[]): void => {
    defaultRoutes.value = (constantRoutes as any[]).concat(newRoutes)
  }

  /**
   * 设置顶部导航路由
   */
  const setTopbarRoutes = (newRoutes: any[]): void => {
    topbarRouters.value = newRoutes
  }

  /**
   * 设置侧边栏路由
   */
  const setSidebarRouters = (newRoutes: any[]): void => {
    sidebarRouters.value = newRoutes
  }

  /**
   * 生成路由
   */
  const generateRoutes = async (roles: string[]): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const loadMenuData: any[] = []

      getRoutes().then((response: any) => {
        let data = response
        if (response.code !== 200) {
          console.error('菜单数据加载异常')
          reject(new Error('菜单数据加载异常'))
          return
        } else {
          data = response.data
          Object.assign(loadMenuData, data)

          const asyncRoutesClone = [...(asyncRoutes as any[])]
          generaMenu(asyncRoutesClone, loadMenuData)
          // Vue Router 4.x 中的 catch-all 路由语法
          asyncRoutesClone.push({ path: '/:pathMatch(.*)*', redirect: '/', hidden: true } as any)
          setRoutes(asyncRoutesClone)
          
          const sidebarRoutes: any[] = []
          generaMenu(sidebarRoutes, loadMenuData)
          setSidebarRouters((constantRoutes as any[]).concat(sidebarRoutes))
          setDefaultRoutes(sidebarRoutes)
          setTopbarRoutes(sidebarRoutes)
          resolve(asyncRoutesClone)
        }
      }).catch((error: any) => {
        // 使用模拟数据作为fallback
        try {
          Object.assign(loadMenuData, mockMenuData)

          const asyncRoutesClone = [...(asyncRoutes as any[])]
          generaMenu(asyncRoutesClone, loadMenuData)
          // Vue Router 4.x 中的 catch-all 路由语法
          asyncRoutesClone.push({ path: '/:pathMatch(.*)*', redirect: '/', hidden: true } as any)
          setRoutes(asyncRoutesClone)
          
          const sidebarRoutes: any[] = []
          generaMenu(sidebarRoutes, loadMenuData)
          setSidebarRouters((constantRoutes as any[]).concat(sidebarRoutes))
          setDefaultRoutes(sidebarRoutes)
          setTopbarRoutes(sidebarRoutes)
          
          resolve(asyncRoutesClone)
        } catch (mockError) {
          reject(mockError)
        }
      })
    })
  }

  /**
   * 根据角色过滤异步路由
   */
  const filterAsyncRoutes = (asyncRoutes: any[], roles: string[]): any[] => {
    return permission.filterAsyncRoutes(asyncRoutes, roles)
  }

  /**
   * 根据路径过滤异步路由
   */
  const filterAsyncPathRoutes = (asyncRoutes: any[], paths: any[]): any[] => {
    return permission.filterAsyncPathRoutes(asyncRoutes, paths)
  }

  return {
    // 状态
    routes,
    addRoutes,
    defaultRoutes,
    topbarRouters,
    sidebarRouters,
    
    // 方法
    setRoutes,
    setDefaultRoutes,
    setTopbarRoutes,
    setSidebarRouters,
    generateRoutes,
    filterAsyncRoutes,
    filterAsyncPathRoutes
  }
}) 