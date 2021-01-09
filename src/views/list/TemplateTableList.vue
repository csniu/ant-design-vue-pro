<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="公司">
              <a-select placeholder="全部" v-model="queryParam.organization">
                <a-select-option value="smartonco">医疗</a-select-option>
                <a-select-option value="smarthealth">健康</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
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
      <span slot="filePath" slot-scope="text, record">
        <a @click="handleDownlod(record)"> {{ text | getFilename }}</a>
      </span>
      <div slot="distributor" slot-scope="text, record">
        <template v-for="d in record.distributor">
          <ellipsis :length="30" tooltip :key="d.id">{{ d.name }};</ellipsis>
        </template>
      </div>
      <div slot="reportVersion" slot-scope="text, record">
        <template v-for="r in record.reportVersion">
          <ellipsis :length="30" tooltip :key="r.id">{{ r.name }}</ellipsis>
        </template>
      </div>
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
          label="名称"
          hasFeedback
        >
          <a-input
            placeholder="唯一性的名字"
            v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          label="公司"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['organization', {rules: [{ required: true, message: '不能为空！'}]}]"
            :options="organizationOptines"
          />
        </a-form-item>

        <a-form-item
          hasFeedback
          label="文件"
        >
          <a-upload
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            :file-list="fileList"
            @change="uploadChange"
          >
            <a-button icon="upload">选择文件</a-button>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="经销商"
        >
          <div>
            <a-transfer
              :data-source="distributor"
              show-search
              :titles="['可选', '已有']"
              :render="item => item.name"
              :list-style="{width: '200px', height: '250px',}"
              v-decorator="['distributors', {valuePropName: 'targetKeys', initialValue: mdl.distributorKeys }]"
            />
          </div>
        </a-form-item>

        <a-form-item
          label="报告版本"
        >
          <div>
            <a-transfer
              :data-source="report"
              show-search
              :titles="['可选', '已有']"
              :render="item => item.name"
              :list-style="{width: '200px', height: '250px',}"
              v-decorator="['reports', {valuePropName: 'targetKeys', initialValue: mdl.reportKeys }]"
            />
          </div>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { getTemplate, getDistributor, getReportVersion, saveTemplate, deleteTemplate, downloadFile } from '@/api/manage'
import { formatDate } from '../../utils/util.js'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '公司',
    dataIndex: 'organization'
  },
  {
    title: '经销商',
    dataIndex: 'distributor',
    scopedSlots: { customRender: 'distributor' }
  },
  {
    title: '报告版本',
    dataIndex: 'reportVersion',
    scopedSlots: { customRender: 'reportVersion' }
  },
  {
    title: '文件',
    dataIndex: 'filePath',
    scopedSlots: { customRender: 'filePath' }
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

const fields = ['id', 'name', 'organization', 'distributors', 'reports']

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
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
    this.organizationOptines = [
      { 'value': 'smartonco', 'label': '医疗', 'disabled': false },
      { 'value': 'smarthealth', 'label': '健康', 'disabled': false }
    ]
    return {
      form: this.$form.createForm(this),
      distributor: [],
      report: [],
      file: null,
      fileList: [],
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
        return getTemplate(requestParameters)
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
      }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    // 足够大的数字，不分页
    getDistributor({ 'pageSize': 1000 })
      .then(res => {
        console.log('getDistributor', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var p = res.data.results[i]
          p.key = p.id.toString()
          p.title = p.name
          p.disabled = false
          this.distributor.push(p)
        }
        console.log('distributor', this.distributor)
      })
      .catch((res) => {
        console.log('getDistributor error', res)
      })

    getReportVersion({ 'pageSize': 1000 })
      .then(res => {
        console.log('getReportVersion', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var p = res.data.results[i]
          p.key = p.id.toString()
          p.title = p.name
          p.disabled = false
          this.report.push(p)
        }
        console.log('report', this.distributor)
      })
      .catch((res) => {
        console.log('getReportVersion error', res)
      })
  },
  methods: {
    handleEdit (record) {
      console.log(record)
      this.mdl = { ...record }
      this.mdl.distributorKeys = this.mdl.distributor.map(p => p.id.toString())
      this.mdl.reportKeys = this.mdl.reportVersion.map(p => p.id.toString())
      this.visible = true

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleAdd () {
      this.mdl = { 'id': 0, 'distributorKeys': [], 'reportKeys': [] }
      this.visible = true
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (!errors) {
        var optionDistributor = Object.values({ ...values.distributors })
        values.distributor = this.distributor.filter(p => optionDistributor.includes(p.key))
        console.log('distributor', values.distributor)

        var optionReport = Object.values({ ...values.reports })
        values.reportVersion = this.report.filter(p => optionReport.includes(p.key))
        console.log('reportVersion', values.distributor)
        console.log('values', values)

        var formData = new FormData()
        formData.append('name', values.name)
        formData.append('organization', values.organization)
        formData.append('distributor', JSON.stringify(values.distributor))
        formData.append('reportVersion', JSON.stringify(values.reportVersion))
        if (this.file) {
          formData.append('filePath', this.file)
        }

        if (values.id > 0) {
          // 修改
          saveTemplate(formData, values.id).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            this.form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('修改成功')
          })
        } else {
          // 新增
          saveTemplate(formData, values.id).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            this.form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('创建成功')
          })
        }
      }
      this.fileList = []
      this.file = null
      })
    },
    handleCancel () {
      this.visible = false
      this.fileList = []
      this.file = null
      this.form.resetFields() // 清理表单数据（可不做）
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteTemplate(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleDownlod (record) {
      console.log(record)
      const serverPath = record.filePath
      const filename = serverPath.toString().split(/\\|\//).pop()
      if (serverPath) {
        downloadFile({ 'abspath': serverPath }, filename).then(res => {
          this.confirmLoading = false
          this.$message.info('下载成功')
        }).catch(res => {
          console.log(res)
          this.$message.info('下载失败')
        })
      }
    },
    beforeUpload (file) {
      const reader = new FileReader()
      // 转化为blob
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        // this.fileBlob = reader.result
        this.file = file
      }
      return false
    },
    uploadChange (info) {
      console.log(info)
      // 只能上传一个
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
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
