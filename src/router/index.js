import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 通用路由表，配置匿名非匿名用户均可访问的公共页面的路由，如登录页
export const constantRoutes = [
  {
    // 标签导航刷新
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'dashboard', affix: true}
    }]
  },
  {
    path: '/msg',
    component: Layout,
    redirect: '/msg/msg',
    name: 'Msg',
    meta: {
      title: '消息中心',
      icon: 'el-icon-s-comment'
    },
    children: [
      {
        path: 'appid',
        name: 'Appid',
        component: () => import('@/views/msg/appid/index'),
        meta: {title: 'AppID申请', icon: 'app', noCache: true}
      },
      {
        path: 'wxmsglog',
        name: 'Wxmsglog',
        component: () => import('@/views/msg/logs/index'),
        meta: {title: '消息日志', icon: 'log', noCache: true}
      }
    ]
  },
  {
    path: '/workorder',
    component: Layout,
    redirect: '/workorder/apply',
    name: 'WorkOrder',
    meta: {
      title: '工单系统',
      icon: 'el-icon-s-comment'
    },
    children: [
      {
        path: 'Apply',
        name: 'apply',
        component: () => import('@/views/workorder/apply/index'),
        meta: {title: '工单申请', icon: 'app', noCache: true}
      },
      {
        path: 'List',
        name: 'list',
        component: () => import('@/views/workorder/list/index'),
        meta: {title: '申请列表', icon: 'log', noCache: true}
      },
      {
        path: 'History',
        name: 'history',
        component: () => import('@/views/workorder/history/index'),
        meta: {title: '工单历史', icon: 'log', noCache: true}
      }
    ]
  },
  {
    path: '/tasks',
    component: Layout,
    name: 'Tasks',
    meta: {title: '任务系统', icon: 'tree'},
    children: [
      {
        path: 'add',
        name: '任务添加',
        component: () => import('@/views/tasks/add/index'),
        meta: {title: '任务添加', icon: 'form'}
      },
      {
        path: 'list',
        name: '任务列表',
        component: () => import('@/views/tasks/list/index'),
        meta: {title: '申请列表', icon: 'table'}
      },
    ]
  },
  {
    path: '/project',
    component: Layout,
    meta: {title: '项目管理', icon: 'code'},
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: {title: '项目管理', icon: 'user'}
      }
    ]
  },
  {
    path: '/release',
    component: Layout,
    name: '代码上线',
    meta: {title: '代码上线', icon: 'user'},
    children: [
      {
        path: 'apply',
        name: '申请上线',
        component: () => import('@/views/release/apply/index'),
        meta: {title: '申请上线', icon: 'user'}
      },
      {
        path: 'list',
        name: '申请列表',
        component: () => import('@/views/release/list/index'),
        meta: {title: '申请列表', icon: 'tree'}
      },
      {
        path: 'history',
        name: '上线列表',
        component: () => import('@/views/release/history/index'),
        meta: {title: '上线列表', icon: 'tree'}
      }
    ]
  },
]

/**
 * asyncRoutes
 * 权限判断动态渲染菜单
 */
export const asyncRoutes = [
  // 资产管理
  {
    path: '/host',
    component: Layout,
    redirect: '/host/server',
    name: 'Host',
    meta: {title: 'CMDB', icon: 'system'},
    children: [
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/host/index'),
        meta: {title: '资产管理', icon: 'user', affix: true}
      },
      {
        // router  router路由跳转动作，this.$router.push('/')
        // route   this.$route.params.id -- 2
        path: 'console/:id/', // 动态路由匹配
        component: () => import('@/views/host/console'),
      },

    ]
  },
  // 批量任务
  {
    path: '/mtask',
    component: Layout,
    redirect: '/mtask/exec',
    name: 'Mtask',
    meta: {
      title: '批量任务',
      icon: 'system'
    },
    children: [
      {
        path: 'multiexec',
        name: 'MultiExec',
        component: () => import('@/views/multiexec/index'),
        meta: {title: '批量任务', icon: 'user', noCache: true}
      },
      {
        path: 'managecommand',
        name: 'ManageCommand',
        component: () => import('@/views/multiexec/index'),
        meta: {title: '命令管理', icon: 'user', noCache: true}
      },
    ]
  },
  // 配置管理
  {
    path: '/confcenter',
    component: Layout,
    redirect: '/confcenter/env',
    name: 'ConCenter',
    meta: {
      title: '配置管理',
      icon: 'system'
    },
    children: [
      {
        path: 'env',
        name: 'Env',
        component: () => import('@/views/confcenter/env/index'),
        meta: {title: '环境管理', icon: 'el-icon-menu', noCache: true}
      },
      {
        path: 'managecommand1',
        name: 'ManageCommand1',
        component: () => import('@/views/multiexec/index'),
        meta: {title: '服务配置', icon: 'user', noCache: true}
      },
      {
        path: 'managecommand2',
        name: 'ManageCommand2',
        component: () => import('@/views/multiexec/index'),
        meta: {title: '应用配置', icon: 'user', noCache: true}
      },
    ]
  },
  //代码发布
  {
    path: '/newrelease',
    component: Layout,
    redirect: '/newrelease/releaseapp',
    name: 'NewRelease',
    meta: {
      title: '代码发布',
      icon: 'system'
    },
    children: [
      {
        path: 'releaseapp',
        name: 'releaseapp',
        component: () => import('@/views/newrelease/app/index'),
        meta: {title: '应用管理', icon: 'el-icon-menu', noCache: true}
      },
      {
        path: 'releaseapply',
        name: 'ReleaseApply',
        component: () => import('@/views/newrelease/deploy_apply/index'),
        meta: {title: '发布申请', icon: 'user', noCache: true}
      },
      {
        // router  router路由跳转动作，this.$router.push('/')
        // route   this.$route.params.id -- 2
        path: 'release_result/:id/', // 动态路由匹配
        component: () => import('@/views/newrelease/deploy_apply/ReleaseResult'),
      },
    ]
  },
  // 监控相关
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/alert',
    name: 'Monitor',
    meta: {
      // permissions: [],
      title: '告警详情',
      icon: 'el-icon-umbrella'
    },
    children: [
      {
        path: 'alert',
        name: 'Alert',
        component: () => import('@/views/monitor/alert/index'),
        meta: {title: 'zabbix告警信息', icon: 'monitor', noCache: true}
      },
      {
        path: 'promalert',
        name: 'PromAlert',
        component: () => import('@/views/monitor/alert/index_prom'),
        meta: {title: 'prometheus告警信息', icon: 'monitor', noCache: true}
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/monitor/alert/statistics'),
        meta: {title: '告警统计', icon: 'el-icon-s-data', noCache: true}
      }
    ]
  },
  //系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      permissions: ['admin', 'system'],
      title: '系统管理',
      icon: 'system'
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: {permissions: ['admin', 'system-users'], title: '用户管理', icon: 'user', noCache: true}
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/permission/index'),
        meta: {permissions: ['admin', 'system-permissions'], title: '权限管理', icon: 'permission', noCache: true}
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: {permissions: ['admin', 'system-roles'], title: '角色管理', icon: 'role', noCache: true}
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/organization/index'),
        meta: {permissions: ['admin', 'system-organizations'], title: '部门管理', icon: 'dept', noCache: true}
      },
    ]
  },
  // {
  //   path: '/cmdb',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Cmdb',
  //   meta: {
  //     permissions: ['admin', 'cmdb'],
  //     title: '资源管理',
  //     icon: 'resources'
  //   },
  //   children: [
  //     {
  //       path: 'servers',
  //       name: 'Servers',
  //       component: () => import('@/views/resource/index'),
  //       meta: {permissions: ['admin', 'cmdb-servers'], title: '主机资源', icon: 'server', noCache: true},
  //     },
  //     {
  //       path: 'model',
  //       name: 'Model',
  //       component: () => import('@/views/model/index'),
  //       meta: {title: '模型管理', icon: 'el-icon-s-order'}
  //     },
  //     {
  //       path: 'log',
  //       name: 'Log',
  //       component: () => import('@/views/log/index'),
  //       meta: {title: '操作日志', icon: 'el-icon-s-order'}
  //     },
  //   ]
  // },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

// 初始化Router实例挂载constantRoutes
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
