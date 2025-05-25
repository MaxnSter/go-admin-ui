<template>
  <div id="tags-view-container" class="tags-view-container">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-remove="closeSelectedTag"
    >
      <el-tab-pane
        v-for="item in visitedViews"
        :key="item.path"
        :closable="item.fullPath === '/dashboard' ? false : true"
        :name="item.fullPath"
      >
        <template #label>
          <router-link
            ref="tag"
            class="tags-view-item"
            :style="{ color: item.fullPath === $route.fullPath ? theme : '' }"
            :to="{ path: item.path, query: item.query, fullPath: item.fullPath }"
            @contextmenu.prevent="openMenu(item,$event)"
          >
            {{ item.title }}
          </router-link>
        </template>
      </el-tab-pane>
    </el-tabs>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li class="tags-item" @click="refreshSelectedTag(selectedTag)" @mouseover="handleTagsOver(1)" @mouseleave="handleTagsLeave(1)">刷新当前标签页</li>
      <li v-if="!isAffix(selectedTag)" class="tags-item" @click="closeSelectedTag(selectedTag)" @mouseover="handleTagsOver(2)" @mouseleave="handleTagsLeave(2)">关闭当前标签页</li>
      <li class="tags-item" @click="closeOthersTags" @mouseover="handleTagsOver(3)" @mouseleave="handleTagsLeave(3)">关闭其他标签页</li>
      <li class="tags-item" @click="closeAllTags(selectedTag)" @mouseover="handleTagsOver(4)" @mouseleave="handleTagsLeave(4)">关闭全部标签页</li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { usePermissionStore } from '@/stores/modules/permission'
import { useSettingsStore } from '@/stores/modules/settings'
import path from '@/utils/path'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const tagsViewStore = useTagsViewStore()
    const permissionStore = usePermissionStore()
    const settingsStore = useSettingsStore()

    // 响应式数据
    const editableTabsValue = ref('/')
    const top = ref(0)
    const left = ref(0)
    const selectedTag = ref({})
    const affixTags = ref([])
    const visible = ref(false)

    // 计算属性
    const visitedViews = computed(() => tagsViewStore.visitedViews)
    const routes = computed(() => permissionStore.routes)
    const theme = computed(() => settingsStore.theme)

    // 方法
    const beforeUnload = () => {
      // 监听页面刷新
      window.addEventListener('beforeunload', () => {
        const tabViews = visitedViews.value.map(item => {
          return {
            fullPath: item.fullPath,
            hash: item.hash,
            meta: { ...item.meta },
            name: item.name,
            params: { ...item.params },
            path: item.path,
            query: { ...item.query },
            title: item.title
          }
        })
        sessionStorage.setItem('tabViews', JSON.stringify(tabViews))
      })
      // 页面初始化加载判断缓存中是否有数据
      const oldViews = JSON.parse(sessionStorage.getItem('tabViews')) || []
      if (oldViews.length > 0) {
        // 直接设置 visitedViews，因为 Pinia 是响应式的
        tagsViewStore.visitedViews.splice(0, tagsViewStore.visitedViews.length, ...oldViews)
      }
    }
    const handleTagsOver = (index) => {
      const tags = document.querySelectorAll('.tags-item')
      const item = tags[index - 1]
      item.style.cssText = `color:${theme.value};background:${
        theme.value.colorRgb()
      }`
    }

    const handleTagsLeave = (index) => {
      const tags = document.querySelectorAll('.tags-item')
      const item = tags[index - 1]
      item.style.cssText = `color:#606266`
    }
    const isActive = () => {
      const index = visitedViews.value.findIndex(item => item.fullPath === route.fullPath)
      const pathIndex = index > -1 ? index : 0
      editableTabsValue.value = visitedViews.value[pathIndex].fullPath
    }

    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }
    const filterAffixTags = (routes, basePath = '/') => {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    const initTags = () => {
      const affixTagsList = filterAffixTags(routes.value)
      affixTags.value = affixTagsList
      for (const tag of affixTagsList) {
        // Must have tag name
        if (tag.name) {
          tagsViewStore.addVisitedView(tag)
        }
      }
    }

    const addTags = () => {
      const { name } = route
      if (name) {
        tagsViewStore.addView(route)
        isActive()
      }
      return false
    }
    const moveToCurrentTag = () => {
      const tags = document.querySelectorAll('.tags-view-item')
      nextTick(() => {
        for (const tag of tags) {
          if (tag.to && tag.to.path === route.path) {
            // when query is different then update
            if (tag.to.fullPath !== route.fullPath) {
              tagsViewStore.updateVisitedView(route)
            }
            break
          }
        }
      })
    }
    const refreshSelectedTag = async (view) => {
      await tagsViewStore.delCachedView(view)
      const { fullPath } = view
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

    const closeSelectedTag = async (view) => {
      const routerPath = view.fullPath ? view.fullPath : view
      const index = visitedViews.value.findIndex(item => item.fullPath === routerPath)
      if (index > -1) {
        const path = visitedViews.value[index]
        const { visitedViews: newVisitedViews } = await tagsViewStore.delView(path)
        if (editableTabsValue.value === path.fullPath) {
          toLastView(newVisitedViews, path)
        }
      }
    }
    const closeOthersTags = async () => {
      router.push(selectedTag.value.path).catch(e => e)
      await tagsViewStore.delOthersViews(selectedTag.value)
      moveToCurrentTag()
    }

    const closeAllTags = async (view) => {
      const { visitedViews: newVisitedViews } = await tagsViewStore.delAllViews()
      if (affixTags.value.some(tag => tag.path === view.path)) {
        return
      }
      toLastView(newVisitedViews, view)
    }

    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath).catch(err => err)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }
    const openMenu = (tag, e) => {
      const menuMinWidth = 105
      const container = document.getElementById('tags-view-container')
      const offsetLeft = container?.getBoundingClientRect().left || 0 // container margin left
      const offsetWidth = container?.offsetWidth || 0 // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const leftPos = e.clientX - offsetLeft + 15 // 15: margin right

      if (leftPos > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = leftPos
      }

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }

    const closeMenu = () => {
      visible.value = false
    }

    // 监听器
    watch(() => route, () => {
      addTags()
    })

    watch(visible, (value) => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    // 生命周期
    onMounted(() => {
      initTags()
      addTags()
      isActive()
      beforeUnload()
    })

    return {
      editableTabsValue,
      top,
      left,
      selectedTag,
      affixTags,
      visible,
      visitedViews,
      routes,
      theme,
      beforeUnload,
      handleTagsOver,
      handleTagsLeave,
      isActive,
      isAffix,
      filterAffixTags,
      initTags,
      addTags,
      moveToCurrentTag,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      toLastView,
      openMenu,
      closeMenu
    }
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.colorRgb = function() {
  let sColor = this.toLowerCase()
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',0.2)'
  } else {
    return sColor
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container :deep() {
  height: 43px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  padding: 0 15px;
  box-sizing: border-box;
  .el-tabs__item{
    &:hover{
      color: #000;
    }
  }
  .tags-view-item{
    height: 40px;
    display: inline-block;
  }
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 1px 2px 10px #ccc;
    -moz-user-select:none;
    -webkit-user-select:none;
    user-select:none;
    li {
      list-style: none;
      line-height: 36px;
      padding: 2px 20px;
      margin: 0;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      outline: 0;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
