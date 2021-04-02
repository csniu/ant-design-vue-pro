/* eslint-disable vue/valid-v-model */
<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0" @change="handleChange">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="2">禁用</a-select-option>value
              </a-select>
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
      row-key="id"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="status" slot-scope="text">
        <a-tag :color="text | statusFilterColor">{{ text | statusFilter }}</a-tag>
      </span>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <!-- <span slot="role" slot-scope="text" tyle="white-space: pre-line">
        {{ text | joinRoles }}
      </span> -->
      <div slot="role" slot-scope="text" style="white-space: pre-line;">
        {{ text | joinRoles }}
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
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
          label="用户名"
          hasFeedback
        >
          <a-input
            placeholder="起一个名字"
            :disabled="!isCreate"
            v-decorator="['username', {rules: [{ required: true, message: '不能为空！', whitespace:true }]}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邮箱"
          hasFeedback
        >
          <a-input
            placeholder="公司邮箱: example@smartquerier.com"
            :disabled="!isCreate"
            v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }, { pattern: '.*?@smartquerier.com', message: '请输入公司邮箱地址' }]}]"
          />
        </a-form-item>

        <a-popover
          placement="rightTop"
          :trigger="['focus']"
          :getPopupContainer="(trigger) => trigger.parentElement"
          v-model="state.passwordLevelChecked">
          <template slot="content">
            <div :style="{ width: '240px' }" >
              <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
              <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
              <div style="margin-top: 10px;">
                <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
              </div>
            </div>
          </template>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="密码"
            hasFeedback
            v-if="isCreate"
          >
            <a-input-password
              size="large"
              @click="handlePasswordInputClick"
              placeholder="至少6位密码，区分大小写"
              v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
            ></a-input-password>
          </a-form-item>
        </a-popover>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码确认"
          hasFeedback
          v-if="isCreate"
        >
          <a-input-password
            size="large"
            placeholder="再输入一次"
            v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input-password>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="启用"
        >
          <a-switch v-decorator="['is_active', {valuePropName: 'checked', initialValue: mdl.is_active }]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="超级用户"
          v-if="isSuperuser"
        >
          <a-switch v-decorator="['is_superuser', {valuePropName: 'checked', initialValue: mdl.is_superuser }]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="管理员"
          v-if="isSuperuser"
        >
          <a-switch v-decorator="['is_admin', {valuePropName: 'checked', initialValue: mdl.is_admin }]"/>
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可见页面"
        >
          <a-checkbox-group :options="mdl.roleOptions" v-decorator="['optionRoles', {initialValue: mdl.roleValue}]"/>
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属用户组"
          v-if="isSuperuser"
        >
          <a-checkbox-group :options="mdl.groupOptions" v-decorator="['groupOptions', {initialValue: mdl.groupValue}]"/>
        </a-form-item>

        <a-form-item
          class="role-group"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限"
          v-if="isSuperuser"
        >
          <div>
            <a-transfer
              :data-source="permissions"
              show-search
              :titles="['可选', '已有']"
              :render="item => item.name"
              :list-style="{width: '200px', height: '250px',}"
              v-decorator="['user_permissions', {valuePropName: 'targetKeys', initialValue: mdl.targetKeys }]"
            />
          </div>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getUsers, getRoles, saveUser, getGroups, getPermissions } from '@/api/manage'
import user from '@/store/modules/user'

const isSuperuser = user.state.isSuperuser
console.log('isSuperuser', isSuperuser)

const STATUS = {
  true: { 'text': '启用', 'color': 'blue' },
  false: { 'text': '禁用', 'color': 'orange' }
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '状态',
    dataIndex: 'is_active',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'date_joined',
    scopedSlots: { customRender: 'createTime' },
    sorter: true
  },
  {
    title: '可见页面',
    width: '150px',
    dataIndex: 'roles',
    scopedSlots: { customRender: 'role' }
  },
  {
    title: '操作',
    width: '150px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    this.fields = ['id', 'username', 'email', 'is_active', 'optionRoles']
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      mdl: { 'id': 0 },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      roles: [],
      roleOptions: [],
      groups: [],
      groupOptions: [],
      permissions: [],
      confirmLoading: false,
      isCreate: false,
      isSuperuser: isSuperuser,

      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getUsers(requestParameters)
          .then(res => {
            console.log('getUsers', res)
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (key) {
      return STATUS[key].text
    },
    statusFilterColor (key) {
      return STATUS[key].color
    },
    joinRoles (roles) {
      return roles.map(r => r.description).join(',\n')
    }
  },
  created () {
    getRoles({ })
      .then(res => {
        this.roles = res.data.results
        // 所有可选角色
        this.roleOptions = this.roles.map(r => r.description)
        console.log('roles', this.roles)
        console.log('roleOptions', this.roleOptions)
      })
      .catch((res) => {
        console.log(res)
      })

    if (isSuperuser) {
      getGroups({ })
        .then(res => {
          this.groups = res.data.results
          // 所有可选角色
          this.groupOptions = this.groups.map(g => g.name)
          console.log('groups', this.groups)
          console.log('groupOptions', this.groupOptions)
        })
        .catch((res) => {
          console.log('getRoles error', res)
        })

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
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handleAdd () {
      this.visible = true
      this.isCreate = true
      this.mdl = {
        'id': 0,
        'roleOptions': this.roleOptions,
        'groupOptions': this.groupOptions,
        'targetKeys': []
        }
    },
    handleChange (value) {
      if (value === '1') {
        this.queryParam.is_active = true
      }

      if (value === '2') {
        this.queryParam.is_active = false
      }
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
      // 已拥有的角色
      this.mdl.roleValue = this.mdl.roles.map(r => r.description)
      this.mdl.roleOptions = this.roleOptions

      this.mdl.groupValue = this.mdl.groups.map(g => g.name)
      this.mdl.groupOptions = this.groupOptions

      this.mdl.targetKeys = this.mdl.user_permissions.map(p => p.id.toString())
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
        console.log(errors, values)

        var optionRoles = { ...values.optionRoles }
        optionRoles = Object.values(optionRoles)
        values.roles = this.roles.filter(r => optionRoles.includes(r.description))
        console.log('optionRoles', values.optionRoles)

        var optionPrmissons = Object.values({ ...values.user_permissions })
        values.user_permissions = this.permissions.filter(p => optionPrmissons.includes(p.key))
        console.log('user_permissions', values.user_permissions)

        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改
            saveUser(values).then(res => {
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
            saveUser(values).then(res => {
              this.visible = false
              this.isCreate = false
              this.state.passwordLevelChecked = false
              this.confirmLoading = false
              // 重置表单数据
              this.form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('创建成功')
            }).catch(res => {
              var errorData = res.response.data
              var emailError = errorData.email
              if (emailError) {
                this.$message.error(emailError)
              }
              var username = errorData.username
              if (username) {
                this.$message.error(username)
              }

              // 5 秒过后才可再次提交
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
      this.isCreate = false
      this.form.resetFields() // 清理表单数据（可不做）
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
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
