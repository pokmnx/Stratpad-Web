
test("projectNoteItems tests", function() {
	stop();
	expect(26);

	var deferred = $.Deferred(),
		stratFile, anotherStratFile,
		theme,
        note;

	deferred.resolve();

	// create stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles",
			type: "POST",
			data: JSON.stringify({ name: "Notes stratfile", uuid: generateUUID() }),
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

	// create a theme for notes stratfile
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes",
			type: "POST",
			data: JSON.stringify({ name: "Notes Theme 1", "responsible": "Sam" }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				theme = response.data.theme;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// create a note for theme
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems",
			type: "POST",
			data: JSON.stringify({
				field      : "revenueOneTime",
				category   : "Miscellaneous",
				amount     : 1700,
				comment    : "Notes are so cool",
				nbOfStaff  : 3,
				quantity   : 15
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				note = response.data.projectNoteItem;
				equal(jqXHR.status, 200, 'Created Note successfully.');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// create another
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems",
			type: "POST",
			data: JSON.stringify({
				field      : "revenueMonthly",
				category   : "Rent",
				amount     : 2000,
				comment    : "My landlord is a rip off artist",
				nbOfStaff  : '',
				quantity   : ''
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Created second Note successfully.');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// create category
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/projectNoteItemCategories",
			type: "POST",
			data: JSON.stringify({"name": "Miscellaneous"}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Created note category successfully.');
				equal(response.data.projectNoteItemCategory.name, 'Miscellaneous', 'Miscellaneous note creation');				
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// create another category
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/projectNoteItemCategories",
			type: "POST",
			data: JSON.stringify({"name": "Rent"}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Created note category successfully.');
				equal(response.data.projectNoteItemCategory.name, 'Rent', 'Rent note creation');				
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// get all categories
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/projectNoteItemCategories",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Requested Note categories successfully.');
				equal(response.data.projectNoteItemCategories.length, 2, 'All Note categories for stratfile.');
				ok(_.contains(_.pluck(response.data.projectNoteItemCategories, 'name'), 'Miscellaneous'), 'Contains Miscellaneous');
				ok(_.contains(_.pluck(response.data.projectNoteItemCategories, 'name'), 'Rent'), 'Contains Rent');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// create another stratfile and note category (categories are separate for stratfiles)
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles",
			type: "POST",
			data: JSON.stringify({ name: "Notes stratfile", uuid: generateUUID() }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				anotherStratFile = response.data.stratFile;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});
	});

	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + '/stratfiles/' + anotherStratFile.id + "/projectNoteItemCategories",
			type: "POST",
			data: JSON.stringify({"name": "Groceries"}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Create groceries note category.');
				equal(response.data.projectNoteItemCategory.name, 'Groceries', 'Groceries note creation');				
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// get all categories - still just two
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + '/stratfiles/' + stratFile.id + "/projectNoteItemCategories",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Requested Note categories successfully.');
				equal(response.data.projectNoteItemCategories.length, 2, 'All Note categories for stratfile.');
				ok(_.contains(_.pluck(response.data.projectNoteItemCategories, 'name'), 'Miscellaneous'), 'Contains Miscellaneous');
				ok(_.contains(_.pluck(response.data.projectNoteItemCategories, 'name'), 'Rent'), 'Contains Rent');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});


	// get all notes
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Request all Notes.');
				equal(response.data.projectNoteItems.length, 2, 'See 2 notes.');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// get first note
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems/" + note.id,
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Request single Note.');
				equal(response.data.projectNoteItem.comment, 'Notes are so cool', 'Check note comment value.');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});

	// modify first note
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems/" + note.id,
			type: "PUT",
			data: JSON.stringify({
				comment    : "Notes are actually awesome",
				nbOfStaff  : 15
			}),
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Modify single Note.');
				equal(response.data.projectNoteItem.comment, 'Notes are actually awesome', 'Verify modified note comment value.');
				equal(response.data.projectNoteItem.nbOfStaff, 15, 'Verify modified note nbOfStaff value.');
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});

	});



	// delete single note
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/projectNoteItems/" + note.id,
			type: "DELETE",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, 'Delete single Note.');
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
			equal(jqXHR.status, 200, 'Delete StratFile');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		})
	});

	// cleanup (delete stratfile)
	deferred = deferred.then(function() {
		return $.ajax({
		url: serverURL + "/stratfiles/" + anotherStratFile.id,
		type: "DELETE",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, 'Delete Another StratFile');
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});
	});

});

