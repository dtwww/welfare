const app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    array: [],
    nickname: null,
    showJoinModal: false,
    showUnjoinModal: false,
    idInfo: null,
    index: null,
    priority: null,
    joined: null,
    color: '#EF7687',
    bgColor: 'white',
    userArray: null,
    priorityArray: null,
    isPriority: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var that = this
    //调用userVolunteer接口，根据id返回信息
    wx.request({
      url: 'http://127.0.0.1:5000/userVolunteer?volunteer_id=' + that.data.id + '&nickname=',
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        that.setData({
          array: res.data.list,
        })
        //console.log(that.data.array)
        //调用user接口，返回所有用户信息
        wx.request({
          url: 'http://127.0.0.1:5000/user?nickname=',
          method: 'GET',
          header: {
            'content-type': 'json' // 默认值
          },
          success: function (res) {
            that.setData({
              userArray: res.data.list
            })
            //console.log(that.data.array)
            for (var i = 0; i < that.data.array.length; ++i) {
              for (var j = 0; j < that.data.userArray.length; ++j) {
                if (that.data.array[i].nickname == that.data.userArray[j].nickname) {
                  that.data.array[i].priority = that.data.userArray[j].priority
                  //console.log(that.data.array[i])
                  break
                }
              }
            }
            //console.log(that.data.array)
            that.setData({
              array: that.data.array
            })
            //console.log(that.data.array)
            var tempArray = [].concat(that.data.array)
            //var timestamp1 = Date.parse(new Date());
            //var timestamp1 = (new Date()).valueOf();
            that.shallSort(tempArray)
            //var timestamp2 = Date.parse(new Date());
            //var timestamp2 = (new Date()).valueOf();
            //var date1 = util.formatTime(new Date(timestamp1))
            //var date2 = util.formatTime(new Date(timestamp2))
            //console.log(date2)
            //console.log(date1)
            //console.log(timestamp1)
            //console.log(timestamp2)
            //console.log(that.data.array)
            //console.log(that.data.priorityArray)
          }
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

  //按优先级排序按钮点击事件
  sort: function (e) {
    //未点击
    if (this.data.color == '#EF7687') {
      this.setData({
        color: 'white',
        bgColor: '#EF7687',
        isPriority: true
      })
      //已点击
    } else {
      this.setData({
        color: '#EF7687',
        bgColor: 'white',
        isPriority: false
      })
    }
  },

  //用户名字点击事件
  userDetail: function (e) {
    this.setData({
      nickname: e.currentTarget.dataset.nickname
    })
    wx.navigateTo({
      url: '../userDetail/userDetail?nickname=' + this.data.nickname,
    })
  },

  //确认加入按钮点击事件
  join: function (e) {
    //console.log(this.data.array)
    this.setData({
      showJoinModal: true,
      idInfo: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index,
      nickname: e.currentTarget.dataset.nickname
    })
    //console.log(this.data.array)
  },

  //确定确认加入按钮点击事件
  yesJoin: function (e) {
    if (!this.data.isPriority) {
      //console.log(this.data.array)
      this.setData({
        showJoinModal: false,
        joined: this.data.array[this.data.index].joined
      })
      var that = this
      //调用userVolunteer接口，修改joined信息
      wx.request({
        url: 'http://127.0.0.1:5000/userVolunteer?id=' + that.data.idInfo,
        method: 'PUT',
        data: {
          joined: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.showToast({
            title: '加入成功！'
          })
          that.data.array[that.data.index].joined = 1
          that.setData({
            array: that.data.array
          })
          //console.log(that.data.array)
          var tempArray = [].concat(that.data.array)
          that.shallSort(tempArray)
          //console.log(that.data.array)
          //调用user接口，返回该用户的priority
          wx.request({
            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                priority: res.data.priority
              })
              if(that.data.priority > 0){
                //调用user接口，将该用户的priority - 1
                wx.request({
                  url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                  method: 'PUT',
                  data: {
                    priority: that.data.priority - 1
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    for (var i = 0; i < that.data.array.length; ++i) {
                      if (that.data.array[i].nickname == that.data.nickname) {
                        that.data.array[i].priority -= 1
                        that.setData({
                          array: that.data.array
                        })
                        var tempArray = [].concat(that.data.array)
                        that.shallSort(tempArray)
                        break
                      }
                    }
                    //若先取消再加入，应保持用户优先级不变
                    if (that.data.joined == 0 && that.data.priority - 1 > 0) {
                      //调用user接口，得到该用户的priority
                      wx.request({
                        url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                        method: 'GET',
                        header: {
                          'content-type': 'json' // 默认值
                        },
                        success: function (res) {
                          that.setData({
                            priority: res.data.priority
                          })
                          //调用user接口，将该用户的priority - 1
                          wx.request({
                            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                            method: 'PUT',
                            data: {
                              priority: that.data.priority - 1
                            },
                            header: {
                              'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                              for (var i = 0; i < that.data.array.length; ++i) {
                                if (that.data.array[i].nickname == that.data.nickname) {
                                  that.data.array[i].priority -= 1
                                  that.setData({
                                    array: that.data.array
                                  })
                                  var tempArray = [].concat(that.data.array)
                                  that.shallSort(tempArray)
                                  break
                                }
                              }
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })

        }
      })
    } else {
      this.setData({
        showJoinModal: false,
        joined: this.data.priorityArray[this.data.index].joined
      })
      var that = this
      //调用userVolunteer接口，修改joined信息
      wx.request({
        url: 'http://127.0.0.1:5000/userVolunteer?id=' + that.data.idInfo,
        method: 'PUT',
        data: {
          joined: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.showToast({
            title: '加入成功！'
          })
          that.data.priorityArray[that.data.index].joined = 1
          that.setData({
            priorityArray: that.data.priorityArray
          })
          for(var i=0; i<that.data.array.length; ++i){
            if(that.data.array[i].nickname == that.data.nickname){
              that.data.array[i].joined = 1
              break
            }
          }
          that.setData({
            array: that.data.array
          })
          //调用user接口，得到该用户的priority
          wx.request({
            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                priority: res.data.priority
              })
              if(that.data.priority > 0){
                //调用user接口，将该用户的priority - 1
                wx.request({
                  url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                  method: 'PUT',
                  data: {
                    priority: that.data.priority - 1
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    for (var j = 0; j < that.data.array.length; ++j) {
                      if (that.data.array[j].nickname == that.data.nickname) {
                        that.data.array[j].priority -= 1
                        break
                      }
                    }
                    that.setData({
                      array: that.data.array
                    })
                    var tempArray = [].concat(that.data.array)
                    that.shallSort(tempArray)
                    //若先取消再加入，应保持用户优先级不变
                    if (that.data.joined == 0 && that.data.priority-1 > 0) {
                      //调用user接口，得到该用户的priority
                      wx.request({
                        url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                        method: 'GET',
                        header: {
                          'content-type': 'json' // 默认值
                        },
                        success: function (res) {
                          that.setData({
                            priority: res.data.priority
                          })
                          //调用user接口，将该用户的priority - 1
                          wx.request({
                            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                            method: 'PUT',
                            data: {
                              priority: that.data.priority - 1
                            },
                            header: {
                              'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                              for (var j = 0; j < that.data.array.length; ++j) {
                                if (that.data.array[j].nickname == that.data.nickname) {
                                  that.data.array[j].priority -= 1
                                  break
                                }
                              }
                              that.setData({
                                array: that.data.array
                              })
                              var tempArray = [].concat(that.data.array)
                              that.shallSort(tempArray)
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  },

  //取消确认加入按钮点击事件
  noJoin: function (e) {
    this.setData({
      showJoinModal: false
    })
  },

  //取消加入按钮点击事件
  unjoin: function (e) {
    this.setData({
      showUnjoinModal: true,
      idInfo: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index,
      nickname: e.currentTarget.dataset.nickname
    })
  },

  //确定取消加入按钮点击事件
  yesUnjoin: function (e) {
    if (!this.data.isPriority) {
      this.setData({
        showUnjoinModal: false,
        joined: this.data.array[this.data.index].joined
      })
      var that = this
      //调用userVolunteer接口，修改joined信息
      wx.request({
        url: 'http://127.0.0.1:5000/userVolunteer?id=' + that.data.idInfo,
        method: 'PUT',
        data: {
          joined: 0
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.data.array[that.data.index].joined = 0
          that.setData({
            array: that.data.array
          })
          var tempArray = [].concat(that.data.array)
          that.shallSort(tempArray)
          //调用user接口，得到该用户的priority
          wx.request({
            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                priority: res.data.priority
              })
              //调用user接口，将该用户的priority + 1
              wx.request({
                url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                method: 'PUT',
                data: {
                  priority: that.data.priority + 1
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  for (var i = 0; i < that.data.array.length; ++i) {
                    if (that.data.array[i].nickname == that.data.nickname) {
                      that.data.array[i].priority += 1
                      that.setData({
                        array: that.data.array
                      })
                      var tempArray = [].concat(that.data.array)
                      that.shallSort(tempArray)
                      break
                    }
                  }
                  wx.showToast({
                    title: '取消成功！'
                  })
                  //若先加入再取消，应保持用户优先级不变
                  if (that.data.joined == 1) {
                    //调用user接口，得到该用户的priority
                    wx.request({
                      url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                      method: 'GET',
                      header: {
                        'content-type': 'json' // 默认值
                      },
                      success: function (res) {
                        that.setData({
                          priority: res.data.priority
                        })
                        //调用user接口，将该用户的priority + 1
                        wx.request({
                          url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                          method: 'PUT',
                          data: {
                            priority: that.data.priority + 1
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success: function (res) {
                            for (var i = 0; i < that.data.array.length; ++i) {
                              if (that.data.array[i].nickname == that.data.nickname) {
                                that.data.array[i].priority += 1
                                that.setData({
                                  array: that.data.array
                                })
                                var tempArray = [].concat(that.data.array)
                                that.shallSort(tempArray)
                                break
                              }
                            }
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    } else {
      this.setData({
        showUnjoinModal: false,
        joined: this.data.array[this.data.index].joined
      })
      var that = this
      //调用userVolunteer接口，修改joined信息
      wx.request({
        url: 'http://127.0.0.1:5000/userVolunteer?id=' + that.data.idInfo,
        method: 'PUT',
        data: {
          joined: 0
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.data.priorityArray[that.data.index].joined = 0
          that.setData({
            priorityArray: that.data.priorityArray
          })
          for (var i = 0; i < that.data.array.length; ++i) {
            if (that.data.array[i].nickname == that.data.nickname) {
              that.data.array[i].joined = 0
              break
            }
          }
          that.setData({
            array: that.data.array
          })
          //调用user接口，得到该用户的priority
          wx.request({
            url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
            method: 'GET',
            header: {
              'content-type': 'json' // 默认值
            },
            success: function (res) {
              that.setData({
                priority: res.data.priority
              })
              //调用user接口，将该用户的priority + 1
              wx.request({
                url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                method: 'PUT',
                data: {
                  priority: that.data.priority + 1
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  for (var i = 0; i < that.data.array.length; ++i) {
                    if (that.data.array[i].nickname == that.data.nickname) {
                      that.data.array[i].priority += 1
                      that.setData({
                        array: that.data.array
                      })
                      var tempArray = [].concat(that.data.array)
                      that.shallSort(tempArray)
                      break
                    }
                  }
                  wx.showToast({
                    title: '取消成功！'
                  })
                  //若先加入再取消，应保持用户优先级不变
                  if (that.data.joined == 1) {
                    //调用user接口，得到该用户的priority
                    wx.request({
                      url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                      method: 'GET',
                      header: {
                        'content-type': 'json' // 默认值
                      },
                      success: function (res) {
                        that.setData({
                          priority: res.data.priority
                        })
                        //调用user接口，将该用户的priority + 1
                        wx.request({
                          url: 'http://127.0.0.1:5000/user?nickname=' + that.data.nickname,
                          method: 'PUT',
                          data: {
                            priority: that.data.priority + 1
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success: function (res) {
                            for (var i = 0; i < that.data.array.length; ++i) {
                              if (that.data.array[i].nickname == that.data.nickname) {
                                that.data.array[i].priority += 1
                                that.setData({
                                  array: that.data.array
                                })
                                var tempArray = [].concat(that.data.array)
                                that.shallSort(tempArray)
                                break
                              }
                            }
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  },

  //取消取消加入按钮点击事件
  noUnjoin: function (e) {
    this.setData({
      showUnjoinModal: false
    })
  },

  //希尔排序
  shallSort: function (array) {
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
    } while (increment > 1)
    //console.log(array)
    this.setData({
      priorityArray: array
    })
  }
})