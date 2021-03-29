<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="合同编码">
              <a-input v-model="queryParam.contractId" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="公司名称">
              <a-select placeholder="所有" v-model="queryParam.organization" :allowClear="true">
                <a-select-option value="M">慧算医疗</a-select-option>
                <a-select-option value="G">慧算基因</a-select-option>
                <a-select-option value="H">慧算健康</a-select-option>
                <a-select-option value="L">慧算实验室</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="付款方式">
                <a-select placeholder="所有" v-model="queryParam.payWay" :allowClear="true">
                  <a-select-option value="XS">收钱进来</a-select-option>
                  <a-select-option value="CG">付钱出去</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="申请日期">
                <a-date-picker placeholder="申请日期" v-model="queryParam.createDate"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="业务类型">
                <a-select placeholder="所有" v-model="queryParam.businessType" :allowClear="true">
                  <a-select-option value="A">科服业务</a-select-option>
                  <a-select-option value="H">健康业务</a-select-option>
                  <a-select-option value="D">肿瘤基因检测业务</a-select-option>
                  <a-select-option value="R">试剂业务</a-select-option>
                  <a-select-option value="T">软件及IT业务</a-select-option>
                  <a-select-option value="E">设备业务</a-select-option>
                  <a-select-option value="O">其他业务</a-select-option>
                  <a-select-option value="">框架协议</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-show="isShow">
              <a-form-item label="用户">
                <a-input v-model="queryParam.user" placeholder=""/>
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
      <span slot="createDate" slot-scope="text">
        {{ text | formatDate }}
      </span>
      <div slot="contractId" slot-scope="text, record">
        <template v-for="d in record.contractId">
          <ellipsis :length="30" tooltip :key="d.id">{{ d.bdmsName }};</ellipsis>
        </template>
      </div>
      <div slot="organization" slot-scope="text, record">
        {{ record.organization | formatcompanyDict }}
      </div>
      <div slot="cooperateOrganization" slot-scope="text, record">
        <template v-for="d in record.cooperateOrganization">
          <ellipsis :length="30" tooltip :key="d.id">{{ d.bdmsName }};</ellipsis>
        </template>
      </div>
      <div slot="payWay" slot-scope="text, record">
        {{ record.payWay | formatcompanyDict }}
      </div>
      <div slot="businessType" slot-scope="text, record">
        {{ record.businessType | formatbusinessDict }}
      </div>
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
          label="慧算公司"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['organization', {rules: [{ required: true, message: '不能为空！'}]}]"
            :options="organizationOptiones"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item
          label="合作公司"
          hasFeedback
        >
          <a-input
            placeholder="其他公司名称"
            v-decorator="['cooperateOrganization', {rules: [{ required: true, message: '不能为空！'}, {min: 4, message: '不能少于4个字符'}]}]"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item
          label="付款方式"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['payWay', {rules: [{ required: true, message: '不能为空！'}]}]"
            :options="payWayOptines"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item
          label="合同金额"
          hasFeedback
        >
          <a-input-number
            placeholder="合同金额"
            v-decorator="['amountContract', {rules: [{ required: false }]}]"
            @change="onBusinessSelect"
          />
        </a-form-item>

        <a-form-item
          label="业务类型"
          hasFeedback
        >
          <a-select
            placeholder="请选择"
            v-decorator="['businessType']"
            :options="businessTypeOptines"
            :allowClear="true"
          />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable, Ellipsis } from '@/components'
import { saveContract, getContract } from '@/api/manage'
import { formatDate } from '../../utils/util.js'
import user from '@/store/modules/user'

const users = [ 'mlyuan', 'Twinkle', 'wangfei' ]

function showUser () {
  if (user.state.isSuperuser) {
    return true
  }
  if (user.state.isAdmin) {
    return true
  }
  if (users.includes(user.state.name)) {
    return true
  }
  return false
}

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '合同编码',
    dataIndex: 'contractId'
  },
  {
    title: '慧算公司',
    dataIndex: 'organization',
    scopedSlots: { customRender: 'organization' }
  },
   {
    title: '合作公司',
    dataIndex: 'cooperateOrganization'
  },
  {
    title: '付款方式',
    dataIndex: 'payWay',
    scopedSlots: { customRender: 'payWay' }
  },
  {
    title: '合同金额',
    dataIndex: 'amountContract',
    scopedSlots: { customRender: 'amountContract' }
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    scopedSlots: { customRender: 'businessType' }
  },
   {
    title: '申请日期',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  }
]

const businessDict = {
  'A': '科服业务',
  'H': '健康业务',
  'D': '肿瘤基因检测业务',
  'R': '试剂业务',
  'T': '软件及IT业务',
  'E': '设备业务',
  'O': '其他业务',
  '': '框架协议'
}

const companyDict = {
  'M': '慧算医疗',
  'G': '慧算基因',
  'H': '慧算健康',
  'L': '慧算实验室',
  'XS': '收钱进来',
  'CG': '付钱出去'
}

const fields = ['contractId', 'organization', 'cooperateOrganization', 'payWay', 'amountContract', 'businessType', 'createDate']

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    if (showUser()) {
      this.columns.push({ title: '用户', dataIndex: 'user' })
    }
    this.fields = fields
    this.primaryKey = 'id'
    this.isShow = showUser()
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
    this.organizationOptiones = [
      { 'value': 'M', 'label': '慧算医疗', 'disabled': false },
      { 'value': 'G', 'label': '慧算基因', 'disabled': false },
      { 'value': 'H', 'label': '慧算健康', 'disabled': false },
      { 'value': 'L', 'label': '慧算实验室', 'disabled': false }
    ]
    this.payWayOptines = [
      { 'value': 'XS', 'label': '收钱进来', 'disabled': false },
      { 'value': 'CG', 'label': '付钱出去', 'disabled': false }
    ]

    return {
      businessTypeOptines: [ { 'value': '', 'label': '框架协议', 'disabled': false } ],
      businessTypeDefaultOptines: [
      { 'value': 'A', 'label': '科服业务', 'disabled': false },
      { 'value': 'H', 'label': '健康业务', 'disabled': false },
      { 'value': 'D', 'label': '肿瘤基因检测业务', 'disabled': false },
      { 'value': 'R', 'label': '试剂业务', 'disabled': false },
      { 'value': 'T', 'label': '软件及IT业务', 'disabled': false },
      { 'value': 'E', 'label': '设备业务', 'disabled': false },
      { 'value': 'O', 'label': '其他业务', 'disabled': false }
    ],
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
        if (!this.isShow) {
          this.queryParam = { 'user': user.state.name }
        }
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        if (typeof requestParameters.createDate !== 'undefined') {
          requestParameters.createDate = requestParameters.createDate.format('YYYY-MM-DD')
        }
        console.log('loadData request parameters:', requestParameters)
        return getContract(requestParameters)
          .then(res => {
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

    formatbusinessDict (value) {
      const business = businessDict[value]
      if (typeof business === 'undefined') {
        return value
      }
      return business
      },

    formatcompanyDict (value) {
      const company = companyDict[value]
      if (typeof company === 'undefined') {
        return value
      }
      return company
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
    onBusinessSelect (record) {
    if (!record) {
      this.businessTypeOptines = [{ 'value': '', 'label': '框架协议', 'disabled': false }]
    } else {
      this.businessTypeOptines = this.businessTypeDefaultOptines
    }
    },
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
      this.mdl = { 'id': 0, 'organization': null, 'cooperateOrganization': null, 'payWay': null, 'amountContract': 0, 'businessType': null, 'createDate': null }
      this.visible = true
      console.log(this.visible)
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
      if (!errors) {
          // 新增
          saveContract(values).then(res => {
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
      })
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleDelete (record) {
      console.log('handleDelete')
      this.confirmLoading = true
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
