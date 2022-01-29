<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item prop="search">
        <el-input v-model="form.search" placeholder="输入应用名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="createAppid()">创建Appid</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="appname" label="应用名称"></el-table-column>
      <el-table-column prop="appid" label="Appid"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="desc" label="应用描述"></el-table-column>
      <el-table-column label="操作" width="165">
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
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
    <!-- 编辑组件 -->
    <edit :visible="visible" :cur-id="curId" :appids="tableData" @close="close" @search="fetchData" />
  </div>
</template>

<script>

import * as api from '@/api/msg/appid'

import Edit from './edit'

export default {
  name: 'Organization', // 和对应路由表中配置的name值一致

  components: {Edit},

  data() {
    return {
      tableData: [],
      form: {
        pn: 1,
        size: 20,
        search: '',
        ordering: 'id'
      },
      total: 0,
      visible: false,
      curId: null
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getAppids(this.form)
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
    },
    // 弹出新增窗口
    createAppid() {
      this.visible = true
    },
    // 关闭弹窗
    close() {
      this.visible = false
      this.curId = null
    },
    // 编辑
    handleEdit(row) {
      this.curId = row.id
      this.visible = true
    },
  }
}
</script>



