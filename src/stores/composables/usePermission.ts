import type { RouteItem } from '../types'

/**
 * 权限相关的共享逻辑
 */
export function usePermission() {
  /**
   * 检查用户是否有指定角色权限
   */
  const hasPermission = (roles: string[], route: RouteItem): boolean => {
    if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta!.roles!.includes(role))
    } else {
      return true
    }
  }

  /**
   * 检查用户是否有路径权限
   */
  const hasPathPermission = (paths: any[], route: RouteItem): boolean => {
    if (route.path) {
      return paths.some(path => route.path === path.path)
    } else {
      return true
    }
  }

  /**
   * 递归过滤异步路由
   */
  const filterAsyncRoutes = (routes: RouteItem[], roles: string[]): RouteItem[] => {
    const res: RouteItem[] = []

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

  /**
   * 根据路径过滤异步路由
   */
  const filterAsyncPathRoutes = (routes: RouteItem[], paths: any[]): RouteItem[] => {
    const res: RouteItem[] = []

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

  /**
   * 检查用户是否有指定角色
   */
  const hasRole = (userRoles: string[], targetRole: string): boolean => {
    return userRoles.includes(targetRole)
  }

  /**
   * 检查用户是否有指定权限
   */
  const hasPermissionAction = (userPermissions: string[], permission: string): boolean => {
    return userPermissions.includes(permission)
  }

  return {
    hasPermission,
    hasPathPermission,
    filterAsyncRoutes,
    filterAsyncPathRoutes,
    hasRole,
    hasPermissionAction
  }
} 