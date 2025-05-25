<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import adminDashboard from './admin/index.vue'
import editorDashboard from './editor/index.vue'

export default {
  name: 'Dashboard',
  components: { 
    adminDashboard, 
    editorDashboard 
  },
  setup() {
    const userStore = useUserStore()
    const currentRole = ref('adminDashboard')

    // 计算属性：获取用户角色
    const roles = computed(() => userStore.roles)

    onMounted(() => {
      // 根据用户角色决定显示哪个 dashboard
      if (!roles.value.includes('admin')) {
        currentRole.value = 'editorDashboard'
      }
    })

    return {
      currentRole,
      roles
    }
  }
}
</script>
