#!/usr/bin/python
# -*- coding: utf-8 -*-

#
# Note that these will likely be served by different domains. This is GAE, while our html is coming off of staging.stratpad.com
# Thus we either use jsonp, and thus only support GET (bad - leaves passwords in the URL)
# OR we use Access-Control-Allow-Origin, but that only has partial browser support:
# http://caniuse.com/#feat=cors
#
# Responses should be jsend compliant: http://labs.omniti.com/labs/jsend
# Very cool little script which wraps CURL to let you easily test REST server: https://github.com/micha/resty
# start it up: resty http://127.0.0.1:8081/user
#

import cgi
import webapp2
import logging

import stratfile
import theme
import sess

# used when initializing app, below
# http://webapp-improved.appspot.com/api/webapp2_extras/auth.html
# this is how we expand on the default User model provided by webapp2
# you can import main and check main.config['debug'] for conditional work
config = {'debug': True,
          'webapp2_extras.auth': {'user_model': 'models.User',
          'user_attributes': ['fullname', 'email']},
          'webapp2_extras.sessions': {'secret_key': 'e0a6e070e4fcf82464814523d4c62646f24905ee0d69548933dc944afcf3092bb9a7d3866d3bdc7a4d8a03cdf7f75b7d89d8fbb8284ae2604cea63fce1a2d946'}}  
          # used os.urandom(64).encode('hex') to generate, offline

app = webapp2.WSGIApplication([ 

     # after signup, we can send an email with a link with a param /v to validate/verify the email
     # we can also send an email with a link with a param /p to reset your password
     # webapp2.Route('/logout', sess.LogoutHandler, name='logout'),
     # for PUT,DELETE,GET and OPTIONS
     # for POST and OPTIONS
    webapp2.Route('/<type:v|p>/<user_id:\d+>-<signup_token:.+>', handler='VerificationHandler', name='verification'),

    webapp2.Route('/signup', sess.SignUpHandler, name='signup'),
    webapp2.Route('/login', sess.LoginHandler, name='login'),
    webapp2.Route('/logout', sess.LogoutHandler, name='logout'),
    
    ('/stratfile/?', stratfile.StratfileHandler),
    ('/stratfile/(.+)', stratfile.StratfileHandler),

    webapp2.Route(r'/theme/<stratfileId:\d+>/<themeId:\d+>',
                  handler='theme.ThemeHandler'),
    ('/theme/(.+)', theme.ThemeHandler),
    ('/themes/(.+)', theme.ThemesHandler),

    ], debug=config['debug'], config=config)

# never executed
logging.getLogger().setLevel(logging.DEBUG)