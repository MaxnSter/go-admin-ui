import fs from 'fs'
import path from 'path'

function checkDependencies() {
  console.log('🔍 检查依赖版本...')
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const deps = pkg.dependencies || {}
    const devDeps = pkg.devDependencies || {}
    const allDeps = { ...deps, ...devDeps }
    const issues = []
    const warnings = []
    
    // 检查 Vue 版本
    if (!deps.vue) {
      issues.push('缺少 Vue 依赖')
    } else if (!deps.vue.match(/^\^?3\./)) {
      issues.push(`Vue 版本不是 3.x，当前版本: ${deps.vue}`)
    } else {
      console.log(`✅ Vue: ${deps.vue}`)
    }
    
    // 检查 Vue Router 版本
    if (deps['vue-router']) {
      if (!deps['vue-router'].match(/^\^?4\./)) {
        issues.push(`Vue Router 版本不是 4.x，当前版本: ${deps['vue-router']}`)
      } else {
        console.log(`✅ Vue Router: ${deps['vue-router']}`)
      }
    }
    
    // 检查是否还有 Vuex（应该迁移到 Pinia）
    if (allDeps.vuex) {
      warnings.push(`仍然依赖 Vuex (${allDeps.vuex})，建议迁移到 Pinia`)
    }
    
    // 检查是否有 Pinia
    if (deps.pinia) {
      console.log(`✅ Pinia: ${deps.pinia}`)
    } else if (!allDeps.vuex) {
      warnings.push('既没有 Pinia 也没有 Vuex，可能缺少状态管理')
    }
    
    // 检查 Element Plus（如果项目使用）
    if (deps['element-plus']) {
      console.log(`✅ Element Plus: ${deps['element-plus']}`)
    } else if (allDeps['element-ui']) {
      issues.push(`仍在使用 Element UI (${allDeps['element-ui']})，应该迁移到 Element Plus`)
    }
    
    // 检查构建工具
    if (allDeps.vite) {
      console.log(`✅ Vite: ${allDeps.vite}`)
    } else if (allDeps.webpack) {
      warnings.push(`使用 Webpack (${allDeps.webpack})，建议考虑迁移到 Vite`)
    }
    
    // 检查 TypeScript 支持
    if (allDeps.typescript) {
      console.log(`✅ TypeScript: ${allDeps.typescript}`)
    }
    
    // 检查 Vue 3 相关的开发依赖
    const vue3DevDeps = [
      '@vitejs/plugin-vue',
      '@vue/compiler-sfc',
      'vue-tsc'
    ]
    
    vue3DevDeps.forEach(dep => {
      if (allDeps[dep]) {
        console.log(`✅ ${dep}: ${allDeps[dep]}`)
      }
    })
    
    // 检查可能的 Vue 2 相关依赖
    const vue2Deps = [
      'vue-template-compiler',
      '@vue/composition-api',
      'vue-class-component',
      'vue-property-decorator'
    ]
    
    vue2Deps.forEach(dep => {
      if (allDeps[dep]) {
        warnings.push(`发现 Vue 2 相关依赖 ${dep} (${allDeps[dep]})，可能需要移除或更新`)
      }
    })
    
    // 输出结果
    if (warnings.length > 0) {
      console.log('\n⚠️  警告:')
      warnings.forEach(warning => console.warn(`  ${warning}`))
    }
    
    if (issues.length > 0) {
      console.error('\n❌ 依赖版本问题:')
      issues.forEach(issue => console.error(`  ${issue}`))
      console.error(`\n总计发现 ${issues.length} 个问题`)
      process.exit(1)
    } else {
      console.log('\n✅ 依赖版本检查通过')
    }
    
  } catch (error) {
    console.error('❌ 无法读取 package.json:', error.message)
    process.exit(1)
  }
}

function checkLockFile() {
  console.log('\n🔍 检查锁定文件...')
  
  const lockFiles = ['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json']
  const existingLockFiles = lockFiles.filter(file => fs.existsSync(file))
  
  if (existingLockFiles.length === 0) {
    console.warn('⚠️  未找到锁定文件，建议运行包管理器安装命令')
  } else if (existingLockFiles.length > 1) {
    console.warn('⚠️  发现多个锁定文件:', existingLockFiles.join(', '))
    console.warn('   建议只保留一个包管理器的锁定文件')
  } else {
    console.log(`✅ 锁定文件: ${existingLockFiles[0]}`)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDependencies()
  checkLockFile()
}

export { checkDependencies, checkLockFile } 