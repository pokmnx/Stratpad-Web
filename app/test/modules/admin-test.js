// use cases

// login as root user
// create a user
// login as that user
// login as root
// modify user
// delete user

"use strict";

var email, password, user;

test("root logs in", function() {
	stop();
	expect(1);

	var credentials = JSON.stringify({
		"email": "root@stratpad.com",
		"password": "StratP@d"
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "admin logIn");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});
});

test("root creates new user", function() {
	stop();
	expect(5);

	var firstname = "Julian" + new Date().getTime();
	var lastname = 'Wood';
	email = firstname.toLowerCase() + "@mobilesce.com";
	password = "asdasd!";

	var data = JSON.stringify({
		"firstname": firstname,
		"lastname": lastname,
		"email": email,
		"password": password,
		"passwordConfirmation": password
	});
	$.ajax({
		url: serverURL + "/users",
		type: "POST",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "create user");
			equal(response.status, "success", "create user");
			equal(response.data.user.email, email);
			equal(response.data.user.firstname, firstname);
			equal(response.data.user.lastname, lastname);

			user = response.data.user;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("new user logs in", function() {
	stop();
	expect(3);

	var credentials = JSON.stringify({
		"email": email,
		"password": password,
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "logIn");
			equal(response.status, "success", "logIn");

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

test("new user modifies himself", function() {
	stop();
	expect(6);

	// nb you don't need to send all properties on a PUT
	var data = JSON.stringify({
		"firstname": "Julian",
		"lastname": "Wood",
		"email": email,
		"preferredCurrency": "€"
	});
	$.ajax({
		url: serverURL + "/users/" + user.id,
		type: "PUT",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "modify user");
			equal(response.status, "success", "modify user");
			equal(response.data.user.firstname, "Julian", "changed firstname");
			equal(response.data.user.lastname, "Wood", "changed lastname");
			equal(response.data.user.preferredCurrency, "€", "changed preferredCurrency");

			// changing the email sends an email for verification before actually changing it
            // TODO: Anyway, for now a user cannot change his email.
			equal(response.data.user.email, email, "changed email");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("root logs in", function() {
	stop();
	expect(1);

	var credentials = JSON.stringify({
		"email": "root@stratpad.com",
		"password": "StratP@d"
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "admin logIn");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});
});


test("root modifies new user", function() {
	stop();
	expect(5);

	email = email.replace('mobilesce', 'roundetable');

	_.extend(user, {
		"firstname": "Jennifer",
		"lastname": "Wood",
		"email": email
	});

	var data = JSON.stringify(user);
	$.ajax({
		url: serverURL + "/users/" + user.id,
		type: "PUT",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "modify user");
			equal(response.status, "success", "modify user");
			equal(response.data.user.firstname, "Jennifer", "changed firstname");
			equal(response.data.user.lastname, "Wood", "changed lastname");

			// changing the email happens instantly
			// user becomes unverified and is sent an email for verification
			equal(response.data.user.email, email, "changed email");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("root modifies new user's password", function() {
	stop();
	expect(5);

	var newPassword = "v3raom!!";

	_.extend(user, {
		"firstname": "Julian",
		"lastname": "Wood",
		"email": email,
		"password": newPassword,
		"passwordConfirmation": newPassword
	});

	var data = JSON.stringify(user);
	$.ajax({
		url: serverURL + "/users/" + user.id,
		type: "PUT",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "modify user");
			equal(response.status, "success", "modify user");
			equal(response.data.user.email, email);
			equal(response.data.user.firstname, "Julian");
			equal(response.data.user.lastname, "Wood");
            email = response.data.user.email;
			password = newPassword;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("new user with new password can't login until verified", function() {
	stop();
	expect(1);

	var credentials = JSON.stringify({
		"email": email,
		"password": password,
	});
	$.ajax({
		url: serverURL + "/logIn",
		type: "POST",
		data: credentials,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			console.error("new user shouldn't be able to login until they are verified")
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 401, "logIn should fail");
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("root verifies new user", function() {
	// curl -X POST -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=qKssz37Bmy0R8Ob5q3xgUg;Path=/;Expires=Sat, 12-Oct-13 20:20:22 GMT;Path=/' -i -d '{ "email" : "julian@stratpad.com", "verificationToken": "fake" }' "https://jstratpad.appspot.com/verifyUser
	stop();
	expect(2);

	var data = {
		"email": email,
		"verificationToken": "stratpad" // ignored when admin
	};
	$.ajax({
		url: serverURL + "/verifyUser",
		type: "GET",
		data: data,
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
            equal(jqXHR.status, 200, "verify user");
			equal(response.status, "success", "verify user");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("admin gets 200 or 4xx status codes when verifying users (not a 302, like regular users)");
		})
		.always(function() {
			start();
		});

});

test("root deletes new user", function() {
	stop();
	expect(2);

	$.ajax({
		url: serverURL + "/users/" + user.id,
		type: "DELETE",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "delete user");
			equal(response.status, "success", "delete user");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});