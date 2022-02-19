import request from '@/utils/request'
// import qs from 'qs'

// 获取zabbix告警列表
export function getAlerts(data) {
  return request({
    url: '/monitor/alert/',
    method: 'get',
    params: data,
  //   paramsSerializer: params => {
  //     return qs.stringify(params, {
  //       indices: false})
  //   }
  })
}

// 获取prometheus告警列表
export function getPromAlerts(data) {
  return request({
    url: '/monitor/promalert/',
    method: 'get',
    params: data,
    //   paramsSerializer: params => {
    //     return qs.stringify(params, {
    //       indices: false})
    //   }
  })
}

// 获取zabbix告警类型列表
export function getAlertType() {
  return request({
    url: '/monitor/alert/alert/type/',
    method: 'get',
  })
}

// 获取prometheus告警类型列表
export function getPromAlertType() {
  return request({
    url: '/monitor/alert/promalert/type/',
    method: 'get',
  })
}

// 获取zabbix告警状态列表
export function getAlertStatus() {
  return request({
    url: '/monitor/alert/alert/status/',
    method: 'get',
  })
}

// 获取prometheus告警状态列表
export function getPromAlertStatus() {
  return request({
    url: '/monitor/alert/promalert/status/',
    method: 'get',
  })
}

// 获取zabbix告警状态列表
export function getAlertEnvs() {
  return request({
    url: '/monitor/alert/alert/envs/',
    method: 'get',
  })
}

// 获取prometheus告警状态列表
export function getPromAlertEnvs() {
  return request({
    url: '/monitor/alert/promalert/envs/',
    method: 'get',
  })
}

// 获取zabbix每天告警数据
export function getDayAlert() {
  return request({
    url: '/monitor/alert/dashboard/day/',
    method: 'get',
  })
}

// 获取zabbix每周按类型分类告警数据
export function getWeekAlert() {
  return request({
    url: '/monitor/alert/dashboard/type/week/',
    method: 'get',
  })
}

// 获取zabbix每周按类型分类告警数据
export function getWeekAlertCount() {
  return request({
    url: '/monitor/alert/dashboard/week/',
    method: 'get',
  })
}

// 获取zabbix月告警数据
export function getMonthAlert() {
  return request({
    url: '/monitor/alert/dashboard/month/',
    method: 'get',
  })
}
