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
          <a-col :md="4" :sm="24">
            <a-form-item label="类型">
              <a-select placeholder="请选择" v-model="queryParam.typeof">
                <template v-for="tp in types">
                  <a-select-option :key="tp.value" :title="tp.label" :value="tp.value">{{ tp.label }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'left', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = { 'typeof': 'all' }">重置</a-button>
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
      showPagination="auto"
      tableLayout="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="content" slot-scope="text, record">
        <template v-if="record.typeof === 'text'">
          <ellipsis :length="60" tooltip>{{ text }}</ellipsis>
        </template>
        <template v-else>
          <a @click="handleDownlod(record)"> {{ text | getFilename }}</a>
        </template>
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
          label="名称"
          hasFeedback
        >
          <a-input
            placeholder="唯一性的名字"
            v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="类型"
          hasFeedback
        >
          <a-select
            placeholder="请选择数据类型"
            v-decorator="['typeof', {rules: [{ required: true, message: '不能为空！' }]}]"
            :options="TypeOptions"
            @change="handleTypeChange"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          label="文本"
          v-if="typeInput === 'text'"
        >
          <a-textarea
            v-decorator="['text']"
            show-count
            autosize
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          label="上传"
          v-if="typeInput === 'file' "
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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          label="备注"
        >
          <a-textarea
            placeholder="请输入，最大长度 255"
            v-decorator="['description', { initialValue: mdl.description }]"
            show-count
            :max-length="255"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
// eslint-disable-next-line no-unused-vars
import { deleteStaticResource, getStaticResource, saveStaticResource, downloadFile } from '@/api/manage'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '类型',
    dataIndex: 'typeof',
    scopedSlots: { customRender: 'typeof' }
  },
  {
    title: '内容',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '备注',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const types = [
  { 'value': 'all', 'label': '全部' },
  { 'value': 'text', 'label': '文本' },
  { 'value': 'file', 'label': '文件' }
]

const fields = ['id', 'name', 'typeof', 'text']

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
    this.types = types
    this.TypeOptions = types.slice(1)
    return {
     labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      typeInput: null,
      form: this.$form.createForm(this),
      // create model
      visible: false,
      confirmLoading: false,
      mdl: { primaryKey: 0 },
      // 上传文件
      file: null,
      fileList: [],
      // 查询参数
      queryParam: { 'typeof': 'all' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam['typeof'] === 'all') {
          delete this.queryParam['typeof']
        }
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getStaticResource(requestParameters)
          .then(res => {
            console.log('res', res)
            return res.data
          })
      }
    }
  },
  filters: {
    getFilename (path) {
      if (path) {
        return String(path).split(/\\|\//).pop()
        } else {
          return path
        }
      }
  },
  methods: {
    handleEdit (record) {
      this.mdl = { ...record }
      this.visible = true
      this.typeInput = record.typeof
      this.mdl.text = record.content
      console.log('file', this.file)

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteStaticResource(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (values.typeof === 'text') {
        values.content = values.text
        delete values['text']
      } else {
        values.content = this.file
      }

      var formData = new FormData()
      formData.append('id', values.id)
      formData.append('name', values.name)
      formData.append('typeof', values.typeof)
      if (values.content) {
        formData.append('content', values.content)
      }
      if (values.description) {
        formData.append('description', values.description)
      }

      if (!errors) {
        if (values.id > 0) {
          // 修改
          saveStaticResource(formData, values.id).then(res => {
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
          saveStaticResource(formData, values.id).then(res => {
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
      this.typeInput = null
      this.fileList = []
      this.file = null
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
      this.typeInput = null
      this.fileList = []
      this.file = null
      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleAdd () {
      this.visible = true
      this.mdl = { 'id': 0, 'description': null }
    },
    handleTypeChange (value) {
      this.typeInput = value
    },
    uploadChange (info) {
      console.log(info)
      // 只能上传一个
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
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
    handleDownlod (record) {
      const serverPath = record.content
      const filename = serverPath.toString().split(/\\|\//).pop()
      downloadFile({ 'abspath': serverPath }, filename).then(res => {
        this.confirmLoading = false
        this.$message.info('下载成功')
      }).catch(res => {
        console.log(res)
        this.$message.info('下载失败')
      })
    }
  }
}
</script>
