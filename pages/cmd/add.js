// pages/cmd/add.js
const axios = require('../../utils/init.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: "",
    cmdId: "",
    info: [],
    tipContent: "",
    topTips: false,
    hide: false
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
    this.setData({
      deviceId: options.id,
      cmdId: options.cmdId
    })

    if (options.cmdId) {
      var that = this
      //查出用户信息
      axios.panleAPI('ztCommand/' + options.cmdId, {}, "GET", function (res) {
        that.setData({
          info: res
        })
      })
    }
  },
  /**
   * 表单提交
   */
  onSubmit: function (e) {
    var data = e.detail.value
    data['deviceId'] = this.data.deviceId;
    if (!data.serverId) {
      this.open("请填写服务ID");
      return;
    } else if (!data.name) {
      this.open("请填写命令名");
      return;
    } else if (!data.paramKey) {
      this.open("请填写参数名");
      return;
    }else if (!data.paramVal) {
      this.open("请填写参数值");
      return;
    }
    var that = this;
    if (this.data.cmdId) {
      data["id"] = this.data.cmdId;
      //添加命令
      axios.panleAPI('ztCommand/edit', data, "POST", function (res) {
        console.log(res);
        wx.navigateTo({
          url: '/pages/msg/msg_success?page=cmd&url=cmd&type=page&id=' + that.data.deviceId
        })
      })
    } else {
      //添加命令
      axios.panleAPI('ztCommand/save', data, "POST", function (res) {
        console.log(res);
        wx.navigateTo({
          url: '/pages/msg/msg_success?page=cmd&url=cmd&type=page&id=' + that.data.deviceId
        })
      })
    }
  }
})