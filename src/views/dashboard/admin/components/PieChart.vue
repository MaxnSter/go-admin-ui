<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
// 使用新的主题注册方式
import macarons from 'echarts/theme/macarons.js'
import { useChartResize } from './composables/useChartResize'

// 注册主题
echarts.registerTheme('macarons', macarons)

const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  },
  autoResize: {
    type: Boolean,
    default: true
  }
})

const chartRef = ref(null)
const chart = ref(null)

// 使用图表自适应hook
const { initResizeListener, destroyResizeListener } = useChartResize(chart)

const initChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value, 'macarons')

  chart.value.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
    },
    series: [
      {
        name: 'WEEKLY WRITE ARTICLES',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: [
          { value: 320, name: 'Industries' },
          { value: 240, name: 'Technology' },
          { value: 149, name: 'Forex' },
          { value: 100, name: 'Gold' },
          { value: 59, name: 'Forecasts' }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600
      }
    ]
  })
  
  // 初始化自适应监听
  if (props.autoResize) {
    initResizeListener()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (chart.value) {
    destroyResizeListener()
    chart.value.dispose()
    chart.value = null
  }
})
</script>
