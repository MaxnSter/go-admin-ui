<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from '@/utils/path'
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'

export default {
  name: 'HeaderSearch',
  setup() {
    const router = useRouter()
    const permissionStore = usePermissionStore()
    
    // 响应式数据
    const search = ref('')
    const options = ref([])
    const searchPool = ref([])
    const show = ref(false)
    const fuse = ref(undefined)
    const headerSearchSelect = ref(null)

    // 计算属性
    const routes = computed(() => permissionStore.routes || [])

    // 方法
    const click = () => {
      show.value = !show.value
      if (show.value) {
        headerSearchSelect.value && headerSearchSelect.value.focus()
      }
    }

    const close = () => {
      headerSearchSelect.value && headerSearchSelect.value.blur()
      options.value = []
      show.value = false
    }

    const change = (val) => {
      router.push(val.path)
      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
    }

    const initFuse = (list) => {
      fuse.value = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    }

    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    const generateRoutes = (routes, basePath = '/', prefixTitle = []) => {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    const querySearch = (query) => {
      if (query !== '') {
        options.value = fuse.value.search(query)
      } else {
        options.value = []
      }
    }

    // 监听器
    watch(routes, () => {
      searchPool.value = generateRoutes(routes.value)
    })

    watch(searchPool, (list) => {
      initFuse(list)
    })

    watch(show, (value) => {
      if (value) {
        document.body.addEventListener('click', close)
      } else {
        document.body.removeEventListener('click', close)
      }
    })

    // 生命周期
    onMounted(() => {
      searchPool.value = generateRoutes(routes.value)
    })

    return {
      search,
      options,
      searchPool,
      show,
      fuse,
      headerSearchSelect,
      routes,
      click,
      close,
      change,
      initFuse,
      generateRoutes,
      querySearch
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
