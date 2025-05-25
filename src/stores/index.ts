import { createPinia } from 'pinia'
import type { App } from 'vue'
import {
  useAppStore,
  useUserStore,
  usePermissionStore,
  useTagsViewStore,
  useSettingsStore,
  useSystemStore,
  useErrorLogStore
} from './modules'

const pinia = createPinia()

const stores = {
  app: useAppStore(pinia),
  user: useUserStore(pinia),
  permission: usePermissionStore(pinia),
  tagsView: useTagsViewStore(pinia),
  settings: useSettingsStore(pinia),
  system: useSystemStore(pinia),
  errorLog: useErrorLogStore(pinia)
}

export const legacyStore = {
    get state() {
      return Object.fromEntries(
        Object.entries(stores).map(([k, s]) => [k, s.$state])
      )
    },
    getters: {
      get sidebar() {
        return stores.app.sidebar
      },
      get size() {
        return stores.app.size
      },
      get device() {
        return stores.app.device
      },
      get visitedViews() {
        return stores.tagsView.visitedViews
      },
      get cachedViews() {
        return stores.tagsView.cachedViews
      },
      get token() {
        return stores.user.token
      },
      get avatar() {
        return stores.user.avatar
      },
      get name() {
        return stores.user.name
      },
      get introduction() {
        return stores.user.introduction
      },
      get roles() {
        return stores.user.roles
      },
      get permisaction() {
        return stores.user.permisaction
      },
      get permission_routes() {
        return stores.permission.routes
      },
      get topbarRouters() {
        return stores.permission.topbarRouters
      },
      get defaultRoutes() {
        return stores.permission.defaultRoutes
      },
      get sidebarRouters() {
        return stores.permission.sidebarRouters
      },
      get errorLogs() {
        return stores.errorLog.logs
      },
      get appInfo() {
        return stores.system.info
      }
    },
    dispatch(type: string, payload?: any) {
      const [m, action] = type.split('/')
      const store = (stores as any)[m]
      if (store && typeof store[action] === 'function') {
        return store[action](payload)
      }
    },
    commit(type: string, payload?: any) {
      const [m, mutation] = type.split('/')
      const store = (stores as any)[m]
      if (store && typeof store[mutation] === 'function') {
        return store[mutation](payload)
      }
    }
  }

export function setupStore(app: App) {
  app.use(pinia)
  app.config.globalProperties.$store = legacyStore
}

export default legacyStore

// 导出所有 store hooks
export {
  useAppStore,
  useUserStore,
  usePermissionStore,
  useTagsViewStore,
  useSettingsStore,
  useSystemStore,
  useErrorLogStore
}


