<template>
  <div class="app-container">
    <!--     条件查询 -->
    <el-form ref="form" :model="form" inline size="mini">
      <el-form-item prop="search">
        <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search" placeholder="输入权限名、路径搜索" />
      </el-form-item>
      <el-form-item>
        <el-button type="info" icon="el-icon-search" @click="fetchData(form)">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
        <el-button v-permission="['admin','system-permissions-add']" type="primary" style="margin-bottom:20px" icon="el-icon-plus" @click="createPermission()">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- row-key="id" 指定唯一标识的属性名，其中数据要包含children才会被渲染为树状 -->
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="权限名" width="180" show-overflow-tooltip/>
      <el-table-column prop="sign" label="权限标识" width="180" show-overflow-tooltip/>
      <el-table-column prop="menu" label="是否为菜单" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.menu">是</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="请求路径"/>
      <el-table-column prop="method" label="请求方法" width="100"/>
      <el-table-column prop="desc" label="描述" width="100" show-overflow-tooltip/>
      <el-table-column fixed="right" align="center" label="操作" width="220">
        <template slot-scope="{row}">
          <el-button type="primary" v-permission="['admin','system-permissions-update']" icon="el-icon-edit" size="mini" @click="updatePermission(row)">编辑</el-button>
          <el-button type="danger"  v-permission="['admin','system-permissions-del']" icon="el-icon-delete" size="mini" @click="deletePermission(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit :visible="visible" :cur-id="curId" :permissions="tableData" @close="close" @search="fetchData" />
  </div>
</template>

<script>
import {getPermissions, deletePermission} from '@/api/permissions'
import Edit from './edit'
export default {
  name: 'Permissions',
  components: {Edit},
  data() {
    return {
      form: {
        search: '',
        ordering: 'id'
      },
      tableData: [], // 列表数据
      curId: null,
      // cuForm数据
      visible: false,
    }
  },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        await getPermissions(this.form).then(res => {
          this.tableData = res.data.results
        })
      },
      // 重置
      resetForm() {
        this.$refs.form.resetFields()
        this.fetchData()
      },
      // 新增权限
      // 弹出子组件
      createPermission() {
        this.visible = true
      },
      // 更新权限
      updatePermission(row) {
        this.curId = row.id
        this.visible = true
      },
      // 删除权限
      deletePermission(row) {
        this.$confirm('此操作将删除权限 "' + row.name + '" 及其子权限' + ' , 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { deletePermission(row.id).then(res => {
            this.$message({
              message: '删除权限' + row.name + '成功',
              type: 'success'
            })
            // 刷新table
            this.fetchData()
          })
        })
      },
      close() {
        this.visible = false
        this.curId = null
      }
    }
}
</script>
