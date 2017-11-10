#!/usr/bin/env python

import csv, re, serviceProviders
from serviceProviders import login, createServiceProvider, provinces

server = serviceProviders.dev

# import a csv file that we can use in createServiceProvider
# see 'Canada QBO Pros' in Google Drive - https://docs.google.com/spreadsheets/d/14L0Cd72JXSQjI0rCNfVkVorpLxxbw5vDPfCwQdwkRIk/edit?usp=sharing
login(server, 'root@stratpad.com', 'StratP@d')
with open ('/Users/woodj/Documents/projects/jstratpad/src/main/resources/banks/Canada QBO Pros - Sheet1.csv', 'rb') as csvfile:
	reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	ctr = 0
	for row in reader:

		if row['Company'] == '':
			if row['First Name'] != '' and row['Last Name'] != '':
				row['Company'] = row['First Name'] + ' ' + row['Last Name']

		cats = []
		if row['Bookkeeper'] == 'X':
			cats.append('Bookkeeper')
		if row['Accountant'] == 'X':
			cats.append('Accountant')

		sp = {
			# supplied from csv
			'name': row['Company'],
			"address1": row['Address 1'],
			"address2": row['Address 2'],
			"city": row['City'],
			"provinceState": provinces[row['Province']],
			"country": "Canada",
			"zipPostal": row['Postal Code'].replace(' ', ''),
			"categories": cats,
			"certifications": re.split('[ ,]+', row['Credentials']),
			'firstname': row['First Name'],
			'lastname': row['Last Name'],
			'email': row['Email'],
			'phone': row['Phone'],

			"docsFolderName": row['Email'], 
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
			"includedNaicsCodes": [],
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

		


