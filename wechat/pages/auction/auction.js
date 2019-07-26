const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeColor: "white",
    timeBgColor: "#EF7687",
    heatColor: "#EF7687",
    heatBgColor: "white",
    timeArray: null,
    heatArray: null,
    isTime: true,
    inputSearch: '',
    searchTimeArray: null,
    searchHeatArray: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // if (this.data.timeColor == "#EF7687") {
    //   this.setData({
    //     isTime: true,
    //     timeColor: "white",
    //     timeBgColor: "#EF7687",
    //     heatColor: "#EF7687",
    //     heatBgColor: "white"
    //   })
    // }

    var that = this
    //调用auction接口返回按时间排序的物品信息
    wx.request({
      url: 'http://127.0.0.1:5000/auction?id=-1',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          timeArray: res.data.list
        })
        //console.log(that.data.donationArray)
        if (that.data.inputSearch != '') {
          var array1 = []
          for (var i = 0; i < that.data.timeArray.length; ++i) {
            //判断数组该项的物品名称、地点或介绍是否包含搜索的字符串
            // if (that.data.timeArray[i].name.indexOf(that.data.inputSearch) != -1 || that.data.timeArray[i].address.indexOf(that.data.inputSearch) != -1 || that.data.timeArray[i].introduce.indexOf(that.data.inputSearch) != -1)
            if (that.kmp(that.data.timeArray[i].name, that.data.inputSearch) != -1 || that.kmp(that.data.timeArray[i].address, that.data.inputSearch) != -1 || that.kmp(that.data.timeArray[i].introduce, that.data.inputSearch) != -1) {
              array1.push(that.data.timeArray[i])
            }
          }
          that.setData({
            searchTimeArray: array1
          })
        }
      }
    })
    //调用auction接口返回按热度排序的物品信息
    wx.request({
      url: 'http://127.0.0.1:5000/auction?id=-2',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          heatArray: res.data.list
        })
        //console.log(that.data.donationArray)
        if (that.data.inputSearch != '') {
          var array2 = []
          for (var i = 0; i < that.data.heatArray.length; ++i) {
            //判断数组该项的物品名称、地点或介绍是否包含搜索的字符串
            //if (that.data.heatArray[i].name.indexOf(that.data.inputSearch) != -1 || that.data.heatArray[i].address.indexOf(that.data.inputSearch) != -1 || that.data.heatArray[i].introduce.indexOf(that.data.inputSearch) != -1)
            if (that.kmp(that.data.heatArray[i].name, that.data.inputSearch) != -1 || that.kmp(that.data.heatArray[i].address, that.data.inputSearch) != -1 || that.kmp(that.data.heatArray[i].introduce, that.data.inputSearch) != -1) {
              array2.push(that.data.heatArray[i])
            }
          }
          that.setData({
            searchHeatArray: array2
          })
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

  //按时间排序按钮点击事件
  sortTime: function (e) {
    if (this.data.timeColor == "#EF7687") {
      this.setData({
        isTime: true,
        timeColor: "white",
        timeBgColor: "#EF7687",
        heatColor: "#EF7687",
        heatBgColor: "white"
      })
    }
  },

  //按热度排序按钮点击事件
  sortHeat: function (e) {
    if (this.data.heatColor == "#EF7687") {
      this.setData({
        isTime: false,
        heatColor: "white",
        heatBgColor: "#EF7687",
        timeColor: "#EF7687",
        timeBgColor: "white"
      })
    }
  },

  //每一项点击事件
  auctionDetail: function (e) {
    wx.navigateTo({
      url: '../auctionDetail/auctionDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  //搜索框输入事件
  inputChange: function (e) {
    this.setData({
      inputSearch: e.detail.value
    })
    if (this.data.inputSearch != '') {
      var array1 = [], array2 = []
      for (var i = 0; i < this.data.timeArray.length; ++i) {
        //判断数组该项的物品名称、地点或介绍是否包含搜索的字符串
        //if (this.data.timeArray[i].name.indexOf(this.data.inputSearch) != -1 || this.data.timeArray[i].address.indexOf(this.data.inputSearch) != -1 || this.data.timeArray[i].introduce.indexOf(this.data.inputSearch) != -1)
        if (this.kmp(this.data.timeArray[i].name, this.data.inputSearch) != -1 || this.kmp(this.data.timeArray[i].address, this.data.inputSearch) != -1 || this.kmp(this.data.timeArray[i].introduce, this.data.inputSearch) != -1) {
          array1.push(this.data.timeArray[i])
        }
      }
      for (var i = 0; i < this.data.heatArray.length; ++i) {
        //判断数组该项的物品名称、地点或介绍是否包含搜索的字符串
        //if (this.data.heatArray[i].name.indexOf(this.data.inputSearch) != -1 || this.data.heatArray[i].address.indexOf(this.data.inputSearch) != -1 || this.data.heatArray[i].introduce.indexOf(this.data.inputSearch) != -1)
        if (this.kmp(this.data.heatArray[i].name, this.data.inputSearch) != -1 || this.kmp(this.data.heatArray[i].address, this.data.inputSearch) != -1 || this.kmp(this.data.heatArray[i].introduce, this.data.inputSearch) != -1) {
          array2.push(this.data.heatArray[i])
        }
      }
      this.setData({
        searchTimeArray: array1,
        searchHeatArray: array2
      })
    }
  },

  //kmp算法
  kmp: function (S, T) {

    var next = []
    next[0] = -1
    var i = 1, j = 0
    next[1] = 0
    while (i < T.length) {
      if (j == 0 || T[i - 1] == T[j - 1]) {
        ++i
        ++j
        next[i] = j
      } else {
        j = next[j]
      }
    }

    var i = 0, j = 0
    while (i < S.length && j < T.length) {
      if (j == -1 || S[i] == T[j]) {
        i++
        j++
      } else {
        //console.log(this.data.next)
        j = next[j]
      }                   //i不变,j后退
    }
    if (j >= T.length) {   //匹配成功
      return i - j
      //console.log(i - j)
    } else {	            //返回不匹配标志
      return -1
      //console.log(-1)
    }
  }
})