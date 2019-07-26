#-*- coding: UTF-8 -*-
from app import db, models
from flask_restful import Resource, reqparse, abort

# 参数初始化
parse = reqparse.RequestParser()
parse.add_argument('nickname')
parse.add_argument('name')
parse.add_argument('sex')
parse.add_argument('country')
parse.add_argument('province')
parse.add_argument('city')
parse.add_argument('id')
parse.add_argument('phone')
parse.add_argument('credit')
parse.add_argument('priority')

class user(Resource):
    # 查询用户信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的昵称
        nickname = args.get('nickname')
        # 判断是否要查询用户列表
        if (nickname == ""):
            l = []
            users = models.user.query.all()
            for item in users:
                l.append({
                    "nickname": item.nickname,
                    "name": item.name,
                    "sex": item.sex,
                    "country": item.country,
                    "province": item.province,
                    "city": item.city,
                    "id": item.id,
                    "phone": item.phone,
                    "credit": item.credit,
                    "priority": item.priority
                })
            d = {}
            d["list"] = l
            return d, 200
        # 根据昵称得到表中某条用户信息
        user = models.user.query.get(nickname)
        # 判断用户是否存在
        if user:
            return {
                       "nickname": user.nickname,
                       "name": user.name,
                       "sex": user.sex,
                       "country": user.country,
                       "province": user.province,
                       "city": user.city,
                        "id": user.id,
                       "phone": user.phone,
                       "credit": user.credit,
                       "priority": user.priority
                   }, 200
        else:
            # return {
            #     abort(404, message="{} doesn't exist".format(nickname))
            # }
            # 创建用户
            user = models.user()
            # 将传入参数加入到user中
            user.nickname = args.nickname
            user.name = ""
            user.sex = ""
            user.country = ""
            user.province = ""
            user.city = ""
            user.id = ""
            user.phone = ""
            user.credit = 0
            user.priority = 0
            # 将user存入数据库
            try:
                db.session.add(user)
                db.session.commit()
                return {
                           "nickname": user.nickname,
                           "name": user.name,
                           "sex": user.sex,
                           "country": user.country,
                           "province": user.province,
                           "city": user.city,
                           "id": user.id,
                           "phone": user.phone,
                           "credit": user.credit,
                           "priority": user.priority
                       }, 200
            except Exception as e:
                db.session.rollback()
                abort(500)

    # 添加用户信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的昵称
        nickname = args.get('nickname')
        # 判断用户是否已经存在
        if models.user.query.get(nickname):
            abort(400, message="{} existed".format(nickname))
        # 创建用户
        user = models.user()
        # 将传入参数加入到user中
        user.nickname = args.nickname
        user.name = args.name
        user.sex = args.sex
        user.country = args.country
        user.province = args.province
        user.city = args.city
        user.id = args.id
        user.phone = args.phone
        user.credit = 0
        user.priority = 0
        # 将user存入数据库
        try:
            db.session.add(user)
            db.session.commit()
            return {"message": "success"}
        except Exception as e:
            db.session.rollback()
            abort(500)

    # 修改用户信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的昵称
        nickname = args.get('nickname')
        # 根据昵称得到表中某条用户信息
        user = models.user.query.get(nickname)
        # 判断用户是否存在
        if user:
            user.name = args.name if args.name else user.name
            user.sex = args.sex if args.sex else user.sex
            user.country = args.country if args.country else user.country
            user.province = args.province if args.province else user.province
            user.city = args.city if args.city else user.city
            user.id = args.id if args.id else user.id
            user.phone = args.phone if args.phone else user.phone
            user.credit = args.credit if args.credit else user.credit
            user.priority = args.priority if args.priority else user.priority
            # 将修改后的user存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(nickname))
            }