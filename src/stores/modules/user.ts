import { defineStore } from 'pinia'
import { login, logout, getInfo, refreshtoken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '@/utils/storage'
import type { LoginResponse, UserInfoResponse, RefreshTokenResponse } from '@/types/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() as string | undefined,
    name: '',
    avatar: '',
    introduction: '',
    roles: [] as string[],
    permissions: [] as any[],
    permisaction: [] as any[]
  }),
  actions: {
    async login(userInfo: any) {
      const response = await login(userInfo) as unknown as LoginResponse
      this.token = response.token
      setToken(response.token)
    },
    async getInfo() {
      const response = await getInfo()
      if (!response || !response.data) {
        this.token = ''
        removeToken()
        return
      }
      const { roles, name, avatar, introduction, permissions } = response.data as UserInfoResponse
      if (!roles || roles.length <= 0) {
        throw new Error('getInfo: roles must be a non-null array!')
      }
      this.permissions = permissions
      this.roles = roles
      this.name = name
      this.avatar = avatar.indexOf('http') !== -1 ? avatar : `${import.meta.env.VUE_APP_BASE_API}${avatar}`
      this.introduction = introduction
      return { roles }
    },
    async LogOut() {
      await logout()
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
      storage.clear()
    },
    async refreshToken() {
      const response = await refreshtoken({ token: this.token }) as unknown as RefreshTokenResponse
      this.token = response.token
      setToken(response.token)
    },
    resetToken() {
      this.token = ''
      removeToken()
    }
  }
})
