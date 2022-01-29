import request from '@/utils/request'


// 获取appid列表
export function getAppids(data) {
  return request({
    url: '/msg/appid/',
    method: 'get',
    params: data
  })
}

// 新增appid
export function createAppid(data) {
  return request({
    url: '/msg/appid/',
    method: 'post',
    data
  })
}

// 获取appid详情
export function getAppid(id) {
  return request({
    url: `/msg/appid/${id}/`,
    method: 'get'
  })
}

// 修改appid属性(应用名、描述信息)
export function updateAppid(id, data) {
  return request({
    url: `/msg/appid/${id}/`,
    method: 'put',
    data
  })
}
