// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 用户登录响应
export interface LoginResponse {
  token: string
}

// 用户信息响应
export interface UserInfoResponse {
  roles: string[]
  name: string
  avatar: string
  introduction: string
  permissions: any[]
}

// 路由信息响应
export interface RouteResponse {
  code: number
  data: any[]
  msg: string
}

// 刷新 token 响应
export interface RefreshTokenResponse {
  token: string
} 