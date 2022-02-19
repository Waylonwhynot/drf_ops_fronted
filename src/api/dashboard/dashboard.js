import request from '@/utils/request'
// import qs from 'qs'

// 获取云资源数据，饼图使用
export function getBdCloudResource(data) {
  return request({
    url: '/dashboard/bdcloud/list/',
    method: 'get',
    params: data,
  })
}
