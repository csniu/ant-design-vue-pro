<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.sampleId" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="公司">
                <a-select placeholder="全部" v-model="queryParam.organization">
                  <a-select-option value="smartonco">医疗</a-select-option>
                  <a-select-option value="smarthealth">健康</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-item label="经销商">
                <a-input v-model="queryParam.distributor"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="报告版本">
                <a-input v-model="queryParam.reportVersion"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="全部" v-model="queryParam.status" :options="status">
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :pageSize="20"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :rowSelection="rowSelection"
      showPagination="auto"
      tableLayout="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="time" slot-scope="text">
        {{ text | formatDate }}
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusFilter" :text="text | statusTextFilter" />
      </span>
      <span slot="organization" slot-scope="text">
        {{ text | organizationFilter }}
      </span>
      <span slot="reportVersion" slot-scope="text">
        {{ reportVersionComputed(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">重新生成</a>
          <a-divider v-if="record.wordPath" type="vertical" />
          <a v-if="record.wordPath" @click="handleDownlod(record.wordPath)">WORD</a>
          <a-divider v-if="record.pdfPath" type="vertical" />
          <a v-if="record.pdfPath" @click="handleDownlod(record.pdfPath)">PDF</a>
          <a-divider v-if="record.jsonPath" type="vertical" />
          <a v-if="record.jsonPath" @click="handleDownlod(record.jsonPath)">JSON</a>
        </template>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      :model="mdl"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form class="role-form" :form="form" v-bind="formLayout">

        <a-form-item label="ID">
          <a-input
            placeholder="ID"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          label="公司"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['organization', {rules: [{ required: true, message: '不能为空！'}], initialValue: 'smartonco'}]"
            :options="organizationOptines"
          />
        </a-form-item>

        <a-form-item
          label="样本编号"
          hasFeedback
        >
          <a-input
            v-decorator="['sampleId', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          label="报告版本"
          hasFeedback
        >
          <a-input
            placeholder="全流程报告版本编号"
            v-decorator="['reportVersion', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          label="模板"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['template', {rules: []}]"
            :options="templates"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { getReport, getTemplate, deleteReport, downloadFile, saveReport, makeReport, getReportVersion } from '@/api/manage'
import { formatDate } from '../../utils/util.js'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '样本编号',
    dataIndex: 'sampleId'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '公司',
    dataIndex: 'organization',
    scopedSlots: { customRender: 'organization' }
  },
  {
    title: '经销商',
    dataIndex: 'distributor'
  },
  {
    title: '报告版本',
    dataIndex: 'reportVersion',
    scopedSlots: { customRender: 'reportVersion' }
  },
  {
    title: '报告模板',
    dataIndex: 'template'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '修改时间',
    dataIndex: 'updataDate',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const status = [
  { 'value': 'Standby', 'label': '排队中', 'status': 'warning' },
  { 'value': 'TemplateMatching', 'label': '匹配模板', 'status': 'error' },
  { 'value': 'ReportUnderway', 'label': '生成中', 'status': 'success' }
]

const organizationOptines = [
      { 'value': 'smartonco', 'label': '医疗', 'disabled': false },
      { 'value': 'smarthealth', 'label': '健康', 'disabled': false }
]

const fields = ['id', 'sampleId', 'organization', 'distributor', 'reportVersion', 'template']

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    this.status = status
    this.fields = fields
    this.primaryKey = 'id'
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    this.organizationOptines = organizationOptines
    return {
      form: this.$form.createForm(this),
      templates: [],
      reportVersions: [],
      // create model
      visible: false,
      confirmLoading: false,
      mdl: { primaryKey: 0 },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getReport(requestParameters)
          .then(res => {
            console.log(res)
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    formatDate (time) {
        var date = new Date(time)
        return formatDate(date, 'MM/dd hh:mm')
      },
    getFilename (path) {
      if (path !== null) {
        return path.split(/\\|\//).pop()
        }
      return path
      },
    statusTextFilter (value) {
      const ss = status.filter(s => s.value === value)
      if (ss.length === 0) {
        return value
      } else {
        return ss[0].label
      }
    },
    statusFilter (value) {
      console.log(status)
      const ss = status.filter(s => s.value === value)
      if (ss.length === 0) {
        return 'warning'
      } else {
        return ss[0].status
      }
    },
    organizationFilter (value) {
      console.log(organizationOptines)
      const ss = organizationOptines.filter(s => s.value === value)
      if (ss.length === 0) {
        return value
      } else {
        return ss[0].label
      }
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },

    reportVersionComputed () {
      return function (reportVersionEn) {
        const ss = this.reportVersions.filter(s => s.value === reportVersionEn)
        if (ss.length === 0) {
          return reportVersionEn
        } else {
          return ss[0].label
        }
      }
    }
  },
  created () {
    // 足够大的数字，不分页
    getTemplate({ 'pageSize': 1000 })
      .then(res => {
        console.log('getTemplate', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.templates.push({ 'value': tmp.name, 'label': tmp.name })
        }
        console.log('template', this.templates)
      })
      .catch((res) => {
        console.log('getTemplate error', res)
      })
    // 足够大的数字，不分页
    getReportVersion({ 'pageSize': 1000 })
      .then(res => {
        console.log('getReportVersion', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.reportVersions.push({ 'value': tmp.bdmsNameEn, 'label': tmp.bdmsName })
        }
        console.log('ReportVersion', this.reportVersions)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })
  },
  methods: {
    handleEdit (record) {
      console.log(record)
      this.mdl = { ...record }
      this.mdl.id = 0
      this.visible = true

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleAdd () {
      this.mdl = { 'id': 0 }
      this.visible = true
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('values', values)
        if (values.id > 0) {
          // 修改
          saveReport(values).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            this.form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('修改成功')
          }).catch(res => {
              console.log('report create error', res.response.data)
              setTimeout(() => { this.confirmLoading = false }, 5000)
            })
        } else {
          // 新增
          makeReport(values['organization'], values['sampleId'], values['reportVersion'], values['template']).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            this.form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('创建成功')
          }).catch(res => {
              console.log('report create error', res.response.data)
              if (typeof res.response.data.detail !== 'undefined') {
                this.$message.error(res.response.data.detail)
              }
              setTimeout(() => { this.confirmLoading = false }, 5000)
            })
        }
      }
      })
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteReport(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleDownlod (abspath) {
      console.log(abspath)
      const filename = abspath.toString().split(/\\|\//).pop()
      if (abspath) {
        downloadFile({ 'abspath': abspath }, filename).then(res => {
          this.confirmLoading = false
          // this.$message.info('下载成功')
        }).catch(res => {
          console.log(res)
          this.$message.info('下载失败')
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
