// pages/info/info.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    loginTime:null,
  },
  checkLogin:function(){
    if(app.globalData.userInfo==null || app.globalData.userInfo.id==null){
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
    var that = this
    //查出用户信息
    axios.panleAPI('labUser/'+app.globalData.userInfo.id, {}, "GET", function (res) {
      console.log(res)
      that.setData({
        info: res,
        loginTime:res.loginDate==null?"":util.formatTime(res.loginDate)
      })
    })
  },
  loginOut:function(){
    app.globalData.userInfo = null;
    app.globalData.canIUse = false;
    console.log(globalData.userInfo);
    this.checkLogin();
  }
})