// pages/msg/msg_success.js
const axios = require('../../utils/init.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipContent: "",
    topTips: false,
    hide: false,
    type: null,
    id:null,
    inputComments: "",
    opId:null,
    name:null,
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
  openToast() {
    this.setData({
      toast: true,
    });
    setTimeout(() => {
      this.setData({
        hideToast: true,
      });
      setTimeout(() => {
        this.setData({
          toast: false,
          hideToast: false,
        });
        wx.navigateBack({
          delta: 2,
        })
      }, 300);
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
    console.log(options)
    if(options == null){
      this.open("参数为空");
      return;
    }
    this.setData({
      id:options.id,
      type:options.type,
      opId:options.opId,
      name:options.name
    })
  },

  inputComments:function(e){
    this.setData({
      inputComments:e.detail.value
    })
  },

  /**
   * 提交反馈后跳转到首页
   */
  toComments:function () {
    // 登录校验
    this.checkLogin();
    if(this.data.inputComments == null || this.data.inputComments == ""){
      this.open("提交的反馈意见不能为空");
      return;
    }
    var requestData = {
      userId:app.globalData.userInfo.id,
      opId:this.data.opId,
      applyId:this.data.id,
      feedbackInfo:this.data.inputComments,
      name:this.data.name,
      type:this.data.type
    }
    console.log(requestData)
    var that = this;
    axios.panleAPI("labFeedback/save",requestData,"POST",function(res){
      console.log(res)
      if(res.code == 500){
        that.open(res.message);
      }else{
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },

  backTab:function(){
    wx.switchTab({
          url: '/pages/index/index',
        })
  }
})