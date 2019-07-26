#-*- coding: UTF-8 -*-
from app import db, models
from flask_restful import Resource, reqparse, abort

# 参数初始化
parse = reqparse.RequestParser()
parse.add_argument('id')
parse.add_argument('nickname')
parse.add_argument('auction_id')
parse.add_argument('money')
parse.add_argument('paid')
parse.add_argument('deleted')

class userAuction(Resource):
    # 查询用户-用户-拍卖物品信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的微信昵称和物品id
        nickname = args.get('nickname')
        auction_id = args.get('auction_id')
        # 根据昵称查找
        if nickname!='':
            # 判断用户是否存在
            if models.user.query.filter_by(nickname = nickname).all():
                l = []
                userAuctions = models.userAuction.query.filter_by(nickname = nickname).all()
                for item in userAuctions:
                    auction = models.auction.query.filter_by(id = item.auction_id).first()
                    auctionDetail = {
                        "id": auction.id,
                        "name": auction.name,
                        "address": auction.address,
                        "date": auction.date,
                        "picture1": auction.picture1,
                        "picture2": auction.picture2,
                        "picture3": auction.picture3,
                        "introduce": auction.introduce,
                        "money": auction.money
                    }
                    l.append({
                        "id": item.id,
                        "nickname": item.nickname,
                        "auction_detail": auctionDetail,
                        "money": item.money,
                        "paid": item.paid,
                        "deleted": item.deleted
                    })
                d = {}
                d["list"] = l
                return d, 200
            else:
                return {
                    abort(404, message="{} doesn't exist".format(nickname))
                }
        # 根据物品id查找
        elif auction_id != '':
            l = []
            auctionList = models.userAuction.query.filter_by(auction_id=auction_id).all()
            for item in auctionList:
                user = models.user.query.filter_by(nickname=item.nickname).first()
                name = user.name
                l.append({
                    "id": item.id,
                    "nickname": item.nickname,
                    "name": name,
                    "money": item.money,
                    "paid": item.paid,
                    "deleted": item.deleted
                })
            d = {}
            d["list"] = l
            return d, 200

    # 添加用户-用户-拍卖物品信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 找到之前最大的id
        max = models.userAuction.query.order_by(db.desc(models.userAuction.id)).first()
        id = max.id + 1 if max else 1
        # 判断物品是否存在
        auction = models.auction.query.filter_by(id = args.auction_id).first()
        if auction:
            # 创建用户-用户-拍卖物品
            userAuction = models.userAuction()
            # 将传入参数加入到userAuction中
            userAuction.id = id
            userAuction.nickname = args.nickname
            userAuction.auction_id = args.auction_id
            userAuction.money = args.money
            userAuction.paid = 0,
            userAuction.deleted = 0
            # 将userAuction存入数据库
            try:
                db.session.add(userAuction)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            # 修改auction相应物品的已竞拍钱数
            auction.money = float(args.money) if (float(args.money)>auction.money) else auction.money
            try:
                db.session.add(auction)
                db.session.commit()
                return {"message": "success"}
            except Exception as e:
                db.session.rollback()
                abort(500)
        else:
            return {
                abort(404, message="auction {} doesn't exist".format(args.auction_id))
            }
            
    # 修改用户-拍卖物品信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的id
        id = args.get('id')
        # 根据微信昵称及物品id得到表中某条用户-拍卖物品信息
        userAuction = models.userAuction.query.get(id)
        # 判断用户-拍卖物品是否存在
        if userAuction:
            userAuction.paid = args.paid if args.paid else userAuction.paid
            userAuction.deleted = args.deleted if args.deleted else userAuction.deleted
            #  将修改后的userAuction存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

# # 删除用户-拍卖物品信息（用户可参加多次拍卖？）
#     def delete(self):
#         # 得到参数列表
#         args = parse.parse_args()
#         # 得到参数列表中的微信昵称和活动id
#         nickname = args.get('nickname')
#         auction_id = args.get('auction_id')
#         # 根据微信昵称和物品id得到表中某条用户-拍卖物品信息
#         userAuction = models.userAuction.query.filter_by(nickname = nickname, auction_id = auction_id).first()
#         # 判断用户-拍卖物品是否存在
#         if userAuction:
#             try:
#                 db.session.delete(userAuction)
#                 db.session.commit()
#             except Exception as e:
#                 db.session.rollback()
#                 abort(500)
#             auction = models.auction.query.filter_by(id=args.auction_id).first()
#             # 修改auction相应活动的已竞拍钱数（该用户的上一个用户拍卖钱数？）
#             auction.money = auction.money - userAuction.money
#             try:
#                 db.session.add(auction)
#                 db.session.commit()
#                 return {"message": "success"}
#             except Exception as e:
#                 db.session.rollback()
#                 abort(500)
#         else:
#             return {
#                 abort(404, message="userauction doesn't exist")
#             }
