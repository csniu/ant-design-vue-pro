import request from '@/utils/request'

const api = {
  // user: '/user',
  // role: '/role',
  // service: '/service',
  // permission: '/permission',
  // permissionNoPager: '/permission/no-pager',
  // orgTree: '/org/tree'
  downloadTask: '/download/tasks/',
  analysis: '/recorder/analysis/'
}

export default api

export function getDownloadTask (parameter) {
  return request({
    url: api.downloadTask,
    method: 'get',
    params: parameter
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

export function getAnalysis (parameter) {
  return request({
    url: api.analysis,
    method: 'get',
    params: parameter
  })
}

// 修改
export function saveAnalysis (record) {
  return request({
    url: api.analysis + record.id + '/',
    method: 'patch',
    data: record
  })
}

// 创建或修改
export function deleteAnalysis (id) {
  return request({
    url: api.analysis + id + '/',
    method: 'delete'
  })
}
