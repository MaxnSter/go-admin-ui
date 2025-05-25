// 使用 Vite 的 import.meta.glob 替代 webpack 的 require.context
const modules = import.meta.glob('../../icons/svg/*.svg', { eager: true })

const icons: string[] = Object.keys(modules).map(path => {
  const match = path.match(/.*\/(.*)\.svg$/)
  return match ? match[1] : ''
}).filter(Boolean)

export default icons 