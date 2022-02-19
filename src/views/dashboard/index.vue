<template>
  <div class="dashboard-container">
    <!-- 面板统计组件 -->
    <panel-group :userTotal="userTotal" :hostTotal=getHost
                 :queriesPerSecond="queriesPerSecond" :logsErrors="logsErrors"/>
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <pie-chart :seriesData="bdCloudResourceCount" v-if="flag"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <!--
            注意：echarts 在初始化实例的时候就要拿到数据，有数据就会展示出来
           -->
          <bar-chart v-if="flag" :xAxisData="weekAlertData.date_data" :seriesData="weekAlertData.count_data"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import PanelGroup from './components/PanelGroup'
import {getWeekAlertCount} from '@/api/monitor/alertcenter'
import {getBdCloudResource} from '@/api/dashboard/dashboard'

// 1. 导入home.js

export default {
  name: 'DashBoard',
  components: {PieChart, BarChart, PanelGroup},

  data() {
    return {
      flag: false, // 判断是否显示图表组件
      panelFlag: false,
      weekAlertData: {}, // 一周告警统计
      queriesPerSecond: 268, // ApiSix QPS
      hostTotal: 302, //主机数
      userTotal: 60, // 访问量
      logsErrors: 50, // 日志错误数
      bdCloudResourceCount: {} // 云资源统计
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      const {data} = await getWeekAlertCount()
      this.weekAlertData = data
      const res1 = await getBdCloudResource()
      this.bdCloudResourceCount = res1.data
      // 先查询到数据后，再加载图表组件，将数据渲染，
      this.flag = true
    }
  },
  computed: {
    getHost() {
      for (var i = 0; i < this.bdCloudResourceCount.length; i++) {
        if ( this.bdCloudResourceCount[i].name == 'BCC' ) {
          this.hostTotal = this.bdCloudResourceCount[i].value
        }
      }
      return(this.hostTotal)
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
