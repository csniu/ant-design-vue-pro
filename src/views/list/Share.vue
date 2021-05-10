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
                    <span v-if="f.local_path === 'loss'" :style="{ 'color': 'red' }">文件缺失</span>
                    <span v-else-if="f.repetitive" :style="{ 'color': 'red' }">{{ f.local_path }}</span>
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
                  任务提交成功(共{{ totalSize }})，任务ID为 <span style="color: red">{{ packInfo.id }}</span> 。 该ID为查询任务状态使用，请保存。
                </p>
              </a-alert>
            </div>
            <div v-show="packStatus === 'warning'">
              <a-alert
                message="Warning"
                type="warning"
                show-icon
              >
                <p slot="description">
                  文件太大({{ totalSize }})，请使用硬盘拷贝！
                </p>
              </a-alert>
            </div>
            <div v-show="packStatus === 'error'">
              <a-alert
                message="Error"
                description="提交失败,请稍后再试！"
                type="error"
                show-icon
              />
            </div>
          </div>
        </a-col>
        <a-col :md="4" :sm="24">
          <div v-show="files.length !== 0 && packStatus !== 'warning' && packStatus !== 'success'">
            <a-button :title="totalSize" type="primary" @click="packFiles">打包文件</a-button>
          </div>
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
          打包完成共计 {{ totalSize }}，你可
          <a :href="packInfo.url" target="_blank">点击下载</a>
          ，或
          <a @click="doCopy" href="#" style="color: #1890ff">复制分享</a>
          ，链接7天有效。
        </p>
        <p v-else-if="packInfo.errorMessage" :style="{ 'text-align': 'center', 'font-size': 'x-large' }">文件打包<span style="color: red">失败</span>，请联系管理员。</p>
        <p v-else :style="{ 'text-align': 'center', 'font-size': 'x-large' }">
          文件<span style="color: red">正在打包</span>，请耐心等待！
        </p>
      </div>
    </a-card>

    <a-card style="margin-top: 24px;" :bordered="false" v-show="!searchVisible && !visible">
      <div style="text-align: center;">
        <img src="~@/assets/Matchstick-Men.gif" style="margin: 0 auto;"/>
      </div>
    </a-card>

    <backtop/>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import { BackTop } from 'ant-design-vue'
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
    Ellipsis,
    'backtop': BackTop
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
      files: [],
      totalSize: 0
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
                const sampleFileTypes = []

                for (let j = 0; j < sampleFiles.length; j++) {
                  const fileInfo = sampleFiles[j]
                  // 相同文件类型重复
                  if (sampleFileTypes.includes(fileInfo.typeof)) {
                    this.data[i].files[j].repetitive = true
                  } else {
                    sampleFileTypes.push(fileInfo.typeof)
                  }

                  fileInfo.sample_id = sampleId
                  if (fileInfo.local_path !== 'loss') {
                    this.files.push(fileInfo)
                  }
                }
              var totalBit = 0
              for (let i = 0; i < this.files.length; i++) {
                totalBit = totalBit + this.files[i].size
              }
              if (totalBit < 1024 * 1024 * 1024) {
                this.totalSize = (totalBit / (1024 * 1024)).toFixed(2) + 'M'
              } else {
                this.totalSize = (totalBit / (1024 * 1024 * 1024)).toFixed(2) + 'G'
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
              if (this.packInfo.totalSize < 1024 * 1024 * 1024) {
                this.totalSize = (this.packInfo.totalSize / (1024 * 1024)).toFixed(2) + 'M'
              } else {
                this.totalSize = (this.packInfo.totalSize / (1024 * 1024 * 1024)).toFixed(2) + 'G'
              }
            }).catch(res => {
              if (res.response.data.detail === '未找到。') {
                this.$message.error('ID 不存在！')
              } else {
                this.$message.error('查询失败，请稍后再试。')
                console.log(res)
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
      var totalBit = 0
      for (let i = 0; i < this.files.length; i++) {
        totalBit = totalBit + this.files[i].size
      }
      if (totalBit < 1024 * 1024 * 1024) {
        this.totalSize = (totalBit / (1024 * 1024)).toFixed(2) + 'M'
      } else {
        this.totalSize = (totalBit / (1024 * 1024 * 1024)).toFixed(2) + 'G'
      }
      if (totalBit === 0) {
        return ''
      }
      if (totalBit > 50 * 1024 * 1024 * 1024) { // 50 G
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
    },
    doCopy () {
      const updateTime = new Date(this.packInfo.updata_date)
      const timeValidity = formatDate(new Date(updateTime.setDate(updateTime.getDate() + 7)), 'yyyy-MM-dd hh:mm:ss')
      const text = `
下载链接: ${this.packInfo.url}
链接有效期截止至 ${timeValidity}，请及时下载。
`
      this.$copyText(text).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
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
