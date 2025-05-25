<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <div ref="chartRef" style="height: 254px; width: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
const chart = ref(null)

const initChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart.value || !props.list.length) return
  
  const xData = props.list.map(item => item.x)
  const yData = props.list.map(item => item.y)
  
  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '50px',
      right: 'auto',
      bottom: '40px',
      top: '30px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: '时间'
    },
    series: [{
      type: 'bar',
      data: yData,
      itemStyle: {
        color: '#1890ff'
      },
      barWidth: '60%'
    }]
  })
}

// 监听数据变化
watch(() => props.list, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    // 添加一个小延迟确保父容器完全渲染
    setTimeout(() => {
      initChart()
    }, 100)
  })
})

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.dispose()
    chart.value = null
  }
})
</script>
