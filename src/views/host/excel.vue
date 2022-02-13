<template>
  <el-dialog :visible.sync="excelVisible" :title="'批量导入'" width="800px" :before-close="close">
    <el-divider></el-divider>
    <el-alert show-icon
              title="导入或输入的密码仅作首次验证使用，并不会存储密码。"
              type="info">
    </el-alert>
    <el-form :rules="rules" ref="formData" :model="formData" label-width="150px"
             label-position="right" style="width: 600px" status-icon>
      <el-form-item label="模板下载：" help="请下载使用该模板填充数据后导入">
        <el-tooltip content="使用该模板填充数据后导入" placement="bottom" effect="light">
          <el-link href="./../../../主机导入模板.xlsx" type="primary" download="主机导入模板.xlsx">主机导入模板.xlsx</el-link>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="默认密码：" prop="password">
        <el-tooltip content="如果Excel中密码为空则使用该密码" placement="bottom" effect="light">
          <el-input placeholder="请输入默认主机密码" v-model="formData.defaultPassword" maxlength="30"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="导入数据：" required>
        <el-upload
          ref="uploadExcel"
          accept=".xls"
          action
          :http-request="httpRequest"
          :before-remove="beforeRemove"
          :before-upload="beforeExcelUpload"
          :auto-upload="false"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
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
    excelVisible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        defaultPassword: '',
      },
      fileList: [], // 文件对象列表
      rules: {
        file: [{required: true, trigger: 'change', message: '请上传文件'}],
      }
    }
  },

  methods: {
    beforeExcelUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'xls') {
        this.$notify.warning({
          title: '警告',
          message: `只能上传Excel（即后缀是.xls）的文件`
        })
      }
      if (size > 10) {

        this.$notify.warning({

          title: '警告',
          message: `文件大小不得超过10M`
        })
      }
      // type.size 也可对文件大小进行限制
      // return isXlsx
    },
    handleExceed(files, fileList) {
      console.log('handleExceed', fileList)
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 覆盖默认的上传行为，可以自定义上传的实现，将上传的文件依次添加到fileList数组中,支持多个文件
    httpRequest(option) {
      this.fileList.push(option)
    },
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
          this.$refs.uploadExcel.submit()
          const excelFormData = new FormData();
          console.log('this.fileList', this.fileList)
          console.log('this.formData.defaultPassword', this.formData.defaultPassword)
          this.fileList.forEach((file) => {
            excelFormData.append(`host_excel`, file.file);
          });
          console.log('excelFormData 111111', excelFormData)
          excelFormData.append('default_password', this.formData.defaultPassword);

          console.log('excelFormData>>>', excelFormData);
          api.createExcelHost(excelFormData).then(res => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.search()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
