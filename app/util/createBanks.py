#!/usr/bin/env python
# coding: utf-8

import csv, re, serviceProviders
from serviceProviders import login, createServiceProvider, provinces

server = serviceProviders.dev

# import a csv file that we can use in createServiceProvider
# BankName,BankNumber,RoutingNumber,MICR,Address1,Address2,Address3,Address4,Address5,Address6,Address7,Municipality,Province,PostalCode,Subinformation
# see 'Canada Banks' in Google Drive - https://docs.google.com/spreadsheets/d/16zrkZJ05VUhZc6c463mCriXcjiSqOqjxtHFMmFmY79g/edit#gid=488201646
login(server, 'root@stratpad.com', 'StratP@d')
with open ('/Users/woodj/Documents/projects/jstratpad/src/main/resources/banks/Canada banks.csv', 'rb') as csvfile:
	reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	ctr = 0
	for row in reader:
		if row['Subinformation'] != '':
			continue
		fi = {
			# supplied from csv
			'name': row['BankName'],
			'branchName': row['Address1'],
			"address1": row['Address2'],
			"address2": ','.join(map(str,(row['Address2'], row['Address3'], row['Address4'], row['Address5'], row['Address6'], row['Address7']))),
			"city": row['Municipality'],
			"provinceState": provinces[row['Province']],
			"country": "Canada",
			"zipPostal": row['PostalCode'], # todo parse this

			# generic
			"bidPerLead": None,
			"website": None,
			"categories": ["Bank"],
			"instructions": None,
			"servicesDescription": "We offer a wide range of financial services.",
			"welcomeMessage": "Welcome to " + row['BankName'], 
			"certifications": [],
			"businessAgeMinimum": "0",
			"maxAgeOwner": None,
			"minAgeOwner": None,
			"minFicoScore": None,
			"minimumRevenues": None,
			"preferredBankrupt": None,
			"preferredGender": None,
			"preferredLanguages": [],
			"preferredProfitability": None,
			"includedNaicsCodes": [11,21,22,23,31,32,33,42,44,45,48,49,51,52,53,54,55,56,61,62,71,72,81,92],
			"excludedNaicsCodes": [], 
			"acceptableAssetTypes": ["Land", "Building", "Machinery", "Furniture", "Tools", "IT Equipment", "Vehicles", "Other"], 
			"availableFinancingTypes": ["Loan"], 
			"docsFolderName": row['DocsFolderName'], 
			"status": "unapproved",
			"termsAccepted": False,

			"firstname": "Lewis",
			"lastname": "Glassey",
			"title": "Manager",
			"email": "connect@stratpad.com",
			"phone": None,
			"type": "TECHNICAL"

			}
		try:
			ctr += 1
			print ctr			
			result = createServiceProvider(fi)
		except Exception as e:
			print e.__doc__
			print e.message
