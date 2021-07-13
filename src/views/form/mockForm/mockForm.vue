<template>
  <page-header-wrapper content="根据输入模拟创建样本结果目录树，该数据为模拟数据仅用于测试使用！">
    <a-form :form="form">

      <a-card class="card" title="样本信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="样本编号">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.sample_id',
                  {rules: [{ required: true, message: '请输入样本编号', whitespace: true}], initialValue: data.sampleInfo.sample_id}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="病理号">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.pathology_id',
                  {rules: [{ required: true, message: '请输入病理号', whitespace: true}], initialValue: data.sampleInfo.patient_id}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="患者编号">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.patient_id',
                  {rules: [{ required: true, message: '请输入患者编号', whitespace: true}], initialValue: data.sampleInfo.patient_id}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="姓名">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.name',
                  {rules: [{ required: true, message: '请输入姓名', whitespace: true}], initialValue: data.sampleInfo.name}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="性别">
              <a-select placeholder="" v-decorator="[ 'sampleInfo.sex', {rules: [{ required: true, message: '请选择'}], initialValue: data.sampleInfo.sex} ]">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="年龄">
              <a-input
                type="number"
                v-decorator="[
                  'sampleInfo.age',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.sampleInfo.age}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="身份证号">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.id_card',
                  {rules: [{ required: true, message: '请输入身份证号', whitespace: true}], initialValue: data.sampleInfo.id_card}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="电话">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.phone',
                  {rules: [{ required: true, message: '请输入', whitespace: true}], initialValue: data.sampleInfo.phone}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="肿瘤类型">
              <a-select
                show-search
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['sampleInfo.tumor_type',
                              {rules: [{ required: true, message: '不能为空！'}], initialValue: data.sampleInfo.tumor_type}]"
                :options="cancerOptines"
                @change="changeCancer"
              />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="检测方法">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.detect_method',
                  {rules: [{ required: true, message: '请输入', whitespace: true}], initialValue: data.sampleInfo.detect_method}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="检测项目EN">
              <a-select
                show-search
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['sampleInfo.detect_project',
                              {rules: [{ required: true, message: '不能为空！'}], initialValue: data.sampleInfo.detect_project}]"
                :options="reportOptines"
              />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="经销商">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.distributor',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.distributor}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="医院">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.hosipital',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.hosipital}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="样本类型">
              <a-select placeholder="" v-decorator="[ 'sampleInfo.sample_type', {rules: [{ required: true, message: '请选择'}], initialValue: data.sampleInfo.sample_type} ]">
                <a-select-option value="组织">组织</a-select-option>
                <a-select-option value="血液">血液</a-select-option>
                <a-select-option value="胸水">胸水</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="肿瘤细胞含量">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.tumor_cell_content',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.tumor_cell_content}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="样本量">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.quantity',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.quantity}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="结果">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'sampleInfo.general_result',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.general_result}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item label="备注">
              <a-input
                placeholder=""
                v-decorator="[
                  'sampleInfo.comment',
                  {rules: [{ message: '请输入', whitespace: true}], initialValue: data.sampleInfo.comment}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="采样时间">
              <a-date-picker
                v-decorator="[
                  'sampleInfo.get_sample_time',
                  {rules: [{ required: true, message: '请选择'}], initialValue: data.sampleInfo.get_sample_time}
                ]"/>
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="收样时间">
              <a-date-picker
                v-decorator="[
                  'sampleInfo.collect_sample_time',
                  {rules: [{ required: true, message: '请选择'}], initialValue: data.sampleInfo.collect_sample_time}
                ]"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-card>

      <a-card class="card" title="检测结果" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="靶向变异">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['target',
                              {rules: [], initialValue: data.target}]"
                :options="targetOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="遗传变异">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['risk',
                              {rules: [], initialValue: data.risk}]"
                :options="riskOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="MMR变异">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['mmr',
                              {rules: [], initialValue: data.mmr}]"
                :options="mmrOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="HRR变异">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['hrr',
                              {rules: [], initialValue: data.hrr}]"
                :options="hrrOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="病毒">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['virus',
                              {rules: [], initialValue: data.virus}]"
                :options="virusOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="10" :md="10" :sm="24">
            <a-form-item label="MSI">
              <a-select
                allowClear
                placeholder="检测结果"
                v-decorator="[ 'msi.result', {rules: [], initialValue: data.msi.result} ]">
                <a-select-option value="MSS">MSS</a-select-option>
                <a-select-option value="MSI-H">MSI-H</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :lg="10" :md="10" :sm="24">
            <a-form-item label="百分比">
              <a-input
                type="number"
                v-decorator="[
                  'msi.percentage',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.msi.percentage}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="Hla分型">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['hla',
                              {rules: [], initialValue: data.hla}]"
                :options="hlaOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="新抗原">
              <a-select
                show-search
                mode="multiple"
                :filter-option="true"
                placeholder="请选择"
                v-decorator="['neo',
                              {rules: [], initialValue: data.neo}]"
                :options="neoOptines"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="TMB值">
              <a-input
                type="number"
                v-decorator="[
                  'tmb.value',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.tmb.value}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="肿瘤类型">
              <a-input
                v-decorator="[
                  'tmb.cancer',
                  {rules: [{ required: true, message: '请输入', whitespace: true}], initialValue: data.tmb.cancer }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="参考值">
              <a-input
                type="number"
                placeholder="请输入"
                v-decorator="[
                  'tmb.reference',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.tmb.reference}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="Hrd">
              <a-input
                type="number"
                disabled
                :addonAfter="data.hrd.total_score > 36? '>36': '<36'"
                v-decorator="[
                  'hrd.total_score',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.hrd.total_score }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="LOH">
              <a-input
                type="number"
                @change="lohChange"
                v-decorator="[
                  'hrd.loh',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.hrd.loh }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="LST">
              <a-input
                type="number"
                @change="lstChange"
                v-decorator="[
                  'hrd.lst',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.hrd.lst}
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="TAI">
              <a-input
                type="number"
                @change="taiChange"
                v-decorator="[
                  'hrd.tai',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.hrd.tai}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="化疗">
              <a-select
                placeholder=""
                :options="chemPanels"
                v-decorator="[ 'chem', {rules: [], initialValue: data.chem} ]">
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

      </a-card>

      <a-card class="card" title="质控" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="总共测得的序列数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.total_reads',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.total_reads }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="序列比对到基因组上的序列数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.mappped_reads',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.mappped_reads }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="去重后序列数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.uniq_reads',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.uniq_reads }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="正确配对的序列数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.proper_paired_reads',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.proper_paired_reads }
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="统计比对到目标设计区域的序列数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.reads_covered_in_panel',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.reads_covered_in_panel }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="覆盖到目标设计区域的平均深度">
              <a-input
                type="number"
                v-decorator="[
                  'qc.mean_depth_of_panel',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.mean_depth_of_panel }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="统计比对到目标设计区域的碱基数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.bases_covered_in_panel',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.bases_covered_in_panel }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="统计测序深度超过平均深度20%的覆盖率">
              <a-input
                type="number"
                v-decorator="[
                  'qc.mean_depth_of_panel_02X',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.mean_depth_of_panel_02X }
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="统计测序深度超过平均深度50%的覆盖率">
              <a-input
                type="number"
                v-decorator="[
                  'qc.mean_depth_of_panel_05X',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.mean_depth_of_panel_05X }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="统计测序深度超过平均深度100%的覆盖率">
              <a-input
                type="number"
                v-decorator="[
                  'qc.mean_depth_of_panel_1X',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.mean_depth_of_panel_1X }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="fold 80 碱基罚分">
              <a-input
                type="number"
                v-decorator="[
                  'qc.base_penalty',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.base_penalty }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="测得碱基总数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.total_base',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.total_base }
                ]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="测得ACGT碱基总数">
              <a-input
                type="number"
                v-decorator="[
                  'qc.total_ACGT',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.total_ACGT }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="GC含量比值">
              <a-input
                type="number"
                v-decorator="[
                  'qc.total_GC',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.total_GC }
                ]" />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="测得碱基质量大于30的比例">
              <a-input
                type="number"
                v-decorator="[
                  'qc.q30',
                  {rules: [{ required: true, message: '请输入'}], initialValue: data.qc.q30 }
                ]" />
            </a-form-item>
          </a-col>

        </a-row>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
        <a-button type="primary" v-if="create" @click="validate" :loading="loading">提交</a-button>
        <a-button style="margin-left: 8px" @click="goBack" :loading="loading">返回</a-button>
      </footer-tool-bar>

    </a-form>
    <mbacktop/>
  </page-header-wrapper>
</template>

<script>
import { BackTop } from 'ant-design-vue'
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { formatDate } from '../../../utils/util.js'
import { getMutations, getHla, getNeo, getMockReport, getCancer, getVirus, saveMockSample, getChemPanel } from '@/api/manage'

export default {
  name: 'MockForm',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    'mbacktop': BackTop
  },
  data () {
    return {
      loading: false,
      create: null,

      form: this.$form.createForm(this),

      mutations: {},
      hlas: {},
      neos: {},
      reports: {},
      cancers: {},
      virus: {},
      chemPanels: [],

      cancerOptines: [],
      targetOptines: [],
      riskOptines: [],
      mmrOptines: [],
      hrrOptines: [],
      hlaOptines: [],
      neoOptines: [],
      reportOptines: [],
      virusOptines: [],

      data: {
        sampleInfo: {
          sample_id: 'TEST' + formatDate(new Date(), 'yyyyMMddhhmmss'),
          patient_id: 'PTEST' + formatDate(new Date(), 'yyyyMMddhhmmss'),
          pathology_id: 'GTEST' + formatDate(new Date(), 'yyyyMMddhhmmss'),
          name: '张三',
          sex: '男',
          age: 18,
          id_card: '340403XXXXXXX72644',
          phone: '150XXXX3975',
          tumor_type: '肺癌',
          detect_method: 'NGS',
          detect_project: 'smart556',
          distributor: '',
          hosipital: '',
          sample_type: '血液',
          quantity: '',
          tumor_cell_content: '',
          general_result: '',
          comment: '',
          get_sample_time: moment('2021-06-02', 'YYYY-MM-DD'),
          collect_sample_time: moment('2021-06-10', 'YYYY-MM-DD')
        },
      target: [],
      risk: [],
      mmr: [],
      hrr: [],
      virus: [],
      msi: {
        result: 'MSS',
        percentage: 8.0
      },
      hla: [],
      neo: [],
      tmb: {
        value: 4.2,
        cancer: '肺癌',
        reference: 8.1
      },
      hrd: {
        loh: 4,
        tai: 14,
        lst: 15,
        total_score: 33
      },
      chem: 'G600',
      qc: {
        total_reads: 30720160,
        mappped_reads: 30701440,
        uniq_reads: 3065871,
        proper_paired_reads: 30187866,
        reads_covered_in_panel: 20548990,
        mean_depth_of_panel: 20929.9,
        bases_covered_in_panel: 104800,
        mean_depth_of_panel_02X: 100017,
        mean_depth_of_panel_05X: 93603,
        mean_depth_of_panel_1X: 51636,
        base_penalty: 1.55,
        total_base: 2304012000,
        total_ACGT: 15360080,
        total_GC: 44.56,
        q30: 92.63
      }
      },

      errors: []
    }
  },
  methods: {
    // 最终全页面提交
    validate (e) {
      e.preventDefault()
      this.loading = true
      this.loading = false
      this.form.validateFields((errors, values) => {
        if (!errors) {
          values.sample_id = values.sampleInfo.sample_id
          values.mutation = values.target.concat(values.mmr)
          delete values.target
          delete values.mmr
          values.mutation = values.mutation.concat(values.hrr)
          delete values.hrr
          values.mutation = values.mutation.concat(values.risk)
          delete values.risk
          values.mutation = values.mutation.map(m => this.mutations[m])

          values.neo = values.neo.map(m => this.neos[m])
          values.hla = values.hla.map(m => this.hlas[m])
          values.virus = values.virus.map(m => this.virus[m])

          console.log('values', values)
          saveMockSample(values).then(res => {
            // this.loading = false
            console.log('saveMockSample', res)
            this.$message.info('新增成功')
          })
        } else {
          this.loading = false
        }
      })
    },
    changeCancer (cancer) {
      const c = this.cancers[cancer]
      this.data.tmb.cancer = c.tmbCancer
      this.data.tmb.reference = c.ref
    },
    goBack () {
      this.$router.go(-1)
    },
    lohChange (e) {
      this.data.hrd.loh = parseFloat(e.target.value)
      this.data.hrd.total_score = this.data.hrd.loh + this.data.hrd.tai + this.data.hrd.lst
    },
    taiChange (e) {
      this.data.hrd.tai = parseFloat(e.target.value)
      this.data.hrd.total_score = this.data.hrd.loh + this.data.hrd.tai + this.data.hrd.lst
    },
    lstChange (e) {
      this.data.hrd.lst = parseFloat(e.target.value)
      this.data.hrd.total_score = this.data.hrd.loh + this.data.hrd.tai + this.data.hrd.lst
    }
  },
  computed: {
  },
  created () {
    // 足够大的数字，不分页
    getMutations({ 'pageSize': 1000 })
      .then(res => {
        console.log('getMutations', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.mutations[tmp.title] = tmp.id

          const key = tmp.title
          if (tmp.classify === 'snv' || tmp.classify === 'cnv' || tmp.classify === 'fusion') {
            this.targetOptines.push({ 'key': key, 'title': key, 'disabled': false })
          }
          if (tmp.classify === 'mmr') {
            this.mmrOptines.push({ 'key': key, 'title': key, 'disabled': false })
          }
          if (tmp.classify === 'hrr') {
            this.hrrOptines.push({ 'key': key, 'title': key, 'disabled': false })
          }
          if (tmp.classify === 'risk') {
            this.riskOptines.push({ 'key': key, 'title': key, 'disabled': false })
          }
        }
      })
      .catch((res) => {
        console.log('getMutations error', res)
      })

    getHla({ 'pageSize': 1000 })
      .then(res => {
        console.log('getHla', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.hlas[tmp.title] = tmp.id
          this.hlaOptines.push({ 'key': tmp.title, 'title': tmp.title, 'disabled': false })
        }
        console.log('getHla', this.hlaOptines)
      })
      .catch((res) => {
        console.log('getHla error', res)
      })

    getNeo({ 'pageSize': 1000 })
      .then(res => {
        console.log('getNeo', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.neos[tmp.title] = tmp.id
          this.neoOptines.push({ 'key': tmp.title, 'title': tmp.title, 'disabled': false })
        }
        console.log('getNeo', this.neoOptines)
      })
      .catch((res) => {
        console.log('getNeo error', res)
      })

    getMockReport({ 'pageSize': 1000 })
      .then(res => {
        console.log('getMockReport', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.reports[tmp.en] = tmp.id
          const key = tmp.en
          this.reportOptines.push({ 'key': key, 'title': key, 'disabled': false })
        }
        console.log('getMockReport', this.reportOptines)
      })
      .catch((res) => {
        console.log('getMockReport error', res)
      })

    getCancer({ 'pageSize': 1000 })
      .then(res => {
        console.log('getCancer', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.cancers[tmp.bdms] = { 'tmbCancer': tmp.tmb, 'ref': tmp.mean }
          this.cancerOptines.push({ 'key': tmp.bdms, 'title': tmp.bdms, 'disabled': false })
        }
        console.log('getCancer', this.cancers)
      })
      .catch((res) => {
        console.log('getCancer error', res)
      })

    getVirus({ 'pageSize': 1000 })
      .then(res => {
        console.log('getVirus', res)
        for (let i = 0, len = res.data.results.length; i < len; i++) {
          var tmp = res.data.results[i]
          this.virus[tmp.title] = tmp.id
          this.virusOptines.push({ 'key': tmp.title, 'title': tmp.title, 'disabled': false })
        }
        console.log('getVirus', this.virus)
      })
      .catch((res) => {
        console.log('getVirus error', res)
      })

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

    if (typeof this.$route.params.mdl !== 'undefined') {
      this.data = this.$route.params.mdl
      this.data.tmb.cancer = this.data.sampleInfo.tumor_type
      console.log('create', this.data)
    }

    if (typeof this.$route.params.action !== 'undefined') {
      const creatAction = ['add', 'copy']
      if (creatAction.includes(this.$route.params.action)) {
        this.create = true
      } else {
        this.create = false
      }
      console.log('create', this.action)
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
