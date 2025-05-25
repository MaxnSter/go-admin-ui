<template>
  <div class="dashboard-container">
    <AdminDashboard v-if="currentRole === 'adminDashboard'" />
    <EditorDashboard v-else-if="currentRole === 'editorDashboard'" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'

const userStore = useUserStore()

const currentRole = ref('adminDashboard')

const roles = computed(() => userStore.roles || [])

onMounted(() => {
  // 根据用户角色决定显示哪个dashboard
  if (!roles.value.includes('admin')) {
    currentRole.value = 'editorDashboard'
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
