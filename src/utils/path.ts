/**
 * 浏览器兼容的 path 工具函数
 * 替代 Node.js 的 path 模块
 */

/**
 * 解析路径，类似 path.resolve
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

  // 组合路径
  const fullPath = basePath + relativePath

  // 规范化路径，处理 .. 和 .
  const parts = fullPath.split('/').filter(part => part !== '')
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
 * 连接路径，类似 path.join
 * @param paths 路径片段
 * @returns 连接后的路径
 */
export function join(...paths: string[]): string {
  const filteredPaths = paths.filter(path => path && path.length > 0)
  if (filteredPaths.length === 0) {
    return '/'
  }

  let result = filteredPaths.join('/')
  
  // 规范化路径
  result = result.replace(/\/+/g, '/') // 替换多个连续的 /
  
  // 确保以 / 开头
  if (!result.startsWith('/')) {
    result = '/' + result
  }

  return result
}

export default {
  resolve,
  join
} 