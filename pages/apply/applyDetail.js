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
    item: [],
    status:null,
    applyTime:null,
    auditTime:null
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
    // 查询对应详情
    var that = this;
    axios.panleAPI("labApply/"+options.applyid,"","GET",function(res){
      console.log(res)
      console.log(res.data);
      if(res.code == 500){
        that.open(res.message);
      }else{
        that.setData({
          item:res.data,
          status:util.getStatusName(res.data.status),
          applyTime:res.data.applyTime==null?"":util.formatTime(res.data.applyTime),
          auditTime:res.data.auditTime==null?"":util.formatTime(res.data.auditTime)
        })
      }
    })
    
  },
  inputTextReason:function(e){
    this.setData({
      enq_reason:e.detail.value
    })
  },
})