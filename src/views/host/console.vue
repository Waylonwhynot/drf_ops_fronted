<template>
  <div class="console">
    <div class="console_header">
      <div class="info">
        {{host_info.hostname}} | {{host_info.username}}@{{host_info.ip_addr}}:{{host_info.port}}
      </div>
      <div class="file_part" >
        <el-button type="primary" icon="el-icon-files" @click="showDrawer">文件管理器</el-button>
      </div>
    </div>

    <div class="file_show">
      <el-drawer
        size= "40%"
        title="文件管理器"
        :visible.sync="visible"
        :direction="direction"
        :before-close="handleClose">
        <div class="file_nav">
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>
                <i class="el-icon-s-home" @click="back_folder('/',1)"></i>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-for="(folder_path,f_index) in path" :key="f_index" v-show="folder_path!=='/'">
                <span style="cursor: pointer;" @click="back_folder(folder_path,f_index)">{{folder_path}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="display: flex; align-items: center;">
            <span>显示隐藏文件：</span>
            <el-switch
              @change="switch_on_off"
              v-model="switch_value"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <el-upload
              class="upload-demo"
              :action="upload_file_url+'/'+ host_info.id + '/' + '?folder_path=' + folder_path_str"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :headers="headerobj"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>

        </div>
        <div>
          <el-table
            :data="tableData"
            stripe
            height="600"
            style="width: 100%"
          >
            <el-table-column
              fixed
              label="名称"
              width="auto">
              <template slot-scope="scope">
               <span v-if="validate(scope.row.file_attr)" @click="join_folder(scope.row.file_name)" style="margin-left: 10px">
                <i class="el-icon-wallet"></i>
                {{ scope.row.file_name }}
              </span>
                <span v-else class="el-icon-tickets" @click="join_folder(scope)" style="margin-left: 10px">{{ scope.row.file_name }}</span>

                <!--                <span v-if="validate(scope)" class="el-icon-wallet" style="margin-left: 10px">{{ scope.row.file_name }}</span>-->
                <!--                <span v-else class="el-icon-tickets" style="margin-left: 10px">{{ scope.row.file_name }}</span>-->
                <!--                <span style="margin-left: 10px">{{ scope.row.file_attr }}</span>-->
              </template>
            </el-table-column>
            <el-table-column
              prop="file_size"
              label="大小"
              width="60">
            </el-table-column>
            <el-table-column
              prop="file_modify_time"
              label="修改时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="file_attr"
              label="属性"
              width="100">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>

    <div id="terminal"></div>
  </div>
</template>

<script>
import {Terminal} from 'xterm'
import * as api from "@/api/host/server";
import { FitAddon } from 'xterm-addon-fit';



export default {
  name: 'Console',
  data() {
    return {
      host_info: {},
      visible: false,
      drawer: false,
      direction: 'rtl', // 抽屉从右往左打开
      path: ['/',], // 默认是根路径，获取根路径下所有的文件和文件夹 ls-l /
      // shell_or_folder:0, // 判断用户是在操作shell还是在操作文件管理器
      file_folder_list: [], // 存放目录和文件信息数据
      ls_cmd: "\\ls -l -h --time-style '+%Y/%m/%d %H:%M:%S'",
      folder_path_str: '/',
      visit_url:'',
      upload_file_url: 'http://127.0.0.1:8000/api/host/file',
      switch_value: false, // 显示/隐藏 文件
      tableData: [],
      fileList: [],
      headerobj: {Authorization: 'Bearer' + ' ' + this.$store.getters.token}
    }
  },

  mounted() {
    this.show_comand_result();
    // var term = new Terminal(); 初始化Terminal页面
    let term = new Terminal({
      rendererType: "canvas", //渲染类型
      rows: 40, //行数
      convertEol: true, //启用时，光标将设置为下一行的开头
      scrollback: 100,//终端中的回滚量
      disableStdin: false, //是否应禁用输入。
      cursorStyle: 'underline', //光标样式
      cursorBlink: true, //光标闪烁
      theme: {
        foreground: "#ECECEC", //字体
        background: "#000000", //背景色
        cursor: 'help',//设置光标
      }
    });


    // 建立websocket
    // let ws = new WebSocket('ws://api.hippo.com:8000/ws/ssh/6/');
    let ws = new WebSocket(`ws://127.0.0.1:8000/ws/ssh/${this.$route.params.id}/`);
    let keyWord = '';  // 拼接用户输入的内容
    ws.onmessage = function (event) {
      if (!keyWord) {
        //所要执行的操作
        term.write(event.data);
      } else {
        keyWord = ''
        // 对响应回来的数据进行一些加工处理，筛选出结果内容部分
        let a = event.data.replace(event.data.split('\r\n', 1)[0], '');
        let b = a.split('\r\n', -1).slice(0, -1).join('\r\n');
        term.write(b);
      }

    }
    term.prompt = () => {
      term.write('\r\n');
      // term.write('\r\n$ ')
      msg = '';
    }
    term.onKey(e => {
      console.log(e)
      const ev = e.domEvent
      const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey

      console.log('>>>>', ev.keyCode);
      if (ev.keyCode === 13) {
        // console.log(keyWord);
        // 按下回车键进行指令的发送
        ws.send(keyWord);

      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b')
        }
      } else if (printable) {
        term.write(e.key);
        keyWord += e.key
      }
    })
    term.open(document.getElementById('terminal'));

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener("resize", resizeScreen)
    function resizeScreen() {
      try { // 窗口大小改变时，触发xterm的resize方法使自适应
        fitAddon.fit()
      } catch (e) {
        console.log("e", e.message)
      }
    }
  },
  methods: {
    async show_comand_result() {
      const {data} = await api.getHost(this.$route.params.id)
      this.host_info = data
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    showDrawer() {
      this.visible = true;
    },
    switch_on_off(e) {
      if (e) {
        // 开启显示隐藏文件
        console.log('开关打开')
        this.ls_cmd = `\\ls -l -h -a --time-style '+%Y/%m/%d %H:%M:%S'`
        this.send_show_folder_cmd(this.folder_path_str, this.ls_cmd);
      } else {
        // 关闭显示隐藏文件
        this.ls_cmd = `\\ls -l -h --time-style '+%Y/%m/%d %H:%M:%S'`
        this.send_show_folder_cmd(this.folder_path_str, this.ls_cmd);
      }
    },
    back_folder(text, f_index) {
      // this.path = this.path.slice(0,f_index+1);
      this.path = this.path.slice(0, f_index);

      this.join_folder(text);
    },

    // 拼接访问的目录路径
    join_folder(text) {
      console.log(text);
      // 发请求获取路径下的文件或者文件夹信息
      // this.$axios.get(`${this.settings.host}/`)
      // 拼接路径
      // console.log(text);
      // this.path.push(text);
      // let now_year = (new Date()).getFullYear();


      this.file_folder_list = [];

      if (text === '/') {
        this.path = ['/',]
      } else {
        this.path.push(text);
      }
      // console.log('>>>>>',this.path);

      let folder_path = this.path.join('/');
      // folder_path = '/'
      if (this.path.length > 1) {
        folder_path = folder_path.slice(1);
      }
      this.folder_path_str = folder_path;
      // console.log(this.path,'|||||',folder_path)
      // console.log(this.ws);
      // folder_path = '/home'
      // this.ws.send(`xx*ls -l ${folder_path}`);
      this.send_show_folder_cmd(this.folder_path_str, this.ls_cmd);

    },
    // 发送指令
    async send_show_folder_cmd(folder_path, cmd) {
      // axios请求
      const {data} = await api.getHostFile(this.$route.params.id, {cmd: `${cmd} ${folder_path}`})
      this.tableData = data
      console.log('>>>>>tableData', this.tableData, typeof (this.tableData))
      let data_l = this.tableData[0].split('\n').slice(1);
      data_l.forEach((file_info, file_index) => {
        // console.log(v);
        if (file_info) {
          // console.log(file_info,file_index);
          //["drwxr-xr-x", "2", "root", "root", "4096", "2020/09/14", "17:34:06", "bin"]
          let files_list = file_info.trim().split(/\s+/);
          // console.log(files_list);
          let a_list = files_list.slice(5, 7);
          let timer = a_list.join(' ');

          this.tableData.push({
            key: `${files_list[7] + 1}`,
            file_name: files_list[7],  //[-1]， 不支持负数索引
            file_size: files_list[4],
            file_modify_time: timer,
            file_attr: files_list[0],
          })
        }
      })
    },
    validate(file_attr) {
      console.log('>>file_attr', file_attr, typeof(file_attr))
      if(file_attr) {
        if (file_attr.substr(0, 1) === 'd') {
          return true
        } else {
          return false
        }
      }
      // let h = file_attr.substr(0, 1)
      // // console.log('>>file_attr', h)

    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  }
}
</script>

<style scoped>
  .console_header {
    display: flex;
    align-items: center;
    height: 46px;
    justify-content: space-between;
    padding: 0 10px;
    background-color: #e6f7ff;
  }
  .file_nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }




</style>

