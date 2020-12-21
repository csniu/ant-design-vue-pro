<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="原密码"
        hasFeedback
      >
        <a-input-password
          size="large"
          placeholder="请输入"
          v-decorator="['password', {rules: [{ required: true, message: '不能为空' }], validateTrigger: ['change', 'blur']}]"
        ></a-input-password>
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
          label="新密码"
          hasFeedback
        >
          <a-input-password
            size="large"
            @click="handlePasswordInputClick"
            placeholder="至少6位密码，区分大小写"
            v-decorator="['password1', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input-password>
        </a-form-item>
      </a-popover>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="密码确认"
        hasFeedback
      >
        <a-input-password
          size="large"
          placeholder="请再输入一次"
          v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></a-input-password>
      </a-form-item>

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary" :loading="confirmLoading">提交</a-button>
      </a-form-item>

    </a-form>
  </a-card>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { changePassWD } from '@/api/login'

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
  name: 'BaseForm',
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      confirmLoading: false,
      form: this.$form.createForm(this)
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
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          console.log(values)
          changePassWD(values).then(res => {
            // 3秒后退出重新登陆
            this.$message.info('修改成功，请重新登陆')
            setTimeout(
              this.$store.dispatch('Logout').then(() => {
                this.$router.push({ name: 'login' })
              }),
              3000
            )
          }).catch(res => {
            console.log('change password error', res)
            this.$message.error(res.response.data.detail)
          })
        }
      })
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
      const password = this.form.getFieldValue('password1')
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
  }
}
</script>
