import request from '@/utils/request'


// 获取日志列表
export function getWxmsglogs(data) {
  return request({
    url: '/msg/wxmsglogs/',
    method: 'get',
    params: data
  })
}

