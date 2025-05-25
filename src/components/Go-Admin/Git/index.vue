<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GoAdminGit' })
const url = 'https://github.com/wenjianzhang/go-admin'
const goto = () => {
  window.open(url)
}
</script>
