<template>
  <div ref="main" :class="className" :style="{height: height, width: width}"></div>
</template>

<script>
import echarts from 'echarts'
// 引入主题
require('echarts/theme/macarons')
// 自适应窗口大小改变图表的大小
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    flag:{
      type: String
    },
    xAxisData: { // x轴显示的数据
      type: Object,
    },
    seriesData: {
      type: Array,
    }
  },
  data() {
    return {
      chart: null, // 引用echarts实例属性
    }
  },
  mounted() {
    // 当加载dom后，会调用 this.initChart() 来进行初始化echarts实例
    this.$nextTick(() => {
      this.initChart()
    })
  },
  // 当组件销毁之前会调用此钩子，
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // 注销实例
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 初始化echarts实例，第2个参数是主题
      this.chart = echarts.init(this.$refs.main, 'macarons')
      this.chart.setOption({
        title: {
          text: '告警分类'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: this.seriesData
        },
        series: [
          {
            name: '内存',
            type: 'bar',
            data: this.xAxisData.mem
          },
          {
            name: 'CPU',
            type: 'bar',
            data: this.xAxisData.cpu
          },
          {
            name: '硬盘',
            type: 'bar',
            data: this.xAxisData.disk
          },
          {
            name: '连接数',
            type: 'bar',
            data: this.xAxisData.tcp
          },
          {
            name: '带宽',
            type: 'bar',
            data: this.xAxisData.netflow
          },
          {
            name: '宕机',
            type: 'bar',
            data: this.xAxisData.unreachable
          },
          {
            name: 'DB',
            type: 'bar',
            data: this.xAxisData.db
          },
          {
            name: '未分类',
            type: 'bar',
            data: this.xAxisData.unknown
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
