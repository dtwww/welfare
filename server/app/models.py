from app import db


class user(db.Model):
    __tablename__ = 'user'
    nickname = db.Column(primary_key=True)
    name = db.Column()
    sex = db.Column()
    country = db.Column()
    province = db.Column()
    city = db.Column()
    id = db.Column()
    phone = db.Column()
    credit = db.Column()
    priority = db.Column()


class admin(db.Model):
    __tablename__ = 'admin'
    username = db.Column(primary_key=True)
    password = db.Column()

class donation(db.Model):
    __tablename__ = 'donation'
    id = db.Column(primary_key=True)
    title = db.Column()
    address = db.Column()
    date = db.Column()
    picture1 = db.Column()
    picture2 = db.Column()
    picture3 = db.Column()
    introduce = db.Column()
    money = db.Column()


class volunteer(db.Model):
    __tablename__ = 'volunteer'
    id = db.Column(primary_key=True)
    title = db.Column()
    address = db.Column()
    date = db.Column()
    picture1 = db.Column()
    picture2 = db.Column()
    picture3 = db.Column()
    introduce = db.Column()
    people = db.Column()
    canceled = db.Column()


class auction(db.Model):
    __tablename__ = 'auction'
    id = db.Column(primary_key=True)
    name = db.Column()
    address = db.Column()
    date = db.Column()
    picture1 = db.Column()
    picture2 = db.Column()
    picture3 = db.Column()
    introduce = db.Column()
    money = db.Column()
    paid = db.Column()


class userDonation(db.Model):
    __tablename__ = 'user_donation'
    id = db.Column(primary_key=True)
    nickname = db.Column()
    donation_id = db.Column()
    money = db.Column()
    deleted = db.Column()


class userVolunteer(db.Model):
    __tablename__ = 'user_volunteer'
    id = db.Column(primary_key=True)
    nickname = db.Column()
    volunteer_id = db.Column()
    deleted = db.Column()
    joined = db.Column()


class userAuction(db.Model):
    __tablename__ = 'user_auction'
    id = db.Column(primary_key=True)
    nickname = db.Column()
    auction_id = db.Column()
    money = db.Column()
    paid = db.Column()
    deleted = db.Column()