<template>
  <el-dialog :visible.sync="visible" :title="curId ? '编辑主机' : '新增主机'" width="800px" :before-close="close">
    <el-form :rules="rules" ref="formData" :model="formData" label-width="150px"
             label-position="right" style="width: 600px" status-icon>
      <el-form-item label="主机类别">
        <el-select v-model="formData.category" placeholder="请选择主机类别">
          <el-option
            v-for="item in categorys"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主机名：" prop="hostname">
        <el-input v-model="formData.hostname" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="输入链接信息：" required>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="username">
              <el-input v-model="formData.username">
                <template slot="prepend">用户名:</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="ip_addr">
              <el-input v-model="formData.ip_addr">
                <template slot="prepend">@</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port">
              <el-input v-model="formData.port" prop="port">
                <template slot="prepend">端口号:</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="连接密码：" prop="password">
        <el-input v-model="formData.password" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input v-model="formData.desc" maxlength="30"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import * as api from '@/api/host/server'


export default {
  props: {
    visible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
  },

  data() {
    return {
      formData: {
        username: '',
        category: '',
        hostname: '',
        ip_addr: '',
        port: 22,
        password: '',
        desc: ''
      },
      categorys: {}, // 主机类别
      rules: {
        hostname: [{required: true, trigger: 'blur', message: '主机名不能为空'}],
        ip_addr: [{required: true, trigger: 'blur', message: 'ip地址不能为空'}],
        username: [{required: true, trigger: 'blur', message: '用户名不能为空'}],
        password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
        port: [{required: true, trigger: 'blur', message: '端口不能为空'}],
        desc: [{required: true, trigger: 'blur', message: '描述不能为空'}]
      }
    }
  },
  watch: {
    visible(v) {
      if (v) {
        api.getHostType().then(res => {
          this.categorys = res.data.results
        })
        if (this.curId) {
          api.getHost(this.curId).then(res => {
            this.formData = res.data
            console.log(res.data)
          })
        }
      }
    }
  },

  methods: {
    close() {
      console.log('关闭前的formData', {...this.formData})
      console.log('关闭前的formData', this.formData.desc)
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
            api.updateHost(this.curId, this.formData).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            api.createHost(this.formData).then(res => {
              console.log('提交formData', this.formData.category)
              console.log('提交formData', this.formData.ip_addr)
              console.log('提交formData', this.formData.desc)
              console.log('提交formData', this.formData.hostname)
              console.log('提交formData', this.formData.password)
              console.log('提交formData', this.formData)
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
