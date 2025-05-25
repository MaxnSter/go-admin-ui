# 任务1：核心框架和路由系统迁移

## 任务概述

**目标**：完成 Vue Router 4.x 升级、过滤器迁移、自定义指令迁移和基础导航功能迁移  
**依赖**：任务0（基础环境搭建）完成  
**并行性**：❌ 串行任务，是后续任务的基础  
**时间估算**：2 周（比原计划增加0.5周，因为增加了过滤器和指令迁移）

## 前置条件检查

```bash
# 确保前置任务已完成
✅ Vue 3 基础环境就绪
✅ Vite 构建工具配置完成
✅ TypeScript 配置完成
✅ 基础项目结构建立
```

## 迁移范围分析

### 1.1 Vue Router 迁移范围

#### 1.1.1 路由配置文件分析
| 文件 | 复杂度 | 主要功能 | 迁移重点 |
|------|--------|----------|----------|
| `src/router/index.js` | ⭐⭐⭐⭐ | 路由配置、导航守卫 | createRouter API |
| `src/permission.js` | ⭐⭐⭐⭐⭐ | 权限控制、动态路由 | 导航守卫语法 |
| 动态路由加载 | ⭐⭐⭐ | 组件懒加载 | import() 语法 |

#### 1.1.2 布局系统组件
| 组件 | 文件路径 | 复杂度 | 迁移重点 |
|------|----------|--------|----------|
| **侧边栏导航** | `src/layout/components/Sidebar/` | ⭐⭐⭐⭐ | 路由集成、权限控制 |
| **面包屑导航** | `src/layout/components/Breadcrumb/` | ⭐⭐⭐ | 路由信息获取 |
| **标签页组件** | `src/layout/components/TagsView/` | ⭐⭐⭐⭐⭐ | 路由缓存、标签管理 |
| **顶部导航** | `src/components/TopNav/` | ⭐⭐⭐ | 用户信息、设置 |

### 1.2 过滤器迁移范围

#### 1.2.1 全局过滤器分析
通过代码分析发现的过滤器使用：

| 过滤器名称 | 使用位置 | 功能描述 | 迁移策略 |
|-----------|----------|----------|----------|
| **pluralize** | `TodoList/index.vue` | 单复数处理 | → 全局属性 |
| **capitalize** | `TodoList/index.vue` | 首字母大写 | → 全局属性 |
| **parseTime** | 全局注册 | 时间格式化 | → 全局属性 |
| **formatTime** | 全局注册 | 时间格式化 | → 全局属性 |
| **timeAgo** | 全局注册 | 相对时间 | → 全局属性 |
| **numberFormatter** | 全局注册 | 数字格式化 | → 全局属性 |
| **toThousandFilter** | 全局注册 | 千分位格式化 | → 全局属性 |
| **uppercaseFirst** | 全局注册 | 首字母大写 | → 全局属性 |

#### 1.2.2 组件内过滤器
```javascript
// src/views/dashboard/admin/components/TodoList/index.vue
filters: {
  pluralize: (n, w) => n === 1 ? w : w + 's',
  capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
}
```

### 1.3 自定义指令迁移范围

#### 1.3.1 权限控制指令
| 指令名称 | 文件路径 | 功能描述 | 使用频次 | 迁移复杂度 |
|---------|----------|----------|----------|------------|
| **v-permission** | `src/directive/permission/permission.js` | 角色权限控制 | 20+ | ⭐⭐⭐ |
| **v-permisaction** | `src/directive/permission/permisaction.js` | 操作权限控制 | 100+ | ⭐⭐⭐ |

#### 1.3.2 UI交互指令
| 指令名称 | 文件路径 | 功能描述 | 使用频次 | 迁移复杂度 |
|---------|----------|----------|----------|------------|
| **v-el-drag-dialog** | `src/directive/el-drag-dialog/` | 对话框拖拽 | 10+ | ⭐⭐⭐⭐ |
| **v-waves** | `src/directive/waves/` | 波纹效果 | 5+ | ⭐⭐ |
| **v-el-height-adaptive-table** | `src/directive/el-table/` | 表格自适应高度 | 3+ | ⭐⭐⭐ |
| **v-dialogDrag** | `src/utils/dialog.js` | 对话框拖拽（重复） | 未知 | ⭐⭐⭐ |

## 详细工作计划

### 阶段1：Vue Router 4.x 核心迁移（4天）

#### 1.1 路由配置迁移（1.5天）
**技术要点**：
- `createRouter()` 替代 `new VueRouter()`
- `createWebHistory()` 替代 `mode: 'history'`
- 路由配置语法更新

**迁移重点**：
```javascript
// Vue 2 → Vue 3
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

// ↓ 迁移到

import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes
})
```

#### 1.2 导航守卫迁移（1.5天）
**技术要点**：
- 导航守卫参数和返回值更新
- `next()` 函数使用方式调整
- 异步导航守卫处理

**关键文件**：`src/permission.js`
```javascript
// Vue 2 语法
router.beforeEach((to, from, next) => {
  if (condition) {
    next('/login')
  } else {
    next()
  }
})

// ↓ Vue 3 推荐语法
router.beforeEach((to, from) => {
  if (condition) {
    return '/login'
  }
  return true
})
```

#### 1.3 动态路由添加迁移（1天）
**技术要点**：
- `router.addRoutes()` → `router.addRoute()`
- 动态路由删除机制
- 路由权限控制更新

**影响文件**：
- `src/store/modules/permission.js`
- `src/permission.js`

### 阶段2：过滤器系统迁移（3天）

#### 2.1 全局过滤器迁移（1.5天）
**迁移策略**：Vue 2 全局过滤器 → Vue 3 全局属性

**技术实现**：
```javascript
// src/main.ts
import * as filters from '@/filters'

const app = createApp(App)

// 将过滤器注册为全局属性
Object.keys(filters).forEach(key => {
  app.config.globalProperties[`$${key}`] = filters[key]
})
```

**模板语法更新**：
```vue
<!-- Vue 2 过滤器语法 -->
{{ message | capitalize }}
{{ date | parseTime }}

<!-- Vue 3 全局属性语法 -->
{{ $capitalize(message) }}
{{ $parseTime(date) }}
```

#### 2.2 组件内过滤器迁移（1天）
**迁移策略**：组件过滤器 → 计算属性或方法

**技术实现**：
```vue
<!-- Vue 2 组件过滤器 -->
<script>
export default {
  filters: {
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  }
}
</script>

<!-- Vue 3 计算属性 -->
<script setup>
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
</script>
```

#### 2.3 过滤器工具函数重构（0.5天）
**工作内容**：
- 创建过滤器工具函数库
- 提供 TypeScript 类型定义
- 建立过滤器迁移映射表

### 阶段3：自定义指令迁移（4天）

#### 3.1 指令生命周期钩子更新（1.5天）
**Vue 3 指令生命周期变更**：
```javascript
// Vue 2 → Vue 3 钩子映射
bind → beforeMount
inserted → mounted
update → beforeUpdate
componentUpdated → updated
unbind → beforeUnmount
```

**技术实现**：
```javascript
// Vue 2 指令
export default {
  bind(el, binding, vnode) {
    // 指令绑定时
  },
  inserted(el, binding, vnode) {
    // 元素插入时
  }
}

// Vue 3 指令
export default {
  beforeMount(el, binding, vnode) {
    // 指令绑定时
  },
  mounted(el, binding, vnode) {
    // 元素挂载时
  }
}
```

#### 3.2 权限控制指令迁移（1.5天）
**迁移重点**：
- `v-permission` 指令更新
- `v-permisaction` 指令更新
- 与 Pinia 状态管理集成

**技术要点**：
```javascript
// src/directive/permission/permission.js
import { useUserStore } from '@/stores/user'

export default {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const roles = userStore.roles

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = roles.some(role => value.includes(role))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}
```

#### 3.3 UI交互指令迁移（1天）
**迁移内容**：
- 对话框拖拽指令更新
- 表格自适应指令更新
- 波纹效果指令更新

**技术挑战**：
- Element Plus 组件结构变化适配
- 事件监听器管理优化
- TypeScript 类型支持

### 阶段4：布局系统迁移（3天）

#### 4.1 侧边栏导航迁移（1.5天）
**迁移重点**：
- 路由信息获取方式更新
- 权限控制逻辑适配
- 菜单折叠动画保持

**关键文件**：
- `src/layout/components/Sidebar/index.vue`
- `src/layout/components/Sidebar/SidebarItem.vue`

#### 4.2 标签页组件迁移（1天）
**迁移重点**：
- 路由缓存机制更新
- 标签页状态管理
- 右键菜单功能

**关键文件**：
- `src/layout/components/TagsView/index.vue`
- `src/layout/components/TagsView/ScrollPane.vue`

#### 4.3 面包屑和顶部导航（0.5天）
**迁移重点**：
- 路由元信息获取
- 用户状态显示
- 设置面板集成

## 风险控制和应对策略

### 主要风险点
1. **路由权限控制复杂**：动态路由生成逻辑复杂
2. **过滤器使用广泛**：模板语法变更影响面大
3. **指令与组件耦合**：Element Plus 组件结构变化
4. **布局系统稳定性**：核心导航功能不能出错

### 应对策略
1. **渐进式迁移**：按模块逐步迁移，确保每步可验证
2. **兼容性处理**：提供过渡期的兼容方案
3. **充分测试**：每个功能点都要有测试覆盖
4. **回滚准备**：关键节点保留回滚能力

## 验证策略

### 功能验证清单
```bash
# 路由系统验证
□ 路由导航正常工作
□ 动态路由正确生成
□ 权限控制功能正常
□ 路由缓存机制正常
□ 导航守卫正确执行

# 过滤器验证
□ 所有过滤器功能正常
□ 模板渲染结果正确
□ 全局属性访问正常
□ TypeScript 类型检查通过

# 自定义指令验证
□ 权限指令控制正确
□ UI交互指令正常
□ 指令生命周期正确
□ 无内存泄漏问题

# 布局系统验证
□ 侧边栏导航正常
□ 标签页功能完整
□ 面包屑显示正确
□ 响应式布局正常
```

## 完成标准

### 功能完整性
- ✅ 路由导航功能完全正常
- ✅ 权限控制机制正确工作
- ✅ 所有过滤器功能迁移完成
- ✅ 自定义指令功能正常
- ✅ 布局系统稳定运行

### 技术指标
- ✅ Vue Router 4.x 完全集成
- ✅ TypeScript 类型检查 100% 通过
- ✅ ESLint 检查 0 错误 0 警告
- ✅ 单元测试覆盖率 ≥ 90%
- ✅ 集成测试全部通过

### 用户体验
- ✅ 导航体验保持一致
- ✅ 页面切换流畅
- ✅ 权限控制准确
- ✅ 无功能回归问题

## 后续任务准备

任务1完成后，为后续任务提供：
- ✅ 稳定的路由系统
- ✅ 完整的权限控制
- ✅ 可用的过滤器系统
- ✅ 正常的指令系统
- ✅ 可靠的布局框架

这些基础设施将支撑任务2（状态管理）和任务3（UI组件）的顺利进行。 