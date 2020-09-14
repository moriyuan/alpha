<template>
  <div class="statistic-frame">
    <h1>因子评价统计分析</h1>
    <div class="statistic-innerframe">
      <div class="statistic-block" v-for="(statisticName, index) in statisticNames" :key="index">
        <label class="statistic-name">{{statisticName}}</label>
        <br>
        <label class="statistic-param">{{statisticParams[index]}}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticTable',
  data() {
    return {
      statisticNames: [],
      statisticParams: [],
    }
  },
  props: {
    result: {
      type: Object
    }
  },
  watch: {
    result() {
      this.pushStatistic();
      this.$forceUpdate();  //刷新组件
    }
  },
  methods: {
    // 处理请求返回结果为统计列表
    pushStatistic() {
      for (let param in this.result) {
        // 去掉包含多个数据的对象和列表
        if (this.isFloat(this.result[param])) {
          this.statisticNames.push(param.substr(0, 15));
          if (this.result[param] == null) {
            this.statisticParams.push(null);
          } else {
            this.statisticParams.push(this.result[param].toFixed(3));
          }
        }
      }
    },
    isFloat(n){
      return Number(n) === n && n % 1 !== 0;
    }
  }
}
</script>

<style scoped>

h1 {
  margin-bottom: 15px;
  font-size: 19px;
  text-align: center;
}

.statistic-frame {
  
}

.statistic-innerframe {
  margin-left: 30px
}

.statistic-block {
  display: inline-block;
  margin: 0px 10px 10px 10px;
  width: 100px;
}

.statistic-name {
  font-size: 13px;
  color: gray;
}

.statistic-param {
  font-size: 15px;
}

</style>