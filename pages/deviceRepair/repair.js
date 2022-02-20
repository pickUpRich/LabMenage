const app = getApp();
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
    enq_status_jue:false,
    enq_status:null,
    enq_code:null,
    enq_id:null,
    enq_model:null,
    enq_reason:null,
    image_photo:null,
    imgs:[],
    local_imgs:[]
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
                enq_model:res[i].modelCode,
                enq_id:res[i].id
              })
              return;
            }
          }
        }
      }
    })
  },
  inputTextReason:function(e){
    this.setData({
      enq_reason:e.detail.value
    })
  },
  bindPickerChange:function(e){
    console.log(this.data.array)
    this.setData({
      enq: this.data.array[e.detail.value].name,
      enq_code:this.data.array[e.detail.value].code,
      enq_id:this.data.array[e.detail.value].id,
      enq_model:this.data.array[e.detail.value].modelCode,
      enq_status_jue:this.data.array[e.detail.value].status!=10 && this.data.array[e.detail.value].status!=20?true:false,
      enq_status:this.data.array[e.detail.value].status!=10 && this.data.array[e.detail.value].status!=20?"设备处于"+util.getStatusName(this.data.array[e.detail.value].status)+"状态":null
    })
  },
   /**
   * 表单提交
   */
  onSubmit: function (e) {
    // 登录校验
    this.checkLogin();
    console.log("进入提交状态")
    if(app.globalData.userInfo==null || app.globalData.userInfo.id==null){
      console.log("获取不到用户信息，登录失效")
      this.open("用户暂未登陆，请登录");
      setTimeout(function(){
        wx.redirectTo({
          url: '/pages/authority/authority',
        })
      },1000)
      return;
    }
    if (this.data.enq == null || this.data.enq_code == null) {
      console.log("设备信息为空")
      this.open("设备信息为空");
      return;
    } else if (this.data.enq_reason == null) {
      console.log("为空")
      this.open("请填写报修缘由");
      return;
    }
    var data = e.detail.value;
    data['equipmentId'] = this.data.enq_id;
    data['opId'] = this.data.enq_id;
    data['name'] = this.data.enq;
    data['userId'] = app.globalData.userInfo.id;
    data['failureReason'] = this.data.enq_reason;
    data['failureUrl'] = this.data.local_imgs;
    data['type'] = 1;
    console.log(data)
    axios.panleAPI('labFault/save', e.detail.value, "POST", function (res) {
      console.log(res);
      if(res.code!=200){
        this.open("保存出错");
        return;
      }
      wx.navigateTo({
        url: '/pages/msg/msg_success?page=index&url=index&type=tab'
      })
    })
  },

// 上传图片
chooseImg: function (e) {
  var that = this;
  var imgs = this.data.imgs;
  if (imgs.length >= 9) {
    this.setData({
      lenMore: 1
    });
    setTimeout(function () {
      that.setData({
        lenMore: 0
      });
    }, 2500);
    return false;
  }
  wx.chooseImage({
    // count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths;
      var imgs = that.data.imgs;
      console.log(imgs.length)
      if(imgs.length>1){
        that.open("图片最多上传两张");
        return false;
      }
      for (var i = 0; i < tempFilePaths.length; i++) {
          imgs.push(tempFilePaths[i]);
      }
      that.setData({
        imgs: imgs
      });

      wx.uploadFile({
        url: app.globalData.rootUrl+"labFault/uploadFile",
        filePath: res.tempFilePaths[0],
        name: "file",
        formData: {
          'filename': "pics"
        },
        header: {
          "Content-Type": "multipart/form-data",
        },
        success: function (resData) {
          wx.hideLoading();
          console.log(resData);
          var responseData=JSON.parse(resData.data);
          if(responseData.code==200){
            var local_img = that.data.local_imgs;
            local_img.push(responseData.message);
            console.log(local_img)
            that.setData({
              local_imgs:local_img
            })
          }else{
            that.open(responseData.message);
            console.log(imgs.length)
            imgs.splice(imgs.length-1, 1);
            that.setData({
              imgs: imgs
            });
            return;
          }
        }, fail: function (resData) {
          wx.hideLoading();
          console.log('上传图片失败');
          imgs.splice(imgs.length-1, 1);
          that.setData({
            imgs: imgs
          });
        }
      })
    }
  });
},
// 删除图片
deleteImg: function (e) {
  var imgs = this.data.imgs;
  var local_imgs = this.data.local_imgs;
  var index = e.currentTarget.dataset.index;
  console.log(index);
  imgs.splice(index, 1);
  local_imgs.splice(index,1)
  this.setData({
    imgs: imgs,
    local_imgs:local_imgs
  });
},
// 预览图片
previewImg: function (e) {
  //获取当前图片的下标
  var index = e.currentTarget.dataset.index;
  //所有图片
  var imgs = this.data.imgs;
  wx.previewImage({
    //当前显示图片
    current: imgs[index],
    //所有图片
    urls: imgs
  })
},

})