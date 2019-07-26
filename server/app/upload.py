# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import SubmitField
from flask import Blueprint
from app import app
from flask_restful import reqparse

upload=Blueprint('upload', __name__)

app.config['SECRET_KEY'] = 'I have a dream'
app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd()+'/app/static'
#os.getcwd()获取到server的绝对路径

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
patch_request_class(app)  # 设置图片最大大小,默认16Mb


class UploadForm(FlaskForm):
    photo = FileField(validators=[
        FileAllowed(photos, u'只能上传图片！'),
        FileRequired(u'文件未选择！')])
    submit = SubmitField(u'上传')


@upload.route('/upload', methods=['GET', 'POST'])
def upload_file():
    parse = reqparse.RequestParser()
    parse.add_argument('url')
    parse.add_argument('name')
    # if form.validate_on_submit():
    file_url = photos.url('url')
    filename = photos.save('name')
    # else:
    #     file_url = None
    return 0