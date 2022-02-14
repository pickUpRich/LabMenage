// index.js
// 获取应用实例
const axios = require('../../utils/init.js');
const app = getApp()

Page({
  data: {
    background: [
      '../../img/banner_2.jpg',
      '../../img/banner_1.jpg',
      '../../img/banner_3.jpg'
    ]
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      app.wxGetUserInfo();
    }
  },
  /**
   * 设备申请接入页面
   */
  toApply: function(){
    wx.navigateTo({
      url: '/pages/apply/apply'
    })
  },
  /**
   * 扫码查看设备详情，可以直接申请或者报告维修
   */
  toQR:function(){
    wx.navigateTo({
      url: '/pages/apply/apply'
    })
  },
  /**
   * 设备查看页面（命令编辑）
   */
  toDevice:function(){
    wx.navigateTo({
      url: '/pages/device/myDevice'
    })
  },
  /**
   * 查看设备报修页面
   */
  toRepair: function(){
    wx.navigateTo({
      url: '/pages/deviceRepair/repair'
    })
  },

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})