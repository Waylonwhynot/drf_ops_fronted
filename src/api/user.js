import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/system/user/login/',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/user/info/',
    method: 'get',
  })
}

// 退出
export function logout() {
  return request({
    url: '/system/user/logout/',
    method: 'post'
  })
}

// 新增用户
export function createUser(data) {
  return request({
    url: '/system/user/',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/system/user/${id}/`,
    method: 'delete'
  })
}

// 更新
export function updateUser(id, data) {
  return request({
    url: `/system/user/${id}/`,
    method: 'put',
    data
  })
}

// 修改用户状态
export function updateUserActive(id, data) {
  return request({
    url: `/system/user/${id}/`,
    method: 'patch',
    data
  })
}

// 获取用户列表
export function getUsers(data) {
  return request({
    url: '/system/user/',
    method: 'get',
    params: data
  })
}

// 获取用户详情
export function getUser(id) {
  return request({
    url: `/system/user/${id}/`,
    method: 'get'
  })
}
