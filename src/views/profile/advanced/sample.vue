<template>
  <page-header-wrapper
    title="样本信息"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 3">
        <a-descriptions-item label="患者编号">{{ sampleInfo.patient_id }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ sampleInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ sampleInfo.sex }}</a-descriptions-item>

        <a-descriptions-item label="样本编号">{{ sampleInfo.sample_id }}</a-descriptions-item>
        <a-descriptions-item label="样本类型">{{ sampleInfo.sample_code }}</a-descriptions-item>
        <a-descriptions-item label="病理诊断">{{ sampleInfo.clinical_diagnosis }}</a-descriptions-item>
        <a-descriptions-item label="肿瘤类型">{{ sampleInfo.tumor_type }}</a-descriptions-item>

        <a-descriptions-item label="生效日期">2017-07-07 ~ 2017-08-08</a-descriptions-item>
        <a-descriptions-item label="备注">请于两个工作日内确认</a-descriptions-item>
      </a-descriptions>
    </template>

    <a-card :bordered="false" title="流程进度">
      <a-steps :direction="isMobile && 'vertical' || 'horizontal'" :current="1" progressDot>
        <a-step>
          <template v-slot:title>
            <span>创建项目</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              曲丽丽<a-icon type="dingding" style="margin-left: 8px;" />
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template v-slot:title>
            <span>部门初审</span>
          </template>
          <template v-slot:description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              周毛毛<a-icon type="dingding" style="color: rgb(0, 160, 233); margin-left: 8px;" />
              <div><a>催一下</a></div>
            </div>
          </template>
        </a-step>
        <a-step title="财务复核" />
        <a-step title="完成" />
      </a-steps>
    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="用户信息">
      <a-descriptions>
        <a-descriptions-item label="用户姓名">付晓晓</a-descriptions-item>
        <a-descriptions-item label="会员卡号">32943898021309809423</a-descriptions-item>
        <a-descriptions-item label="身份证">3321944288191034921</a-descriptions-item>
        <a-descriptions-item label="联系方式">18112345678</a-descriptions-item>
        <a-descriptions-item label="联系地址">浙江省杭州市西湖区黄姑山路工专路交叉路口</a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="信息组">
        <a-descriptions-item label="某某数据">725</a-descriptions-item>
        <a-descriptions-item label="该数据更新时间">2018-08-08</a-descriptions-item>
        <a-descriptions-item ></a-descriptions-item>
        <a-descriptions-item label="某某数据">725</a-descriptions-item>
        <a-descriptions-item label="该数据更新时间">2018-08-08</a-descriptions-item>
        <a-descriptions-item ></a-descriptions-item>
      </a-descriptions>
      <a-card type="inner" title="多层信息组">
        <a-descriptions title="组名称" size="small">
          <a-descriptions-item label="负责人">林东东</a-descriptions-item>
          <a-descriptions-item label="角色码">1234567</a-descriptions-item>
          <a-descriptions-item label="所属部门">XX公司-YY部</a-descriptions-item>
          <a-descriptions-item label="过期时间">2018-08-08</a-descriptions-item>
          <a-descriptions-item label="描述">这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin: 16px 0" />
        <a-descriptions title="组名称" size="small" :col="1">
          <a-descriptions-item label="学名">	Citrullus lanatus (Thunb.) Matsum. et Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin: 16px 0" />
        <a-descriptions title="组名称" size="small" :col="2">
          <a-descriptions-item label="负责人">付小小</a-descriptions-item>
          <a-descriptions-item label="角色码">1234567</a-descriptions-item>
        </a-descriptions>
      </a-card>

    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="用户近半年来电记录">
      <div class="no-data"><a-icon type="frown-o"/>暂无数据</div>
    </a-card>

  </page-header-wrapper>
</template>
// chipid: (...)
// comment: (...)
// detect_projects: (...)
// distributor: (...)
// get_sample_time: (...)
// hosipital: (...)
// huisuan_assistant: (...)
// sale_model: (...)
// tumor_type_kdb: (...)
<script>
import { baseMixin } from '@/store/app-mixin'
import { getSample } from '@/api/manage'

export default {
  name: 'Advanced',
  mixins: [baseMixin],
  data () {
    console.log('#####', this.$router.options.routes)
    return {
      sampleRecoderId: null,
      sampleInfo: parameter => {
        console.log('######', this.sampleRecoderId)
        return getSample(this.sampleRecoderId)
          .then(res => {
            console.log(res)
            return res.data
          })
      }
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    this.sampleRecoderId = this.$route.query.sampleRecoderId
    console.log('sampleRecoderId', this.sampleRecoderId)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>
