<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        v-if="index < visibleNumber"
        :key="index"
        :index="item.path"
      ><svg-icon :icon-class="item.meta.icon" />
        {{ item.meta.title }}</el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu v-if="topMenus.length > visibleNumber" index="more">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          v-if="index >= visibleNumber"
          :key="index"
          :index="item.path"
        ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'
import { constantRoutes } from '@/router'

export default {
  setup() {
    const route = useRoute()
    const permissionStore = usePermissionStore()
    
    // 响应式数据
    const visibleNumber = ref(5)
    const isFrist = ref(false)

    // 计算属性
    const routers = computed(() => permissionStore.topbarRouters || [])
    
    const topMenus = computed(() => {
      return routers.value.map((menu) => ({
        ...menu,
        children: undefined
      }))
    })

    const childrenMenus = computed(() => {
      const childrenMenus = []
      routers.value.map((router) => {
        for (const item in router.children) {
          if (router.children[item].parentPath === undefined) {
            router.children[item].parentPath = router.path
          }
          childrenMenus.push(router.children[item])
        }
      })
      return constantRoutes.concat(childrenMenus)
    })

    const activeMenu = computed(() => {
      const path = route.path
      let activePath = routers.value[0]?.path || '/'
      if (path.lastIndexOf('/') > 0) {
        const tmpPath = path.substring(1, path.length)
        activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'))
      } else if (path === '/index' || path === '') {
        if (!isFrist.value) {
          isFrist.value = true
        } else {
          activePath = 'index'
        }
      }
      activeRoutes(activePath)
      return activePath
    })

    // 方法
    const setVisibleNumber = () => {
      const width = document.body.getBoundingClientRect().width - 200
      const elWidth = document.querySelector('.el-menu--horizontal')?.getBoundingClientRect().width || 0
      const menuItemNodes = document.querySelectorAll('.el-menu--horizontal .el-menu-item')
      const menuWidth = Array.from(menuItemNodes).map(
        (i) => i.getBoundingClientRect().width
      )
      visibleNumber.value = Math.floor((width - elWidth) / (menuWidth[0] || 100))
    }

    const handleSelect = (key, keyPath) => {
      if (key.indexOf('http://') !== -1 || key.indexOf('https://') !== -1) {
        window.open(key, '_blank')
      } else {
        activeRoutes(key)
      }
    }

    const activeRoutes = (key) => {
      const routes = []
      if (childrenMenus.value && childrenMenus.value.length > 0) {
        childrenMenus.value.map((item) => {
          if (key === item.parentPath || (key === 'index' && item.path === '')) {
            routes.push(item)
          }
        })
      }
      permissionStore.setSidebarRouters(routes)
    }

    onMounted(() => {
      setVisibleNumber()
    })

    return {
      topMenus,
      routers,
      childrenMenus,
      activeMenu,
      visibleNumber,
      setVisibleNumber,
      handleSelect,
      activeRoutes
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px;
  line-height: 50px;
  margin: 0;
  border-bottom: 3px solid transparent;
  color: #999093;
  padding: 0 5px;
  margin: 0 10px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #409eff;
  color: #303133;
}
</style>
