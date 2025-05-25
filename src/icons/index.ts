import type { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 自动导入所有svg图标
const modules = import.meta.glob('./svg/*.svg', { eager: true })

// 注册所有SVG图标
const iconNames: string[] = []
Object.keys(modules).forEach(path => {
  const iconName = path.replace('./svg/', '').replace('.svg', '')
  iconNames.push(iconName)
})

console.log(`📦 已加载 ${iconNames.length} 个 SVG 图标:`, iconNames)

export default {
  install(app: App) {
    // 全局注册SvgIcon组件
    app.component('SvgIcon', SvgIcon)
    
    // 将图标名称列表添加到全局属性中，供IconSelect组件使用
    app.config.globalProperties.$iconNames = iconNames
  }
}

// 导出图标名称列表供其他组件使用
export { iconNames } 