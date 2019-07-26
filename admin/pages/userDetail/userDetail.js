// pages/userDetail/userDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: null,
    userDetail: null,
    donationArray: null,
    volunteerArray: null,
    auctionArray: null,
    unpaid: [],
    paid: [],
    ing: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: options.nickname
    })
    var that = this
    //调用user接口，根据nickname返回信息
    wx.request({
      url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          userDetail: res.data
        })
      }
    })
    //调用userDonation接口返回用户-捐款类活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/userDonation?nickname=' + that.data.nickname + '&donation_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          donationArray: res.data.list
        })
      }
    })
    //调用userVolunteer接口返回用户-志愿者类活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer?nickname=' + that.data.nickname + '&volunteer_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          volunteerArray: res.data.list
        })
      }
    })
    //调用userAuction接口返回用户-拍卖物品信息
    wx.request({
      url: 'http://127.0.0.1:5000/userAuction?nickname=' + that.data.nickname + '&auction_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          auctionArray: res.data.list
        })
        var timestamp = Date.parse(new Date()) / 1000;
        for (var i = 0; i < that.data.auctionArray.length; ++i) {
          //比较该物品的截止时间、当前时间及用户竞拍钱数、paid值，决定是否显示未支付字样
          if (timestamp >= that.data.auctionArray[i].auction_detail.date && that.data.auctionArray[i].money == that.data.auctionArray[i].auction_detail.money && that.data.auctionArray[i].paid == 0) {
            that.data.unpaid.push(1)
            that.data.paid.push(0)
            that.data.ing.push(0)
          }
          //比较该物品的截止时间和当前时间，决定是否显示竞拍中字样
          else if (timestamp <= that.data.auctionArray[i].auction_detail.date) {
            that.data.unpaid.push(0)
            that.data.paid.push(0)
            that.data.ing.push(1)
          }
          //查看物品的paid值，决定是否显示已支付字样
          else if (that.data.auctionArray[i].paid == 1) {
            that.data.unpaid.push(0)
            that.data.paid.push(1)
            that.data.ing.push(0)
          }
          else {
            that.data.unpaid.push(0)
            that.data.paid.push(0)
            that.data.ing.push(0)
          }
        }
        that.setData({
          unpaid: that.data.unpaid,
          paid: that.data.paid,
          ing: that.data.ing,
        })
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

  }
})