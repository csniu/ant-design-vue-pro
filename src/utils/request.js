import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 15000 // 请求超时时间
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    const errorCode = data.code
    const status = error.response.status
    const config = error.response.config
    console.log('请求数据：', config)
    console.log('响应数据：', data)
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    // 权限验证失败
    if (status === 403) {
      console.log('权限认证失败')
      notification.error({
        message: '禁止的',
        description: data.message
      })
    }

    // access 过期
    // {
    //   "detail": "Given token not valid for any token type",
    //   "code": "token_not_valid",
    //   "messages": [
    //     {
    //       "token_class": "AccessToken",
    //       "token_type": "access",
    //       "message": "Token is invalid or expired"
    //     }
    //   ]
    // }
    if ((status === 401) && (errorCode === 'token_not_valid') && (data.messages)) {
      console.log('access 过期')
      console.log('正在更新：', isRefreshing)
      if (!isRefreshing) {
        isRefreshing = true
        return store.dispatch('refreshToken').then(response => {
          console.log('access 刷新成功')
          // const { token } = store.ACCESS_TOKEN
          const token = storage.get(ACCESS_TOKEN)
          // request.defaults.headers['Authorization'] = 'Bearer ' + token
          config.headers['Authorization'] = 'Bearer ' + token
          // config.baseURL = process.env.VUE_APP_API_BASE_URL
          // 已经刷新了token，将所有队列中的请求进行重试
          requests.forEach(cb => cb(token))
          requests = []
          return request(config)
        }).catch(response => {
          console.error('token 刷新失败')
          window.location.href = '/'
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token) => {
            // config.baseURL = process.env.VUE_APP_API_BASE_URL
            config.headers['Authorization'] = 'Bearer ' + token
            resolve(request(config))
          })
        })
      }
    }
    // refresh 过期
    // {
    //   "detail": "Token 'exp' claim has expired",
    //   "code": "token_not_valid"
    // }
    if ((status === 401) && (errorCode === 'token_not_valid') && (!data.messages)) {
      console.log('refresh 过期')
      notification.error({
        message: '未授权的',
        description: '授权验证失败'
      })
      if (token) {
        console.log('logout')
        store.dispatch('Logout').then(() => {
          console.log('退出成功')
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    notification.error({
      message: '错误',
      description: error.response.status
    })
    console.log(error.response)
  }
  return Promise.reject(error)
}

// request interceptor
// 请求前添加 header 信息
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return config
}, errorHandler)

request.interceptors.response.use((response) => {
  return response
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
