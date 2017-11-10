#!/usr/bin/env python

import csv, re, serviceProviders
from serviceProviders import login, createServiceProvider

server = serviceProviders.dev

# import a csv file that we can use in createServiceProvider
# see 'Consultants' in Google Drive - https://docs.google.com/spreadsheets/d/1xNbbZzR4AU_o697Rbdbu13sWGZKJoP0jmIJWbc-LVq4/edit?usp=sharing
login(server, 'root@stratpad.com', 'StratP@d')
with open ('/Users/woodj/Documents/projects/jstratpad/src/main/resources/banks/Consultants - contacts.csv', 'rb') as csvfile:
	reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	ctr = 0
	for row in reader:

		if row['Contact Email'] == '':
			row['Contact Email'] = row['Co Email']
		if row['Contact Phone'] == '':
			row['Contact Phone'] = row['Co Phone']

		includedNaicsCodes = []
		if row['NAICS code'] != '':
			includedNaicsCodes.append(row['NAICS code'])

		sp = {
			# supplied from csv
			'name': row['Co Name'],
			"address1": row['Mailing Addr'],
			"address2": None,
			"city": row['Mail Town'].title(),
			"provinceState": row['Mail Province'],
			"country": "Canada",
			"zipPostal": row['Mail Postal Code'].replace(' ', ''),
			"categories": ['Consultant'],
			"certifications": None,
			'firstname': row['First'].strip(),
			'lastname': row['Last'].strip(),
			'email': row['Contact Email'],
			'phone': row['Contact Phone'],
			"includedNaicsCodes": includedNaicsCodes,

			"docsFolderName": row['Contact Email'], 
			"status": "unapproved",

			# generic empties
			'branchName': None,
			"website": None,
			"instructions": None,
			"servicesDescription": "", # better to fill this in client side
			"welcomeMessage": "", # better to fill this in client side
			"businessAgeMinimum": "0",
			"maxAgeOwner": None,
			"minAgeOwner": None,
			"minFicoScore": None,
			"minimumRevenues": None,
			"preferredBankrupt": None,
			"preferredGender": None,
			"preferredLanguages": [],
			"preferredProfitability": None,
			"excludedNaicsCodes": [], 
			"acceptableAssetTypes": [], 
			"availableFinancingTypes": []
			}
		try:
			ctr += 1
			print ctr
			createServiceProvider(sp)
		except Exception as e:
			print str(e)

		


