import type { RouteLocationMatched } from 'vue-router'

// 扩展路由元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    roles?: string[]
    hidden?: boolean
    alwaysShow?: boolean
    noCache?: boolean
    affix?: boolean
    breadcrumb?: boolean
    activeMenu?: string
  }
}

// 面包屑项目类型
export interface BreadcrumbItem {
  path: string
  meta: {
    title: string
    breadcrumb?: boolean
    [key: string]: any
  }
  redirect?: string
  name?: string
}

// 扩展 RouteLocationMatched 类型，确保 meta.title 存在
export interface ExtendedRouteLocationMatched extends Omit<RouteLocationMatched, 'meta'> {
  meta: {
    title: string
    [key: string]: any
  }
} 