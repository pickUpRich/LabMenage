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
    auditTime:null,
    type:null,
    enq_reason:null,
    applyStatus:null,
    inputNum:null,
    retuanQty:null,
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
    // 登录校验
    this.checkLogin();
    console.log(options)
    // 查询对应详情
    var that = this;
    if(options.type == 1){
      this.setData({
        type:options.type
      })
    }
    axios.panleAPI("labApply/"+options.applyid,"","GET",function(res){
      console.log(res)
      console.log(res.data);
      if(res.code == 500){
        that.open(res.message);
      }else{
        that.setData({
          item:res.data,
          applyStatus:util.getApplyStatusName(res.data.applyStatus),
          applyTime:res.data.applyTime==null?"":util.formatTime(res.data.applyTime),
          auditTime:res.data.auditTime==null?"":util.formatTime(res.data.auditTime),
          retuanQty:res.data.returnQty!=null?res.data.returnQty:null
        })
      }
    })
    
  },
  inputTextReason:function(e){
    this.setData({
      enq_reason:e.detail.value
    })
  },
  inputNum:function(e){
    this.setData({
      inputNum:e.detail.value
    })
  },
  // 拒绝
  toReject:function(){
    this.toAudit(1)
  },
  // 同意
  toAgree:function(){
    this.toAudit(2)
  },
  toAudit:function(type){
     // 登录校验
     this.checkLogin();
     var url;
     if(type == 1){
      if(this.data.item.applyStatus==70){
        url = "labApply/returnAgree";
      }else{
        url = "labApply/agree";
      }
     }else{
      if(this.data.item.applyStatus==70){
        url = "labApply/returnReject";
      }else{
        url = "labApply/reject";
      }
     }
     var requestData ={
      auditReason:this.data.enq_reason,
      userId:app.globalData.userInfo.id,
      id:this.data.item.id,
      opId:this.data.item.opId,
     }
     if(this.data.retuanQty!=null && this.data.retuanQty>0){
      requestData['qty'] = this.data.retuanQty
     }
     console.log(requestData)
     var that = this;
    axios.panleAPI(url,requestData,"GET",function(res){
      console.log(res)
      console.log(res.data);
      if(res.code == 500){
        that.open(res.message);
      }else{
        that.openToast();
      }
    })
  },
  toReturn:function(){
     // 登录校验
     this.checkLogin();
     var reg = new RegExp("")
    if((this.data.inputNum!=null || this.data.inputNum<0) && !(/(^\+?[1-9][0-9]*$)/.test(this.data.inputNum))){
      this.open("返还耗材只允许填写正整数");
      return;
    }
    var requestData = {
      userId:app.globalData.userInfo.id,
      opId:this.data.item.opId,
      id:this.data.item.id,
      num:this.data.inputNum,
      type:this.data.item.type
    }
    var that = this;
    axios.panleAPI("labApply/returnApply",requestData,"GET",function(res){
      console.log(res)
      if(res.code == 500){
        that.open(res.message);
      }else{
        wx.navigateTo({
          url: '/pages/comments/comments?type='+that.data.item.type+"&opId="+that.data.item.opId+"&name="+that.data.item.name+"&id="+that.data.item.id,
        })
      }
    })
  }

})