import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  // ['admin', 'system-users-del']
  const permissions = store.getters && store.getters.permissions
  // ['用户权限列表']

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = permissions.some(permission => {
        return permissionRoles.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
