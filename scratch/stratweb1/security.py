#!/usr/bin/env python

from google.appengine.ext.webapp import template
from google.appengine.ext import ndb

import logging
import os.path
import webapp2
import json

from webapp2_extras import auth
from webapp2_extras import sessions

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

class AccessException(Exception):
  def __init__(self, value):
    self.value = value
  def __str__(self):
    return repr(self.value)

def user_required(handler):
  """
    Decorator that checks if there's a user associated with the current session.
    Will also fail if there's no session present.
    Remember that we are usually decorating a subclass of BaseHandler
    If you try to access a user from a BaseHandler, without this decorator -> no go.
    If you try to post to a BaseHandler, decorated thusly, without an auth cookie, you will get a redirect
  """
  def check_login(self, *args, **kwargs):
    auth = self.auth
    if not auth.get_user_by_session():
      logging.warn("Permission denied.")
      # todo: this should return some json failure
      #self.redirect(self.uri_for('login'), abort=True)
      
      self.addAccessHeaders()
      self.response.status = 403
      response = {"status": "fail", "data": { "title": "Permission denied." } }

      self.response.out.write(json.dumps(response) + "\n\n")      
    else:
      logging.info("Permission granted.")
      return handler(self, *args, **kwargs)

  return check_login

class BaseHandler(webapp2.RequestHandler):

  def addAccessHeaders(self):
    '''Add headers needed for access control'''
    self.response.headers['Content-Type'] = "application/json"

    # you have to provide this header eg. Origin: http://localhost:8080, which is added automatically by a browser
    # browsers tend to be picky about seeing a wildcard origin
    if 'Origin' in self.request.headers:
      logging.info("Origin: " + self.request.headers['Origin'])
      # todo: we need a list here
      origin = self.request.headers['Origin']
      if origin.startswith('http://localhost') or origin.startswith('https://localhost') or origin.startswith('https://stratweb1.appspot.com'):
        self.response.headers['Access-Control-Allow-Credentials'] = 'true'
        self.response.headers['Access-Control-Allow-Origin'] = origin   
      
  def options(self,stratfileId=0,themeId=0):
    '''Convenience method to add all the required headers, when backbone requests OPTIONS'''
    logging.debug("Returning options")
    self.response.headers['Access-Control-Request-Method'] = "*"
    self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    self.response.headers['Access-Control-Allow-Headers'] = '*,x-requested-with,Content-Type'
    self.response.headers["Access-Control-Max-Age"] = '1728000'
    self.addAccessHeaders()

  @webapp2.cached_property
  def auth(self):
    """Shortcut to access the auth instance as a property."""
    # http://webapp-improved.appspot.com/api/webapp2_extras/auth.html#api-webapp2-extras-auth
    return auth.get_auth()

  @webapp2.cached_property
  def user_info(self):
    """Shortcut to access a subset of the user attributes that are stored
    in the session.

    The list of attributes to store in the session is specified in
      config['webapp2_extras.auth']['user_attributes'].
    :returns
      A dictionary with most user information
    """
    return self.auth.get_user_by_session()

  @webapp2.cached_property
  def user(self):
    """Shortcut to access the current logged in user.

    Unlike user_info, it fetches information from the persistence layer and
    returns an instance of the underlying model.

    :returns
      The instance of the user model associated to the logged in user.
    """
    u = self.user_info
    return self.user_model.get_by_id(u['user_id']) if u else None

  @webapp2.cached_property
  def user_model(self):
    """Returns the implementation of the user model.

    It is consistent with config['webapp2_extras.auth']['user_model'], if set.
    """    
    return self.auth.store.user_model

  @webapp2.cached_property
  def session(self):
      """Shortcut to access the current session."""
      return self.session_store.get_session(backend="datastore")

  # this is needed for webapp2 sessions to work
  def dispatch(self):
      # Get a session store for this request.
      self.session_store = sessions.get_store(request=self.request)

      try:
          # Dispatch the request.
          webapp2.RequestHandler.dispatch(self)
      finally:
          # Save all sessions.
          self.session_store.save_sessions(self.response)
