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
    type:null,
    applyType:null,
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
  checkLogin:function(){
    if(app.globalData.userInfo==null || app.globalData.userInfo.id==null){
      this.open("用户暂未登陆，请登录");
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
    // 登录校验
    this.checkLogin();
    console.log(options)
    // 查询对应设备列表
    var url;
    this.setData({
      type:options.type
    })
    console.log(this.data)
    if(this.data.type == 1){
      url = "labApply/findStudentList"
    }else if(this.data.type == 2){
      url = "labFault/findStudentList"
    }else{
      url = "labApply/findAuditList"
    }
    var that = this;
    var requestData={
      userId:app.globalData.userInfo.id
    }
    axios.panleAPI(url,requestData,"GET",function(res){
      console.log(res)
      if(res == null){
        that.open("暂无数据")
      }
      if(res.status == 500){
        console.log(res.error)
        that.open("查询错误");
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
    if(this.data.type == 1){
      wx.navigateTo({
        url: '../apply/applyDetail?type=1&applyid='+e.currentTarget.dataset.applyid
        })
    }else if(this.data.type == 2){
      wx.navigateTo({
        url: '../deviceRepair/repairDetail?type=1&repairid='+e.currentTarget.dataset.applyid
        })
    }else{
      if(this.data.applyType == 1){
        wx.navigateTo({
          url: '../apply/applyDetail?repairid='+e.currentTarget.dataset.applyid
          })
      }else{
        wx.navigateTo({
          url: '../deviceRepair/repairDetail?repairid='+e.currentTarget.dataset.applyid
          })
      }
    }
  }
   
})