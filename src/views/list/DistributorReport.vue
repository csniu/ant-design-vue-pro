<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="经销商">
              <a-input v-model="queryParam.distributor" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="报告版本">
              <a-input v-model="queryParam.report_version" placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="基因列表">
                <a-input v-model="queryParam.genelist"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="模板">
                <a-input v-model="queryParam.template"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="查询方法">
                <a-input v-model="queryParam.dataFunc"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="Panel">
                <a-input v-model="queryParam.panel"/>
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
      :data="distributorReport"
      :alert="false"
      showPagination="auto"
      tableLayout="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="time" slot-scope="text">
        {{ text | formatDate }}
      </span>
      <span slot="report" slot-scope="text">
        {{ reportVersion(text) }}
      </span>
      <span slot="distributor" slot-scope="text">
        {{ distributor(text) }}
      </span>
      <span slot="panel" slot-scope="text">
        {{ panel(text) }}
      </span>
      <span slot="template" slot-scope="text">
        {{ template(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      :model="reportMdl"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form class="role-form" :form="reportForm" v-bind="formLayout">

        <a-form-item label="ID">
          <a-input placeholder="ID" disabled="disabled" v-decorator="['id']"/>
        </a-form-item>

        <a-form-item label="经销商" hasFeedback>
          <a-select
            show-search
            :filter-option="false"
            placeholder="请选择"
            v-decorator="['distributor',
                          {rules: [{ required: true, message: '不能为空！'}], initialValue: reportMdl.distributor}]"
            :options="optDistributors"
            :disabled="reportCreate"
            @search="(v) => this.optDistributors = this.distributors.filter(r => r.title.includes(v))"
          />
        </a-form-item>

        <a-form-item label="报告版本" hasFeedback>
          <a-select
            show-search
            :filter-option="false"
            placeholder="请选择"
            v-decorator="['report_version',
                          {rules: [{ required: true, message: '不能为空！'}], initialValue: reportMdl.report_version}]"
            :options="optReports"
            :disabled="reportCreate"
            @search="(v) => this.optReports = this.reports.filter(r => r.title.includes(v))"
          />
        </a-form-item>

        <a-form-item label="别名" hasFeedback>
          <a-input
            v-decorator="['report_version_alias',
                          {rules: [{ whitespace:true }], initialValue: reportMdl.report_version_alias}]"
          />
        </a-form-item>

        <a-form-item label="PANEL" hasFeedback>
          <a-select
            show-search
            :filter-option="false"
            placeholder="请选择"
            v-decorator="['panel',
                          {rules: [{ required: true, message: '不能为空！'}], initialValue: reportMdl.panel}]"
            :options="optPanels"
            @search="(v) => this.optPanels = this.panels.filter(r => r.title.includes(v))"
          />
        </a-form-item>

        <a-form-item label="基因列表" hasFeedback>
          <a-select
            show-search
            :filter-option="false"
            placeholder="请选择"
            v-decorator="['genelist',
                          {rules: [{ required: true, message: '不能为空！'}], initialValue: reportMdl.genelist}]"
            :options="genelists"
            @search="(v) => this.optGenelists = this.genelists.filter(r => r.title.includes(v))"
          />
        </a-form-item>

        <a-form-item label="模板" hasFeedback>
          <a-select
            show-search
            :filter-option="false"
            placeholder="请选择"
            v-decorator="['template',
                          {rules: [{ required: true, message: '不能为空！'}], initialValue: reportMdl.template}]"
            :options="optTemplates"
            @search="(v) => this.optTemplates = this.templates.filter(r => r.title.includes(v))"
          />
        </a-form-item>

        <a-form-item label="查询方法" hasFeedback>
          <a-input
            v-decorator="['dataFunc',
                          {rules: [{ required: true, message: '不能为空！'},{ whitespace:true }],
                           initialValue: reportMdl.dataFunc}]"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>
<script>
import pick from 'lodash.pick'
import { baseMixin } from '@/store/app-mixin'
import { STable, Ellipsis } from '@/components'
import {
  getDistributor,
  getDistributorReport,
  getReportVersion,
  getPanel, getTemplate,
  getGenelistSummary,
  saveDistributorReport,
  deleteDistributorReport } from '@/api/manage'
import { formatDate } from '../../utils/util.js'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '经销商',
    dataIndex: 'distributor',
    scopedSlots: { customRender: 'distributor' }
  },
  {
    title: '报告版本',
    dataIndex: 'report_version',
    scopedSlots: { customRender: 'report' }
  },
  {
    title: '别名',
    dataIndex: 'report_version_alias'
  },
  {
    title: 'PANEL',
    dataIndex: 'panel',
    scopedSlots: { customRender: 'panel' }
  },
  {
    title: '基因列表',
    dataIndex: 'genelist',
    scopedSlots: { customRender: 'genelist' }
  },
  {
    title: '模板',
    dataIndex: 'template',
    scopedSlots: { customRender: 'template' }
  },
  {
    title: '查询方法',
    dataIndex: 'dataFunc'
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

const fields = ['id', 'report', 'report_version_alias', 'panel', 'genelist', 'template', 'dataFunc']

export default {
  name: 'DistributorConfig',
  mixins: [baseMixin],
  components: {
    STable,
    Ellipsis
  },
  data () {
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
    this.columns = columns
    this.fields = fields
    return {
      // 版本版本管理项
      reportForm: this.$form.createForm(this),
      visible: false,
      reportCreate: false,
      confirmLoading: false,
      reportMdl: { 'id': 0 },

      distributors: [],
      optDistributors: [],
      reports: [],
      optReports: [],
      panels: [],
      optPanels: [],
      templates: [],
      optTemplates: [],
      genelists: [],

      // 查询
      queryParam: {},
      advanced: false,

      distributorReport: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getDistributorReport(requestParameters)
          .then(res => {
            console.log('getDistributorReport', res)
            return res.data
          })
      }
    }
  },
  filters: {
    formatDate (time) {
        var date = new Date(time)
        return formatDate(date, 'MM/dd hh:mm')
      }
  },
  computed: {
    distributor () {
      return function (key) {
          const ss = this.distributors.filter(r => r.key === String(key))
          if (ss.length === 0) {
            return key
          } else {
            return ss[0].title
          }
        }
      },

    reportVersion () {
      return function (key) {
          const ss = this.reports.filter(r => r.key === String(key))
          if (ss.length === 0) {
            return key
          } else {
            return ss[0].title
          }
        }
      },

    panel () {
      return function (key) {
          const ss = this.panels.filter(r => r.key === String(key))
          if (ss.length === 0) {
            return key
          } else {
            return ss[0].title
          }
        }
      },

    template () {
      return function (key) {
          const ss = this.templates.filter(r => r.key === String(key))
          if (ss.length === 0) {
            return key
          } else {
            return ss[0].title
          }
        }
      }
  },
  methods: {
    handleEdit (record) {
      this.reportMdl = { ...record }
      this.reportMdl.report_version = this.reportMdl.report_version ? String(this.reportMdl.report_version) : null
      this.reportMdl.panel = this.reportMdl.panel ? String(this.reportMdl.panel) : null
      this.reportMdl.genelist = this.reportMdl.genelist ? String(this.reportMdl.genelist) : null
      this.reportMdl.template = this.reportMdl.template ? String(this.reportMdl.template) : null
      this.visible = true
      console.log('handleEdit', this.reportMdl)

      this.$nextTick(() => {
        this.fields.forEach(v => this.reportForm.getFieldDecorator(v))
        this.reportForm.setFieldsValue(pick(this.reportMdl, this.fields))
      })
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteDistributorReport(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleAdd () {
      this.visible = true
      this.reportMdl = { 'id': 0 }
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.reportForm.validateFields((errors, values) => {
      if (!errors) {
        console.log('saveDistributorReport', values)
          // 修改
        saveDistributorReport(values).then(res => {
          this.visible = false
          this.confirmLoading = false
          // 重置表单数据
          this.reportForm.resetFields()
          // 刷新表格
          this.$refs.table.refresh()

          this.$message.info('成功')
        })
      }
      this.confirmLoading = false
      this.creating = false
      })
    },
    handleCancel () {
      this.visible = false
      this.reportCreate = false
      this.reportForm.resetFields() // 清理表单数据（可不做）
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  created () {
    getDistributor({ 'pageSize': 1000 })
      .then(res => {
        console.log('getDistributor', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          const p = res.data.results[i]
          const opt = {}
          opt.key = p.id.toString()
          opt.title = p.bdmsName
          opt.disabled = false
          this.distributors.push(opt)
        }
        this.optDistributors = [...this.distributors]
        console.log('optDistributors', this.optDistributors)
      })
      .catch((res) => {
        console.log('getDistributor error', res)
      })

    getReportVersion({ 'pageSize': 1000 })
      .then(res => {
        console.log('getReportVersion', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          const p = res.data.results[i]
          const opt = {}
          opt.key = p.id.toString()
          opt.title = p.bdmsName
          opt.disabled = false
          this.reports.push(opt)
        }
        this.optReports = [...this.reports]
        console.log('report', this.reports)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })

    getPanel({ 'pageSize': 1000 })
      .then(res => {
        console.log('getPanel', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          const p = res.data.results[i]
          const opt = {}
          opt.key = p.id.toString()
          opt.title = p.name_ch
          opt.disabled = false
          this.panels.push(opt)
        }
        this.optPanels = [...this.panels]
        console.log('panels', this.panels)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })

    getTemplate({ 'pageSize': 1000 })
      .then(res => {
        console.log('getTemplate', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          const p = res.data.results[i]
          const opt = {}
          opt.key = p.id.toString()
          opt.title = p.name
          opt.disabled = !p.isActive
          this.templates.push(opt)
        }
        this.optTemplates = [...this.templates]
        console.log('templates', this.templates)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })

    getGenelistSummary({ 'pageSize': 1000 })
      .then(res => {
        console.log('getGenelistSummary', res)
        for (let i = 0, len = res.data.length; i < len; i++) {
          const p = res.data[i]
          const opt = {}
          opt.key = p
          opt.title = p
          opt.disabled = false
          this.genelists.push(opt)
        }
        console.log('genelists', this.genelists)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })
  }
}
</script>

<style lang="less" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .status-list {
      text-align: left;
    }
  }

//调整head行属性
/deep/ .ant-table-title-row > tr > th {
    position: relative;
    padding: 5px 5px;
    color: rgba(0, 0, 0, 0.85);
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 2px 2px;
}
</style>
