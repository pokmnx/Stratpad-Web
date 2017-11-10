#!/usr/bin/env python
#

from google.appengine.ext import db
import datetime
import re

def getValue(jsondata, key, type=db.StringProperty):
	if not key in jsondata:
		return None
	else:
		if isinstance(type, db.StringProperty):
			return jsondata[key]

		elif isinstance(type, db.BooleanProperty):
			val = str(jsondata[key]).lower()
			return not val in ('false','no', '0')

		elif isinstance(type, db.DateProperty):
			return datetime.date(*map(int, re.split('[^\d]', jsondata[key])))

		else:
			return jsondata[key]		

def updateValue(jsondata, key, entity, type=db.StringProperty):
	'''
	Update entity with value in jsondata keyed by key, if it exists
	@param jsondata - a dict of values with some new data to be applied to entity eg {'themeName': 'Great}
	@param key - a property that exists on entity (eg. themeName)
	@param entity - an instance of a datastorage class (eg a Theme instance)
	'''
	if key in jsondata:
		if isinstance(type, db.StringProperty):
			setattr(entity, key, jsondata[key])

		elif isinstance(type, db.BooleanProperty):
			val = str(jsondata[key]).lower()
			b = not val in ('false','no', '0')
			setattr(entity, key, b)

		elif isinstance(type, db.DateProperty):
			d = datetime.date(*map(int, re.split('[^\d]', jsondata[key])))
			setattr(entity, key, d)

		else:
			setattr(entity, key, jsondata[key])
		

			


