// pages/device/add.js
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
    array: [],
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
    console.log(options)
    // 查询对应设备列表
    var that = this;
    axios.panleAPI("labApply/findList","","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        return;
      }else{
        res.map((item) => {
          if(item.applyTime!=null){
            item.applyTime = util.formatTime(item.applyTime);
          }
        })
        that.setData({
          array:res
        })
      }
    })
    
  },
  toDetail:function(e){
    var that = this;
    wx.navigateTo({
      url: '../apply/applyDetail?applyid='+e.currentTarget.dataset.applyid
      })
  },
})