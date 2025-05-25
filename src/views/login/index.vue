<template>
  <div class="login">
    <h1>Go Admin Login</h1>
    <p>Vue 3 登录页面测试</p>
    <button @click="goToDashboard">进入系统</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/')
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

h1 {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #337ecc;
}
</style>
