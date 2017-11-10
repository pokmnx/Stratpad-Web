var uuid, numStratFiles, stratFileId;

test("import stratFile", function() {
	stop();
	expect(4);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
	.done(function(response, textStatus, jqXHR) {

		// because 2 people running the tests could upload the same file, we have to give it a unique id
		uuid = generateUUID();
		var getToMarketXML = jqXHR.responseText.replace("<uuid>27A6780F-5069-46D9-8FC9-1DF99B7504E7</uuid>", sprintf("<uuid>%s</uuid>", uuid));
		
		var formData = new FormData();
		formData.append('files[]', getToMarketXML);

		// // note that we also support (and prefer) a multipart upload
		// // url -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles
	    $.ajax({
	    	// filename param is only for tests, since we're not actually uploading a File, but a big string
	    	// ie we send Content-Disposition: form-data; name="files[]"; filename="GetToMarket.xml" from the browser
	    	// Content-Disposition: form-data; name="files[]" from tests
	        url: serverURL + "/stratfiles?filename=GetToMarket.xml",
	        type: "POST",
	        processData: false,
	        cache: false,
	        data: formData,
			contentType: false // in order to get the correct multipart boundary
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "import check" );
			equal( response.data.stratFile.name, "Get to Market!", "Stratfile name check");
			equal( response.data.stratFile.uuid, uuid);

			stratFileId = response.data.stratFile.id;

		    $.ajax({
		        url: serverURL + "/stratfiles",
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "stratfiles check" );

				numStratFiles = response.data.stratFiles.length;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
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

test("re-import stratFile", function() {
	stop();
	expect(5);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
	.done(function(response, textStatus, jqXHR) {

		// use the same uuid as last time, so we can get a failure
		var getToMarketXML = jqXHR.responseText.replace("<uuid>27A6780F-5069-46D9-8FC9-1DF99B7504E7</uuid>", sprintf("<uuid>%s</uuid>", uuid));
		
		var formData = new FormData();
		formData.append('files[]', getToMarketXML);

		// url -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles
	    $.ajax({
	        url: serverURL + "/stratfiles?filename=GetToMarket.xml",
	        type: "POST",
	        processData: false,
	        cache: false,
	        data: formData,
			contentType: false
		})
		.done(function(response, textStatus, jqXHR) {
			console.error("Shouldn't be able to import the same stratFile.");
			start();
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			ok (jqXHR.status >= 400, "status check");
			ok (jqXHR.status == 409, "409 status check");

			ok( jqXHR.responseJSON.data.stratFile.id > 0, "id check on conflict" );

		    $.ajax({
		        url: serverURL + "/stratfiles",
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "stratfiles check" );
				equal( response.data.stratFiles.length, numStratFiles, "stratfiles length check" );
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
			})
			.always(function() {
				// helps qunit go on its way
				start();
			});

		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
		start();
	})

});

test("re-import stratFile with overwrite=replace", function() {
	stop();
	expect(6);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
	.done(function(response, textStatus, jqXHR) {

		// use the same uuid as last time, so we can get a failure
		var getToMarketXML = jqXHR.responseText.replace("<uuid>27A6780F-5069-46D9-8FC9-1DF99B7504E7</uuid>", sprintf("<uuid>%s</uuid>", uuid));
		
		var formData = new FormData();
		formData.append('files[]', getToMarketXML);

		// url -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles
	    $.ajax({
			url: serverURL + "/stratfiles?filename=GetToMarket.xml&overwrite=replace",
	        type: "POST",
	        processData: false,
	        cache: false,
	        data: formData,
			contentType: false
		})
		.done(function(response, textStatus, jqXHR) {
			// should get back our regular stratFile
			equal( response.status, "success", "stratfiles check" );
			equal( response.data.stratFile.name, "Get to Market!", "Stratfile name check");
			equal( response.data.stratFile.uuid, uuid);

			// nb subentities will have different ids, but the stratfile has the same id
			equal( response.data.stratFile.id, stratFileId);

			// numStratFiles still shouldn't change
			$.ajax({
		        url: serverURL + "/stratfiles",
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "stratfiles check" );
				equal( response.data.stratFiles.length, numStratFiles, "stratfiles length check" );
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
			})
			.always(function() {
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
	})

});

test("re-import stratFile with overwrite=keepboth", function() {
	stop();
	expect(6);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
	.done(function(response, textStatus, jqXHR) {

		// use the same uuid as last time, so we can get a failure
		var getToMarketXML = jqXHR.responseText.replace("<uuid>27A6780F-5069-46D9-8FC9-1DF99B7504E7</uuid>", sprintf("<uuid>%s</uuid>", uuid));

		var formData = new FormData();
		formData.append('files[]', getToMarketXML);

		// url -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles?overwrite=keepboth
	    $.ajax({
			url: serverURL + "/stratfiles?filename=GetToMarket.xml&overwrite=keepboth",
	        type: "POST",
	        processData: false,
	        cache: false,
	        data: formData,
			contentType: false
		})
		.done(function(response, textStatus, jqXHR) {
			// should get back a cloned stratFile
			equal( response.status, "success", "stratfiles check" );
			equal( response.data.stratFile.name, "Get to Market!", "Stratfile name check");
			notEqual( response.data.stratFile.uuid, uuid);
			notEqual( response.data.stratFile.id, stratFileId);

			// numStratFiles still should increase
			$.ajax({
		        url: serverURL + "/stratfiles",
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				equal( response.status, "success", "stratfiles check" );
				equal( response.data.stratFiles.length, numStratFiles+1, "stratfiles length check" );
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
			})
			.always(function() {
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
	})

});

test("export stratFile - xml", function() {
		stop();
		expect(11);

	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "GET",
	        data: {filename: 'test.xml'},	        
			headers: {          
                 Accept : "application/xml; charset=utf-8"
            }
		})
		.done(function(response, textStatus, jqXHR) {
			equal( jqXHR.status, 200, "export check" );

			equal( $(response).find('stratfile > name').text(), "Get to Market!", "Stratfile name check");
			equal( $(response).find('stratfile > uuid').text(), uuid);
			equal( $(response).find('stratfile > city').text(), "Seattle", "City check");
			equal( $(response).find('stratfile > country').text(), "USA", "Country check");
			equal( $(response).find('stratfile theme').length, 3, "Themes check");

			var $theme = $(response).find('stratfile theme > title:contains("DocLock")').parent();
			equal( $theme.find('generalAndAdminMonthly').text(), "85000", "G&A check");

			equal( $theme.find('objective').length, 1, "Objectives check");
			var $objective = $( $theme.find('objective:first-child') );
			equal ( $objective.find('>summary').text(), "Completed product", "Objective summary check");
			equal ( $objective.find('metric').length, 1, "Metric check");
			equal ( $objective.find('activity').length, 1, "Activity check");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});

test("export stratFile - json", function() {
		stop();
		expect(5);

	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "GET",
			dataType: "json",
			headers: {          
                 Accept : "application/json; charset=utf-8"
            }
		})
		.done(function(response, textStatus, jqXHR) {
			equal( jqXHR.status, 200, "export check" );

			equal( response.data.stratFile.name, "Get to Market!", "Stratfile name check");
			equal( response.data.stratFile.uuid, uuid);
			equal( response.data.stratFile.city, "Seattle", "City check");
			equal( response.data.stratFile.country, "USA", "Country check");

			// note that we don't get sub-entities in json
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});


test("export stratFile - app/stratfile", function() {
		stop();
		expect(2);

	    $.ajax({
	        url: serverURL + "/stratfiles/" + stratFileId,
	        type: "GET",
	        data: {filename: 'test.stratfile'},
	        // application/json is the default if no Accept supplied
			headers: {          
                 Accept : "application/stratfile; charset=utf-8"
            }
		})
		.done(function(response, textStatus, jqXHR) {
			equal( jqXHR.status, 200, "export check" );
			equal( response.indexOf('a2370d9709f66ca700'), 0);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			// helps qunit go on its way
			start();
		});

});


// pdf direct download
// curl -X POST -H 'Cookie: JSESSIONID=mjpCgeafCN1x7xI0GyHeIA;Path=/' -d @projectdetailfields.txt -i "https://jstratpad.appspot.com/pdfService" > temp.pdf

// @projectdetailfields.txt
// content=%3Chtml%3Ehello%3C%2Fhtml%3E&dateModified=123&filename=test.pdf&inline=true



// docx direct download
// curl -X POST -H 'Cookie: JSESSIONID=mjpCgeafCN1x7xI0GyHeIA;Path=/' -d @docx.fields https://jstratpad.appspot.com/summarybizplan > test.docx

// @docx.fields
// &filename=test.docx&content=%7B%22report%22%20%3A%20%22Summary%20Business%20Plan%22%2C%20%22company%22%20%3A%20%22Acme%20SoftwareTechnologies%20Ltd.%22%2C%22title%22%20%3A%20%22Get%20to%20Market!%22%2C%22lang%22%20%3A%20%22en%22%2C%22currency%22%20%3A%20%22%24%22%2C%22text_a%22%20%3A%20%22Acme%20Software%20Technologies%20Ltd.%20is%20based%20in%20Seattle%2C%20WA%2C%20USA.%22%2C%22text_b%22%20%3A%20%22There%20are%20many%20organizations%20who%20would%20like%20to%20use%20DocLock.%22%2C%22image_cs%22%20%3A%20%5B%5D%2C%22image_ds%22%20%3A%20%5B%5D%2C%22image_es%22%20%3A%20%5B%5D%20%7D



// todo: this is killing jenkins for some unknown reason - works locally
// // direct download: curl -X POST -H "Content-Type: application/json" -H 'Cookie: JSESSIONID=xtKtCeyKzXpYa7EMjb8N4g;Path=/' -d @bizplan.json -i https://jstratpad.appspot.com/summarybizplan?filename=test.docx
// test("export stratFile - docx download", function() {
// 		stop();
// 		expect(3);

// 	// get the json first
// 	$.ajax({
// 		url: "docx/bizplan.json"
// 	})
// 	.done(function(response, textStatus, jqXHR) {

// 		var bizplanjson = JSON.stringify(jqXHR.responseJSON);
// 		equal( jqXHR.status, 200, "docx check" );

	// params = {
	// 	filename: 'somefile.docx',
	// 	content: urlencode(html)
	// }

// 		// direct download
// 		$.ajax({
// 			url: serverURL + "/summarybizplan",
// 			data: $.param(params),
// 			type: 'POST',
// 			cache: false,
// 			contentType: "application/json; charset=utf-8"
// 		})
// 			.always(function(jqXHR, textStatus, errorThrown) {
// 				// we expect a parse error, since we get a binary
// 				equal( textStatus, "parsererror", "can't parse docx check" );	

// 				// in fact the response is fine
// 				equal( jqXHR.status, 200, "docx check" );

// 				start();
// 			});

// 	})
// 	.fail(function(jqXHR, textStatus, errorThrown) {
// 		console.error("%s: %s", textStatus, errorThrown);
// 		start();
// 	});

// });

// ajax email: curl -X POST -H "Content-Type: application/json" -H 'Cookie: JSESSIONID=uPfVhGe8X2xh2jSYdJpQPw;Path=/' -d @bizplan.json -i "https://jstratpad.appspot.com/summarybizplan?filename=test.docx&reportName=Summary%20Business%20Plan&stratfileName=Get%20Market"
test("export stratFile - docx email", function() {
		stop();
		expect(2);

	// get the json first
	$.ajax({
		url: "docx/bizplan.json"
	})
	.done(function(response, textStatus, jqXHR) {

		var bizplanjson = JSON.stringify(jqXHR.responseJSON);
		equal( jqXHR.status, 200, "docx check" );

		var data = {
			content: bizplanjson,
			filename: 'test.docx',
			reportName: 'SummaryBusinessPlan',
			stratfileName: 'Get To Market',
			inline: true
		};

		// direct download
		$.ajax({
			url: serverURL + "/summarybizplan",
			data: data,
			type: 'POST',
			cache: false
		})
		.done(function(response, textStatus, jqXHR) {
			equal( jqXHR.status, 200, "docx email check" );
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
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

});

test("cleanup", function() {
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
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});
});
