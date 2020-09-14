<template>
  <div>
    <el-container direction="vertical">
      <el-header>
        <label class='header-title'>TechFin.AI 钛锋智能因子评价系统</label>
        <el-button type="primary" class="submit-btn" @click="submitAlpha">提交因子</el-button>
        <el-button class="navigate-btn" @click="toFactorList">因子列表</el-button>
      </el-header>
      <el-form v-model="params">
        <el-container>
        <el-aside>
          <el-form-item>
            <h1 class="params-label">可选因子参数</h1>
          </el-form-item>
          <el-form-item label="行业细分">
            <el-select v-model="params.parameter.industry" placeholder="请选择industry">
              <el-option label="sector" value="sector"></el-option>
              <el-option label="industry" value="industry"></el-option>
              <el-option label="subindustry" value="subindustry"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分位数">
            <el-input v-model="params.parameter.quantiles" placeholder="请输入1到10之间的quantile" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="评价价格">
            <el-select v-model="params.parameter.trade_price" placeholder="请选择trade price">
              <el-option label="close" value='close'></el-option>
              <el-option label="open" value='open'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计算天数">
            <el-input v-model="params.parameter.required_window_size" placeholder="请输入required window size" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="因子解释">
            <el-input type="textarea" v-model="params.parameter.factor_explanation" placeholder="请输入alpha explanation"></el-input>
          </el-form-item>
          <el-form-item label="上传因子">
            <el-select v-model="params.parameter.upload" placeholder="请选择trade price">
              <el-option label="true" value=true></el-option>
              <el-option label="false" value=false></el-option>
            </el-select>
          </el-form-item>
        </el-aside>
        <el-main>
          <el-form-item>
            <h1 class="params-label">Python因子代码</h1>
          </el-form-item>
          <el-form-item>
            <client-only placeholder="Codemirror Loading...">
              <codemirror class="code-mirror"
                          id="code-mirror"
                          v-model="params.factor_function" 
                          :options="cmOptions"
                          style="height: 1000px">
              </codemirror>
            </client-only>
          </el-form-item>
        </el-main>
        </el-container>
      </el-form>
    </el-container>
  </div>
</template>

<script>
// import VueCodemirror from 'vue-codemirror';

export default {
  data() {
    return {
      params: {
        factor_function: "",  //python因子代码
        parameter: {
          industry: 'sector',  // 进行行业分解的评价时，行业的细分（sector，industry，subindusty）
          quantiles: 5,  // 分成多少个quantile（1-10）
          trade_price: 'close',  // 评价是用close，还是用第二天的open来买入（close为0，open为1）
          required_window_size: null,  // 计算因子至少需要多少天的数据
          factor_explanation: '',  // 因子的详细解释（制作人，因子的逻辑等等）
          upload: false,  // 是否请选择上传因子还是简单的跑评测
        }
      },
      // 代码编辑器选项
      cmOptions: {
        tabSize: 2,
        mode: 'text/x-python',
        theme: 'darcula',
        lineNumbers: true,
        line: true,
        // more CodeMirror options...
      },
      finishedLoading: false,
      loading: null,
    }
  },
  mounted() {
    // codemirror不是服务端渲染，需要在客户端渲染
    var VueCodemirror = require('vue-codemirror');
  },
  watch: {
    finishedLoading() {
      this.loading.close();
    }
  },
  methods: {
    // 提交自主因子
    submitAlpha: function() {
      this.finishedLoading = false;
      if (this.params.factor_function == '') {  // 检测提交代码是否为空
        this.$confirm('请先填入您的python因子代码！', '提示', {
          confirmButtonText: '',
          cancelButtonText: '',
          type: 'error'
        })
      }
      else {
        this.$confirm('提交因子需运行一段时间，确认因子信息无误并提交？', '提示', {
          confirmButtonText: '',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.params.parameter.trade_price == '收盘价') {
            this.params.parameter.trade_price = 'close';
          }
          this.toResult();
        }).catch(function(error) {
          console.logle.log(error);
        });
      }
    },
    // 路由传递评测请求参数给result页
    toResult() {
      this.$router.push({
        path: '/result',
        query: {
          requestParams: JSON.stringify(this.params),
          ifRun: true,
          alphaName: '自主因子',
          alphaCode: this.params.factor_function,
          alphaDescription: this.params.parameter.factor_explanation,
        }
      })
    },
    toFactorList() {
      window.location.href = location.origin + '/factorList';
    },
  },
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

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 100px;
  padding: 3%;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  line-height: 100px;
}

.code-mirror {
  line-height: 22.5px;
  height: 100%;
}

.params-label {
  font-size: 20px;
  padding: 0%;
}

.submit-btn {
  position: absolute;
  right: 20px;
  top: 10px
}

.navigate-btn {
  position: absolute;
  right: 140px;
  top: 10px
}

.el-footer {
  background-color: #333;
  color: #333;
  line-height: 60px;
}

</style>