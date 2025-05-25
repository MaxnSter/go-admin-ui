import fs from 'fs'
import { glob } from 'glob'

function checkDirectives() {
  console.log('🔍 检查自定义指令迁移...')
  const files = glob.sync('src/directive/**/*.{js,ts}', { ignore: ['node_modules/**'] })
  const issues = []
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      if (content.includes('bind(') || content.includes('inserted(')) {
        issues.push(`${file}: 使用了 Vue 2 指令生命周期 (bind/inserted)`)
      }
      if (content.includes('Vue.directive')) {
        issues.push(`${file}: 使用了 Vue.directive 全局注册方式`)
      }
    } catch (e) {
      console.warn(`⚠️  无法读取文件 ${file}: ${e.message}`)
    }
  })
  if (issues.length) {
    console.error('\n❌ 指令迁移存在问题:')
    issues.forEach(i => console.error(`  ${i}`))
    console.error(`\n总计发现 ${issues.length} 个问题`)
    process.exit(1)
  } else {
    console.log('\n✅ 指令检查通过')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkDirectives()
}

export { checkDirectives }
