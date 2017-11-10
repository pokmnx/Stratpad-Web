
test("access control entry tests", function() {
	stop();
	expect(16);

	var deferred = $.Deferred(),
		stratFile,
		aceTestId,
        aceTestUUId,
        token,
        sfName;

	deferred.resolve();

	// create stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles",
			type: "POST",
			data: JSON.stringify({ name: "Ace stratfile", uuid: generateUUID() }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				stratFile = response.data.stratFile;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});

	// create an ACE for stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/aces",
			type: "POST",
			data: JSON.stringify({
                stratfileId:stratFile.id,
                principal:{email: "test@stratpad.com"},
                permissions: [
                    {
                        domain:'PLAN',
                        permission:'WRITE'
                    },
                    {
                        domain:'STRATBOARD',
                        permission:'READ'
                    }
                ]
            }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// retrieve all ACEs for stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/aces",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200);

                var ace = response.data.accessControlEntries[0];

				aceTestId = ace.id;
                aceTestUUId = ace.stratFileUuid;
                sfName = ace.stratFileName;
                token = ace.acceptToken;

                console.log(ace)

				ok ( ace.principal.email === 'test@stratpad.com', "user check");
				ok ( ace.acceptToken !== undefined, "token check");

				// invitee needs to accept before they actually get access
				ok ( ace.accepted === false, "accepted check");

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// root logs in
	deferred = deferred.then(function() {
		var credentials = JSON.stringify({
			"email": "root@stratpad.com",
			"password": "StratP@d"
		});

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


	// must accept invite as either admin, or the invitee
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/invite/" + token + "/accept",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'invite accept');
				equal(response.status, 'success');

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// log back in as user
	deferred = deferred.then(function() {
		var credentials = JSON.stringify({
			"email": localStorage.email,
			"password": localStorage.password
		});

	    return $.ajax({
			url: serverURL + "/logIn",
			type: "POST",
			data: credentials,
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "user logIn");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });

	});

	// modify specified ACE for stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/aces/" + aceTestId,
			type: "PUT",
			data: JSON.stringify({
                id:aceTestId,
                stratFileId:stratFile.id,
                stratFileUuid:aceTestUUId,
                principal:{email: "test@stratpad.com"},
                permissions: [
                    {
                        domain:'PLAN',
                        permission:'READ'
                    }
                ]
            }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'modify ACE');

				// because of our trick (new ace on modify), id's are not the same any more
				ok(aceTestId != response.data.accessControlEntry.id, 'ace id changes on modify');

				aceTestId = response.data.accessControlEntry.id;

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// retrieve specified ACE on stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/aces/" + aceTestId,
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'retrieve ACE');

				ok ( response.data.accessControlEntry.permissions[0].domain === 'PLAN', "permission domain check");
                ok ( response.data.accessControlEntry.permissions[0].permission === 'READ', "permission change check");

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// delete specified ACE from stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/aces/" + aceTestId,
			type: "DELETE",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'delete ACE');

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// cleanup (delete stratfile)
	deferred = deferred.then(function() {
		return $.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id,
		type: "DELETE",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, 'delete StratFile');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});
	});

});


