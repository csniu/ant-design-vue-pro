import request from '@/utils/request'

const api = {
  sample: '/sample/samples/',
  bdmsSample: '/sample/bdms/',
  downloadTask: '/download/tasks/',
  analysis: '/recorder/analysis/',
  report: '/recorder/report/',
  file: '/recorder/file/',
  user: '/consumer/user/',
  group: '/consumer/group/',
  role: '/consumer/role/',
  permission: '/consumer/permission/'
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

// 删除
export function deleteAnalysis (id) {
  return request({
    url: api.analysis + id + '/',
    method: 'delete'
  })
}

export function getSamples (parameter) {
  return request({
    url: api.sample,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteSample (record) {
  return request({
    url: api.sample + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveSample (record) {
  return request({
    url: record.id > 0 ? api.sample + record.id + '/' : api.sample,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

// 同步样本信息
export function syncSample (sampleid) {
  return request({
    url: api.bdmsSample + sampleid + '/',
    method: 'post'
  })
}

export function getReport (parameter) {
  return request({
    url: api.report,
    method: 'get',
    params: parameter
  })
}

// 报告和vcf文件下载
export function downloadFile (parameter, filename) {
  return request({
    url: api.file,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  }).then(res => {
    var a = document.createElement('a')
    // type 常见值 https://www.runoob.com/http/http-content-type.html
    var blob = new Blob([res.data], { type: 'application/octet-stream' })
    var url = URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  })
}

export function getUsers (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

// 创建或修改
export function saveUser (record) {
  return request({
    url: record.id > 0 ? api.user + record.id + '/' : api.user,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getRoles (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

// 创建或修改
export function saveRole (record) {
  return request({
    url: record.id > 0 ? api.role + record.id + '/' : api.role,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

// 删除
export function deleteRole (record) {
  return request({
    url: api.role + record.id + '/',
    method: 'delete',
    data: record
  })
}

export function getGroups (parameter) {
  return request({
    url: api.group,
    method: 'get',
    params: parameter
  })
}

export function deleteGroup (record) {
  return request({
    url: api.group + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveGroup (record) {
  return request({
    url: record.id > 0 ? api.group + record.id + '/' : api.group,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permission,
    method: 'get',
    params: parameter
  })
}
