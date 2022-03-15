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
    console.log(this.data)
    var requestData = {};
    requestData['userId'] = app.globalData.userInfo.id;
    var url = "labApply/findReturnList"
    var that = this;
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
    wx.navigateTo({
      url: '../return/returnApplyDetail?type=1&applyid='+e.currentTarget.dataset.applyid
      })
  }
   
})