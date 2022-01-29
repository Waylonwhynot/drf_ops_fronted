import { asyncRoutes, constantRoutes } from '@/router'
import store from '../index'

/**
 * Use meta.permission to determine if the current user has permission
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some(permission => route.meta.permissions.includes(permission))
  } else {
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes(有权限控制的路由)
 * @param permissions
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = []
  // 异步加载出来的，所以才是一个一个的列表
  // console.log('routes')
  routes.forEach(route => {
    // 三个点的用法 ==> 输出举例：var man = {name:'chuichui',height:176}
    // console.log({...man}) / {name:'chuichui',height:176}
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      store.dispatch('user/getInfo').then(res => {
        console.log('res.permissions', res.permissions)
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, res.permissions)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
