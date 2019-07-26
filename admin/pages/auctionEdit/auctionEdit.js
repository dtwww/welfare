const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picturePath: [],
    count: 3,
    showDeleteModal: false,
    index: null,
    name: null,
    address: null,
    picture1: null,
    picture2: null,
    picture3: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
    introduce: null,
    money: null,
    time: null,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/auction?id=' + that.data.id,
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          name: res.data.name,
          address: res.data.address,
          time: res.data.date,
          picture1: res.data.picture1,
          picture2: res.data.picture2,
          picture3: res.data.picture3,
          introduce: res.data.introduce,
          money: res.data.money
        })
        that.timestampToTime(new Date(that.data.time * 1000))
        that.data.picturePath.push(that.data.picture1)
        that.data.picturePath.push(that.data.picture2)
        that.data.picturePath.push(that.data.picture3)
        that.setData({
          picturePath: that.data.picturePath
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

  //名称输入事件
  nameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //地址输入事件
  addressChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  //年输入事件
  yearChange: function (e) {
    this.setData({
      year: e.detail.value
    })
  },

  //月输入事件
  monthChange: function (e) {
    this.setData({
      month: e.detail.value
    })
  },

  //日输入事件
  dayChange: function (e) {
    this.setData({
      day: e.detail.value
    })
  },

  //时输入事件
  hourChange: function (e) {
    this.setData({
      hour: e.detail.value
    })
  },

  //分输入事件
  minuteChange: function (e) {
    this.setData({
      minute: e.detail.value
    })
  },

  //秒输入事件
  secondChange: function (e) {
    this.setData({
      second: e.detail.value
    })
  },

  //介绍输入事件
  introduceChange: function (e) {
    this.setData({
      introduce: e.detail.value
    })
  },

  //添加图片按钮点击事件
  add: function (e) {
    //图片小于三张则可以继续添加
    if (this.data.count < 3) {
      var that = this
      wx.chooseImage({
        count: 1, //一次只能选一张
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.data.picturePath.push(res.tempFilePaths[0])
          that.setData({
            picturePath: that.data.picturePath,
            count: that.data.count + 1
          })
          //console.log(that.data.count)
        }
      })
    } else {
      wx.showToast({
        title: '图片过多！',
        image: '../../images/icons/warning.png',
        duration: 2500
      })
    }
  },

  //图片长按删除事件
  deletePicture: function (e) {
    this.setData({
      showDeleteModal: true,
      index: e.currentTarget.dataset.index
    })
    //console.log(this.data.index)
  },

  //确认删除图片事件
  yesDelete: function (e) {
    this.data.picturePath.splice(this.data.index, 1)
    this.setData({
      showDeleteModal: false,
      picturePath: this.data.picturePath,
      count: this.data.count - 1
    })
    //console.log(this.data.picturePath)
    //console.log(this.data.count)
  },

  //取消删除图片事件
  noDelete: function (e) {
    this.setData({
      showDeleteModal: false
    })
  },

  //查看捐款详情按钮点击事件
  detail: function (e) {
    wx.navigateTo({
      url: '../auctionDetail/auctionDetail?id=' + this.data.id,
    })
  },

  //修改按钮点击事件
  confirm: function (e) {
    //获取当前10位时间戳
    var timestamp = Date.parse(new Date()) / 1000;
    if (this.data.name == null || this.data.address == null || this.data.year == null || this.data.month == null || this.data.day == null || this.data.hour == null || this.data.minute == null || this.data.second == null || this.data.introduce == null) {
      wx.showToast({
        title: '输入不能为空！',
        image: '../../images/icons/warning.png',
        duration: 2500
      })
    } else if (this.data.count < 3) {
      wx.showToast({
        title: '图片过少！',
        image: '../../images/icons/warning.png',
        duration: 2500
      })
    } else {
      this.setData({
        time: this.timeToTimestamp() / 1000
      })
      // var time = this.timeToTimestamp() / 1000
      //console.log(time)
      //当前时间大于截止时间
      if (timestamp > this.data.time) {
        wx.showToast({
          title: '时间已过！',
          image: '../../images/icons/warning.png',
          duration: 2500
        })
      } else {
        var that = this
        // wx.uploadFile({
        //   url: 'http://127.0.0.1:5000/upload',
        //   filePath: that.data.picturePath[0],
        //   name: 'fileName',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     console.log(res.data)
        //   }
        // })
        wx.request({
          url: 'http://127.0.0.1:5000/auction?id=' + that.data.id,
          method: 'PUT',
          data: {
            name: that.data.name,
            address: that.data.address,
            date: that.data.time,
            picture1: that.data.picturePath[0],
            picture2: that.data.picturePath[1],
            picture3: that.data.picturePath[2],
            introduce: that.data.introduce
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log(that.data.name)
          }
        })
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '修改成功！',
        })
      }
    }
  },

  //截止日期转化为时间戳
  timeToTimestamp: function (e) {
    var timeStr = this.data.year + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.minute + ':' + this.data.second + ':000'
    //console.log(timeStr)
    var date = new Date(timeStr)
    //console.log(date)
    var time = Date.parse(date)
    //console.log(time)
    return time
  },

  //时间戳转化为年月日时分秒
  timestampToTime: function (date) {
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    })
  }
})