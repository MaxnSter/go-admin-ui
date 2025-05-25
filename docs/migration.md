# go-admin-ui Vue 2 到 Vue 3 迁移技术执行文档

## 一、项目概况分析

### 1.1 项目规模统计

| 指标 | 数量 | 说明 |
|------|------|------|
| **总代码行数** | 24,977 行 | 包含 Vue、JS、CSS/SCSS 文件 |
| **Vue 组件总数** | 101 个 | 单文件组件 (.vue) |
| **页面组件数** | 51 个 | src/views 目录下的业务页面 |
| **公共组件数** | 36 个 | src/components 目录下的可复用组件 |
| **布局组件数** | 14 个 | src/layout 目录下的布局组件 |
| **JavaScript 文件数** | 85 个 | 工具函数、API、配置等 |
| **API 模块数** | 20 个 | src/api 目录下的接口模块 |
| **Vuex 模块数** | 7 个 | 状态管理模块 |
| **Options API 组件** | 99 个 | 使用传统 Vue 2 语法的组件 |
| **Vue 实例方法调用** | 200+ 次 | this.$router、this.$store 等调用 |
| **全局 Vue API 使用** | 29 处 | Vue.use、Vue.prototype 等 |
| **过滤器使用** | 8+ 个 | 全局过滤器和组件过滤器 |
| **自定义指令** | 6+ 个 | 权限控制、UI交互指令 |

### 1.2 核心业务模块

| 模块 | 组件数 | 复杂度 | 主要功能 |
|------|--------|--------|----------|
| **管理系统模块** | 25+ | ⭐⭐⭐⭐⭐ | 用户、角色、权限、菜单、部门管理 |
| **开发工具模块** | 8+ | ⭐⭐⭐⭐ | 代码生成、表单构建 |
| **系统监控模块** | 6+ | ⭐⭐⭐ | 操作日志、登录日志、系统监控 |
| **基础功能模块** | 12+ | ⭐⭐⭐ | 登录、个人中心、仪表板 |
| **公共组件库** | 36+ | ⭐⭐⭐⭐ | 图表、表单、表格、上传等 |

### 1.3 技术债务分析

| 技术债务类型 | 影响范围 | 迁移难度 | 优先级 |
|-------------|----------|----------|--------|
| **Element UI 依赖** | 全项目 | ⭐⭐⭐⭐⭐ | 🔴 高 |
| **Vue Router 3.x** | 路由系统 | ⭐⭐⭐⭐ | 🔴 高 |
| **过滤器系统** | 8+ 处使用 | ⭐⭐⭐ | 🔴 高 |
| **自定义指令** | 6+ 个指令 | ⭐⭐⭐ | 🔴 高 |
| **Vuex 3.x** | 状态管理 | ⭐⭐⭐ | 🟡 中 |
| **第三方插件兼容性** | 多个模块 | ⭐⭐⭐⭐ | 🔴 高 |
| **全局 API 使用** | 29 处 | ⭐⭐ | 🟡 中 |
| **组件语法迁移** | 99 个组件 | ⭐⭐⭐ | 🟡 中 |

## 二、总体迁移架构设计

### 2.1 迁移策略

采用**分阶段渐进式迁移**策略，确保每个阶段都有可运行的版本：

```
Vue 2 项目 → Vue 3 兼容环境 → 分模块迁移 → 优化重构 → 生产部署
```

### 2.2 技术栈升级路径

| 当前技术栈 | 目标技术栈 | 迁移方式 |
|------------|------------|----------|
| Vue 2.6.11 | Vue 3.3+ | Migration Build → 完全迁移 |
| Vue CLI | Vite | 重新配置构建工具 |
| Element UI 2.x | Element Plus | 组件逐个替换 |
| Vue Router 3.x | Vue Router 4.x | API 升级 |
| Vuex 3.x | Pinia | 状态管理重构 |
| JavaScript | TypeScript | 渐进式类型化 |

## 三、迁移任务拆分（5个独立子任务）

### 任务 0：基础环境搭建（前置任务）

**目标**：建立可运行的 Vue 3 基础环境

**工作内容**：
- 创建新的 Vue 3 项目结构
- 配置 Vite 构建工具
- 设置 TypeScript 支持
- 建立基础的路由和状态管理
- 配置开发环境和构建流程

**交付物**：
- 可运行的 Vue 3 空项目
- 完整的开发环境配置
- CI/CD 流程配置

**时间估算**：1 周

---

### 任务 1：核心框架和路由系统迁移

**目标**：完成 Vue Router 4.x 升级、过滤器迁移、自定义指令迁移和基础导航功能迁移

**依赖**：任务 0 完成

**工作内容**：
1. **Vue Router 4.x 升级**
   - 路由配置语法更新（createRouter API）
   - 导航守卫 API 迁移（next() 函数调整）
   - 动态路由添加方式更新（addRoutes → addRoute）
   
2. **过滤器系统迁移**
   - 全局过滤器迁移到全局属性
   - 组件内过滤器迁移到计算属性/方法
   - 模板语法更新（| filter → $filter()）
   
3. **自定义指令迁移**
   - 指令生命周期钩子更新（bind → beforeMount 等）
   - 权限控制指令迁移（v-permission, v-permisaction）
   - UI交互指令迁移（v-el-drag-dialog, v-waves 等）

4. **布局系统迁移**
   - `src/layout/` 下所有组件迁移
   - 侧边栏导航组件更新
   - 面包屑导航组件更新
   - 标签页组件更新

5. **权限控制系统**
   - `src/permission.js` 迁移
   - 路由权限控制更新
   - 动态菜单生成逻辑

**关键文件**：
- `src/router/index.js` → `src/router/index.ts`
- `src/filters/index.js` → `src/filters/index.ts`
- `src/directive/` 目录下所有指令
- `src/layout/` 目录下所有组件
- `src/permission.js` → `src/permission.ts`

**验收标准**：
- 路由导航正常工作
- 权限控制功能正常
- 所有过滤器功能迁移完成
- 自定义指令功能正常
- 布局组件渲染正确

**时间估算**：2 周

---

### 任务 2：状态管理系统迁移（Vuex → Pinia）

**目标**：完成状态管理从 Vuex 3.x 到 Pinia 的全面迁移

**依赖**：任务 1 完成

**工作内容**：
1. **Pinia 架构重新设计**
   - 基础架构搭建（Pinia 实例、类型定义、共享逻辑）
   - 核心状态模块迁移（用户、权限、标签页管理）
   - 辅助状态模块迁移（应用设置、系统配置、错误日志）
   - 组件集成和测试

2. **状态管理复杂度分析**
   - 用户状态管理：⭐⭐⭐⭐⭐（认证流程、权限管理）
   - 权限状态管理：⭐⭐⭐⭐⭐（动态路由、菜单权限）
   - 标签页状态管理：⭐⭐⭐⭐（视图缓存、标签页操作）
   - 应用状态管理：⭐⭐⭐（侧边栏、主题、设备适配）

3. **技术架构升级**
   - Setup Store 语法采用
   - TypeScript 类型安全
   - 状态持久化策略
   - 性能优化策略

**关键文件**：
- `src/store/` → `src/stores/`
- 7个 Vuex 模块迁移到 Pinia stores
- 38+ 处组件状态使用更新

**验收标准**：
- 所有 Vuex 功能迁移到 Pinia
- 用户认证流程正常
- 权限控制功能正常
- 标签页管理功能正常
- 状态持久化功能正常
- TypeScript 类型检查通过
- 单元测试覆盖率 ≥ 90%

**时间估算**：1.5 周

---

### 任务 3：UI 组件库迁移（Element UI → Element Plus）

**目标**：完成 UI 组件库的全面迁移

**依赖**：任务 1、2 完成

**工作内容**：
1. **Element Plus 集成**
   - 按需引入配置
   - 主题定制迁移
   - 图标系统更新

2. **组件 API 更新**
   - 表单组件 API 更新
   - 表格组件 API 更新
   - 弹窗组件 API 更新
   - 日期选择器等组件更新

3. **样式系统迁移**
   - SCSS 变量更新
   - 组件样式覆盖更新
   - 响应式布局调整

**关键文件**：
- `src/main.js` → `src/main.ts`
- `src/styles/` 目录
- 所有使用 Element UI 组件的文件

**验收标准**：
- 所有页面样式正常显示
- 表单交互功能正常
- 表格操作功能正常

**时间估算**：2 周

---

### 任务 4：业务组件和页面迁移

**目标**：完成所有业务页面和组件的迁移

**依赖**：任务 3 完成

**工作内容**：
1. **管理系统模块迁移**
   - 用户管理页面 (`src/views/admin/sys-user/`)
   - 角色管理页面 (`src/views/admin/sys-role/`)
   - 菜单管理页面 (`src/views/admin/sys-menu/`)
   - 部门管理页面 (`src/views/admin/sys-dept/`)
   - 其他系统管理页面

2. **开发工具模块迁移**
   - 代码生成工具 (`src/views/dev-tools/gen/`)
   - 表单构建器相关组件

3. **公共组件迁移**
   - 图表组件 (`src/components/Charts/`)
   - 表单组件 (`src/components/FormGen*/`)
   - 上传组件 (`src/components/Upload*/`)
   - 其他工具组件

**关键文件**：
- `src/views/` 目录下所有页面
- `src/components/` 目录下所有组件

**验收标准**：
- 所有业务功能正常工作
- 数据交互正常
- 用户体验保持一致

**时间估算**：2.5 周

---

### 任务 5：第三方插件迁移和性能优化

**目标**：完成第三方插件迁移和整体性能优化

**依赖**：任务 4 完成

**工作内容**：
1. **第三方插件迁移**
   - ECharts 集成更新
   - CodeMirror 编辑器迁移
   - 文件上传组件更新
   - 图片裁剪组件更新
   - 拖拽组件更新

2. **性能优化**
   - 代码分割优化
   - 懒加载配置
   - 打包体积优化
   - 运行时性能优化

3. **开发体验优化**
   - TypeScript 类型完善
   - ESLint 规则更新
   - 开发工具配置优化

**关键文件**：
- `vite.config.ts`
- `tsconfig.json`
- `.eslintrc.js`
- 所有使用第三方插件的组件

**验收标准**：
- 所有第三方功能正常工作
- 应用性能达到预期
- 开发体验良好

**时间估算**：1.5 周

## 四、技术执行文档

### 4.1 环境准备

#### 4.1.1 开发环境要求

```bash
# Node.js 版本要求
node >= 16.0.0
npm >= 8.0.0
pnpm >= 8.0.0 (推荐)

# 全局工具安装
npm install -g @vue/cli@latest
npm install -g vite@latest
npm install -g typescript@latest
```

#### 4.1.2 项目初始化

```bash
# 创建迁移分支
git checkout -b feature/vue3-migration

# 备份当前配置
cp package.json package.json.backup
cp vue.config.js vue.config.js.backup

# 创建新的项目结构
mkdir vue3-migration
cd vue3-migration
npm create vue@latest . -- --typescript --router --pinia --eslint
```

### 4.2 核心配置文件

#### 4.2.1 Vite 配置 (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 9527,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['axios', 'dayjs', 'lodash-es']
        }
      }
    }
  }
})
```

#### 4.2.2 TypeScript 配置 (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.3 迁移检查清单

#### 4.3.1 Vue 3 兼容性检查

- [ ] 移除 `new Vue()` 语法，使用 `createApp()`
- [ ] 更新全局 API 使用方式
- [ ] 检查 `$children` 使用，替换为 `ref` 或 `provide/inject`
- [ ] 更新事件 API，移除 `$on`、`$off`、`$once`
- [ ] 检查 `v-model` 使用，更新自定义组件的 `v-model`
- [ ] 更新过滤器为计算属性或方法

#### 4.3.2 Vue Router 4 迁移检查

- [ ] 更新路由创建方式：`createRouter()`
- [ ] 更新历史模式：`createWebHistory()`
- [ ] 更新导航守卫语法
- [ ] 检查 `router.addRoutes()` 使用，替换为 `router.addRoute()`
- [ ] 更新路由元信息类型定义

#### 4.3.3 状态管理迁移检查

- [ ] 创建 Pinia stores
- [ ] 更新组件中的状态使用方式
- [ ] 迁移 Vuex modules 到 Pinia stores
- [ ] 更新状态持久化逻辑
- [ ] 测试状态管理功能

### 4.4 质量保证

#### 4.4.1 测试策略

```bash
# 单元测试
npm run test:unit

# 端到端测试
npm run test:e2e

# 类型检查
npm run type-check

# 代码质量检查
npm run lint
```

#### 4.4.2 性能监控

- 使用 Vue DevTools 3.0 监控组件性能
- 使用 Lighthouse 检查页面性能
- 监控打包体积变化
- 检查运行时内存使用

### 4.5 部署策略

#### 4.5.1 渐进式部署

1. **开发环境验证**：完成迁移后在开发环境充分测试
2. **测试环境部署**：部署到测试环境进行集成测试
3. **预生产验证**：在预生产环境进行性能和稳定性测试
4. **生产环境部署**：采用蓝绿部署或滚动更新策略

#### 4.5.2 回滚计划

- 保留 Vue 2 版本的完整备份
- 准备快速回滚脚本
- 建立监控告警机制
- 制定应急响应流程

## 五、风险评估与应对

### 5.1 主要风险

| 风险类型 | 风险等级 | 影响范围 | 应对策略 |
|----------|----------|----------|----------|
| **第三方库兼容性** | 🔴 高 | 全项目 | 提前调研替代方案，准备降级策略 |
| **业务功能回归** | 🔴 高 | 核心功能 | 完善测试用例，充分回归测试 |
| **性能下降** | 🟡 中 | 用户体验 | 性能监控，优化关键路径 |
| **开发周期延长** | 🟡 中 | 项目进度 | 合理拆分任务，并行开发 |

### 5.2 成功标准

- ✅ 所有现有功能正常工作
- ✅ 页面加载性能不低于当前版本
- ✅ 代码质量和可维护性提升
- ✅ 开发体验显著改善
- ✅ 为未来功能扩展奠定基础

这份迁移指南提供了从架构设计到具体实施的完整路径，确保 go-admin-ui 项目能够平稳、高效地从 Vue 2 迁移到 Vue 3。
