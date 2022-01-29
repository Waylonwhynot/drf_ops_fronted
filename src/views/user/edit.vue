<template>
  <el-dialog :title="curId ? '编辑用户' : '新增用户'" :visible.sync="visible" width="500px" :before-close="close">
    <el-form :rules="rules" ref="formData" :model="formData" label-width="100px"
             label-position="right" style="width: 400px" status-icon>
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="formData.username" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="formData.mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formData.email" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <treeselect
          v-model="formData.department"
          :options="departmentsData"
          style="width: 178px"
          placeholder="选择部门"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="formData.roles" multiple placeholder="选择角色">
          <el-option
            v-for="item in rolesData"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import * as api from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getRoles } from '@/api/role'
export default {
  name: 'Edit',
  components: { Treeselect },
  props: {
    visible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    departmentsData: {
      type: Array,
      default: () => {
        return
      }
    },
    curId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      formData: {
        username: '',
        email: '',
        department: null,
        roles: null
      },
      // 校验表单
      rules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      },
      rolesData: [],
    }
  },
  watch: {
    visible(v) {
      if (v) {
        if (this.curId) {
          api.getUser(this.curId).then(res => {
            this.formData = res.data
            console.log(res)
          })
        }
        this.getRoles()
      }
    }
  },

  methods: {
    search() {
      this.close()
      this.$emit('fetchData')
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            if (!this.formData.department) {
              this.formData.department = null
            }
            api.updateUser(this.curId, this.formData).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            console.log('')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRoles() {
      getRoles().then(res => {
        this.rolesData = res.data.results
      })
    },

    async submitData() {
      let response = null
    },

    // 关闭窗口
    close() {
      this.$refs['formData'].resetFields()
      this.$emit('close')
    }

  }
}
</script>
