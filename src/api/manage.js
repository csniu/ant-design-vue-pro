import request from '@/utils/request'

const api = {
  sample: '/sample/samples/',
  bdmsSample: '/sample/bdms/',
  downloadTask: '/raw/tasks/',
  analysis: '/analysis/',
  reportRecorde: '/analysis/report/',
  file: '/file/',
  user: '/consumer/user/',
  group: '/consumer/group/',
  role: '/consumer/role/',
  permission: '/consumer/permission/',
  genelist: '/report/genelist/',
  geneClassify: '/report/gene-classify/',
  genelistFile: '/report/genelist-file/',
  reportVersion: '/report/reportVersion/',
  distributor: '/report/distributor/',
  template: '/report/template/',
  staticResource: '/report/staticResource/',
  report: '/report/report/',
  reportRoot: '/report/',
  contract: '/contract/'

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

export function getSample (id) {
  return request({
    url: api.sample + id + '/',
    method: 'get'
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
export function syncSample (sampleid, organization) {
  return request({
    url: api.bdmsSample + organization + '/' + sampleid + '/',
    method: 'post'
  })
}

export function getReportRecorde (parameter) {
  return request({
    url: api.reportRecorde,
    method: 'get',
    params: parameter
  })
}

// 报告和vcf文件下载
export function downloadFile (data, filename) {
  return request({
    url: api.file,
    method: 'post',
    data: data, // {'abspath': ''}
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

export function getGenelist (parameter) {
  return request({
    url: api.genelist,
    method: 'get',
    params: parameter
  })
}

export function genelistDownload (parameter, filename) {
  return request({
    url: api.genelistFile,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  }).then(res => {
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    var a = document.createElement('a')
    // type 常见值 https://www.runoob.com/http/http-content-type.html
    // 添加 bom 信息，防止 utf_8_sig 编码中文乱码。https://www.coder.work/article/5771171
    var blob = new Blob([bom, res.data], { type: 'application/octet-stream' })
    var url = URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  })
}

// 上传文件
export function genelistUploadFile (record) {
  return request({
    url: api.genelistFile,
    method: 'post',
    data: record,
    contentType: false,
    processData: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function saveGene (record) {
  return request({
    url: record.id > 0 ? api.genelist + record.id + '/' : api.genelist,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function deleteGene (record) {
  return request({
    url: api.genelist + record.id + '/',
    method: 'delete',
    data: record
  })
}

export function getStaticResource (parameter) {
  return request({
    url: api.staticResource,
    method: 'get',
    params: parameter
  })
}

export function deleteStaticResource (record) {
  return request({
    url: api.staticResource + record.id + '/',
    method: 'delete',
    data: record
  })
}

export function saveStaticResource (record, id = 0) {
  return request({
    url: id > 0 ? api.staticResource + id + '/' : api.staticResource,
    method: id > 0 ? 'patch' : 'post',
    data: record,
    contentType: false,
    processData: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getDistributor (parameter) {
  return request({
    url: api.distributor,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteDistributor (record) {
  return request({
    url: api.distributor + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveDistributor (record) {
  return request({
    url: record.id > 0 ? api.distributor + record.id + '/' : api.distributor,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getReportVersion (parameter) {
  return request({
    url: api.reportVersion,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteReportVersion (record) {
  return request({
    url: api.reportVersion + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveReportVersion (record) {
  return request({
    url: record.id > 0 ? api.reportVersion + record.id + '/' : api.reportVersion,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getTemplate (parameter) {
  return request({
    url: api.template,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteTemplate (record) {
  return request({
    url: api.template + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveTemplate (record, id = 0) {
  return request({
    url: id > 0 ? api.template + id + '/' : api.template,
    method: id > 0 ? 'patch' : 'post',
    data: record,
    contentType: false,
    processData: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 创建或修改
export function saveReport (record) {
  return request({
    url: record.id > 0 ? api.report + record.id + '/' : api.report,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getReport (parameter) {
  return request({
    url: api.report,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteReport (record) {
  return request({
    url: api.report + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建
export function updateReportStatus (record) {
  return request({
    url: api.analysis + 'update/' + record.id + '/',
    method: 'post'
  })
}

// 创建
export function makeReport (organization, sampleId, reportVersion, template) {
  console.log('makeReport', organization, sampleId, reportVersion, template)
  var makeReportUrl = api.reportRoot + 'generate/' + organization + '/' + sampleId + '/' + reportVersion + '/'
  console.log('template', template)
  if (typeof template !== 'undefined') {
    makeReportUrl = makeReportUrl + template + '/'
  }
  console.log('makeReportUrl:', makeReportUrl)
  return request({
    url: makeReportUrl,
    method: 'post',
    data: { 'isManual': true }
  })
}

export function getGeneClassify (parameter) {
  return request({
    url: api.geneClassify,
    method: 'get',
    params: parameter
  })
}

// 创建或修改
export function saveGeneClassify (record) {
  return request({
    url: record.id > 0 ? api.report + record.id + '/' : api.report,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getContract (parameter) {
  return request({
    url: api.contract,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deleteContract (record) {
  return request({
    url: api.contract + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function saveContract (record) {
  if (!record.amountContract) {
    record.amountContract = 0
  }
  return request({
    url: record.id > 0 ? api.contract + record.id + '/' : api.contract,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}
