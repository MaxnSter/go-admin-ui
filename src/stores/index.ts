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
} from './modules/index'

const pinia = createPinia()

// Initialize stores with error handling
let stores: Record<string, any> = {}
try {
  stores = {
    app: useAppStore(pinia),
    user: useUserStore(pinia),
    permission: usePermissionStore(pinia),
    tagsView: useTagsViewStore(pinia),
    settings: useSettingsStore(pinia),
    system: useSystemStore(pinia),
    errorLog: useErrorLogStore(pinia)
  }
} catch (error) {
  console.error('Error initializing stores:', error)
  stores = {}
}

export const legacyStore = {
    get state() {
      try {
        if (!stores || typeof stores !== 'object') {
          return {}
        }
        return Object.fromEntries(
          Object.entries(stores).map(([k, s]) => [k, (s as any)?.$state || {}])
        )
      } catch (error) {
        console.error('Error accessing store state:', error)
        return {}
      }
    },
    getters: {
      get sidebar() {
        return stores?.app?.sidebar
      },
      get size() {
        return stores?.app?.size
      },
      get device() {
        return stores?.app?.device
      },
      get visitedViews() {
        return stores?.tagsView?.visitedViews || []
      },
      get cachedViews() {
        return stores?.tagsView?.cachedViews || []
      },
      get token() {
        return stores?.user?.token
      },
      get avatar() {
        return stores?.user?.avatar
      },
      get name() {
        return stores?.user?.name
      },
      get introduction() {
        return stores?.user?.introduction
      },
      get roles() {
        return stores?.user?.roles || []
      },
      get permisaction() {
        return stores?.user?.permisaction || []
      },
      get permission_routes() {
        return stores?.permission?.routes || []
      },
      get topbarRouters() {
        return stores?.permission?.topbarRouters || []
      },
      get defaultRoutes() {
        return stores?.permission?.defaultRoutes || []
      },
      get sidebarRouters() {
        return stores?.permission?.sidebarRouters || []
      },
      get errorLogs() {
        return stores?.errorLog?.logs || []
      },
      get appInfo() {
        return stores?.system?.info
      }
    },
    dispatch(type: string, payload?: any) {
      try {
        const [m, action] = type.split('/')
        const store = (stores as any)[m]
        if (store && typeof store[action] === 'function') {
          return store[action](payload)
        }
      } catch (error) {
        console.error('Error dispatching action:', type, error)
      }
    },
    commit(type: string, payload?: any) {
      try {
        const [m, mutation] = type.split('/')
        const store = (stores as any)[m]
        if (store && typeof store[mutation] === 'function') {
          return store[mutation](payload)
        }
      } catch (error) {
        console.error('Error committing mutation:', type, error)
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


