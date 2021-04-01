<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <!-- <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleBatch">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"><a-icon type="to-top" />置顶</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown> -->
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      row-key="id"
    >
      <span slot="group" slot-scope="text">
        {{ text.name }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">详情</a>
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
      <a-form class="role-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ID"
        >
          <a-input
            placeholder="ID"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名"
          hasFeedback
        >
          <a-input
            placeholder="英文，后端使用"
            v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-input
            placeholder="中文，前端展示使用"
            v-decorator="['description', {rules: [{ required: true, message: '请输入邮箱地址' }]}]"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoles, saveRole, deleteRole } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    this.fields = ['id', 'name', 'description']
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      mdl: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '关联组',
          dataIndex: 'group',
          scopedSlots: { customRender: 'group' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getRoles(requestParameters)
          .then(res => {
            console.log('getRoles', res)
            return res.data
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    handleAdd () {
      this.visible = true
      this.mdl = { 'id': 0 }
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true

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
            saveRole(values).then(res => {
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
            saveRole(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              this.form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('创建成功')
            }).catch(res => {
              console.log('role create error', res.response.data)
              setTimeout(() => { this.confirmLoading = false }, 5000)
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    handleDelete (record) {
      this.confirmLoading = true
      deleteRole(record).then(res => {
        this.confirmLoading = false
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
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
