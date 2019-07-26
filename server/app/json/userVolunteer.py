#-*- coding: UTF-8 -*-
from app import db, models
from flask_restful import Resource, reqparse, abort

# 参数初始化
parse = reqparse.RequestParser()
parse.add_argument('id')
parse.add_argument('nickname')
parse.add_argument('volunteer_id')
parse.add_argument('deleted')
parse.add_argument('joined')

class userVolunteer(Resource):
    # 查询用户-志愿者类活动信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的微信昵称
        nickname = args.get('nickname')
        volunteer_id = args.get('volunteer_id')
        # 根据昵称查找
        if nickname!='':
            # 判断用户是否存在
            if models.user.query.filter_by(nickname = nickname).all():
                l = []
                userVolunteers = models.userVolunteer.query.filter_by(nickname = nickname).all()
                for item in userVolunteers:
                    volunteer = models.volunteer.query.filter_by(id = item.volunteer_id).first()
                    volunteerDetail = {
                        "id": volunteer.id,
                        "title": volunteer.title,
                        "address": volunteer.address,
                        "date": volunteer.date,
                        "picture1": volunteer.picture1,
                        "picture2": volunteer.picture2,
                        "picture3": volunteer.picture3,
                        "introduce": volunteer.introduce,
                        "people": volunteer.people,
                        "canceled": volunteer.canceled
                    }
                    l.append({
                        "id": item.id,
                        "nickname": item.nickname,
                        "volunteer_detail": volunteerDetail,
                        "deleted": item.deleted,
                        "joined": item.joined
                    })
                d = {}
                d["list"] = l
                return d, 200
            else:
                return {
                    abort(404, message="{} doesn't exist".format(nickname))
                }
        # 根据志愿者id查找
        elif volunteer_id != '':
            l = []
            volunteerList = models.userVolunteer.query.filter_by(volunteer_id=volunteer_id).all()
            for item in volunteerList:
                user = models.user.query.filter_by(nickname=item.nickname).first()
                name = user.name
                l.append({
                    "id": item.id,
                    "nickname": item.nickname,
                    "name": name,
                    "deleted": item.deleted,
                    "joined": item.joined
                })
            d = {}
            d["list"] = l
            return d, 200

    # 添加用户-志愿者类活动信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 找到之前最大的id
        max = models.userVolunteer.query.order_by(db.desc(models.userVolunteer.id)).first()
        id = max.id + 1 if max else 1
        # 判断活动是否存在
        volunteer = models.volunteer.query.filter_by(id=args.volunteer_id).first()
        if volunteer:
            # 创建用户-志愿者类活动
            userVolunteer = models.userVolunteer()
            # 将传入参数加入到userVolunteer中
            userVolunteer.id = id
            userVolunteer.nickname = args.nickname
            userVolunteer.volunteer_id = args.volunteer_id
            userVolunteer.deleted = 0
            userVolunteer.joined = -1
            # 将userVolunteer存入数据库
            try:
                db.session.add(userVolunteer)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            # 修改volunteer相应活动的已报名人数
            volunteer.people = volunteer.people + 1
            try:
                db.session.add(volunteer)
                db.session.commit()
                return {"message": "success"}
            except Exception as e:
                db.session.rollback()
                abort(500)
        else:
            return {
                abort(404, message="volunteer {} doesn't exist".format(args.volunteer_id))
            }

    # 修改用户-志愿者类活动信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的id
        id = args.get('id')
        # 根据微信昵称及活动id得到表中某条用户-志愿者类活动信息
        userVolunteer = models.userVolunteer.query.get(id)
        # 判断用户-志愿者类活动是否存在
        if userVolunteer:
            userVolunteer.deleted = args.deleted if args.deleted else userVolunteer.deleted
            userVolunteer.joined = args.joined if args.joined else userVolunteer.joined
            #  将修改后的userVolunteer存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 删除用户-志愿者类活动信息
    def delete(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的微信昵称和活动id
        nickname = args.get('nickname')
        volunteer_id = args.get('volunteer_id')
        # 根据微信昵称和活动id得到表中某条用户-志愿者类活动信息
        userVolunteer = models.userVolunteer.query.filter_by(nickname = nickname, volunteer_id = volunteer_id).first()
        # 判断用户-志愿者类活动是否存在
        if userVolunteer:
            try:
                db.session.delete(userVolunteer)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            volunteer = models.volunteer.query.filter_by(id=args.volunteer_id).first()
            # 修改volunteer相应活动的已报名人数
            volunteer.people = volunteer.people - 1
            try:
                db.session.add(volunteer)
                db.session.commit()
                return {"message": "success"}
            except Exception as e:
                db.session.rollback()
                abort(500)
        else:
            return {
                abort(404, message="userVolunteer doesn't exist")
            }