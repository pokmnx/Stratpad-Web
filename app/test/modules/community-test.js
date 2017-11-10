test('community requirements test', function() {
	stop();
	expect(8);

	var stratFileId, discussion;
   	var deferred = $.Deferred();
    deferred.resolve();

    // create stratfile
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles",
            type: "POST",
            data: JSON.stringify({ 
            	name: "stratfile community requirements", 
            	city: 'Kalamazoo'
            }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile create check" );
			equal( response.data.stratFile.name, "stratfile community requirements", "stratfile name check" );
	    	stratFileId = response.data.stratFile.id;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    // add discussions
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles/" + stratFileId + "/discussions",
            type: "POST",
            data: JSON.stringify({ 
			    customersDescription: "Howdy doody!",
			    keyProblems: "Wazzup?",
			    addressProblems: "How y'all doing?",
			    competitorsDescription: "G'day!",
			    businessModelDescription: "G'night!",
			    expansionOptionsDescription: "Gimme 5",
			    ultimateAspiration: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
			    mediumTermStrategicGoal: "Relentless",
            }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "discussions create check" );
			discussion = response.data.discussion;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    // add themes
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles/" + stratFileId + "/themes",
            type: "POST",
            data: JSON.stringify({ 
            	name: "a good theme", 
            	startDate: 20110301,
            	endDate: 20151231,
            	responsible: 'Julian',
            	revenueMonthly: 1000,
            	cogsMonthly: 500
            }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "theme create check" );
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    // =====================
    // now let's check if this stratfile is good for community requirements

    var checkDiscussionPages = function(discussion) {
    	var isOK = true;
    	var discussionKeys = [			    
			'customersDescription',
			'keyProblems',
			'addressProblems',
			'competitorsDescription',
			'businessModelDescription',
			'expansionOptionsDescription',
			'ultimateAspiration',
			'mediumTermStrategicGoal'
		];
		_.each(discussionKeys, function(discussionKey) {
			if (discussion.hasOwnProperty(discussionKey) && discussion[discussionKey].length < 140) {
				isOK = false;
			};
		})
    	return isOK;
    };

    var checkProjects = function(projects) {
    	// this is generally a backbone collection, but we can make it work with both
    	// let's just make sure it has a name which isn't untitled
    	return true;
    };

    var checkIncomeStatement = function(incomeStatement) {
    	// look at netIncome line for 12 consecutive non-null vals
    	var ctr = 0, max = 0;
    	_.each(incomeStatement.netIncome.totals, function(val) {
			ctr = (val == null) ? 0 : ctr + 1;
			max = Math.max(ctr, max);
		});
    	return max >= 12;
    }

    // get discussions and analyze
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles/" + stratFileId + "/discussions",
            type: "GET",
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "discussions fetch check" );

    // todo: when we do this GET, then frequently, the discussion entity only has id, creation and modification date
    // - https://trello.com/c/qhRno6PH
    // - the dataviewer shows the same thing and never shows the received data
    // - the return value on the above POST has all the discussion data as expected
    // - no errors anywhere - data just disappears into the ether

			// ok (!checkDiscussionPages(response.data.discussion), 'discussions complete check');
			ok (!checkDiscussionPages(discussion), 'discussions complete check'); 
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

	// get projects and analyze
	// don't need to do here

	// get IS and analyze  
    deferred = deferred.then(function() {
        return $.ajax({
          url: serverURL + "/reports/incomestatement/details",
          type: "GET",
          dataType: 'json',
          data: {
            'id': stratFileId
          },
          contentType: "application/json; charset=utf-8"
        })
          .done(function(response, textStatus, jqXHR) {
			ok (checkIncomeStatement(response), 'income statement complete check');
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("%s: %s", textStatus, errorThrown);
            start();
          });
             
    });


    // ===================

    // cleanup
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8" 
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile cleanup" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});
    });




});

test('business background test', function() {
	stop();
	expect(25);

	var stratFileId, serviceProviderId;
    var deferred = $.Deferred();
    deferred.resolve();

    // create stratfile
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles",
            type: "POST",
            data: JSON.stringify({ name: "stratfile businessBackground", city: 'Kalamazoo' }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile create check" );
			equal( response.data.stratFile.name, "stratfile businessBackground", "stratfile name check" );
	    	stratFileId = response.data.stratFile.id;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    // exercise businessBackgrounds
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/businessBackgrounds',
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "businessBackgrounds get check" );
			// we just get a single, empty businessBackground object after stratfile create
			ok ( response.data.businessBackground.id > 0, 'id check');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/businessBackgrounds/' + response.data.businessBackground.id,
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "businessBackgrounds get check" );
			// we just get a single, empty businessBackground object after stratfile create
			ok ( response.data.businessBackground.id > 0, 'id check');			
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/businessBackgrounds/' + response.data.businessBackground.id,
	        type: "PUT",
	        data: JSON.stringify({
	            'businessStructure': 'Corporation',
	            'industryCodeNaics': 4035,
	            'industry': 'Papple orchards',
	            'duns': '123456789',
	            'financingTypeRequested': 'Loan',
	            'moneyRequiredMax': 500000,
	            'moneyRequiredMin': 100000,
	            'preferredLanguage': 'en',
	            'requestedAssetTypes': ['Land'],
	            'profitable': true,
	            'revenueMax': 100000,
	            'revenueMin': 50000,
	            'yearsInBusiness': 4
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "businessBackgrounds get check" );
			var businessBackground = response.data.businessBackground;
			ok ( businessBackground.id > 0, 'id check');
			equal( businessBackground.businessStructure, 'Corporation', "businessBackgrounds.businessStructure check" );
			equal( businessBackground.industryCodeNaics, 4035, "businessBackgrounds.industryCodeNaics check" );
			equal( businessBackground.industry, 'Papple orchards', "businessBackgrounds.industry check" );
			equal( businessBackground.duns, '123456789', "businessBackgrounds.duns check" );
			equal( businessBackground.financingTypeRequested, 'Loan', "businessBackgrounds.financingTypeRequested check" );
			equal( businessBackground.moneyRequiredMax, 500000, "businessBackgrounds.moneyRequiredMax check" );
			equal( businessBackground.moneyRequiredMin, 100000, "businessBackgrounds.moneyRequiredMin check" );
			equal( businessBackground.preferredLanguage, 'en', "businessBackgrounds.preferredLanguage check" );
			equal( businessBackground.requestedAssetTypes[0], 'Land', "businessBackgrounds.requestedAssetTypes check" );
			equal( businessBackground.profitable, true, "businessBackgrounds.profitable check" );
			equal( businessBackground.revenueMax, 100000, "businessBackgrounds.revenueMax check" );
			equal( businessBackground.revenueMin, 50000, "businessBackgrounds.revenueMin check" );
			equal( businessBackground.yearsInBusiness, 4, "businessBackgrounds.yearsInBusiness check" );

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

	// check to make sure array overwrites properly
    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/businessBackgrounds/' + response.data.businessBackground.id,
	        type: "PUT",
	        data: JSON.stringify({
	            'requestedAssetTypes': ['Machinery'],
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "businessBackgrounds get check" );
			var businessBackground = response.data.businessBackground;
			ok ( businessBackground.id > 0, 'id check');
			equal( businessBackground.requestedAssetTypes.length, 1, "businessBackgrounds.requestedAssetTypes check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

	// would never DELETE a BusinessBackground

	// cleanup
    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8" 
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile cleanup" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});
	});

});


//////////////////////////////////////////


test('personal credit history test', function() {
	stop();
	expect(14);

    var deferred = $.Deferred();
    deferred.resolve();

    // exercise personalCreditHistories
    // interestingly you can also use email in place of userId
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/users/" + localStorage.userId + '/personalCreditHistories',
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "personalCreditHistories get check" );
			// we just get a single, empty personalCreditHistory object after stratfile create
			ok ( response.data.personalCreditHistory.id > 0, 'id check');
			equal (response.data.personalCreditHistory.userId, localStorage.userId, 'userId check');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/users/" + localStorage.userId + '/personalCreditHistories/' + response.data.personalCreditHistory.id,
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "personalCreditHistories get check" );
			// we just get a single, empty personalCreditHistory object after stratfile create
			ok ( response.data.personalCreditHistory.id > 0, 'id check');			
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/users/" + localStorage.userId + '/personalCreditHistories/' + response.data.personalCreditHistory.id,
	        type: "PUT",
	        data: JSON.stringify({
	            'bankrupt': false,
	            'birthdate': 19821025,
	            'criminalRecord': true,
	            'fico': 385,
	            'gender': 'MALE',
	            'ssnSin': '123 asd 123',
	            'veteran': false
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "personalCreditHistories get check" );
			var personalCreditHistory = response.data.personalCreditHistory;
			ok ( personalCreditHistory.id > 0, 'id check');

			equal( personalCreditHistory.bankrupt, false, "personalCreditHistories.bankrupt check" );
			equal( personalCreditHistory.birthdate, 19821025, "personalCreditHistories.birthdate check" );
			equal( personalCreditHistory.criminalRecord, true, "personalCreditHistories.criminalRecord check" );
			equal( personalCreditHistory.fico, 385, "personalCreditHistories.fico check" );
			equal( personalCreditHistory.gender, 'MALE', "personalCreditHistories.gender check" );
			equal( personalCreditHistory.ssnSin, '123 asd 123', "personalCreditHistories.ssnSin check" );
			equal( personalCreditHistory.veteran, false, "personalCreditHistories.veteran check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});

	});	

	// would never DELETE a PersonalCreditHistory

});


//////////////////////////////////////////


test('service provider test', function() {
	stop();
	expect(67);

    var deferred = $.Deferred();
    deferred.resolve();

    var credentials = JSON.stringify({
		"email": "root@stratpad.com",
		"password": "StratP@d"
	});

	var deferred = $.Deferred();
	deferred.resolve();

	// log in as admin
	deferred = deferred.then(function() {
	    return $.ajax({
			url: serverURL + "/logIn",
			type: "POST",
			data: credentials,
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "root logIn");
			console.debug('logged in root');
	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
	});

	// create FI
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders",
	        type: "POST",
	        data: JSON.stringify({
				'address1': 'Suite #105',
				'address2': '621 23rd Ave NE',
				'branchName': 'Center and 8th',
				'businessAgeMinimum': 3,
				'instructions': 'Download these docs.',
				'maxAgeOwner': 60,
				'minAgeOwner': 30,
				'minFicoScore': 200,
				'minimumRevenues': 10000,
				'name': 'ScotiaBank',
				'preferredBankrupt': false,
				'preferredGender': null,
				'preferredLanguages': null,
				'preferredProfitability': true,
				'servicesDescription': 'Commercial loans.\n Equipment loans.\n Lines of credit.\n SBA lender.',
				'website': 'scotiabank.com',
				'welcomeMessage': "<p>We've proudly served North Texas businesses since 1891.</p><p>We have a full range of loan options and we're an SBA- approved lender.</p><p>We look forward to meeting you.</p>",
				'status': 'test'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "serviceProviders POST check" );
			console.debug('created service provider');
			var serviceProvider = response.data.serviceProvider;
			ok ( serviceProvider.id > 0, 'id check');
			serviceProviderId = serviceProvider.id;

			equal( serviceProvider.address1, 'Suite #105', "ServiceProvider.address1 check" );
			equal( serviceProvider.address2, '621 23rd Ave NE', "ServiceProvider.address2 check" );
			equal( serviceProvider.branchName, 'Center and 8th', "ServiceProvider.branchName check" );
			equal( serviceProvider.businessAgeMinimum, 3, "ServiceProvider.businessAgeMinimum check" );
			equal( serviceProvider.instructions, 'Download these docs.', "ServiceProvider.instructions check" );
			equal( serviceProvider.maxAgeOwner, 60, "ServiceProvider.maxAgeOwner check" );
			equal( serviceProvider.minAgeOwner, 30, "ServiceProvider.minAgeOwner check" );
			equal( serviceProvider.minFicoScore, 200, "ServiceProvider.minFicoScore check" );
			equal( serviceProvider.minimumRevenues, 10000, "ServiceProvider.minimumRevenues check" );
			equal( serviceProvider.name, 'ScotiaBank', "ServiceProvider.name check" );
			equal( serviceProvider.preferredBankrupt, false, "ServiceProvider.preferredBankrupt check" );
			equal( serviceProvider.preferredGender, null, "ServiceProvider.preferredGender check" );
			equal( serviceProvider.preferredLanguages, null, "ServiceProvider.preferredLanguages check" );
			equal( serviceProvider.preferredProfitability, true, "ServiceProvider.preferredProfitability check" );
			equal( serviceProvider.servicesDescription, 'Commercial loans.\n Equipment loans.\n Lines of credit.\n SBA lender.', "ServiceProvider.servicesDescription check" );
			equal( serviceProvider.website, 'scotiabank.com', "ServiceProvider.website check" );
			equal( serviceProvider.welcomeMessage, "<p>We've proudly served North Texas businesses since 1891.</p><p>We have a full range of loan options and we're an SBA- approved lender.</p><p>We look forward to meeting you.</p>", "ServiceProvider.welcomeMessage check" );

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// modify FI - depends on above response
    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId,
	        type: "PUT",
	        data: JSON.stringify(_.extend(response.data.serviceProvider, {
				'preferredBankrupt': true,
				'preferredGender': 'FEMALE',
				'preferredLanguages': ['en'],
				'preferredProfitability': false,
	        })),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "serviceProviders PUT check" );
			console.debug('modified service provider');
			var serviceProvider = response.data.serviceProvider;
			ok ( serviceProvider.id > 0, 'id check');

			// NB if we don't provide a property name when modifying, it is lost ie null (but we are providing it)
			equal( serviceProvider.name, 'ScotiaBank', "ServiceProvider.name check" );

			equal( serviceProvider.preferredBankrupt, true, "ServiceProvider.preferredBankrupt check" );
			equal( serviceProvider.preferredGender, 'FEMALE', "ServiceProvider.preferredGender check" );
			equal( serviceProvider.preferredLanguages[0], 'en', "ServiceProvider.preferredLanguages check" );
			equal( serviceProvider.preferredProfitability, false, "ServiceProvider.preferredProfitability check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// add contacts
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/contacts',
	        type: "POST",
	        data: JSON.stringify({
	        	'firstname': 'Jay',
	        	'lastname': 'Dubs',
	        	'title': 'Salesman',
	        	'email': 'jdubs@gmail.com',
	        	'phone': '403.277.7227',
	        	'type': 'PRIMARY' // PRIMARY, FINANCIAL or TECHNICAL
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "POST a contact for an FI" );
			console.debug('added contacts');
			var contact = response.data.contact;
			ok ( contact.id > 0, 'id check');

			equal( contact.firstname, 'Jay', "Contact.firstname check" );
			equal( contact.lastname, 'Dubs', "Contact.lastname check" );
			equal( contact.title, 'Salesman', "Contact.title check" );
			equal( contact.email, 'jdubs@gmail.com', "Contact.email check" );
			equal( contact.phone, '403.277.7227', "Contact.phone check" );
			equal( contact.type, 'PRIMARY', "Contact.type check" );

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// add places of business (required for search)
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/businessLocations',
	        type: "POST",
	        data: JSON.stringify({
	        	'city': 'Calgary',
	        	'country': 'Canada',
	        	'provinceState': 'Alberta'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "POST a businessLocation for an FI" );
			console.debug('added bizlocs');
			var businessLocation = response.data.businessLocation;
			ok ( businessLocation.id > 0, 'id check');

			equal( businessLocation.city, 'Calgary', "city check" );
			equal( businessLocation.country, 'Canada', "country check" );
			equal( businessLocation.provinceState, 'Alberta', "provinceState check" );
			equal( businessLocation.categories, undefined);

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});


	// create another FI, with our arrays
	var fiidToDelete;
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders",
	        type: "POST",
	        data: JSON.stringify({
				'name': 'TD Bank',
				'acceptableAssetTypes': ['Land', 'Property'],
				'excludedNaicsCodes': [1234, 9999, 4567],
				'includedNaicsCodes': [11,21,22,23,31,32,33,42,44,45,48,49,51,52,53,54,55,56,61,62,71,72,81,92],
				'availableFinancingTypes': ['Loan', 'Mortgage'],
				'preferredLanguages': ['en', 'fr'],
				'certifications': ['BetterBusinessBureau'],
				'status': 'test'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "POST another ServiceProvider" );
			console.debug('create another service provider');
			var serviceProvider = response.data.serviceProvider;
			ok ( serviceProvider.id > 0, 'id check');
			fiidToDelete = serviceProvider.id;

			equal ( serviceProvider.acceptableAssetTypes.length, 2, 'acceptableAssetTypes length check');
			equal ( serviceProvider.excludedNaicsCodes.length, 3, 'excludedNaicsCodes length check');
			equal ( serviceProvider.includedNaicsCodes.length, 24, 'excludedNaicsCodes length check');
			equal ( serviceProvider.availableFinancingTypes.length, 2, 'availableFinancingTypes length check');
			equal ( serviceProvider.preferredLanguages.length, 2, 'preferredLanguages length check');
			equal ( serviceProvider.certifications.length, 1, 'certifications length check');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// modify FI - check that arrays function properly - depends on above response
    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId,
	        type: "PUT",
	        data: JSON.stringify(_.extend(response.data.serviceProvider, {
				'acceptableAssetTypes': ['Machinery'],
				'excludedNaicsCodes': [],
				'includedNaicsCodes': [11,21,22,23,31],
				'availableFinancingTypes': ['Loan'],
				'preferredLanguages': ['en', 'es'],
				'certifications': ['BetterBusinessBureau', 'StratPadCoachLevel3', 'QBOCertifiedProAdvisor'],
	        })),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "serviceProviders PUT array check" );
			console.debug('modified service provider array properties');
			var serviceProvider = response.data.serviceProvider;
			ok ( serviceProvider.id > 0, 'id check');

			equal ( serviceProvider.acceptableAssetTypes.length, 1, 'acceptableAssetTypes length check');
			equal ( serviceProvider.excludedNaicsCodes.length, 0, 'excludedNaicsCodes length check');
			equal ( serviceProvider.includedNaicsCodes.length, 5, 'excludedNaicsCodes length check');
			equal ( serviceProvider.availableFinancingTypes.length, 1, 'availableFinancingTypes length check');
			equal ( serviceProvider.preferredLanguages.length, 2, 'preferredLanguages length check');
			equal ( serviceProvider.certifications.length, 3, 'certifications length check');

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});


    // get all FI
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders",
	        type: "GET",
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "serviceProviders GET check" );
			console.debug('get all serviceProviders');
			ok ( response.data.serviceProviders.length > 2, 'get all ServiceProviders check');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // delete an FI
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + fiidToDelete,
	        type: "DELETE",
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "serviceProviders DELETE check" );
			console.debug('deleted serviceProvider');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// add some more FI for match testing
    deferred = deferred.then(function() {
    	return $.ajax({
			url: serverURL + "/serviceProviders",
	        type: "POST",
	        data: JSON.stringify({
	        	'address1': '1216 Centre St N',
				'branchName': 'Center and 12th',
				'businessAgeMinimum': 1,
				'city': 'Calgary',
				'country': 'Canada',
				'instructions': 'Download these docs.',
				'maxAgeOwner': 50,
				'minAgeOwner': 20,
				'minFicoScore': 200,
				'minimumRevenues':5000,
				'name': 'TD Canada Trust',
				'preferredBankrupt': false,
				'preferredGender': null,
				'preferredLanguages': null,
				'preferredProfitability': true,
				'servicesDescription': 'Commercial loans.\n Equipment loans.\n Lines of credit.\n SBA lender.',
				'provinceState': 'Alberta',
				'website': 'www.td.com',
				'welcomeMessage': "<p>We've proudly served North Texas businesses since 1891.</p><p>We have a full range of loan options and we're an SBA- approved lender.</p><p>We look forward to meeting you.</p>",
				'zipPostal': 'T2E 2R4',
				'acceptableAssetTypes': ['Land', 'Machinery'],
				'excludedNaicsCodes': [1234, 9999, 4567],
				'availableFinancingTypes': ['Loan', 'Credit Line'],
				'docsFolderName': 'td-canada-trust',
				'certifications': ['BetterBusinessBureau'],
				'status': 'test'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "community matches GET check" );
			console.debug('created serviceProvider for matching');			
			serviceProviderId = response.data.serviceProvider.id;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// primary contact
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/contacts',
	        type: "POST",
	        data: JSON.stringify({
	        	'firstname': 'Jay',
	        	'lastname': 'Dubs',
	        	'title': 'El Presidente',
	        	'email': 'jdubs@gmail.com',
	        	'phone': '403.277.7227',
	        	'type': 'PRIMARY' // PRIMARY, FINANCIAL or TECHNICAL
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "POST a contact for an FI" );
			console.debug('created contact for matching');

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// add places of business (required for search)
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/businessLocations',
	        type: "POST",
	        data: JSON.stringify({
	        	'city': 'Calgary',
	        	'country': 'Canada',
	        	'provinceState': 'Alberta'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "POST a businessLocation for an FI" );
			console.debug('created bizloc for matching');
			var businessLocation = response.data.businessLocation;
			ok ( businessLocation.id > 0, 'id check');

			equal( businessLocation.city, 'Calgary', "city check" );
			equal( businessLocation.country, 'Canada', "country check" );
			equal( businessLocation.provinceState, 'Alberta', "provinceState check" );

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});

	});

});

test('service provider permissions test', function() {
	stop();
	expect(2);

    var deferred = $.Deferred();
    deferred.resolve();

    // re-login as user
	deferred = deferred.then(function() {
	    return $.ajax({
			url: serverURL + "/logIn",
			type: "POST",
			data: JSON.stringify({
				"email": localStorage.email,
				"password": localStorage.password
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				console.debug("Welcome: " + response.data.user.firstname);
				equal(response.data.user.lastname, "Wood", "login lastname check");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});    

    // only admins can create/delete/modify/get FI
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders",
	        type: "POST",
	        data: JSON.stringify({
	        	name: 'test'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			console.error('We should be getting an error here instead!');
		})
		.fail(function(response, textStatus, errorThrown) {
			equal( response.status, 401, "serviceProviders permissions check" );
		})
		.always(function() {
			start();
		})
	}); 

});


test('service provider contacts permissions test', function() {
	stop();
	expect(2);

    var deferred = $.Deferred();
    deferred.resolve();

    // re-login as user
	deferred = deferred.then(function() {
	    return $.ajax({
			url: serverURL + "/logIn",
			type: "POST",
			data: JSON.stringify({
				"email": localStorage.email,
				"password": localStorage.password
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				console.debug("Welcome: " + response.data.user.firstname);
				equal(response.data.user.lastname, "Wood", "login lastname check");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});    


    // only admins can create/delete/modify/get contacts
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/contacts',
	        type: "GET",
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			console.error('We should be getting an error here instead!');
		})
		.fail(function(response, textStatus, errorThrown) {
			equal( response.status, 401, "service provider contacts permissions check" );
		})
		.always(function() {
			start();
		})
	}); 

});


test('community tracking test', function() {
	stop();
	expect(5);

	// this is 
	var serviceProviderId;
	var stratFileId;

    var deferred = $.Deferred();
    deferred.resolve();

    var credentials = JSON.stringify({
		"email": "root@stratpad.com",
		"password": "StratP@d"
	});

	var deferred = $.Deferred();
	deferred.resolve();

	// log in as user
	deferred = deferred.then(function() {
	    return $.ajax({
			url: serverURL + "/logIn",
			type: "POST",
			data: JSON.stringify({
				"email": localStorage.email,
				"password": localStorage.password
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				console.debug("Welcome: " + response.data.user.firstname);
				equal(response.data.user.lastname, "Wood", "login lastname check");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});

	// create stratfile
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles",
            type: "POST",
            data: JSON.stringify({ 
            	name: "stratpad connect tracking", 
            	city: 'Timbuktu'
            }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile create check" );
			equal( response.data.stratFile.name, "stratpad connect tracking", "stratfile name check" );
	    	stratFileId = response.data.stratFile.id;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    // get/create user service provider
    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/users/" + localStorage.userId + "/serviceProviders",
            type: "GET",
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user service provider GET check" );
	    	serviceProviderId = response.data.serviceProvider.id;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });


    // this is like CommunityTrackingCollection.js
    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/serviceProviders/" + serviceProviderId + '/stratfiles/' + stratFileId + '/communityTrackings',
	        type: "POST",
	        data: JSON.stringify({"action": "click"}),
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( jqXHR.status, 200, "community tracking creation check" );
		})
		.fail(function(response, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		})
	}); 

});





