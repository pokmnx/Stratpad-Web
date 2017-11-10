#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import datetime
import urllib
import webapp2
import json
import logging
import re
import xmlrpclib
import httplib
import hashlib
import random

from google.appengine.ext import db
from google.appengine.ext.db import BadValueError
from google.appengine.api import users

from security import user_required, BaseHandler
from webapp2_extras.auth import InvalidAuthIdError, InvalidPasswordError
from models import User

from google.appengine.ext.ndb import query

def get_user_by_email(email):
    q = User.query(query.FilterNode('email', '=', email))
    return q.get()


def get_user_by_id(userid):
    return User.get_by_id(userid, parent=None)


def validate_password(password, confirmPassword, response):
    if not password:
        response['status'] = 'fail'
        response['data']['validations'
                         ].append({'field': 'signUpPassword',
                                  'message': 'Password is required.'})

    if password != confirmPassword:
        response['status'] = 'fail'
        response['data']['validations'
                         ].append({'field': 'signUpPassword',
                                  'message': 'Passwords must match.'})
        response['data']['validations'
                         ].append({'field': 'confirmPassword',
                                  'message': 'Passwords must match.'})

    if len(password) < 6:
        response['status'] = 'fail'
        response['data']['validations'
                         ].append({'field': 'signUpPassword',
                                  'message': 'Password must be at least 6 characters.'
                                  })


class LoginHandler(BaseHandler):

  # curl -X POST -i -d 'signInEmail=julian@mobilesce.com&signInPassword=asdasd' http://localhost:8081/login

    def post(self):
        response = {}

        email = self.request.get('signInEmail').strip().lower()
        password = self.request.get('signInPassword')

        # by default we get a session cookie - see config
        remember = self.request.get('remember').strip().lower() in ['y', 't', '1']

        try:

            # changing remember to False will make this a session cookie, rather than a 3 week cookie
            # todo: make remember dynamic
            u = self.auth.get_user_by_password(email, password,
                    remember=True, save_session=True)
            logging.info('Success logging in user: %s', u['email'])
            response = {'status': 'success',
                        'data': {'user': {'fullname': u['fullname'],
                        'email': u['email'], 'id': str(self.user.key.id())}}}

        except (InvalidAuthIdError, InvalidPasswordError), e:

            logging.info('Login failed for user %s because of %s',
                         email, type(e))

            response = {'status': 'fail',
                        'data': {'title': 'Invalid credentials'}}
            self.response.status = 401

        self.addAccessHeaders()
        self.response.out.write(json.dumps(response) + '''

''')


class LogoutHandler(BaseHandler):

    @user_required
    def get(self):
        self.auth.unset_session()
        # self.redirect(self.uri_for('home'))


class SignUpHandler(BaseHandler):

    def post(self):

    # this is also signup
    # curl -X POST -i -d '{ "signUpEmail" : "julian@stratpad.com", "signUpName" : "Julian Wood", "signUpPassword" : "asdasd", "confirmPassword" : "asdasd" }' http://localhost:8081/user
    # or with resty: POST '{"signUpEmail" : "a@b.com", "signUpName" : "Oliver Wood", "signUpPassword": "asdasd", "confirmPassword": "asdasd"}'

        try:
            response = {'status': 'success', 'data': {}}
            response['data']['validations'] = []

            try:
                userjson = json.loads(self.request.body)
            except Exception, e:

                # legacy compatibility: look in the post request
                userjson = {
                    'signUpEmail': self.request.get('signUpEmail'),
                    'signUpName': self.request.get('signUpName'),
                    'signUpPassword': self.request.get('signUpPassword'),
                    'confirmPassword': self.request.get('confirmPassword'),
                    }

            # validations

            if 'signUpEmail' in userjson:
                email = userjson['signUpEmail'].strip().lower()
            else:
                response['status'] = 'fail'
                response['data']['validations'
                                 ].append({'field': 'signUpEmail',
                        'message': 'Email is required.'})

            if 'signUpName' in userjson:
                fullname = userjson['signUpName'].strip()
            else:
                response['status'] = 'fail'
                response['data']['validations'
                                 ].append({'field': 'signUpName',
                        'message': 'Name is required.'})

            if 'signUpPassword' in userjson and 'confirmPassword' in userjson:
                password = userjson['signUpPassword']
                confirmPassword = userjson['confirmPassword']
                validate_password(password, confirmPassword, response)
            else:
                response['status'] = 'fail'
                response['data']['validations'
                                 ].append({'field': 'signUpPassword',
                        'message': 'Password and confirmation password are required.'
                        })

            if response['status'] == 'success':
                unique_properties = ['email']
                user_data = self.user_model.create_user(
                    email,
                    unique_properties,
                    email=email,
                    fullname=fullname,
                    password_raw=password,
                    verified=False,
                    )
                if not user_data[0]:  # user_data is a tuple (boolean, info)
                    response['status'] = 'fail'
                    response['data']['validations'
                            ].append({'field': 'signUpName',
                            'message': 'Email %s already registered.'
                            % email})
                else:
                    user = user_data[1]
                    user_id = user.get_id()

                    token = self.user_model.create_signup_token(user_id)

                    verification_url = self.uri_for('verification',
                            type='v', user_id=user_id,
                            signup_token=token, _full=True)

                    #todo: send an email
                    response['data']['verification_url'] = \
                        verification_url
                    response['data']['user'] = \
                        {'fullname': user.fullname, 'email': user.email, 'id': str(user_id)}

        except Exception, e:

            self.response.status = 400
            response = {'status': 'error', 'data': {'title': str(e)}}

        self.addAccessHeaders()        
        self.response.out.write(json.dumps(response) + '''

''')

# todo: hook up forgot, verfication and setpassword - nothing below here is currently being used, or has been updated

class ForgotPasswordHandler(BaseHandler):
  def get(self):
    self._serve_page()

  def post(self):
    username = self.request.get('username')

    user = self.user_model.get_by_auth_id(username)
    if not user:
      logging.info('Could not find any user entry for username %s', username)
      self._serve_page(not_found=True)
      return

    user_id = user.get_id()
    token = self.user_model.create_signup_token(user_id)

    verification_url = self.uri_for('verification', type='p', user_id=user_id,
      signup_token=token, _full=True)

    msg = 'Send an email to user in order to reset their password. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

    self.display_message(msg.format(url=verification_url))
  
  def _serve_page(self, not_found=False):
    username = self.request.get('username')
    params = {
      'username': username,
      'not_found': not_found
    }
    self.render_template('forgot.html', params)

class VerificationHandler(BaseHandler):
  def get(self, *args, **kwargs):
    user = None
    user_id = kwargs['user_id']
    signup_token = kwargs['signup_token']
    verification_type = kwargs['type']

    # it should be something more concise like
    # self.auth.get_user_by_token(user_id, signup_token
    # unfortunately the auth interface does not (yet) allow to manipulate
    # signup tokens concisely
    user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
      'signup')

    # store user data in the session
    self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)

    if not user:
      logging.info('Could not find any user with id "%s" signup token "%s"',
        user_id, signup_token)
      self.abort(404)

    if verification_type == 'v':
      # remove signup token, we don't want users to come back with an old link
      self.user_model.delete_signup_token(user.get_id(), signup_token)

      if not user.verified:
        user.verified = True
        user.put()

      self.display_message('User email address has been verified.')
      return
    elif verification_type == 'p':
      # supply user to the page
      params = {
        'user': user,
        'token': signup_token
      }
      self.render_template('resetpassword.html', params)
    else:
      logging.info('verification type not supported')
      self.abort(404)

class SetPasswordHandler(BaseHandler):

  @user_required
  def post(self):
    password = self.request.get('password')
    old_token = self.request.get('t')

    if not password and password != self.request.get('confirm_password'):
      self.display_message('passwords do not match')
      return

    user = self.user
    user.set_password(password)
    user.put()

    # remove signup token, we don't want users to come back with an old link
    self.user_model.delete_signup_token(user.get_id(), old_token)
    
    self.display_message('Password updated')

# utility
def render_template(self, view_filename, params={}):
  user = self.user_info
  params['user'] = user
  path = os.path.join(os.path.dirname(__file__), 'views', view_filename)
  self.response.out.write(template.render(path, params))

# utility
def display_message(self, message):
  """Utility function to display a template with a simple message."""
  params = {
    'message': message
  }
  self.render_template('message.html', params)
  
