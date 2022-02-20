// pages/device/myDevice.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipContent: "",
    topTips: false,
    hide: false,
    array:[],
    targetUrl: "",
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
checkLogin:function(){
  if(app.globalData.userInfo==null || app.globalData.userInfo.id==null){
    this.open("用户暂未登陆，请登录");
    setTimeout(function(){
      wx.redirectTo({
        url: '/pages/authority/authority',
      })
    },1000)
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录校验
    this.checkLogin();
    // 查询当前设备是否已被占用，用户是否已经申请该设备，进行申请或者报修判断
    // 查询对应设备列表
    var that = this;
    axios.panleAPI("labEquipment/findList","","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        return;
      }else{
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
    wx.navigateTo({
    url: '../device/myDeviceDetail?enqid='+e.currentTarget.dataset.enqid
    })
  },
  /**
   * 申请
   */
  toApply: function(e){
    wx.navigateTo({
      url: '../apply/apply?enqid='+e.currentTarget.dataset.enqid
    })
  },
  /**
   * 报修
   */
  toRepair: function(e){
    wx.navigateTo({
    url: '../deviceRepair/repair?enqid='+e.currentTarget.dataset.enqid
    })
  }
})