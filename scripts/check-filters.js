import fs from 'fs'
import { glob } from 'glob'

function checkFilters() {
  console.log('🔍 检查过滤器迁移...')
  const files = glob.sync('src/**/*.{js,ts,vue}', { ignore: ['node_modules/**'] })
  const issues = []
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      if (content.includes('Vue.filter')) {
        issues.push(`${file}: 使用了 Vue.filter, 请迁移到全局属性或函数`)
      }
      if (file.endsWith('.vue') && /\{\{[^}]*\|[^}]*\}\}/.test(content)) {
        issues.push(`${file}: 模板中发现过滤器语法`)
      }
    } catch (e) {
      console.warn(`⚠️  无法读取文件 ${file}: ${e.message}`)
    }
  })
  if (issues.length) {
    console.error('\n❌ 过滤器迁移未完成:')
    issues.forEach(i => console.error(`  ${i}`))
    console.error(`\n总计发现 ${issues.length} 个问题`)
    process.exit(1)
  } else {
    console.log('\n✅ 过滤器检查通过')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkFilters()
}

export { checkFilters }
