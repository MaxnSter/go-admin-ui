#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// 图标映射表
const iconMapping = {
  'el-icon-search': 'Search',
  'el-icon-refresh': 'Refresh', 
  'el-icon-plus': 'Plus',
  'el-icon-edit': 'Edit',
  'el-icon-delete': 'Delete',
  'el-icon-download': 'Download',
  'el-icon-upload': 'Upload',
  'el-icon-view': 'View',
  'el-icon-key': 'Key',
  'el-icon-arrow-left': 'ArrowLeft',
  'el-icon-question': 'QuestionFilled',
  'el-icon-caret-bottom': 'CaretBottom',
  'el-icon-caret-top': 'CaretTop',
  'el-icon-refresh-left': 'RefreshLeft',
  'el-icon-refresh-right': 'RefreshRight',
  'el-icon-minus': 'Minus',
  'el-icon-share': 'Share',
  'el-icon-warning-outline': 'Warning',
  'el-icon-warning': 'WarningFilled'
}

// 获取所有Vue文件
const vueFiles = glob.sync('src/**/*.vue', { cwd: process.cwd() })

console.log(`找到 ${vueFiles.length} 个Vue文件`)

let totalReplacements = 0

vueFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath)
  let content = fs.readFileSync(fullPath, 'utf8')
  let fileReplacements = 0
  
  // 替换 icon="el-icon-xxx" 格式
  Object.entries(iconMapping).forEach(([oldIcon, newIcon]) => {
    const iconRegex = new RegExp(`icon="${oldIcon}"`, 'g')
    const matches = content.match(iconRegex)
    if (matches) {
      content = content.replace(iconRegex, `:icon="${newIcon}"`)
      fileReplacements += matches.length
    }
  })
  
  // 替换 prefix-icon="el-icon-xxx" 格式
  Object.entries(iconMapping).forEach(([oldIcon, newIcon]) => {
    const prefixIconRegex = new RegExp(`prefix-icon="${oldIcon}"`, 'g')
    const matches = content.match(prefixIconRegex)
    if (matches) {
      content = content.replace(prefixIconRegex, `:prefix-icon="${newIcon}"`)
      fileReplacements += matches.length
    }
  })
  
  // 替换 <i class="el-icon-xxx" /> 格式
  Object.entries(iconMapping).forEach(([oldIcon, newIcon]) => {
    const iTagRegex = new RegExp(`<i\\s+class="${oldIcon}"[^>]*\\s*/>`, 'g')
    const matches = content.match(iTagRegex)
    if (matches) {
      content = content.replace(iTagRegex, `<el-icon><${newIcon} /></el-icon>`)
      fileReplacements += matches.length
    }
  })
  
  if (fileReplacements > 0) {
    // 检查是否需要添加图标导入
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      let scriptContent = scriptMatch[1]
      const usedIcons = new Set()
      
      // 收集使用的图标
      Object.entries(iconMapping).forEach(([oldIcon, newIcon]) => {
        if (content.includes(`:icon="${newIcon}"`) || 
            content.includes(`:prefix-icon="${newIcon}"`) ||
            content.includes(`<${newIcon} />`)) {
          usedIcons.add(newIcon)
        }
      })
      
      if (usedIcons.size > 0) {
        const iconImports = Array.from(usedIcons).join(', ')
        const importStatement = `import { ${iconImports} } from '@element-plus/icons-vue'\n`
        
        // 查找现有的import语句
        const importMatch = scriptContent.match(/import.*from.*['"]@element-plus\/icons-vue['"]/)
        if (importMatch) {
          // 更新现有导入
          scriptContent = scriptContent.replace(
            /import\s*{[^}]*}\s*from\s*['"]@element-plus\/icons-vue['"]/,
            `import { ${iconImports} } from '@element-plus/icons-vue'`
          )
        } else {
          // 添加新的导入
          scriptContent = importStatement + scriptContent
        }
        
        content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/, `<script${scriptMatch[0].match(/<script([^>]*)>/)[1]}>${scriptContent}</script>`)
      }
    }
    
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ ${filePath}: 替换了 ${fileReplacements} 个图标`)
    totalReplacements += fileReplacements
  }
})

console.log(`\n🎉 迁移完成！总共替换了 ${totalReplacements} 个图标`) 