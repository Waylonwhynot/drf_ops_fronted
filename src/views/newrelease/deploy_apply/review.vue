<template>
  <el-dialog :title="releaseId ? '审核发布申请' : 'ID没有传递过来'" :visible.sync="reviewVisible" width="800px" :before-close="handleClose">
    <el-form ref="formData" :model="review_data.form" label-width="100px" label-position="right" style="width: 400px" status-icon>
      <el-form-item label="审核结果：">
        <el-switch
          v-model="review_data.review_status"
          active-text="通过"
          inactive-text="未通过"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="审核意见：">
        <el-input type="textarea" v-model="review_data.form.review_desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as api from '@/api/newrelease/app/app'

export default {
  name: "review",
  props: {
    reviewVisible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    releaseId: {
      type: Number,
      default: null
    }
  },
  data() {
    return{
      review_data:{
        review_status:false, // 审核状态，
        form: {
          release_status: '1', // 审核状态为true时，它的值为2，表示待发布
          review_desc: '',// 审核意见
        },
      },
    }
  },
  watch: {
    'review_data.review_status': function (val) {

      this.review_data.form.release_status = this.review_data.review_status ? '2':'1'
      console.log('>>>>>>>>>release_status',this.review_data.form.release_status)
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      // this.$refs.formData.resetFields()
      this.$emit('close')
    },
    // 提交表单数据
    submitForm(formName) {
      // 不用校验了
      if (this.releaseId) {
        console.log('看一下提交的数据',this.releaseId, this.review_data.form)
        api.updateApp(this.releaseId, this.review_data.form).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.search()
        })
      }else {
        console.log('error submit!!')
        return false
      }
    },
    search() {
      this.handleClose()
      this.$emit('search')
    },
  }
}
</script>

<style scoped>

</style>
