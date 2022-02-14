const app = getApp()

// 请求
function panleAPI(URL, data,type, callback) {
  wx.showLoading({
    title: '正在请求中...',
    mask: true
  });
  // data['openId'] = wx.getStorageSync('openId');
  // data['nickName'] = wx.getStorageSync('nickName');
  wx.request({
      url: getApp().globalData.rootUrl + URL,
    data: data,
    method: type,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideLoading();
      return typeof callback == "function" && callback(res.data)
    },
    fail: function () {
      wx.hideLoading();
      return typeof callback == "function" && callback(false)
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}
// 图片请求
function panleFileAPI(URL, data,type, callback) {
  wx.showLoading({
    title: '正在请求中...',
    mask: true
  });
  // data['openId'] = wx.getStorageSync('openId');
  // data['nickName'] = wx.getStorageSync('nickName');
  wx.request({
      url: getApp().globalData.rootUrl + URL,
    data: data,
    method: type,
    header: {
      'Content-Type': 'multipart/form-data'
    },
    success: function (res) {
      wx.hideLoading();
      return typeof callback == "function" && callback(res.data)
    },
    fail: function () {
      wx.hideLoading();
      return typeof callback == "function" && callback(false)
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}
module.exports = {
  panleAPI,
  panleFileAPI
}