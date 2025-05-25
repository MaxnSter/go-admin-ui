<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settingsStore.themeStyle === 'light' ? variables.menuLightBg : variables.menuBg"
        :text-color="settingsStore.themeStyle === 'light' ? 'rgba(0,0,0,.65)' : '#fff'"
        :active-text-color="settingsStore.theme"
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'
import { useSettingsStore } from '@/stores/modules/settings'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

// Define variables directly since SCSS module import is not working in Vite
const variables = {
  menuBg: '#001529',
  menuLightBg: '#ffffff',
  sidebarTitle: '#ffffff',
  sidebarLightTitle: '#001529'
}

export default {
  components: { SidebarItem, Logo },
  setup() {
    const route = useRoute()
    const appStore = useAppStore()
    const permissionStore = usePermissionStore()
    const settingsStore = useSettingsStore()

    const sidebarRouters = computed(() => permissionStore.routes)
    const sidebar = computed(() => appStore.sidebar)
    
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    
    const showLogo = computed(() => settingsStore.sidebarLogo)
    const isCollapse = computed(() => !sidebar.value.opened)

    return {
      sidebarRouters,
      sidebar,
      activeMenu,
      showLogo,
      variables,
      isCollapse,
      settingsStore
    }
  }
}
</script>
