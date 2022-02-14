// pages/msg/msg_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetUrl:'',
    type: 'page',
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      targetUrl:options.page + "/" + options.url,
      type: options.type,
      id: options.id
    })
  },
  /**
   * 跳转页面
   */
  goPage: function () {
    var paramStr = "";
    if(this.data.id){
      paramStr += "?id=" + this.data.id
    }
    if(this.data.type === 'page'){
      wx.navigateTo({
        url: '/pages/'+this.data.targetUrl + paramStr
      })
    }else{
      wx.switchTab({
        url: '/pages/'+this.data.targetUrl + paramStr
      })
    }
   
  }
})