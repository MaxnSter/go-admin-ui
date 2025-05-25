/**
 * Element UI 到 Element Plus 图标映射
 * 用于迁移过程中的图标替换
 */

import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  Upload,
  View,
  Key,
  ArrowLeft,
  QuestionFilled,
  CaretBottom,
  CaretTop,
  RefreshLeft,
  RefreshRight,
  Minus,
  Share,
  WarningFilled,
  Warning
} from '@element-plus/icons-vue'

// Element UI 图标类名到 Element Plus 图标组件的映射
export const iconMapping: Record<string, any> = {
  'el-icon-search': Search,
  'el-icon-refresh': Refresh,
  'el-icon-plus': Plus,
  'el-icon-edit': Edit,
  'el-icon-delete': Delete,
  'el-icon-download': Download,
  'el-icon-upload': Upload,
  'el-icon-view': View,
  'el-icon-key': Key,
  'el-icon-arrow-left': ArrowLeft,
  'el-icon-question': QuestionFilled,
  'el-icon-caret-bottom': CaretBottom,
  'el-icon-caret-top': CaretTop,
  'el-icon-refresh-left': RefreshLeft,
  'el-icon-refresh-right': RefreshRight,
  'el-icon-minus': Minus,
  'el-icon-share': Share,
  'el-icon-warning-outline': Warning,
  'el-icon-warning': WarningFilled
}

// 获取图标组件
export function getIcon(iconName: string) {
  return iconMapping[iconName] || QuestionFilled
}

// 图标名称转换函数
export function convertIconName(oldIconName: string): string {
  const mapping: Record<string, string> = {
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
  
  return mapping[oldIconName] || 'QuestionFilled'
} 