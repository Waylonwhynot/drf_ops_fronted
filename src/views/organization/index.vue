<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item prop="search">
        <el-input v-model="form.search" placeholder="输入部门名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
        <el-button v-permission="['admin','system-organizations-add']" icon="el-icon-circle-plus-outline" type="primary" @click="createDepartment()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="部门"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <el-button v-permission="['admin','system-organizations-del']" type="primary" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
          <el-button v-permission="['admin','system-organizations-update']" type="danger" icon="el-icon-delete"  @click="handleDelete(scope.row)" size="mini">删除</el-button>
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
    <!-- 编辑组件 -->
    <edit :visible="visible" :cur-id="curId" :departments="tableData" @close="close" @search="fetchData" />
  </div>
</template>

<script>

import * as api from '@/api/org'

import Edit from './edit'

export default {
  name: 'Organization', // 和对应路由表中配置的name值一致

  components: {Edit},

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
      curId: null
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getDepartments(this.form)
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
    createDepartment() {
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
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        api.deleteDepartment(row.id).then(response => {
          // 处理响应结果提示
          this.$message({
            message: '删除部门' + row.name + '成功',
            type: 'success'
          });
          // 刷新列表数据
          this.fetchData()
        })
      })
    },
  }
}
</script>
