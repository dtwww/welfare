const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: null,
    paidArray: [],
    unpaidArray: [],
    paid: [],
    unpaid: [],
    showDeleteModal: false,
    deleteId: null,
    deleteIndex: null,
    deleteKind: null,
    button: [],
    buttonArray: [],
    text: [],
    textArray: [],
    showPayModal: false,
    payId: null,
    payIdInfo: null,
    payIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        //console.log(that.data.array)
        for (var i = 0; i < that.data.array.length; ++i) {
          if (that.data.array[i].paid == 0) {
            that.data.unpaid.push(that.data.array[i])
            //注释的这种方法也可以
            // var a = that.data.unpaidArray
            // a.push(res.data.list[i])
            // that.setData({
            //   unpaidArray: a
            // })
            //比较该物品的截止时间和当前时间及用户竞拍钱数，决定是否显示支付按钮
            if (timestamp >= that.data.array[i].auction_detail.date && that.data.array[i].money == that.data.array[i].auction_detail.money) {
              that.data.button.push(1)
            } else {
              that.data.button.push(0)
            }
            //比较该物品的截止时间和当前时间，决定是否显示竞拍中...字样
            if (timestamp <= that.data.array[i].auction_detail.date) {
              that.data.text.push(1)
            } else {
              that.data.text.push(0)
            }
          } else {
            that.data.paid.push(that.data.array[i])
            // var a = that.data.paidArray
            // a.push(res.data.list[i])
            // that.setData({
            //   paidArray: a
            // })
          }
        }
        that.setData({
          unpaidArray: that.data.unpaid,
          paidArray: that.data.paid,
          buttonArray: that.data.button,
          textArray: that.data.text
        })
        // console.log(that.data.unpaidArray)
        // console.log(that.data.paidArray)
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

  //长按删除事件
  auctionLongPress: function (e) {
    var timestamp = Date.parse(new Date()) / 1000;
    if (e.currentTarget.dataset.kind == "paid" || (timestamp>this.data.unpaidArray[e.currentTarget.dataset.index].auction_detail.date && this.data.unpaidArray[e.currentTarget.dataset.index].money<this.data.unpaidArray[e.currentTarget.dataset.index].auction_detail.money)) {
      this.setData({
        showDeleteModal: true,
        deleteId: e.currentTarget.dataset.id,
        deleteIndex: e.currentTarget.dataset.index,
        deleteKind: e.currentTarget.dataset.kind
      })
    } else if (timestamp <= this.data.unpaidArray[e.currentTarget.dataset.index].auction_detail.date) {
      wx.showToast({
        title: '未到时间！',
        image: '../../images/icons/overtime.png',
        duration: 2500
      })
    } else if (this.data.unpaidArray[e.currentTarget.dataset.index].money = this.data.unpaidArray[e.currentTarget.dataset.index].auction_detail.money) {
      wx.showToast({
        title: '请您支付！',
        image: '../../images/icons/overtime.png',
        duration: 2500
      })
    }
  },

  //删除记录事件
  yesDelete: function (e) {
    this.setData({
      showDeleteModal: false
    })
    var that = this
    //调用userAuction接口修改该用户-拍卖物品的删除记录信息
    wx.request({
      url: 'http://127.0.0.1:5000/userAuction?id=' + that.data.deleteId,
      method: 'PUT',
      data: {
        deleted: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (that.data.deleteKind == 'paid') {
          that.data.paidArray[that.data.deleteIndex].deleted = 1
          that.setData({
            paidArray: that.data.paidArray
          })
        } else {
          that.data.unpaidArray[that.data.deleteIndex].deleted = 1
          that.setData({
            unpaidArray: that.data.unpaidArray
          })
        }
      }
    })
    wx.showToast({
      title: '记录删除成功！',
    })
  },

  //不删除记录事件
  noDelete: function (e) {
    this.setData({
      showDeleteModal: false
    })
  },

  //支付按钮点击事件
  pay: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showPayModal: true,
      payId: e.currentTarget.dataset.id,
      payIdInfo: e.currentTarget.dataset.idinfo,
      payIndex: e.currentTarget.dataset.index
    })
  },

  //支付点击事件
  yesPay: function (e) {
    this.setData({
      showPayModal: false
    })
    var that = this
    //调用userAuction接口修改该用户-拍卖物品支付信息
    wx.request({
      url: 'http://127.0.0.1:5000/userAuction',
      method: 'PUT',
      data: {
        id: that.data.payId,
        paid: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.data.paidArray.push(that.data.unpaidArray[that.data.payIndex])
        that.data.button.splice(that.data.payIndex, 1)
        that.data.text.splice(that.data.payIndex, 1)
        that.data.unpaidArray.splice(that.data.payIndex, 1)
        that.setData({
          paidArray: that.data.paidArray,
          buttonArray: that.data.button,
          textArray: that.data.text,
          unpaidArray: that.data.unpaidArray
        })
        //调用auction接口修改拍卖物品支付信息
        wx.request({
          url: 'http://127.0.0.1:5000/auction',
          method: 'PUT',
          data: {
            id: that.data.payIdInfo,
            paid: 1
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            
          }
        })
      }
    })
    wx.showToast({
      title: '支付成功！',
    })
  },

  //不支付点击事件
  noPay: function (e) {
    this.setData({
      showPayModal: false
    })
  }
})