<template>
    <div class="factor-chart" ref="chart" :style="{height:height,width:width}"></div>
</template>
    
<script>
import moment from 'moment';
export default {
    name: 'FactorChart',
    props: {
        width: {
        type: String,
        default: '100%',
        },
        height: {
        type: String,
        default: '450px',
        },
        result: {
        type: Object,
        },
    },
    data() {
        return {
            date: [],
            yieldRate: [],
            echartsOption: {
                title: {
                    text: '1D分组累积收益率图',
                    left: 'center',
                    textStyle: {
                      fontWeight: 'bold',
                    },
                },
                legend: {
                    data: [],
                    top: '6%',
                },
                xAxis: {
                    name: '时间',
                    nameTextStyle: {
                        fontWeight: 600,
                        fontSize: 18,
                    },
                    type: 'category',
                    boundaryGap: false,
                    data: this.date,
                },
                yAxis: {
                    name: '累积收益率%',
                    nameTextStyle: {
                        fontWeight: 600,
                        fontSize: 18,
                    },
                    type: 'value',
                    scale: true,
                    boundaryGap: ['15%', '15%'],
                    axisLabel: {
                        interval: 'auto',
                        formatter: '{value} %',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    /* formatter: function(params) {
                        return `<label>${params[0].name}</label></br>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#40c9c6"></span> 1D收益率: ${params[0].data.toFixed(3)}%<br/>
                                `;
                    },*/
                },
                series: [],
            },
        };
    },
    mounted() {
        this.myChart = this.$echarts.init(this.$refs.chart, 'macarons');
        this.addData();
    },
    watch: {
        result() {
            this.addData();
            this.$forceUpdate();  //刷新组件
        }
    },
    methods: {
        addData() {
            this.yieldRate = [];  // quantiles_return
            var quantiles = [];    // 已储存的 quantiles索引
            var lastQuantile = 1;
            var lastFactorReturn;
            for (let time in this.result) { //result格式：[quantile, timestamp]: yeildRate
                let quantile = Number(time[1]);
                if (quantile == 1 && lastQuantile != 1) {   // 判断全踢了
                    quantile = Number(time.substring(1, 3));
                }
                if (!quantiles.includes(quantile)) {
                    quantiles.push(quantile);
                    console.log(quantile + ' added!');
                }
                if (quantile != lastQuantile) { //不同quantile时重新赋值
                  lastFactorReturn = 0;
                }
                let timestamp = Number(time.substring(time.indexOf(',') + 1, time.length - 1));
                if (quantile == 1) {
                    this.date.push(moment(Number(timestamp)).format('YYYY-MM-DD'));
                }
                if (lastFactorReturn) {
                    lastFactorReturn = lastFactorReturn * (this.result[time] + 1); // 累积盈利率为（1 + 盈利率）* 上一天盈利率
                }
                else {
                    lastFactorReturn = this.result[time] + 1;
                }
                if (this.yieldRate.length < quantile) {
                    this.yieldRate.push([]);    // 添加quantile_return列表
                }
                this.yieldRate[quantile - 1].push((lastFactorReturn * 100).toFixed(3));
                lastQuantile = quantile;
            }
            this.echartsOption.xAxis.data = this.date;
            // 添加series折线
            for (var i = 0; i < quantiles.length; i++) {
                this.echartsOption.series[i] = {
                    name: 'Q' + (i + 1) + '收益率',
                    type: 'line',
                    symbolSize: 6,
                    itemStyle: {  
                        normal: {
                            lineStyle: {  
                                width: 2.5,
                            },
                        },
                    },
                    smooth: true,
                    data: this.yieldRate[i],
                };
                this.echartsOption.series[i].data = this.yieldRate[i];
                this.echartsOption.legend.data[i] = 'Q' + (i + 1) + '收益率';
            }
            this.myChart.setOption(this.echartsOption);
        },
    },
};
</script>

<style>

.factor-chart {
  margin-top: 10px;
}

</style>