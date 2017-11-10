var stratFile, theme, objective, metric, projection;

module("stratboard");

test("import stratFile", function() {
	stop();
	expect(3);

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

		// note that we also support (and prefer) a multipart upload
		// url -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles
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

			stratFile = response.data.stratFile;

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

});


test( "GET charts and measurements for metric", function() {
	stop();
	expect(10);

	// get metrics off of GetToMarket, which we can now expect will be there after signup, except that it's readonly!
	// so get stratfiles first, then themes, then objectives, then metrics

	var deferred = $.Deferred();
	deferred.resolve();

	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes",
	        type: "GET",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "themes GET");

			theme = _.find(response.data.themes, function(theme) {
				return theme.name.indexOf('Sell 100 "Pro"') == 0;
			});

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives",
	        type: "GET",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "objectives GET");

			objective = _.find(response.data.objectives, function(objective) {
				return objective.summary == 'Connect with potential new customers';
			});

			// metrics are included with all objectives
			metric = _.find(objective.metrics, function(metric) {
				return metric.summary == 'Number of new contacts made';
			});

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics/" + metric.id + "/charts",
	        type: "GET",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "charts GET");
			equal(response.data.charts.length, 3, "number of charts");
			ok (_.where(response.data.charts, {'title': "Number of new contacts and revenue"}), "charts title check")

			var chart = _.findWhere(response.data.charts, {uuid: '1646D2FC-C385-4779-BEDF-ABC0E15BEA0C'});
			ok (chart.showTarget, "show target check");
			ok (!chart.showTrend, "show trend check");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics/" + metric.id + "/measurements",
	        type: "GET",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "measurements GET");
			equal(response.data.measurements.length, 10, "number of measurements");
			ok (_.where(response.data.measurements, {'value': 375}), "measurements value check")

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	    })
		.always(function() {
			start();
		});
          
	});

});


test( "manipulate measurements", function() {
	stop();
	expect(8);

	var newMetric, newMeasurement;

	var deferred = $.Deferred();
	deferred.resolve();

	// create metric
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics",
	        type: "POST",
	        data: JSON.stringify({summary: 'test metric'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newMetric = response.data.metric;

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// create measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics/" + newMetric.id + "/measurements",
	        type: "POST",
	        data: JSON.stringify({date: 20120315, value: 4500, comment: 'Hello'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newMeasurement = response.data.measurement;

			equal(newMeasurement.value, 4500, "measurement value");
			equal(newMeasurement.comment, 'Hello', "measurement comment");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// modify measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id + "/measurements/" + newMeasurement.id,
	        type: "PUT",
	        data: JSON.stringify({comment: 'Bye'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "measurement modify");
			equal(response.data.measurement.comment, 'Bye', "measurement modify comment");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// delete measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id + "/measurements/" + newMeasurement.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "measurement delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// delete metric
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	    })
		.always(function() {
			start();
		});	    
          
	});

});


test( "manipulate charts", function() {
	stop();
	expect(10);

	var newMetric, newChart;

	var deferred = $.Deferred();
	deferred.resolve();

	// create metric
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics",
	        type: "POST",
	        data: JSON.stringify({summary: 'test metric'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newMetric = response.data.metric;

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// create chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id + "/metrics/" + newMetric.id + "/charts",
	        type: "POST",
	        data: JSON.stringify({title: 'Red vs Blue', chartType: 4, colorScheme: 2}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newChart = response.data.chart;

			equal(newChart.title, 'Red vs Blue', "chart title");
			equal(newChart.chartType, 4, "chart type");
			equal(newChart.colorScheme, 2, "chart colour");
			equal(newChart.stratFileId, stratFile.id, "chart stratFile");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// modify chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id + "/charts/" + newChart.id,
	        type: "PUT",
	        data: JSON.stringify({title: 'Blue vs Red'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "chart modify");
			equal(response.data.chart.title, 'Blue vs Red', "chart modify title");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// delete chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id + "/charts/" + newChart.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "chart delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// delete metric
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/themes/" + theme.id + "/objectives/" + objective.id 
	        	+ "/metrics/" + newMetric.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	    })
		.always(function() {
			start();
		});	    
          
	});

});


test("get all charts", function() {
	stop();
	expect(10);

	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/charts",
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "charts GET");
			equal(response.data.charts.length, 3, "3 charts + 2 overlays filtered out server-side");
			ok (_.where(response.data.charts, {title: "Cumulative Revenue Chart"}), "contents check");
			ok (_.where(response.data.charts, {title: "Number of new contacts and revenue"}), "contents check");
			ok (_.where(response.data.charts, {title: "Number of new contacts w/ narrative"}), "contents check");
			ok (_.where(response.data.charts, {title: "Blue vs Red"}).length == 0, "contents check");

			// check objective type
			equal (_.findWhere(response.data.charts, {title: "Cumulative Revenue Chart"}).objectiveType, 'FINANCIAL', "contents check");
			equal (_.findWhere(response.data.charts, {title: "Number of new contacts and revenue"}).objectiveType, 'CUSTOMER', "contents check");
			equal (_.findWhere(response.data.charts, {title: "Number of new contacts w/ narrative"}).objectiveType, 'CUSTOMER', "contents check");

			// check measurements
			equal (_.findWhere(response.data.charts, {title: "Cumulative Revenue Chart"}).measurements.length, 5, "contents check");

			// order of charts should be chart with most recently modified measurements, but 


		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});	    

});


test("create projection", function() {
	stop();
	expect(2);

	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/projections",
		type: "POST",
		dataType: 'json',
        data: JSON.stringify({accountName: 'REVENUE'}),
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			projection = response.data.projection;

			equal(jqXHR.status, 200, "charts GET");
			equal(projection.accountName, 'REVENUE');

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});	    

});


test("get all projections", function() {
	stop();
	expect(2);

	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/projections",
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "projections GET");
			equal(response.data.projections.length, 1);

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});	    

});

test("modify projection 1", function() {
	stop();
	expect(1);

	// we don't support FOOBAR yet (ie we have a whitelist of acceptable projections)
	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id,
		type: "PUT",
		dataType: 'json',
        data: JSON.stringify({accountName: 'FOOBAR'}),
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {

			console.error("FOOBAR is not allowed");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			equal(jqXHR.status, 422); // Unprocessable Entity (WebDAV; RFC 4918)
		})
		.always(function() {
			start();
		});	    

});

test("modify projection 2", function() {
	stop();
	expect(2);

	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id,
		type: "PUT",
		dataType: 'json',
        data: JSON.stringify({accountName: 'TOTAL_EXPENSES'}),
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "projections PUT");
			equal(response.data.projection.accountName, 'TOTAL_EXPENSES');

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});	    

});

test("delete projection", function() {
	stop();
	expect(1);

	$.ajax({
		url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id,
		type: "DELETE",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "projections DELETE");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});	    

});


test("projection measurements", function() {
	stop();
	expect(7);

	var newMetric, newChart;

	var deferred = $.Deferred();
	deferred.resolve();


	// create projection
	deferred = deferred.then(function() {
	    return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/projections",
			type: "POST",
			dataType: 'json',
	        data: JSON.stringify({accountName: 'REVENUE'}),
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "projection create");
			projection = response.data.projection;

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});


	// create measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/measurements",
	        type: "POST",
	        data: JSON.stringify({date: 20120315, value: 4500, comment: 'Hello'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newMeasurement = response.data.measurement;

			equal(newMeasurement.value, 4500, "measurement value");
			equal(newMeasurement.comment, 'Hello', "measurement comment");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// modify measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/measurements/" + newMeasurement.id,
	        type: "PUT",
	        data: JSON.stringify({comment: 'Bye'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "measurement modify");
			equal(response.data.measurement.comment, 'Bye', "measurement modify comment");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// delete measurement
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/measurements/" + newMeasurement.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "measurement delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	    })
		.always(function() {
			start();
		});	    

          
	});

});

test( "manipulate projection charts", function() {
	stop();
	expect(12);

	var newChart;

	var deferred = $.Deferred();
	deferred.resolve();

	// create chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/charts",
	        type: "POST",
	        data: JSON.stringify({title: 'Red vs Blue', chartType: 4, colorScheme: 2}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "metric create");
			newChart = response.data.chart;

			// this is how we can tell the difference between charts, if we want to use the same Chart model
			ok(newChart.projectionId > 0);
			ok(newChart.metricId == null);

			equal(newChart.title, 'Red vs Blue', "chart title");
			equal(newChart.chartType, 4, "chart type");
			equal(newChart.colorScheme, 2, "chart colour");
			equal(newChart.stratFileId, stratFile.id, "chart stratFile");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// modify chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/charts/" + newChart.id,
	        type: "PUT",
	        data: JSON.stringify({title: 'Blue vs Red'}),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "chart modify");
			equal(response.data.chart.title, 'Blue vs Red', "chart modify title");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    });
          
	});

	// getting all charts doesn't include projection charts??
	deferred = deferred.then(function() {
		return $.ajax({
			url: serverURL + "/stratfiles/" + stratFile.id + "/charts",
			type: "GET",
			dataType: 'json',
			contentType: "application/json; charset=utf-8"
		})
			.done(function(response, textStatus, jqXHR) {
				equal(jqXHR.status, 200, "charts GET");
				equal(response.data.charts.length, 4, "3 charts + 2 overlays filtered out server-side + 1 projection chart");

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			});    
	});

	// delete chart
	deferred = deferred.then(function() {
	    return $.ajax({
	        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/charts/" + newChart.id,
	        type: "DELETE",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    })
	    .done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "chart delete");

	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	        console.error("%s: %s", textStatus, errorThrown);
	        start();
	    })
		.always(function() {
			start();
		});	    	    
          
	});

});

test("projection calc values", function() {
	stop();
	expect(6);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFile.id + "/projections/" + projection.id + "/calculatedValues",
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "calc check" );

		ok( response.data.measurements.length > 1, "calc check" );
		ok( response.data.measurements[0].date > 0, "calc check" );
		ok( response.data.measurements[0].value.length > 0, "calc check" );
		ok( response.data.measurements[0].projectionId, projection.id, "calc check" );
		ok( response.data.measurements[0].stratFileId, stratFile.id, "calc check" );

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		start();
	});


});

test("fill chart measurements", function() {
	stop();
	expect(33);

	/**
	 * fill up the provided array with entries from startDate to duration; at least one entry per month; omit entries outside range
	 * measurements - an array of eg. { date: "20161201", value: 2100}
	 * startdate - a moment date
	 * duration - number of years
	 */
	var filledArray = function(measurements, startDate, duration) {

		// create a map with each monthyear -> ary
		// make sure each ary has at least one item
		// reconstruct the array from the map

		var map = {};
		var date = moment(startDate).subtract('months', 1).startOf('month');
		for (var i=0; i<duration*12; i++) {
			date.add('months', 1);
			var dateKey = date.format('YYYYMMDD');
			if (!map.hasOwnProperty(dateKey)) {
				map[dateKey] = [];
			}
			map[dateKey].push({ date: dateKey, value: null });
		}

		// fill up map
		for (var i = 0; i < measurements.length; i++) {
			var entry = measurements[i];
			var key = moment(entry.date, "YYYYMMDD").startOf('month').format('YYYYMMDD');
			if (map.hasOwnProperty(key)) {
				map[key].push(entry);
			}
		};

		// re-construct array
		var filledAry = [];
		_.each(map, function(ary, key) {
			if (ary.length == 1) {
				filledAry.push(ary[0]);
			}
			else {
				for (var i = 0; i < ary.length; i++) {
					var entry = ary[i];
					if (entry.value !== null) {
						filledAry.push(entry);
					};
				};
			}
		});

		// finally, sort
		_.sortBy(filledAry, function(entry) {
			return entry.date;
		});

		return filledAry;

	};

	/**
	 * From the provided projected Values, grab the slice which fits between startDate and startDate + duration; fill in lead or tail with null valued entries
	 */
	var slicedArray = function(pMeasurements, startDate, duration) {
		// assume dates are all on the first of the month
		// if we don't have pMeasurements for startDate over duration, then fill them in
		var dateKey = startDate.startOf('month').format('YYYYMMDD');
		var entry = _.find(pMeasurements, function(entry) {
			return entry.date + '' === dateKey;
		});

		if (entry) {
			var idx = pMeasurements.indexOf(entry);
			var ary = pMeasurements.slice(idx, idx+duration*12);
			if (ary.length < 24) {
				return filledArray(ary, startDate, duration);
			}
			else {
				return ary;
			}
		}
		else {
			// no pMeasurements with startDate - ie it is outside the range defined by startDate and duration
			// do we have any intersection?

			// find intersecting pMeasurements - any entries between startDate.firstOfMonth and startDate.firstOfMonth + duration
			var start = startDate.startOf('month').format('YYYYMMDD')*1;
			var end = moment(startDate.startOf('month')).add('years', duration).format('YYYYMMDD')*1;
			var intersection = [];
			for (var i = 0; i < pMeasurements.length; i++) {
				var m = pMeasurements[i];
				var d = m.date*1;
				if (d >= start && d <= end) {
					intersection.push(m);
				}
			};

			var hasIntersection = intersection.length > 0;
			if (hasIntersection) {
				return filledArray(intersection, startDate, duration);
			}
			else {
				return filledArray([], startDate, duration);
			}
		}

	};

	var measurements = [
	    { date: "20140423", value: 50},
	    { date: "20140523", value: 125},
	    { date: "20140603", value: 100},
	    { date: "20140623", value: 120},
	    { date: "20141123", value: 200}
	];

	var pMeasurements = [
	    { date: "20140101", value: 50},
	    { date: "20140201", value: 100},
	    { date: "20140301", value: 150},
	    { date: "20140401", value: 200},
	    { date: "20140501", value: 250},
	    { date: "20140601", value: 300},
	    { date: "20140701", value: 400},
	    { date: "20140801", value: 450},
	    { date: "20140901", value: 500},
	    { date: "20141001", value: 550},
	    { date: "20141101", value: 600},
	    { date: "20141201", value: 650},

	    { date: "20150101", value: 700},
	    { date: "20150201", value: 800},
	    { date: "20150301", value: 900},
	    { date: "20150401", value: 950},
	    { date: "20150501", value: 1000},
	    { date: "20150601", value: 1050},
	    { date: "20150701", value: 1100},
	    { date: "20150801", value: 1150},
	    { date: "20150901", value: 1200},
	    { date: "20151001", value: 1250},
	    { date: "20151101", value: 1300},
	    { date: "20151201", value: 1400},

	    { date: "20160101", value: 1450},
	    { date: "20160201", value: 1500},
	    { date: "20160301", value: 1550},
	    { date: "20160401", value: 1600},
	    { date: "20160501", value: 1650},
	    { date: "20160601", value: 1700},
	    { date: "20160701", value: 1800},
	    { date: "20160801", value: 1900},
	    { date: "20160901", value: 1950},
	    { date: "20161001", value: 2000},
	    { date: "20161101", value: 2050},
	    { date: "20161201", value: 2100}

	];	

	var startDate = moment('20140401', 'YYYYMMDD');
	var duration = 2; // years


	 // idea is to make sure we have a value for every month in measurements and pMeasurements - the value itself is nil
	 // we should also slice the projections to match our startDate and duration
	 // so we end up with 2 aligned arrays with at least one value for each month, starting at startDate month, and ending at startDate + duration	

	var ary = filledArray(measurements, startDate, duration);
	equal( ary.length, 25);
	equal( ary[0].date, "20140423");


	// some overlap at the beginning
	measurements = [
	    { date: "20140214", value: 50},
	    { date: "20140323", value: 125},
	    { date: "20140503", value: 100},
	    { date: "20140623", value: 120},
	    { date: "20141123", value: 200}
	];

	ary = filledArray(measurements, startDate, duration);
	equal( ary.length, 24);
	equal( ary[0].date, "20140401");
	equal( ary[1].date, "20140503");


	// no overlap - beginning
	measurements = [
	    { date: "20120214", value: 50},
	    { date: "20120323", value: 125},
	    { date: "20120503", value: 100},
	    { date: "20120623", value: 120},
	    { date: "20121123", value: 200}
	];

	ary = filledArray(measurements, startDate, duration);
	equal( ary.length, 24);
	equal( ary[0].date, "20140401");
	equal( ary[1].date, "20140501");
	equal( ary[2].value, null );


	// no overlap - tail
	measurements = [
	    { date: "20170214", value: 50},
	    { date: "20170323", value: 125},
	    { date: "20170503", value: 100},
	    { date: "20170623", value: 120},
	    { date: "20171123", value: 200}
	];

	ary = filledArray(measurements, startDate, duration);
	equal( ary.length, 24);
	equal( ary[0].date, "20140401");
	equal( ary[1].date, "20140501");
	equal( ary[2].value, null );


	// overlap at end
	measurements = [
	    { date: "20150214", value: 50},
	    { date: "20150323", value: 125},
	    { date: "20160103", value: 100},
	    { date: "20160623", value: 120},
	    { date: "20161123", value: 200}
	];

	ary = filledArray(measurements, startDate, duration);
	equal( ary.length, 24);
	equal( ary[0].date, "20140401");
	equal( ary[1].date, "20140501");
	equal( ary[2].value, null );
	equal( ary[21].date, "20160103");
	equal( ary[22].date, "20160201");
	equal( ary[23].date, "20160301");



	// ******** also want to slice pMeasurements appropriately ***
	// pMeasurements goes from 20140101 for 3 years

	startDate = moment('20140401', 'YYYYMMDD');
	duration = 2; // years

	// this startDate + duration entirely contained
	var pVals = slicedArray(pMeasurements, startDate, duration);
	equal( pVals.length, 24);
	equal( pVals[0].date, '20140401');
	equal( pVals[0].value, 200);

	// start before pMeasurements
	startDate = moment('20130401', 'YYYYMMDD');
	duration = 2; // years

	pVals = slicedArray(pMeasurements, startDate, duration);
	equal( pVals.length, 24);
	equal( pVals[0].date, '20130401');
	equal( pVals[0].value, null);
	equal( pVals[23].date, '20150301');
	equal( pVals[23].value, 900);


	// start mid pMeasurements, duration exceeds pMeasurements
	startDate = moment('20151022', 'YYYYMMDD');
	duration = 4; // years

	pVals = slicedArray(pMeasurements, startDate, duration);
	equal( pVals.length, 48);
	equal( pVals[0].date, '20151001');
	equal( pVals[0].value, 1250);
	equal( pVals[47].date, '20190901');
	equal( pVals[47].value, null);

	start();

});


test("cleanup", function() {
	stop();
	expect(1);

    $.ajax({
        url: serverURL + "/stratfiles/" + stratFile.id,
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


