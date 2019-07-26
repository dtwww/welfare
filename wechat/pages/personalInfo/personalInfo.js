const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    nameEdit: true,
    idEdit: true,
    phoneEdit: true,
    nameInput: null,
    idInput: null,
    phoneInput: null,
    sex: null,
    country: null,
    province: null,
    city: null,
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
    },
    credit: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      nameInput: app.globalData.completeUserInfo.name,
      idInput: app.globalData.completeUserInfo.id,
      phoneInput: app.globalData.completeUserInfo.phone,
      sex: this.data.sexArray[app.globalData.userInfo.gender],
      country: this.data.countryArray[app.globalData.userInfo.country],
      province: this.data.provinceArray[app.globalData.userInfo.country][app.globalData.userInfo.province],
      city: this.data.cityArray[app.globalData.userInfo.country][app.globalData.userInfo.province][app.globalData.userInfo.city],
      credit: app.globalData.completeUserInfo.credit,
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

  //修改姓名点击事件
  nameEdit: function (e) {
    this.setData({
      nameEdit: false
    })
  },

  //输入姓名事件
  nameInput: function (e) {
    this.setData({
      nameInput: e.detail.value
    })
  },

  //保存姓名点击事件
  nameSave: function (e) {
    app.globalData.completeUserInfo.name = this.data.nameInput
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/user',
      method: 'PUT',
      data: {
        nickname: that.data.userInfo.nickName,
        name: that.data.nameInput
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res)
      }
    })
    this.setData({
      nameEdit: true,
    })
  },

  //修改身份证号点击事件
  idEdit: function (e) {
    this.setData({
      idEdit: false
    })
  },

  //输入身份证号事件
  idInput: function (e) {
    this.setData({
      idInput: e.detail.value
    })
  },

  //保存身份证号点击事件
  idSave: function (e) {
    app.globalData.completeUserInfo.id = this.data.idInput
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/user',
      method: 'PUT',
      data: {
        nickname: that.data.userInfo.nickName,
        id: that.data.idInput
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res)
      }
    })
    this.setData({
      idEdit: true
    })
  },

  //修改联系方式点击事件
  phoneEdit: function (e) {
    this.setData({
      phoneEdit: false
    })
  },

  //输入联系方式事件
  phoneInput: function (e) {
    this.setData({
      phoneInput: e.detail.value
    })
  },

  //保存联系方式点击事件
  phoneSave: function (e) {
    app.globalData.completeUserInfo.phone = this.data.phoneInput
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/user',
      method: 'PUT',
      data: {
        nickname: that.data.userInfo.nickName,
        phone: that.data.phoneInput
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res)
      }
    })
    this.setData({
      phoneEdit: true
    })
  },
})