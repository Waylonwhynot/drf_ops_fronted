import request from '@/utils/request'

// 获取当前用户任务列表
export function getProjectList() {
  return request({
    url: '/projects/list/',
    method: 'get',
  })
}

// 获取当前项目tag列表
export function getProjectTag(data) {
  return request({
    url: '/projects/tags/',
    method: 'get',
    params: data
  })
}

// 获取指定tag的描述
export function getProjectTagInfo(data) {
  return request({
    url: '/projects/taginfo/',
    method: 'get',
    params: data
  })
}
