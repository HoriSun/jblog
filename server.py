#!/usr/bin/python
#-*- coding:utf-8 -*-
'''
local development server
'''

## WARNING : ONLY pure english pathname can be used.

from tornado.web import Application

from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from common import *

application = Application(router, **settings)

        
if __name__ == "__main__":
    print tornado.__file__
    http_server = HTTPServer(application)
    http_server.listen(MYSQL_PORT)
    IOLoop.instance().start()
