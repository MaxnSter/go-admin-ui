import { ref, onBeforeUnmount } from 'vue'

// 简单的debounce实现
function debounce(func: () => void, wait: number): () => void {
  let timeout: NodeJS.Timeout | null = null
  return function() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

export function useChartResize(chart: any) {
  const sidebarElm = ref<HTMLElement | null>(null)
  const resizeHandler = ref<(() => void) | null>(null)

  const initResizeListener = () => {
    // 创建防抖的resize处理函数
    resizeHandler.value = debounce(() => {
      if (chart.value) {
        chart.value.resize()
      }
    }, 100)

    // 监听窗口大小变化
    if (resizeHandler.value) {
      window.addEventListener('resize', resizeHandler.value)
    }

    // 监听侧边栏变化
    sidebarElm.value = document.getElementsByClassName('sidebar-container')[0] as HTMLElement
    if (sidebarElm.value) {
      sidebarElm.value.addEventListener('transitionend', sidebarResizeHandler)
    }
  }

  const destroyResizeListener = () => {
    if (resizeHandler.value) {
      window.removeEventListener('resize', resizeHandler.value)
    }

    if (sidebarElm.value) {
      sidebarElm.value.removeEventListener('transitionend', sidebarResizeHandler)
    }
  }

  const sidebarResizeHandler = (e: TransitionEvent) => {
    if (e.propertyName === 'width' && resizeHandler.value) {
      resizeHandler.value()
    }
  }

  // 组件卸载时自动清理
  onBeforeUnmount(() => {
    destroyResizeListener()
  })

  return {
    initResizeListener,
    destroyResizeListener
  }
} 