import store from '@/store'
import type { Directive } from 'vue'

const permisaction: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const allPermission = '*:*:*'
    const permissions = store.getters && store.getters.permisaction

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermissions = permissions.some((perm: string) => {
        return allPermission === perm || value.includes(perm)
      })
      if (!hasPermissions) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('请设置操作权限标签值')
    }
  }
}

export default permisaction
