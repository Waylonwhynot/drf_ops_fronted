<template>
  <el-dialog :title="'选择应用'" :visible.sync="deployApplyOuterVisible" width="800px" :before-close="handleClose">
    <el-dialog width="900px" title="新建发布申请" :visible.sync="new_release_visible" append-to-body :before-close="handleDeployApplyClose">
      <el-form :rules="rules" ref="ruleForm" :model="new_release_form_data.form" label-width="150px" label-position="right" style="width: 800px" status-icon>
        <el-form-item label="申请标题：" prop="apply_title">
          <el-input v-model="new_release_form_data.form.apply_title"></el-input>
        </el-form-item>
        <el-form-item label="选择分支/标签版本：" prop="version">
          <el-select v-model="new_release_form_data.form.git_release_branch_or_tag" placeholder="请选择" style="width: 50%;">
            <el-option label="branch" value="1"></el-option>
            <el-option label="Tag" value="2"></el-option>
          </el-select>
          <el-select v-model="new_release_form_data.form.git_release_version" placeholder="请选择" style="width: 50%;">
            <el-option  :value="branch_value" v-for="(branch_value, branch_index) in git_branches" :key="branch_index">
              {{branch_value}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择Commit ID：" prop="git_release_commit_id" v-if="new_release_form_data.form.git_release_branch_or_tag==='1'">
            <el-select v-model="new_release_form_data.form.git_release_commit_id" placeholder="请选择" style="width: 100%;">
              <el-option :value="commit_info_index" v-for="(commit_info_value, commit_info_index) in git_branches_commit_info" :key="commit_info_index">
                {{commit_info_value}}
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="备注信息：" prop="release_desc">
          <el-input type="textarea" v-model="new_release_form_data.form.release_desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreateApplySubmit('formData')" size="mini">确定</el-button>
          <el-button size="mini" @click="resetCreateApplyForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
     <el-row>
       <el-col :span="6">
         <div class="grid-content bg-purple">
           <el-menu
             default-active="1"
             class="el-menu-vertical-demo"
             >
             <el-menu-item :index="envs_value.id.toString()" :key="envs_index" v-for="(envs_value,envs_index) in envs_data" @click="change_env_event(envs_value.id)">
               <i class="el-icon-menu"></i>
               <span>{{envs_value.name}}</span>
             </el-menu-item>
           </el-menu>
         </div>
       </el-col>
       <el-col :span="18">
         <el-row type="flex" justify="space-around" align="middle">
           <el-col :span="8" :key="app_index" v-for="(app_value,app_index) in app_data">
             <p style="height: 80px;line-height: 80px;text-align: center">
               <el-button @click="show_new_release_apply(app_value.release_app__id)" type="primary" style="height: 50px;width: 150px;">
                 {{app_value.release_app__name}}
               </el-button>
             </p>
           </el-col>
         </el-row>
       </el-col>
     </el-row>
   </el-dialog>

</template>

<script>
import {getApps, createReleaseApply, getEnvApps, getGitBranch} from "@/api/newrelease/app/app";
import {getEnvs} from '@/api/confcenter/environment/env'

export default {
  name: "apply",
  props: {
    deployApplyOuterVisible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    }
  },
  created() {
    this.get_envs_data()
    this.change_env_event();
  },
  data() {
    return {
      envs_data: [],  // 环境数据
      envs_id:1, // 所选环境的id值
      app_data:[],  // 应用数据
      new_release_visible: false, //
      git_branches:[], // 不同应用的新建发布对应的git仓库的分支信息
      git_branches_commit_info:[], // 不同分支的commit版本信息，默认先获得master分支的，业务级别就定好有master分支
      new_release_form_data: {
        other: '',
        form: {
          apply_title: '', // 申请标题
          git_release_branch_or_tag:'1',  // 申请选择的是git分支还是标签
          git_release_version:'master', // 分支/标签 的版本, 也就是我们选择哪个分支
          git_release_commit_id: '', // git的commit id 数据
          release_record:0,
          release_desc: '',  // 备注信息
        },
      },
      rules: {
        apply_title: [
          {required: true, message: '请输入申请标题', trigger: 'blur'},
          {min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur'},
        ],
        git_release_branch_or_tag: [{required: true, message: '请选择分支还是标签', trigger: 'change'}],
        git_release_version: [{required: true, message: '请选择版本', trigger: 'change'}],

        git_release_commit_id: [{required: true, message: '请选择commit ID', trigger: 'change'}],

      },
    }
  },
  watch:{
    'new_release_form_data.form.git_release_version':function (val) {
      // this.get_branch_commit_history()
      // console.log('val', val);

      this.show_new_release_apply(); // 执行获取不同分支的版本数据

    }
  },
  methods: {
    get_envs_data() {
      getEnvs().then(res => {
        this.envs_data = res.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    // 关闭模态框
    handleClose() {
      // this.$refs.formData.resetFields()
      this.$emit('close')
    },
    // menu
    handleDeployOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleDeployClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 切换环境时，展示对应的环境的应用，后端需要重写下get_queryset方法
    change_env_event(id){
      if(!id) {
        id = this.envs_id
      }
      console.log('环境id', id)
      // /release/envs/apps/
      getEnvApps({'envs_id': id}).then(res => {
        this.app_data = res.data
      }).catch((error) => {
        console.log(error)
      })
    },
    envs_menu_change(key, keyPath) {
      //  key是环境id
      this.envs_id = key;
      this.change_env_event();
    },
    // 点击应用，弹出新建发布申请的弹框
    show_new_release_apply(app_id=null) {
      console.log('app_id>> ',app_id);
      // 发送请求，获取分支数据以及不同分支的commits版本数据
      if (app_id){
        this.app_id = app_id;
      }
      getGitBranch({app_id: this.app_id, branches:this.new_release_form_data.form.git_release_version,}).then(res => {
        this.git_branches = res.data.branch_list;
        this.git_branches_commit_info = res.data.commits;
        this.new_release_form_data.form.release_record = res.data.release_record_id;
      }).catch((error) => {
        console.log(error)
      })
      this.new_release_visible = true;
    },
    handleDeployApplyClose() {
      this.$refs.ruleForm.resetFields()
      this.new_release_visible = false
    },
    // 点击新建发布的弹框中的取消按钮的效果
    resetCreateApplyForm() {
      this.$refs.ruleForm.resetFields();
      this.new_release_visible = false;
    },
    // 点击新建发布的弹框中的确认按钮的效果，提交发布申请的数据
    onCreateApplySubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log('>>>>>>>>>>',this.new_release_form_data.form);
          createReleaseApply(this.new_release_form_data.form).then(res => {
            this.$message.success('新建发布成功！');
            this.handleDeployApplyClose()
            this.handleClose()
            this.search()
          }).catch((error) => {
            console.log('error submit!!')
            this.$message.error(`新建发布失败！原因：${error.response.data}`);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search(){
      this.$emit('search')
    }
  }
}
</script>

<style scoped>

</style>
