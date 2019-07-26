#-*- coding: UTF-8 -*-
from app import api

# 用户信息接口--GET POST PUT
from app.json.user import user
api.add_resource(user, '/user')

# 管理员信息接口--GET
from app.json.admin import admin
api.add_resource(admin, '/admin')

# 捐款类活动接口--GET POST PUT DELETE
from app.json.donation import donation
api.add_resource(donation, '/donation')

# 志愿者类活动接口--GET POST PUT DELETE
from app.json.volunteer import volunteer
api.add_resource(volunteer, '/volunteer')

# 拍卖物品接口--GET POST PUT DELETE
from app.json.auction import auction
api.add_resource(auction, '/auction')

# 用户-捐款类活动接口--GET POST PUT DELETE
from app.json.userDonation import userDonation
api.add_resource(userDonation, '/userDonation')

# 用户-志愿者类活动接口--GET POST PUT DELETE
from app.json.userVolunteer import userVolunteer
api.add_resource(userVolunteer, '/userVolunteer')

# 用户-拍卖物品接口--GET POST PUT DELETE
from app.json.userAuction import userAuction
api.add_resource(userAuction, '/userAuction')