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
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      row-key="id"
    >
      <span slot="users" slot-scope="text" style="white-space: pre-line;">
        {{ text | joinUsers }}
      </span>
      <span slot="permissions" slot-scope="text" style="white-space: pre-line;">
        {{ text | joinPermissions }}
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
          label="用户组名"
          hasFeedback
        >
          <a-input
            placeholder="组名"
            v-decorator="['name', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限"
        >
          <div>
            <a-transfer
              :data-source="permissions"
              show-search
              :titles="['可选', '已有']"
              :render="item => item.name"
              :list-style="{width: '200px', height: '250px',}"
              v-decorator="['group_permissions', {valuePropName: 'targetKeys', initialValue: mdl.targetKeys }]"
            />
          </div>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getGroups, saveGroup, deleteGroup, getPermissions } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    this.fields = ['id', 'name', 'group_permissions']
    return {
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      mdl: {},
      permissions: [],
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
          title: '组名',
          dataIndex: 'name'
        },
        {
          title: '用户',
          dataIndex: 'users',
          scopedSlots: { customRender: 'users' }
        },
        {
          title: '权限',
          dataIndex: 'permissions',
          scopedSlots: { customRender: 'permissions' }
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
        return getGroups(requestParameters)
          .then(res => {
            console.log('getGroups', res)
            return res.data
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    joinUsers (users) {
      return users.map(u => u.username).join(',\n')
    },
    joinPermissions (permissions) {
      return permissions.map(u => u.name).join(',\n')
    }
  },
  created () {
    getPermissions({ })
      .then(res => {
        console.log('getPermissions', res)
        for (let i = 0, len = res.data.length; i < len; i++) {
          var p = res.data[i]
          p.key = p.id.toString()
          p.title = p.name
          p.disabled = false
          // p.description = p.name
          this.permissions.push(p)
        }
        console.log('permissions', this.permissions)
      })
      .catch((res) => {
        console.log('getPermissions error', res)
      })
  },
  methods: {
    handleAdd () {
      this.visible = true
      this.mdl = { 'id': 0, 'targetKeys': [] }
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.visible = true
      console.log('@@@@', this.mdl)
      this.mdl.targetKeys = this.mdl.permissions.map(p => p.id.toString())
      console.log('handleEdit', this.mdl)

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
          var optionPrmissons = Object.values({ ...values.group_permissions })
          values.permissions = this.permissions.filter(p => optionPrmissons.includes(p.key))
          console.log('group_permissions', values.permissions)
          console.log('values', values)

          if (values.id > 0) {
            // 修改
            saveGroup(values).then(res => {
              console.log(res)
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
            saveGroup(values).then(res => {
              console.log(res)
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              this.form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('创建成功')
            }).catch(res => {
              console.log('group create error', res.response.data)
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
      deleteGroup(record).then(res => {
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
