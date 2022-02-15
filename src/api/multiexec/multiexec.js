import request from '@/utils/request'

// 新增主机
export function createHost(data) {
  return request({
    url: '/host/server/',
    method: 'post',
    data
  })
}

// Excel批量新增主机
export function createExcelHost(data) {
  return request({
    url: '/host/host_excel/',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

// 删除主机
export function deleteHost(id) {
  return request({
    url: `/host/server/${id}/`,
    method: 'delete'
  })
}


// 修改主机
export function updateHost(id, data) {
  return request({
    url: `/host/server/${id}/`,
    method: 'put',
    data
  })
}

// 获取主机列表
export function getHosts(data) {
  return request({
    url: '/host/server/',
    method: 'get',
    params: data
  })
}

// 导出主机列表excel
export function getHostsExcel() {
  return request({
    url: '/host/host_excel/',
    method: 'get',
  })
}

// 获取主机类型
export function getHostType() {
  return request({
    url: '/host/hosttype/',
    method: 'get',
  })
}

// 获取主机详情
export function getHost(id) {
  return request({
    url: `/host/server/${id}/`,
    method: 'get'
  })
}

// 获取主机目录文件
export function getHostFile(id, data) {
  return request({
    url: `/host/file/${id}/`,
    method: 'get',
    params: data
  })
}
