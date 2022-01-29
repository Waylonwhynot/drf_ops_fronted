import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 每次路由请求前进行拦截
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 从cookie中获取token, 确定用户是否已登录
  const hasToken = getToken()

  // 如果已经有了token，访问login，则跳转首页；如果包含，且获取到用户信息，则跳转到目标路由
  if (hasToken) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      // 如果已登录，重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      // 判断store.getters.userId 有没有值  有的话 返回 store.getters.userId > 0 true 或者 false
      // store.getters.userId 空值 或 1
      const hasUserIds = store.getters.userId && store.getters.userId > 0
      if (hasUserIds) {
        next()
      } else {
        try {
          // 生成访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          // 动态添加可访问的路线
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 如果访问的路由在白名单，则直接跳转
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 路由结束进度条结束
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
