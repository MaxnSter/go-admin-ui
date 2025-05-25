<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
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
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
const chart = ref(null)

// 使用图表自适应hook
const { initResizeListener, destroyResizeListener } = useChartResize(chart)

const initChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value, 'macarons')
  setOptions(props.chartData)
  
  // 初始化自适应监听
  if (props.autoResize) {
    initResizeListener()
  }
}

const setOptions = ({ expectedData, actualData } = {}) => {
  if (!chart.value) return
  
  chart.value.setOption({
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['expected', 'actual']
    },
    series: [{
      name: 'expected', 
      itemStyle: {
        color: '#FF005A',
        lineStyle: {
          color: '#FF005A',
          width: 2
        }
      },
      smooth: true,
      type: 'line',
      data: expectedData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: 'actual',
      smooth: true,
      type: 'line',
      itemStyle: {
        color: '#3888fa',
        lineStyle: {
          color: '#3888fa',
          width: 2
        },
        areaStyle: {
          color: '#f3f8ff'
        }
      },
      data: actualData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }]
  })
}

// 监听数据变化
watch(() => props.chartData, (newData) => {
  setOptions(newData)
}, { deep: true })

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
