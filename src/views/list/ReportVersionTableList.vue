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
            <a-form-item label="全流程名称">
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
          label="全流程名称"
          hasFeedback
        >
          <a-input
            placeholder="全流程中报告版本中文名称"
            v-decorator="['bdmsName', {rules: []}]"
          />
        </a-form-item>

        <a-form-item
          label="全流程编号"
          hasFeedback
        >
          <a-input
            placeholder="全流程中报告版本英文名称"
            v-decorator="['bdmsNameEn', {rules: [{ required: true, message: '不能为空！' }]}]"
          />
        </a-form-item>

        <a-form-item
          label="PANEL"
          hasFeedback
        >
          <a-input
            placeholder="检测 panel"
            v-decorator="['panel', {rules: [{ required: true, message: '不能为空！' }]}]"
          />
        </a-form-item>

        <a-form-item
          label="基因列表"
          hasFeedback
        >
          <a-input
            placeholder="基因列表名"
            v-decorator="['genelist', {rules: [{ required: true, message: '不能为空！' }]}]"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { getReportVersion, saveReportVersion, deleteReportVersion } from '@/api/manage'
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
    title: '全流程名称',
    dataIndex: 'bdmsName'
  },
  {
    title: '全流程编号',
    dataIndex: 'bdmsNameEn'
  },
  {
    title: 'PANEL',
    dataIndex: 'panel'
  },
  {
    title: '基因列表',
    dataIndex: 'genelist'
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

const fields = ['id', 'name', 'bdmsName', 'bdmsNameEn', 'panel', 'genelist']

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
        return getReportVersion(requestParameters)
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
        console.log(values)
        if (values.id > 0) {
          // 修改
          saveReportVersion(values).then(res => {
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
          saveReportVersion(values).then(res => {
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
      deleteReportVersion(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
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
