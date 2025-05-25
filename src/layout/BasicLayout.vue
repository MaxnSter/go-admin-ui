<template>
  <div class="basic-layout">
    <slot name="wrapper" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BasicLayout' })
</script>

<style lang="scss" scoped>
  .basic-layout{
    padding: 10px;
    box-sizing: border-box;
  }
</style>
