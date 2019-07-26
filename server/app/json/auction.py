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
parse.add_argument('name')
parse.add_argument('address')
parse.add_argument('date')
parse.add_argument('picture1')
parse.add_argument('picture2')
parse.add_argument('picture3')
parse.add_argument('introduce')
parse.add_argument('paid')

class auction(Resource):
    # 查询拍卖物品信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的物品id
        id = args.get('id')
        # 判断是否要查询按数据库逆序排序的拍卖物品列表
        if (id == '0'):
            l = []
            # 获得按数据库逆序排序后的列表
            auctions = models.auction.query.order_by(db.desc(models.auction.id)).all()
            for item in auctions:
                l.append({
                    "id": item.id,
                    "name": item.name,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money,
                    "paid": item.paid
                })
            d = {}
            d["list"] = l
            return d, 200
        # 判断是否要查询按时间排序的拍卖物品列表
        if (id == '-1'):
            l = []
            # 获得按时间排序后的列表
            auctions = models.auction.query.order_by(db.desc(models.auction.date)).all()
            for item in auctions:
                l.append({
                    "id": item.id,
                    "name": item.name,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money,
                    "paid": item.paid
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
        # 判断是否要查询按热度排序的拍卖物品列表
        if (id == '-2'):
            l = []
            # 获得按热度排序后的列表
            auctions = models.auction.query.order_by(db.desc(models.auction.money)).all()
            for item in auctions:
                l.append({
                    "id": item.id,
                    "name": item.name,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "money": item.money,
                    "paid": item.paid
                }),
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
        # 根据物品id得到表中某条拍卖物品信息
        auction = models.auction.query.get(id)
        # 判断拍卖物品是否存在
        if auction:
            return {
                        "id": auction.id,
                        "name": auction.name,
                        "address": auction.address,
                        "date": auction.date,
                        "picture1": auction.picture1,
                        "picture2": auction.picture2,
                        "picture3": auction.picture3,
                        "introduce": auction.introduce,
                        "money": auction.money,
                        "paid": auction.paid
                   }, 200
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 添加拍卖物品信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 找到之前最大的id
        max = models.auction.query.order_by(db.desc(models.auction.id)).first()
        id = max.id + 1 if max else 1
        # 创建拍卖物品
        auction = models.auction()
        # 将传入参数加入到auction中
        auction.id = id
        auction.name = args.name
        auction.address = args.address
        auction.date = args.date
        auction.picture1 = args.picture1
        auction.picture2 = args.picture2
        auction.picture3 = args.picture3
        auction.introduce = args.introduce
        auction.money = 0
        auction.paid = 0
        # 将auction存入数据库
        try:
            db.session.add(auction)
            db.session.commit()
            return {"message": "success"}
        except Exception as e:
            db.session.rollback()
            abort(500)

    # 修改拍卖物品信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的物品id
        id = args.get('id')
        # 根据物品id得到表中某条拍卖物品信息
        auction = models.auction.query.get(id)
        # 判断拍卖物品是否存在
        if auction:
            auction.name = args.name if args.name else auction.name
            auction.address = args.address if args.address else auction.address
            auction.date = args.date if args.date else auction.date
            auction.picture1 = args.picture1 if args.picture1 else auction.picture1
            auction.picture2 = args.picture2 if args.picture2 else auction.picture2
            auction.picture3 = args.picture3 if args.picture3 else auction.picture3
            auction.introduce = args.introduce if args.introduce else auction.introduce
            auction.paid = args.paid if args.paid else auction.paid
            # 将修改后的auction存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 删除拍卖物品信息
    def delete(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的物品id
        id = args.get('id')
        # 根据物品id得到表中某条拍卖物品信息
        auction = models.auction.query.get(id)
        # 判断拍卖物品是否存在
        if auction:
            # 删除数据库中该条拍卖物品信息
            try:
                db.session.delete(auction)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            # 删除数据库中与该活动有关的用户-拍卖物品信息
            userAuction = models.userAuction.query.filter_by(auction_id = id).all()
            for item in userAuction:
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