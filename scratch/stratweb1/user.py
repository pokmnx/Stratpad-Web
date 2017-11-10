#!/usr/bin/env python

# -------------------
# NB nothing in this file is being used!!!!
# -------------------

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

# we use this as the ancestor as part of the High Rep DataStore paradigm
def parent_key():
	return db.Key.from_path('User', 'default_user')

def get_user_by_email(email):
	q = User.all()
	q.filter("email =", email)
	return q.get()

def get_user_by_id(userid):
	return User.get_by_id (int(userid), parent=parent_key())

def validate_password(password, confirmPassword, response):
	if not password:
		response["status"] = "fail"
		response["data"]["validations"].append( {"field": "signUpPassword", "message" : "Password is required."} )
		
	if password != confirmPassword:
		response["status"] = "fail"
		response["data"]["validations"].append( {"field": "signUpPassword", "message" : "Passwords must match."} )
		response["data"]["validations"].append( {"field": "confirmPassword", "message" : "Passwords must match."} )

	if len(password) < 6:
		response["status"] = "fail"
		response["data"]["validations"].append( {"field": "signUpPassword", "message" : "Password must be at least 6 characters."} )


class User(db.Model):
	"""Models an individual User entry with several properties."""
		
	def cleanEmail(value):		
		regexp_string = "[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}"
		email = str(value)
		if (not re.search(regexp_string, email, re.IGNORECASE)):
			raise ValueError('(%s) Value "%s" is invalid. It must match the regexp "%s"' % (id, email, regexp_string))

	def toJSON(self):
		return {
			'id': self.key().id(),
			'fullname': self.fullname, 
			'email': self.email, 
			'creationDate': self.creationDate.isoformat(),
			'modificationDate': self.modificationDate.isoformat()
			}
	
	fullname = db.StringProperty(required=True)
	email = db.EmailProperty(required=True,validator=cleanEmail) # username as well
	password = db.StringProperty(required=True)

	# registration date
	creationDate = db.DateTimeProperty(auto_now_add=True)

	# when we modify this entry, eg when we change inAppPurchase or StratBoard
	modificationDate = db.DateTimeProperty(auto_now_add=True)

class LoginHandler(webapp2.RequestHandler):
	# curl -d "signInEmail=julian@mobilesce.com&signInPassword=asdasd" http://localhost:8081/login
	def post(self):
		user = None
		response = {}

		email = self.request.get('signInEmail').strip().lower()
		password = self.request.get('signInPassword')

		if email:
		 	h = hashlib.new('sha224')
			h.update(password)
			password = h.hexdigest()
			user = get_user_by_email(email)

		if not user:
			logging.warn('No user')
			response = {"status": "fail", "data" : { "title" : "No such user '%s'" % email }}
			self.response.status = 401			
		elif user.password == password:
			logging.info("Logged in user: " + email)	
		 	token = hashlib.new('sha224')
			token.update(email + str(random.random()))
			response = {"status": "success", "data": { 'token':token.hexdigest(), 'user':user.toJSON() }}
		else:
			logging.warn('Wrong password')
			response = {"status": "fail", "data" : { "title" : "Bad password" }}			
			self.response.status = 401		
			
		self.response.headers['Content-Type'] = "application/json"
		self.response.headers['Access-Control-Allow-Origin'] = "*"
		self.response.out.write(json.dumps(response) + "\n\n")	

class UserHandler(webapp2.RequestHandler):
	
	#backbone calls this with 1-2 args to check to see if we can put, delete, etc
	def options(self,userid=0):
		self.response.headers['Access-Control-Allow-Origin'] = "*"
		self.response.headers['Access-Control-Request-Method'] = "*"
		self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
		self.response.headers['Access-Control-Allow-Headers'] = '*,x-requested-with,Content-Type'
		self.response.headers["Access-Control-Max-Age"] = '1728000'

	def get(self,userid):
		#  curl http://localhost:8081/user/3
		self.response.headers['Content-Type'] = "application/json"
		self.response.headers['Access-Control-Allow-Origin'] = "*"

		user = get_user_by_id (userid)
		if user:
			response = {"status": "success", "data": { 'user': user.toJSON() }}
		else:
			response = {"status": "fail", "data" : { "title" : "No user with id '%s'" % userid }}

		self.response.out.write(json.dumps(response) + "\n\n")				

	def put(self,userid):
		#  curl -X PUT -i -d '{ "email" : "julian@stratpad.com" }' http://localhost:8081/user/3
		self.response.headers['Content-Type'] = "application/json"
		self.response.headers['Access-Control-Allow-Origin'] = "*"

		logging.debug("updating user: " + userid)
		user = get_user_by_id (userid)
		if user:
			try:
				logging.debug("updates: " + self.request.body)
				userupdates = json.loads(self.request.body)
				dirty = False
				
				if 'fullname' in userupdates:
					user.fullname = userupdates['fullname']
					dirty = True

				if 'email' in userupdates:
					email = userupdates['email'].strip().lower()

					# search for pre-existing
					q = User.all(keys_only=True)
					q.filter("email =", email)
					existingUser = q.get()
					if existingUser:
						response = {"status" : "fail", "data": {}}
						response["data"]["validations"] = [ {"field": "signUpName", "message" : "Email %s already registered." % email} ]
						self.response.out.write(json.dumps(response) + "\n\n")
						return
					else:			
						user.email = email
						dirty = True

				if ('newPassword' in userupdates) and ('oldPassword' in userupdates) and ('confirmPassword' in userupdates):
					oldPassword = userupdates['oldPassword']
					newPassword = userupdates['newPassword']
					confirmPassword = userupdates['confirmNewPassword']

					response = {"status" : "success", "data": {}}
					response["data"]["validations"] = []

					# check old password
				 	h = hashlib.new('sha224')
					h.update(oldPassword)
					password = h.hexdigest()
					if password != user.password:
						response["status"] = "fail"
						response["data"]["validations"].append( {"field": "oldPassword", "message" : "Provided password does not match."} )

					# add any validation errors
					validate_password(newPassword, confirmPassword, response)
					
					if response["status"] == "success":
					 	h = hashlib.new('sha224')
						h.update(password)
						user.password = h.hexdigest()
						dirty = True

				if dirty:				
					user.modificationDate = datetime.datetime.utcnow()
					user.put()

				response = {"status": "success", "data": { 'user': user.toJSON() }}
				
			except Exception, e:
				self.response.status = 400
				response = {"status": "error", "data": { "title": str(e) } }

		else:
			response = {"status": "fail", "data" : { "title" : "No user with id '%s'" % userid }}

		self.response.out.write(json.dumps(response) + "\n\n")				

	def delete(self,userid):
		#  curl -X DELETE http://localhost:8081/user/3
		self.response.headers['Content-Type'] = "application/json"
		self.response.headers['Access-Control-Allow-Origin'] = "*"

		user = get_user_by_id (userid)
		if user:
			user.delete()
			response = {"status": "success"}
		else:
			response = {"status": "fail", "data" : { "title" : "No user with id '%s'" % userid }}

		self.response.out.write(json.dumps(response) + "\n\n")				

	def post(self):
		# this is also signup
		# curl -X POST -i -d '{ "signUpEmail" : "julian@stratpad.com", "signUpName" : "Julian Wood", "signUpPassword" : "asdasd", "confirmPassword" : "asdasd" }' http://localhost:8081/user
		# or with resty: POST '{"signUpEmail" : "a@b.com", "signUpName" : "Oliver Wood", "signUpPassword": "asdasd", "confirmPassword": "asdasd"}'	
		try:
			response = {"status" : "success", "data": {}}
			response["data"]["validations"] = []

			try:
				userjson = json.loads(self.request.body)
			except Exception, e:				
				# look in the post request
				userjson = { 
					"signUpEmail" : self.request.get('signUpEmail'),
				 	"signUpName" : self.request.get('signUpName'),
				 	"signUpPassword" : self.request.get('signUpPassword'),
				 	 "confirmPassword" : self.request.get('confirmPassword') 
				 	 }

			# validate
			if 'signUpEmail' in userjson:				
				email = userjson['signUpEmail'].strip().lower()

				# search for pre-existing
				q = User.all(keys_only=True)
				q.filter("email =", email)
				user = q.get()
				if user:
					response["status"] = "fail"
					response["data"]["validations"].append( {"field": "signUpName", "message" : "Email %s already registered." % email} )				
			else:
				response["status"] = "fail"
				response["data"]["validations"].append( {"field": "signUpEmail", "message" : "Email is required."} )

			if 'signUpName' in userjson:
				fullname = userjson['signUpName'].strip()
			else:
				response["status"] = "fail"
				response["data"]["validations"].append( {"field": "signUpName", "message" : "Name is required."} )

			if 'signUpPassword' in userjson and 'confirmPassword' in userjson:		
				password = userjson['signUpPassword']
				confirmPassword = userjson['confirmPassword']
				validate_password(password, confirmPassword, response)
			else:
				response["status"] = "fail"
				response["data"]["validations"].append( {"field": "signUpPassword", "message" : "Password and confirmation password are required."} )

			if response["status"] == "success":
			 	h = hashlib.new('sha224')
				h.update(password)
				password = h.hexdigest()

				user = User(parent=parent_key(),
					fullname=fullname,
					email = email,
					password = password
					)				
				user.put()

			 	token = hashlib.new('sha224')
				token.update(email + str(random.random()))
				response["data"]["token"] = token.hexdigest()
				response["data"]["user"] = user.toJSON()
			
		except Exception, e:
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }

		self.response.headers['Content-Type'] = "application/json"
		self.response.headers['Access-Control-Allow-Origin'] = "*"
		self.response.out.write(json.dumps(response) + "\n\n")	
