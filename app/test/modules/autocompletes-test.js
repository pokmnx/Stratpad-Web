var stratFileId, themeId, objectiveId;

test( "responsibles", function() {
	stop();
	expect(3);

	// create stratfile (NB 3 sample stratfiles have been made at signup, so if counting responsibles, keep that in mind)
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Responsible stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileId = response.data.stratFile.id;
		
		// create theme 1
	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
	        type: "POST",
	        data: JSON.stringify({ name: "Responsible Theme 1", "responsible": "Julian" }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {

			// create theme 2
		    $.ajax({
		        url: serverURL + "/stratfiles/" + stratFileId + "/themes",
		        type: "POST",
		        data: JSON.stringify({ name: "Responsible Theme 2", "responsible": "Victor" }),
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {

				themeId = response.data.theme.id;

				// get responsibles from themes
			    $.ajax({
			        url: serverURL + "/responsibles",
			        type: "GET",
			        dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
				.done(function(response, textStatus, jqXHR) {
					equal( response.status, "success", "responsibles check" );
					ok ($.inArray("Victor", response.data.responsibles) != -1, "contents check")
					ok ($.inArray("Julian", response.data.responsibles) != -1, "contents check")
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

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error(sprintf("%s: %s", textStatus, errorThrown));
		start();
	});

});

test( "objective summaries", function() {
	stop();
	expect(2);

	// create objectives
    $.ajax({
        url: serverURL + "/stratfiles/" + stratFileId + "/themes/" + themeId + "/objectives",
        type: "POST",
        data: JSON.stringify({ summary: "Kickstart revenue" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		objectiveId = response.data.objective.id;

		// get summaries from objectives
	    $.ajax({
	        url: serverURL + "/objectives/summaries",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "summaries check" );
			ok ($.inArray("Kickstart revenue", response.data.summaries) != -1, "contents check")
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


test( "actions", function() {
	stop();
	expect(2);

	// create action
    $.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/activities", serverURL, stratFileId, themeId, objectiveId),
        type: "POST",
        data: JSON.stringify({ action: "Acquire CRM software" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// get actions from activities
	    $.ajax({
	        url: serverURL + "/activities/actions",
	        type: "GET",
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "actions check" );
			ok ($.inArray("Acquire CRM software", response.data.actions) != -1, "contents check")
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


test( "metric summaries", function() {
	stop();
	expect(3);

	// create metric
    $.ajax({
	    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics", serverURL, stratFileId, themeId, objectiveId),
        type: "POST",
        data: JSON.stringify({ summary: "Cumulative revenue" }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		// create metric
	    $.ajax({
		    url: sprintf("%s/stratfiles/%s/themes/%s/objectives/%s/metrics", serverURL, stratFileId, themeId, objectiveId),
	        type: "POST",
	        data: JSON.stringify({ summary: "Timebox" }),
	        dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {

			// get summaries from metrics
		    $.ajax({
		        url: serverURL + "/metrics/summaries",
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "summaries check" );
				ok ($.inArray("Timebox", response.data.summaries) != -1, "contents check")
				ok ($.inArray("Cumulative revenue", response.data.summaries) != -1, "contents check")
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
