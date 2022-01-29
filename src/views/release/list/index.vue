<template>
  <div class="release">
    <div>
      <!--搜索-->
      <el-col :span="8">
        <el-input placeholder="搜索" v-model="form.search" @keyup.enter.native="searchClick">
          <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
        </el-input>
      </el-col>
    </div>

    <!--表格-->
    <deploy-list :value="release" @edit="handleEdit" @delete="handleDelete"></deploy-list>

    <!--模态窗-->
    <el-dialog
      title="上线进度"
      :visible.sync="dialogVisibleForEdit"
      width="50%">

      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
  	<el-step title="申请" ></el-step>
  	<el-step title="审核" ></el-step>
  	<el-step title="灰度" ></el-step>
  	<el-step title="上线" ></el-step>
      </el-steps>
      <br>
      <deploy-form
        ref="releaseForm"
        :form="currentValue"
        @submit="handleSubmitEdit">
      </deploy-form>
    </el-dialog>

    <!--分页-->
    <center>
    <el-pagination
      @size-change="handleSizeChange"
      background
      layout="total, prev, pager, next, jumper"
      :page-size="page.size"
      :total="page.total"
      @current-change="handleCurrentChange">
    </el-pagination>
    </center>
  </div>
</template>

<script>
import { getDeployList, createDeploy, updateDeploy, deleteDeploy } from '@/api/release/release'
import DeployList from './table'
import DeployForm from './form'

export default {
  name: 'release',
  components: {
    DeployList,
    DeployForm
  },

  data() {
    return {
      dialogVisibleForEdit: false,
      currentValue: {},
      release: [],
      page: {
        pn: 1,
        size: 10,
        total: 0
      },
      form: {
        search: '',
        ordering: 'id',
        status: 0
      },
      active: 1,
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      getDeployList(this.form).then(
        res => {
          this.release = res.data.results
          this.page.total = res.data.count
        })
    },
    // val 是切换之后的每页显示多少条
    handleSizeChange(val) {
      this.page.size = val
      this.fetchData()
    },
    // 当页码改变后触发到此方法，val 是当前点击（或输入）的那个页码，
    handleCurrentChange(val) {
      this.page.pn = val
      this.fetchData()
    },
    searchClick() {
      this.fetchData()
    },

    /*  处理上线申请，弹出模态窗、提交数据、取消 */
    handleEdit(value) {
      this.currentValue = { ...value }
      this.dialogVisibleForEdit = true
      this.form.status = this.currentValue.status.id
      this.active = this.form.status+1
    },

    handleSubmitEdit(value) {
      const { id, ...form } = value
      console.log('submit form', form)
      const formdata = {'status':this.form.status+1,'name':form.name,version:form.version}
      updateDeploy(id,formdata).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
      })
      this.dialogVisibleForEdit = false
      this.fetchData()
    },

    /* 取消 */
    handleDelete(id) {
      const data = {'status':4}
      deleteDeploy(id,data).then(res => {
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.form.pn = 1,
        this.fetchData()
     },
     err => {
       console.log(err.message)
     })
    }

  }

}
</script>

<style lang='scss' scoped>
.release {
  padding: 10px;
}
</style>

