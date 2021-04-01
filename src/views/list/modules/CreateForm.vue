<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model[primaryKey] > 0" label="主键ID">
          <a-input v-decorator="[primaryKey, { initialValue: model[primaryKey] }]" disabled />
        </a-form-item>
        <slot name="fields">
          <a-form-item label="描述">
            <!-- 验证规则：https://2x.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 -->
            <a-input v-decorator="['description', {rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }]}]" />
          </a-form-item>
        </slot>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const defaultFields = ['description']

export default {
  props: {
    title: {
      type: String,
      default: () => '新建'
    },
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    primaryKey: {
      type: String,
      default: () => 'id'
    },
    fields: {
      type: Array,
      default: () => defaultFields
    }
  },
  data () {
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
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.fields.push(this.primaryKey)
    console.log('custom modal created', this.title, this.primaryKey, this.fields)

    // 防止表单未注册
    this.fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, this.fields))
    })
  }
}
</script>
