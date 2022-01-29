<template>
  <div class="task">
    <div>
      <!--搜索-->
      <el-col :span="8">
        <el-input placeholder="搜索" v-model="form.search" @keyup.enter.native="searchClick">
          <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
        </el-input>
      </el-col>
    </div>

    <!--表格-->
    <task-list :value="tasks" @edit="handleEdit" @detail="handleDetail"></task-list>

    <!--模态窗-->
    <el-dialog
      title="任务详情"
      :visible.sync="dialogVisibleForTask"
      width="70%">
      <div><pre>{{exce_result}}</pre></div>
    </el-dialog>



    <!--分页-->
    <center>
    <el-pagination
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
import { getTaskList, updateTask, detailTask } from '@/api/task/task'
import TaskList from './table'

export default {
  name: 'task',
  components: {
    TaskList
  },

  data() {
    return {
      dialogVisibleForTask: false,
      tasks: [],
      exce_result:'',
      form: {
        page: 1,
        size: 10,
        search: '',
        ordering: 'id'
      },
      page: {
        pn: 1,
        size: 10,
        total: 0
      },
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      getTaskList(this.form).then(
        res => {
          this.tasks = res.data.results
          this.page.total = res.data.count
        })
    },

    handleCurrentChange(val) {
      this.page.pn = val
      this.fetchData()
    },

    searchClick() {
      this.fetchData()
    },

    handleEdit(value) {
      const { id, ...params } = value
      const data = {'status':'Y'}
      updateTask(id,data).then(res => {
        this.$message({
          message: '执行成功',
          type: 'success'
        })
        this.fetchData()
      })
    },

    /* 详情 */
    handleDetail(id) {
      this.dialogVisibleForTask = true
      detailTask(id).then(
        res => {
          this.exce_result = res.data.detail_result
          console.log(this.exce_result)
        })
    }
  }

}

</script>

<style lang='scss' scoped>
.task {
  padding: 10px;
}
pre {
  font-weight: bold;
  color: white;
  font-size: 16px;
  background-color: black;
}
</style>


