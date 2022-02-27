// pages/device/myDevice.js
const axios = require('../../utils/init.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applydis:true,
    repairdis:true,
    targetUrl: "",
    code:"",
    enqname:"",
    status:"",
    model:"",
    user:"",
    college:"",
    warehouse:"",
    amount:"",
    in_time:"",
    type:"",
    qty:"",
    id:"",
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
    var that = this;
    // 查询当前设备是否已被占用，用户是否已经申请该设备，进行申请或者报修判断
    axios.panleAPI("labEquipment/"+options.enqid,"","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        wx.navigateBack({
          delta: 1
        })
      }else{
        if(res.length<1){
          that.open("查询到的设备为空");
          wx.navigateBack({
            delta: 1
          })
        }
        var flag = false;
        if(res.type == 1){
          flag = res.status==null || res.status!=10?true:false
        }else{
          flag = res.qty<0
        }
        that.setData({
          applydis:flag,
          repairdis:res.status==null?true:res.status==10?false:res.status==20?false:true,
          code:res.code,
          enqname:res.name,
          status:util.getStatusName(res.status),
          model:res.model,
          user:res.userName,
          college:res.collegeName,
          warehouse:res.warehouseName,
          amount:res.amount,
          in_time:util.formatTime(res.inTime),
          type:res.type,
          qty:res.qty,
          id:res.id
        })
      }
    })
  },
  /**
   * 申请
   */
  toApply: function(){
    wx.navigateTo({
      url: '../apply/apply?type='+this.data.type+'&enqid='+this.data.id
    })
  },
  /**
   * 报修
   */
  toRepair: function(){
    wx.navigateTo({
    url: '../deviceRepair/repair?enqid='+this.data.id
    })
  }
})