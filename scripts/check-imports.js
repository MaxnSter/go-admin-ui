import fs from 'fs'
import { glob } from 'glob'

function checkImports() {
  console.log('🔍 检查导入语句...')
  const files = glob.sync('src/**/*.{js,ts,vue}', { ignore: ['node_modules/**'] })
  const issues = []
  const targets = [
    { pattern: /from\s+['"]element-ui['"]/, msg: '请将 element-ui 迁移到 element-plus' },
    { pattern: /from\s+['"]vuex['"]/, msg: '请将 vuex 迁移到 pinia' },
    { pattern: /from\s+['"]vue-router@?3/, msg: '请将 vue-router 升级到 4.x' },
    { pattern: /from\s+['"]vue-codemirror/, msg: '请迁移到 @codemirror/vue' },
    { pattern: /from\s+['"]vue-cropper['"]/, msg: '请迁移到 vue-advanced-cropper' },
    { pattern: /from\s+['"]vuedraggable['"]/, msg: '请迁移到 vue-draggable-plus' },
    { pattern: /from\s+['"]echarts['"]/, msg: '请升级到 ECharts 5.x 并使用 vue-echarts' }
  ]
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      targets.forEach(t => {
        if (t.pattern.test(content)) {
          issues.push(`${file}: ${t.msg}`)
        }
      })
    } catch (e) {
      console.warn(`⚠️  无法读取文件 ${file}: ${e.message}`)
    }
  })
  if (issues.length) {
    console.error('\n❌ 导入语句存在旧依赖:')
    issues.forEach(i => console.error(`  ${i}`))
    console.error(`\n总计发现 ${issues.length} 个问题`)
    process.exit(1)
  } else {
    console.log('\n✅ 导入语句检查通过')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkImports()
}

export { checkImports }
