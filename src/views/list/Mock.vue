<template>
  <page-header-wrapper>
    <a-card :bordered="false">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="样本编号">
                <a-input v-model="queryParam.sample_id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="患者编号">
                <a-input v-model="queryParam.patient_id" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="经销商">
                  <a-input v-model="queryParam.distributor" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="样本类型">
                  <a-select placeholder="全部" v-model="queryParam.sample_type">
                    <a-select-option value="组织">组织</a-select-option>
                    <a-select-option value="血液">血液</a-select-option>
                    <a-select-option value="胸水">胸水</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="肿瘤类型">
                  <a-select
                    show-search
                    :filter-option="true"
                    placeholder="全部"
                    v-model="queryParam.tumor_type"
                    :options="cancerOptines">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="报告版本">
                  <a-select
                    show-search
                    :filter-option="true"
                    placeholder="全部"
                    v-model="queryParam.reportVersion"
                    :options="reportOptines">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="靶向">
                  <a-input v-model="queryParam.mutation" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="化疗">
                  <a-select placeholder="全部" v-model="queryParam.chem" :options="chemPanels">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="病毒">
                  <a-input v-model="queryParam.distributor"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="Hla">
                  <a-input v-model="queryParam.hla"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="新抗原">
                  <a-input v-model="queryParam.neo"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="Tmb">
                  <a-select placeholder="全部" v-model="queryParam.tmb">
                    <a-select-option value="high">高</a-select-option>
                    <a-select-option value="low">低</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="Hrd">
                  <a-select placeholder="全部" v-model="queryParam.hrd">
                    <a-select-option value="high">高</a-select-option>
                    <a-select-option value="low">低</a-select-option>
                  </a-select>
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
        <a-button type="primary" icon="plus" @click="toForm({}, 'add')">添加</a-button>
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
        <span slot="time" slot-scope="text">
          {{ text | formatDate }}
        </span>

        <span slot="mutation" slot-scope="text, record">
          <template v-for="m in record.mutation">
            <p :key="m.id" style="margin-bottom: 2px">{{ m.title }}</p>
          </template>
        </span>

        <span slot="virus" slot-scope="text, record">
          <template v-for="m in record.virus">
            <p :key="m.id" style="margin-bottom: 2px">{{ m.title }}</p>
          </template>
        </span>

        <span slot="hla" slot-scope="text, record">
          <template v-for="m in record.hla">
            <p :key="m.id" style="margin-bottom: 2px">{{ m.title }}</p>
          </template>
        </span>

        <span slot="msi" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text.result }}</ellipsis>
        </span>

        <span slot="tmb" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text.result }}</ellipsis>
        </span>

        <span slot="hrd" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text.total_score }}</ellipsis>
        </span>

        <span slot="neo" slot-scope="text, record">
          <template v-for="m in record.neo">
            <p :key="m.id" style="margin-bottom: 2px">{{ m.title }}</p>
          </template>
        </span>

        <span slot="sample_path" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="toForm(record, 'detail')">详情</a>
            <a-divider type="vertical" />
            <a @click="toForm(record, 'copy')">复制创建</a>
          </template>
        </span>
      </s-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getMockSample, getChemPanel, getCancer, getMockReport } from '@/api/manage'
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
    title: '靶向变异',
    dataIndex: 'mutation',
    scopedSlots: { customRender: 'mutation' }
  },
  {
    title: '化疗',
    dataIndex: 'chem',
    scopedSlots: { customRender: 'chem' }
  },
  {
    title: '病毒',
    dataIndex: 'virus',
    scopedSlots: { customRender: 'virus' }
  },
  {
    title: 'HLA分型',
    dataIndex: 'hla',
    scopedSlots: { customRender: 'hla' }
  },
  {
    title: 'MSI',
    dataIndex: 'msi',
    scopedSlots: { customRender: 'msi' }
  },
  {
    title: 'TMB',
    dataIndex: 'tmb',
    scopedSlots: { customRender: 'tmb' }
  },
  {
    title: '新抗原',
    dataIndex: 'neo',
    scopedSlots: { customRender: 'neo' }
  },
  {
    title: 'Hrd',
    dataIndex: 'hrd',
    scopedSlots: { customRender: 'hrd' }
  },
  {
    title: '路径',
    dataIndex: 'sample_path',
    scopedSlots: { customRender: 'sample_path' }
  },
  {
    title: '修改时间',
    dataIndex: 'updateDate',
    scopedSlots: { customRender: 'time' }
  },
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
    Ellipsis
  },
  data () {
    this.columns = columns
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},

      chemPanels: [],
      cancerOptines: [],
      reportOptines: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        if (requestParameters.hrd === 'low') {
          requestParameters['hrd_lt'] = 36
        }
        if (requestParameters.hrd === 'high') {
          requestParameters['hrd_gte'] = 36
        }

        return getMockSample(requestParameters)
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
    toForm (record, action) {
      // query传参数，相当于拼接在url后面，这种方式不会丢失参数，但是数据量大的话（比如传递对象），url就会变得太长而且不隐密。
      // params传参数，不在url中显示，但是刷新页面的时候无法避免丢失。
      if (action === 'add') {
        this.$router.push({ name: 'Mock', params: { action: action } })
      } else {
        record.sampleInfo.sample_id = record.sample_id
        record.virus = record.virus.map(v => v.title)
        record.hla = record.hla.map(v => v.title)
        record.neo = record.neo.map(v => v.title)
        record.target = record.mutation.filter(m => ['snv', 'cnv', 'fusion'].includes(m.classify)).map(v => v.title)
        record.risk = record.mutation.filter(m => m.classify === 'risk').map(v => v.title)
        record.mmr = record.mutation.filter(m => m.classify === 'mmr').map(v => v.title)
        record.hrr = record.mutation.filter(m => m.classify === 'hrr').map(v => v.title)

        if (action === 'copy') {
        this.$router.push({ name: 'Mock', params: { mdl: record, action: action } })
        } else if (action === 'detail') {
        this.$router.push({ name: 'Mock', params: { mdl: record, action: action } })
        }
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  created () {
    getChemPanel()
      .then(res => {
        console.log('getChemPanel', res)
        for (let i = 0, len = res.data.length; i < len; i++) {
          var panel = res.data[i]
          this.chemPanels.push({ 'key': panel, 'title': panel, 'disabled': false })
        }
        console.log('chemPanels', this.virus)
      })
      .catch((res) => {
        console.log('getChemPanel error', res)
      })

    getCancer({ 'pageSize': 1000 })
      .then(res => {
        console.log('getCancer', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.cancerOptines.push({ 'key': tmp.bdms, 'title': tmp.bdms, 'disabled': false })
        }
        console.log('getCancer', this.cancers)
      })
      .catch((res) => {
        console.log('getCancer error', res)
      })

    getMockReport({ 'pageSize': 1000 })
      .then(res => {
        console.log('getMockReport', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.reportOptines.push({ 'key': tmp.en, 'title': tmp.en, 'disabled': false })
        }
        console.log('getMockReport', this.reportOptines)
      })
      .catch((res) => {
        console.log('getMockReport error', res)
      })
  }
}
</script>
