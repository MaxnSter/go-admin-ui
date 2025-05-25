import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 配置持久化插件
pinia.use(
  createPersistedState({
    // 默认使用 localStorage
    storage: localStorage,
    // 可以为每个 store 单独配置
    auto: false
  })
)

export default pinia

// 导出所有 stores
export { useUserStore } from './modules/user'
export { usePermissionStore } from './modules/permission'
export { useTagsViewStore } from './modules/tagsView'
export { useAppStore } from './modules/app'
export { useSettingsStore } from './modules/settings'
export { useSystemStore } from './modules/system'
export { useErrorLogStore } from './modules/errorLog' 