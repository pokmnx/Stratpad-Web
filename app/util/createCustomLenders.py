#!/usr/bin/env python
# coding: utf-8

# go place the logos manually in their GCS console dir

import csv, re, serviceProviders
from serviceProviders import login, provinces, createServiceProvider, createBusinessLocation, createBusinessContact

server = serviceProviders.prod

#####################################

def createStratBank():
	stratbank = {
		'name': 'StratBank',
		'branchName': 'TEST BRANCH',
		"address1": '123 Any Street',
		'address2': '3rd Floor',
		"city": 'Victoria',
		"provinceState": 'British Columbia',
		"country": "Canada",
		"zipPostal": 'V8V 4Y9',
		"website": 'stratpad.com',
		"categories": ["Bank"],
		"instructions": None,
		"servicesDescription": "Select all options",
		"welcomeMessage": 'This area is used by the bank to place a welcoming message and a list of available services.', 
		"certifications": [],
		"bidPerLead": 20,
		"businessAgeMinimum": 0,
		"maxAgeOwner": None,
		"minAgeOwner": 18,
		"minFicoScore": 450,
		"minimumRevenues": None,
		"preferredBankrupt": None,
		"preferredGender": None,
		"preferredLanguages": [],
		"preferredProfitability": None,
		"includedNaicsCodes": None,
		"excludedNaicsCodes": None, 
		"acceptableAssetTypes": ["Land", "Building", "Machinery", "Furniture", "Tools", "IT Equipment", "Vehicles", "Other"], 
		"availableFinancingTypes": ["Loan"], 
		"docsFolderName": 'stratbank', 
		"status": "approved",
		'termsAccepted': True,

		"firstname": "Alex",
		"lastname": "Glassey",
		"title": "El Presidente",
		"email": "alex@stratpad.com",
		"phone": None

		}
	try:
		if server != serviceProviders.prod:
			result = createServiceProvider(stratbank)
			bizloc = {
				"serviceProviderId": result['id'],
				"city": None,
				"provinceState": None,
				"zipPostal": None,
				"categories": stratbank['categories']
			}

			bizloc['country'] = 'Canada'
			createBusinessLocation(bizloc)

			bizloc['country'] = 'United States'
			createBusinessLocation(bizloc)

			bizloc['country'] = 'United Kingdom'
			createBusinessLocation(bizloc)

			bizloc['country'] = 'Australia'
			createBusinessLocation(bizloc)

			bizloc['country'] = 'New Zealand'
			createBusinessLocation(bizloc)

	except Exception as e:
		print e.__doc__
		print e.message


#####################################

def createOnDeck():
	ondeck = {
		'name': 'OnDeck',
		'branchName': None,
		"address1": '1400 Broadway',
		'address2': 'Floor 25',
		"city": 'New York',
		"provinceState": 'New York',
		"country": "United States",
		"zipPostal": "10018",
		"website": 'ondeck.com',
		"categories": ["Bank"],
		"instructions": None,

		"servicesDescription": "Business Loans",
		"welcomeMessage": '<p>We deliver true small business loans using our OnDeck Score™ technology, which focuses on the health of your business – not your personal credit score.</p><p>OnDeck offers business loans from $5k - $250k to existing businesses.</p><p>You can receive a decision in minutes and funding in as fast as 1 business day.</p><p>We’ve delivered over $1.5 billion nationwide, and have US-based Loan Specialists available six days a week if you need assistance.</p>', 
		"certifications": ['BetterBusinessBureauAPlus'],
		"accreditationLogos": ['forbes.png'],
		"bidPerLead": 100,
		"monthlyAdBudget": None,
		"monthlyLeadLimit": 50,
		"businessAgeMinimum": 1,
		"maxAgeOwner": None,
		"minAgeOwner": 18,
		"minFicoScore": 500,
		"minimumRevenues": 100000,
		"preferredBankrupt": None,
		"preferredGender": None,
		"preferredLanguages": ['en', 'es', 'fr'],
		"preferredProfitability": None,
		"includedNaicsCodes": None,
		"excludedNaicsCodes": None, 
		"acceptableAssetTypes": ["Land", "Building", "Machinery", "Furniture", "Tools", "IT Equipment", "Vehicles", "Other"], 
		"availableFinancingTypes": ["Loan"], 
		"docsFolderName": 'ondeck', 
		"status": "approved",
		'termsAccepted': True,
		'customIntroTaskPath': '/tasks/sendOnDeckIntro',

		"firstname": "Kevin",
		"lastname": "Barry",
		"title": "Online Marketing and Acquisition Manager",
		"email": "kbarry@ondeck.com",
		"phone": "917-677-7063",
		"type": "TECHNICAL"

		}
	try:
		result = createServiceProvider(ondeck)

		contact = {
			"serviceProviderId": result['id'],
			"firstname": "On",
			"lastname": "OnDeck",
			"email": "sales@ondeck.com",
			"phone": "1.888.269.4246",
			"type": 'PRIMARY'
		}
		createBusinessContact(contact)

		bizloc = {
			"serviceProviderId": result['id'],
			"city": None,
			"provinceState": None,
			"zipPostal": None,
			"categories": ondeck['categories']
		}	

		bizloc['zipPostal'] = "0"
		bizloc['country'] = 'United States'
		createBusinessLocation(bizloc)


		# NB. no Quebec
		bizloc['country'] = 'Canada'

		bizloc['zipPostal'] = "T"
		bizloc['provinceState'] = provinces['AB']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "V"
		bizloc['provinceState'] = provinces['BC']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "S"
		bizloc['provinceState'] = provinces['SK']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "R"
		bizloc['provinceState'] = provinces['MB']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "K"
		bizloc['provinceState'] = provinces['ON']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "L"
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "M"
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "N"
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "P"
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "E"
		bizloc['provinceState'] = provinces['NB']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "B"
		bizloc['provinceState'] = provinces['NS']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "C"
		bizloc['provinceState'] = provinces['PE']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "A"
		bizloc['provinceState'] = provinces['NF']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "Y"
		bizloc['provinceState'] = provinces['YT']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "X"
		bizloc['provinceState'] = provinces['NT']
		createBusinessLocation(bizloc)

		bizloc['zipPostal'] = "X"
		bizloc['provinceState'] = provinces['NU']
		createBusinessLocation(bizloc)


	except Exception as e:
		print e.__doc__
		print e.message
		

# ####################################

def createFutur():
	futur = {
		'name': 'FuturPreneur Canada',
		'branchName': 'National Office',
		"address1": '133 Richmond Street West',
		'address2': 'Suite 1400',
		"city": 'Toronto',
		"provinceState": 'Ontario',
		"country": "Canada",
		"zipPostal": "M5H2L3",
		"website": 'www.futurpreneur.ca',
		"categories": ["Bank"],
		"instructions": None,

		"servicesDescription": "Financing up to $45,000",
		"welcomeMessage": 'FuturPreneur Canada is a national non-profit organization providing financing, mentoring and support to help young entrepreneurs (18-39) launch and grow businesses.', 
		"certifications": [],
		"bidPerLead": 50,
		"monthlyAdBudget": 200,
		"monthlyLeadLimit": None,
		"businessAgeMinimum": 0,
		"businessAgeMaximum": 1,
		"maxAgeOwner": 39,
		"minAgeOwner": 18,
		"minFicoScore": None,
		"minimumRevenues": None,
		"minLoanAmount": None,
		"maxLoanAmount": 45000,
		"preferredBankrupt": False,
		"preferredCriminal": False,
		"preferredGender": None,
		"preferredLanguages": ['en', 'fr'],
		"preferredProfitability": None,
		"preferredVeteran": None,
		"hasVeteranServices": True,
		"includedNaicsCodes": None,
		"excludedNaicsCodes": None, 
		"acceptableAssetTypes": ["Land", "Building", "Machinery", "Furniture", "Tools", "IT Equipment", "Vehicles", "Other"], 
		"availableFinancingTypes": ["Loan"], 
		"docsFolderName": 'futurpreneur', 
		"status": "approved",
		'termsAccepted': True,

		"firstname": "FuturPreneur",
		"lastname": "Canada",
		"title": None,
		"email": "startup@futurpreneur.ca",
		"phone": "1.866.646.2922",
		"type": "PRIMARY"

		}
	try:
		result = createServiceProvider(futur)
		bizloc = {
			"serviceProviderId": result['id'],
			"city": None,
			"provinceState": None,
			"country": 'Canada',
			"zipPostal": "0",
			"categories": futur['categories']
		}
		createBusinessLocation(bizloc)

		contact = {
			"serviceProviderId": result['id'],
			"firstname": "Mitchell",
			"lastname": "Krakawer",
			"email": "mkrakawer@futurpreneur.ca",
			"phone": "1.866.646.2922 x2204",
			"type": "TECHNICAL"
		}
		createBusinessContact(contact)

		contact = {
			"serviceProviderId": result['id'],
			"firstname": "Beth",
			"lastname": "Dea",
			"email": "bdea@futurpreneur.ca",
			"phone": "1.866.646.2922 x2119",
			"type": "FINANCIAL"
		}
		createBusinessContact(contact)


	except Exception as e:
		print e.__doc__
		print e.message
		

####################################

def createWEC():
	wec = {
		'name': "Women's Enterprise Centre",
		'branchName': None,
		"address1": 'Landmark 1, 201-1726 Dolphin Ave',
		'address2': None,
		"city": 'Kelowna',
		"provinceState": 'British Columbia',
		"country": "Canada",
		"zipPostal": "V1Y9R9",
		"website": 'www.womensenterprise.ca',
		"categories": ["Bank"],

		"servicesDescription": "Women’s Enterprise Centre offers small business loans up to $150,000 to majority women-owned and controlled businesses in BC.",
		"welcomeMessage": "<ul><li>Loans up to $150,000 to majority women-owned & controlled businesses in BC to start, enhance or purchase a business</li><li>One on one complimentary business counseling</li><li>Complimentary business skills development training</li><li>Various Mentoring programs</li><li>Taking the stage training</li></ul>", 
		"preferredProfitability": None,
		"minimumRevenues": None,
		"availableFinancingTypes": ["Loan"], 
		"acceptableAssetTypes": ["Land", "Building", "Machinery", "Furniture", "Tools", "IT Equipment", "Vehicles", "Other"], 
		"minLoanAmount": None,
		"maxLoanAmount": 150000,

		"preferredFederalBusinessId": None,
		"excludedNaicsCodes": None, 
		"minAgeOwner": 19,
		"preferredGender": "FEMALE",
		"minFicoScore": None,
		"preferredBankrupt": None,
		"preferredCriminal": None,
		"hasVeteranServices": None,

		"bidPerLead": 49,
		"monthlyAdBudget": 100,
		"monthlyLeadLimit": 2,
		"docsFolderName": 'womensenterprise', 
		"status": "approved",
		'termsAccepted': True,

		"firstname": "Cecilia",
		"lastname": "Mkondiwa",
		"title": None,
		"email": "cecilia@womensenterprise.ca",
		"phone": "1.800.643.7014 x203",
		"type": "PRIMARY"

		}
	result = createServiceProvider(wec)
	bizloc = {
		"serviceProviderId": result['id'],
		"city": None,
		"provinceState": "British Columbia",
		"country": 'Canada',
		"zipPostal": "V",
		"categories": wec['categories']
	}
	createBusinessLocation(bizloc)

	contact = {
		"serviceProviderId": result['id'],
		"firstname": "Maxine",
		"lastname": "Walker",
		"email": "maxine@womensenterprise.ca",
		"phone": "1.800.643.7014 x109",
		"type": "FINANCIAL"
	}
	createBusinessContact(contact)

	contact = {
		"serviceProviderId": result['id'],
		"firstname": "Sandra",
		"lastname": "Bird",
		"email": "sandra@womensenterprise.ca",
		"phone": "1.800.643.7014 x101",
		"type": "TECHNICAL"
	}
	createBusinessContact(contact)

####################################

# import a csv file that we can use in createServiceProvider
# BankName,BankNumber,RoutingNumber,MICR,Address1,Address2,Address3,Address4,Address5,Address6,Address7,Municipality,Province,PostalCode,Subinformation
# see 'Canada Banks' in Google Drive - https://docs.google.com/spreadsheets/d/16zrkZJ05VUhZc6c463mCriXcjiSqOqjxtHFMmFmY79g/edit#gid=488201646
login(server, 'root@stratpad.com', 'StratP@d')

# createStratBank()
createOnDeck()
# createWEC()
# createFutur()



