import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    factorReturns: {},
    meanQuantiles: {},
    statistic: {},
  },
  mutations: {
    receiveResult(state, result) {
      state.factorReturns = result.factor_returns;
      state.meanQuantiles = result.mean_quantile_return_bydate;
      state.statistic = result.statistic;
      console.log("success!")
    },
    convertJson(state) {
      state.factorReturns = JSON.parse(state.factorReturnStr);
      state.statistic = JSON.parse(state.statisticStr);
      state.meanQuantiles = JSON.parse(state.meanQuantilesStr);
    }
  }
})

export default store