// pages/monitor/monitor.js
import * as echarts from '../../ec-canvas/echarts';
const axios = require('../../utils/init.js');
var temOption = {
  series: [{
    type: 'gauge',
    center: ["50%", "60%"],
    startAngle: 200,
    endAngle: -20,
    min: 0,
    max: 60,
    splitNumber: 12,
    itemStyle: {
      color: '#FFAB91'
    },
    progress: {
      show: true,
      width: 30
    },

    pointer: {
      show: true,
    },
    axisLine: {
      lineStyle: {
        width: 30
      }
    },
    axisTick: {
      distance: -45,
      splitNumber: 3,
      lineStyle: {
        width: 2,
        color: '#999'
      }
    },
    splitLine: {
      distance: -80,
      length: 1,
      lineStyle: {
        width: 3,
        color: '#999'
      }
    },
    axisLabel: {
      distance: -20,
      color: '#999',
      fontSize: 13
    },
    anchor: {
      show: false
    },
    title: {
      show: true
    },
    detail: {
      valueAnimation: true,
      width: '60%',
      lineHeight: 40,
      height: '15%',
      borderRadius: 8,
      offsetCenter: [0, '25%'],
      fontSize: 30,
      fontWeight: 'bolder',
      formatter: '{value} °C',
      color: 'auto'
    },
    data: [{
      value: 0,
      name: '温度'
    }]
  }],
};
var humOption = {
  series: [{
    type: 'gauge',
    center: ["50%", "60%"],
    startAngle: 200,
    endAngle: -20,
    min: 0,
    max: 300,
    splitNumber: 12,
    itemStyle: {
      color: '#FFAB91'
    },
    progress: {
      show: true,
      width: 30
    },

    pointer: {
      show: true,
    },
    axisLine: {
      lineStyle: {
        width: 30
      }
    },
    axisTick: {
      distance: -45,
      splitNumber: 3,
      lineStyle: {
        width: 2,
        color: '#999'
      }
    },
    splitLine: {
      distance: -80,
      length: 1,
      lineStyle: {
        width: 3,
        color: '#999'
      }
    },
    axisLabel: {
      distance: -20,
      color: '#999',
      fontSize: 13
    },
    anchor: {
      show: false
    },
    title: {
      show: true
    },
    detail: {
      valueAnimation: true,
      width: '60%',
      lineHeight: 40,
      height: '15%',
      borderRadius: 8,
      offsetCenter: [0, '25%'],
      fontSize: 30,
      fontWeight: 'bolder',
      formatter: '{value} °C',
      color: 'auto'
    },
    data: [{
      value: 0,
      name: '湿度'
    }]
  }],
};
var temChartLine;
var humChartLine;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecLine: {
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        temChartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(temChartLine);
        temChartLine.setOption(temOption);
      }
    },
    humLine: {
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        humChartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(humChartLine);
        humChartLine.setOption(humOption);
      }
    },
    devNameList: [],
    devIdList: [],
    index: 0,
    selectDev: "请选择"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取设备内容
    axios.panleAPI('ztDevice/findList', {}, "GET", function (res) {
      console.log(res);
      var devIdList = [];
      var devNameList = [];
      for (var i = 0; i < res.length; i++) {
        devIdList.push(res[i].id);
        devNameList.push(res[i].name);
      }
      that.setData({
        devIdList: devIdList,
        devNameList: devNameList,
        index: 0, //默认选中第一个
        selectDev: devNameList[0]
      })
      //获取数据
      that.getDevData();
    });
  
    //设置一分钟刷新一次
    setInterval(function () {
      that.getDevData();
    }, 60000);
  },
  /**
   * 单选框选中事件
   */
  bindPickerChange: function (e) {
    //更新页面显示
    this.setData({
      index: e.detail.value,
      selectDev: this.data.devNameList[e.detail.value]
    })
    this.getDevData();
  },
  /**
   * 获取设备对应环境监测信息
   */
  getDevData: function () {
    var devId = this.data.devIdList[this.data.index];
    //获取环境数据
    axios.panleAPI('control/getEnvData', {
      devId: devId
    }, "GET", function (res) {
      if (res.status === "200" && res.msg) {
        if (res.msg.Temperature) {
          temOption.series[0].data[0].value = parseInt(res.msg.Temperature);
          temChartLine.setOption(temOption, true);
        }
        if (res.msg.Humidity) {
          humOption.series[0].data[0].value = parseInt(res.msg.Humidity);
          humChartLine.setOption(humOption, true)
        }
      }
    })
  }

})