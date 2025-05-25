import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

function checkVue3Syntax() {
  console.log('🔍 检查 Vue 3 语法迁移...')
  
  const files = glob.sync('src/**/*.{js,ts,vue}', { ignore: ['node_modules/**'] })
  const issues = []
  let checkedFiles = 0
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      checkedFiles++
      
      // 检查 Vue 2 语法残留
      if (content.includes('new Vue(')) {
        issues.push(`${file}: 发现 'new Vue(' 语法，应该使用 createApp()`)
      }
      
      if (content.includes('Vue.use(')) {
        issues.push(`${file}: 发现 'Vue.use(' 语法，应该使用 app.use()`)
      }
      
      if (content.includes('Vue.prototype')) {
        issues.push(`${file}: 发现 'Vue.prototype' 语法，应该使用 app.config.globalProperties`)
      }
      
      if (content.includes('Vue.filter')) {
        issues.push(`${file}: 发现 'Vue.filter' 语法，应该迁移到全局属性或组合式函数`)
      }
      
      // 检查过滤器语法（在模板中）- 修复正则表达式避免误识别
      if (file.endsWith('.vue') && content.match(/\{\{[^}]*\s\|\s[^}]*\}\}/)) {
        issues.push(`${file}: 发现过滤器语法，应该迁移到计算属性或方法`)
      }
      
      // 检查 .sync 修饰符
      if (content.includes('.sync')) {
        issues.push(`${file}: 发现 .sync 修饰符，应该使用 v-model:propName`)
      }
      
      // 检查 $listeners
      if (content.includes('$listeners')) {
        issues.push(`${file}: 发现 $listeners，在 Vue 3 中已合并到 $attrs`)
      }
      
      // 检查 $children
      if (content.includes('$children')) {
        issues.push(`${file}: 发现 $children，Vue 3 中已移除，应该使用 ref 或 provide/inject`)
      }
      
      // 检查事件总线
      if (content.includes('$bus') || content.includes('EventBus')) {
        issues.push(`${file}: 发现事件总线用法，应该迁移到 mitt 或其他解决方案`)
      }
      
    } catch (error) {
      console.warn(`⚠️  无法读取文件 ${file}: ${error.message}`)
    }
  })
  
  console.log(`📊 检查了 ${checkedFiles} 个文件`)
  
  if (issues.length > 0) {
    console.error('\n❌ 发现 Vue 2 语法问题:')
    issues.forEach(issue => console.error(`  ${issue}`))
    console.error(`\n总计发现 ${issues.length} 个问题`)
    process.exit(1)
  } else {
    console.log('\n✅ Vue 3 语法检查通过 - 未发现 Vue 2 语法残留')
  }
}

// 检查必要的 Vue 3 语法
function checkVue3Usage() {
  console.log('\n🔍 检查 Vue 3 语法使用...')
  
  const mainFiles = glob.sync('src/main.{js,ts}')
  let hasCreateApp = false
  
  mainFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8')
    if (content.includes('createApp')) {
      hasCreateApp = true
      console.log(`✅ ${file}: 使用了 createApp`)
    }
  })
  
  if (!hasCreateApp && mainFiles.length > 0) {
    console.error('❌ 主文件中未找到 createApp 的使用')
    process.exit(1)
  }
  
  // 检查路由配置
  const routerFiles = glob.sync('src/router/**/*.{js,ts}')
  let hasCreateRouter = false
  
  routerFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8')
    if (content.includes('createRouter')) {
      hasCreateRouter = true
      console.log(`✅ ${file}: 使用了 createRouter`)
    }
  })
  
  if (routerFiles.length > 0 && !hasCreateRouter) {
    console.error('❌ 路由文件中未找到 createRouter 的使用')
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkVue3Syntax()
  checkVue3Usage()
}

export { checkVue3Syntax, checkVue3Usage } 