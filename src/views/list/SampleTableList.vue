<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="编号">
                <a-input v-model="queryParam.sample_id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
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
        <a-button type="primary" icon="plus" @click="handleAdd">从全流程导入</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleBatch">
            <a-menu-item key="1"><a-icon type="delete" />同步全流程</a-menu-item>
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
        <span slot="diagnosis" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="distributor" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="comment" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <div slot="projects" slot-scope="text, record">
          <template v-for="p in record.detect_projects">
            <ellipsis :length="10" tooltip :key="p.name_ch"> {{ p.name_ch }}</ellipsis>
          </template>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleSync(record)">同步</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        title="导入"
        :primaryKey="primaryKey"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :fields="fields"
        @cancel="handleCancel"
        @ok="handleOk">
        <div slot="fields">
          <a-form-item label="样本编号">
            <a-input v-decorator="['sample_id', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]" />
          </a-form-item>
          <a-form-item label="其他" v-if="!sync" >
            <a-textarea v-decorator="['comment', {rules: [{ whitespace:true }]}]" />
          </a-form-item>
        </div>
      </create-form>
      <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getSamples, saveSample, syncSample } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import { formatDate } from '../../utils/util.js'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '样本编号',
    dataIndex: 'sample_id'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '病理诊断',
    dataIndex: 'clinical_diagnosis',
    scopedSlots: { customRender: 'diagnosis' }
  },
  {
    title: '经销商',
    dataIndex: 'distributor',
    scopedSlots: { customRender: 'distributor' }
  },
  {
    title: '芯片号',
    dataIndex: 'chipid'
  },
  {
    title: '检测项目',
    dataIndex: 'detect_projects',
    scopedSlots: { customRender: 'projects' }
  },
  {
    title: '其他',
    dataIndex: 'comment',
    scopedSlots: { customRender: 'comment' }
  },
  {
    title: '修改时间',
    dataIndex: 'updata_date',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const fields = ['id', 'sample_id', 'comment']

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    this.fields = fields
    this.primaryKey = 'id'
    return {
      sync: false,
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
        return getSamples(requestParameters)
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
      this.visible = true
      this.sync = false
      this.mdl = { ...record }
    },
    handleAdd () {
      this.mdl = { 'id': 0 }
      this.visible = true
      this.sync = true
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改
            saveSample(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            })
          } else {
            // 新增
            syncSample(values.sample_id).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('同步成功')
            }).catch(res => {
              this.visible = false
              this.confirmLoading = false
              this.$message.error('同步失败：' + res.response.data.detail)
            })
          }
        } else {
          this.visible = false
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSync (record) {
      this.confirmLoading = true
      syncSample(record.sample_id).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('同步成功')
      }).catch(res => {
        this.$message.error('同步失败：' + res.response.data.detail)
      })
      this.confirmLoading = false
    },
    // 批量操作
    handleBatch ({ key }) {
      this.confirmLoading = true
      for (var index = 0; index < this.selectedRows.length; index++) {
        // 批量删除
        var record = this.selectedRows[index]

        // 批量置顶
        if (key === '1') {
          syncSample(record.sample_id).then((recordId) => {
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
    }
  }
}
</script>
