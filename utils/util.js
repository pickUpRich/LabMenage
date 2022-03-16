const formatTime = date => {
  console.log(date)
  date = new Date(date);
  console.log(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getLocation(callback) { //位置信息
  wx.chooseLocation({
    success: function (res) {
      callback(true, res.latitude, res.longitude);
    },
    fail: function () {
      callback(false);
    }
  })
}

function getWeather(latitude, longitude, callback) {  //天气信息
  var ak = "WjFhio84FVTSbFqAns28uCdC3n9jLpyc";//换成自己的ak
  var url = "https://api.map.baidu.com/telematics/v3/weather?location=" + longitude + "," + latitude + "&output=json&ak=" + ak; //接口请求和参数传递

  wx.request({
    url: url,
    success: function (res) {
      console.log("天气请求结果", res.data); //在打开应用即可看到
      callback(res.data);
    }

  });
}

function loadWeatherData(callback) {
  getLocation(function (success, latitude, longitude) {
    getWeather(latitude, longitude, function (weatherData) {
      callback(weatherData);
    });
  });
}

function loadWeatherData2(callback) {
  getWeather('26.908320', '118.985710', function (weatherData) {
    callback(weatherData);
  });
}
function getStatusName(val) {
  var result = "";
  // 10：闲置，20:使用中，30：维护中，40：已故障，50：待报废，60：报废，70：其他
  var name={
  "10": "闲置",
  "20": "使用中",
  "30": "维护中",
  "40": "已故障",
  "50": "待报废",
  "60": "报废",
  "70": "其他",
  "80":"归还中",
  }
  result = name[val];
  return result;
}

function getApplyStatusName(val) {
  var result = "";
  // 10：申请中，20:审核中，30：已审核，40：已驳回，50：已同意，60：已撤回
  var name={
  "10": "申请中",
  "20": "审核中",
  "30": "已审核",
  "40": "已驳回",
  "50": "已同意",
  "60": "已撤回",
  "70":"归还中",
  "80":"归还拒绝",
  "90":"已归还",
  }
  result = name[val];
  console.log("result::::::"+result)
  return result;
}

module.exports = {
  formatTime: formatTime,
  loadWeatherData: loadWeatherData,
  loadWeatherData2: loadWeatherData2,
  getStatusName:getStatusName,
  getApplyStatusName:getApplyStatusName
}
