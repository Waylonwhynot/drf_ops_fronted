<template>
  <el-dialog :title="curId ? '编辑应用' : '新增应用id'" :visible.sync="visible" width="500px" :before-close="handleClose">
    <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
      <el-form-item label="应用名称：" prop="appname">
        <el-input v-model="formData.appname"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input type="textarea" v-model="formData.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import * as api from '@/api/msg/appid'

export default {
  props: {
    visible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formData: {
        appname: '',
        desc: ''
      },
      rules: {
        appname: [ // prop值
          {required: true, message: '请输入应用名称', trigger: 'blur'},
        ],
      }
    }
  },
  watch: {
    visible(v) {
      if (v) {
        if (this.curId) {
          api.getAppid(this.curId).then(res => {
            this.formData = res.data
          })
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.formData.resetFields()
      this.$emit('close')
    },
    search() {
      this.handleClose()
      this.$emit('search')
    },
    // 提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if (this.curId) {
            if (!this.formData.department) {
              this.formData.department = null
            }
            api.updateAppid(this.curId, this.formData).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            console.log(this.formData)
            api.createAppid(this.formData).then(res => {
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
    },
  }
}
</script>
