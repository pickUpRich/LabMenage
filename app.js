// app.js
const axios = require('utils/init.js');
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    this.wxLogin();
    //获取用户信息
    this.wxGetUserInfo();
  },
  globalData: {
    userInfo: null,
    canIUse: false,
    showImgUrl: 'http://localhost:8080/image/showImg',
    rootUrl: 'http://localhost:8080/',
    ifBack:false,
    backMessage:null
  },
  setUserInfo:function(labuser){
    this.globalData.userInfo = labuser;
  },
  wxLogin: function () {
    //如果已经存在openid，说明登录过，直接返回
    if (wx.getStorageSync('openId')) {
      this.globalData.canIUse = true;
      return;
    }
    this.globalData.canIUse = false;
    var id = ''
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    wx.login({
      success: res => {
        var data = {
          'js_code': res.code,
          'appid': 'wxbb6917d087be56b9',
          'secret': '6f2784b333923ef6221ef9a5e637f3e1',
          'grant_type': 'authorization_code'
        }
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: data,
          success: function (openid) {
            wx.hideLoading();
            id = openid.data.openid
            wx.setStorageSync('openId', id)
          },
          fail: function () {
            wx.hideLoading();
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      }
    })
  },
  wxGetUserInfo: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              wx.setStorageSync('nickName', this.globalData.userInfo.nickName);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              if (wx.getStorageSync('openId')) {
                axios.panleAPI('sysUser/updateName', {}, "GET", function (res) {
                  console.log(res);
                })
              }
            }
          })
        }
      }
    })
  }
})