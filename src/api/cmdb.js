import request from '@/utils/request'


// 获取模型列表
export function getModels(data) {
  return request({
    url: '/cmdb/model/info/',
    method: 'get',
    params: data
  })
}

  // 获取模型详情
export function getModel(id) {
  return request({
    url: `/cmdb/model/info/${id}/`,
    method: 'get',
  })
}

// 获取模型分组列表
export function getModelGroups(data) {
  return request({
    url: `/cmdb/model/group/`,
    method: 'get',
    params: data,
  })
}

// 获取模型分组详情
export function getModelGroup(id) {
  return request({
    url: `/cmdb/model/group/${id}/`,
    method: 'get',
  })
}


// 获取资源数据列表
export function getResourceDatas(data) {
  return request({
    url: '/cmdb/resource/data/',
    method: 'get',
    params: data
  })
}

  // 获取资源数据详情
export function getResourceData(id) {
  return request({
    url: `/cmdb/resource/data/${id}/`,
    method: 'get',
  })
}
