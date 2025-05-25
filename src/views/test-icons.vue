<template>
  <div class="test-icons">
    <h1>SVG 图标测试</h1>
    
    <div class="icon-test">
      <h2>使用 SvgIcon 组件</h2>
      <div class="icon-row">
        <svg-icon icon-class="dashboard" class="test-icon" />
        <span>dashboard</span>
      </div>
      <div class="icon-row">
        <svg-icon icon-class="user" class="test-icon" />
        <span>user</span>
      </div>
      <div class="icon-row">
        <svg-icon icon-class="system" class="test-icon" />
        <span>system</span>
      </div>
    </div>

    <div class="icon-test">
      <h2>直接使用 SVG</h2>
      <div class="icon-row">
        <svg class="test-icon" aria-hidden="true">
          <use xlink:href="#icon-dashboard" />
        </svg>
        <span>dashboard (直接)</span>
      </div>
      <div class="icon-row">
        <svg class="test-icon" aria-hidden="true">
          <use xlink:href="#icon-user" />
        </svg>
        <span>user (直接)</span>
      </div>
    </div>

    <div class="debug-info">
      <h2>调试信息</h2>
      <p>SVG DOM ID: {{ svgDomExists ? '存在' : '不存在' }}</p>
      <p>图标数量: {{ iconCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const svgDomExists = ref(false)
const iconCount = ref(0)

onMounted(() => {
  // 检查 SVG DOM 是否存在
  const svgDom = document.getElementById('__svg__icons__dom__')
  svgDomExists.value = !!svgDom
  
  if (svgDom) {
    const symbols = svgDom.querySelectorAll('symbol')
    iconCount.value = symbols.length
    console.log('找到的图标:', Array.from(symbols).map(s => s.id))
  }
})
</script>

<style scoped>
.test-icons {
  padding: 20px;
}

.icon-test {
  margin: 20px 0;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}

.icon-row {
  display: flex;
  align-items: center;
  margin: 10px 0;
  gap: 10px;
}

.test-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  color: #409eff;
}

.debug-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}
</style> 