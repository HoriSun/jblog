#-*- coding:utf-8 -*-


import os
import tornado
import logging
import hashlib

from tornado.web import (
    RequestHandler, 
    Application, 
    authenticated,
    StaticFileHandler,
    RedirectHandler,
    authenticated,
)
from tornado.wsgi import WSGIApplication
from tornado.escape import json_decode,json_encode

import re
import tornado.database  
import tornado.options
import unicodedata
##import json
import _mysql
import datetime
import base64
import uuid

#local settings
MYSQL_DB = "app_sysujob"
MYSQL_USER = "root"
MYSQL_PASS = "123456"
MYSQL_HOST_M = "localhost"
MYSQL_HOST_S = ""
MYSQL_PORT = 8080
MYSQL_HOST = "%s:%s"%(MYSQL_HOST_M,str(MYSQL_PORT))
try:
    import sae.const
    MYSQL_DB = sae.const.MYSQL_DB
    MYSQL_USER = sae.const.MYSQL_USER
    MYSQL_PASS = sae.const.MYSQL_PASS
    MYSQL_HOST_M = sae.const.MYSQL_HOST
    MYSQL_HOST_S = sae.const.MYSQL_HOST_S
    MYSQL_PORT = sae.const.MYSQL_PORT
    MYSQL_HOST = "%s:%s"%(MYSQL_HOST_M,str(MYSQL_PORT))
except:
    pass

rootdir = os.path.split(unicode(os.path.realpath(__file__),'gb2312'))[0]


settings = {
    "autoreload": True,
    "debug": True, # 打开debug会返回Traceback 而不仅仅404页面
    "static_hash_cache":True,
    "static_path":os.path.join(rootdir,"static"),
    "login_url": "/",
    "xsrf_cookies":False,
    "cookie_secret":"CzpRS4gcRoi7Z28O/OVOYcw0WA/w/krYqQd6nD8CH0U=",# for testing, temporary set to unique
}
    

# Logging level: INFO
class SAEApplication(tornado.wsgi.WSGIApplication):
    def __init__(self,url,**metadata):
        logging.basicConfig(level=logging.INFO)
        tornado.wsgi.WSGIApplication.__init__(self, url,**metadata)


router = [
]
