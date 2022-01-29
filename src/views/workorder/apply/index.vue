<template>
  <div class="apply">
    <el-form :model="form" :rules="rules" ref="form" label-width="180px">
      <el-form-item label="工单类型：" prop="type">
        <el-select v-model="form.type" placeholder="请选择工单类型" style="width: 60%;">
          <el-option
            v-for="item in type_list"
            :key="item.index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工单标题：" prop="title">
        <el-input v-model="form.title" style="width: 60%;"></el-input>
      </el-form-item>

      <el-form-item label="工单内容：" prop="order_contents">
        <el-input v-model="form.order_contents" type="textarea" rows="8"  style="width: 60%;"></el-input>
      </el-form-item>

      <el-form-item label="指派给：" prop="assign_to">
        <el-select v-model="form.assign_to" filterable placeholder="请选择工单处理人" style="width: 60%;">
          <el-option
            v-for="item in sa_list"
            :key="item.index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {createWorkOrder} from "@/api/workorder/workorder";
import {getWorkOrderType, workOrderOps} from "@/api/workorder/workorder";

export default {
  data() {
    return {
      form: {
        type: '',
        title: '',
        order_contents: '',
        assign_to: ''
      },
      rules: {
        type: [
          {required: true, message: '请输入工单类型', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输人工单标题', trigger: 'blur'}
        ],
        order_contents: [
          {required: true, message: '请输人工单内容', trigger: 'blur'}
        ],
        assign_to: [
          {required: true, message: '请输人工单指派人', trigger: 'blur'}
        ],
      },
      sa_list: [],
      type_list: [],
      state: 0
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const params = Object.assign({}, this.form)
        console.log(params)
        createWorkOrder(params).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({ path: '/workorder/list' })
        })
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    async fetchData() {
      getWorkOrderType().then(res => {
        this.type_list = res.data.results
        console.log(this.type_list)
      })
      workOrderOps().then(res => {
        this.sa_list = res.data.results
        console.log(this.sa_list)
      })
    }
  },
  created() {
    this.state = 1
    this.fetchData()
  },
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
