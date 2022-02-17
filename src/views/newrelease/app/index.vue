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
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleCreate()">创建应用</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      :data="tableData"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="应用名称"></el-table-column>
      <el-table-column prop="app_id" label="AppID"></el-table-column>
      <el-table-column prop="remark" label="描述信息"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit"  @click="handleCreateDeploy(scope.row)" size="mini">新建发布</el-button>
          <el-button type="info" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">克隆发布</el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit"  @click="handleDelete(scope.row.id)" size="mini">删除</el-button>
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
    <edit :visible="visible" :cur-id="curId" @close="close" @search="fetchData" />
<!--    <deploy :visible="deployOuterVisible" :cur-id="curId" :appids="tableData" @close="close" @search="fetchData" />-->
    <deploy :deployOuterVisible="deployOuterVisible" :cur-id="curId" @close="outClose" @search="fetchData" />
  </div>
</template>

<script>

import * as api from '@/api/newrelease/app/app'

import Edit from './edit'
import Deploy from './deploy_style'

export default {
  name: 'Env', // 和对应路由表中配置的name值一致

  components: {Edit, Deploy},

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
      deployOuterVisible: false,
      curId: null
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getApps(this.form)
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
    // 弹出新增窗口, 新建应用
    handleCreate() {
      this.visible = true
    },
    // 编辑应用，弹出窗口
    handleEdit(row) {
      this.curId = row.id
      this.visible = true
    },
    // 删除应用
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        api.deleteApp(id).then(response => {
          // 处理响应结果提示
          this.$message({
            type: response.code === 200 ? 'success' : 'error',
            message: response.message
          });
          // 刷新列表数据
          if (response.code === 200) {
            this.fetchData()
          }
        })
      }).catch(() => {
        // 取消删除，不用理会
      })
    },
    // 关闭弹窗(编辑应用、新建应用)
    close() {
      this.visible = false
      this.curId = null
    },
    /////////
    // 新建发布
    handleCreateDeploy(row) {
      this.deployOuterVisible = true
      this.curId = row.id
    },
    // 关闭弹窗(新建发布外层弹窗)
    outClose() {
      this.deployOuterVisible = false
      this.curId = null
    },


  }
}
</script>



