import request from '@/utils/request'

// 获取任务列表
export function getTaskList(data) {
  return request({
    url: '/autotask/task/',
    method: 'get',
    data
  })
}

// 创建任务
export function createTask(data) {
  return request({
    url: '/autotask/task/',
    method: 'post',
    data,
  })
}

// 执行任务
export function updateTask(id, data) {
  return request({
    url: `/autotask/task/${id}/`,
    method: 'patch',
    data
  })
}

// 任务详情
export function detailTask(id) {
  return request({
    url: `/autotask/task/${id}/`,
    method: 'get'
  })
}
