import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/admin/sys-role'
import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import type { ApiResponse } from '@/types/api'

function hasPermission(roles: string[], route: any) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function hasPathPermission(paths: any[], route: any) {
  if (route.path) {
    return paths.some(path => route.path === path.path)
  } else {
    return true
  }
}

export function generaMenu(routes: any[], data: any[]) {
  data.forEach(item => {
    const menu = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : loadView(item.component),
      hidden: item.visible !== '0',
      children: [] as any[],
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

export const loadView = (view: string) => {
  return () => import(`@/views${view}.vue`)
}

export function filterAsyncRoutes(routes: any[], roles: string[]) {
  const res: any[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export function filterAsyncPathRoutes(routes: any[], paths: any[]) {
  const res: any[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPathPermission(paths, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncPathRoutes(tmp.children, paths)
      }
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as any[],
    addRoutes: [] as any[],
    defaultRoutes: [] as any[],
    topbarRouters: [] as any[],
    sidebarRouters: [] as any[]
  }),
  actions: {
    async generateRoutes(roles: string[]) {
      const loadMenuData: any[] = []
      try {
        const response = await getRoutes() as unknown as ApiResponse<any[]>
        if (response && response.code === 200 && response.data) {
          const data = response.data
          if (Array.isArray(data)) {
            Object.assign(loadMenuData, data)
            generaMenu(asyncRoutes, loadMenuData)
          }
        }
      } catch (error) {
        console.error('Error loading routes:', error)
      }
      
      const notFoundRoute: RouteRecordRaw = { 
        path: '/:pathMatch(.*)*', 
        redirect: '/',
        meta: { hidden: true }
      }
      asyncRoutes.push(notFoundRoute)
      this.addRoutes = asyncRoutes
      this.routes = constantRoutes.concat(asyncRoutes)
      const sidebarRoutes: any[] = []
      if (loadMenuData.length > 0) {
        generaMenu(sidebarRoutes, loadMenuData)
      }
      this.sidebarRouters = constantRoutes.concat(sidebarRoutes)
      this.defaultRoutes = constantRoutes.concat(sidebarRoutes)
      this.topbarRouters = sidebarRoutes
      return asyncRoutes
    }
  }
})
