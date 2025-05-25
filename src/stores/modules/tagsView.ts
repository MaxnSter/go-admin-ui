import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TagView } from '../types'

export const useTagsViewStore = defineStore('tagsView', () => {
  // 状态定义
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])

  // Actions
  /**
   * 添加访问过的视图
   */
  const addVisitedView = (view: TagView): void => {
    if (visitedViews.value.some(v => v.path === view.path)) return
    visitedViews.value.push({
      ...view,
      title: view.meta?.title || 'no-name'
    })
  }

  /**
   * 添加缓存视图
   */
  const addCachedView = (view: TagView): void => {
    if (!view.name || cachedViews.value.includes(view.name)) return
    if (!view.meta?.noCache) {
      cachedViews.value.push(view.name)
    }
  }

  /**
   * 添加视图（同时添加到访问和缓存列表）
   */
  const addView = (view: TagView): void => {
    addVisitedView(view)
    addCachedView(view)
  }

  /**
   * 删除访问过的视图
   */
  const delVisitedView = (view: TagView): Promise<TagView[]> => {
    return new Promise(resolve => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      resolve([...visitedViews.value])
    })
  }

  /**
   * 删除缓存视图
   */
  const delCachedView = (view: TagView): Promise<string[]> => {
    return new Promise(resolve => {
      if (view.name) {
        const index = cachedViews.value.indexOf(view.name)
        index > -1 && cachedViews.value.splice(index, 1)
      }
      resolve([...cachedViews.value])
    })
  }

  /**
   * 删除视图（同时从访问和缓存列表删除）
   */
  const delView = (view: TagView): Promise<{ visitedViews: TagView[], cachedViews: string[] }> => {
    return new Promise(resolve => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  /**
   * 删除其他访问过的视图
   */
  const delOthersVisitedViews = (view: TagView): Promise<TagView[]> => {
    return new Promise(resolve => {
      visitedViews.value = visitedViews.value.filter(v => {
        return v.meta?.affix || v.path === view.path
      })
      resolve([...visitedViews.value])
    })
  }

  /**
   * 删除其他缓存视图
   */
  const delOthersCachedViews = (view: TagView): Promise<string[]> => {
    return new Promise(resolve => {
      if (cachedViews.value.length > 0 && view.name) {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
          cachedViews.value = cachedViews.value.slice(index, index + 1)
        } else {
          // if index = -1, there is no cached tags
          cachedViews.value = []
        }
      }
      resolve([...cachedViews.value])
    })
  }

  /**
   * 删除其他视图
   */
  const delOthersViews = (view: TagView): Promise<{ visitedViews: TagView[], cachedViews: string[] }> => {
    return new Promise(resolve => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  /**
   * 删除所有访问过的视图
   */
  const delAllVisitedViews = (): Promise<TagView[]> => {
    return new Promise(resolve => {
      // keep affix tags
      const affixTags = visitedViews.value.filter(tag => tag.meta?.affix)
      visitedViews.value = affixTags
      resolve([...visitedViews.value])
    })
  }

  /**
   * 删除所有缓存视图
   */
  const delAllCachedViews = (): Promise<string[]> => {
    return new Promise(resolve => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  /**
   * 删除所有视图
   */
  const delAllViews = (): Promise<{ visitedViews: TagView[], cachedViews: string[] }> => {
    return new Promise(resolve => {
      delAllVisitedViews()
      delAllCachedViews()
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  /**
   * 更新访问过的视图
   */
  const updateVisitedView = (view: TagView): void => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        Object.assign(v, view)
        break
      }
    }
  }

  return {
    // 状态
    visitedViews,
    cachedViews,
    
    // 方法
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView
  }
}) 