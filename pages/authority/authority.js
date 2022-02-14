// pages/authority/authority.js

const axios = require('../../utils/init.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipContent: "",
    topTips: false,
    hide: false,
    checkValue: 1,
    check:false,
    loginName:"",
    password:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(app.globalData.canIUse){
        this.goIndex();
      }
  },
  bindLoginName:function(e){
    this.setData({
      loginName:e.detail.value
    })
  },
  bindPassword:function(e){
    this.setData({
      password:e.detail.value
    })
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
  login:function(){
    if(this.data.loginName == null || this.data.loginName==""){
      this.open("登录用户不能为空");
      return;
    }else if(this.data.password == null || this.data.password==""){
      this.open("登录密码不能为空");
      return;
    }else if(!this.data.check){
      console.log(this.data.check);
      this.open("未勾选协议");
      return;
    }
    var loginData={
      "loginName":this.data.loginName,
      "password":this.data.password
    }
    var that = this;
    axios.panleAPI('login/loginCheck', loginData, "POST", function (res) {
      console.log(res);
      if(res.status == 500){
        that.open(res.msg);
        return;
      }else if(res.status == 200){
        app.setUserInfo(res.msg);
        that.goIndex();
      }
    })
  },
  /**
   * 获取用户信息（昵称 头像等）
   */
  bindGetUserInfo: function (e) {
    app.wxLogin({
      success (res) {
        console.log(res);
        // if (res.code) {
        //   //发起网络请求
        //   wx.request({
        //     url: 'https://localhost:login/loginCheck',
        //     data: {
        //       code: res.code
        //     }
        //   })
        // } else {
        //   console.log('登录失败！' + res.errMsg)
        // }
      }
    });
    // this.goIndex();
  },
  checkboxChange(e) {
    if (e.detail.value.includes('1')) {
      this.setData({
        check: true,
      });
    } else {
      this.setData({
        check: false,
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goIndex:function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  clickContract:function(){
    wx.switchTab({
      url: '/pages/info/contract'
    })
  }
})