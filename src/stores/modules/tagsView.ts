import { defineStore } from 'pinia'

export interface View {
  name: string
  path: string
  meta: any
}

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [] as View[],
    cachedViews: [] as string[]
  }),
  actions: {
    addVisitedView(view: View) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push(Object.assign({}, view, { title: view.meta.title || 'no-name' }))
    },
    addCachedView(view: View) {
      if (this.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name)
      }
    },
    delVisitedView(view: View) {
      this.visitedViews = this.visitedViews.filter(v => v.path !== view.path)
    },
    delCachedView(view: View) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) this.cachedViews.splice(index, 1)
    },
    delOthersVisitedViews(view: View) {
      this.visitedViews = this.visitedViews.filter(v => v.meta.affix || v.path === view.path)
    },
    delOthersCachedViews(view: View) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
    },
    delAllVisitedViews() {
      this.visitedViews = this.visitedViews.filter(tag => tag.meta.affix)
    },
    delAllCachedViews() {
      this.cachedViews = []
    },
    updateVisitedView(view: View) {
      for (const v of this.visitedViews) {
        if (v.path === view.path) {
          Object.assign(v, view)
          break
        }
      }
    }
  }
})
