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
            <a-form-item label="启用">
              <a-select placeholder="全部" v-model="queryParam.isActive" :allowClear="true">
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
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
        <a @click="handleDownlod(record)"><ellipsis :length="20">下载</ellipsis></a>
      </span>
      <span slot="isActive" slot-scope="text">
        <a-tag :color="text? 'blue': 'orange'">{{ text|filterStatus }}</a-tag>
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
          label="查询方法"
          hasFeedback
        >
          <a-input
            placeholder=""
            v-decorator="['dataFunc', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item label="启用">
          <a-switch v-decorator="['isActive', {valuePropName: 'checked', initialValue: mdl.isActive }]"/>
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
            <p v-if="mdl.filePath">{{ mdl.filePath | getFilename }}</p>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { getTemplate, saveTemplate, deleteTemplate, downloadFile } from '@/api/manage'
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
    title: '查询方法',
    dataIndex: 'dataFunc'
  },
  {
    title: '启用',
    dataIndex: 'isActive',
    scopedSlots: { customRender: 'isActive' }
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

const fields = ['id', 'name', 'isActive', 'dataFunc']

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
    return {
      form: this.$form.createForm(this),
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
      },
    filterStatus (k) {
      if (k) {
        return '启用'
      } else {
        return '禁用'
      }
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
  methods: {
    handleEdit (record) {
      console.log(record)
      this.mdl = { ...record }
      this.visible = true

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleAdd () {
      this.mdl = { 'id': 0, 'isActive': false }
      this.visible = true
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (!errors) {
        console.log('values', values)

        var formData = new FormData()
        formData.append('name', values.name)
        formData.append('dataFunc', values.dataFunc)
        formData.append('isActive', JSON.stringify(values.isActive))
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
      this.confirmLoading = false
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
