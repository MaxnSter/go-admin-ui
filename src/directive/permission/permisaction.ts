import { useUserStore } from '@/stores/modules/user'
import type { Directive, DirectiveBinding } from 'vue'

const permisaction: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const all_permission = '*:*:*'
    const userStore = useUserStore()
    const permissions = userStore.permisaction

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission: string) => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}

export default permisaction 