const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tip: false,
    array: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var timestamp = Date.parse(new Date()) / 1000;
    var that = this
    //调用userAuction接口返回用户-拍卖物品信息
    wx.request({
      url: 'http://127.0.0.1:5000/userAuction?nickname=' + app.globalData.userInfo.nickName + '&auction_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          array: res.data.list
        })
        for (var i = 0; i < that.data.array.length; ++i) {
          if (that.data.array[i].paid == 0 && timestamp >= that.data.array[i].auction_detail.date && that.data.array[i].money == that.data.array[i].auction_detail.money) {
            that.setData({
              tip: true
            })
            break
          } else{
            that.setData({
              tip: false
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //个人信息点击事件
  personalInfo: function (e) {
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },

  //已参加活动点击事件
  personalActivity: function (e) {
    wx.navigateTo({
      url: '../personalActivity/personalActivity',
    })
  },

  //已参加拍卖点击事件
  personalAuction: function (e) {
    wx.navigateTo({
      url: '../personalAuction/personalAuction',
    })
  }
})