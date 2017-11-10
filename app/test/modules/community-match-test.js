test('community search test', function() {
	stop();
	expect(3);

	var stratFile;

    var deferred = $.Deferred();
    deferred.resolve();

	// create stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles",
			type: "POST",
			data: JSON.stringify({ 
				name: "Community stratfile",
				city: "Calgary",
				provinceState: "Alberta",
				country: "Canada"
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				stratFile = response.data.stratFile;
				console.debug('created stratfile');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});

	// check for matches - simply looks for Service Providers in Calgary
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/serviceProviders",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			var status = response.status;
			if (status == 'success') {
				ok (response.data.hasOwnProperty('serviceProviders'), 'check we have some FI');
				console.debug('found some matches');
			} else {
				ok (response.errors.length > 0, 'check our problem - usually because we have not imported data yet');
				console.warn(JSON.stringify(response.errors));
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
			start();
		});

	});

	// check for accountants - simply looks for Service Providers in Calgary
    deferred = deferred.then(function(response) {
    	return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/serviceProviders?category=Accountant",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			var status = response.status;
			if (status == 'success') {
				ok (response.data.serviceProviders.length > 0, 'check we have some serviceProviders');
				console.debug('found some accountants');
			} else {
				ok (response.errors.length > 0, 'check our problem - usually because we have not imported data yet');
				console.warn(JSON.stringify(response.errors));
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error(sprintf("%s: %s", textStatus, errorThrown));
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
			equal(jqXHR.status, 200, 'Delete StratFile');
			console.debug('deleted stratfile');
			start();
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		})
	});



});