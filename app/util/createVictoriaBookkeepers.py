#!/usr/bin/env python

import csv, re, serviceProviders
from serviceProviders import login, createServiceProvider, provinces

server = serviceProviders.prod

# import a csv file that we can use in createServiceProvider
# see 'Victoria Bookkeepers' in Google Drive - https://docs.google.com/spreadsheets/d/1AnMOell8eZbxPGEsgTh4aCqUAgdcjxlOEQUkgc6rmT4/edit?usp=sharing
login(server, 'root@stratpad.com', 'StratP@d')
with open ('/Users/woodj/Documents/projects/jstratpad/src/main/resources/banks/Victoria Bookkeepers - Sheet1.csv', 'rb') as csvfile:
	reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	ctr = 0
	for row in reader:

		sp = {
			# supplied from csv
			'name': row['Company'],
			"address1": row['Address 1'],
			"address2": row['Address 2'],
			"city": row['City'],
			"provinceState": provinces['BC'],
			"country": "Canada",
			"zipPostal": row['Postal'].replace(' ', ''),
			"categories": ['Bookkeeper'],
			'firstname': row['First'],
			'lastname': row['Last'],
			'email': row['Email'],
			'phone': row['Phone'],
			'website': row['Web'],

			"docsFolderName": row['Email'], 
			"status": "unapproved",
			}
		try:
			ctr += 1
			print ctr
			createServiceProvider(sp)
		except Exception as e:
			print str(e)

		


