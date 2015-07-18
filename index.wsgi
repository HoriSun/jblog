#-*- coding:utf-8 -*-
'''
server main file
'''

## WARNING : ONLY pure english pathname can be used.

import sae
from common import *

app = SAEApplication(router, **settings)

application = sae.create_wsgi_app(app)
