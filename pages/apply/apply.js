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
    index:0,
    enq:null,
    enq_status_jue:true,
    enq_status:null,
    enq_code:null,
    enq_id:null,
    enq_reason:null
  },
  bindPickerChange:function(e){
    this.setData({
      enq: this.data.array[e.detail.value].name,
      enq_code:this.data.array[e.detail.value].code,
      enq_id:this.data.array[e.detail.value].id,
      enq_status_jue:this.data.array[e.detail.value].status!=10?true:false,
      enq_status:this.data.array[e.detail.value].status!=10?null:"设备处于"+util.getStatusName(this.data.array[e.detail.value].status)+"状态"
    })
  },
  inputTextReason:function(e){
    this.setData({
      enq_reason:e.detail.value
    })
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
    axios.panleAPI("labEquipment/findList","","GET",function(res){
      console.log(res)
      if(res.status == 500){
        console.log(res.error)
        that.open("查询设备错误");
        return;
      }else{
        that.setData({
          array:res
        })
        if(options.enqid!=null){
          for(var i in res){
            if(res[i].id == options.enqid){
              that.setData({
                enq_id:options.enqid,
                index:i,
                enq: res[i].name,
                enq_code:res[i].code,
                enq_id:res[i].id,
                enq_status_jue:res[i].status!=10?true:false,
                enq_status:res[i].status!=10?null:"设备处于"+util.getStatusName(res[i].status)+"状态"
              })
              return;
            }
          }
        }
      }
    })
    
  },
   
  /**
   * 表单提交事件
   */
  onSubmit: function (e) {
    if(app.globalData.userInfo==null || app.globalData.userInfo.id==null){
      this.open("用户暂未登陆，请登录");
      setTimeout(function(){
        wx.redirectTo({
          url: '/pages/authority/authority',
        })
      },1000)
    }
    if (this.data.enq == null) {
      this.open("请选择对应设备");
      return;
    } else if (this.data.enq_code == null) {
      this.open("请选择对应设备");
      return;
    } else if (this.data.enq_reason == null) {
      this.open("请填写申请原因");
      return;
    }
    var data = e.detail.value;
    data['opId'] = this.data.enq_id;
    data['name'] = this.data.enq;
    data['userId'] = app.globalData.userInfo.id;
    data['applyReason'] = this.data.enq_reason;
    data['type'] = 1;
    console.log(data)
    //申请
    var that = this;
    axios.panleAPI('labApply/save', data, "POST", function (res) {
      console.log(res);
      if(res.code == 500){
        that.open(res.message);
        return;
      }
      wx.navigateTo({
        url: '/pages/msg/msg_success?page=index&url=index&type=tab'
      })
    })
  }
})