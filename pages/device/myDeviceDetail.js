// pages/device/myDevice.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applydis:true,
    repairdis:true,
    targetUrl: "",
    code:"",
    enqname:"",
    status:"",
    model:"",
    user:"",
    college:"",
    warehouse:"",
    amount:"",
    in_time:"",
  },
 //打开提示窗 
 open: function (content) {
  this.setData({
    topTips: true,
    tipContent: content
  });
  setTimeout(() => {
    this.setData({
      topTips: false,
      hide: false,
    });
  }, 1000);
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    // 查询当前设备是否已被占用，用户是否已经申请该设备，进行申请或者报修判断
    axios.panleAPI("labEquipment/"+options.enqid,"","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        wx.navigateBack({
          delta: 1
        })
      }else{
        if(res == null){
          that.open("查询到的设备为空");
          wx.navigateBack({
            delta: 1
          })
        }
        that.setData({
          applydis:res.status==null?true:res.status==10?false:true,
          repairdis:res.status==null?true:res.status==10?false:res.status==20?false:true,
          code:res.code,
          enqname:res.name,
          status:util.getStatusName(res.status),
          model:res.modelCode,
          user:res.userName,
          college:res.collegeName,
          warehouse:res.warehouseName,
          amount:res.amount,
          in_time:util.formatTime(res.inTime),
        })
      }
    })
  },
   /**
   * 详情
   */
  toDetail: function(){
    wx.navigateTo({
    url: '../device/myDeviceDetail'
    })
  },
  /**
   * 申请
   */
  toApply: function(){
    wx.navigateTo({
      url: '../apply/apply'
    })
  },
  /**
   * 报修
   */
  toRepair: function(){
    wx.navigateTo({
    url: '../deviceRepair/repair'
    })
  }
})