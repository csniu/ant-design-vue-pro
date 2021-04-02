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
              <a-select placeholder="全部" v-model="classifyField.Field" :allowClear="true">
                <a-select-option title="snv" value="snv">点突变</a-select-option>
                <a-select-option title="indel" value="indel">插入缺失</a-select-option>
                <a-select-option title="cnv" value="cnv">拷贝数</a-select-option>
                <a-select-option title="fusion" value="fusion">融合</a-select-option>
                <a-select-option title="chem" value="chem">化疗</a-select-option>
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
      showPagination="auto"
      tableLayout="auto"
    >
      <span slot="cls" slot-scope="text">
        {{ text | trueFilter }}
      </span>
      <span slot="time" slot-scope="text">
        {{ text | formatDate }}
      </span>
      <div slot="other" slot-scope="text, record">
        <span v-for="cly in record.classify" :key="cly.id">
          {{ cly.category }},
        </span>
      </div>
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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="位点"
          hasFeedback
        >
          <a-input
            placeholder=""
            v-decorator="['rsid', {initialValue: mdl.rsid}]"
          />
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类"
        >
          <a-select
            v-decorator="['optionClassify', {initialValue: mdl.classifyValue}]"
            @change="handleChange"
            @select="handleSelect"
            mode="tags"
            style="width: 100%"
          >
            <a-select-option v-for="cls in classify" :key="cls">
              {{ cls }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { formatDate } from '../../utils/util.js'
import { deleteGene, getGenelist, saveGene, genelistDownload, genelistUploadFile, getGeneClassify } from '@/api/manage'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '基因列表名',
    dataIndex: 'name'
  },
  {
    title: '基因',
    dataIndex: 'genesymbol'
  },
  {
    title: '位点',
    dataIndex: 'rsid'
  },
  {
    title: '点突变',
    dataIndex: 'snv',
    scopedSlots: { customRender: 'cls' }
  },
  {
    title: '插入缺失',
    dataIndex: 'indel',
    scopedSlots: { customRender: 'cls' }
  },
  {
    title: '拷贝数',
    dataIndex: 'cnv',
    scopedSlots: { customRender: 'cls' }
  },
  {
    title: '融合',
    dataIndex: 'fusion',
    scopedSlots: { customRender: 'cls' }
  },
  {
    title: '化疗',
    dataIndex: 'chem',
    scopedSlots: { customRender: 'cls' }
  },
  {
    title: '其他分类',
    scopedSlots: { customRender: 'other' }
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
      // 分类
      classify: ['snv', 'indel', 'cnv', 'fusion'],
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
    },
    formatDate (time) {
        var date = new Date(time)
        return formatDate(date, 'MM/dd hh:mm')
      }
  },
  created () {
    // 足够大的数字，不分页
    getGeneClassify({ 'pageSize': 1000 })
      .then(res => {
        console.log('getGeneClassify', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var p = res.data.results[i]
          this.classify.push(p.category)
        }
        console.log('classify', this.classify)
      })
      .catch((res) => {
        console.log('getGeneClassify error', res)
      })
  },
  computed: {
    summaryInfo () {
      return `共 ${this.summary.genesymbol} 个；SNV ${this.summary.snv}；INDEL ${this.summary.indel}；CNV ${this.summary.cnv}；FUS ${this.summary.fusion}；CHEM ${this.summary.chem}`
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
      for (let i = 0, len = this.mdl.classify.length; i < len; i++) {
        const cly = this.mdl.classify[i].category
        if (!this.mdl.classifyValue.includes(cly)) {
          this.mdl.classifyValue.push(cly)
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

        values.snv = values.optionClassify.includes('snv')
        values.indel = values.optionClassify.includes('indel')
        values.cnv = values.optionClassify.includes('cnv')
        values.fusion = values.optionClassify.includes('fusion')
        values.chem = values.optionClassify.includes('chem')
        values.classify = values.optionClassify

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
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
      var a = document.createElement('a')
      // type 常见值 https://www.runoob.com/http/http-content-type.html
      // 添加 bom 信息，防止 utf_8_sig 编码中文乱码。https://www.coder.work/article/5771171
      var blob = new Blob([bom, 'genesymbol,rsid,snv,indel,cnv,fusion,chem,其他分类'], { type: 'application/octet-stream' })
      var url = URL.createObjectURL(blob)
      a.href = url
      a.download = 'genelist_name.csv'
      a.click()
      URL.revokeObjectURL(url)
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
        this.$message.info('导入成功')
      }).catch(res => {
        console.log('customRequest', res)
        if (typeof res.response.data.detail !== 'undefined') {
          this.$message.error('导入失败:' + res.response.data.detail)
        } else {
          this.$message.error('导入失败')
        }
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleSelect (value) {
      if (!this.classify.includes(value)) {
        this.classify.push(value)
      }
    }
  }
}
</script>
