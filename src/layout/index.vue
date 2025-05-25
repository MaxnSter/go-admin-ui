<template>
  <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" :style="{ backgroundColor: themeStyle === 'dark' ? variables.menuBg : variables.menuLightBg }" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel/index.vue'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { useAppStore, useSettingsStore } from '@/stores'
import { computed } from 'vue'
import variables from '@/styles/variables.js'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  setup() {
    const appStore = useAppStore()
    const settingsStore = useSettingsStore()
    
    const sidebar = computed(() => appStore.sidebar || { opened: true, withoutAnimation: false })
    const device = computed(() => appStore.device || 'desktop')
    const showSettings = computed(() => settingsStore.showSettings || false)
    const needTagsView = computed(() => settingsStore.tagsView || false)
    const fixedHeader = computed(() => settingsStore.fixedHeader || false)
    const theme = computed(() => settingsStore.theme || '#409EFF')
    const themeStyle = computed(() => settingsStore.themeStyle || 'light')
    
    const classObj = computed(() => ({
      hideSidebar: !sidebar.value.opened,
      openSidebar: sidebar.value.opened,
      withoutAnimation: sidebar.value.withoutAnimation,
      mobile: device.value === 'mobile'
    }))
    
    const handleClickOutside = () => {
      appStore.closeSideBar(false)
    }
    
    return {
      sidebar,
      device,
      showSettings,
      needTagsView,
      fixedHeader,
      theme,
      themeStyle,
      classObj,
      variables,
      handleClickOutside
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
