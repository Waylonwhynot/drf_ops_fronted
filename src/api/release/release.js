import request from '@/utils/request'

// 获取工单列表
export function getDeployList(data) {
  return request({
    url: '/release/deploy/',
    method: 'get',
    params: data
  })
}

// 创建工单
export function createDeploy(data) {
  return request({
    url: '/release/deploy/',
    method: 'post',
    data
  })
}

// 修改工单
export function updateDeploy(id, data) {
  return request({
    url: `/release/deploy/${id}/`,
    //method: 'put',
    method: 'patch',
    data
  })
}

// 删除工单
export function deleteDeploy(id, data) {
  return request({
    url: `/release/deploy/${id}/`,
    method: 'patch',
    data
  })
}
