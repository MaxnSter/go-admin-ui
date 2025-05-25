<template></template>
<script setup lang="ts">
import { useRouter, useRoute, onMounted } from 'vue-router'

defineOptions({ name: 'Redirect' })

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const { params, query } = route
  const { path } = params as any
  router.replace({ path: '/' + path, query })
})
</script>

