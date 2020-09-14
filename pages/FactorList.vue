<template>
  <div>
    <el-header>
      <label class='header-title'>TechFin.AI 钛锋智能因子评价系统</label>
      <el-button class="navigate-btn" @click="toUpload">评测因子</el-button>
    </el-header>
    <el-table :data="factorList" :row-class-name="tableRowClassName" :default-sort="{prop: 'factorTime', order: 'descending'}">
      <el-table-column prop="factorName" label="因子名称" width="200" sortable>
      </el-table-column>
      <el-table-column prop="factorTime" label="上传日期" width="150" sortable>
      </el-table-column>
      <el-table-column prop="factorDescription" label="因子描述">
      </el-table-column>
      <el-table-column label="评测结果" width="150">
        <template slot-scope="scope">
          <el-button type="primary" @click="toResult(scope.row.factorIndex)">评测结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="权限验证"
      :visible="notVerified"
      width="30%">
      <el-form @submit.native.prevent>
        <el-form-item label="请输入管理员密码" required>
          <el-input v-model="verifyForm.password" @keyup.enter.native="verifyPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="toHome">返回主页</el-button>
        <el-button type="primary" @click="verifyPassword" @keyup.enter="verifyPassword">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import moment from 'moment';
export default {
  data() {
    return {
      factorList: [], //因子列表名称
      factorAddressList: [],  //因子列表地址（用于发送评测请求）
      finishedLoading: false,
      notVerified: true,
      verifyForm: {
        password: null,
      },
    }
  },
  created() {
    if (process.browser) {
      console.log('process by browser!');
      if (localStorage.getItem("verify") != null) { // 若有localStorage则说明已登录过
        this.notVerified = false;
        console.log("verified: " + localStorage.getItem("verify"));
      }
    }
    this.finishedLoading = false;
    // 请求因子列表
    this.$axios.get("http://172.17.1.4:5000/api/all_factor_list")
    .then((res) => {
      console.log(res);
      var i = 0;
      for (let factor in res.data.data) {
        this.factorList.push({
          factorIndex: i,
          factorName: factor,
          factorDescription: res.data.data[factor].factor_explanation,
          factorName: res.data.data[factor].factor_name,
          factorTime: moment(Number(res.data.data[factor].factor_upload_time * 1000)).format('YYYY-MM-DD'),
          factorCode: res.data.data[factor].support_function[0],
        })
        this.factorAddressList.push({
          file_path: res.data.data[factor].factor_file_address
        })
        i++;
      }
      console.log(this.factorList);
      console.log(this.factorAddressList);
    })
    .catch((error) => {
      console.log(error);
    })
  },
  watch: {
    finishedLoading() {
      this.loading.close();
    }
  },
  methods: {
    async verifyPassword() {
      let res = await this.$axios.post('http://172.17.1.4:5000/api/auth', {'passwd': this.verifyForm.password});  // 验证密码
      console.log(res.data);
      if (res.data.auth) {  //正确密码
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '欢迎！',
          type: 'success',
        });
        this.notVerified = false;
        localStorage.setItem("verify", true); // 设置localStorage，以后不需要再输入密码
      } else {  
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '您输入的验证码错误！',
          type: 'error',
        });
      }
    },
    tableRowClassName ({row, rowIndex}) {
        row.index = rowIndex;
     },
    toResult(row) {
      this.$router.push({
        path: '/result',
        query: {
          requestParams: JSON.stringify(this.factorAddressList[row]),
          ifRun: false,
          alphaName: this.factorList[row].factorName,
          alphaCode: this.factorList[row].factorCode,
          alphaDescription: this.factorList[row].factorDescription,
        }
      })
    },
    toUpload() {
      window.location.href = location.origin + '/upload'
    },
    toHome() {
      window.location.href = location.origin;
    },
  }
}
</script>

<style scoped>

el-table {
  width: 100%;
}

.navigate-btn {
  position: absolute;
  right: 20px;
  top: 10px
}

.el-header {
  background-color: #21305e;
  color: #333;
  line-height: 60px;
}

.header-title {
  margin-left: 20px;
  color: white;
}

</style>