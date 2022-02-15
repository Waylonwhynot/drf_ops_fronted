<template>
  <div class="app-container">
    <div>
      <h3>执行主机：</h3>
      <div>
        <el-tag
          v-for="host in show_host_info"
          :key="host.id"
          closable
          type="primary"
          @close="handleClose(host.id)"
          :disable-transitions="false">
          {{host.hostname}}@{{host.ip_addr}}:{{host.port}}
        </el-tag>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleSelect()">从主机列表中选择</el-button>
    </div>
    <div style="padding-top: 25px">
      <editor v-model="content" @init="editorInit" lang="html" theme="chrome" width="600" height="300"></editor>
    </div>
    <div tyle="padding-top: 25px">
      <el-button icon="el-icon-plus">从执行模板中选择</el-button>
    </div>
    <div style="padding-top: 30px">
      <el-button type="primary" icon="el-icon-caret-right" @click="execCommand">执行指令</el-button>
    </div>
    <multi :visible="visible" :hosts="tableData"  @close="close" @search="fetchData" />
  </div>
</template>



<script>
import Multi from "@/views/multiexec/select/multi";
import * as api from "@/api/multiexec/multiexec";

export default {
  name: "MultiExec",
  components: {Multi, editor: require('vue2-ace-editor'),},
  data() {
    return {
      visible: false,
      tableData: [],
      show_host_info: [], // 显示选中的所有主机内容
      select_host: [],
      content: '', //用户输入的指令
      result: [], // 命令执行结果
    }
  },
  created() {
    // 获取主机分类数据和主机数据
    this.fetchData()
  },
  computed: {

  },
  methods: {
    // ace-editor
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript')    //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    // 执行指令
    async execCommand() {
      const {data} = await api.execCommand({'ids': this.select_host, 'cmd': this.content})
      this.result = data
      console.log('结果:', this.result)
    },
    handleSelect() {
      this.visible = true
    },
    close(data1, data2) {
      this.visible = false
      this.fetchData()
      this.show_host_info = data1
      this.select_host = data2
    },
    handleClose(tag) {
      this.select_host.splice(this.select_host.indexOf(tag), 1)
      console.log('select_host:>>>>>', this.select_host)
      this.show_host_info.forEach((v, k) => {
        // 判断某元素是否在数组中用includes比较合适，不能用in
        if (!this.select_host.includes(v.id)){
          console.log('>>>>>>>>k:' ,k)
          this.show_host_info.splice(k,1)
          console.log('>>>>>>>>show_host_info:' ,this.show_host_info)
        }
      })
    },
    async fetchData(form) {
      const {data} = await api.getHosts(form)
      this.tableData = data
    }
  },

}
</script>

<style scoped>

</style>
