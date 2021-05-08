<template>
  <div>
    <a-card :bordered="false">
      <div :style="{ 'hight': '100%' }" class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
            </a-col>

            <a-col :md="14" :sm="24">
              <a-form-item>
                <a-textarea :autoSize="{ minRows: 10 }" v-model="queryParam.samples" placeholder="样本编号，多个使用空格或换行分割" allow-clear/>
              </a-form-item>
              <p style="color: red">注：查找文件可能出现缺失和重复情况，请自行选择。 </p>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-list :split="false">
                  <a-list-item :style="{ 'padding-top': '2px', 'padding-bottom': '2px' }" >
                    <a-checkbox :defaultChecked="false" :disabled="!powerUser" v-model="queryParam.fastq">Fastq 原始文件</a-checkbox>
                  </a-list-item>
                  <a-list-item :style="{ 'padding-top': '2px', 'padding-bottom': '2px' }" >
                    <a-checkbox :defaultChecked="false" :disabled="!powerUser" v-model="queryParam.bam">Bam 文件</a-checkbox>
                  </a-list-item>
                  <a-list-item :style="{ 'padding-top': '2px', 'padding-bottom': '2px' }" >
                    <a-checkbox :defaultChecked="false" v-model="queryParam.vcf">vcf 结果文件</a-checkbox>
                  </a-list-item>
                  <a-list-item :style="{ 'padding-top': '2px', 'padding-bottom': '2px' }" >
                    <a-checkbox :defaultChecked="false" v-model="queryParam.qc">qc 质控文件</a-checkbox>
                  </a-list-item>
                  <a-list-item :style="{ 'padding-top': '2px', 'padding-bottom': '2px' }" >
                    <a-checkbox :defaultChecked="false" v-model="queryParam.report">报告</a-checkbox>
                  </a-list-item>
                </a-list>
              </a-form-item>
              <a-form-item>
                <a-input v-model="queryParam.taskId" placeholder="任务 ID"/>
              </a-form-item>
              <a-button type="primary" @click="loadData">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </a-col>

            <a-col :md="3" :sm="24">
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card style="margin-top: 24px;" :bordered="false" v-show="visible">
      <a-list
        size="large"
        rowKey="sample_id"
        :loading="loading"
        itemLayout="vertical"
        :dataSource="data"
      >
        <a-list-item :key="item.sample_id" slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a slot="title">{{ item.sample_id }}</a>
            <template slot="description">
              <template v-for="f in item.files">
                <p :key="f.typeof + f.local_path">
                  <a-checkbox
                    :defaultChecked="f.local_path !== 'loss'"
                    :disabled="f.local_path === 'loss'"
                    @change="onChange($event, item.sample_id, f)">
                    <span :style="{ 'font-weight': 'bold' }">{{ f.typeof | statusFilter }}: </span>
                    <span v-if="f.local_path === 'loss'" :style="{ 'color': 'red' }">文件缺失！</span>
                    <span v-else>{{ f.local_path }}</span>
                  </a-checkbox>
                </p>
              </template>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <a-row :gutter="48">
        <a-col :md="3" :sm="24"></a-col>
        <a-col :md="14" :sm="24">
          <div>
            <div v-show="packStatus === 'success'">
              <a-alert
                message="Success"
                type="success"
                show-icon
              >
                <p slot="description">
                  任务提交成功，任务ID为 <span style="color: red">{{ packInfo.id }}</span> 。 该ID为查询任务状态使用，请保存。
                </p>
              </a-alert>
            </div>
            <div v-show="packStatus === 'warning'">
              <a-alert
                message="Warning"
                description="文件太大，请使用硬盘拷贝！"
                type="warning"
                show-icon
              />
            </div>
            <div v-show="packStatus === 'error'">
              <a-alert
                message="Error"
                description="提交失败,请联系管理员！"
                type="error"
                show-icon
              />
            </div>
          </div>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-button v-show="files.length !== 0 && packStatus !== 'warning' && packStatus !== 'success'" type="primary" @click="packFiles">打包文件</a-button>
        </a-col>
        <a-col :md="3" :sm="24"></a-col>
      </a-row>
    </a-card>

    <a-card style="margin-top: 24px;" :bordered="false" v-show="searchVisible">
      <div>
        <p :style="{ 'text-align': 'center', 'font-size': 'x-large' }">
          该任务由 <span style="color: blue">{{ packInfo.user }}</span> 于 <span style="color: blue">{{ packInfo.create_date | formatDate }}</span> 创建。
        </p>
        <p v-if="packInfo.url" :style="{ 'text-align': 'center', 'font-size': 'x-large' }">
          下载链接：<span style="color: red">{{ packInfo.url }}</span>
        </p>
        <p v-else :style="{ 'text-align': 'center', 'font-size': 'x-large' }">
          文件<span style="color: red">正在打包</span>，请耐心等待！
        </p>
      </div>
    </a-card>

    <a-card style="margin-top: 24px;" :bordered="false" v-show="!searchVisible && !visible">
      <div style="text-align: center;">
        <img src="~@/assets/Matchstick-Men.gif" style="margin: 0 auto;">
      </div>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import { getSampleFile, packSampleFiles, getPack } from '@/api/manage'
import { formatDate } from '../../utils/util.js'
import user from '@/store/modules/user'

const TYPES = {
    'R1': 'Fastq R1',
    'R2': 'Fastq R2',
    'MD51': 'R1 MD5',
    'MD52': 'R2 MD5',
    'bam': 'Bam',
    'bai': 'Bai',
    'snv': 'SNV',
    'cnv': 'CNV',
    'fusion': 'Fusion',
    'qc': 'Qc',
    'pdf': 'Report Pdf',
    'word': 'Report Word'
}

function isPowerUser () {
  console.log(user.state.isSuperuser)
  console.log(user.state.isAdmin)
  console.log(user.state.roles)
  if (user.state.isSuperuser) {
    return true
  }
  if (user.state.isAdmin) {
    return true
  }
  if (user.state.roles.includes('powerUser')) {
    return true
  }
  return false
}

export default {
  name: 'Share',
  components: {
    Ellipsis
  },
  data () {
    this.powerUser = isPowerUser()
    return {
      visible: false,
      searchVisible: false,
      packStatus: '',
      packInfo: {},
      loading: false,
      form: this.$form.createForm(this),
      confirmLoading: false,
      queryParam: {},
      data: [],
      files: []
    }
  },
  filters: {
    statusFilter (value) {
      const ss = TYPES[value]
      if (typeof ss !== 'undefined') {
        return ss
      } else {
        return value
      }
    },

    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
  },
  methods: {
    loadData () {
        this.loading = true
        const requestParameters = Object.assign({}, this.queryParam)
        if (typeof requestParameters.samples !== 'undefined') {
          requestParameters.samples = String(requestParameters.samples).split(/[\s\n]/).filter(word => word.length !== 0)
          requestParameters.samples = Array.from(new Set(requestParameters.samples))
        }
        console.log('loadData request parameters:', requestParameters)

        if (typeof requestParameters.taskId === 'undefined' || !requestParameters.taskId.trim()) {
          getSampleFile(requestParameters)
            .then(res => {
              console.log(res)
              this.data = res.data
              this.files = []
              for (let i = 0; i < this.data.length; i++) {
                const sampleId = this.data[i].sample_id
                const sampleFiles = this.data[i].files
                for (let i = 0; i < sampleFiles.length; i++) {
                  const fileInfo = sampleFiles[i]
                  fileInfo.sample_id = sampleId
                  if (fileInfo.local_path !== 'loss') {
                    this.files.push(fileInfo)
                  }
                }
              }
            }).catch(res => {
              this.$message.error('查询失败，请稍后再试。')
            })
          this.visible = true
          this.searchVisible = false
          this.loading = false
          this.packStatus = ''
        } else {
          getPack(requestParameters)
            .then(res => {
              this.searchVisible = true
              this.visible = false
              this.packInfo = res.data
            }).catch(res => {
              if (res.response.data.detail === '未找到。') {
                this.$message.error('ID 不存在！')
              } else {
                this.$message.error('查询失败，请稍后再试。')
              }
            })
          this.loading = false
        }
    },
    onChange (e, sampleId, fileInfo) {
      if (e.target.checked) {
        fileInfo.sample_id = sampleId
        this.files.push(fileInfo)
      } else {
        this.files = this.files.filter(f => f.local_path !== fileInfo.local_path)
      }
      console.log('####', this.files)
    },
    reset () {
      this.queryParam = {}
      this.visible = false
      this.loading = false
      this.data = []
      this.files = []
      this.packStatus = ''
      this.packInfo = {}
      this.searchVisible = false
    },
    packFiles () {
      var totalSize = 0
      for (let i = 0; i < this.files.length; i++) {
        totalSize = totalSize + this.files[i].size
      }
      if (totalSize === 0) {
        return ''
      }
      if (totalSize > 50 * 1024 * 1024 * 1024) { // 50 G
        this.packStatus = 'warning'
      } else {
        packSampleFiles({ 'files': this.files }).then(res => {
          console.log('Pack: ', res)
          this.packStatus = 'success'
          this.packInfo = res.data
          console.log('Pack: ', this.packStatus)
          console.log('Pack: ', this.packInfo)
        }).catch(res => {
          console.log('Pack Error: ', res)
          this.packStatus = 'error'
          this.packInfo = res.response.data
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.role-form {
  /deep/ .role-group {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
