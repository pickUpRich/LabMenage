// pages/device/myDevice.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    targetUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 查询对应设备列表
    var that = this;
    axios.panleAPI("labFault/findList","","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        return;
      }else{
        res.map((item) => {
          if(item.applyTime!=null){
            item.applyTime = util.formatTime(item.applyTime);
          }
        })
        that.setData({
          array:res
        })
      }
    })
  },
   /**
   * 详情
   */
  toDetail: function(e){
    console.log("详情id："+e.currentTarget.dataset.repairid)
    wx.navigateTo({
      url: '../deviceRepair/repairDetail?repairid='+e.currentTarget.dataset.repairid
    })
  }
})