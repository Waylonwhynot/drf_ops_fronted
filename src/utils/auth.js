import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'
const TokenKey = 'Admin-Token'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 保存token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除用户信息
export function removeToken() {
  return Cookies.remove(TokenKey)
}
