<template>
  <div id="alpha-analysis" class="container">
    <el-container direction="vertical">
      <el-header>
        <label class='header-title'>TechFin.AI 钛锋智能因子评价系统</label>
        <el-button type="info" class="save-btn" @click="getPdf('#alpha-analysis')">保存为PDF</el-button>
        <el-button class="navigate-btn" @click="toFactorList">因子列表</el-button>
        <el-button class="submit-btn" @click="submitAgain">再次上传</el-button>
      </el-header>
      <el-main>
        <div class="factor-name-frame">
          <p class="factor-name"><strong>{{factorName}}</strong></p>
        </div>
        <br>
        <div class="factor-name-frame">
          <p class="factor-name" style="font-size: 19px"><strong>因子介绍</strong></p>
        </div>
        <p class="factor-description">{{factorDescription}}</p>
        <br>
        <div class="factor-name-frame">
          <p class="factor-name" style="font-size: 19px"><strong>因子代码</strong></p>
        </div>
        <client-only placeholder="Codemirror Loading...">
          <codemirror class="code-mirror"
                      id="code-mirror">
          </codemirror>
        </client-only>
        <br>
        <StatisticTable :result="statistic"></StatisticTable>
        <br>
        <FactorChart :result="factorReturns"></FactorChart>
        <br>
        <QuantileChart :result="meanQuantiles"></QuantileChart>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import FactorChart from '@/components/FactorChart'
import StatisticTable from '@/components/StatisticTable'
import QuantileChart from '@/components/QuantileChart'
export default {
  data() {
    return {
      resultJson: {}, //评测请求结果
      statistic: {},
      factorReturns: {},
      meanQuantiles: {},
      requestParams: {},  //路由接收评测请求参数
      ifRun: false,   //路由接收是否为自主因子评测
      factorName: '',   //因子名称
      factorCode: '',   //因子代码
      factorDescription: '', //因子介绍
      pdfTitle: '因子评价报告',
      pdfSelector: '#alpha-analysis',
      finishedLoading: false,
    }
  },
  beforeRouteLeave (to, from, next) {//离开当前页
    this.$confirm('离开当前页将会丢失评测进度，确定离开？', '离开当前页', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.finishedLoading = true;
      location.reload();
    }).catch((error) => {
      console.log(error);
    })
  },
  components: {
    FactorChart,
    StatisticTable,
    QuantileChart,
  },
  created() {
    this.finishedLoading = false;
    // 路由接收参数
    this.requestParams = JSON.parse(this.$route.query.requestParams);
    this.ifRun = this.$route.query.ifRun;
    this.factorName = this.$route.query.alphaName;
    this.factorCode = this.$route.query.alphaCode;
    this.factorDescription = this.$route.query.alphaDescription;
    this.runAnalysis();
  },
  mounted() {
    // codemirror不是服务端渲染，需要在客户端渲染
    var VueCodemirror = require('vue-codemirror');
    this.$nextTick(() => {
      var textArea = document.getElementById('code-mirror');
      textArea.value = '';
      var editor = VueCodemirror.CodeMirror.fromTextArea(textArea);
      editor.setValue(this.factorCode);
      editor.setOption('theme', 'darcula');
      editor.setOption('tabSize', 2);
      editor.setOption('mode', 'text/x-python');
      editor.setOption('lineNumbers', true);
      editor.setOption('line', true);
    })
  },
  destroyed() {
    this.finishedLoading = true;
  },
  watch: {
    // 关闭全局加载锁定
    finishedLoading() {
      this.loading.close();
    }
  },
  methods: {
    // 请求评测数据
    runAnalysis: function() {
      this.loading = this.$loading({
        lock: true,
        text: '正在拼命评测因子，请耐心等候...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 因子列表评测
      if (this.ifRun == 'true') {   //route传递参数时把bool变成string了
        this.$axios.post("/factor_evaluation", this.requestParams,
          {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          console.log(res.data.data);
          this.resultJson = res.data.data;  //自主因子请求返回为JSON对象
          console.log(JSON.parse(this.resultJson.statistic));
          this.statistic = JSON.parse(this.resultJson.statistic);
          console.log(JSON.parse(this.resultJson.factor_returns));
          this.factorReturns = JSON.parse(this.resultJson.factor_returns);
          console.log(JSON.parse(this.resultJson.mean_quantile_return_bydate)['1D']);
          this.meanQuantiles = JSON.parse(this.resultJson.mean_quantile_return_bydate)['1D'];
          this.finishedLoading = true;
        })
        .catch((error) => {
          console.log(error);
          this.finishedLoading = true;
        })
      // 自主因子评测
      } else {
        this.$axios.post("http://172.17.1.4:5000/api/factor_eval_data", this.requestParams,
          {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.resultJson = JSON.parse(res.data.data);
          console.log(JSON.parse(this.resultJson.statistic));  //自主因子请求返回为JSON字符串
          this.statistic = JSON.parse(this.resultJson.statistic);
          console.log(JSON.parse(this.resultJson.factor_returns));
          this.factorReturns = JSON.parse(this.resultJson.factor_returns);
          console.log(JSON.parse(this.resultJson.mean_quantile_return_bydate)['1D']);
          this.meanQuantiles = JSON.parse(this.resultJson.mean_quantile_return_bydate)['1D'];
          this.finishedLoading = true;
        })
        .catch((error) => {
          console.log(error);
          this.finishedLoading = true;
        })
      }
    },
    submitAgain() {
      window.location.href = location.origin + '/upload';
    },
    toFactorList() {
      window.location.href = location.origin + '/factorList';
    },
  }
}
</script>

<style scoped>

.el-header {
  background-color: #21305e;
  color: #333;
  line-height: 60px;
}

.header-title {
  margin-left: 20px;
  color: white;
}

.save-btn {
  position: absolute;
  right: 260px;
  top: 10px
}

.navigate-btn {
  position: absolute;
  right: 140px;
  top: 10px
}

.submit-btn {
  position: absolute;
  right: 20px;
  top: 10px
}

.container {
  background-color: #E9EEF3;
}

.factor-name-frame {
  text-align: center;
}

.factor-name {
  color: rgb(0, 0, 0);
  font-size: 25px;
  margin: 10px;
}

.factor-description {
  margin-left: 5%;
  margin-right: 5%;
  
}

</style>