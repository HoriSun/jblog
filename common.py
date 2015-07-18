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

    #xsrf_cookies,cookie_secret:反跨站脚本攻击
    "xsrf_cookies":True,
    #"cookie_secret":base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes), #a random string is set when the server starts
    "cookie_secret":"CzpRS4gcRoi7Z28O/OVOYcw0WA/w/krYqQd6nD8CH0U=",# for testing, temporary set to unique
}

def hasher(filename):
    hasher = hashlib.md5()
    with open(filename, 'rb') as afile:
        buf = afile.read()
        hasher.update(buf)
        res = hasher.hexdigest()        
    return res
    
#def dbcon():
#    return tornado.database.Connection(MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASS, max_idle_time = 5)
    
class BaseHandler(RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("jbloguser")
    def initialize(self):
        try:
            self.json = {}
            if self.request.body!="":
                self.json = json_decode(self.request.body)
            self.ret = {}
            self.db = tornado.database.Connection(MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASS, max_idle_time = 5)
        except:
            logging.traceback.print_exc()
            self.send()
        
    def send(self):
        ret = {}
        ret['data'] = self.ret
        ret['request'] = self.request.body+" "+self.request.uri
        if settings['debug']:
            if not self.get_secure_cookie("mycookie"):
                self.set_secure_cookie("mycookie", "myvalue")
                ret['cookie']=("Your cookie was not set yet!")
            else:
                ret['cookie']=("Your cookie was set!")
            if not self.get_secure_cookie("heygirl"):
                self.set_secure_cookie("heygirl", "areyouok")
                
        ret = json_encode(ret)
        self.write(ret+"======")    
        self.finish()

    def on_finish(self):
        pass

#输入: self.json
#输出: self.ret
#两个均为字典
class staticHashHandler(BaseHandler): #此处加入处理：静态文件名+?v=hashcode       
    def post(self):
        filepath = os.path.join(settings["static_path"],os.path.normpath(self.json["path"]))
        self.ret["path"]=self.json["path"]+"?v="+hasher(filepath)
        print self.ret["path"]
        self.send()


        
itemlistquery = {
    "blog":["date","label"],
    "experience":["category"],
    "honor":["category"],
    "project":["ptype","role","state","duration"],
}
class itemListHandler(BaseHandler):
    def post(self):
        infoType = self.json["type"]
        ret = {}
        if infoType in itemlistquery:
            for i in itemlistquery[infoType]:
                ret[i] = map(lambda x:x[i],self.db.query('select distinct '+i+' from '+infoType))
            #print ret
            if(infoType=="blog"):
                ret['date'] = map(lambda i:str(i),ret['date'])
                labeltemp = set()
                for i in ret['label']:
                    for j in i.split(','):
                        labeltemp.add(j)
                ret['label'] = list(labeltemp)
            print ret
            for i in ret:
                self.ret[i] = dict(zip(ret[i],[{} for j in xrange(len(ret[i]))]))
            #self.ret = ret#dict(zip(itemlistquery[infoType],ret))
            cols = self.db.query('show columns from '+self.json['type'])
            cols = filter(lambda x:x not in ['id','date','title']+itemlistquery[self.json['type']],map(lambda x:x['Field'],cols))
            self.ret['attr'] = {'null':cols,'notnull':itemlistquery[self.json['type']]};
            print self.ret;
        #else:
        #    self.ret = ret
        self.send()

### FORMAT ###        
## Request
#{
#    "type":"blog",
#    "year":2015,
#    "month":2

class itemHandler(BaseHandler):
    def post(self):
        infoType = self.json["type"]
        if(infoType in ['blog','project','experience','honor']):#=="blog"):
            popper = []
            for i in self.json:
                if self.json[i] == "":
                    popper.append(i)
            for i in popper:
                self.json.pop(i)
            query = [ i+'="'+self.json[i] 
                      for i in self.json 
                      if not (i in ["type","month","year","label"])]
            if "month" in self.json:
                if not "year" in self.json:
                    pass
                else:
                    query.append('date>="%d-%d-01" and date<"%d-%d-01'%(
                        self.json['year'],
                        self.json['month'],
                        self.json['year'],
                        self.json['month']+1))
            if "year" in self.json:
                query.append('date>="%d-01-01" and date<"%d-01-01'%(
                    self.json['year'],
                    self.json['year']+1))  
            if "label" in self.json:
                query.append('label like "%%'+'%s'%self.json['label']+'%%')
            query='" and '.join(query)+'"'
            print "\n\n\n",query,"\n\n\n"
            if(infoType == 'blog'):
                if not 'id' in self.json: 
                    self.ret = self.db.query('select id,date,title,abstract,label from blog %s;'%('' if query=='"' else 'where '+query))
                else: #show detail of the item with particular id
                    self.ret = self.db.query("select * from blog where %s;"%query)
                for blogpost in self.ret:
                    blogpost['date'] = str(blogpost['date'])
                    blogpost['label'] = blogpost['label'].replace('%%','%')
                    if 'content' in blogpost:
                        blogpost['content'] = blogpost['content'].replace('%%','%')
                    blogpost['abstract'] = blogpost['abstract'].replace('%%','%')
                    blogpost['title'] = blogpost['title'].replace('%%','%')
            elif(infoType == 'experience'):
                self.ret = self.db.query('select id,year,month,title,role,location,certificate,category from experience %s;'%('' if query=='"' else 'where '+query))
                for x in self.ret:
                    x['label'] = [x['year'],x['month'],x['role'],x['location']]
            elif(infoType == 'honor'):
                self.ret = self.db.query('select id,year,month,title,place,location,address,category from honor %s;'%('' if query=='"' else 'where '+query))
                for x in self.ret:
                    x['label']=[x['year'],x['month'],x['place'],x['location']]
            elif(infoType == 'project'):            
                self.ret = self.db.query('select id,title,ptype,role,state,duration,abstract,sourceCode from project %s;'%('' if query=='"' else 'where '+query))
                for x in self.ret:
                    x['label']=[x['ptype'],x['role'],x['state'],x['duration']]    
        self.send()
        
class titleHandler(BaseHandler):
    def post(self):
        infoType = self.json["type"]
        self.ret = self.db.query("select title,description from title where type='"+infoType+"'")[0]
        self.send()
        
class contactHandler(BaseHandler):
    def post(self):
        self.ret['contact'] = self.db.query("select id,title,content,url from contact")
        self.ret['link'] = self.db.query("select id,title,content,url from link")
        self.send()

class mainHandler(BaseHandler):
    def post(self):
        self.ret = self.db.query("select title,content,imageurl from main")[0]
        #print self.ret
        self.send()

class registerHandler(BaseHandler):
    def post(self):
        try:
            print "\n\n\n",self.json,"\n\n\n\n"
            # use the only id to prevent second-time registering
            self.db.execute("insert into `user` (`id`,`username`,`password`,`email`) values ('%d','%s','%s','%s')"%(1,self.json['username'],self.json['password'],self.json['email']))
            self.ret = {"status":"1"}
            self.set_cookie("registered", "true")
        except:
            self.ret = {"status":"0"}
            self.set_cookie("registered", "false")
        finally:
            self.send()

class loginHandler(BaseHandler):
    def post(self):
        info = self.db.query("select username,password from user");
        if len(info)==0:
            self.ret = {"status":"-1"}
        elif self.json['username']==info[0]['username'] and self.json['password']==info[0]['password']:
            self.ret = {"status":"1"}
            self.set_secure_cookie("jbloguser",self.json['username'])
        else:
            self.ret = {"status":"0"}
        self.send()

class logoutHandler(BaseHandler):
    @authenticated
    def post(self):
        self.set_secure_cookie("jbloguser","",-1)
        self.send()

class multiEditHandler(BaseHandler): # main, experience, project, honor, contact, link
    @authenticated
    def post(self):
        auth = {
            "new":   [               "project","experience","honor","contact","link"],
            "update":["title","main","project","experience","honor","contact","link"],
            "delete":[               "project","experience","honor","contact","link"],
        }
        try:
            #[{'Default': None,
            #  'Extra': u'auto_increment',
            #  'Field': u'id',
            #  'Key': u'PRI',
            #  'Null': u'NO',
            #  'Type': u'int(11)'},{...},...]
            if self.json['type'] not in auth[self.json['operation']]:
                raise Exception
            cols = self.db.query('show columns from '+self.json['type'])
            cols = filter(lambda x:x not in ['id','date'],map(lambda x:x['Field'],cols))
            # front end programmer ... aah
            #cols = map(lambda x:x['Field'],cols)
            #print self.json['label'].__len__(),cols.__len__(),self.json['label'],cols
            #if self.json['label'].__len__() < cols.__len__():
            #    raise Exception('label length too small')
            #else:
            #    values = self.json['label'][0:cols.__len__()]
            keys = []
            values = []
            for i in self.json:
                if(i in cols):
                    keys.append(i)
                    values.append(self.json[i])
            if self.json['operation'] == 'new':
                keys = ','.join(keys)
                values = ','.join(map(lambda x:'"'+x+'"',values))
                sql = 'insert into `'+self.json['type']+'` (%s) value (%s)'%(keys,values)
            elif self.json['operation'] == 'update':
                query = ','.join([k+'="'+v+'"' for k,v in zip(keys,values)])
                sql = 'update '+self.json['type']+'set %s where id=1'%(query)
            elif self.json['operation'] == 'delete':
                query = ' and '.join([k+'="'+v+'"' for k,v in zip(keys,values)])
                sql = 'delete from '+self.json['type']+' where %s'%(query)
            print sql
            self.db.execute(sql)
            self.ret['status']='1'
        except:
            logging.traceback.print_exc()
            self.ret['status']='0'
        self.send()

class blogEditHandler(BaseHandler):
    @authenticated
    def post(self):
        if self.json['type']=="blog":
#            try:
            print self.json['content'].replace('%','%%')
            self.db.execute('insert into blog (title,abstract,content,label) value ("%s","%s","%s","%s")'
                            %(self.json['title'].replace('%','%%'),
                              self.json['content'][0:560].replace('%','%%'),
                              self.json['content'].replace('%','%%'),
                              self.json['label'].replace('%','%%')))
            self.ret['status']='1'                
#            except:
 #               self.ret['status']='0'
        self.send()

class listEditHandler(BaseHandler):
    @authenticated
    def post(self):
        if self.json['type'] in ['project','experience','honor']:
            try:
                if self.json['operation'] == 'new':
                    self.db.execute('alter table '+self.json['type']+' add '+self.json['attr']+' varchar(128) not null')
                elif self.json['operation'] == 'delete':
                    self.db.execute('alter table '+self.json['type']+' drop column '+self.json['attr'])
                else:
                    raise Exception
                self.ret['status']='1'
            except:
                self.ret['status']='0'
        self.send()

class uploadHandler(BaseHandler):
    @authenticated
    @tornado.web.asynchronous
    def post(self):
        if(self.json['type']=='resume'):
            #try:
            files = self.json['file']
            for f in files:
                filename = f['filename']
                filepath = os.path.join(settings["static_path"],
                                        filename)
                #                        datetime.datetime.now().strftime('%Y-%M-%d'))
                #if not os.path.exists(filepath):
                #    os.makedirs(filepath)
                #file_path = os.path.join(filepath, filename)
                with open(file_path, 'wb') as up:
                    up.write(f['body'])     # 写入文件
            self.ret['status']='1';        
            #except:
            #    self.ret['status']='0';
            
        self.send()

# Disable cache
class NoCacheStaticFileHandler(StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')        


# Logging level: INFO
class SAEApplication(tornado.wsgi.WSGIApplication):
    def __init__(self,url,**metadata):
        logging.basicConfig(level=logging.INFO)
        tornado.wsgi.WSGIApplication.__init__(self, url,**metadata)


router = [
    #不是最好的做法。最好是连首页和main.js都用上hash版本控制
    (r"/(.{0}|script/main\.js)",NoCacheStaticFileHandler,{"path":settings["static_path"],"default_filename":"index.html"}), #不缓存首页和main.js
    (r"/(?!post)(.+)",StaticFileHandler,{"path":settings["static_path"]}), #不匹配post开头的任意url
    (r"/post/statichash",staticHashHandler),
    (r"/post/itemlist",itemListHandler),
    (r"/post/item",itemHandler),
    (r"/post/title",titleHandler),
    (r"/post/contact",contactHandler),
    (r"/post/main",mainHandler),
    (r"/post/register",registerHandler),
    (r"/post/login",loginHandler),
    (r"/post/logout",logoutHandler),

    (r"/post/edit",multiEditHandler),
    (r"/post/edit/blog",blogEditHandler),

    (r"/post/edit/list",listEditHandler),

    (r"/post/upload",uploadHandler),
]
