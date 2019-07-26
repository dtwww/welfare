// pages/donation/donation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: null,
    searchArray: null,
    inputSearch: '',
    showModal: false,
    id: null,
    index: null
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
    var that = this
    //调用donation接口返回按数据库逆序排序的活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/donation?id=0',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          array: res.data.list
        })
        if (that.data.inputSearch != '') {
          var array1 = []
          for (var i = 0; i < that.data.array.length; ++i) {
            //判断数组该项的活动标题、地点或介绍是否包含搜索的字符串
            if (that.data.array[i].title.indexOf(that.data.inputSearch) != -1 || that.data.array[i].address.indexOf(that.data.inputSearch) != -1 || that.data.array[i].introduce.indexOf(that.data.inputSearch) != -1) {
              array1.push(that.data.array[i])
            }
          }
          that.setData({
            searchArray: array1
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

  //搜索框输入事件
  inputChange: function (e) {
    this.setData({
      inputSearch: e.detail.value
    })
    if (this.data.inputSearch != '') {
      var array1 = []
      for (var i = 0; i < this.data.array.length; ++i) {
        //判断数组该项的活动标题、地点或介绍是否包含搜索的字符串
        if (this.data.array[i].title.indexOf(this.data.inputSearch) != -1 || this.data.array[i].address.indexOf(this.data.inputSearch) != -1 || this.data.array[i].introduce.indexOf(this.data.inputSearch) != -1) {
          array1.push(this.data.array[i])
        }
      }
      this.setData({
        searchArray: array1,
      })
    }
  },

  //添加按钮点击事件
  add: function (e) {
    wx.navigateTo({
      url: '../donationAdd/donationAdd',
    })
  },

  //编辑按钮点击事件
  edit: function(e){
    wx.navigateTo({
      url: '../donationEdit/donationEdit?id='+ e.currentTarget.dataset.id,
    })
  },

  //删除按钮点击事件
  delete: function(e){
    this.setData({
      showModal: true,
      id: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index
    })
  },

  //确认删除按钮点击事件
  yes: function(e){
    this.setData({
      showModal: false
    })
    var that = this
    //调用donation接口删除活动信息
    wx.request({
      url: 'http://127.0.0.1:5000/donation?id=' + that.data.id,
      method: 'DELETE',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        if(that.data.inputSearch == ''){
          that.data.array.splice(that.data.index, 1)
          that.setData({
            array: that.data.array
          })
        } else {
          that.data.searchArray.splice(that.data.index, 1)
          that.setData({
            searchArray: that.data.searchArray
          })
          wx.request({
            url: 'http://127.0.0.1:5000/donation?id=0',
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                array: res.data.list
              })
            }
          })
        }
      }
    })
  },

  //取消删除按钮点击事件
  no: function(e){
    this.setData({
      showModal: false
    })
  }
})