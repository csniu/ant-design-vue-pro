import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  // https://pro.antdv.com/docs/deploy#%E5%89%8D%E7%AB%AF%E8%B7%AF%E7%94%B1%E4%B8%8E%E6%9C%8D%E5%8A%A1%E7%AB%AF%E7%9A%84%E7%BB%93%E5%90%88
  mode: 'hash', // 使用 hashHistory 路由模式
  routes: constantRouterMap
})

// https://www.cnblogs.com/fqh123/p/11571688.html
router.selfaddRoutes = function (params) {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}

export default router
