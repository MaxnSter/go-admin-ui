<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GoAdminDoc' })
const url = 'http://doc.zhangwj.com/go-admin-site'
const goto = () => {
  window.open(url)
}
</script>
