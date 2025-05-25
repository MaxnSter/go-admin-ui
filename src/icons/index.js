import SvgIcon from '@/components/SvgIcon/index.vue'

// 自动导入所有 svg 图标
const modules = import.meta.glob('./svg/*.svg', { eager: true })
const requireAll = () => Object.keys(modules || {})

// 导出 SvgIcon 组件供全局注册
export { SvgIcon }
export default requireAll
