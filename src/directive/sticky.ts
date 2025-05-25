import type { Directive, DirectiveBinding, App } from 'vue'

interface StickyParams {
  stickyTop?: number
  zIndex?: number
}

interface StickyState {
  placeholder: HTMLElement
  active: boolean
  listenAction: () => void
}

const sticky: Directive<HTMLElement, StickyParams> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<StickyParams>) {
    const params = binding.value || {}
    const stickyTop = params.stickyTop || 0
    const zIndex = params.zIndex || 1000
    const elStyle = el.style

    elStyle.position = '-webkit-sticky'
    elStyle.position = 'sticky'
    
    const elHeight = el.getBoundingClientRect().height
    const elWidth = el.getBoundingClientRect().width
    elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex}`

    const parentElm = el.parentNode || document.documentElement
    const placeholder = document.createElement('div')
    placeholder.style.display = 'none'
    placeholder.style.width = `${elWidth}px`
    placeholder.style.height = `${elHeight}px`
    parentElm.insertBefore(placeholder, el)

    let active = false

    const getScroll = (target: Window, top: boolean): number => {
      const prop = top ? 'pageYOffset' : 'pageXOffset'
      const method = top ? 'scrollTop' : 'scrollLeft'
      let ret = (target as any)[prop]
      if (typeof ret !== 'number') {
        ret = window.document.documentElement[method as keyof Element]
      }
      return ret
    }

    const stickyHandler = () => {
      if (active) {
        return
      }
      if (!elStyle.height) {
        elStyle.height = `${el.offsetHeight}px`
      }

      elStyle.position = 'fixed'
      elStyle.width = `${elWidth}px`
      placeholder.style.display = 'inline-block'
      active = true
    }

    const reset = () => {
      if (!active) {
        return
      }

      elStyle.position = ''
      placeholder.style.display = 'none'
      active = false
    }

    const check = () => {
      const scrollTop = getScroll(window, true)
      const offsetTop = el.getBoundingClientRect().top
      if (offsetTop < stickyTop) {
        stickyHandler()
      } else {
        if (scrollTop < elHeight + stickyTop) {
          reset()
        }
      }
    }

    const listenAction = () => {
      check()
    }

    // 存储状态到元素上
    ;(el as any).__stickyState = {
      placeholder,
      active,
      listenAction
    } as StickyState

    window.addEventListener('scroll', listenAction)
  },

  beforeUnmount(el: HTMLElement) {
    const state = (el as any).__stickyState as StickyState
    if (state) {
      window.removeEventListener('scroll', state.listenAction)
      if (state.placeholder && state.placeholder.parentNode) {
        state.placeholder.parentNode.removeChild(state.placeholder)
      }
      delete (el as any).__stickyState
    }
  }
}

const vueSticky = {
  install(app: App) {
    app.directive('sticky', sticky)
  }
}

export default vueSticky
export { sticky } 