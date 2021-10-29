import store from '@/store/index'
import router, { resetRouter, constantRoutes, variableRoutes } from '@/router/index'
import { cloneDeep } from '@/utils/CommonUtils';

export function getToken() {
  return store.getters.token
}

export function addRouter(vue) {
  let userInfo = store.getters.userInfo || {}
  let authCodeList = userInfo.authCodeList || []
  resetRouter()
  let res = filterNoAuthRoutes(authCodeList, variableRoutes)
  let totalRoutes = [...constantRoutes, ...res]
  router.addRoutes(totalRoutes)
  vue.$router.options.routes = totalRoutes
  return totalRoutes
}

function filterNoAuthRoutes(authCodeList, routes) {
  let resRoutes = []
  for (let i = 0; i < routes.length; i++) {
    let route = cloneDeep(routes[i])
    if (route.meta.auth) {
      if (authCodeList.indexOf(route.meta.auth) !== -1) {
        if (route.children && route.children.length > 0) {
          route.children = filterNoAuthRoutes(authCodeList, route.children)
        }
        resRoutes.push(route)
      }
    } else {
      if (route.children && route.children.length > 0) {
        let filterChildren = filterNoAuthRoutes(authCodeList, route.children)
        if (filterChildren.length > 0) {
          route.children = filterChildren
          resRoutes.push(route)
        }
      }
    }
  }
  return resRoutes
}
