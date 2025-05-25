import store from '@/store'
import type { Directive } from 'vue'

const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const roles = store.getters && store.getters.roles

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermission = roles.some((role: string) => value.includes(role))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

export default permission
