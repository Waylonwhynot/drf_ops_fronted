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
    <deploy-list :value="release" @edit="handleEdit"></deploy-list>

    <!--模态窗-->
    <el-dialog
      title="发布详情"
      :visible.sync="dialogVisibleForEdit"
      width="50%">
      <pre>{{ currentValue.console_output }}</pre>
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
import { getDeployList } from '@/api/release/release'
import DeployList from './table'

export default {
  name: 'release',
  components: {
    DeployList,
  },

  data() {
    return {
      dialogVisibleForEdit: false,
      currentValue: {},
      release: [],
      form: {
        page: 1,
        search: '',
        status: 3
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
      console.log(this.form)
      getDeployList(this.form).then(
        res => {
          this.release = res.data.results
          console.log(this.release)
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

    /* 查看发布结果，弹出模态窗 */
    handleEdit(value) {
      this.currentValue = { ...value }
      this.dialogVisibleForEdit = true
    },

  }

}
</script>

<style lang='scss' scoped>
.release {
  padding: 10px;
}
</style>

