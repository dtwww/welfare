// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: null,
    priorityArray: null,
    creditArray: null,
    sumArray: null,
    priorityColor: 'white',
    priorityBgColor: '#EF7687',
    creditColor: '#EF7687',
    creditBgColor: 'white',
    sumColor: '#EF7687',
    sumBgColor: 'white',
    isPriority: true,
    isCredit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用user接口，返回所有用户信息
    wx.request({
      url: 'http://127.0.0.1:5000/user?nickname=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          array: res.data.list
        })
        var tempArray = [].concat(that.data.array)
        that.priorityShallSort(tempArray)
        var tempArray = [].concat(that.data.array)
        that.creditShallSort(tempArray)
        var tempArray = [].concat(that.data.array)
        that.sumShallSort(tempArray)
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

  //按优先级排序按钮点击事件
  prioritySort: function (e) {
    //未点击
    if (this.data.priorityColor == '#EF7687') {
      this.setData({
        priorityColor: 'white',
        priorityBgColor: '#EF7687',
        creditColor: '#EF7687',
        creditBgColor: 'white',
        sumColor: '#EF7687',
        sumBgColor: 'white',
        isPriority: true,
        isCredit: false
      })
    }
  },

  //按信誉度排序按钮点击事件
  creditSort: function (e) {
    //未点击
    if (this.data.creditColor == '#EF7687') {
      this.setData({
        creditColor: 'white',
        creditBgColor: '#EF7687',
        priorityColor: '#EF7687',
        priorityBgColor: 'white',
        sumColor: '#EF7687',
        sumBgColor: 'white',
        isPriority: false,
        isCredit: true
      })
    }
  },

  //综合排序按钮点击事件
  sumSort: function (e) {
    //未点击
    if (this.data.sumColor == '#EF7687') {
      this.setData({
        sumColor: 'white',
        sumBgColor: '#EF7687',
        priorityColor: '#EF7687',
        priorityBgColor: 'white',
        creditColor: '#EF7687',
        creditBgColor: 'white',
        isPriority: false,
        isCredit: false
      })
    }
  },

  //每一项点击事件
  userDetail: function (e) {
    wx.navigateTo({
      url: '../userDetail/userDetail?nickname=' + e.currentTarget.dataset.nickname,
    })
  },

  //优先级希尔排序
  priorityShallSort: function (array) {
    var increment = array.length
    var i
    var temp; //暂存
    var count = 0
    do {
      //设置增量
      increment = Math.floor(increment / 3) + 1
      for (i = increment; i < array.length; i++) {
        //console.log(increment)
        if (array[i].priority > array[i - increment].priority) {
          temp = array[i]
          for (var j = i - increment; j >= 0 && temp.priority > array[j].priority; j -= increment) {
            array[j + increment] = array[j]
          }
          array[j + increment] = temp
        }
      }
    }
    while (increment > 1)
    //console.log(array)
    this.setData({
      priorityArray: array
    })
  },

  //信誉度希尔排序
  creditShallSort: function (array) {
    var increment = array.length
    var i
    var temp; //暂存
    var count = 0
    do {
      //设置增量
      increment = Math.floor(increment / 3) + 1
      for (i = increment; i < array.length; i++) {
        //console.log(increment)
        if (array[i].credit > array[i - increment].credit) {
          temp = array[i]
          for (var j = i - increment; j >= 0 && temp.credit > array[j].credit; j -= increment) {
            array[j + increment] = array[j]
          }
          array[j + increment] = temp
        }
      }
    }
    while (increment > 1)
    //console.log(array)
    this.setData({
      creditArray: array
    })
  },

  //综合希尔排序
  sumShallSort: function (array) {
    var increment = array.length
    var i
    var temp; //暂存
    var count = 0
    do {
      //设置增量
      increment = Math.floor(increment / 3) + 1
      for (i = increment; i < array.length; i++) {
        //console.log(increment)
        if (array[i].priority + array[i].credit > array[i - increment].priority + array[i - increment].credit) {
          temp = array[i]
          for (var j = i - increment; j >= 0 && temp.priority + temp.credit > array[j].priority + array[j].credit; j -= increment) {
            array[j + increment] = array[j]
          }
          array[j + increment] = temp
        }
      }
    }
    while (increment > 1)
    //console.log(array)
    this.setData({
      sumArray: array
    })
  }
})