<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item prop="search">
        <el-input v-model="form.search" placeholder="输入主机名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-button icon="el-icon-circle-plus-outline" type="primary" @click="createHost()">新增</el-button>
          <el-button icon="el-icon-upload" type="primary" @click="createExcelHost()">批量导入</el-button>
<!--          <el-link href="http://127.0.0.1:8000/api/host/host_excel/" icon="el-icon-download" type="primary">导出主机列表数据</el-link>-->
          <el-button icon="el-icon-download" type="primary" @click="exportHost()">导出主机列表数据</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
    >
      <el-table-column type="index" label="ID" width="50"></el-table-column>
      <el-table-column prop="category_name" label="类别"></el-table-column>
      <el-table-column prop="hostname" label="主机名称"></el-table-column>
      <el-table-column prop="ip_addr" label="IP地址"></el-table-column>
      <el-table-column prop="port" label="端口号"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-view" size="mini">
            <router-link :to="'/host/console/' + scope.row.id + '/'">console</router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pn"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <!-- 增加编辑组件 -->
    <edit :visible="visible" :cur-id="curId" @close="close" @search="fetchData"/>
    <excel :excelVisible="excelVisible" @close="excelClose" @search="fetchData"/>
  </div>
</template>

<script>

import * as api from '@/api/host/server'

import Edit from './edit'
import Excel from './excel'

export default {
  name: 'Server', // 和对应路由表中配置的name值一致

  components: {Edit, Excel},

  data() {
    return {
      tableData: [],
      page: {
        pn: 1,
        size: 10,
        total: 0
      },
      form: {
        search: '',
        ordering: 'id'
      },
      visible: false,
      excelVisible: false,
      curId: null
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getHosts(this.form)
      this.tableData = data.results
      this.page.total = data.count
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

    // 条件查询
    queryData() {
      // 将页码变为1，第1页
      this.page.pn = 1
      this.fetchData()
    },

    // 重置
    reload() {
      this.form = {}
      this.fetchData()
    },
    // 弹出新增窗口
    createHost() {
      this.visible = true
    },
    // 弹出批量导入窗口
    createExcelHost() {
      this.excelVisible = true
    },
    // 直接调用后端拿数据
    exportHost() {
      api.getHosts()
    },
    // 关闭弹窗
    close() {
      this.visible = false
      this.curId = null
    },
    // 关闭批量导入弹窗
    excelClose() {
      this.excelVisible = false
    },
    // 编辑
    handleEdit(row) {
      this.curId = row.id
      this.visible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        api.deleteHost(row.id).then(response => {
          // 处理响应结果提示
          this.$message({
            message: '删除主机' + row.name + '成功',
            type: 'success'
          });
          // 刷新列表数据
          this.fetchData()
        })
      })
    },
    // Console
    handleConsole(row) {
      console.log('handleconsole')
    },
  }
}
</script>
