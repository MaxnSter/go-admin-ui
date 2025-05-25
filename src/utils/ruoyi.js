// 若依工具函数
export { addDateRange, parseTime } from '@/utils/costum'
export { resolveBlob } from '@/utils/zipdownload'

// 下载文件函数
export function download(data) {
  resolveBlob({ data }, 'application/octet-stream')
} 