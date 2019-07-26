const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    donationArray: null,
    volunteerArray: null,
    showModal: false,
    cancelId: null,
    cancelIndex: null,
    showDonationDeleteModal: false,
    showVolunteerDeleteModal: false,
    deleteId: null,
    deleteIndex: null,
    detail: null,
    button: [],
    buttonArray: [],
    credit: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date()) / 1000;
    var that = this
    //调用userDonation接口返回用户-捐款类活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/userDonation?nickname=' + app.globalData.userInfo.nickName + '&donation_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          donationArray: res.data.list
        })
        //console.log(that.data.donationArray)
      }
    })

    //调用userVolunteer接口返回用户-志愿者类活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer?nickname=' + app.globalData.userInfo.nickName + '&volunteer_id=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          volunteerArray: res.data.list
        })
        //console.log(that.data.volunteerArray)
        for (var i = 0; i < that.data.volunteerArray.length; ++i) {
          //比较该活动的截止时间和当前时间，及活动是否被管理员取消，及用户是否被管理员取消参加该活动，决定是否显示取消按钮
          if (timestamp < that.data.volunteerArray[i].volunteer_detail.date && !that.data.volunteerArray[i].volunteer_detail.canceled && that.data.volunteerArray[i].joined!=0) {
            that.data.button.push(1)
          } else {
            that.data.button.push(0)
          }
        }
        that.setData({
          buttonArray: that.data.button
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

  },

  //取消按钮点击事件
  cancelJoin: function (e) {
    //var that = this
    // //调用volunteer接口，根据id返回某活动信息
    // wx.request({
    //   url: 'http://127.0.0.1:5000/volunteer?id=' + e.currentTarget.dataset.idinfo,
    //   method: 'GET',
    //   header: {
    //     'content-type': 'json' // 默认值
    //   },
    //   success: function (res) {
    //     that.setData({
    //       detail: res.data
    //     })
    //     //获取当前10位时间戳
    //     var timestamp = Date.parse(new Date()) / 1000;
    //   //判断是否超过该志愿者活动的截止时间
    // if (timestamp <= that.data.detail.date) {
    this.setData({
      showModal: true,
      cancelId: e.currentTarget.dataset.idinfo,
      cancelIndex: e.currentTarget.dataset.index
    })
    // }
    // } else {
    //   wx.showToast({
    //     title: '不可取消！',
    //     image: '../../images/icons/overtime.png',
    //     duration: 2500
    //   })
    // }
    //  }
    // })
  },

  //确认取消报名点击事件
  yes: function (e) {
    this.setData({
      showModal: false
    })
    var that = this
    //调用userVolunteer接口删除该用户-志愿者类活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer?nickname=' + app.globalData.userInfo.nickName + "&volunteer_id=" + that.data.cancelId,
      method: 'DELETE',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.data.volunteerArray.splice(that.data.cancelIndex, 1)
        that.data.buttonArray.splice(that.data.cancelIndex, 1)
        that.setData({
          volunteerArray: that.data.volunteerArray,
          buttonArray: that.data.buttonArray
        })
        //console.log(that.data.volunteerArray)
        //调用user接口，得到将该用户信誉度
        wx.request({
          url: 'http://127.0.0.1:5000/user?nickname=' + app.globalData.userInfo.nickName,
          method: 'GET',
          header: {
            'content-type': 'json' // 默认值
          },
          success: function (res) {
            that.setData({
              credit: res.data.credit
            })
            //调用user接口，将该用户信誉度-1
            wx.request({
              url: 'http://127.0.0.1:5000/user?nickname=' + app.globalData.userInfo.nickName,
              method: 'PUT',
              data: {
                credit: that.data.credit - 1
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                app.globalData.completeUserInfo.credit = app.globalData.completeUserInfo.credit - 1
                console.log(app.globalData.completeUserInfo.credit)
              }
            })
          }
        })
        
      }
    })
    wx.showToast({
      title: '取消成功！',
    })
  },

  //不取消报名点击事件
  no: function (e) {
    this.setData({
      showModal: false
    })
  },

  //捐款类长按删除事件
  donationLongPress: function (e) {
    this.setData({
      showDonationDeleteModal: true,
      deleteId: e.currentTarget.dataset.id,
      deleteIndex: e.currentTarget.dataset.index
    })
  },

  //删除捐款类记录事件
  yesDonationDelete: function (e) {
    this.setData({
      showDonationDeleteModal: false
    })
    var that = this
    //调用userDonation接口修改该用户-捐款类活动的删除记录信息
    wx.request({
      url: 'http://127.0.0.1:5000/userDonation?id=' + that.data.deleteId,
      method: 'PUT',
      data: {
        deleted: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.data.donationArray[that.data.deleteIndex].deleted = 1
        that.setData({
          donationArray: that.data.donationArray
        })
      }
    })
    wx.showToast({
      title: '记录删除成功！',
    })
  },

  //不删除捐款类记录事件
  noDonationDelete: function (e) {
    this.setData({
      showDonationDeleteModal: false
    })
  },

  //志愿者类长按删除事件
  volunteerLongPress: function (e) {
    var timestamp = Date.parse(new Date()) / 1000;
    if (timestamp > this.data.volunteerArray[e.currentTarget.dataset.index].volunteer_detail.date || this.data.volunteerArray[e.currentTarget.dataset.index].volunteer_detail.canceled==1) {
      this.setData({
        showVolunteerDeleteModal: true,
        deleteId: e.currentTarget.dataset.id,
        deleteIndex: e.currentTarget.dataset.index,
      })
    } else {
      wx.showToast({
        title: '不可取消！',
        image: '../../images/icons/overtime.png',
        duration: 2500
      })
    }
  },

  //志愿者类记录删除事件
  yesVolunteerDelete: function (e) {
    this.setData({
      showVolunteerDeleteModal: false
    })
    var that = this
    //调用userVolunteer接口修改该用户-志愿者类活动的删除记录信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer',
      method: 'PUT',
      data: {
        id: that.data.deleteId,
        deleted: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.data.volunteerArray[that.data.deleteIndex].deleted = 1
        that.setData({
          volunteerArray: that.data.volunteerArray
        })
      }
    })
    wx.showToast({
      title: '记录删除成功！',
    })
  },

  //不删除志愿者类记录事件
  noVolunteerDelete: function (e) {
    this.setData({
      showVolunteerDeleteModal: false
    })
  }
})