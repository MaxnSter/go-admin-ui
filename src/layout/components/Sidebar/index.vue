<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color=" $store.state.settings.themeStyle === 'light' ? variables.menuLightBg : variables.menuBg"
        :text-color="$store.state.settings.themeStyle === 'light' ? 'rgba(0,0,0,.65)' : '#fff'"
        :active-text-color="$store.state.settings.theme"
        :unique-opened="true"
        :collapse-transition="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route) in sidebarRouters"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { usePermissionStore, useAppStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.js'

export default {
  components: { SidebarItem, Logo },
  setup() {
    const permissionStore = usePermissionStore()
    const appStore = useAppStore()
    const route = useRoute()
    
    const sidebarRouters = computed(() => permissionStore.sidebarRouters || [])
    const sidebar = computed(() => appStore.sidebar || { opened: true })
    
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    
    const showLogo = computed(() => {
      // 这里需要从 settings store 获取，暂时返回 true
      return true
    })
    
    const isCollapse = computed(() => !sidebar.value.opened)
    
    return {
      sidebarRouters,
      sidebar,
      activeMenu,
      showLogo,
      variables,
      isCollapse
    }
  }
}
</script>
