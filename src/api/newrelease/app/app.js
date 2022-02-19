import request from '@/utils/request'


// 获取应用列表
export function getApps(data) {
  return request({
    url: '/newrelease/releaseapp/',
    method: 'get',
    params: data
  })
}

// 根据不同环境通过发布记录表获取应用列表
export function getEnvApps(data) {
  return request({
    url: '/newrelease/envs/apps/',
    method: 'get',
    params: data
  })
}

// 新增应用
export function createApp(data) {
  return request({
    url: '/newrelease/releaseapp/',
    method: 'post',
    data
  })
}

// 获取应用详情
export function getApp(id) {
  return request({
    url: `/newrelease/releaseapp/${id}/`,
    method: 'get'
  })
}

// 删除应用
export function deleteApp(id) {
  return request({
    url: `/newrelease/releaseapp/${id}/`,
    method: 'delete'
  })
}

// 修改应用
export function updateApp(id, data) {
  return request({
    url: `/newrelease/release_apply/${id}/`,
    method: 'patch',
    data
  })
}

// 新增常规应用发布
export function createAppDeploy(data) {
  return request({
    url: '/newrelease/new_release/',
    method: 'post',
    data
  })
}

// 新增发布申请
export function createReleaseApply(data) {
  return request({
    url: '/newrelease/release_apply/',
    method: 'post',
    data
  })
}
// 展示发布申请记录
export function getReleaseApply(data) {
  return request({
    url: '/newrelease/release_apply/',
    method: 'get',
    params: data
  })
}

// 删除发布申请记录
export function deleteReleaseApply(id) {
  return request({
    url: `/newrelease/release_apply/${id}/`,
    method: 'delete'
  })
}

// 修改发布申请记录
export function updateReleaseApply(id, data) {
  return request({
    url: `/newrelease/release_apply/${id}/`,
    method: 'put',
    data
  })
}

// 发布审核状态数据
export function getReleaseApplyStatus(data) {
  return request({
    url: '/newrelease/release_apply/status/',
    method: 'get',
    params: data
  })
}

// 获取分支数据以及不同分支的commits版本数据
export function getGitBranch(data) {
  return request({
    url: '/newrelease/git/branches/',
    method: 'get',
    params: data
  })
}
