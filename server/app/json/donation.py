#-*- coding: UTF-8 -*-
from app import db, models
from flask_restful import Resource, reqparse, abort

class BTNode:
    def __init__(self, data, left, right):
        self.data = data
        self.left = left
        self.right = right

class BTree:
    def __init__(self, root):
        self.root = root

    def insertTime(self, value):
        self.insertTimeNode(value, self.root)

    def insertHeat(self, value):
        self.insertHeatNode(value, self.root)

    def insertTimeNode(self, data, btnode):
        if btnode == None:
            btnode = BTNode(data, None, None)
        elif data['date'] < btnode.data['date']:
            if btnode.left == None:
                btnode.left = BTNode(data, None, None)
                return
            self.insertTimeNode(data, btnode.left)
        else:
            if btnode.right == None:
                btnode.right = BTNode(data, None, None)
                return
            self.insertTimeNode(data, btnode.right)

    def insertHeatNode(self, data, btnode):
        if btnode == None:
            btnode = BTNode(data, None, None)
        elif data['money'] < btnode.data['money']:
            if btnode.left == None:
                btnode.left = BTNode(data, None, None)
                return
            self.insertHeatNode(data, btnode.left)
        else:
            if btnode.right == None:
                btnode.right = BTNode(data, None, None)
                return
            self.insertHeatNode(data, btnode.right)

    def printBTreeImpl(self, btnode, l2):
        if btnode == None:
            return
        self.printBTreeImpl(btnode.right, l2)
        l2.append(btnode.data)
        # print (btnode.data)
        self.printBTreeImpl(btnode.left, l2)

    def printBTree(self, l2):
        self.printBTreeImpl(self.root, l2)

# 参数初始化
parse = reqparse.RequestParser()
parse.add_argument('id')
parse.add_argument('title')
parse.add_argument('address')
parse.add_argument('date')
parse.add_argument('picture1')
parse.add_argument('picture2')
parse.add_argument('picture3')
parse.add_argument('introduce')

class donation(Resource):
    # 查询捐款类活动信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 判断是否要查询按数据库逆序排序的捐款类活动列表
        if (id == '0'):
            l = []
            # 获得按数据库逆序排序的列表
            donations = models.donation.query.order_by(db.desc(models.donation.id)).all()
            for item in donations:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money
                })
            d = {}
            d["list"] = l
            return d, 200
        # 判断是否要查询按时间排序的捐款类活动列表
        if (id == '-1'):
            l = []
            # 获得按时间排序后的列表
            # donations = models.donation.query.order_by(db.desc(models.donation.date)).all()
            donations = models.donation.query.all()
            for item in donations:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money
                })
            root = BTNode(l[0], None, None)
            # print(root.data['date'])
            flag = 0
            btree = BTree(root)
            for i in l:
                if(flag == 0):
                    flag = 1
                    continue
                btree.insertTime(i)
            l2 = []
            btree.printBTree(l2)
            d = {}
            d["list"] = l2
            return d, 200
        # 判断是否要查询按热度排序的捐款类活动列表
        if (id == '-2'):
            l = []
            # 获得按热度排序后的列表
            donations = models.donation.query.order_by(db.desc(models.donation.money)).all()
            for item in donations:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money
                })
            root = BTNode(l[0], None, None)
            # print(root.data['date'])
            flag = 0
            btree = BTree(root)
            for i in l:
                if (flag == 0):
                    flag = 1
                    continue
                btree.insertHeat(i)
            l2 = []
            btree.printBTree(l2)
            d = {}
            d["list"] = l2
            return d, 200
        # 根据活动id得到表中某条捐款类活动信息
        donation = models.donation.query.get(id)
        # 判断捐款类活动是否存在
        if donation:
            return {
                        "id": donation.id,
                        "title": donation.title,
                        "address": donation.address,
                        "date": donation.date,
                        "picture1": donation.picture1,
                        "picture2": donation.picture2,
                        "picture3": donation.picture3,
                        "introduce": donation.introduce,
                        "money": donation.money
                   }, 200
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 添加捐款类活动信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 找到之前最大的id
        max = models.donation.query.order_by(db.desc(models.donation.id)).first()
        id = max.id + 1 if max else 1
        # 创建捐款类活动
        donation = models.donation()
        # 将传入参数加入到donation中
        donation.id = id
        donation.title = args.title
        donation.address = args.address
        donation.date = args.date
        donation.picture1 = args.picture1
        donation.picture2 = args.picture2
        donation.picture3 = args.picture3
        donation.introduce = args.introduce
        donation.money = 0
        # 将donation存入数据库
        try:
            db.session.add(donation)
            db.session.commit()
            return {"message": "success"}
        except Exception as e:
            db.session.rollback()
            abort(500)

    # 修改捐款类活动信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 根据活动id得到表中某条捐款类活动信息
        donation = models.donation.query.get(id)
        # 判断捐款类活动是否存在
        if donation:
            donation.title = args.title if args.title else donation.title
            donation.address = args.address if args.address else donation.address
            donation.date = args.date if args.date else donation.date
            donation.picture1 = args.picture1 if args.picture1 else donation.picture1
            donation.picture2 = args.picture2 if args.picture2 else donation.picture2
            donation.picture3 = args.picture3 if args.picture3 else donation.picture3
            donation.introduce = args.introduce if args.introduce else donation.introduce
            # 将修改后的donation存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 删除捐款类活动信息
    def delete(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 根据活动id得到表中某条捐款类活动信息
        donation = models.donation.query.get(id)
        # 判断捐款类活动是否存在
        if donation:
            # 删除数据库中该条捐款类活动信息
            try:
                db.session.delete(donation)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            # 删除数据库中与该活动有关的用户-捐款类活动信息
            userDonation = models.userDonation.query.filter_by(donation_id = id).all()
            for item in userDonation:
                try:
                    db.session.delete(item)
                    db.session.commit()
                    return {"message": "success"}
                except Exception as e:
                    db.session.rollback()
                    abort(500)
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }