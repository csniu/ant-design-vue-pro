import request from '@/utils/request'

const api = {
  // user: '/user',
  // role: '/role',
  // service: '/service',
  // permission: '/permission',
  // permissionNoPager: '/permission/no-pager',
  // orgTree: '/org/tree'
  downloadTask: '/download/tasks/'
}

export default api

export function getDownloadTask (parameter) {
  return request({
    url: api.downloadTask,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 创建或修改
export function saveTask (task) {
  return request({
    url: task.id > 0 ? api.downloadTask + task.id + '/' : api.downloadTask,
    method: task.id > 0 ? 'patch' : 'post',
    data: task
  })
}

// 创建或修改
export function deleteTask (id) {
  return request({
    url: api.downloadTask + id + '/',
    method: 'delete'
  })
}

// export function getUserList (parameter) {
//   return request({
//     url: api.user,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getRoleList (parameter) {
//   return request({
//     url: api.role,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getServiceList (parameter) {
//   return request({
//     url: api.service,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getPermissions (parameter) {
//   return request({
//     url: api.permissionNoPager,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getOrgTree (parameter) {
//   return request({
//     url: api.orgTree,
//     method: 'get',
//     params: parameter
//   })
// }

// // id == 0 add     post
// // id != 0 update  put
// export function saveService (parameter) {
//   return request({
//     url: api.service,
//     method: parameter.id === 0 ? 'post' : 'put',
//     data: parameter
//   })
// }

// export function saveSub (sub) {
//   return request({
//     url: '/sub',
//     method: sub.id === 0 ? 'post' : 'put',
//     data: sub
//   })
// }
