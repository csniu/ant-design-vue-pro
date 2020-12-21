import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import user from './user'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */

function hasPermission (roles, route) {
  if (route.meta && route.meta.permission) {
    let flag = false

    // 超级用户用户
    if (user.state.isSuperuser) {
      return true
    }

    for (let i = 0, len = roles.length; i < len; i++) {
      flag = route.meta.permission.includes(roles[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = roles.length; i < len; i++) {
      flag = route.meta.permission.includes(roles[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

function filterAsyncRouter (routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
