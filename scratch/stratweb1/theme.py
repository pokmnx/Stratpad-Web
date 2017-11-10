#!/usr/bin/env python
#
import cgi
import datetime
import webapp2
import json
import logging

from google.appengine.ext import db
from google.appengine.ext.db import BadValueError
from google.appengine.ext.db import Key

import util
from security import user_required, BaseHandler, AccessException
from models import User, Stratfile, Theme

class ThemeHandler(BaseHandler):
	"""Restful CRUD for Theme"""

	@user_required
	def get(self,stratfileId,themeId):
		logging.info("Getting theme: " + themeId)
		self.addAccessHeaders()

		theme = Theme.get_by_id (int(themeId), parent=None)
		if theme:
			response = {"status": "success", "data": { 'theme': theme.toDict() }}
		else:
			response = {"status": "fail", "data" : { "title" : "No theme with id '%s'" % themeId }}

		self.response.out.write(json.dumps(response) + "\n\n")				

	@user_required
	def delete(self,stratfileId,themeId):
		logging.info("Deleting theme: " + themeId)
		self.addAccessHeaders()

		theme = Theme.get_by_id (int(themeId), parent=None)
		if theme:
			theme.delete()
			response = {"status": "success"}
		else:
			response = {"status": "fail", "data" : { "title" : "No theme with id '%s'" % themeId }}

		self.response.out.write(json.dumps(response) + "\n\n")				

	@user_required
	def post(self,stratfileId):
		try:
			logging.info("Creating theme")
			self.addAccessHeaders()

			jsondata = json.loads(self.request.body)

			# does the in-session user have permission to add this theme to the specified stratfile?
			# our initial policy can be that the in-session user must be the stratfile.userId
			stratfile = Stratfile.get_by_id(int(stratfileId), parent=None)

			if not stratfile:
				raise AccessException("Stratfile not found")
			
			userId = self.user_info['user_id']
			if stratfile.userId != userId:
				raise AccessException("Permission denied")

			# create the theme
			theme = Theme(parent=None,
				themeName=util.getValue(jsondata, 'themeName'),
				stratfile=stratfile
				)
			propertyTypes = Theme.properties()
			for prop in Theme.whitelist:
				val = util.getValue(jsondata, prop, propertyTypes[prop])
				if val != None:
					setattr(theme, prop, val)
			theme.put()

			response = {"status" : "success", "data": { "theme": theme.toDict()}}

		except BadValueError, e:
			response = {"status": "fail", "data" : { "title" : str(e) }}

		except Exception, e:
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }

		self.response.out.write(json.dumps(response) + "\n\n")			

	@user_required
	def put(self,stratfileId,themeId):
		logging.info("updating theme: " + themeId)
		self.addAccessHeaders()

		theme = Theme.get_by_id (int(themeId), parent=None)
		if theme:
			try:
				logging.info("updates: " + self.request.body)
				jsondata = json.loads(self.request.body)

				# ignore any properties that aren't in our whitelist
				propertyTypes = Theme.properties()
				for prop in Theme.whitelist:
					type = propertyTypes[prop]
					util.updateValue(jsondata, prop, theme, type)

				theme.modificationDate = datetime.datetime.utcnow()
				theme.put()

				response = {"status": "success", "data": { 'theme': theme.toDict() }}
				
			except Exception, e:
				self.response.status = 400
				response = {"status": "error", "data": { "title": str(e) } }

		else:
			response = {"status": "fail", "data" : { "title" : "No theme with id '%s'" % themeId }}

		self.response.out.write(json.dumps(response) + "\n\n")				

class ThemesHandler(BaseHandler):
	"""Collections of themes"""

	@user_required
	def get(self,stratfileId):
		logging.info("Getting themes for stratfile: " + stratfileId)
		self.addAccessHeaders()
		userId = self.user_info['user_id']

		try:
	
			# here we also have an implicit security policy that the session user must be the owner
			stratfile = Stratfile.get_stratfile_by_id(int(stratfileId), userId)

			themes = []
			for theme in stratfile.themes.fetch(50):
				themes.append(theme.toDict())

			# response = {"status": "success", "data": { 'themes': themes }}
			response = themes
			
		except AccessException, e:
			logging.warn("Permission denied to user %s on stratfile %s" % (userId, stratfileId))
			response = {"status": "fail", "data" : { "title" : "No theme with id '%s'" % themeId }}

		self.response.out.write(json.dumps(response) + "\n\n")	






