<template>
  <!-- <page-header-wrapper> -->
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
      <span slot="word" slot-scope="text, record">
        <a @click="handleDownloadFile(record, 'word')">
          <ellipsis :length="50" tooltip>{{ text | getFilename }}</ellipsis>
        </a>
      </span>
      <span slot="pdf" slot-scope="text, record">
        <a @click="handleDownloadFile(record, 'pdf')">
          <ellipsis :length="50" tooltip>{{ text | getFilename }}</ellipsis>
        </a>
      </span>
    </s-table>

  </a-card>
  <!-- </page-header-wrapper> -->
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'
import { getReportRecorde, downloadFile } from '@/api/manage'

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
  {
    title: 'Word',
    dataIndex: 'reportWordPath',
    scopedSlots: { customRender: 'word' }
  },
  {
    title: 'PDF',
    dataIndex: 'reportPdfPath',
    scopedSlots: { customRender: 'pdf' }
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
    this.primaryKey = 'id'
    return {
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
        return getReportRecorde(requestParameters)
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
        console.log(time)
        var date = new Date(time)
        // console.log(date)
        return formatDate(date, 'MM/dd hh:mm')
      },
    getFilename (path) {
        return path.split(/\\|\//).pop()
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
    handleDownloadFile (record, ftype) {
      this.confirmLoading = true
      const filePath = ftype === 'word' ? record.reportWordPath : record.reportPdfPath
      if (filePath === 'NA') {
        return
      }
      const filename = filePath.toString().split(/\\|\//).pop()
      downloadFile({ 'abspath': filePath }, filename).then(res => {
        this.confirmLoading = false
        this.$message.info('下载成功')
      }).catch(res => {
        console.log(res)
        this.$message.info('下载失败')
      })
      this.confirmLoading = false
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
