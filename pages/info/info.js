// pages/info/info.js
const axios = require('../../utils/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //查出用户信息
    axios.panleAPI('sysUser/findByOpenId', {}, "GET", function (res) {
      that.setData({
        info: res
      })
    })
  },
  /**
   * 跳转到html页面
   */
  toOut: function () {
    wx.navigateTo({
      url: '../outHtml/outHtml?target=https://support.huaweicloud.com/api-iam/iam_17_0002.html',
    })
  },
  /**
   * 表单提交
   */
  onSubmit: function (e) {
    var data = e.detail.value;
    data['id'] = this.data.info.id;
    axios.panleAPI('sysUser/edit', e.detail.value, "POST", function (res) {
      console.log(res);
      wx.navigateTo({
        url: '/pages/msg/msg_success?page=my&url=my&type=tab'
      })
    })
  }
})