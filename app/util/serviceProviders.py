#!/usr/bin/env python

# http://docs.python-requests.org/en/latest/index.html

import requests, json, re
from pprint import pprint

dev = ('http', '127.0.0.1', '8888')
staging = ('https', 'jstratpad.appspot.com', '443')
prod = ('https', 'rest.stratpad.com', '443')

# our csv's have abbrevs but we need full names (ie matching our regions service)
provinces = {
	'AB': 'Alberta',
	'BC': 'British Columbia',
	'SK': 'Saskatchewan',
	'MB': 'Manitoba',
	'ON': 'Ontario',
	'QC': 'Quebec',
	'NB': 'New Brunswick',
	'NS': 'Nova Scotia',
	'PE': 'Prince Edward Island',
	'NL': 'Newfoundland and Labrador',
	'NF': 'Newfoundland and Labrador', #correct one, btw
	'YT': 'Yukon Territory', # todo: missing from regions.txt
	'NT': 'Northwest Territories',
	'NU': 'Nunavut' # todo: missing from regions.txt
	# todo: we need a script to add a city and/or region and/or country to our db
}

def login(server, email, password):
	global __BASE_URL__, __COOKIES__
	domain = server[1]
	__BASE_URL__ = server[0] + '://' + domain + ':' + server[2]
	login_url = __BASE_URL__ + "/logIn"
	print login_url
	data = json.dumps({'email': email, 'password': password}) 
	r = requests.post(login_url, data)
	pprint (vars(r.cookies))
	session_id = r.cookies['JSESSIONID']
	__COOKIES__ = dict(JSESSIONID=session_id, Domain=domain, Path='/')


# add additional bizlocs	
def createBusinessLocation(bizLocMap):
	# create locations where biz operates
	bizloc_url = __BASE_URL__ + '/serviceProviders/' + str(bizLocMap['serviceProviderId']) + '/businessLocations'
	data = json.dumps({
		"city": bizLocMap['city'],
		"provinceState": bizLocMap['provinceState'],
		"country": bizLocMap['country'],
		"categories": bizLocMap['categories'],
		"zipPostal": bizLocMap['zipPostal']
		})
	r = requests.post(bizloc_url, cookies=__COOKIES__, data=data)
	print "Created bizloc {0} for {1}".format(r.json()['data']['businessLocation']['id'], bizLocMap['serviceProviderId'])	


# add additional contacts
def createBusinessContact(contactMap):
	contact_url = __BASE_URL__ + '/serviceProviders/' + str(contactMap['serviceProviderId']) + '/contacts'
	data = json.dumps({
		"firstname": contactMap['firstname'],
		"lastname": contactMap['lastname'],
		"email": contactMap['email'],
		"phone": contactMap['phone'],
		"type": "PRIMARY" if 'type' not in contactMap else contactMap['type']})
	r = requests.post(contact_url, cookies=__COOKIES__, data=data)
	print "Created contact {0} for {1}".format(r.json()['data']['contact']['id'], contactMap['serviceProviderId'])


# add a serviceProvider, bizloc and contact
def createServiceProvider(fi):
	# create SP
	fi_url = __BASE_URL__ + "/serviceProviders"
	data = json.dumps({
		"name": None if 'name' not in fi else fi['name'],
		"branchName": None if 'branchName' not in fi else fi['branchName'],
		"bidPerLead": None if 'bidPerLead' not in fi else fi['bidPerLead'],
		'termsAccepted': None if 'termsAccepted' not in fi else fi['termsAccepted'],

		"address1": None if 'address1' not in fi else fi['address1'],
		"address2": None if 'address2' not in fi else fi['address2'],
		"city": None if 'city' not in fi else fi['city'],
		"provinceState": None if 'provinceState' not in fi else fi['provinceState'], # give us the fullname - use the lookup if needed
		"country": None if 'country' not in fi else fi['country'],
		"zipPostal": None if 'zipPostal' not in fi else fi['zipPostal'],

		"website": None if 'website' not in fi else fi['website'],
		"instructions": None if 'instructions' not in fi else fi['instructions'], # not currently used anywhere
		"servicesDescription": '' if 'servicesDescription' not in fi else fi['servicesDescription'], # better to fill this in client side
		"welcomeMessage": '' if 'welcomeMessage' not in fi else fi['welcomeMessage'], # better to fill this in client side
		"certifications": None if 'certifications' not in fi else fi['certifications'],
		"businessAgeMinimum": 0 if 'businessAgeMinimum' not in fi else fi['businessAgeMinimum'],
		"maxAgeOwner": None if 'maxAgeOwner' not in fi else fi['maxAgeOwner'],
		"minAgeOwner": None if 'minAgeOwner' not in fi else fi['minAgeOwner'],
		"minFicoScore": None if 'minFicoScore' not in fi else fi['minFicoScore'],
		"minimumRevenues": None if 'minimumRevenues' not in fi else fi['minimumRevenues'],
		"preferredBankrupt": None if 'preferredBankrupt' not in fi else fi['preferredBankrupt'],
		"preferredGender": None if 'preferredGender' not in fi else fi['preferredGender'],
		"preferredLanguages": ['en'] if 'preferredLanguages' not in fi else fi['preferredLanguages'],
		"preferredProfitability": None if 'preferredProfitability' not in fi else fi['preferredProfitability'],
		"includedNaicsCodes": [] if 'includedNaicsCodes' not in fi else fi['includedNaicsCodes'],
		"excludedNaicsCodes": [] if 'excludedNaicsCodes' not in fi else fi['excludedNaicsCodes'],
		"acceptableAssetTypes": [] if 'acceptableAssetTypes' not in fi else fi['acceptableAssetTypes'],
		"availableFinancingTypes": [] if 'availableFinancingTypes' not in fi else fi['availableFinancingTypes'],
		"docsFolderName": None if 'docsFolderName' not in fi else fi['docsFolderName'],
		"status": 'unapproved' if 'status' not in fi else fi['status'],
		"monthlyAdBudget": None if 'monthlyAdBudget' not in fi else fi['monthlyAdBudget'],
		"monthlyLeadLimit": None if 'monthlyLeadLimit' not in fi else fi['monthlyLeadLimit'],
		"businessAgeMaximum": None if 'businessAgeMaximum' not in fi else fi['businessAgeMaximum'],
		"minLoanAmount": None if 'minLoanAmount' not in fi else fi['minLoanAmount'],
		"maxLoanAmount": None if 'maxLoanAmount' not in fi else fi['maxLoanAmount'],
		"preferredCriminal": None if 'preferredCriminal' not in fi else fi['preferredCriminal'],
		"preferredVeteran": None if 'preferredVeteran' not in fi else fi['preferredVeteran'],
		"hasVeteranServices": None if 'hasVeteranServices' not in fi else fi['hasVeteranServices'],
		"preferredFederalBusinessId": None if 'preferredFederalBusinessId' not in fi else fi['preferredFederalBusinessId'],
		"customIntroTaskPath": None if 'customIntroTaskPath' not in fi else fi['customIntroTaskPath'],
		"accreditationLogos": None if 'accreditationLogos' not in fi else fi['accreditationLogos'],

		})
	r = requests.post(fi_url, cookies=__COOKIES__, data=data)
	result = r.json()['data']['serviceProvider']
	fi_id = result['id']
	print u"Created serviceProvider: {0} -> {1}".format(fi_id, result['name'])


	# create locations where biz operates
	bizloc_url = __BASE_URL__ + '/serviceProviders/' + str(fi_id) + '/businessLocations'
	data = json.dumps({
		"city": fi['city'],
		"provinceState": fi['provinceState'],
		"country": fi['country'],
		"categories": fi['categories'],
		"zipPostal": fi['zipPostal']
		})
	r = requests.post(bizloc_url, cookies=__COOKIES__, data=data)
	print "Created bizloc {0} for {1}".format(r.json()['data']['businessLocation']['id'], fi_id)


	# create contact
	contact_url = __BASE_URL__ + '/serviceProviders/' + str(fi_id) + '/contacts'
	data = json.dumps({
		"firstname": fi['firstname'],
		"lastname": fi['lastname'],
		"email": fi['email'],
		"phone": fi['phone'],
		"type": "PRIMARY" if 'type' not in fi else fi['type']})
	r = requests.post(contact_url, cookies=__COOKIES__, data=data)
	print "Created contact {0} for {1}".format(r.json()['data']['contact']['id'], fi_id)

	return result
