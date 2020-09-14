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
        }
    },
    data() {
        return {
            date: [],
            yieldRate: [],
            echartsOption: {
                title: {
                    text: '因子评测累积收益率图',
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
        // 向echarts添加数据
        addData() {
            var count = 0;  //第几天的盈利率
            var dateAdded = false;
            // eslint-disable-next-line
            for (let day in this.result) {
                var dayNum = Number(day.substr(0, day.length - 1)); // 几天盈利率
                var lastFactorReturn = 0;
                for (let time in this.result[day]) {
                    if (!dateAdded) {
                        this.date.push(moment(Number(time)).format('YYYY-MM-DD'));  // 时间
                    }
                    if (lastFactorReturn) {
                        lastFactorReturn = lastFactorReturn * (this.result[day][time] / dayNum + 1); // 累积盈利率为（1 + 盈利率 / 天数）* 上一天盈利率
                    }
                    else {
                        lastFactorReturn = (this.result[day][time]) / dayNum + 1;   // 第一天的盈利率
                    }
                    if (this.yieldRate.length <= count) {
                        this.yieldRate[count] = [];
                    }
                    this.yieldRate[count].push((lastFactorReturn * 100).toFixed(3));    // 转化为百分比
                }
                this.echartsOption.xAxis.data = this.date;
                dateAdded = true;
                // 添加series折线
                if (this.echartsOption.series.length <= count) {
                    this.echartsOption.series[count] = {
                        name: day + '收益率',
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
                        data: this.yieldRate[count],
                    };
                    this.echartsOption.series[count].data = this.yieldRate[count];
                    this.echartsOption.legend.data[count] = day + '收益率';
                    count++;
                }
                this.myChart.setOption(this.echartsOption);
            }
        },
    },
};
</script>

<style>

.factor-chart {
  margin-top: 10px;
}

</style>