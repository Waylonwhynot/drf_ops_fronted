import request from '@/utils/request'


// 获取环境列表
export function getEnvs(data) {
  return request({
    url: '/confcenter/env/',
    method: 'get',
    params: data
  })
}

// 新增环境
export function createEnv(data) {
  return request({
    url: '/confcenter/env/',
    method: 'post',
    data
  })
}

// 获取环境详情详情
export function getEnv(id) {
  return request({
    url: `/confcenter/env/${id}/`,
    method: 'get'
  })
}

// 删除环境
export function deleteEnv(id) {
  return request({
    url: `/confcenter/env/${id}/`,
    method: 'delete'
  })
}

// 修改环境
export function updateEnv(id, data) {
  return request({
    url: `/confcenter/env/${id}/`,
    method: 'put',
    data
  })
}
