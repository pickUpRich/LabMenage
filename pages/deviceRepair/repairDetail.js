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
    item: [],
    status:null,
    applyTime:null,
    auditTime:null,
    imgs:[],
    previewImgs:[],
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
    axios.panleAPI("labFault/"+options.repairid,"","GET",function(res){
      console.log(res)
      console.log(res.data);
      if(res.code == 500){
        that.open(res.message);
      }else{
        var imgList = [];
        if(res.data.failureUrl!=null){
          var list = JSON.parse(res.data.failureUrl);
          console.log(list)
          for(var i in list){
            // "data:image/jpg;base64,"+
            var img = list[i]
            img = img.replace(/[\r\n]/g, "")
            imgList.push(img)
          }
        }
        that.setData({
          item:res.data,
          status:util.getStatusName(res.data.status),
          applyTime:res.data.applyTime==null?"":util.formatTime(res.data.applyTime),
          auditTime:res.data.auditTime==null?"":util.formatTime(res.data.auditTime),
          imgs:imgList
        })
        that.onPreviewImage()
      }
    })
  },

  //预览图片

  onPreviewImage() {
    var imgPaths=[]
    for(var i in this.data.imgs){
      var base64 = this.data.imgs[i];
      var imgPath = wx.env.USER_DATA_PATH + '/'+ i +'e-invoice' + Date.parse(new Date()) + '.jpg';
      var fs = wx.getFileSystemManager();
      fs.writeFileSync(imgPath, this.data.imgs[i].replace(/^data:image\/\w+;base64,/, ""), "base64");
      fs.close();
      imgPaths.push(imgPath)
    }
    this.setData({
      previewImgs: imgPaths
    })

  },
  // 预览
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.previewImgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
})