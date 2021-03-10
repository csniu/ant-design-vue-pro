<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.bdmsName" placeholder=""/>
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
      <span slot="eamil" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
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
          label="全流程名称"
          hasFeedback
        >
          <a-input
            placeholder="唯一性的名字"
            v-decorator="['bdmsName', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          label="交付邮箱地址"
          hasFeedback
        >
          <a-input
            placeholder="多个使用“;”分隔"
            v-decorator="['toEmailAddress', {rules: [{ validator: this.handleemail }]}]"
          />
        </a-form-item>

        <a-form-item
          label="抄送邮箱地址"
          hasFeedback
        >
          <a-input
            placeholder="多个使用“;”分隔"
            v-decorator="['ccEmailAddress', {rules: [{ validator: this.handleemail }]}]"
          />
        </a-form-item>

        <a-form-item
          label="交付文件"
          hasFeedback
        >
          <a-select
            placeholder="多个使用“;”分隔"
            v-decorator="['fileTypes', {rules: []}]"
            :options="fileOptines"
            mode="multiple"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { getDistributor, saveDistributor, deleteDistributor } from '@/api/manage'
import { formatDate } from '../../utils/util.js'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '全流程名称',
    dataIndex: 'bdmsName'
  },
  {
    title: '交付邮箱地址',
    dataIndex: 'toEmailAddress',
    scopedSlots: { customRender: 'eamil' }
  },
  {
    title: '抄送邮箱地址',
    dataIndex: 'ccEmailAddress',
    scopedSlots: { customRender: 'eamil' }
  },
  {
    title: '交付文件类型',
    dataIndex: 'fileTypes'
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

const fields = ['id', 'bdmsName', 'toEmailAddress', 'ccEmailAddress', 'fileTypes']

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
    this.fileOptines = [
      { 'value': 'WORD', 'label': 'WORD', 'disabled': false },
      { 'value': 'PDF', 'label': 'PDF', 'disabled': false },
      { 'value': 'VCF', 'label': 'VCF', 'disabled': false },
      { 'value': 'QC', 'label': 'QC', 'disabled': false }
    ]
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
        return getDistributor(requestParameters)
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
      this.mdl.fileTypes = this.mdl.fileTypes.split(';')
      this.visible = true

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleAdd () {
      this.mdl = { 'id': 0, 'toEmailAddress': null, 'ccEmailAddress': null, 'fileTypes': [] }
      this.visible = true
      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (!errors) {
        values.fileTypes = values.fileTypes.join(';')
        if (values.fileTypes === '') {
          values.fileTypes = null
        }
        console.log(values)
        if (values.id > 0) {
          // 修改
          saveDistributor(values).then(res => {
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
          saveDistributor(values).then(res => {
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
      this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
      deleteDistributor(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleemail (rule, value, callback) {
      console.log(value)
      if (value !== null && value !== undefined) {
        const emails = String(value).split(';')
        console.log(emails)
        const re = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        for (let i = 0, len = emails.length; i < len; i++) {
          if (!re.test(emails[i]) && emails[i]) {
            callback(new Error('请输入正确邮箱：' + emails[i]))
            break
          }
          callback()
        }
      } else {
        callback()
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
