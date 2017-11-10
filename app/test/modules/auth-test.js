// created and reused by various tests; must run tests in order
// a module should be able to run independent of other modules, as long as the auth module has run
// just remember this will work in Safari if loaded as file://, but not in other browsers (origin will be null and fail CORS)
test("passwordgen test", function() {
	stop();
	expect(2);

	// anonymous REST
	$.ajax({
		url: serverURL + "/generatePassword",
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "HTTP status test");
			ok(response.password.length >= 6, "Check password length");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

test("signUp test", function() {
	stop();
	expect(2);

	// create the user, and keep it around for other tests and modules to use, until we run auth again
	localStorage.firstname = "Julian" + new Date().getTime();
	localStorage.lastname = "Wood";
	localStorage.fullname = sprintf('%s %s', localStorage.firstname, localStorage.lastname);
	localStorage.email = localStorage.firstname.toLowerCase() + "@mobilesce.com";
	localStorage.password = "asdasd!";

	console.debug(sprintf("Created <%s> \"%s\" for suite-wide auth.", localStorage.fullname, localStorage.email));

	// curl -X POST -H "Content-Type: application/json" -d '{ "email" : "alex@stratpad.com", "firstname" : "Alex", "lastname": "Glassey", "password" : "asdasd", "passwordConfirmation" : "asdasd" }' -i https://jstratpad.appspot.com/signUp

	var credentials = JSON.stringify({
		"email": localStorage.email,
		"firstname": localStorage.firstname,
		"lastname": localStorage.lastname,
		"password": localStorage.password,
		"passwordConfirmation": localStorage.password
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.debug("Signed up: " + response.data.user.firstname);
			equal(response.data.user.email, localStorage.email, "signUp email check");
			equal(response.data.user.preferredCurrency, "$", "preferred currency check");

			localStorage.userId = response.data.user.id;

            // Verify the user so that he can log in.
            var credentials = {
                "email": localStorage.email,
                "verificationToken": response.data.user.verificationToken
        	};
            $.ajax({
                url: serverURL + "/verifyUser",
                type: "GET",
                data: credentials,
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            })
				.done(function(response, textStatus, jqXHR) {
        			// the problem here is that we get a 302 redirect from the server, no matter what
        			// the browser handles the redirect transparently, so we don't get a chance to evaluate the response
        			// easy enough to confirm using a signup and verify process in curl
        			// curl -X POST -H "Content-Type: application/json" -d '{ "email" : "kim@stratpad.com", "firstname" : "Alex", "lastname" : "Glassey", "password" : "asdasd!", "passwordConfirmation" : "asdasd!" }' -i https://jstratpad.appspot.com/signUp
        			// curl -i "https://jstratpad.appspot.com/verifyUser?email=kim@stratpad.com&verificationToken=c1c709f920c2da5368776d6f638cf68413656150"
				})            
        		.always(function() {
        			start();
        		})
   		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		});
});

test("signUp validation test - email", function() {
	stop();
	expect(4);

	// all required
	// email format doesn't matter because it needs email validation
	// password should be 5 chars, with at least 1 alphanumeric, at least one non-alphanumeric
	// pass and confirm must match

	var credentials = JSON.stringify({
		"firstname": "some",
		"lastname": "lastname",
		"password": "apass!",
		"passwordConfirmation": "apass!"
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "HTTP status test");
			equal(jqXHR.responseJSON.status, "fail", "should fail to signup because of a missing email field");
			equal(jqXHR.responseJSON.data.validations.length, 1, "should be 1 failed validation");
			equal(jqXHR.responseJSON.data.validations[0].field, "email", "missing email validation check");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("signUp validation test - firstname, lastName", function() {
	stop();
	expect(4);

	var credentials = JSON.stringify({
		"email": "some.email@example.com",
		"password": "apass!",
		"passwordConfirmation": "apass!"
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "HTTP status test");
			equal(jqXHR.responseJSON.status, "fail", "missing names check");
			equal(jqXHR.responseJSON.data.validations.length, 1, "missing names length check");
			equal(jqXHR.responseJSON.data.validations[0].field, "firstname", "missing firstname field check");
			// equal(jqXHR.responseJSON.data.validations[1].field, "lastname", "missing lastname field check");
			// equal(jqXHR.responseJSON.data.validations[2].field, "password", "password based on dictionary word field check");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("signUp validation test - missing password", function() {
	stop();
	expect(5);

	var credentials = JSON.stringify({
		"email": "some.email@example.com",
		"firstname": "some",
		"lastname": "lastname",
		"password": "",
		"passwordConfirmation": "apass"
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "HTTP status test");
			equal(jqXHR.responseJSON.status, "fail", "missing password status check");
			equal(jqXHR.responseJSON.data.validations.length, 2, "missing password validations length check");
			equal(jqXHR.responseJSON.data.validations[0].field, "password", "missing password required check");
			equal(jqXHR.responseJSON.data.validations[1].field, "passwordConfirmation", "matching password field check");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("signUp validation test - password too short", function() {
	stop();
	expect(4);

	var credentials = JSON.stringify({
		"email": "some.email@example.com",
		"firstname": "some",
		"lastname": "lastname",
		"password": "a!",
		"passwordConfirmation": "a!"
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "HTTP status test");
			equal(jqXHR.responseJSON.status, "fail", "bad password status check");
			if (jqXHR.responseJSON.data.validations) {
				equal(jqXHR.responseJSON.data.validations.length, 1, "bad password validations length check");
				equal(jqXHR.responseJSON.data.validations[0].field, "password", "bad password field check");
			};
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("signUp validation test - duplicate email", function() {
	stop();
	expect(4);

	var credentials = JSON.stringify({
		"email": localStorage.email,
		"firstname": localStorage.firstname,
		"lastname": localStorage.lastname,
		"password": localStorage.password,
		"passwordConfirmation": localStorage.password
	});
	$.ajax({
		url: serverURL + "/signUp",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 409, "HTTP status test");
			equal(jqXHR.responseJSON.status, "fail", "duplicate email status check");
			equal(jqXHR.responseJSON.data.validations.length, 1, "duplicate email validations length check");
			equal(jqXHR.responseJSON.data.validations[0].field, "email", "duplicate email field check");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});



test("logIn test", function() {
	stop();
	expect(1);

	var credentials = JSON.stringify({
		"email": localStorage.email,
		"password": localStorage.password
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.debug("Welcome: " + response.data.user.firstname);
			equal(response.data.user.lastname, "Wood", "login lastname check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("changePassword test - bad credentials", function() {
	stop();
	expect(1);

	var newPassword = "abc123!";

	var data = JSON.stringify({
		"email": localStorage.email,
		"oldPassword": "wrong",
		"newPassword": newPassword
	});
	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("Should have a validation error");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "changePassword test");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});


test("changePassword test - bad validation", function() {
	stop();
	expect(1);

	var newPassword = "a";

	var data = JSON.stringify({
		"email": localStorage.email,
		"oldPassword": "wrong",
		"newPassword": newPassword
	});
	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("Should have a validation error");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 400, "changePassword test");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("changePassword test", function() {
	stop();
	expect(1);

	var newPassword = "abc123!";

	var data = JSON.stringify({
		"email": localStorage.email,
		"oldPassword": localStorage.password,
		"newPassword": newPassword
	});
	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "changePassword test");
			localStorage.password = newPassword;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("signout test", function() {
	stop();
	expect(3);

	// should be ok
	$.ajax({
		url: serverURL + "/stratfiles",
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(response.status, "success", "stratfiles check");

			$.ajax({
				url: serverURL + "/logOut",
				type: "GET",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
				.done(function(response, textStatus, jqXHR) {
					equal(response.status, "success", "logout check");
					console.debug("Logging out.");

					// now if we're to try and get stratfiles, it should fail
					$.ajax({
						url: serverURL + "/stratfiles",
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
						.done(function(response, textStatus, jqXHR) {
							console.error("Should have received a 401");
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							// make sure server sends back CORS headers even if permission is denied
							ok(jqXHR.status === 401, "signOut check");
							console.debug("Successfully logged out.");
						})
						.always(function() {
							// helps qunit go on its way
							start();
						});

				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.error("%s: %s", textStatus, errorThrown);
					start();
				});

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		});

});

test("changePassword test while signed out", function() {
	stop();
	expect(1);

	var newPassword = "abc123!";

	var data = JSON.stringify({
		"email": localStorage.email,
		"oldPassword": localStorage.password,
		"newPassword": "uhuhuh!"
	});
	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("Should have a permission error");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			ok(jqXHR.status === 401, "changePassword test permission denied");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("root logs in and changes from free to unlimited", function() {
	stop();
	expect(3);

	var credentials = JSON.stringify({
		"email": "root@stratpad.com",
		"password": "StratP@d"
	});

	var user;

	var deferred = $.Deferred();
	deferred.resolve();

	// login
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

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
	});

	// get user
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/users/" + localStorage.userId,
	        type: "GET",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "get user");
			user = response.data.user;

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// modify plan
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/users/" + localStorage.userId,
	        type: "PUT",
	        data: JSON.stringify({
	        	"email": user.email,
				"firstname": user.firstname,
				"ipnProductCode": "com.stratpad.cloud.unlimited",
				"lastname": user.lastname,
				"preferredCurrency": user.preferredCurrency,
				"subscriptionStartDate": user.subscriptionStartDate
			}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "get user");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	    })
		.always(function() {
			start();
		});	    
          
	});

});


test("sign back in", function() {
	stop();
	expect(2);

	// just log back in, for the rest of the 
	var credentials = JSON.stringify({
		"email": localStorage.email,
		"password": localStorage.password
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.debug("Welcome: " + response.data.user.firstname);
			equal(response.data.user.lastname, "Wood", "login lastname check");
			equal(response.data.user.ipnProductCode, "com.stratpad.cloud.unlimited", "login plan check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});


test("user prefs", function() {
	stop();
	expect(15);

    var deferred = $.Deferred();
    deferred.resolve();

    // empty to start
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences',
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs GET check" );
			equal( response.data.userPreferences.length, 0, "user prefs length check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // add a pref
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences',
	        type: "POST",
	        data: JSON.stringify({key: 'community.showAgreement', value: true}),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs GET check" );
			ok( response.data.userPreference.id > 0);
			equal( response.data.userPreference.key, "community.showAgreement" );
			equal( response.data.userPreference.value, "true" ); // NB this is a key:string service
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // add a pref
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences',
	        type: "POST",
	        data: JSON.stringify({key: 'community.lastPage', value: 3}),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs GET check" );
			ok( response.data.userPreference.id > 0);
			equal( response.data.userPreference.value, "3" ); // NB this is a key:string service
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // add a pref
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences',
	        type: "POST",
	        data: JSON.stringify({key: 'community.email', value: "woodj"}),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs GET check" );
			ok( response.data.userPreference.id > 0);
			equal( response.data.userPreference.value, "woodj" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // delete a pref
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences/' + response.data.userPreference.id,
	        type: "DELETE",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs DELETE check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

    // get all prefs
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + "/users/" + localStorage.userId + '/preferences',
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "user prefs GET check" );
			equal( response.data.userPreferences.length, 2, "user prefs length check" );
			start();
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

});

// self contained free trial date calcs
test("free trial expiry dates", function() {
	stop();
	expect(4);

	var self = this;
	this.localizable = {};
	this.localizable.get = function(key) {
		var dict = {
			'days': 'days',
			'day': 'day',
			'trialRemainingReminder': '%s %s left. Click to upgrade!',
			'lastTrialDayReminder': 'Last day! Click to upgrade!',
			'trialExpired': 'Free trial expired. Click to upgrade.'			
		}
		return dict[key];
	}

	var getMessage = function(date, trialEndDate) {
	    var remaining = trialEndDate.diff(date, 'days');
		if (trialEndDate.isAfter(date)) {
			var daysMessage = remaining > 1 ? self.localizable.get('days') : self.localizable.get('day');
			return remaining ? sprintf(self.localizable.get('trialRemainingReminder'), remaining, daysMessage) : self.localizable.get('lastTrialDayReminder');
		} else {
			return self.localizable.get('trialExpired');
		}
	}

	var subscriptionStartDate = moment("2010-10-20 4:30", "YYYY-MM-DD HH:mm"); // local time
    var trialEndDate = moment(subscriptionStartDate).endOf('day').add('days', 7);

    var testDate = moment("2010-10-22 4:45", "YYYY-MM-DD HH:mm");
	equal (getMessage(testDate, trialEndDate), '5 days left. Click to upgrade!', 'Message check');

    var testDate = moment("2010-10-26 4:45", "YYYY-MM-DD HH:mm");
	equal (getMessage(testDate, trialEndDate), '1 day left. Click to upgrade!', 'Message check');

	// technically after 7 full days, but before midnight on that 7th day
    var testDate = moment("2010-10-27 4:45", "YYYY-MM-DD HH:mm");
	equal (getMessage(testDate, trialEndDate), 'Last day! Click to upgrade!', 'Message check');

	// after midnight - server is actually set to 8 days, client will kick 24 hours after last login; we should have a message just to be safe
    var testDate = moment("2010-10-28 00:45", "YYYY-MM-DD HH:mm");
	equal (getMessage(testDate, trialEndDate), 'Free trial expired. Click to upgrade.', 'Message check');

	start();

});
