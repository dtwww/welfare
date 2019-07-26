const app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    id: null,
    detail: null,
    swiperImgs: null,
    showConfirmModal: false,
    showIncompleteModal: false,
    showJoinedModal: false,
    showInputModal: false,
    userInfoComplete: null,
    inputMoney: null,
    hasJoined: false,
    userVolunteerList: null,
    normalDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info: options.info,
      id: options.id
    })
    var that = this
    if (this.data.info == "donation") {
      //调用donation接口，根据id返回某活动信息
      wx.request({
        url: 'http://127.0.0.1:5000/donation?id=' + that.data.id,
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
    } else {
      //调用volunteer接口，根据id返回某活动信息
      wx.request({
        url: 'http://127.0.0.1:5000/volunteer?id=' + that.data.id,
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
          //console.log(that.data)
        }
      })

      //调用userVolunteer接口，判断用户是否参加过该活动
      wx.request({
        url: 'http://127.0.0.1:5000/userVolunteer?nickname=' + app.globalData.userInfo.nickName + '&volunteer_id=',
        method: 'GET',
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          that.setData({
            userVolunteerList: res.data.list
          })

          for (var i=0; i<that.data.userVolunteerList.length; ++i){
            if(that.data.userVolunteerList[i].volunteer_detail.id == that.data.id){
              that.setData({
                hasJoined: true
              })
              break
            }
          }

        }
      })
    }
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

  //查看捐款详情点击事件
  userDonationDetail: function (e) {
    wx.navigateTo({
      url: '../userDonationDetail/userDonationDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  //查看志愿者详情点击事件
  userVolunteerDetail: function (e) {
    wx.navigateTo({
      url: '../userVolunteerDetail/userVolunteerDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  //我要捐款点击事件
  call: function (e) {
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

  //输入捐款钱数事件
  inputChange: function (e) {
    this.setData({
      inputMoney: e.detail.value
    })
  },

  //确定捐款点击事件
  yesInput: function (e) {
    var that = this
    //调用userDonation接口，增加用户-捐款类信息
    wx.request({
      url: 'http://127.0.0.1:5000/userDonation',
      method: 'POST',
      data: {
        nickname: app.globalData.userInfo.nickName,
        donation_id: that.data.id,
        money: that.data.inputMoney
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //调用donation接口，根据id再次返回某活动信息
        wx.request({
          url: 'http://127.0.0.1:5000/donation?id=' + that.data.id,
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
          title: '捐款成功！'
        })
      }
    })
  },

  //取消捐款点击事件
  noInput: function (e) {
    this.setData({
      showInputModal: false
    })
  },

  //报名参加点击事件
  join: function (e) {
    if (this.data.userInfoComplete == true) {
      //获取当前10位时间戳
      var timestamp = Date.parse(new Date()) / 1000;
      if (timestamp <= this.data.detail.date) {
        //判断该用户是否已参加该活动
        if(this.data.hasJoined == false){
          this.setData({
            showConfirmModal: true
          })
        } else {
          wx.showToast({
            title: '您已报名该活动！',
            image: '../../images/icons/overtime.png',
            duration: 2500
          })
        }
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

  //确认参加按钮点击事件
  yesConfirm: function (e) {
    var that = this
    //调用userVolunteer接口，增加用户-志愿者类信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer',
      method: 'POST',
      data: {
        nickname: app.globalData.userInfo.nickName,
        volunteer_id: that.data.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //调用volunteer接口，根据id再次返回某活动信息
        wx.request({
          url: 'http://127.0.0.1:5000/volunteer?id=' + that.data.id,
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
          showConfirmModal: false,
          hasJoined: true
        })
        wx.showToast({
          title: '报名成功！',
        })
      }
    })
  },

  //取消参加按钮点击事件
  noConfirm: function (e) {
    this.setData({
      showConfirmModal: false
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

  //已参加该活动按钮点击事件
  joined: function (e) {
    this.setData({
      showJoinedModal: false
    })
  },

  //转发给好友点击事件
  onShareAppMessage: function (e) {
    return {
      title: '来跟我一起参加这个公益活动吧！',
      path: '/pages/activityDetail/activityDetail',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})