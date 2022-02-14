// pages/my/my.js
const { $Toast } = require('../../dist/base/index');
const axios = require('../../utils/init.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {
      tel: '18059338801',
      address: '福州马尾区',
      time: '每天8:00-19:00'
    },
    historyArr: [],
    canIUse : app.globalData.canIUse
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否已经登录授权过
    this.getLoginState()
  },
  bindGetUserInfo: function (e) {
    app.wxLogin();
  },
  getLoginState: function(){
    var _this = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              _this.setData({
                canIUse: true
              })
            }
          })
        } else {
          _this.setData({
            canIUse: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 调用手机的拨打电话功能
   */
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '18059338801'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var newHistoryArr = wx.getStorageSync('historyArr') || []
    console.log(newHistoryArr)
    this.setData({
      historyArr: newHistoryArr
    })
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    })
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

  }
})