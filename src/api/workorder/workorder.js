import request from '@/utils/request'

// 获取申请工单列表
export function getWorkOrders(data) {
  return request({
    url: '/workorder/workorder/',
    method: 'get',
    params: data
  })
}



// 新增工单
export function createWorkOrder(data) {
  return request({
    url: '/workorder/workorder/',
    method: 'post',
    data
  })
}

// 删除工单
export function deleteWorkOrder(id, data) {
  return request({
    url: `/workorder/workorder/${id}/`,
    method: 'patch',
    data
  })
}

// 修改工单
export function updateWorkOrder(id, data) {
  return request({
    url: `/workorder/workorder/${id}/`,
    method: 'patch',
    data
  })
}

// 获取工单详情
export function getWorkOrder(id) {
  return request({
    url: `/workorder/workorder/${id}/`,
    method: 'get'
  })
}


// 获取运维人员列表
export function workOrderOps(data) {
  return request({
    url: '/workorder/ops/',
    method: 'get',
    params: data
  })
}


// 获取工单类型列表
export function getWorkOrderType(data) {
  return request({
    url: '/workorder/type/',
    method: 'get',
    params: data
  })
}
