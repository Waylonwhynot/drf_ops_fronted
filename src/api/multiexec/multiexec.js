import request from '@/utils/request'


// 获取主机列表
export function getHosts(data) {
  return request({
    url: '/mtask/host/',
    method: 'get',
    params: data
  })
}

// 执行指令
export function execCommand(data) {
  return request({
    url: '/mtask/cmd_exec/',
    method: 'post',
    data
  })
}
