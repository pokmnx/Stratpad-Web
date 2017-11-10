test("sign back in", function() {
	stop();
	expect(1);

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
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});


test("change password - too short", function() {
	stop();
	expect(1);

	console.debug("Using " + localStorage.email + " for auth.");

	var newPassword = "asdas";

	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		dataType: 'json',
		data: JSON.stringify({
			"email": localStorage.email,
			"oldPassword": localStorage.password,
			"newPassword": newPassword
		}),
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("Should have failed with an insecure password.");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			var errors = (((jqXHR || {}).responseJSON || {}).data || {}).validations;
			var messageKey = errors && errors.length ? (errors[0].validationError || 'login.unknownError') : 'login.unknownError';
			equal(messageKey, 'PASSWORD_TOO_SHORT');
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("change password", function() {
	stop();
	expect(1);

	console.debug("Using " + localStorage.email + " for auth.");

	var newPassword = "asdasd!";

	$.ajax({
		url: serverURL + "/changePassword",
		type: "POST",
		dataType: 'json',
		data: JSON.stringify({
			"email": localStorage.email,
			"oldPassword": localStorage.password,
			"newPassword": newPassword
		}),
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			// nb. the session stays valid
			equal(response.status, "success", "change password check");
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