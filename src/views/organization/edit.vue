<template>
  <el-dialog :visible.sync="visible" :title="curId ? '编辑部门' : '新增部门'" width="500px" :before-close="close">
    <el-form :rules="rules" ref="formData" :model="formData" label-width="100px"
             label-position="right" style="width: 400px" status-icon>
      <el-form-item label="部门：" prop="name">
        <el-input v-model="formData.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="父部门" prop="pid">
        <treeselect
          v-model="formData.pid"
          :options="departments"
          style="width: 178px"
          placeholder="选择父部门"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import * as api from '@/api/org'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {createDepartment} from "@/api/org";

export default {
  components: {Treeselect},
  props: {
    visible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
    departments: {
      type: Array,
      default: () => {
        return
      }
    }
  },

  data() {
    return {
      formData: {
        name: '',
        pid: null
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: '部门名不能为空'}]
      }
    }
  },
  watch: {
    visible(v) {
      if (v) {
        console.log(this.departments)
        if (this.curId) {
          api.getDepartment(this.curId).then(res => {
            this.formData = res.data
          })
        }
      }
    }
  },

  methods: {
    close() {
      this.$refs.formData.resetFields()
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            if (!this.formData.pid) {
              this.formData.pid = null
            }
            api.updateDepartment(this.curId, this.formData).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            api.createDepartment(this.formData).then(res => {
              console.log(this.formData)
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.search()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
