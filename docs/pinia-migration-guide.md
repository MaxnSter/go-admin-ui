# Pinia 迁移指南

## 概述

本项目已成功从 Vuex 3.x 迁移到 Pinia。本指南将帮助开发者了解如何在组件中使用新的 Pinia stores。

## 主要变化

### 1. Store 导入方式

**之前 (Vuex):**
```javascript
import { mapState, mapActions } from 'vuex'
// 或者
this.$store.state.user.token
this.$store.dispatch('user/login', userInfo)
```

**现在 (Pinia):**
```javascript
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
// 在 setup() 或 <script setup> 中
const userStore = useUserStore()
const permissionStore = usePermissionStore()
```

### 2. 状态访问

**之前:**
```javascript
// 在模板中
{{ $store.state.user.name }}
// 在组件中
this.$store.state.user.name
```

**现在:**
```javascript
// 在模板中
{{ userStore.name }}
// 在组件中
userStore.name
```

### 3. Actions 调用

**之前:**
```javascript
this.$store.dispatch('user/login', userInfo)
this.$store.dispatch('permission/generateRoutes', roles)
```

**现在:**
```javascript
await userStore.login(userInfo)
await permissionStore.generateRoutes(roles)
```

## 可用的 Stores

### 1. useUserStore - 用户状态管理

```javascript
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 状态
userStore.token
userStore.name
userStore.avatar
userStore.roles
userStore.permissions
userStore.permisaction

// 计算属性
userStore.isLoggedIn
userStore.hasRole('admin')
userStore.hasPermission('user:create')

// 方法
await userStore.login(credentials)
await userStore.getUserInfo()
await userStore.logOut()
await userStore.refreshToken()
userStore.resetToken()
userStore.setUserInfo(userInfo)
```

### 2. usePermissionStore - 权限状态管理

```javascript
import { usePermissionStore } from '@/stores/modules/permission'

const permissionStore = usePermissionStore()

// 状态
permissionStore.routes
permissionStore.sidebarRouters
permissionStore.topbarRouters

// 方法
await permissionStore.generateRoutes(roles)
permissionStore.filterAsyncRoutes(routes, roles)
```

### 3. useTagsViewStore - 标签页状态管理

```javascript
import { useTagsViewStore } from '@/stores/modules/tagsView'

const tagsViewStore = useTagsViewStore()

// 状态
tagsViewStore.visitedViews
tagsViewStore.cachedViews

// 方法
tagsViewStore.addView(view)
await tagsViewStore.delView(view)
await tagsViewStore.delAllViews()
tagsViewStore.updateVisitedView(view)
```

### 4. useAppStore - 应用状态管理

```javascript
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

// 状态
appStore.sidebar
appStore.device
appStore.size

// 方法
appStore.toggleSideBar()
appStore.closeSideBar(withoutAnimation)
appStore.toggleDevice(device)
appStore.setSize(size)
```

### 5. useSettingsStore - 设置状态管理

```javascript
import { useSettingsStore } from '@/stores/modules/settings'

const settingsStore = useSettingsStore()

// 状态
settingsStore.theme
settingsStore.showSettings
settingsStore.topNav
settingsStore.tagsView

// 方法
settingsStore.changeSetting('theme', '#409EFF')
settingsStore.resetSettings()
```

### 6. useSystemStore - 系统状态管理

```javascript
import { useSystemStore } from '@/stores/modules/system'

const systemStore = useSystemStore()

// 状态
systemStore.info

// 方法
await systemStore.settingDetail()
systemStore.setInfo(data)
systemStore.clearInfo()
```

### 7. useErrorLogStore - 错误日志状态管理

```javascript
import { useErrorLogStore } from '@/stores/modules/errorLog'

const errorLogStore = useErrorLogStore()

// 状态
errorLogStore.logs

// 方法
errorLogStore.addErrorLog(log)
errorLogStore.clearErrorLog()
errorLogStore.removeErrorLog(index)
```

## 组件迁移示例

### Options API 组件迁移

**之前:**
```javascript
export default {
  computed: {
    ...mapState('user', ['name', 'avatar']),
    ...mapState('app', ['sidebar'])
  },
  methods: {
    ...mapActions('user', ['login', 'logout']),
    async handleLogin() {
      await this.login(this.loginForm)
    }
  }
}
```

**现在:**
```javascript
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'

export default {
  setup() {
    const userStore = useUserStore()
    const appStore = useAppStore()
    
    const handleLogin = async (loginForm) => {
      await userStore.login(loginForm)
    }
    
    return {
      userStore,
      appStore,
      handleLogin
    }
  }
}
```

### Composition API 组件

```javascript
<script setup>
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'

const userStore = useUserStore()
const appStore = useAppStore()

const handleLogin = async (loginForm) => {
  await userStore.login(loginForm)
}
</script>

<template>
  <div>
    <p>用户名: {{ userStore.name }}</p>
    <p>侧边栏状态: {{ appStore.sidebar.opened ? '打开' : '关闭' }}</p>
    <button @click="handleLogin">登录</button>
  </div>
</template>
```

## 持久化存储

所有 stores 都配置了持久化存储，数据会自动保存到 localStorage 中。无需手动处理数据持久化。

## 类型支持

所有 stores 都提供了完整的 TypeScript 类型支持，包括：
- 状态类型定义
- 方法参数和返回值类型
- 计算属性类型

## 注意事项

1. **响应式**: Pinia stores 中的状态是响应式的，可以直接在模板中使用
2. **解构**: 如果需要解构 store 中的状态，请使用 `storeToRefs()`
3. **服务端渲染**: Pinia 对 SSR 有更好的支持
4. **开发工具**: 可以使用 Vue DevTools 调试 Pinia stores

```javascript
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { name, avatar } = storeToRefs(userStore) // 保持响应式
```

## 迁移检查清单

- [ ] 移除所有 Vuex 相关代码
- [ ] 更新组件中的 store 使用方式
- [ ] 测试所有功能是否正常工作
- [ ] 验证数据持久化是否正常
- [ ] 检查类型错误并修复 