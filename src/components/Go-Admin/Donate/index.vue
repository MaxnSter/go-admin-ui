<template>
  <div>
    <svg-icon icon-class="heart" @click="goto" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GoAdminDonate' })
const url = 'http://doc.zhangwj.com/go-admin-site/donate/'
const goto = () => {
  window.open(url)
}
</script>
