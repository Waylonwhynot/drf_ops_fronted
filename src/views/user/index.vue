<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item label="">
        <el-input v-model.trim="form.search" placeholder="输入用户名、邮箱搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">搜索</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
      <el-table-column align="center" prop="username" label="用户名"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
      <el-table-column align="center" prop="department_name" label="部门"></el-table-column>
      <el-table-column align="center"  prop="roles_name" label="角色"></el-table-column>
      <el-table-column align="center" prop="is_active" label="帐号锁定">
        <!-- (1 未锁定，0已锁定) -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_active === false" type="danger">锁定</el-tag>
          <el-tag v-if="scope.row.is_active === true" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <!-- v-model="row.is_active" -->
          <el-switch
            v-model="row.is_active"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeIsActive($event, row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="330">
        <template slot-scope="{row}">
          <el-button v-permission="['admin','system-users-update']" type="success" icon="el-icon-edit" @click="updateUser(row)" size="mini">编辑</el-button>
          <el-button v-permission="['admin','system-users-del']" type="danger" icon="el-icon-delete" @click="handleDelete(row.id)" size="mini">删除</el-button>
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
    <edit :departments-data="departmentsData" :visible="visible" :cur-id="curId" @close="close" @search="fetchData"/>

  </div>
</template>

<script>

import * as api from '@/api/user'
import { getDepartments } from '@/api/org'
import Edit from './edit'
// import {getUsers} from "@/api/user";
import { mapGetters } from 'vuex'

export default {
  name: 'User', // 和对应路由表中配置的name值一致

  components: {Edit},

  data() {
    return {
      tableData: [], // 封装列表数据
      // page: { // 分页对象
      //   pn: 1,
      //   size: 10,
      //   total: 0
      // },
      form: {
        pn: 1,
        size: 10,
        search: '',
        ordering: 'id',
      },
      total: 0,
      visible: false,
      curId: null,
      // 部门
      departmentsData: [],
      //
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },

  created() {
    this.fetchData()
    this.getDepartments()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getUsers(this.form)
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
      this.query = {}
      this.fetchData()
    },
    // 修改用户状态
    changeIsActive(event, row) {
      const message = !event ? '锁定' : '激活'
      this.$confirm('此操作将' + message + '用户 "' + row.username + '" , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {'is_active': row.is_active}
        api.updateUserActive(row.id, data).then(res => {
          this.$message({
            message: message + row.username + '成功',
            type: 'success'
          })
        }).catch(() => {
          row.is_active = !row.is_active
        })
      }).catch(() => {
        row.is_active = !row.is_active
      })
    },
    // 编辑
    updateUser(row) {
      this.curId = row.id
      this.visible = true
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        api.deleteUser(id).then(response => {
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
    // 获取部门Tree结构
    getDepartments() {
      getDepartments().then(res => {
        this.departmentsData = res.data.results
      })
    },
    close() {
      this.visible = false
      this.curId = null
    },
  },
}
</script>
