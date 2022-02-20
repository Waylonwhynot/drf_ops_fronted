// 获取主机列表
import request from "@/utils/request";

export function getHosts(data) {
  return request({
    url: '/host/server/',
    method: 'get',
    params: data
  })
}

export function getPeriod(data) {
  return request({
    url: '/schedule/periods/',
    method: 'get',
    params: data
  })
}


// 新增任务
export function createTask(data) {
  return request({
    url: '/schedule/tasks/',
    method: 'post',
    data
  })
}
