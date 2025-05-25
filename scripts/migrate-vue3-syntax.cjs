#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// 获取所有Vue文件
const vueFiles = glob.sync('src/**/*.vue', { cwd: process.cwd() })

console.log(`找到 ${vueFiles.length} 个Vue文件`)

let totalReplacements = 0

vueFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath)
  let content = fs.readFileSync(fullPath, 'utf8')
  let fileReplacements = 0
  
  // 替换 slot-scope 为 v-slot
  const slotScopeRegex = /<template\s+slot-scope="([^"]+)"/g
  const slotScopeMatches = content.match(slotScopeRegex)
  if (slotScopeMatches) {
    content = content.replace(slotScopeRegex, '<template #default="$1"')
    fileReplacements += slotScopeMatches.length
  }
  
  // 替换 slot="name" 为 #name
  const namedSlotRegex = /<template\s+slot="([^"]+)"/g
  const namedSlotMatches = content.match(namedSlotRegex)
  if (namedSlotMatches) {
    content = content.replace(namedSlotRegex, '<template #$1')
    fileReplacements += namedSlotMatches.length
  }
  
  // 替换 :visible.sync 为 v-model:visible
  const visibleSyncRegex = /:visible\.sync/g
  const visibleSyncMatches = content.match(visibleSyncRegex)
  if (visibleSyncMatches) {
    content = content.replace(visibleSyncRegex, 'v-model:visible')
    fileReplacements += visibleSyncMatches.length
  }
  
  // 替换其他 .sync 为 v-model
  const syncRegex = /:([a-zA-Z-]+)\.sync/g
  const syncMatches = content.match(syncRegex)
  if (syncMatches) {
    content = content.replace(syncRegex, 'v-model:$1')
    fileReplacements += syncMatches.length
  }
  
  // 替换 .native 修饰符（在Vue 3中不再需要）
  const nativeRegex = /\.native/g
  const nativeMatches = content.match(nativeRegex)
  if (nativeMatches) {
    content = content.replace(nativeRegex, '')
    fileReplacements += nativeMatches.length
  }
  
  // 替换 el-button size="mini" 为 size="small"
  const miniSizeRegex = /size="mini"/g
  const miniSizeMatches = content.match(miniSizeRegex)
  if (miniSizeMatches) {
    content = content.replace(miniSizeRegex, 'size="small"')
    fileReplacements += miniSizeMatches.length
  }
  
  if (fileReplacements > 0) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ ${filePath}: 替换了 ${fileReplacements} 个语法`)
    totalReplacements += fileReplacements
  }
})

console.log(`\n🎉 Vue 3 语法迁移完成！总共替换了 ${totalReplacements} 个语法`) 