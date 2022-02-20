<template>
  <div class="schedule">
    <h1>任务计划</h1>
    <el-form :rules="rules" ref="formData" :model="formData" label-width="300px"
             label-position="right" style="width: 900px" status-icon>
      <el-form-item label="任务名称：" prop="task_name">
        <el-input v-model="formData.task_name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="请选择主机：" prop="hosts" style="width: 500px">
        <el-select v-model="formData.hosts" multiple placeholder="请选择主机">
          <el-option v-for="(host_value,host_index) in host_list" :label="`${host_value.ip_addr}--${host_value.hostname}`" :key="host_index" :value="host_value.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择周期方式：" prop="period">
        <el-select v-model="formData.period_way" placeholder="请选择周期方式">
          <el-option v-for="(period_value,period_index) in period_way_choices" :label="period_value[1]" :value="period_value[0]" :key="period_index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务周期值：" prop="period_content">
        <el-input v-model="formData.period_content" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="任务指令：" prop="period_content">
        <editor v-model="formData.task_cmd" @init="editorInit" lang="html" theme="chrome" width="500" height="300"></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>


import {createTask, getHosts, getPeriod} from "@/api/schedule/schedule";

export default {
  name: 'Schedule',
  components: {
    editor: require('vue2-ace-editor'),
  },
  created() {
    // 获取所有主机数据
    this.get_host_list();
    // 获取周期类型数据
    this.get_period_data();
  },
  data() {
    return {
      period_way_choices:[],  // 所有周期类型数据
      host_list:[], // 主机列表数据
      formData: {
        task_name: '',
        hosts: [],
        period_way:'1',
        task_cmd:'',
        period_content:'',
      },
      // 校验表单
      rules: {
        task_name: [
          {required: true, message: '请输入任务名称', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    get_host_list(){
      getHosts().then(res => {
        this.host_list = res.data.results
      })
    },
    get_period_data(){
      getPeriod().then(res => {
        this.period_way_choices = res.data.period_way_choices
      })
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript')    //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    handlePeriodChange(value) {
      this.formData.period_way = value;
      console.log('change2', this.formData.period_way)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formData)
          createTask(this.formData).then(res => {
              this.$message({
                message: '添加任务成功',
                type: 'success'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭窗口
    close() {
      this.$refs['formData'].resetFields()
    }

  }
}
</script>
