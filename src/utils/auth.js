import store from '@/store/index'
import router, { resetRouter, constantRoutes, variableRoutes } from '@/router/index'
import storageUtil from './storageUtil'

export function getToken() {
  return store.getters.token
}

export function addRouter(vue) {
  let userInfo = storageUtil.getStorage('userInfo') || {}
  let authCodeList = userInfo.authCodeList || []
  resetRouter()
  let res = filterNoAuthRoutes(authCodeList, variableRoutes)
  let totalRoutes = [...constantRoutes, ...res]
  router.addRoutes(totalRoutes)
  vue.$router.options.routes = totalRoutes
  console.log(totalRoutes);
  return totalRoutes
}

function filterNoAuthRoutes(authCodeList, routes) {
  let resRoutes = []
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i]
    console.log(route)
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
        console.log(filterChildren);
        if (filterChildren.length > 0) {
          route.children = filterChildren
          console.log(route);
          resRoutes.push(route)
        }
      }
    }
  }
  return resRoutes
}
