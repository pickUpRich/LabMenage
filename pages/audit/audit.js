// pages/device/myDevice.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipContent: "",
    topTips: false,
    hide: false,
    array: [],
    index:0,
    enq:null,
    enq_status_jue:true,
    enq_status:null,
    enq_code:null,
    enq_id:null,
    enq_reason:null,
    type:null,
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
    if(options.type == null){
      this.open("识别不了当前类型");
      return;
    }
    this.setData({
      type:options.type
    })
    // 查询对应详情
    var url;
    if(this.data.type == 1){
      url = "labFault/findList"
    }else{
      url = "labFault/findList"
    }
    var that = this;
    var requestData={
      userId:app.globalData.userInfo.id
    }
    axios.panleAPI(url,requestData,"GET",function(res){
      console.log(res)
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
   /**
   * 详情
   */
  toDetail: function(e){
    console.log("详情id："+e.currentTarget.dataset.repairid)
    wx.navigateTo({
      url: '../deviceRepair/repairDetail?repairid='+e.currentTarget.dataset.repairid
    })
  }
})