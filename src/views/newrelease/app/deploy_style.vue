<template>
  <el-dialog :title="'选择发布方式'" :visible.sync="deployOuterVisible" width="800px" :before-close="handleClose">

    <el-dialog width="900px" title="新建应用常规发布" :visible.sync="deployCommonVisible" append-to-body :before-close="handleCommonDeployClose">
      <div>
        <el-steps :active="active" finish-status="success">
          <el-step v-for="item in steps" :key="item.title" :title="item.title"></el-step>
        </el-steps>
        <div class="step-contents" style="margin-top: 20px">
          <el-form :rules="rules" ref="formData" :model="formData" label-width="150px" label-position="right"
                   style="width: 800px" status-icon>
            <div class="basic_config" v-show="active===0" style="width: 100%">
              <el-form-item label="发布环境：" prop="environment">
                <el-select v-model="formData.environment" placeholder="请选择发布环境">
                  <el-option
                    v-for="item in env_data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Git仓库地址：" prop="git_addr">
                <el-input v-model="formData.git_addr"></el-input>
              </el-form-item>
              <el-form-item label="发布审核：" prop="delivery">
                <el-switch
                  v-model="msg_notice_status"
                  @change="msg_notice"
                  active-text="开"
                  inactive-text="关">
                </el-switch>
              </el-form-item>
              <el-form-item label="发布审核：" prop="delivery">
                <el-input class="input-with-select" placeholder="请输入内容" @change="handleChange"
                          v-model="formData.msg_content" :disabled="!msg_notice_status">
                  <el-select v-model="formData.msg_type" slot="prepend" placeholder="请选择" style="width: 100px;">
                    <el-option label="关闭" value="1"></el-option>
                    <el-option label="钉钉" value="2"></el-option>
                    <el-option label="短信" value="3"></el-option>
                    <el-option label="邮件" value="4"></el-option>
                  </el-select>
                </el-input>
                <span>应用审核及发布成功或失败结果通知</span>
              </el-form-item>
            </div>
            <div class="pub_host" v-show="active===1">
              <el-form-item label="目标主机部署路径：" prop="target_host_pub_path">
                <el-input v-model="formData.target_host_pub_path"></el-input>
                <span style="color:darkgrey">目标主机的应用根目录，例如：/var/www/html</span>
              </el-form-item>
              <el-form-item label="目标主机仓库路径：" prop="target_host_repository_path">
                <el-input v-model="formData.target_host_repository_path"></el-input>
                <span style="color:darkgrey">此目录用于存储应用的历史版本，例如：/data/hippo/repos</span>
              </el-form-item>
              <el-form-item label="保留历史版本数量：" prop="keep_history_count">
                <el-input v-model="formData.keep_history_count"></el-input>
                <span style="color:darkgrey">早于指定数量的历史版本会被删除，以释放空间</span>
              </el-form-item>
              <el-form-item label="发布目标主机选择：" prop="pub_target_host_choose">
                <el-select v-model="formData.pub_target_host_choose" multiple placeholder="please select your zone">
                  <el-option
                    v-for="item in hosts_data"
                    :key="item.id"
                    :label="item.ip_addr"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="task_config" v-show="active===2">
              <el-row style="width: 100%">
                <el-col :span="11">
                  <div class="file_filter" style="margin-bottom: 20px;">
                    <div class="file_filter_head">
                      <span>文件过滤：</span>
                      <span>
                        <el-radio-group v-model="filefilterway" @change="filterfilteronChange">
                          <el-radio :label="1">
                            包含
                            <el-tooltip content="仅将匹配文件放到目标主机" placement="top">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </el-radio>
                          <el-radio :label="2">
                            排除
                            <el-tooltip content="匹配文件将不会放到目标主机" placement="top">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </el-radio>
                        </el-radio-group>
                      </span>
                    </div>
                    <div>
                      <editor v-model="file_filter_cmd_content" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                  <div class="before_code_check_out" style="margin-bottom: 20px;">
                    <div class="before_code_check_out_head">
                      <span>代码检出前执行：</span>
                      <span>
                        <el-tooltip content="在部署了hippo项目的服务器上执行，拉去代码之前可以执行任意指令" placement="top">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div>
                      <editor v-model="before_code_check_out_value" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                  <div class="before_release" style="margin-bottom: 20px;">
                    <div class="before_release_head">
                      <span>应用发布前执行：</span>
                      <span>
                        <el-tooltip content="在发布的目标主机上运行，当前目录为目标主机上待发布的源代码目录，可执行任意自定义命令" placement="top">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div>
                      <editor v-model="before_release_content" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div style="margin-top: 37px;vertical-align: center;text-align: center;height: 100px;width: 60px">
                    <i class="el-icon-setting" style="font-size: 32px"></i>
                    <br>
                    <span>基础设置</span>
                  </div>
                  <div style="margin-top: 37px;vertical-align: center;text-align: center;height: 100px;width: 60px">
                    <i class="el-icon-paperclip" style="font-size: 32px"></i>
                    <br>
                    <span>代码检出</span>
                  </div>
                  <div style="margin-top: 37px;vertical-align: center;text-align: center;height: 100px;width: 60px">
                    <span><i class="el-icon-d-arrow-left" style="font-size: 16px"></i><i class="el-icon-d-arrow-right"
                                                                                         style="font-size: 16px"></i></span>
                    <br>
                    <span>版本切换</span>
                  </div>
                </el-col>
                <el-col :span="11">
                  <div class="custom_global_variable" style="margin-bottom: 20px;">
                    <div class="custom_global_variable_head">
                      <span>自定义全局变量：</span>
                      <span>
                        <el-tooltip content="Hippo 内置了一些全局变量，这些变量可以直接使用，请参考官方文档: a标签跳转" placement="top">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div>
                      <editor v-model="custom_global_variable" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                  <div class="after_code_check_out" style="margin-bottom: 20px;">
                    <div class="after_code_check_out_head">
                      <span>代码检出后执行：</span>
                      <span>
                        <el-tooltip content="在部署 Hippo 的服务器上运行，当前目录为检出后待发布的源代码目录，可执行任意自定义命令" placement="top">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div>
                      <editor v-model="after_code_check_out_value" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                  <div class="after_release" style="margin-bottom: 20px;">
                    <div class="after_release_head">
                      <span>应用发布后执行：</span>
                      <span>
                        <el-tooltip content="在发布的目标主机上运行，当前目录为已发布的应用目录，可执行任意自定义命令" placement="top">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div>
                      <editor v-model="after_release_value" @init="editorInit" lang="html" theme="chrome"
                              width="100%" height="100"></editor>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="steps-action" style="margin-top: 20px;">
              <el-form-item>
                <el-button :disabled="next_status_control()" style="margin-top: 12px;" v-if="active < steps.length - 1" type="primary" @click="next">下一步</el-button>
<!--                <el-button style="margin-top: 12px;" v-if="active < steps.length - 1" type="primary" @click="next">下一步-->
<!--                </el-button>-->
                <el-button v-if="active === steps.length - 1" type="primary" style="margin-top: 12px;" @click="onSubmit('formData')">提交
                </el-button>
                <el-button v-if="active > 0" style="margin-top: 12px;" @click="prev">上一步</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

      </div>
    </el-dialog>
    <el-dialog width="45%" title="内层2 Dialog" :visible.sync="deployCustomVisible" append-to-body>


    </el-dialog>
    <div style="background-color: #ececec; padding: 20px;">
      <el-row :gutter="20">
        <el-col :span="12" @click.native="deployCommonVisible = true">
          <div class="grid-content bg-purple">
            <el-card shadow="hover" class="box-card">
              <div style="display: flex;">
                <div style="margin-right: 16px;">
                  <i class="el-icon-s-order" style="font-size: 36px; color: rgb(24, 144, 255);"></i>
                </div>
                <div>
                  <div style="margin-bottom: 12px;font-weight: 500;font-size: 16px; color: rgba(0,0,0,.85);">
                    <span>常规发布</span>
                  </div>
                  <div>
                    由 Hippo 来控制发布的主流程，你可以通过添加钩子脚本来执行额外的自定义操作。
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12" @click.native="deployCustomVisible = true">
          <div class="grid-content bg-purple-light">
            <el-card shadow="hover" class="box-card">
              <div style="display: flex;">
                <div style="margin-right: 16px;">
                  <i class="el-icon-s-operation" style="font-size: 36px; color: rgb(24, 144, 255);"></i>
                </div>
                <div>
                  <div style="margin-bottom: 12px;font-weight: 500;font-size: 16px; color: rgba(0,0,0,.85);">
                    <span>自定义发布</span>
                  </div>
                  <div>
                    你可以完全自己定义发布的所有流程和操作，Hippo 负责按顺序依次执行你记录的动作。
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import {createAppDeploy} from '@/api/newrelease/app/app'
import {getEnvs} from '@/api/confcenter/environment/env'
import {getEnvHosts} from '@/api/host/server'

export default {
  name: "deploy_style",
  props: {
    deployOuterVisible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    }
  },
  components: {
    editor: require('vue2-ace-editor'),
  },
  data() {
    return {
      steps: [
        {
          title: '基本配置',
          content: '基本配置',
        },
        {
          title: '发布主机',
          content: '发布主机',
        },
        {
          title: '任务配置',
          content: '任务配置',
        },
      ],
      formData: {
        // 新建发布
        git_addr: '',
        environment: undefined,
        msg_type: '0',
        msg_content: '',
        target_host_pub_path: '',
        target_host_repository_path: '',
        keep_history_count: '',
        // pub_target_host_choose:[],
        pub_target_host_choose: undefined,

      },
      rules: {
        git_addr: [
          {required: true, message: '请输入git地址', trigger: 'blur'},
          {min: 1, max: 64, message: 'Length should be 1 to 64', trigger: 'blur'},
        ],
        target_host_pub_path: [
          {required: true, message: 'Please input Activity name', trigger: 'blur'},
          {min: 3, max: 32, message: 'Length should be 3 to 5', trigger: 'blur'},
        ],
        target_host_repository_path: [
          {required: true, message: 'Please input Activity name', trigger: 'blur'},
          {min: 3, max: 32, message: 'Length should be 3 to 5', trigger: 'blur'},
        ],
        keep_history_count: [
          {required: true, message: 'Please input Activity name', trigger: 'blur'},
          {min: 1, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
        ],
        environment: [{required: true, message: '请选择环境', trigger: 'change'}],
        pub_target_host_choose: [{required: true, message: '请选择主机', trigger: 'change'}],
      },
      // 步骤每一步
      active: 0,
      // 应用发布环境
      env_data: [],
      // 主机数据
      hosts_data: [],
      // 发送消息通知
      msg_notice_status: false,
      // 常规发布弹出
      deployCommonVisible: false,
      // 自定义发布弹出
      deployCustomVisible: false,
      // 发布: 文件过滤方式
      filefilterway: 1,
      // 发布：过滤
      file_filter_cmd_content: '',
      before_code_check_out_value: '',
      before_release_content: '',
      custom_global_variable: '',
      after_code_check_out_value: '',
      after_release_value: '',
      // 提交最后的表单
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              release_app_id: this.curId,
              // 基础配置
              env_id: this.formData.environment,
              code_git_addr: this.formData.git_addr,
              msg_notice_status: this.msg_notice_status,
              msg_type: parseInt(this.formData.msg_type),
              msg_content: this.formData.msg_content,

              // 发布主机
              target_host_pub_path: this.formData.target_host_pub_path,
              target_host_repository_path: this.formData.target_host_repository_path,
              keep_history_count: this.formData.keep_history_count,
              pub_target_host_choose: this.formData.pub_target_host_choose,


              // 任务配置
              filefilterway: this.filefilterway, // 文件过滤方式 1表示包含 2表示过滤
              file_filter_cmd_content: this.file_filter_cmd_content,
              before_code_check_out_value: this.before_code_check_out_value,
              before_release_content: this.before_release_content,
              custom_global_variable: this.custom_global_variable,
              after_code_check_out_value: this.after_code_check_out_value,
              after_release_value: this.after_release_value,

            }
            console.log(data);
            createAppDeploy(data).then(res => {
              this.$message.success('新建发布成功！');
              this.handleCommonDeployClose()
              this.handleClose()
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
    }
  },
  created() {
    this.get_environments_data();
  },
  watch: {
    // 切换环境时，触发主机数据的筛选
    'formData.environment': function () {
        getEnvHosts({'env_id': this.formData.environment}).then(res=>{
          this.hosts_data = res.data.results
        })
    }
  },
  methods: {
    // 获取所有环境数据
    get_environments_data(){
      getEnvs().then(res=>{
        this.env_data = res.data.results
        console.log(this.env_data)
      })
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript')    //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    handleClose() {
      this.$emit('close')
    },
    handleCommonDeployClose() {
      this.$refs.formData.resetFields()
      this.deployCommonVisible = false
    },
    // 下一步
    next() {
      this.active++;
    },
    // 上一步
    prev() {
      this.active--;
    },
    // 控制下一步按钮的状态
    next_status_control() {
      if (this.active === 0 && (this.formData.git_addr === '' || this.formData.environment === undefined)) {
        return true
      } else if (this.active === 1 && (this.formData.target_host_pub_path === '' || this.formData.target_host_repository_path === '' || this.formData.keep_history_count === '' || this.formData.pub_target_host_choose === undefined)) {
        return true
      }
    },
    // 消息通知开启和关闭切换
    msg_notice(value) {
      console.log('>>>>>', value);
      this.msg_notice_status = value;
    },
    handleChange(value) {
      if (!value && this.msg_type !== 0) {
        this.$message.error('不能为空')
      } else {
        this.formData.msg_content = value;
        console.log(this.formData.msg_content)
      }
    },
    filterfilteronChange(e) {
      console.log('radio checked', e);
    },

  }

}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
