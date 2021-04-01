import storage from 'store'
// import { login, getInfo, logout } from '@/api/login'
import { login, getInfo, refresh } from '@/api/login'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    refresh: '',
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    isAdmin: false,
    isSuperuser: false
  },

  mutations: {
    SET_REFRESH: (state, refresh) => {
      state.refresh = refresh
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ADMIN: (state, admin) => {
      state.isAdmin = admin
    },
    SET_SUPERUSER: (state, superuser) => {
      state.isSuperuser = superuser
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result.access, 60 * 60 * 1000)
          storage.set(REFRESH_TOKEN, result.refresh, 1 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.access)
          commit('SET_REFRESH', result.refresh)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          /*
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          */

          // 简化了前端的权限管理，没有 active
          var roles = result.roles.map(role => { return role.name })
          console.log('role', roles)
          if (roles.length === 0) {
            roles.push('防止为空')
          }

          if (result.roles) {
            commit('SET_ROLES', roles)
            commit('SET_INFO', result)
            if (result.is_superuser) {
              commit('SET_SUPERUSER', true)
            }
            if (result.is_admin) {
              commit('SET_ADMIN', true)
              }
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.username, welcome: welcome() })
          // commit('SET_AVATAR', result.avatar)

          resolve(response)
          }).catch(error => {
          reject(error)
        })
      })
    },

    // 使用 refresh 更新 access
    refreshToken ({ commit, state }) {
      const refreshInfo = { 'refresh': storage.get(REFRESH_TOKEN) }
      return new Promise((resolve, reject) => {
        refresh(refreshInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result.access, 60 * 60 * 1000)
          commit('SET_TOKEN', result.access)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      // return new Promise((resolve) => {
      //   logout(state.token).then(() => {
      // //     resolve()
      // //   }).catch(() => {
      // //     resolve()
      // //   }).finally(() => {
      // //     commit('SET_TOKEN', '')
      // //     commit('SET_ROLES', [])
      //     storage.remove(ACCESS_TOKEN)
      //   })
      // })
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_SUPERUSER', false)
      commit('SET_ADMIN', false)
      storage.remove(ACCESS_TOKEN)
    }

  }
}

export default user
