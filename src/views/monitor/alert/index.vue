<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="form" size="mini">

      <el-select v-model="form.alert_type" multiple filterable placeholder="告警类型" size="mini">
        <el-option
          v-for="item in alert_type_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select  v-model="form.status" multiple filterable placeholder="告警状态" size="mini">
        <el-option
          v-for="item in alert_status_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="form.env" placeholder="环境" multiple filterable size="mini">
        <el-option
          v-for="item in alert_env_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        size="mini"
        v-model="date_value"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-form-item prop="search">
        <el-input v-model="form.search" placeholder="主机名" icon=search size="mini"></el-input>
      </el-form-item>
      <!--      </div>-->
      <el-form-item>
        <el-button icon="el-icon-search" type="success" @click="queryData">Get Data</el-button>
        <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>
      </el-form-item>

    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column label="告警ID" prop="eventID" width="150"></el-table-column>
      <el-table-column label="等级" prop="eventLevel" width="150"></el-table-column>
      <el-table-column label="主机名" prop="hostname" width="200"></el-table-column>
      <el-table-column label="告警项" prop="eventName" width="400"></el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='recovery'" type="primary" size="mini">已恢复</el-button>
          <el-button v-else type="warning" size="mini">故障中</el-button>
        </template>
      </el-table-column>
      <el-table-column label="告警分类" width="100" prop="alert_type"></el-table-column>
      <el-table-column label="环境" width="100" prop="env"></el-table-column>
      <el-table-column label="故障时长(s)" prop="alertTime" width="100"></el-table-column>
      <el-table-column label="告警时间" prop="startTime"></el-table-column>
      <el-table-column label="恢复时间" prop="recoveryTime"></el-table-column>
    </el-table>

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
  </div>
</template>

<script>

import * as api from '@/api/monitor/alertcenter'


export default {
  name: 'Alert', // 和对应路由表中配置的name值一致

  data() {
    return {
      tableData: [],
      // page: {
      //   pn: 1,
      //   size: 20,
      //   total: 0
      // },
      form: {
        pn: 1,
        size: 20,
        search: '',
        ordering: 'id',
        env: '',
        alert_type: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      // 时间选择器数据
      date_value: '',
      alert_type_options: [],
      alert_status_options: [],
      alert_env_options: [],
      total: 0
    }
  },

  created() {
    this.fetchData()
    this.fetchAlertData()
  },

  methods: {
    async fetchData() {
      const {data} = await api.getAlerts(this.form)
      this.tableData = data.results
      this.total = data.count
    },
    async fetchAlertData() {
      //  告警类型
      const data_alert_type = await api.getAlertType()
      this.alert_type_options = data_alert_type.data.results
      //  告警状态
      const data_alert_status = await api.getAlertStatus()
      this.alert_status_options = data_alert_status.data.results
      //  环境
      const data_alert_envs = await api.getAlertEnvs()
      this.alert_env_options = data_alert_envs.data.results
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
      // 将时间分为开始时间结束时间传递给后端
      this.form.start_time = this.date_value[0]
      this.form.end_time = this.date_value[1]
      this.fetchData()
      console.log(this.form)
    },

    // 重置
    reload() {
      this.form = {}
      this.fetchData()
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
