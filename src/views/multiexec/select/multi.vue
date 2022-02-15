<template>
  <el-dialog :visible.sync="visible" :hosts.sync="hosts" :title="title" width="1000px" :before-close="close">
    <div>
        <el-form ref="form" :inline="true" :model="form" label-width="auto" status-icon>
          <el-form-item label="主机类别">
              <el-select v-model="form.category" placeholder="请选择主机类别">
                <el-option
                  v-for="item in categorys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          <el-form-item label="主机名：">
              <el-input v-model="form.hostname" maxlength="30"></el-input>
            </el-form-item>

          <el-form-item label="已选：">
            <span style="margin-left: 8px">{{this.select_host.length}}</span>
          </el-form-item>

          <el-form-item>
<!--            <el-button icon="el-icon-refresh" type="warning" @click="reload">重置</el-button>-->
            <el-button icon="el-icon-refresh" type="primary" @click="search">刷新</el-button>
          </el-form-item>
          <el-table
            ref="multipleTable"
            :data="hosts"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="类别"
              width="120">
              <template slot-scope="scope">{{ scope.row.category_name }}</template>
            </el-table-column>
            <el-table-column
              prop="hostname"
              label="主机名"
              width="150">
            </el-table-column>
            <el-table-column
              prop="ip_addr"
              label="连接地址"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="port"
              label="端口"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="desc"
              label="备注信息"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-form-item style="padding-top: 25px">
            <el-button type="primary" @click="submitForm()">确定</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
    </div>


  </el-dialog>
</template>

<script>
import {getHostType} from "@/api/host/server";
import * as api from "@/api/multiexec/multiexec";

export default {
  name: "Multi",
  props: {
    visible: { // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    hosts: {
      type: Array,
      default: () => {
        return
      }
    }
  },
  data() {
    return {
      title: '选择执行主机',
      // 主机类别
      categorys: {},
      form: {
        category: '',
        hostname: ''
      },
      select_host: [],
      show_host_info: [],
    }
  },

  methods: {
    close() {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.select_host = val.map(item => item.id)
      console.log(this.select_host)
    },
    submitForm() {
      this.hosts.forEach((v, k) => {
        // 判断某元素是否在数组中用includes比较合适，不能用in
        if (this.select_host.includes(v.id)){
          this.show_host_info.push({
            id: v.id,
            hostname: v.hostname,
            ip_addr: v.ip_addr,
            port: v.port,
          })
        }
      })

      this.$emit('close', this.show_host_info, this.select_host)
    },
    search() {
      this.$emit('search', this.form)
    }
  },
  watch: {
    visible(v) {
      if (v) {
        getHostType().then(res => {
          this.categorys = res.data.results
        })
      }
    },
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
