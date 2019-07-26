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
        elif data['people'] < btnode.data['people']:
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
parse.add_argument('canceled')

class volunteer(Resource):
    # 查询志愿者类活动信息
    def get(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 判断是否要查询按数据库逆序排序的志愿者类活动列表
        if (id == '0'):
            l = []
            # 获得按数据库逆序排序后的列表
            volunteers = models.volunteer.query.order_by(db.desc(models.volunteer.id)).all()
            for item in volunteers:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "people": item.people,
                    "canceled": item.canceled
                })
            d = {}
            d["list"] = l
            return d, 200
        # 判断是否要查询按时间排序的志愿者类活动列表
        if (id == '-1'):
            l = []
            # 获得按时间排序后的列表
            # volunteers = models.volunteer.query.order_by(db.desc(models.volunteer.date)).all()
            volunteers = models.volunteer.query.all()
            for item in volunteers:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "people": item.people,
                    "canceled": item.canceled
                })
            root = BTNode(l[0], None, None)
            # print(root.data['date'])
            flag = 0
            btree = BTree(root)
            for i in l:
                if (flag == 0):
                    flag = 1
                    continue
                btree.insertTime(i)
            l2 = []
            btree.printBTree(l2)
            d = {}
            d["list"] = l2
            return d, 200
        # 判断是否要查询按热度排序的志愿者类活动列表
        if (id == '-2'):
            l = []
            # 获得按热度排序后的列表
            volunteers = models.volunteer.query.order_by(db.desc(models.volunteer.people)).all()
            for item in volunteers:
                l.append({
                    "id": item.id,
                    "title": item.title,
                    "address": item.address,
                    "date": item.date,
                    "picture1": item.picture1,
                    "picture2": item.picture2,
                    "picture3": item.picture3,
                    "introduce": item.introduce,
                    "people": item.people,
                    "canceled": item.canceled
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
        # 根据活动id得到表中某条志愿者类活动信息
        volunteer = models.volunteer.query.get(id)
        # 判断志愿者类活动是否存在
        if volunteer:
            return {
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
                   }, 200
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 添加志愿者类活动信息
    def post(self):
        # 得到参数列表
        args = parse.parse_args()
        # 找到之前最大的id
        max = models.volunteer.query.order_by(db.desc(models.volunteer.id)).first()
        id = max.id + 1 if max else 1
        # 创建志愿者类活动
        volunteer = models.volunteer()
        # 将传入参数加入到volunteer中
        volunteer.id = id
        volunteer.title = args.title
        volunteer.address = args.address
        volunteer.date = args.date
        volunteer.picture1 = args.picture1
        volunteer.picture2 = args.picture2
        volunteer.picture3 = args.picture3
        volunteer.introduce = args.introduce
        volunteer.people = 0
        volunteer.canceled = 0
        # 将volunteer存入数据库
        try:
            db.session.add(volunteer)
            db.session.commit()
            return {"message": "success"}
        except Exception as e:
            db.session.rollback()
            abort(500)

    # 修改志愿者类活动信息
    def put(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 根据活动id得到表中某条志愿者类活动信息
        volunteer = models.volunteer.query.get(id)
        # 判断志愿者类活动是否存在
        if volunteer:
            volunteer.title = args.title if args.title else volunteer.title
            volunteer.address = args.address if args.address else volunteer.address
            volunteer.date = args.date if args.date else volunteer.date
            volunteer.picture1 = args.picture1 if args.picture1 else volunteer.picture1
            volunteer.picture2 = args.picture2 if args.picture2 else volunteer.picture2
            volunteer.picture3 = args.picture3 if args.picture3 else volunteer.picture3
            volunteer.introduce = args.introduce if args.introduce else volunteer.introduce
            volunteer.canceled = args.canceled if args.canceled else volunteer.canceled
            # 将修改后的volunteer存入数据库
            db.session.commit()
            return {"message": "success"}
        else:
            return {
                abort(404, message="{} doesn't exist".format(id))
            }

    # 删除志愿者类活动信息
    def delete(self):
        # 得到参数列表
        args = parse.parse_args()
        # 得到参数列表中的活动id
        id = args.get('id')
        # 根据活动id得到表中某条志愿者类活动信息
        volunteer = models.volunteer.query.get(id)
        # 判断志愿者类活动是否存在
        if volunteer:
            # 删除数据库中该条志愿者类活动信息
            try:
                db.session.delete(volunteer)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                abort(500)
            # 删除数据库中与该活动有关的用户-志愿者类活动信息(删除不了.........................)
            userVolunteer = models.userVolunteer.query.filter_by(volunteer_id = id).all()
            for item in userVolunteer:
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