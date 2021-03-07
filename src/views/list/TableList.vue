<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="编号">
                <a-input v-model="queryParam.sampleId" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <!-- <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button> -->
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleBatch">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <a-menu-item key="2"><a-icon type="to-top" />置顶</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
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
        <span slot="savePath" slot-scope="text">
          <ellipsis :length="40" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">详情</a>
            <span v-show="record.doing!==true">
              <a-divider type="vertical" />
              <a @click="handleDelete(record)">删除</a>
              <a-divider type="vertical" v-show="record.order === null"/>
              <a @click="handleAddQueue(record)" v-show="record.order === null">下载</a>
              <a-divider type="vertical" v-show="record.order !== null"/>
              <a @click="handledeleteQueue(record)" v-show="record.order !== null">取消下载</a>
              <a-divider type="vertical" v-show="record.order !== null"/>
              <a @click="handleTopQueue(record)" v-show="record.order !== null">置顶</a>
            </span>
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
          <a-form-item
            label="ID"
          >
            <a-input
              placeholder="ID"
              disabled="disabled"
              v-decorator="['id']"
            />
          </a-form-item>
          <a-form-item label="任务状态">
            <a-input disabled v-decorator="['status', {rules: [{ required: false, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="原始数据保存路径">
            <a-textarea v-decorator="['savePath', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="结果数据保存路径">
            <a-textarea v-decorator="['resultPath', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="R1">
            <a-textarea disabled v-decorator="['r1File', {rules: [{ required: false, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="R1-MD5">
            <a-input disabled v-decorator="['r1Md5', {rules: [{ required: false, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="R2">
            <a-textarea disabled v-decorator="['r2File', {rules: [{ required: false, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="R2-MD5">
            <a-input disabled v-decorator="['r2Md5', {rules: [{ required: false, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="对照">
            <a-switch v-decorator="['contrast', {valuePropName: 'checked', initialValue: mdl.contrast }]"/>
          </a-form-item>
          <a-form-item label="合并">
            <a-switch v-decorator="['merge', {valuePropName: 'checked', initialValue: mdl.contrast }]"/>
          </a-form-item>
        </a-form>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getDownloadTask, saveTask, deleteTask } from '@/api/manage'

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
    title: '保存地址',
    dataIndex: 'savePath',
    scopedSlots: { customRender: 'savePath' }
  },
  {
    title: '更新时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  'Standby': {
    status: 'warning',
    text: '排队中'
  },
  'Underway': {
    status: 'processing',
    text: '正在下载'
  },
  'DownloadSuccess': {
    status: 'success',
    text: '下载成功'
  },
  'DownloadError': {
    status: 'error',
    text: '下载失败'
  },
  'UnknownMD5': {
    status: 'error',
    text: 'MD5未知'
  },
  'BadFile': {
    status: 'error',
    text: '文件损坏'
  },
  'FolderExistsError': {
    status: 'error',
    text: '文件夹已存在'
  },
  'Success': {
    status: 'default',
    text: '完成'
  }
}

const fields = ['id', 'status', 'savePath', 'resultPath', 'r1File', 'r1Md5', 'r2File', 'r2Md5', 'contrast', 'merge']

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
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
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
        return getDownloadTask(requestParameters)
          .then(res => {
            var records = []
            for (var i = 0; i < res.data.results.length; i++) {
              var item = res.data.results[i]
              // R1 R2
              for (var ii = 0; ii < item.files.length; ii++) {
                var fileInfo = item.files[ii]
                if (fileInfo.rename.toString().includes('R1')) {
                  item.r1File = fileInfo.remotePath
                  item.r1Md5 = fileInfo.md5
                } else {
                  if (fileInfo.rename.toString().includes('R2')) {
                    item.r2File = fileInfo.remotePath
                    item.r2Md5 = fileInfo.md5
                  }
                }
              }

              records.push(item)
            }
            res.data.results = records
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    formatDate (time) {
        var date = new Date(time)
        return formatDate(date, 'MM/dd hh:mm')
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
      this.visible = true
      this.mdl = { ...record }

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(record, this.fields))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改
            saveTask(values).then(res => {
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
            saveTask(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              this.form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleDelete (record) {
      this.confirmLoading = true
      deleteTask(record.id).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleAddQueue (record) {
      this.confirmLoading = true
      saveTask({ 'id': record.id, 'order': -new Date() / 1000 }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('添加任务成功')
      })
    },
    handledeleteQueue (record) {
      this.confirmLoading = true
      saveTask({ 'id': record.id, 'order': null }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('取消成功')
      })
    },
    handleTopQueue (record) {
      this.confirmLoading = true
      saveTask({ 'id': record.id, 'order': new Date() / 1000 }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('置顶成功')
      })
    },
    // 批量操作
    handleBatch ({ key }) {
      this.confirmLoading = true
      for (var index = 0; index < this.selectedRowKeys.length; index++) {
        // 批量删除
        var recordId = this.selectedRowKeys[index]
        console.log(typeof (key), recordId)
        if (key === '1') {
          deleteTask(recordId).then((recordId) => {
            this.$message.info('删除成功')
          })
        }

        // 批量置顶
        if (key === '2') {
          saveTask({ 'id': recordId, 'order': new Date() / 1000 }).then((recordId) => {
            this.$message.info('置顶成功')
          })
        }
      }
      this.confirmLoading = false
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
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
