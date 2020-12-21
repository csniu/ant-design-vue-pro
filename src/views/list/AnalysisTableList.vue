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
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.patientName" placeholder=""/>
              </a-form-item>
            </a-col> -->
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
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
        <span slot="status" slot-scope="text" style="white-space: pre-line;">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleAddQueue(record)" v-show="record.order === null">添加监控</a>
            <a @click="handledeleteQueue(record)" v-show="record.order !== null">取消监控</a>
            <a-divider type="vertical" v-show="record.order !== null"/>
            <a @click="handleReclock(record)" v-show="record.order !== null">重新计时</a>
          </template>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getAnalysis, saveAnalysis } from '@/api/manage'

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
    dataIndex: 'sampleId'
  },
  // {
  //   title: 'Pipeline',
  //   dataIndex: 'analysisPipeline'
  // },
  // {
  //   title: 'Panel',
  //   dataIndex: 'panelName'
  // },
  // {
  //   title: '原始数据路径',
  //   dataIndex: 'rawPath',
  //   scopedSlots: { customRender: 'time' }
  // },
  // {
  //   title: '分析结果路径',
  //   dataIndex: 'resultPath',
  //   scopedSlots: { customRender: 'status' }
  // },
  // {
  //   title: '数据分析状态',
  //   dataIndex: 'analysisStatus',
  //   scopedSlots: { customRender: 'action' }
  // },
  {
    title: 'QC',
    dataIndex: 'qcStatus'
  },
  // {
  //   title: '分析步骤',
  //   dataIndex: 'ongoingProcess',
  //   scopedSlots: { customRender: 'action' }
  // },
  {
    title: '报告状态',
    dataIndex: 'reportStatus',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'time' }
  },
  // {
  //   title: '开始时间',
  //   dataIndex: 'startDate',
  //   scopedSlots: { customRender: 'action' }
  // },
  // {
  //   title: '结束时间',
  //   dataIndex: 'endDate',
  //   scopedSlots: { customRender: 'action' }
  // }
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

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
    return {
      // create model
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getAnalysis(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      if (type === null) {
        type = '待更新'
      }
      if (type === 'Success') {
        return '已完成'
      } else {
        return type.replace('<br>', '\n')
      }
    },
    statusTypeFilter (type) {
      if (type === 'Success') {
        return 'default'
      } else {
        return 'warning'
      }
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
    handleAddQueue (record) {
      this.confirmLoading = true
      saveAnalysis({ 'id': record.id, 'order': -new Date() / 1000 }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('添加成功')
      })
    },
    handledeleteQueue (record) {
      this.confirmLoading = true
      saveAnalysis({ 'id': record.id, 'order': null }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('取消成功')
      })
    },
    handleReclock (record) {
      this.confirmLoading = true
      saveAnalysis({ 'id': record.id, 'cycleNumber': 1 }).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('归零成功')
      })
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
