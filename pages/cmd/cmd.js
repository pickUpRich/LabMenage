// pages/cmd/cmd.js
const axios = require('../../utils/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devId: "",
    cmdList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      devId: options.id
    });
   this.getList();
  },
  /**
   * 获取命令列表
   */
  getList: function(){
    var that = this
    //获取设备命令
    axios.panleAPI('ztCommand/findList', {
      deviceId: this.data.devId
    }, "GET", function (res) {
      that.setData({
        cmdList: res
      })
    })
  },
  /**
   * 新设备接入页面
   */
  toAdd: function () {
    wx.navigateTo({
      url: '/pages/cmd/add?id=' + this.data.devId
    })
  },
  /**
   * 长按删除命令
   */
  deleteCmd: function (e) {
    var cmdId = e.currentTarget.dataset.id
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此命令？',
      success: function (res) {
        axios.panleAPI('ztCommand/delete/' + cmdId, {}, "GET", function (res) {
          that.getList();
        })
      }
    })
  }
})