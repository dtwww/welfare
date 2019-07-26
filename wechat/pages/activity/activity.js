const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    swiperImgs: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    donationArray: null,
    volunteerArray: null,
    sexArray: {
      0: "无",
      1: "男",
      2: "女"
    },
    countryArray: {
      "China": "中国"
    },
    provinceArray: {
      "China": {
        "Liaoning": "辽宁"
      }
    },
    cityArray: {
      "China": {
        "Liaoning": {
          "Chaoyang": "朝阳"
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.showLoading({
      title: 'Loading...',
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.hideLoading()
        console.log(this.data.userInfo)
        //调用user接口添加用户或返回用户信息
        var that = this
        wx.request({
          url: 'http://127.0.0.1:5000/user?nickname=' + that.data.userInfo.nickName,
          method: 'GET',
          header: {
            'content-type': 'json' // 默认值
          },
          success: function (res) {
            app.globalData.completeUserInfo.name = res.data.name,
            app.globalData.completeUserInfo.id = res.data.id,
            app.globalData.completeUserInfo.phone = res.data.phone
            app.globalData.completeUserInfo.credit = res.data.credit
            //修改user中的性别、国家、省份和城市
            wx.request({
              url: 'http://127.0.0.1:5000/user?nickname=' + that.data.userInfo.nickName,
              method: 'PUT',
              data: {
                sex: that.data.sexArray[app.globalData.userInfo.gender],
                country: that.data.countryArray[app.globalData.userInfo.country],
                province: that.data.provinceArray[app.globalData.userInfo.country][app.globalData.userInfo.province],
                city: that.data.cityArray[app.globalData.userInfo.country][app.globalData.userInfo.province][app.globalData.userInfo.city],
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {

              }
            })
          }
        })
      }
    })
    //console.log(this.data.userInfo)
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
    var that = this
    //调用donation接口返回按热度排序的活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/donation?id=-2',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          donationArray: res.data.list.slice(0, 2)
        })
        //console.log(that.data.donationArray)
      }
    })

    //调用volunteer接口返回按热度排序的活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/volunteer?id=-2',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          volunteerArray: res.data.list.slice(0, 2)
        })
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

  //捐款类活动查看更多点击事件
  donationList: function (e) {
    //console.log(e)
    wx.navigateTo({
      url: '../donationList/donationList',
    })
  },

  //志愿者类活动查看更多点击事件
  volunteerList: function (e) {
    //console.log(e)
    wx.navigateTo({
      url: '../volunteerList/volunteerList',
    })
  },

  //每一项点击事件
  activityDetail: function (e) {
    wx.navigateTo({
      url: '../activityDetail/activityDetail?info=' + e.currentTarget.dataset.info + '&id=' + e.currentTarget.dataset.id,
    })
  }
})