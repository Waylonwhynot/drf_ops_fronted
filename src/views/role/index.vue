<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-row>
      <el-col :span="16">
        <el-form :inline="true" :model="form" size="mini">
          <el-form-item prop="search">
            <el-input v-model="form.search" placeholder="输入角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
            <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
            <el-button v-permission="['admin','system-roles-add']" icon="el-icon-circle-plus-outline" type="primary" @click="createRole()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-steps :active="step" finish-status="success" simple style="margin-top: 20px; padding:20px 2%">
          <el-step title="点击角色" />
          <el-step title="分配权限" />
          <el-step title="点击授权" />
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色列表</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            :row-key="getRowKeys"
            style="width: 100%"
            highlight-current-row
            @current-change="tableHandleCurrentChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" :selectable="checkSelectTable" width="55"/>
            <el-table-column prop="name" label="角色"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="create_time" label="创建时间" width="180"/>
            <el-table-column fixed="right" align="center" label="操作" width="220">
              <template slot-scope="{row}">
                <el-button type="primary" v-permission="['admin','system-roles-update']" icon="el-icon-edit" size="mini" @click.native.stop="updateRole(row)">编辑</el-button>
                <el-button type="danger" v-permission="['admin','system-roles-del']" icon="el-icon-delete" size="mini" @click.native.stop="deleteRole(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pn"
            :page-sizes="[10, 20, 50]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="permissions-box-card" style="margin-left:10px">
          <div slot="header" class="clearfix">
            <span>权限分配</span>
            <el-button v-permission="['admin','system-roles-auth']" :disabled="!showButton" type="primary" style="float: right" icon="el-icon-check" size="medium" @click="authorize()">授权</el-button>
          </div>
          <el-tree
            ref="permissions"
            :data="permissionsData"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="handleCheckClick"
          />
        </el-card>
      </el-col>
    </el-row>
    <edit :visible="visible" :cur-id="curId" :roles="tableData" @close="close" @search="fetchData"/>
  </div>
</template>
<script>

import * as api from '@/api/role'
import { getPermissions } from '@/api/permissions'
import Edit from './edit'


export default {
  name: 'Role', // 和对应路由表中配置的name值一致
  components: {Edit},

  data() {
    return {
      tableData: [],
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
      currentId: null,
      // 授权数据
      step: 0,
      showButton: false,
      permissionsData: [],
      permissionIds: [],
      defaultProps: { children: 'children', label: 'label' },
      // edit组件数据
      visible: false,
      curId: null
    }
  },

  created() {
      this.fetchData(),
      this.getPermissions()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getRoles(this.form)
      this.tableData = data.results
      this.page.total = data.count
    },
    // 获取权限数结构数据
    getPermissions() {
      getPermissions().then(res => {
        this.permissionsData = res.data.results
      })
    },
    // tree权限节点被点击时的回调
    handleCheckClick(currentObj, treeStatus) {
      if (this.currentId) {
        this.step = 2
      }
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children !== undefined) {
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.permissions.setChecked(treeList.id, isSelected)
      if (treeList.children !== undefined) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.permissions.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.permissions.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 设置admin角色行不可勾选
    checkSelectTable(row) {
      return row.name !== 'admin'
    },
    // 编辑角色
    updateRole(row) {
      this.curId = row.id
      this.visible = true
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将删除角色 "' + row.name + '" , 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteRole(row.id).then(res => {
          this.$message({
            message: res.message,
            type: res.code === 200 ? 'success': 'error',
          })
          // 刷新table
          this.fetchData()
        })
      })
    },
    // val 是切换之后的每页显示多少条
    handleSizeChange(val) {
      this.page.size = val
      this.fetchData()
    },
    // 获取Permissions Tree的所有ID
    getAllPermissionDataId(array, datas) {
      for (const index in datas) {
        const id = datas[index].id
        array.push(id)
        if (datas[index].children) {
          this.getAllPermissionDataId(array, datas[index].children)
        }
      }
      return array
    },
    // 更改Permissions Tree的disabled属性
    changeDisabled(data, disabled) {
      for (let index = 0; index < data.length; index++) {
        const children = data[index].children
        if (children !== undefined) {
          this.changeDisabled(children, disabled)
        }
        data[index].disabled = disabled
      }
    },
    // table选择框功能的change事件
    handleSelectionChange() {
      const deleteIds = []
      this.$refs.multipleTable.selection.forEach(data => deleteIds.push(data.id))
      // this.multipleSelection = deleteIds
    },
    // table单选触发单选
    tableHandleCurrentChange(val) {
      if (val) {
        // 清空菜单的选中
        this.$refs.permissions.setCheckedKeys([])
        if (val.name === 'admin') {
          this.changeDisabled(this.permissionsData, true)
          this.permissionIds = this.getAllPermissionDataId([], this.permissionsData)
          this.showButton = false
          this.step = 3
        } else {
          this.changeDisabled(this.permissionsData, false)
          // 保存当前的角色id
          this.currentId = val.id
          // 初始化默认选中的key
          this.permissionIds = val.permissions
          // 显示授权按钮
          this.showButton = true
          // 步骤显示
          this.step = 1
        }
      }
    },

    // 当页码改变后触发到此方法，val 是当前点击（或输入）的那个页码，
    handleCurrentChange(val) {
      this.page.pn = val
      this.fetchData()
    },
    // 条件查询
    queryData() {
      this.page.pn = 1
      this.fetchData()
    },
    reload() {
      this.form = {}
      this.fetchData()
    },
    getRowKeys(row) {
      return row.id
    },
    // 关闭弹窗
    close() {
      this.visible = false
      this.curId = null
    },
    // 新增
    createRole() {
      this.visible = true
    },
    authorize() {
      this.step = 3
      const permissionIds = this.$refs.permissions.getCheckedKeys()
      api.updateRolePermissions(this.currentId, permissionIds).then(res => {
        this.$message({
          message: '授权成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
  },


}
</script>
