<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">
      <el-row :gutter="5">
        <el-col :span="4">
          <div>
            <el-form-item prop="search">
              <span style="color: #000000">发布环境：</span>
              <el-select v-model="deploy_env" placeholder="请选择" style="width: 120px">
                <el-option
                  v-for="item in envs_data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-form-item prop="search">
              <span style=" color: #000000">应用名称：</span>
              <el-select v-model="deploy_app_name" placeholder="请选择" style="width: 120px">
                <el-option
                  v-for="item in app_data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div>
            <el-form-item prop="search">
              <span style="color: #000000">申请时间：</span>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }">
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: startTime
            }">
              </el-time-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item>
              <el-button icon="el-icon-search" type="info" @click="queryData">搜索</el-button>
              <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
              <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleCreateDeployApply()">新建发布申请
              </el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="release_apply_category" style="display: flex;justify-content: space-between;">
      <el-radio-group v-model="apply_category" size="small" @change="handleCategoryChange">
        <el-radio-button label="0">
          全部({{ release_apply_data.length }})
        </el-radio-button>
        <el-radio-button :label="status_value[0]" v-for="(status_value,status_index) in release_apply_status_data"
                         :key="status_index">
          {{ status_value[1] }}({{ classify_release_apply_data[status_value[0]].length }})
        </el-radio-button>
      </el-radio-group>
    </div>
    <div style="margin-top: 20px;">
      <el-table
        ref="table"
        :data="different_status_release_apply"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_title" label="申请标题"></el-table-column>
        <el-table-column prop="app_name" label="应用"></el-table-column>
        <el-table-column prop="envs_name" label="发布环境"></el-table-column>
        <el-table-column prop="git_release_version" label="版本"></el-table-column>
        <el-table-column prop="get_release_status_display" label="状态"></el-table-column>
        <el-table-column prop="username" label="申请人"></el-table-column>
        <el-table-column prop="created_time" label="申请时间"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.release_status==='1'">
              <el-button type="info" icon="el-icon-edit" @click="review_info(scope.row)" size="mini">审核</el-button>
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-edit" @click="handleDelete(scope.row.id)" size="mini">删除
              </el-button>
            </div>
            <div v-else-if="scope.row.release_status==='2'">
              <el-button type="info" icon="el-icon-edit" size="mini">
                <router-link :to="'/newrelease/release_result/' + scope.row.id + '/'">发布</router-link>
              </el-button>
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">查看</el-button>
            </div>
            <div v-else-if="scope.row.release_status==='3'">
              <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">查看</el-button>
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">回滚</el-button>
            </div>
            <div v-else-if="scope.row.release_status==='4'">
              <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">快查看吧</el-button>
            </div>
            <div v-else>
              <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">查看</el-button>
            </div>
          </template>
          <!--          <template slot-scope="scope" v-if="scope.row.release_status==='2'">-->
          <!--            <el-button type="info" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">发布</el-button>-->
          <!--            <el-button type="primary" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">查看</el-button>-->
          <!--          </template>-->
          <!--          <template slot-scope="scope" v-if="scope.row.release_status==='3'">-->
          <!--            <el-button type="info" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">查看</el-button>-->
          <!--            <el-button type="primary" icon="el-icon-edit"  @click="handleEdit(scope.row)" size="mini">回滚</el-button>-->
          <!--          </template>-->
        </el-table-column>
      </el-table>
    </div>


    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.pn"
      :page-sizes="[10, 20, 50]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑组件 -->
    <edit :visible="visible" :cur-id="curId" @close="close" @search="fetchData"/>
    <review :reviewVisible="reviewVisible" :release-id="release_id" @close="reviewClose" @search="fetchData"/>
    <apply :deployApplyOuterVisible="deployApplyOuterVisible" @search="fetchData" @close="outClose"/>

  </div>
</template>

<script>

import * as api from '@/api/newrelease/app/app'

import Edit from './edit'
import Apply from './apply'
import Review from './review'

export default {
  name: 'ReleaseApply', // 和对应路由表中配置的name值一致

  components: {Edit, Apply, Review},

  data() {
    return {
      form: {
        pn: 1,
        size: 20,
        search: '',
        ordering: 'id'
      },
      deployApplyOuterVisible: false, // 新建发布申请模态框
      deploy_env: '', // 下拉框发布环境
      deploy_app_name: '', // 下拉框应用名称
      startTime: '',
      endTime: '',
      total: 0,
      visible: false,
      deployOuterVisible: false,
      curId: null,
      reviewVisible: false, // 审核模态框
      release_id: 0, // 审核数据ID
      envs_data: [],  // 环境数据
      envs_id: 1, // 所选环境的id值
      app_data: [],  // 应用数据
      release_apply_data: [],  // 发布申请数据
      classify_release_apply_data: {},  // 所有分类归纳的发布申请数据
      different_status_release_apply: [], // 点击不同分类时的 发布申请数据
      release_apply_status_data: [],  // 发布申请状态数据
      // [{1: '待审核'}, {2: '待发布'}}]
      // 根据分类划分出5个数据
      release_apply_data_1: [], // 待审核数据
      release_apply_data_2: [], // 待发布数据
      release_apply_data_3: [], // 发布成功数据
      release_apply_data_4: [], // 发布异常数据
      release_apply_data_5: [], // 其他类型数据

      // data,
      apply_category: '0',  // 发布申请分类，默认为全部
      choose_app_visible: false,
      new_release_visible: false,
      new_release_form_data: {
        labelCol: {span: 4},
        wrapperCol: {span: 14},
        other: '',
        form: {
          apply_title: '', // 申请标题
          git_release_branch_or_tag: '1',  // 申请选择的是git分支还是标签
          git_release_version: '1', // 分支/标签 的版本
          git_release_commit_id: '', // git的commit id 数据

          release_desc: '',  // 备注信息
        }
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

  created() {
    this.fetchData()
    // 获取发布申请记录状态数据
    this.get_release_apply_status_data();
  },

  methods: {
    async fetchData() {
      console.log('子组件调用:', 'xxxxxxxx')
      const {data} = await api.getReleaseApply(this.form)
      this.release_apply_data = data.results
      this.total = data.count
      // 根据不同status对数据进行分类
      this.classify_release_data_by_status();
      this.different_status_release_apply = this.release_apply_data;
    },

    get_release_apply_status_data() {
      api.getReleaseApplyStatus().then(res => {
        this.release_apply_status_data = res.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    // 根据发布申请的状态，将发布申请数据进行分类,请求数据回来之后，就执行该方法
    classify_release_data_by_status() {
      this.release_apply_data.forEach((k, v) => {
        if (k.release_status === '1') {
          this.release_apply_data_1.push(k);
        } else if (k.release_status === '2') {
          this.release_apply_data_2.push(k);
        } else if (k.release_status === '3') {
          this.release_apply_data_3.push(k);
        } else if (k.release_status === '4') {
          this.release_apply_data_4.push(k);
        } else {
          this.release_apply_data_5.push(k);
        }

      });
      this.classify_release_apply_data['0'] = this.release_apply_data
      this.classify_release_apply_data['1'] = this.release_apply_data_1
      this.classify_release_apply_data['2'] = this.release_apply_data_2
      this.classify_release_apply_data['3'] = this.release_apply_data_3
      this.classify_release_apply_data['4'] = this.release_apply_data_4
      this.classify_release_apply_data['5'] = this.release_apply_data_5

    },

    // val 是切换之后的每页显示多少条
    handleSizeChange(val) {
      this.form.size = val
      this.fetchData()
    },

    // 当页码改变后触发到此方法，val 是当前点击（或输入）的那个页码，
    handleCurrentChange(val) {
      this.form.pn = val
      this.fetchData()
    },

    // 条件查询
    queryData() {
      // 将页码变为1，第1页
      this.form.pn = 1
      this.fetchData()
    },

    // 重置
    reload() {
      this.form = {}
      this.fetchData()
    },
    // 弹出新增窗口, 新建应用
    handleCreate() {
      this.visible = true
    },
    // 编辑应用，弹出窗口
    handleEdit(row) {
      this.curId = row.id
      this.visible = true
    },
    // 删除应用
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        api.deleteReleaseApply(id).then(response => {
          // 处理响应结果提示
          this.$message({
            type: response.code === 200 ? 'success' : 'error',
            message: response.message
          });
          // 刷新列表数据
          if (response.code === 200) {
            this.fetchData()
          }
        })
      }).catch(() => {
        // 取消删除，不用理会
      })
    },
    // 关闭弹窗(编辑应用、新建应用)
    close() {
      this.visible = false
      this.curId = null
    },
    /////////
    // 新建发布
    // 关闭弹窗(新建发布外层弹窗)
    outClose() {
      this.deployApplyOuterVisible = false
    },
    reviewClose() {
      this.reviewVisible = false
      this.release_id = null
    },
    // 发布类型按钮点击切换效果
    handleCategoryChange(label) {
      console.log('>>>label change', label)
      this.apply_category = label;
      this.different_status_release_apply = this.classify_release_apply_data[this.apply_category]
      // console.log(0)
      console.log(this.apply_category, typeof this.apply_category);
    },
    // 新建发布申请
    handleCreateDeployApply() {
      this.deployApplyOuterVisible = true
    },
    // 审核模态框
    // 点击审核,记录id值并弹出审核对话框
    review_info(row) {
      this.release_id = row.id
      console.log('release_id>>>', this.release_id);
      // this.review_data.release_id = release_id;
      this.reviewVisible = true;
    },

  }
}
</script>



