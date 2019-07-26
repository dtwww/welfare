const app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgs: null,
    id: null,
    detail: null,
    inputMoney: null,
    showInputModal: false,
    showIncompleteModal: false,
    userInfoComplete: null,
    normalDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var that = this
    //调用auction接口，根据id返回某物品信息
    wx.request({
      url: 'http://127.0.0.1:5000/auction?id=' + that.data.id,
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          detail: res.data,
          normalDate: util.formatTime(new Date(res.data.date * 1000)),
          swiperImgs: [
            res.data.picture1,
            res.data.picture2,
            res.data.picture3
          ]
        })
        //console.log(that.data.detail)
      }
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
    if (app.globalData.completeUserInfo.name != "" && app.globalData.completeUserInfo.id != "" && app.globalData.completeUserInfo.phone != "") {
      this.setData({
        userInfoComplete: true
      })
    } else {
      this.setData({
        userInfoComplete: false
      })
    }
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

  //查看详情点击事件
  detail: function (e) {
    wx.navigateTo({
      url: '../userAuctionDetail/userAuctionDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  //询问详情点击事件
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18342171045'
    })
  },

  //我要竞拍点击事件
  join: function (e) {
    if (this.data.userInfoComplete == true) {
      //获取当前10位时间戳
      var timestamp = Date.parse(new Date()) / 1000;
      //console.log(timestamp)
      if (timestamp <= this.data.detail.date) {
        this.setData({
          showInputModal: true
        })
      } else {
        wx.showToast({
          title: '截止时间已过！',
          image: '../../images/icons/overtime.png',
          duration: 2500
        })
      }
    } else {
      this.setData({
        showIncompleteModal: true
      })
    }
  },

  //监听输入事件
  inputChange: function (e) {
    this.setData({
      inputMoney: e.detail.value
    })
  },

  //确认竞拍按钮点击事件
  yesInput: function (e) {
    //判断竞拍价格是否合理
    if (this.data.inputMoney > this.data.detail.money) {
      var that = this
      //调用userAuction接口，增加用户-拍卖物品信息
      wx.request({
        url: 'http://127.0.0.1:5000/userAuction',
        method: 'POST',
        data: {
          nickname: app.globalData.userInfo.nickName,
          auction_id: that.data.id,
          money: that.data.inputMoney
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //调用auction接口，根据id再次返回某活动信息
          wx.request({
            url: 'http://127.0.0.1:5000/auction?id=' + that.data.id,
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                detail: res.data
              })
            }
          })

          that.setData({
            showInputModal: false
          })
          wx.showToast({
            title: '竞拍成功！'
          })
        }
      })
    } else {
      this.setData({
        showInputModal: false
      })
      wx.showToast({
        title: '输入价格过低！',
        image: '../../images/icons/overtime.png',
        duration: 2500
      })
    }
  },

  //取消竞拍按钮点击事件
  noInput: function (e) {
    this.setData({
      showInputModal: false
    })
  },

  //去完善个人信息按钮点击事件
  goToComplete: function (e) {
    wx.redirectTo({
      url: '../personalInfo/personalInfo',
    })
  },

  //取消完善个人信息按钮点击事件
  noComplete: function (e) {
    this.setData({
      showIncompleteModal: false
    })
  },
})