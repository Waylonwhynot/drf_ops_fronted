import request from '@/utils/request'

// export default {
//   // 角色条件分页查询
//   getList(query, current = 1, size = 20) {
//     return request({
//       url: `/system/role/search`,
//       method: 'post',
//       data: {...query, current, size}
//     })
//   }
// }

// 获取角色列表
export function getRoles(data) {
  return request({
    url: '/system/role/',
    method: 'get',
    params: data
  })
}

// 新增角色
export function createRole(data) {
  return request({
    url: '/system/role/',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/system/role/${id}/`,
    method: 'delete'
  })
}

// 修改角色
export function updateRole(id, data) {
  return request({
    url: `/system/role/${id}/`,
    method: 'put',
    data
  })
}

// 修改角色权限
export function updateRolePermissions(id, permissions) {
  return request({
    url: `/system/role/${id}/`,
    method: 'patch',
    data: { 'permissions': permissions }
  })
}

// 获取角色详情
export function getRole(id) {
  return request({
    url: `/system/role/${id}/`,
    method: 'get'
  })
}

// // 通过角色id查询所拥有的菜单ids
// getMenuIdsByRoleId(id) {
//   return request({
//     url: `/system/role/${id}/menu/ids`,
//     method: 'get'
//   })
// },
//
// // 保存角色所拥有的菜单ids
// saveRoleMenu(id, menuIds) {
//   return request({
//     url: `/system/role/${id}/menu/save`,
//     method: 'post',
//     data: menuIds
//   })
