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
  genelistSummary: '/report/genelist-summary/',
  reportVersion: '/report/reportVersion/',
  distributor: '/report/distributor/',
  distributorReport: '/report/distributor-report/',
  template: '/report/template/',
  configServer: '/report/config-server/',
  configValue: '/report/config-value/',
  report: '/report/report/',
  panel: '/report/panel/',
  reportRoot: '/report/',
  contract: '/contract/',
  share: '/share/samplefile/',
  shareTask: '/share/task/',

  baseMutation: '/mock/mutation/',
  baseHla: '/mock/hla/',
  baseNeo: '/mock/neo/',
  baseReport: '/mock/report/',
  baseCancer: '/mock/cancer/',
  baseVirus: '/mock/virus/',
  mock: '/mock/sample/',
  chemPanel: '/mock/chem-panels/',
  mockDistributor: '/mock/distributor/'

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

export function getGenelistSummary (parameter) {
  return request({
    url: api.genelistSummary,
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

export function getConfigServer (parameter) {
  return request({
    url: api.configServer,
    method: 'get',
    params: parameter
  })
}

export function deleteConfigServer (record) {
  return request({
    url: api.configServer + record.id + '/',
    method: 'delete',
    data: record
  })
}

export function saveConfigServer (record) {
  return request({
    url: record.id > 0 ? api.configServer + record.id + '/' : api.configServer,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getConfigValue (parameter) {
  return request({
    url: api.configValue,
    method: 'get',
    params: parameter
  })
}

export function deleteConfigValue (record) {
  return request({
    url: api.configValue + record.id + '/',
    method: 'delete',
    data: record
  })
}

export function saveConfigValue (record) {
  return request({
    url: record.id > 0 ? api.configValue + record.id + '/' : api.configValue,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getDistributor (parameter) {
  return request({
    url: api.distributor,
    method: 'get',
    params: parameter
  })
}

export function getDistributorInfo (recordId) {
  return request({
    url: api.distributor + recordId + '/',
    method: 'get'
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

export function getDistributorReport (parameter) {
  return request({
    url: api.distributorReport,
    method: 'get',
    params: parameter
  })
}

export function saveDistributorReport (record) {
  return request({
    url: record.id > 0 ? api.distributorReport + record.id + '/' : api.distributorReport,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function deleteDistributorReport (record) {
  return request({
    url: api.distributorReport + record.id + '/',
    method: 'delete',
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

export function getSampleFile (record) {
  return request({
    url: api.share,
    method: 'post',
    data: record
  })
}

export function packSampleFiles (record) {
  return request({
    url: api.shareTask,
    method: 'post',
    data: record
  })
}

export function getPack (record) {
  return request({
    url: api.shareTask + record.taskId + '/',
    method: 'get',
    data: record
  })
}

export function getPacks (parameter) {
  return request({
    url: api.shareTask,
    method: 'get',
    params: parameter
  })
}

export function getPanel (parameter) {
  return request({
    url: api.panel,
    method: 'get',
    params: parameter
  })
}

// 删除
export function deletePanel (record) {
  return request({
    url: api.panel + record.id + '/',
    method: 'delete',
    data: record
  })
}

// 创建或修改
export function savePanel (record) {
  return request({
    url: record.id > 0 ? api.panel + record.id + '/' : api.panel,
    method: record.id > 0 ? 'patch' : 'post',
    data: record
  })
}

export function getMutations (parameter) {
  return request({
    url: api.baseMutation,
    method: 'get',
    params: parameter
  })
}

export function getHla (parameter) {
  return request({
    url: api.baseHla,
    method: 'get',
    params: parameter
  })
}

export function getNeo (parameter) {
  return request({
    url: api.baseNeo,
    method: 'get',
    params: parameter
  })
}

export function getMockReport (parameter) {
  return request({
    url: api.baseReport,
    method: 'get',
    params: parameter
  })
}

export function getCancer (parameter) {
  return request({
    url: api.baseCancer,
    method: 'get',
    params: parameter
  })
}

export function getVirus (parameter) {
  return request({
    url: api.baseVirus,
    method: 'get',
    params: parameter
  })
}

export function getMockSample (parameter) {
  return request({
    url: api.mock,
    method: 'get',
    params: parameter
  })
}

// 创建或修改
export function saveMockSample (record) {
  return request({
    url: api.mock,
    method: 'post',
    data: record
  })
}

export function getChemPanel (parameter) {
  return request({
    url: api.chemPanel,
    method: 'get',
    params: parameter
  })
}

export function getMockDistributor (parameter) {
  return request({
    url: api.mockDistributor,
    method: 'get',
    params: parameter
  })
}
