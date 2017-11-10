#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import datetime
import logging
import webapp2_extras.appengine.auth.models

from google.appengine.ext import db
from google.appengine.ext import ndb

from security import AccessException

from webapp2_extras import security

class User(webapp2_extras.appengine.auth.models.User):

    def set_password(self, raw_password):
        """Sets the password for the current user

    :param raw_password:
        The raw password which will be hashed and stored
    """

        self.password = security.generate_password_hash(raw_password,
                length=12)

    @classmethod
    def get_by_auth_token(
        cls,
        user_id,
        token,
        subject='auth',
        ):
        """Returns a user object based on a user ID and token.

    :param user_id:
        The user_id of the requesting user.
    :param token:
        The token string to be verified.
    :returns:
        A tuple ``(User, timestamp)``, with a user object and
        the token timestamp, or ``(None, None)`` if both were not found.
    """

        token_key = cls.token_model.get_key(user_id, subject, token)
        user_key = ndb.Key(cls, user_id)

    # Use get_multi() to save a RPC call.

        (valid_token, user) = ndb.get_multi([token_key, user_key])
        if valid_token and user:
            timestamp = \
                int(time.mktime(valid_token.created.timetuple()))
            return (user, timestamp)

        return (None, None)

    @classmethod
    def cleanEmail(value):
        regexp_string = "[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}"
        email = str(value)
        if not re.search(regexp_string, email, re.IGNORECASE):
            raise ValueError('(%s) Value "%s" is invalid. It must match the regexp "%s"' % (id, email, regexp_string))


class Stratfile(db.Model):
    """Models an individual Stratfile entry with several properties."""

    whitelist = [
        'stratfileName',
        'companyName',
        'city',
        'provinceState',
        'country',
        'industry',

        # f2
        'customersDescription',
        'keyProblems',
        'addressProblems',
        'competitorsDescription',
        'businessModelDescription',
        'expansionOptionsDescription',
        'ultimateAspiration',

        #f3
        'strategyStatement',
    ]

    @classmethod
    def get_stratfile_by_id( cls, stratfileId, userId ) :
        logging.info("Looking for strafile: %s belonging to user %s" % (stratfileId, userId))

        stratfile = cls.get_by_id(stratfileId, parent=None)

        if not stratfile:
            raise AccessException("Stratfile not found")
        
        if stratfile.userId != userId:
            raise AccessException("Permission denied")
        
        return stratfile


    def toDict(self):
        jsondata = {
            # NB!!! these are whitelisted for PUTting and POSTing
            # cast to str - jquery/js has problems with longs
            'id': str(self.key().id()),
            'userId': str(self.userId), # this has to become an ACL
            'creationDate': self.creationDate.isoformat(),
            'modificationDate': self.modificationDate.isoformat()
            }

        for prop in Stratfile.whitelist:
            val = getattr(self, prop)
            if val:
                jsondata[prop] = val

        return jsondata
    
    # alternative is to define parent as a user
    # couldn't use db.ReferenceProperty with our models.User
    userId = db.IntegerProperty(required=True)

    # when we first create this stratfile
    creationDate = db.DateTimeProperty(auto_now_add=True)

    # when we modify this entry
    modificationDate = db.DateTimeProperty(auto_now_add=True)

    # f1
    stratfileName = db.StringProperty(required=False)
    companyName = db.StringProperty(required=False)
    city = db.StringProperty(required=False)
    provinceState = db.StringProperty(required=False)
    country = db.StringProperty(required=False)
    industry = db.StringProperty(required=False)

    # f2
    customersDescription = db.TextProperty(required=False)
    keyProblems = db.TextProperty(required=False)
    addressProblems = db.TextProperty(required=False)
    competitorsDescription = db.TextProperty(required=False)
    businessModelDescription = db.TextProperty(required=False)
    expansionOptionsDescription = db.TextProperty(required=False)
    ultimateAspiration = db.TextProperty(required=False)

    #f3
    strategyStatement = db.TextProperty(required=False)


class Theme(db.Model):
    """Models an individual Theme entry with several properties."""

    whitelist = [
    'themeName',
    'startDate',
    'endDate',
    'mandatory',
    'enhanceUniqueness',
    'enhanceCustomerValue',
    'responsible',
    'order',

    'cogsAnnually',
    'cogsMonthly',
    'cogsOneTime',
    'cogsQuarterly',
    'costsAnnually',
    'costsMonthly',
    'costsOneTime',
    'costsQuarterly',
    'expensesAnnually',
    'expensesMonthly',
    'expensesOneTime',
    'expensesQuarterly',
    'revenueAnnually',
    'revenueMonthly',
    'revenueOneTime',
    'revenueQuarterly',

    'cogsAnnuallyAdjustment',
    'cogsMonthlyAdjustment',
    'cogsQuarterlyAdjustment',
    'costsAnnuallyAdjustment',
    'costsMonthlyAdjustment',
    'costsQuarterlyAdjustment',
    'expensesAnnuallyAdjustment',
    'expensesMonthlyAdjustment',
    'expensesQuarterlyAdjustment',
    'revenueAnnuallyAdjustment',
    'revenueMonthlyAdjustment',
    'revenueQuarterlyAdjustment'
    ]

    def toDict(self):
        jsondata = {
            # NB!!! these are whitelisted for PUTting and POSTing
            'id': str(self.key().id()),
            'stratfileId': str(self.stratfile.key().id()),
            'creationDate': self.creationDate.isoformat(),
            'modificationDate': self.modificationDate.isoformat(),
            }

        for prop in Theme.whitelist:
            val = getattr(self, prop)
            if val != None:
                if isinstance(val, datetime.date):
                    jsondata[prop] = val.isoformat()
                else:
                    jsondata[prop] = val

        return jsondata
    
    # when we first create this theme
    creationDate = db.DateTimeProperty(auto_now_add=True)

    # when we modify this entry
    modificationDate = db.DateTimeProperty(auto_now_add=True)

    # one-to-many
    stratfile = db.ReferenceProperty(Stratfile, collection_name='themes')

    # base
    themeName = db.StringProperty(required=True)
    startDate = db.DateProperty(required=False)
    endDate = db.DateProperty(required=False)
    mandatory = db.BooleanProperty(required=True, default=False)
    enhanceUniqueness = db.BooleanProperty(required=True, default=False)
    enhanceCustomerValue = db.BooleanProperty(required=True, default=False)
    responsible = db.StringProperty(required=False)
    order = db.IntegerProperty(required=False)

    # numbers
    cogsAnnually = db.IntegerProperty(required=False)
    cogsMonthly = db.IntegerProperty(required=False)
    cogsOneTime = db.IntegerProperty(required=False)
    cogsQuarterly = db.IntegerProperty(required=False)
    costsAnnually = db.IntegerProperty(required=False)
    costsMonthly = db.IntegerProperty(required=False)
    costsOneTime = db.IntegerProperty(required=False)
    costsQuarterly = db.IntegerProperty(required=False)
    expensesAnnually = db.IntegerProperty(required=False)
    expensesMonthly = db.IntegerProperty(required=False)
    expensesOneTime = db.IntegerProperty(required=False)
    expensesQuarterly = db.IntegerProperty(required=False)
    revenueAnnually = db.IntegerProperty(required=False)
    revenueMonthly = db.IntegerProperty(required=False)
    revenueOneTime = db.IntegerProperty(required=False)
    revenueQuarterly = db.IntegerProperty(required=False)

    # adjustments - note that these are actually decimals, but GAE doesn't support decimal
    # import decimal
    # dec = decimal.Decimal('10.0')
    # str = str(dec)
    # also note there is no adjustment for a one time financial
    cogsAnnuallyAdjustment = db.StringProperty(required=False)
    cogsMonthlyAdjustment = db.StringProperty(required=False)
    cogsQuarterlyAdjustment = db.StringProperty(required=False)
    costsAnnuallyAdjustment = db.StringProperty(required=False)
    costsMonthlyAdjustment = db.StringProperty(required=False)
    costsQuarterlyAdjustment = db.StringProperty(required=False)
    expensesAnnuallyAdjustment = db.StringProperty(required=False)
    expensesMonthlyAdjustment = db.StringProperty(required=False)
    expensesQuarterlyAdjustment = db.StringProperty(required=False)
    revenueAnnuallyAdjustment = db.StringProperty(required=False)
    revenueMonthlyAdjustment = db.StringProperty(required=False)
    revenueQuarterlyAdjustment = db.StringProperty(required=False)

