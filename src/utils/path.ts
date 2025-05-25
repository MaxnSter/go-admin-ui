/**
 * 浏览器兼容的路径解析工具
 * 替代 Node.js 的 path 模块
 */

/**
 * 解析路径，类似 path.resolve()
 * @param basePath 基础路径
 * @param relativePath 相对路径
 * @returns 解析后的路径
 */
export function resolve(basePath: string, relativePath: string): string {
  // 如果相对路径是绝对路径，直接返回
  if (relativePath.startsWith('/')) {
    return relativePath
  }

  // 确保基础路径以 / 开头
  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath
  }

  // 确保基础路径以 / 结尾
  if (!basePath.endsWith('/')) {
    basePath = basePath + '/'
  }

  // 拼接路径
  let result = basePath + relativePath

  // 规范化路径，处理 .. 和 .
  const parts = result.split('/').filter(part => part !== '')
  const resolvedParts: string[] = []

  for (const part of parts) {
    if (part === '..') {
      resolvedParts.pop()
    } else if (part !== '.') {
      resolvedParts.push(part)
    }
  }

  return '/' + resolvedParts.join('/')
}

/**
 * 获取路径的目录名
 * @param path 路径
 * @returns 目录名
 */
export function dirname(path: string): string {
  const lastSlashIndex = path.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return '.'
  }
  if (lastSlashIndex === 0) {
    return '/'
  }
  return path.slice(0, lastSlashIndex)
}

/**
 * 获取路径的基础名
 * @param path 路径
 * @returns 基础名
 */
export function basename(path: string): string {
  const lastSlashIndex = path.lastIndexOf('/')
  return path.slice(lastSlashIndex + 1)
}

/**
 * 拼接路径
 * @param paths 路径片段
 * @returns 拼接后的路径
 */
export function join(...paths: string[]): string {
  const filteredPaths = paths.filter(path => path && path !== '')
  if (filteredPaths.length === 0) {
    return '.'
  }

  let result = filteredPaths.join('/')
  
  // 规范化路径
  const parts = result.split('/').filter(part => part !== '')
  const resolvedParts: string[] = []

  for (const part of parts) {
    if (part === '..') {
      resolvedParts.pop()
    } else if (part !== '.') {
      resolvedParts.push(part)
    }
  }

  // 保持开头的 / 如果原始路径有的话
  const hasLeadingSlash = result.startsWith('/')
  result = resolvedParts.join('/')
  
  return hasLeadingSlash ? '/' + result : result
}

// 默认导出一个包含所有方法的对象，模拟 Node.js path 模块
const pathUtils = {
  resolve,
  dirname,
  basename,
  join
}

export default pathUtils 