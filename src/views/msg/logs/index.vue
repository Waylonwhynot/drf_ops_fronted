<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item prop="search">
        <el-input v-model="form.search" placeholder="输入应用AppID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="消息 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="消息类型">
              <span>{{ props.row.msg_type }}</span>
            </el-form-item>
            <el-form-item label="详情">
              <span>{{ props.row.detail }}</span>
            </el-form-item>
            <el-form-item label="消息内容">
              <span>{{ props.row.msg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="AppID"
        prop="appid">
      </el-table-column>
      <el-table-column
        label="时间"
        prop="msg_date">
      </el-table-column>
      <el-table-column label="发送状态" width="330">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='success'" type="success" icon="el-icon-check" circle></el-button>
          <el-button v-else type="danger" icon="el-icon-close" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.pn"
      :page-sizes="[10, 20, 50]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

import * as api from '@/api/msg/wxmsglog'


export default {
  name: 'Wxmsglog', // 和对应路由表中配置的name值一致

  data() {
    return {
      tableData: [],
      // page: {
      //   pn: 1,
      //   size: 20,
      //   total: 0
      // },
      form: {
        pn: 1,
        size: 20,
        search: '',
        ordering: 'id'
      },
      total: 0
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getWxmsglogs(this.form)
      this.tableData = data.results
      this.total = data.count
    },

    // val 是切换之后的每页显示多少条
    handleSizeChange(val) {
      this.form.size = val
      this.fetchData()
    },

    // 当页码改变后触发到此方法，val 是当前点击（或输入）的那个页码，
    handleCurrentChange(val) {
      this.form.pn = val
      this.fetchData()
    },

    // 条件查询
    queryData() {
      // 将页码变为1，第1页
      this.form.pn = 1
      this.fetchData()
    },

    // 重置
    reload() {
      this.form = {}
      this.fetchData()
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
