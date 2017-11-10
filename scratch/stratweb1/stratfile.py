#!/usr/bin/env python
#
import cgi
import datetime
import webapp2
import json
import logging

from google.appengine.ext import db
from google.appengine.ext.db import BadValueError

import util
from security import user_required, BaseHandler, AccessException
from models import User, Stratfile, Theme

class StratfileHandler(BaseHandler):
	"""Restful CRUD for Stratfile"""

	@user_required
	def get(self,stratfileId):
		try:
			logging.info("getting stratfile: " + stratfileId)
			self.addAccessHeaders()			
			stratfile = Stratfile.get_stratfile_by_id(int(stratfileId), self.user.key.id())
			response = {"status": "success", "data": { 'stratfile': stratfile.toDict() }}

		except AccessException, e:
			logging.warn("Failed get: " + str(e))
			response = {"status": "fail", "data" : { "title" : "%s. Stratfile: %s" % (str(e), stratfileId) }}

		except Exception, e:
			logging.error("Error on get: " + str(e))
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }
			
		self.response.out.write(json.dumps(response) + "\n\n")				

	@user_required
	def put(self,stratfileId):
		try:
			logging.info("updating stratfile: " + stratfileId)
			self.addAccessHeaders()

			stratfile = Stratfile.get_stratfile_by_id(int(stratfileId), self.user.key.id())
	
			logging.debug("updates: " + self.request.body)
			jsondata = json.loads(self.request.body)

			# ignore any properties that aren't in our whitelist
			for prop in Stratfile.whitelist:
				util.updateValue(jsondata, prop, stratfile)

			stratfile.modificationDate = datetime.datetime.utcnow()
			stratfile.put()

			response = {"status": "success", "data": { 'stratfile': stratfile.toDict() }}
			
		except AccessException, e:
			logging.warn("Failed put: " + str(e))
			response = {"status": "fail", "data": { "title": str(e) } }

		except Exception, e:
			logging.error("Error on put: " + str(e))
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }			

		self.response.out.write(json.dumps(response) + "\n\n")				

	@user_required
	def delete(self,stratfileId):
		try:
			logging.info("Deleting stratfile: " + stratfileId)
			self.addAccessHeaders()
			stratfile = Stratfile.get_stratfile_by_id(int(stratfileId), self.user.key.id())

			db.delete(Theme.all(keys_only=True).filter("stratfile =", stratfile).fetch(100))
			stratfile.delete()

			response = {"status": "success"}

		except AccessException, e:
			logging.warn("Failed delete: " + str(e))
			response = {"status": "fail", "data" : { "title" : str(e) }}

		except Exception, e:
			logging.error("Error on delete: " + str(e))
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }

		self.response.out.write(json.dumps(response) + "\n\n")				

	@user_required
	def post(self):
		try:
			logging.info("Creating stratfile")
			self.addAccessHeaders()
	
			jsondata = json.loads(self.request.body)

			userId = self.user.key.id()
			logging.info("for userid: %s" % userId)	

			stratfile = Stratfile(parent=None,
				userId=userId,
				)
			for prop in Stratfile.whitelist:
				val = util.getValue(jsondata, prop)
				if val:
					setattr(stratfile, prop, val)
			stratfile.put()

			response = {"status" : "success", "data": { "stratfile": stratfile.toDict()}}

		except BadValueError, e:
			logging.warn("Failed post: " + str(e))
			response = {"status": "fail", "data" : { "title" : str(e) }}
			
		except Exception, e:
			logging.error("Error on post: " + str(e))
			self.response.status = 400
			response = {"status": "error", "data": { "title": str(e) } }

		logging.debug(response)
		self.response.out.write(json.dumps(response) + "\n\n")			

