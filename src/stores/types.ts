// 用户相关类型
export interface UserInfo {
  name: string
  avatar: string
  introduction: string
  roles: string[]
  permissions: string[]
  permisaction: string[]
}

export interface LoginCredentials {
  username: string
  password: string
  code?: string
  uuid?: string
}

// 路由相关类型
export interface RouteItem {
  path: string
  component?: any
  hidden?: boolean
  children?: RouteItem[]
  name?: string
  meta?: {
    title?: string
    icon?: string
    noCache?: boolean
    affix?: boolean
    roles?: string[]
  }
}

// 标签页相关类型
export interface TagView {
  path: string
  name?: string
  title?: string
  meta?: {
    title?: string
    icon?: string
    noCache?: boolean
    affix?: boolean
  }
  query?: Record<string, any>
  params?: Record<string, any>
}

// 应用设置相关类型
export interface AppSettings {
  theme: string
  showSettings: boolean
  topNav: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
  themeStyle: string
}

// 侧边栏状态类型
export interface SidebarState {
  opened: boolean
  withoutAnimation: boolean
}

// 系统信息类型
export interface SystemInfo {
  [key: string]: any
}

// 错误日志类型
export interface ErrorLog {
  message: string
  stack?: string
  info?: string
  url?: string
  time?: string
} 