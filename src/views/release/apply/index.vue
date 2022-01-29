<template>
  <div class="apply">
    <el-form :model="form" :rules="rules" ref="form" label-width="180px">
      <el-form-item label="选择项目：" prop="name">
        <el-select v-model="form.name" placeholder="请选择工单类型" style="width: 60%;" @change="getTag(form.name)">
          <el-option
            v-for="item in project_list"
            :key="item.index"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目版本：" prop="version">
        <el-select v-model="form.version" style="width: 60%;" @change="getTagInfo({'project':form.name, 'tag': form.version})">
          <el-option
            v-for="item in tag_list"
            :key="item.index"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="版本信息：" prop="info">
        <el-input v-model="form.info" style="width: 60%;" disabled></el-input>
      </el-form-item>

      <el-form-item label="指派给：" prop="assign_to">
        <el-select v-model="form.reviewer" filterable placeholder="请选择工单处理人" style="width: 60%;">
          <el-option
            v-for="item in sa_list"
            :key="item.index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上线详情：" prop="detail">
        <el-input v-model="form.detail" type="textarea" rows="8" style="width: 60%;"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

// import { getOneGroup } from '@/api/users/group'
import {workOrderOps} from "@/api/workorder/workorder";
import {getProjectList, getProjectTag, getProjectTagInfo} from '@/api/project/project'
import {createDeploy} from '@/api/release/release'

export default {
  data() {
    return {
      form: {
        name: '',
        version: '',
        info: '',
        detail: '',
        reviewer: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入工单类型', trigger: 'blur'}
        ],
        version: [
          {required: true, message: '请输人工单标题', trigger: 'blur'}
        ],
        // info: [
        //   {required: true, message: '请输人工单内容', trigger: 'blur'}
        // ],
        reviewer: [
          {required: true, message: '请输人工单指派人', trigger: 'blur'}
        ],

      },
      sa_list: [],
      project_list: [],
      tag_list: [],
      state: 0
    }
  },

  methods: {
    getTag(event) {
      console.log(event) // 2
      const data = {'project': event}
      console.log(data)
      getProjectTag(data).then(res => {
        console.log('res', res)
        this.tag_list = res.data
      })

    },
    getTagInfo(event) {
      console.log(event)
      const data = {...event}
      getProjectTagInfo(data).then(res => {
        this.form.info = res.data
      })

    },
    onSubmit() {
      this.$message('submit!')
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const params = Object.assign({}, this.form)
        console.log('创建上线单的参数', params)
        createDeploy(params).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({path: '/release/list'})
        })
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  },

  created() {
    this.state = 1
  },

  watch: {
    state() {
      workOrderOps().then(res => {
        this.sa_list = res.data.results
      })

      getProjectList().then(res => {
        this.project_list = res.data
      })
    }

  }

}
</script>

<style scoped>
.line {
  text-align: center;
}

.apply {
  margin-top: 2cm;
}
</style>

