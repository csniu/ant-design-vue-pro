<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="列表名">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="基因">
              <a-input v-model="queryParam.genesymbol" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select placeholder="请选择" v-model="classifyField.Field">
                <template v-for="cls in classify">
                  <a-select-option :key="cls.field" :title="cls.text" :value="cls.field">{{ cls.text }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'left', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>概览：</span>
      <span>{{ summaryInfo }}</span>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建基因</a-button>
      <a-button type="primary" icon="download" @click="downloadTemplate">下载导入模板</a-button>
      <a-upload
        name="file"
        :multiple="false"
        :customRequest="customRequest"
        :showUploadList="false"
      >
        <a-button type="primary" icon="upload">上传数据</a-button>
      </a-upload>
      <a-button type="primary" :style="{ float: 'right', overflow: 'hidden' }" icon="download" @click="downloadGenelist">导出</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :pageSize="20"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: 1300 }"
      showPagination="auto"
      tableLayout="auto"
    >
      <span slot="cls" slot-scope="text">
        {{ text | trueFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
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
      <a-form class="role-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ID"
        >
          <a-input
            placeholder="ID"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="基因列表名"
          hasFeedback
        >
          <a-input
            placeholder="起一个名字"
            v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="基因"
          hasFeedback
        >
          <a-input
            placeholder=""
            v-decorator="['genesymbol', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类"
        >
          <a-checkbox-group :options="classifyOptions" v-decorator="['optionClassify', {initialValue: mdl.classifyValue}]"/>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { deleteGene, getGenelist, saveGene, downloadFile, genelistDownload, genelistUploadFile } from '@/api/manage'

const constFields = [
  { 'text': '基因列表名', 'field': 'name' },
  { 'text': '基因', 'field': 'genesymbol' }
]

const classifyFields = [
  { 'text': '点突变/插入缺失变异', 'field': 'snvIndel' },
  { 'text': '拷贝数变异', 'field': 'cnv' },
  { 'text': '融合变异', 'field': 'fusion' },
  { 'text': '化疗', 'field': 'chem' },
  { 'text': 'HR相关基因', 'field': 'HR' },
  { 'text': 'DNA损伤修复信号通路相关基因', 'field': 'DNAMismatch' },
  { 'text': '其他肿瘤驱动基因', 'field': 'DNAOther' },
  { 'text': '免疫治疗相关基因', 'field': 'ImmunityRelated' },
  { 'text': '靶向用药基因', 'field': 'TargetdrugRelated' },
  { 'text': '全外基因', 'field': 'isWholeExome' },
  { 'text': 'HRR通路相关基因(I级证据)', 'field': 'HRRLevel1' },
  { 'text': 'HRR通路相关基因(II级证据)', 'field': 'HRRLevel2' },
  { 'text': 'HRR通路其他基因(III级证据)', 'field': 'HRRLevel3' },
  { 'text': 'DDR通路其它核心基因', 'field': 'HRRLevel4' }
]

const allFields = constFields.concat(classifyFields)
const classify = [{ 'text': '全部', 'field': '' }].concat(classifyFields)

var columns = []

const leftFixed = ['name', 'genesymbol']

for (let i = 0, len = allFields.length; i < len; i++) {
  const fieldInfo = allFields[i]
  columns.push({
    title: fieldInfo.text,
    dataIndex: fieldInfo.field,
    scopedSlots: { customRender: leftFixed.includes(fieldInfo.field) ? fieldInfo.field : 'cls' },
    // fixed: leftFixed.includes(fieldInfo.field) ? 'left' : false,
    width: 100
  })
}

columns.push({
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right',
    align: 'left'
  })

const fields = ['id', 'name', 'genesymbol', 'classifyValue']

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    this.columns = columns
    this.fields = fields
    this.primaryKey = 'id'
    this.classify = classify
    this.classifyOptions = classifyFields.map(f => f.field)
    return {
     labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      summary: {},
      // create model
      visible: false,
      confirmLoading: false,
      mdl: { primaryKey: 0 },
      // 查询参数
      classifyField: { Field: '' },
      queryParam: { },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const optionClassify = {}
        optionClassify[this.classifyField.Field] = true
        const requestParameters = Object.assign({}, parameter, this.queryParam, optionClassify)
        console.log('loadData request parameters:', requestParameters)
        return getGenelist(requestParameters)
          .then(res => {
            console.log('res', res)
            this.summary = res.data.summary
            return res.data
          })
      }
    }
  },
  filters: {
    trueFilter (value) {
      if (value) {
        return '✓'
      }
    }
  },
  computed: {
    summaryInfo () {
      return `共 ${this.summary.genesymbol} 个；SNV ${this.summary.snvIndel}；CNV ${this.summary.cnv}；FUS ${this.summary.fusion}；CHEM ${this.summary.chem}；HR ${this.summary.HR}；IMMU ${this.summary.ImmunityRelated}；Targ ${this.summary.TargetdrugRelated}；HRRI ${this.summary.HRRLevel1}；HRRII ${this.summary.HRRLevel2}；HRRIII ${this.summary.HRRLevel4}；DDR ${this.summary.HRRLevel4}`
    }
  },
  methods: {
    handleEdit (record) {
      this.mdl = { ...record }
      this.visible = true

      this.mdl.classifyValue = []
      for (const f in record) {
        if (record[f] === true) {
          this.mdl.classifyValue.push(f)
        }
      }
      console.log('handleEdit', this.mdl)

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(record, this.fields))
      })
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteGene(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        console.log(errors, values)

        for (const f in values.optionClassify) {
          values[values.optionClassify[f]] = true
        }

        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改
            saveGene(values).then(res => {
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
            saveGene(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              this.form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('创建成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
      this.isCreate = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleReset () {
      this.queryParam = {}
      this.classifyField = { Field: '' }
    },
    handleAdd () {
      this.visible = true
      this.mdl = { 'id': 0 }
    },
    downloadTemplate () {
      const templatePath = 'D:\\dev\\tmp\\static_resource\\202101071327genelist.xlsx'
      downloadFile({ 'abspath': templatePath }, 'genelist.xlsx').then(res => {
        this.confirmLoading = false
        this.$message.info('下载成功')
      }).catch(res => {
        console.log(res)
        this.$message.info('下载失败')
      })
    },
    downloadGenelist () {
      const optionClassify = {}
      optionClassify[this.classifyField.Field] = true
      const requestParameters = Object.assign({}, this.queryParam, optionClassify)
      genelistDownload(requestParameters, 'genelist.csv')
    },
    customRequest (fileData) {
      var formData = new FormData()
      formData.append('file', fileData.file)

      genelistUploadFile(formData).then(res => {
        console.log('customRequest', res.data)
        this.$refs.table.refresh()
        this.$message.error('导入成功')
      }).catch(res => {
        console.log('customRequest', res.data)
        this.$message.error('导入失败')
      })
    }
  }
}
</script>
