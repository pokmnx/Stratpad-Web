// created and reused by various tests; must run tests in order
// a module should be able to run independent of other modules, as long as the auth module has run
// just remember this will work in Safari if loaded as file://, but not in other browsers (origin will be null and fail CORS)
var stratFileId;
var themeId;
var objectiveId;
var activityId;
var metricId;
var lastUuid;
var lastAccessDate;

////////////////////////////////////

module("stratfiles");
test( "fetch stratfiles test", function() {
	
	stop();
	expect(1);

	// curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=a-CG4J5sMDoHBRHzYfs77A;Path=/' -X GET -i https://jstratpad.appspot.com/stratfiles
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfiles check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "create stratfile test", function() {
	stop();
	expect(5);

	// curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=a-CG4J5sMDoHBRHzYfs77A;Path=/' -X POST -i -d '{ "name" : "Qunit stratfile", "uuid": "asdqweasddaccxz" }' https://jstratpad.appspot.com/stratfiles
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Qunit stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile creation check" );
		equal( response.data.stratFile.creationDate, response.data.stratFile.modificationDate, "date check 1" );
		equal( response.data.stratFile.creationDate, response.data.stratFile.lastAccessDate, "date check 2" );
		ok ( response.data.stratFile.id > 0, "id check");
		ok ( response.data.stratFile.userId > 0, "userid check");
		stratFileId = response.data.stratFile.id;
		lastUuid = response.data.stratFile.uuid;
		lastAccessDate = response.data.stratFile.lastAccessDate;
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "modify stratfile test", function() {
	stop();
	expect(5);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "PUT",
        data: JSON.stringify({ city: "Calgary" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile modify check" );
		notEqual( response.data.stratFile.creationDate, response.data.stratFile.modificationDate, "stratfile mod date check" );
		equal( response.data.stratFile.lastAccessDate, response.data.stratFile.modificationDate, "stratfile access date check" );
		equal( response.data.stratFile.city, "Calgary", "stratfile city check" );
		
		// because PUT is idempotent, we lose the name
		equal( response.data.stratFile.name, null, "stratfile name check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "get stratfile test", function() {
	stop();
	expect(2);

	// curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=a-CG4J5sMDoHBRHzYfs77A;Path=/' -i https://jstratpad.appspot.com/stratfiles/3001
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile get check" );
		notEqual( response.data.stratFile.lastAccessDate, response.data.stratFile.modificationDate, "stratfile access date check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "clone stratfile test", function() {
	stop();
	expect(6);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/clone",
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile get check" );

		notEqual( response.data.stratFile.id, stratFileId);
		notEqual( response.data.stratFile.uuid, lastUuid);
		notEqual( response.data.stratFile.lastAccessDate, lastAccessDate);
		ok( response.data.stratFile.name.match(/copy$/) );

		var cloneId = response.data.stratFile.id;

	    $.ajax({
	        url: serverURL + "/stratfiles/" + cloneId,
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile delete check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});


test( "delete stratfile test", function() {
	stop();
	expect(1);

	// curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=a-CG4J5sMDoHBRHzYfs77A;Path=/' -i https://jstratpad.appspot.com/stratfiles/3001
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile delete check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "verify delete stratfile test", function() {
	stop();
	expect(1);

	// curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=a-CG4J5sMDoHBRHzYfs77A;Path=/' -i https://jstratpad.appspot.com/stratfiles/3001
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		equal( jqXHR.status, 404, "Stratfile not found (as  expected)");
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


/////////////////////////////////////

// this is actually an alias to /stratfiles, but this way we can model /stratfileInfos in backbone, and not trigger an avalanche of events when somebody changes an F1 field

test('stratfileinfo test', function() {
	stop();
	expect(11);

    var deferred = $.Deferred();
    deferred.resolve();

    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles",
            type: "POST",
            data: JSON.stringify({ name: "stratfileinfo", city: 'Kalamazoo' }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile create check" );
			equal( response.data.stratFile.name, "stratfileinfo", "stratfile name check" );
			equal( response.data.stratFile.city, "Kalamazoo", "stratfile city check" );
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
        });             
    });

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfileInfos/" + response.data.stratFile.id,
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfileinfo get check" );
			equal( response.data.stratFile.name, "stratfileinfo", "stratfile name check" );
			equal( response.data.stratFile.city, "Kalamazoo", "stratfile city check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfileInfos/" + response.data.stratFile.id,
	        type: "PUT",
	        data: JSON.stringify({ companyName: 'StratPad Inc.'}),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfileinfo get check" );
			equal( response.data.stratFile.companyName, "StratPad Inc.", "stratfile company check" );		
			// NB we lose these fields because we didn't PUT them	
			ok( response.data.stratFile.hasOwnProperty('name') == false, "stratfile name check" );
			ok( response.data.stratFile.hasOwnProperty('city')== false, "stratfile city check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + response.data.stratFile.id,
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


////////////////////////////////////

test('discussion test', function() {
	stop();
	expect(17);

	var stratFileId;
    var deferred = $.Deferred();
    deferred.resolve();

    deferred = deferred.then(function() {
        return $.ajax({
            url: serverURL + "/stratfiles",
            type: "POST",
            data: JSON.stringify({ name: "stratfile discussion", city: 'Kalamazoo' }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        })
        .done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile create check" );
			equal( response.data.stratFile.name, "stratfile discussion", "stratfile name check" );
	    	stratFileId = response.data.stratFile.id;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error(sprintf("%s: %s", textStatus, errorThrown));
            start();
        });             
    });

    deferred = deferred.then(function() {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/discussions',
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "discussions get check" );
			// we just get a single, empty discussion object after stratfile create
			ok ( response.data.discussion.id > 0, 'id check');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/discussions/' + response.data.discussion.id,
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "discussions get check" );
			// we just get a single, empty discussion object after stratfile create
			ok ( response.data.discussion.id > 0, 'id check');			
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

    deferred = deferred.then(function(response) {
    	return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + '/discussions/' + response.data.discussion.id,
	        type: "PUT",
	        data: JSON.stringify({
			    'customersDescription': 'cd',
			    'keyProblems': 'kp',
			    'addressProblems': 'ap',
			    'competitorsDescription': 'cd',
			    'businessModelDescription': 'bmd',
			    'expansionOptionsDescription': 'eod',
			    'ultimateAspiration': 'ua',
			    'mediumTermStrategicGoal': 'mtsg'
	        }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "discussions get check" );
			var discussion = response.data.discussion;
			ok ( discussion.id > 0, 'id check');
			equal( discussion.customersDescription, 'cd', "discussions.cd check" );
			equal( discussion.keyProblems, 'kp', "discussions.kp check" );
			equal( discussion.addressProblems, 'ap', "discussions.ap check" );
			equal( discussion.competitorsDescription, 'cd', "discussions.cd check" );
			equal( discussion.businessModelDescription, 'bmd', "discussions.bmd check" );
			equal( discussion.expansionOptionsDescription, 'eod', "discussions.eod check" );
			equal( discussion.ultimateAspiration, 'ua', "discussions.ua check" );
			equal( discussion.mediumTermStrategicGoal, 'mtsg', "discussions.mtsg check" );

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});
	});	

	// would never DELETE a Discussion

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




////////////////////////////////////

module("themes");
test( "themes test", function() {
	stop();
	expect(2);

	// create a stratfile
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Qunit stratfile for themes test", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileId = response.data.stratFile.id;

		// check number of themes in new stratfile
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "themes check" );
			equal( response.data.themes.length, 0, "theme length check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});


test( "create theme test", function() {
	stop();
	expect(7);

	// add a theme to our stratfile
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
        type: "POST",
        data: JSON.stringify({ name: "A Great Theme", responsible: "Julian" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "theme creation check" );
		equal( response.data.theme.name, "A Great Theme", "theme name check" );
		equal( response.data.theme.responsible, "Julian", "theme responsible check" );
		ok ( response.data.theme.id > 0, "id check");
		ok ( response.data.theme.userId > 0, "userid check");

		themeId = response.data.theme.id;

		// check number of themes in stratfile
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "themes check" );
			equal( response.data.themes.length, 1, "theme length check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "modify theme test", function() {
	stop();
	expect(3);

	// modify theme
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes/" + themeId,
        type: "PUT",
        data: JSON.stringify({ name: "The Greatest Theme" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "theme mod check" );
		equal( response.data.theme.name, "The Greatest Theme", "theme name check" );

		// because PUT is idempotent, we lose the name
		equal( response.data.theme.responsible, null, "theme responsible check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "theme seasonal adjustments test", function() {
	stop();
	expect(2);

	// modify theme
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes/" + themeId,
        type: "PUT",
        data: JSON.stringify({ name: "The Greatest Theme", seasonalRevenueAdjustments: [0, 2, 4.3, 6.5] }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "theme mod check" );
		equal( response.data.theme.seasonalRevenueAdjustments[1], 2, "seasonalRevenueAdjustments check" );

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


test( "delete theme test", function() {
	stop();
	expect(3);

	// delete theme from stratfile
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes/" + themeId,
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "theme delete check" );

		// check number of themes in stratfile
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "themes check" );
			equal( response.data.themes.length, 0, "theme length check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "delete stratfile cascade test", function() {
	stop();
	expect(3);

	// create theme
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
        type: "POST",
        data: JSON.stringify({ name: "This theme should get deleted by cascade." }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "theme create check" );
		var themeId = response.data.theme.id;

		// delete stratfile
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "stratfile delete check" );

			// check that theme is gone
		    $.ajax({
		        url: serverURL + "/stratfiles/" + stratFileId + "/themes/" + themeId,
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				equal( jqXHR.status, 404, "Stratfile not found (as  expected)");
			})
			.always(function() {
				// helps qunit go on its way
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});


////////////////////////////////////

module("objectives");
test( "create", function() {
	stop();
	expect(2);

	// create stratfile
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Objective stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileId = response.data.stratFile.id;
		
		// create theme
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "POST",
	        data: JSON.stringify({ name: "Objective Theme" }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {

			themeId = response.data.theme.id;

			// create objective
		    $.ajax({
		        url: sprintf("%s/stratfiles/%s/themes/%s/objectives", serverURL, stratFileId, themeId),
		        type: "POST",
		        data: JSON.stringify({ summary: "A clever Qunit objective" }),
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "objective creation check" );
				ok( response.data.objective.id > 0, "id check");

				objectiveId = response.data.objective.id;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error(sprintf("%s: %s", textStatus, errorThrown));
			})
			.always(function() {
				// helps qunit go on its way
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});


});

test( "get", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s", serverURL, stratFileId, themeId, objectiveId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		equal( response.status, "success", "objective creation check" );
		equal( response.data.objective.summary,  "A clever Qunit objective", "summary check");
		equal( response.data.objective.stratFileId,  stratFileId, "stratFile parent check");
		equal( response.data.objective.themeId,  themeId, "theme parent check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "modify", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s", serverURL, stratFileId, themeId, objectiveId),
        type: "PUT",
        data: JSON.stringify({ reviewFrequency: "WEEKLY", type: "COMMUNITY" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		equal( response.status, "success", "objective creation check" );

		// because PUT is idempotent, we lose the name
		equal( response.data.objective.summary, null, "summary check");

		// can set enums either by capitalized string or by index, but it always comes back as capitalized string
		equal( response.data.objective.reviewFrequency, "WEEKLY", "reviewFrequency check");
		equal( response.data.objective.type, "COMMUNITY", "type check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "delete", function() {
	stop();
	expect(3);

	// delete theme from stratfile
    $.ajax({
        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s", serverURL, stratFileId, themeId, objectiveId),
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "objective delete check" );

		// check number of objectives in theme
	    $.ajax({
	        url: sprintf("%s/stratfiles/%s/themes/%s/objectives", serverURL, stratFileId, themeId),
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "objectives check" );
			equal( response.data.objectives.length, 0, "objectives length check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "cleanup", function() {
	stop();
	expect(1);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "cleanup check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

////////////////////////////////////

module("metrics and activities");
test( "setup test", function() {
	stop();
	expect(1);

	// create stratfile
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Objective stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileId = response.data.stratFile.id;
		
		// create theme
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "POST",
	        data: JSON.stringify({ name: "Objective Theme" }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {

			themeId = response.data.theme.id;

			// create objective
		    $.ajax({
		        url: sprintf("%s/stratfiles/%s/themes/%s/objectives", serverURL, stratFileId, themeId),
		        type: "POST",
		        data: JSON.stringify({ summary: "A clever Qunit objective", type: 'FINANCIAL' }),
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				objectiveId = response.data.objective.id;
				equal( response.status, "success", "create stratfile with objective check" );

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error(sprintf("%s: %s", textStatus, errorThrown));
			})
			.always(function() {
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "create activity", function() {
	stop();
	expect(3);

	// create activity
	$.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities", serverURL, stratFileId, themeId, objectiveId),
	    type: "POST",
	    data: JSON.stringify({ action: "Our first activity" }),
	    dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		
		equal( response.status, "success", "activity create check" );
		activityId = response.data.activity.id;
		ok( activityId > 0, "activity id check");
		equal( response.data.activity.expenseType, 'GENERAL_AND_ADMINISTRATIVE', "expenseType default value check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		start();
	});

});

test( "modify activity", function() {
	stop();
	expect(6);

	$.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities/%s", serverURL, stratFileId, themeId, objectiveId, activityId),
	    type: "PUT",
	    data: JSON.stringify({ ongoingFrequency: "MONTHLY", upfrontCost: 10000, expenseType:'RESEARCH_AND_DEVELOPMENT', startDate: 20081225 }),
	    dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		
		equal( response.status, "success", "activity modify check" );

		// because PUT is idempotent, we lose the name
		equal( response.data.activity.action, null, "action check");

		// can set enums either by capitalized string or by index, but it always comes back as capitalized string
		equal( response.data.activity.ongoingFrequency, "MONTHLY", "ongoingFrequency check");
		equal( response.data.activity.upfrontCost, 10000, "upFrontCost check");
		equal( response.data.activity.startDate, 20081225, "startDate check");
		equal( response.data.activity.expenseType, 'RESEARCH_AND_DEVELOPMENT', "expenseType value check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		start();
	});

});

test( "delete activity", function() {
	stop();
	expect(5);

	// check number of activities in objective
    $.ajax({
        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities", serverURL, stratFileId, themeId, objectiveId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "activities check" );
		equal( response.data.activities.length, 1, "activities length check");

		// delete activity from objective
	    $.ajax({
	        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities/%s", serverURL, stratFileId, themeId, objectiveId, activityId),
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "activity delete check" );

			// check number of activities in objective
		    $.ajax({
		        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities", serverURL, stratFileId, themeId, objectiveId),
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "activities recheck" );
				equal( response.data.activities.length, 0, "activities length recheck");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error(sprintf("%s: %s", textStatus, errorThrown));
			})
			.always(function() {
				// helps qunit go on its way
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});


test( "create metric", function() {
	stop();
	expect(2);

	$.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics", serverURL, stratFileId, themeId, objectiveId),
	    type: "POST",
	    data: JSON.stringify({ summary: "Our first metric" }),
	    dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		
		equal( response.status, "success", "metric create check" );
		metricId = response.data.metric.id;
		ok( metricId > 0, "Metric id check");
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		start();
	});

});

test( "modify metric", function() {
	stop();
	expect(5);

	$.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics/%s", serverURL, stratFileId, themeId, objectiveId, metricId),
	    type: "PUT",
	    data: JSON.stringify({ successIndicator: 1, targetValue: "20000", targetDate: 20091031 }),
	    dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		
		equal( response.status, "success", "metric modify check" );

		// because PUT is idempotent, we lose the name
		equal( response.data.metric.summary, null, "summary check");

		// can set enums either by capitalized string or by index, but it always comes back as capitalized string
		equal( response.data.metric.successIndicator, "MEET_OR_SUBCEDE", "successIndicator check");
		equal( response.data.metric.targetValue, 20000, "targetValue check");
		equal( response.data.metric.targetDate, 20091031, "targetDate check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		start();
	});

});

test( "modify metric 2", function() {
	stop();
	expect(2);

	$.ajax({
		url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics/%s", serverURL, stratFileId, themeId, objectiveId, metricId),
		type: "PUT",
		data: JSON.stringify({
			summary: 'What!!!!',
			// our real backbone objects often have metrics and metricCollection attached - should be ignored - they are just for convenience
			"metrics": [{
				"summary": "Cumulative revenue",
				"targetDate": 20120930,
				"targetValue": "480000",
				"creationDate": 1386724097452,
				"modificationDate": 1388782796280,
				"id": 5135758415364096
			}],
			"metricCollection": [{
				"summary": "Cumulative revenue",
				"targetDate": 20120930,
				"targetValue": "480000",
				"creationDate": 1386724097452,
				"modificationDate": 1388782796280,
				"id": 5135758415364096,
				"stratFileId": 6314434880339968,
				"themeId": 6085736461762560,
				"objectiveId": 5698708368785408
			}]
		}),
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {

			equal(response.status, "success", "metric modify check");

			equal(response.data.metric.summary, 'What!!!!', "summary check");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});
});

test( "get metric", function() {
	stop();
	expect(2);

	$.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics/%s", serverURL, stratFileId, themeId, objectiveId, metricId),
	    type: "GET",
	    dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		
		equal( response.status, "success", "metric GET check" );

		equal( response.data.metric.summary, 'What!!!!', "summary check");

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		start();
	});

});



test( "delete metric", function() {
	stop();
	expect(5);

	// check number of metrics in objective
    $.ajax({
        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics", serverURL, stratFileId, themeId, objectiveId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "metrics check" );
		equal( response.data.metrics.length, 1, "metrics length check");

		// delete metric from objective
	    $.ajax({
	        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics/%s", serverURL, stratFileId, themeId, objectiveId, metricId),
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "metric delete check" );

			// check number of metrics in objective
		    $.ajax({
		        url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics", serverURL, stratFileId, themeId, objectiveId),
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "metrics recheck" );
				equal( response.data.metrics.length, 0, "metrics length recheck");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error(sprintf("%s: %s", textStatus, errorThrown));
			})
			.always(function() {
				// helps qunit go on its way
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "cleanup", function() {
	stop();
	expect(1);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "cleanup check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});




////////////////////////////////////

// access dates

module("lastAccessDate");

////////////////////////////////////

test( "create stratFile for lastAccessDate", function() {
	stop();
	expect(1);

	// create stratfile
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Objective stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileId = response.data.stratFile.id;
		lastAccessDate = response.data.stratFile.lastAccessDate;
		
		// create theme
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "POST",
	        data: JSON.stringify({ name: "Objective Theme" }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {

			themeId = response.data.theme.id;

			// create objective
		    $.ajax({
		        url: sprintf("%s/stratfiles/%s/themes/%s/objectives", serverURL, stratFileId, themeId),
		        type: "POST",
		        data: JSON.stringify({ summary: "A clever Qunit objective", type: 'FINANCIAL' }),
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "create stratfile for lastAccessDate check" );
				objectiveId = response.data.objective.id;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error(sprintf("%s: %s", textStatus, errorThrown));
			})
			.always(function() {
				start();
			});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "themes lastAccessDate", function() {
	stop();
	expect(2);

	// access themes
    $.ajax({
        url: sprintf('%s/stratfiles/%s/themes', serverURL, stratFileId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// now get the stratfile and see if the lastAccessDate changed
	    $.ajax({
	        url: sprintf('%s/stratfiles/%s', serverURL, stratFileId),
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			
			equal( response.status, "success", "cleanup check" );
			notEqual( response.data.stratFile.lastAccessDate, lastAccessDate);

			lastAccessDate = response.data.stratFile.lastAccessDate;

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});


	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "objectives lastAccessDate", function() {
	stop();
	expect(2);

	// access objectives
    $.ajax({
        url: sprintf('%s/stratfiles/%s/themes/%s/objectives', serverURL, stratFileId, themeId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// now get the stratfile and see if the lastAccessDate changed
	    $.ajax({
	        url: sprintf('%s/stratfiles/%s', serverURL, stratFileId),
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			
			equal( response.status, "success", "cleanup check" );
			notEqual( response.data.stratFile.lastAccessDate, lastAccessDate);

			lastAccessDate = response.data.stratFile.lastAccessDate;

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});


	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "activities lastAccessDate", function() {
	stop();
	expect(2);

	// access activities
    $.ajax({
        url: sprintf('%s/stratfiles/%s/themes/%s/objectives/%s/activities', serverURL, stratFileId, themeId, objectiveId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// now get the stratfile and see if the lastAccessDate changed
	    $.ajax({
	        url: sprintf('%s/stratfiles/%s', serverURL, stratFileId),
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			
			equal( response.status, "success", "cleanup check" );
			ok( lastAccessDate < response.data.stratFile.lastAccessDate );

			lastAccessDate = response.data.stratFile.lastAccessDate;

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "reports lastAccessDate", function() {
	stop();
	expect(2);

	// access activities
    $.ajax({
		url: serverURL + "/reports/themedetail?id=" + stratFileId,
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// now get the stratfile and see if the lastAccessDate changed
	    $.ajax({
	        url: sprintf('%s/stratfiles/%s', serverURL, stratFileId),
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			
			equal( response.status, "success", "cleanup check" );
			ok( lastAccessDate < response.data.stratFile.lastAccessDate );

			lastAccessDate = response.data.stratFile.lastAccessDate;

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
		})
		.always(function() {
			start();
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "cleanup", function() {
	stop();
	expect(1);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId,
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "cleanup check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});




// User entity is tested in admin-test.js




