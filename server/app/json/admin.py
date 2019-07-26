#-*- coding: UTF-8 -*-
from app import db, models
from flask_restful import Resource, reqparse, abort

# 参数初始化
parse = reqparse.RequestParser()
parse.add_argument('username')

class admin(Resource):
    # 查询管理员信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的昵称
        username = args.get('username')
        # 根据用户名得到表中某条管理员信息
        admin = models.admin.query.get(username)
        # 判断管理员是否存在
        if admin:
            return {
                       "username": admin.username,
                       "password": admin.password,
                   }, 200
        else:
            return {
                        "username": ''
                   }, 200