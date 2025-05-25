<template>
  <div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
    >
      <el-tab-pane
        v-for="item in visitedViews"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      />
    </el-tabs>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { usePermissionStore } from '@/stores/modules/permission'
import { useSettingsStore } from '@/stores/modules/settings'
import path from '@/utils/path'

export default {
  name: 'TagsView',
  setup() {
    const route = useRoute()
    const tagsViewStore = useTagsViewStore()
    const permissionStore = usePermissionStore()
    const settingsStore = useSettingsStore()

    const editableTabsValue = ref('1')
    const affixTags = ref([])

    const visitedViews = computed(() => tagsViewStore.visitedViews)
    const routes = computed(() => permissionStore.routes)
    const theme = computed(() => settingsStore.theme)

    const isActive = (route) => {
      return route.path === route.path
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
      }
      return false
    }

    watch(() => route, () => {
      addTags()
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    return {
      editableTabsValue,
      visitedViews,
      routes,
      theme,
      isActive,
      isAffix,
      filterAffixTags,
      initTags,
      addTags
    }
  }
}
</script>

<style></style>
