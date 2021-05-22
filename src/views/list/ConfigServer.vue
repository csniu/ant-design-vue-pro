<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="标准列表">

      <div slot="extra">
        <a-input-search v-model="queryParam.name" style="margin-left: 16px; width: 272px;" @search="loadData"/>
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="handleAdd">添加</a-button>
      </div>

      <a-list size="large" :pagination="true" itemLayout="vertical">
        <a-list-item :key="index" v-for="(item, index) in data">

          <a-list-item-meta>
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" @click="handleEdit(item)"/>
            <a slot="title" @click="recordShow(item.id)">{{ item.name }}</a>
            <p slot="description" @click="recordShow(item.id)">{{ item.comment }}</p>
          </a-list-item-meta>

          &#32;
          <a-table
            bordered
            :data-source="item.values"
            :columns="columns"
            v-show="showRecord == item.id"
            :pagination="false"
            rowKey="id">
            <template slot="footer" class="ant-table-title-row">
              <div class="operate">
                <a-button type="dashed" style="width: 100%" icon="plus" @click="handleAddRecord(item.id)">添加配置项</a-button>
              </div>
            </template>

            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>

            <template
              v-for="col in ['keyword', 'value', 'comment']"
              :slot="col"
              slot-scope="text, record"
            >
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, item.id, record.id, col)"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>

            <template slot="operation" slot-scope="text, record">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(item.id, record.id)" style="margin-right: 5px">保存</a>
                  <a-popconfirm title="确定取消?" @confirm="() => cancel(item.id, record.id)">
                    <a>取消</a>
                  </a-popconfirm>

                </span>
                <span v-else>
                  <a :disabled="editingKey !== ''" style="margin-right: 5px" @click="() => edit(item.id, record.id)">编辑</a>
                  <a-popconfirm title="确定删除?" @confirm="() => onDelete(item.id, record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </a-list-item>
      </a-list>

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

          <a-form-item v-show="false" label="ID">
            <a-input
              placeholder="ID"
              disabled="disabled"
              v-decorator="['id']"
            />
          </a-form-item>

          <a-form-item label="名称" hasFeedback>
            <a-input
              :disabled="!creating"
              v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
            />
          </a-form-item>

          <a-form-item label="备注" hasFeedback>
            <a-textarea
              :autoSize="true"
              v-decorator="['comment', {rules: [{ required: false, whitespace:true }]}]"
            />
          </a-form-item>

        </a-form>
      </a-modal>

    </a-card>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import Info from './components/Info'
import { deleteConfigValue, getConfigServer, saveConfigServer, saveConfigValue } from '@/api/manage'

const fields = ['id', 'name', 'comment']

const columns = [
  {
    title: '#',
    width: '5%',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: 'key',
    dataIndex: 'keyword',
    width: '20%',
    scopedSlots: { customRender: 'keyword' }
  },
  {
    title: 'value',
    dataIndex: 'value',
    width: '300',
    scopedSlots: { customRender: 'value' }
  },
  {
    title: '备注',
    dataIndex: 'comment',
    width: '300',
    scopedSlots: { customRender: 'comment' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'ConfigServer',
  components: {
    Info
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    this.fields = fields
    this.primaryKey = 'id'
    return {
      form: this.$form.createForm(this),
      // create model
      visible: false,
      confirmLoading: false,
      creating: false,
      columns: columns,
      showRecord: null,

      editingKey: '',

      mdl: { primaryKey: 0 },
      queryParam: {},
      status: 'all',
      data: [],
      cacheData: []
    }
  },
  methods: {
    loadData () {
        const requestParameters = Object.assign({}, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getConfigServer(requestParameters)
          .then(res => {
            console.log(res)
            this.data = res.data.results
            this.cacheData = res.data.results
          }).catch(res => {
            this.$message.error('数据查询失败')
            this.data = []
            this.cacheData = []
          })
    },
    handleEdit (record) {
      console.log(record)
      this.mdl = { ...record }
      this.mdl.fileTypes = this.mdl.fileTypes ? String(this.mdl.fileTypes).split(';') : []
      this.visible = true

      this.$nextTick(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(this.mdl, this.fields))
      })
    },
    handleAdd () {
      this.mdl = { 'id': 0 }
      this.creating = true
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
        console.log('saveConfigServer', values)
          // 修改
        saveConfigServer(values).then(res => {
          this.visible = false
          this.confirmLoading = false
          // 重置表单数据
          this.form.resetFields()
          // 刷新表格
          this.loadData()

          this.$message.info('成功')
        })
      }
      this.confirmLoading = false
      this.creating = false
      })
    },
    handleCancel () {
      this.visible = false
      this.creating = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleChange (value, recordId, valueId, column) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0].values
      const target = record.filter(item => valueId === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (recordId, valueId) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0].values
      const target = record.filter(item => valueId === item.id)[0]
      this.editingKey = valueId
      console.log('edit', target)
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save (recordId, valueId) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0].values
      const target = record.filter(item => valueId === item.id)[0]

      const newCacheData = [...this.cacheData]
      const newCacherecord = newCacheData.filter(item => recordId === item.id)[0].values
      const targetCache = newCacherecord.filter(item => valueId === item.id)[0]

      if (target.keyword.trim() === '') {
        this.$message.error('key 不能为空')
      } else {
        if (target && targetCache) {
          target.keyword = target.keyword.trim()
          saveConfigValue(target).then(res => {
            delete target.editable
            target.id = res.data.id
            target.keyword = res.data.keyword
            target.value = res.data.value
            target.comment = res.data.comment
            this.data = newData
            Object.assign(targetCache, target)
            this.cacheData = newCacheData
            this.editingKey = ''
          }).catch(res => {
            this.$message.error('保存失败')
            console.log(res)
          })
        }
      }
    },
    cancel (recordId, valueId) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0]
      const target = record.values.filter(item => valueId === item.id && item.id !== 0)[0]

      const newCacheData = [...this.cacheData]
      const newCacherecord = newCacheData.filter(item => recordId === item.id)[0].values
      const targetCache = newCacherecord.filter(item => valueId === item.id && item.id !== 0)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, targetCache)
        delete target.editable
        this.data = newData
      } else {
        record.values = record.values.filter(item => valueId !== item.id)
        this.data = newData
        this.cacheData = newData
      }
    },
    recordShow (recordId) {
      if (this.showRecord === recordId) {
        this.showRecord = null
      } else {
        this.showRecord = recordId
      }
    },
    onDelete (recordId, valueId) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0]
      record.values = record.values.filter(item => item.id !== valueId)

      if (valueId === 0) {
        this.data = newData
        this.cacheData = newData
      } else {
      deleteConfigValue({ 'id': valueId }).then(res => {
        this.data = newData
        this.cacheData = newData
      }).catch(res => {
        this.$message.error('保存失败')
        console.log(res)
      })
      }
    },
    handleAddRecord (recordId) {
      const newData = [...this.data]
      const record = newData.filter(item => recordId === item.id)[0]
      console.log(record.values.filter(item => item.id === 0))
      if (record.values.filter(item => item.id === 0).length !== 0) {
        this.$message.warning('请先保存')
        return
      }

      const newRow = {
        id: 0,
        namespace: recordId,
        keyword: '',
        value: '',
        comment: '',
        editable: true
      }
      record.values = [...record.values, newRow]
      this.editingKey = newRow.id
    }
  },
  created () {
    getConfigServer({ })
      .then(res => {
        console.log('getConfigServer', res)
        this.data = res.data.results
        this.cacheData = res.data.results
      })
      .catch((res) => {
        console.log('getConfigServer error', res)
        this.$message.error('数据查询失败')
      })
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 0px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}

.editable-row-operations a {
  margin-right: 8px;
}

.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}

//调整body行属性
/deep/ .ant-table-tbody > tr > td {
  padding: 5px;
  overflow-wrap: break-word;
}
//调整head行属性
/deep/ .ant-table-thead > tr > th {
  padding: 10px;
  overflow-wrap: break-word;
}

/deep/ .ant-table-footer {
    position: relative;
    padding: 5px 5px;
    color: rgba(0, 0, 0, 0.85);
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 2px 2px;
}

</style>
