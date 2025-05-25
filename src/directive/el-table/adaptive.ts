import type { Directive, DirectiveBinding } from 'vue'

interface AdaptiveParams {
  bottomOffset?: number
  minHeight?: number
}

const adaptive: Directive<HTMLElement, AdaptiveParams> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<AdaptiveParams>) {
    const params = binding.value || {}
    const bottomOffset = params.bottomOffset || 100
    const minHeight = params.minHeight || 300

    const resizeHandler = () => {
      const windowHeight = window.innerHeight
      const elTop = el.getBoundingClientRect().top
      const adaptiveHeight = windowHeight - elTop - bottomOffset
      
      if (adaptiveHeight > minHeight) {
        el.style.height = `${adaptiveHeight}px`
      } else {
        el.style.height = `${minHeight}px`
      }
    }

    // 初始化高度
    resizeHandler()

    // 监听窗口大小变化
    window.addEventListener('resize', resizeHandler)
    
    // 存储清理函数
    ;(el as any).__adaptiveCleanup = () => {
      window.removeEventListener('resize', resizeHandler)
    }
  },

  beforeUnmount(el: HTMLElement) {
    const cleanup = (el as any).__adaptiveCleanup
    if (cleanup) {
      cleanup()
      delete (el as any).__adaptiveCleanup
    }
  }
}

export default adaptive 