<template>
  <div class="dashboard-container">
    <div class="first-part">
      <div class="left-container">
        <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="24">
          <el-card >
            <div class="card-panel">
              <!-- <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="alert" class-name="card-panel-icon"/>
              </div> -->
              <div class="card-panel-description">
                <count-to
                  :start-val="0"
                  :end-val="this.dayMonitorData.today_alert"
                  :duration="1000"
                  class="card-panel-num"
                />
                <div class="card-panel-text">
                  今日故障中
                </div>
              </div>
              <i class="el-icon-warning icon-size warn"></i>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <el-card>
            <div class="card-panel">
              <!-- <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="recovery" class-name="card-panel-icon"/>
              </div> -->
              <div class="card-panel-description">
                <count-to
                  :start-val="0"
                  :end-val="this.dayMonitorData.today_recovery"
                  :duration="1000"
                  class="card-panel-num"
                />
                <div class="card-panel-text">
                  今日已恢复
                </div>
                <i class="el-icon-refresh-left icon-size resolve-icon"></i>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      </div>
      <div class="right-container">
        <el-card style="height: 100%;">
          <el-table :data="dayMonitorData.today_host_count">
            <el-table-column label="Hostname" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.hostname }}
              </template>
            </el-table-column>
            <el-table-column label="Alert Count" width="195" align="center">
              <template slot-scope="scope">
                {{ scope.row.alert_count }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <el-row style="margin-top:24px" :gutter="24">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card>
          <!--
            注意：echarts 在初始化实例的时候就要拿到数据，有数据就会展示出来
           -->
          <bar-chart v-if="flag" :xAxisData.sync="monthMonitorData.date_data"
                     :seriesData="monthMonitorData.monitor_data"/>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="dashboard-bottom-chart" :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card>
          <WeekBarChart
            v-if="flag"
            :xAxisData.sync="weekMonitorData.count_data"
            :seriesData="weekMonitorData.date_data"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import WeekBarChart from './components/WeekBarChart'

// 1. 导入js
import * as api from '@/api/monitor/alertcenter';

export default {
  name: 'DashBoard',
  components: {PieChart, BarChart, WeekBarChart, CountTo},

  data() {
    return {

      flag: false, // 判断是否显示图表组件
      monthMonitorData: {}, // 查询近1个月告警数据
      dayMonitorData: {}, // 查询近1天告警数据
      weekMonitorData: {
        date_data: Array,
        count_data: {}
      }, // 查询近1周告警分类数据
    }
  },

  mounted() {
    this.fetchAlertData()
  },

  methods: {
    async fetchAlertData() {
      const {data} = await api.getMonthAlert()
      this.monthMonitorData = data

      const res1 = await api.getDayAlert()
      this.dayMonitorData = res1.data

      const res2 = await api.getWeekAlert()
      this.weekMonitorData = res2.data
      console.log(this.weekMonitorData)
      console.log(this.weekMonitorData.date_data)
      console.log(this.weekMonitorData.count_data)

      // 先查询到数据后，再加载图表组件，将数据渲染
      this.flag = true;
    }
  }
}

</script>

<style lang="scss" scoped>

.dashboard-container .first-part{
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: space-between
}

.dashboard-container .first-part .left-container{
  width:300px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.dashboard-container .first-part .left-container .el-card{
  border:none;
  background: #ffffff;
  position: relative;
}
.icon-size{
  position: absolute;
  right: 32px;
  top: 54px;
  font-size: 40px;
}
.warn{
  color: red;
}
.resolve-icon{
  color: #409eff;
}
.dashboard-container .first-part .left-container .is-always-shadow{
  box-shadow: none;

}
.dashboard-container .first-part .right-container{
  flex-grow: 1;
  height: 100%;
  padding-left: 24px;
}
.card-panel-description {
  float: left;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
  line-height: 40px;
}
.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-panel-num {
  font-size: 20px;
}
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  &-bottom-chart {
    margin-top: 24px;
  }
}
.el-card{
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
