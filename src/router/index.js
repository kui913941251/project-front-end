import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' },
      },
    ],
  },

  {
    path: '/personal',
    component: Layout,
    children: [
      {
        path: '/personal/index',
        name: 'PersonalCenter',
        component: () => import('@/views/personalCenter/PersonalCenter'),
        meta: { title: '????????????', icon: 'dashboard' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

export const variableRoutes = [
  {
    path: '/mall',
    component: Layout,
    redirect: '/mall/goods',
    meta: {
      title: '??????',
      icon: 'dashboard',
    },
    children: [
      {
        path: '/mall/goods',
        name: 'MallGoods',
        component: () => import('@/views/mall/goods/MallGoods'),
        meta: {
          title: '????????????',
          icon: 'dashboard',
        },
      },
      {
        path: '/mall/goods/modify/:id?',
        name: 'MallGoodsModify',
        component: () => import('@/views/mall/goods/MallGoodsModify'),
        hidden: true,
        meta: {
          title: '??????????????????',
        },
      },
      {
        path: '/mall/order',
        name: 'MallOrder',
        component: () => import('@/views/mall/order/MallOrder'),
        meta: {
          title: '????????????',
          icon: 'dashboard',
        },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: {
      title: '????????????',
      icon: 'dashboard',
    },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/SystemUser'),
        meta: { title: '??????', icon: 'dashboard', auth: 'SYSTEM_USER' },
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/SystemRole'),
        meta: { title: '??????', icon: 'dashboard', auth: 'SYSTEM_ROLE' },
      },
      {
        path: '/system/role/modify/:id?',
        name: 'SystemRoleModify',
        component: () => import('@/views/system/role/SystemRoleModify'),
        hidden: true,
        meta: { title: '????????????', icon: 'dashboard', activeMenu: '/system/role', auth: 'SYSTEM_ROLE_UPDATE' },
      },
      {
        path: '/system/auth',
        name: 'SystemAuth',
        component: () => import('@/views/system/auth/SystemAuth'),
        meta: { title: '??????', icon: 'dashboard', auth: 'SYSTEM_AUTH' },
      },
    ],
  },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: [],
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
