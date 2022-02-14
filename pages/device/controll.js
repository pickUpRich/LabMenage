const app = getApp();
const axios = require('../../utils/init.js');
var inputVal = '';
var historyMsgList = [];
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var plugin = requirePlugin("WechatSI")

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  //历史记录
 
  axios.panleAPI('ztHistory/findList', {userId:wx.getStorageSync("openId")}, "GET", function (res) {
    historyMsgList = [];
    for(var i=0;i<res.length;i++){
      historyMsgList.push({
        speaker: 'customer',
        contentType: 'text',
        content: res[i].cmdMsg
      });
    }
    that.setData({
      historyMsgList
    });
  })
  msgList = [];
  that.setData({
    msgList,
    inputVal,
    historyMsgList
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    sendType: "voice",
    isSpeaking: false,
    speakerUrl: '../../img/speak.png',
    filePath: "",
    hideWarnToast: false,
    warnToast: false,
    tipContent: "",
    devId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      devId: options.id
    })
    axios.panleAPI('sysUser/validateInfo', {}, "GET", function (res) {
      if (!res) {
        that.openWarnToast("请先完善信息");
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/info/info',
          })
        }, 1000);
      } else {
        initData(that);
        that.setData({
          cusHeadIcon: app.globalData.userInfo.avatarUrl,
        });
      }
    })
  },
  /**
   * 切换成语音
   */
  switchVoice: function () {
    this.setData({
      sendType: "voice"
    })
  },
  /**
   * 切换成键盘
   */
  switchKeyboard: function () {
    this.setData({
      sendType: "text"
    })
  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })
  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    this.sendCmd(e.detail.value);
    inputVal = '';
    this.setData({
      inputVal
    });
  },
  // 切换语音输入和文字输入
  switchInputType: function () {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },
  // 按钮按下
  touchdown: function () {
    var that = this;
    this.setData({
      isSpeaking: true,
    })
    console.log("[Console log]:Touch down!Start recording!");
    let manager = plugin.getRecordRecognitionManager()
    manager.onRecognize = function (res) {
      console.log("current result", res.result);
      that.sendCmd(res.result);
    }
    manager.onStop = function (res) {
      console.log("result", res.result)
      // that.sendCmd(res.result);
      that.sendCmd("开灯");

    }
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    manager.onError = function (res) {
      console.error("error msg", res.msg)
    }
    manager.start({
      duration: 30000,
      lang: "zh_CN"
    })
  },
  // 按钮松开
  touchup: function () {
    let manager = plugin.getRecordRecognitionManager()
    manager.stop()
    console.log('结束录音');
    console.log("[Console log]:Touch up!Stop recording!");
    this.setData({
      isSpeaking: false
    })
  },
  // 将识别内容显示在屏幕并发送到后台进行设备控制
  sendCmd: function (msg) {
    var that = this;
    if (!msg) {
      this.openWarnToast("未识别到语音");
    }
    var msgList = JSON.parse(JSON.stringify( this.data.msgList ));
    var tempMsgList = this.data.msgList;
    //先将内容更新到页面上
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: msg
    });
    tempMsgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: msg
    });
    tempMsgList.push({
      speaker: 'server',
      contentType: 'text',
      content: '识别中请稍等...'
    });
    this.setData({
      msgList: tempMsgList
    });
    axios.panleAPI('control/sendCmd', {cmdMsg:msg,devId:this.data.devId}, "GET", function (res) {
      msgList.push({
        speaker: 'server',
        contentType: 'text',
        content: res.msg
      });
      that.setData({
        msgList: msgList
      });
    })

  },
  //打开提示窗
  openWarnToast: function (content) {
    this.setData({
      warnToast: true,
      tipContent: content
    });
    setTimeout(() => {
      this.setData({
        hidewarnToast: true
      });
      setTimeout(() => {
        this.setData({
          warnToast: false,
          hidewarnToast: false,
        });
      }, 300);
    }, 1000);
  },
})