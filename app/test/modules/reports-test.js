var stratFileId;

test("import GetToMarket", function() {
	stop();
	expect(3);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
		.done(function(response, textStatus, jqXHR) {

			// because 2 people running the tests could upload the same file, we have to give it a unique id
			var getToMarketXML = jqXHR.responseText.replace("<uuid>27A6780F-5069-46D9-8FC9-1DF99B7504E7</uuid>", sprintf("<uuid>%s</uuid>", generateUUID()));

			var formData = new FormData();
			formData.append('files[]', getToMarketXML);

			// curl -H "Content-Type: application/xml" --header 'Cookie: JSESSIONID=MZxsoBMYLNHviSTPHVTfrA;Path=/' -X POST -i -d @GetToMarket.xml https://jstratpad.appspot.com/stratfiles
			$.ajax({
				url: serverURL + "/stratfiles?filename=GetToMarket.xml",
		        type: "POST",
		        processData: false,
		        cache: false,
		        data: formData,
				contentType: false
			})
				.done(function(response, textStatus, jqXHR) {
					equal(response.status, "success", "objectives check");
					equal(response.data.stratFile.name, "Get to Market!", "Stratfile name check");
					equal(response.data.stratFile.city, "Seattle");

					stratFileId = response.data.stratFile.id;
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
		})

});

test("BaseReport test", function() {
	stop();
	expect(29);

	var baseReport = new BaseReport();

	var strategyByMonth = {
		"revenue": {
			"changeInRevenue": [0, 60000, 60000, 60000, 60000],
		}
	};

	equal(strategyByMonth.revenue.changeInRevenue.length, 5, "fill check");
	baseReport.prepareForYear(strategyByMonth, 0);
	equal(strategyByMonth.revenue.changeInRevenue.length, 14, "fill check");
	equal(strategyByMonth.revenue.changeInRevenue[12], 240000, "year sum check");
	equal(strategyByMonth.revenue.changeInRevenue[13], 0, "sub years sum check");


	strategyByMonth = {
		"revenue": {
			"changeInRevenue": [0, 60000, 60000, 60000, 60000, 50000, 40000, 50000, 60000, 60000, 50000, 40000, 50000, 60000, 60000, 50000, 40000, 50000, 60000],
		}
	};

	equal(strategyByMonth.revenue.changeInRevenue.length, 19, "slice check");
	baseReport.prepareForYear(strategyByMonth, 0);
	equal(strategyByMonth.revenue.changeInRevenue.length, 14, "slice check");
	equal(strategyByMonth.revenue.changeInRevenue[12], 590000, "year sum check");
	equal(strategyByMonth.revenue.changeInRevenue[13], 370000, "sub years sum check");

	strategyByMonth = {
		"revenue": {
			"changeInRevenue": [0, 60000, 60000, 60000, 60000, 50000, 40000, 50000, 60000, 60000, 50000, 40000, 50000, 60000, 60000, 50000, 40000, 50000, 60000],
		}
	};

	equal(strategyByMonth.revenue.changeInRevenue.length, 19, "slice check");
	baseReport.prepareForYear(strategyByMonth, 1);
	equal(strategyByMonth.revenue.changeInRevenue.length, 14, "slice check");
	equal(strategyByMonth.revenue.changeInRevenue[12], 370000, "year sum check");
	equal(strategyByMonth.revenue.changeInRevenue[13], 0, "sub years sum check");

	strategyByMonth = {
		"strategy": {
			"netCumulative": [0, 60000, 60000, 60000, 60000, 50000, 40000],
		}
	};

	equal(strategyByMonth.strategy.netCumulative.length, 7, "netCumulative check");
	baseReport.prepareForYear(strategyByMonth, 0);
	equal(strategyByMonth.strategy.netCumulative.length, 14, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[1], 60000, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[6], 40000, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[7], 40000, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[11], 40000, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[12], 40000, "netCumulative check");
	equal(strategyByMonth.strategy.netCumulative[13], 40000, "netCumulative check");

	// sort
	var objectives = [{
		"type": "FINANCIAL",
		"name": "Kickstart revenue",
		"activities": [],
		"metrics": [{
			"name": "Cumulative revenue",
			"targetDate": 20120930,
			"targetValue": "480000"
		}]
	}, {
		"type": "PROCESS",
		"name": "Implement new CRM software",
		"startDate": 20120201,
		"endDate": 20120331,
		"activities": [{
			"name": "Acquire CRM software",
			"firstYearCost": 0,
			"startDate": 20120201,
			"endDate": 20120331,
			"responsible": "Frank Gerrault"
		}],
		"metrics": [{
			"name": "CRM software implemented",
			"targetDate": 20120331
		}]
	}, {
		"type": "STAFF",
		"name": "Add sales support staff",
		"order": 0,
		"startDate": 20120201,
		"endDate": 20120229,
		"activities": [{
			"name": "Hire sales support staff",
			"firstYearCost": 0,
			"startDate": 20120201,
			"endDate": 20120229,
			"responsible": "Mary Gimball"
		}],
		"metrics": [{
			"name": "Sales support staff added",
			"targetDate": 20120229
		}]
	}, {
		"type": "STAFF",
		"name": "Train sales staff",
		"order": 1,
		"startDate": 20120301,
		"endDate": 20120331,
		"activities": [{
			"name": "Train sales support staff",
			"firstYearCost": 0,
			"startDate": 20120301,
			"endDate": 20120331,
			"responsible": "Mary Gimball"
		}],
		"metrics": [{
			"name": "Trained staff",
			"targetDate": 20120331
		}]
	}, {
		"type": "STAFF",
		"name": "Train sales staff 2",
		"order": 2,
		"startDate": 20120801,
		"activities": [{
			"name": "Train sales support staff",
			"firstYearCost": 0,
			"endDate": 20130331,
			"responsible": "Mary Gimball"
		}],
		"metrics": [{
			"name": "Trained staff",
			"targetDate": 20130331
		}]
	}, {
		"type": "CUSTOMER",
		"name": "Connect with potential new customers",
		"startDate": 20120401,
		"endDate": 20120630,
		"activities": [{
			"name": "Implement out-bound marketing campaign",
			"firstYearCost": 0,
			"startDate": 20120401,
			"responsible": "Mary Gimball"
		}],
		"metrics": [{
			"name": "Number of new contacts made",
			"targetValue": "2500"
		}]
	}];
	baseReport.sortObjectivesByDate(objectives);
	equal(objectives[0].name, "Implement new CRM software", "First objective");
	equal(objectives[1].name, "Add sales support staff", "Second objective");
	equal(objectives[objectives.length-1].name, "Train sales staff 2", "Last objective");

	baseReport.sortObjectivesByOrder(objectives);
	equal(objectives[0].name, "Kickstart revenue", "First objective");
	equal(objectives[1].name, "Connect with potential new customers", "Second objective");
	equal(objectives[2].name, "Implement new CRM software", "Third objective");
	equal(objectives[3].name, "Add sales support staff", "Fourth objective");
	equal(objectives[4].name, "Train sales staff", "Fifth objective");
	equal(objectives[5].name, "Train sales staff 2", "Sixth objective");

	start();

});


test("r1 strategy map", function() {
	stop();
	expect(6);

	var strategyMap = new StrategyMap();


	var objectives = [
		{
			type: 'CUSTOMER',
			order: 0,
			summary: 'cust0'
		},
		{
			type: 'CUSTOMER',
			order: 1,
			summary: 'cust1'
		},
		{
			type: 'CUSTOMER',
			order: 2,
			summary: 'cust2'
		},
		{
			type: 'FINANCIAL',
			order: 0,
			summary: 'fin0'
		},
		{
			type: 'FINANCIAL',
			order: 1,
			summary: 'fin1'
		},
		{
			type: 'PROCESS',
			order: 0,
			summary: 'pro0'
		},
		{
			type: 'PROCESS',
			order: 1,
			summary: 'pro1'
		},
		{
			type: 'PROCESS',
			order: 2,
			summary: 'pro2'
		},
		{
			type: 'PROCESS',
			order: 3,
			summary: 'pro3'
		}
	]

	var themeWidth = strategyMap.themeWidth(objectives);
	equal(themeWidth, 4);

	objectives.pop();
	themeWidth = strategyMap.themeWidth(objectives);
	equal(themeWidth, 3);


	var objectivesSubset1 = strategyMap.subSetOfObjectives(objectives, 4, false);
	equal(objectivesSubset1.length, objectives.length);

	var objectivesSubset2 = strategyMap.subSetOfObjectives(objectives, 4, true);
	equal(objectivesSubset2.length, 0);


	objectivesSubset1 = strategyMap.subSetOfObjectives(objectives, 2, false);
	equal(objectivesSubset1.length, 6);

	objectivesSubset2 = strategyMap.subSetOfObjectives(objectives, 2, true);
	equal(objectivesSubset2.length, 2);




	start();


});



test("r2 GetToMarket test", function() {
	stop();
	expect(12);

	$.ajax({
		url: serverURL + "/reports/r2?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r2 test");

			equal(Object.keys(response.expenses).length, 4, "expenses check");
			equal(response.expenses.changeInGa[0], 85000, "G&A check");

			equal(Object.keys(response.header).length, 1, "header check");
			equal(Object.keys(response.header.headers).length, 10, "headers check");
			equal(response.header.headers[0], 201201, "headers check");

			equal(Object.keys(response.revenue).length, 3, "revenue check");
			equal(response.revenue.total[0], 0, "revenue totals check");
			equal(response.revenue.total[1], 60000, "revenue totals check");

			equal(Object.keys(response.strategy).length, 2, "strategy total check");
			equal(Object.keys(response.strategy.netCumulative).length, 10, "strategy cumulative check");
			equal(response.strategy.netCumulative[7], -170000, "strategy cumulative check");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

test("r2 simple stratfile test", function() {
	stop();
	expect(8);

	// create stratfile
	$.ajax({
		url: serverURL + "/stratfiles",
		type: "POST",
		data: JSON.stringify({
			name: "Reporter stratfile",
			uuid: generateUUID()
		}),
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {

			var stratFileId = response.data.stratFile.id;

			// create theme
			$.ajax({
				url: serverURL + "/stratfiles/" + stratFileId + "/themes",
				type: "POST",
				data: JSON.stringify({
					name: "Simple Theme",
					revenueMonthly: 100,
					cogsMonthly: 200,
					startDate: 20130206,
					endDate: 20130930
				}),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
				.done(function(response, textStatus, jqXHR) {

					$.ajax({
						url: serverURL + "/reports/r2?id=" + stratFileId,
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
						.done(function(response, textStatus, jqXHR) {
							equal(jqXHR.status, 200, "r2 test");

							equal(response.header.headers[0], 201302, "Date check");
							equal(response.expenses.changeInGa[0], null, "G&A check");
							equal(response.revenue.changeInRevenue[0], 100, "Revenue check");
							equal(response.revenue.changeInCogs[7], 200, "COGS check");
							equal(response.revenue.total.length, 8, "Total length check");
							equal(response.strategy.netCumulative[7], -800, "Net cumulative check");

							$.ajax({
								url: serverURL + "/stratfiles/" + stratFileId,
								type: "DELETE",
								dataType: 'json',
								contentType: "application/json; charset=utf-8"
							})
								.done(function(response, textStatus, jqXHR) {
									equal(response.status, "success", "stratfile delete check");
								})
								.fail(function(jqXHR, textStatus, errorThrown) {
									console.error("%s: %s", textStatus, errorThrown);
								})
								.always(function() {
									// send qunit on its way
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

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		});

});

test("r2 monthly numbers test", function() {
	stop();
	expect(30);

	// create stratfile
	$.ajax({
		url: serverURL + "/stratfiles",
		type: "POST",
		data: JSON.stringify({
			name: "Reporter stratfile",
			uuid: generateUUID()
		}),
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {

			var stratFileId = response.data.stratFile.id;

			// create theme
			$.ajax({
				url: serverURL + "/stratfiles/" + stratFileId + "/themes",
				type: "POST",
				data: JSON.stringify({
					name: "Simple Theme",
					revenueMonthly: 1200,
					cogsMonthly: 200,
					researchAndDevelopmentMonthly: 100,
					generalAndAdminMonthly: 300,
					salesAndMarketingMonthly: 400,
					startDate: 20130206,
					endDate: 20130930
				}),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
				.done(function(response, textStatus, jqXHR) {

					$.ajax({
						url: serverURL + "/reports/r2?id=" + stratFileId,
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
						.done(function(response, textStatus, jqXHR) {
							equal(jqXHR.status, 200, "r2 test");

							equal(response.header.headers[0], 201302, "Date check");

							equal(response.revenue.changeInRevenue.length, 8, "Revenue itemCount check");
							equal(response.revenue.changeInRevenue[0], 1200, "Revenue 0 check");
							equal(response.revenue.changeInRevenue[7], 1200, "Revenue 7 check");

							equal(response.revenue.changeInCogs.length, 8, "COGS itemCount check");
							equal(response.revenue.changeInCogs[0], 200, "COGS 0 check");
							equal(response.revenue.changeInCogs[7], 200, "COGS 7 check");

							equal(response.revenue.total.length, 8, "Total revenue itemCount check");
							equal(response.revenue.total[0], 1000, "Total revenue 0 check");
							equal(response.revenue.total[7], 1000, "Total revenue 7 check");


							equal(response.expenses.changeInRd.length, 8, "R&D itemCount check");
							equal(response.expenses.changeInRd[0], 100, "R&D 0 check");
							equal(response.expenses.changeInRd[7], 100, "R&D 7 check");

							equal(response.expenses.changeInGa.length, 8, "G&A itemCount check");
							equal(response.expenses.changeInGa[0], 300, "G&A 0 check");
							equal(response.expenses.changeInGa[7], 300, "G&A 7 check");

							equal(response.expenses.changeInSm.length, 8, "S&M itemCount check");
							equal(response.expenses.changeInSm[0], 400, "S&M 0 check");
							equal(response.expenses.changeInSm[7], 400, "S&M 7 check");

							equal(response.expenses.total.length, 8, "Total expenses itemCount check");
							equal(response.expenses.total[0], 800, "Total expenses 0 check");
							equal(response.expenses.total[7], 800, "Total expenses 7 check");


							equal(response.strategy.netContribution.length, 8, "Net contribution itemCount check");
							equal(response.strategy.netContribution[0], 200, "Net contribution 0 check");
							equal(response.strategy.netContribution[7], 200, "Net contribution 7 check");

							equal(response.strategy.netCumulative.length, 8, "Net cumulative itemCount check");
							equal(response.strategy.netCumulative[0], 200, "Net cumulative 0 check");
							equal(response.strategy.netCumulative[7], 1600, "Net cumulative 7 check");


							$.ajax({
								url: serverURL + "/stratfiles/" + stratFileId,
								type: "DELETE",
								dataType: 'json',
								contentType: "application/json; charset=utf-8"
							})
								.done(function(response, textStatus, jqXHR) {
									equal(response.status, "success", "stratfile delete check");
								})
								.fail(function(jqXHR, textStatus, errorThrown) {
									console.error("%s: %s", textStatus, errorThrown);
								})
								.always(function() {
									// send qunit on its way
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

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		});

});

test("r2 adjustments test", function() {
	stop();
	expect(11);

	// create stratfile
	$.ajax({
		url: serverURL + "/stratfiles",
		type: "POST",
		data: JSON.stringify({
			name: "Reporter stratfile",
			uuid: generateUUID()
		}),
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {

			var stratFileId = response.data.stratFile.id;

			// create theme
			$.ajax({
				url: serverURL + "/stratfiles/" + stratFileId + "/themes",
				type: "POST",
				data: JSON.stringify({
					name: "Simple Theme",
					revenueMonthly: 200,
					cogsMonthly: 50,
					revenueMonthlyAdjustment: 5,
					cogsMonthlyAdjustment: 5,
					startDate: 20130901,
					endDate: 20131031
				}),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
				.done(function(response, textStatus, jqXHR) {

					$.ajax({
						url: serverURL + "/reports/r2?id=" + stratFileId,
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
						.done(function(response, textStatus, jqXHR) {
							equal(jqXHR.status, 200, "r2 test");

							equal(response.header.headers[0], 201309, "Date check");
							equal(response.revenue.changeInRevenue[0], 200, "Revenue check");
							equal(response.revenue.changeInCogs[0], 50, "COGS check");
							equal(response.revenue.total[0], 150, "Total check");
							equal(response.strategy.netCumulative[0], 150, "Net cumulative check");

							equal(response.revenue.changeInRevenue[1], 210, "Revenue check");
							equal(response.revenue.changeInCogs[1], 52.5, "COGS check");
							equal(response.revenue.total[1], 157.5, "Total check");
							equal(response.strategy.netCumulative[1], 307.5, "Net cumulative check");

							$.ajax({
								url: serverURL + "/stratfiles/" + stratFileId,
								type: "DELETE",
								dataType: 'json',
								contentType: "application/json; charset=utf-8"
							})
								.done(function(response, textStatus, jqXHR) {
									equal(response.status, "success", "stratfile delete check");
								})
								.fail(function(jqXHR, textStatus, errorThrown) {
									console.error("%s: %s", textStatus, errorThrown);
								})
								.always(function() {
									// send qunit on its way
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

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
			start();
		});

});

test("r3 test", function() {
	stop();
	expect(16);

	$.ajax({
		url: serverURL + "/reports/r3?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r3 test");

			equal(response.themes.length, 3, "themes length check");
			equal(response.themes[0].name, "Complete DocLock Development", "Theme name and order check");
			equal(response.themes[1].name, "Sell 100 \"Pro\"Licenses", "Theme name and order check");
			equal(response.themes[2].name, "Develop Reseller Relationships", "Theme name and order check");

			var themeJSON = response.themes[0];

			equal(Object.keys(themeJSON.expenses).length, 4, "expenses check");
			equal(themeJSON.expenses.changeInGa[0], 85000, "G&A check");

			equal(Object.keys(themeJSON.header).length, 1, "header check");
			equal(Object.keys(themeJSON.header.headers).length, 10, "headers check");
			equal(themeJSON.header.headers[0], 201201, "headers check");

			equal(Object.keys(themeJSON.revenue).length, 3, "revenue check");
			equal(themeJSON.revenue.total[0], null, "revenue totals check");
			equal(themeJSON.revenue.total[1], null, "revenue totals check");

			equal(Object.keys(themeJSON.strategy).length, 2, "strategy total check");
			equal(Object.keys(themeJSON.strategy.netCumulative).length, 10, "strategy cumulative check");
			equal(themeJSON.strategy.netCumulative[7], -255000, "strategy cumulative check");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});


});

test("r4 GetToMarket test", function() {
	stop();
	expect(16);

	$.ajax({
		url: serverURL + "/reports/r4?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r4 test");

			equal(response.themes.length, 3, "themes length check");
			equal(response.themes[0].name, "Complete DocLock Development", "Theme name and order check");
			equal(response.themes[1].name, "Sell 100 \"Pro\"Licenses", "Theme name and order check");
			equal(response.themes[2].name, "Develop Reseller Relationships", "Theme name and order check");

			var themeJSON = response.themes[0];

			equal(Object.keys(themeJSON.expenses).length, 4, "expenses check");
			equal(themeJSON.expenses.changeInGa[0], 85000, "G&A check");

			equal(Object.keys(themeJSON.header).length, 1, "header check");
			equal(Object.keys(themeJSON.header.headers).length, 10, "headers check");
			equal(themeJSON.header.headers[0], 201201, "headers check");

			equal(Object.keys(themeJSON.revenue).length, 3, "revenue check");
			equal(themeJSON.revenue.total[0], null, "revenue totals check");
			equal(themeJSON.revenue.total[1], null, "revenue totals check");

			equal(Object.keys(themeJSON.strategy).length, 2, "strategy total check");
			equal(Object.keys(themeJSON.strategy.netCumulative).length, 10, "strategy cumulative check");
			equal(themeJSON.strategy.netCumulative[7], -255000, "strategy cumulative check");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});


test("r5 test", function() {
	stop();
	expect(12);

	$.ajax({
		url: serverURL + "/reports/themedetail?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r5 test");

			equal(response.startDate, 20120101, "startDate test");
			equal(response.duration, 9, "duration test");

			equal(response.themes.length, 3, "num themes test");
			equal(response.themes[0].name, "Complete DocLock Development", "name test");
			equal(response.themes[0].objectives.length, 1, "num objectives test");
			equal(response.themes[0].objectives[0].type, "PROCESS", "objective type test");
			equal(response.themes[0].objectives[0].activities.length, 1, "num activities test");
			equal(response.themes[0].objectives[0].activities[0].name, "Daily project management", "activity name test");
			equal(response.themes[0].objectives[0].metrics.length, 1, "num metrics test");
			equal(response.themes[0].objectives[0].metrics[0].name, "Timebox", "metric name test");
			equal(response.themes[0].objectives[0].metrics[0].targetDate, 20120331, "metric targetDate test");

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

test("r6 test", function() {
	stop();
	expect(1);

	$.ajax({
		url: serverURL + "/reports/gantt?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r6 test");

			// todo: test a couple get to market numbers


		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

var stratFileForGanttId;
test("r6 create stratfile with 3 themes", function() {
	stop();

	var themes = [{
		name: "Theme 1",
		startDate: 20121107,
		order: 0
	}, {
		name: "Theme 2",
		endDate: 20121202,
		order: 1
	}, {
		name: "Theme 3",
		order: 2
	}];

	expect(themes.length);

	var requestsFinished = 0;

	// create stratfile
    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "R6 StratFile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {

		stratFileForGanttId = response.data.stratFile.id;

		function fireCreateTheme(theme) {
		    return $.ajax({
		        url: serverURL + "/stratfiles/" + stratFileForGanttId + "/themes",
		        type: "POST",
		        data: JSON.stringify(theme),
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {
				console.log("theme added");
				equal(jqXHR.status, 200, "r6 test theme create");
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
				start();
			})
			.always(function() {
				if (++requestsFinished == themes.length) {
					start();
				}				
			});
		}

		var deferred = $.Deferred();
		deferred.resolve();

		$.each(themes, function(ix, theme) {
			deferred = deferred.then(function() {
				return fireCreateTheme(theme);
			});
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
		start();
	});

});

test("r6 test stratfile", function() {
	stop();
	expect(16);

	$.ajax({
		url: serverURL + "/reports/gantt?id=" + stratFileForGanttId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r6 test");

			equal(response.duration, 1);
			equal(response.startDate, 20121107);
			equal(response.themes.length, 3);

			// themes comes back in an undefined order
			var theme1 = _.where(response.themes, {name:"Theme 1"})[0];
			equal(theme1.name, "Theme 1");
			equal(theme1.startDate, 20121107);
			equal(theme1.endDate, undefined);
			equal(theme1.order, 0);

			var theme2 = _.where(response.themes, {name:"Theme 2"})[0];
			equal(theme2.name, "Theme 2");
			equal(theme2.startDate, undefined);
			equal(theme2.endDate, 20121202);
			equal(theme2.order, 1);

			var theme3 = _.where(response.themes, {name:"Theme 3"})[0];
			equal(theme3.name, "Theme 3");
			equal(theme3.startDate, undefined);
			equal(theme3.endDate, undefined);
			equal(theme3.order, 2);

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});


test("r7 test", function() {
	stop();
	expect(13);

	$.ajax({
		url: serverURL + "/reports/projectplan?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r7 test");

			equal(response.startDate, 20120101, "startDate test");
			equal(response.duration, 9, "duration test");

			equal(response.themes.length, 3, "num themes test");
			equal(response.themes[0].name, "Complete DocLock Development", "name test");
			equal(response.themes[0].order, 0, "order test");
			equal(response.themes[0].objectives.length, 1, "num objectives test");
			equal(response.themes[0].objectives[0].type, "PROCESS", "objective type test");
			equal(response.themes[0].objectives[0].activities.length, 1, "num activities test");
			equal(response.themes[0].objectives[0].activities[0].name, "Daily project management", "activity name test");
			equal(response.themes[0].objectives[0].metrics.length, 1, "num metrics test");
			equal(response.themes[0].objectives[0].metrics[0].name, "Timebox", "metric name test");
			equal(response.themes[0].objectives[0].metrics[0].targetDate, 20120331, "metric targetDate test");


		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

test("r8 test", function() {
	stop();
	expect(9);

	$.ajax({
		url: serverURL + "/reports/r8?id=" + stratFileId,
		type: "GET",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
		.done(function(response, textStatus, jqXHR) {
			equal(jqXHR.status, 200, "r8 test");

			equal(response.startDate, 20120101, "startDate test");
			equal(response.meetings.length, 51, "num meetings test");
			equal(response.meetings[0].date, 20111226, "1st meeting date test");
			equal(response.meetings[0].frequency, 'WEEKLY', "1st meeting frequency test");
			equal(response.meetings[0].items.length, 6, "1st meeting number of items");

			equal(response.meetings[0].items[0].strategyName, 'Get to Market!', "1st meeting, strategy, name");
			equal(response.meetings[0].items[0].strategyStartDate, 20120101, "1st meeting, strategy, startDate");
			equal(response.meetings[0].items[0].type, 'STRATEGY', "1st meeting, strategy, type");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			start();
		});

});

test( "responsibles phrase test", function() {
	stop();
	expect(11);

	// Jack
	// Jack and Jill
	// Jack, Jill and George
	// Jack, Jill, George and John 

	var responsibles = ['Jack'];

	var head = responsibles;
	var tail = undefined;
	equal(head.length, 1);

	var phrase = head.join(', ') + (tail ? ' and ' + tail : '');
	equal(_phrase(responsibles), 'Jack');

	responsibles.push('Jill');
	head = responsibles.slice(0,responsibles.length-1);
	tail = responsibles.slice(responsibles.length-1)[0];
	equal(head.length, 1);
	equal(tail, 'Jill');

	phrase = head.join(', ') + (tail ? ' and ' + tail : '');
	equal(_phrase(responsibles), 'Jack and Jill');

	responsibles.push('George');
	head = responsibles.slice(0,responsibles.length-1);
	tail = responsibles.slice(responsibles.length-1)[0];
	equal(head.length, 2);
	equal(tail, 'George');

	phrase = head.join(', ') + (tail ? ' and ' + tail : '');
	equal(_phrase(responsibles), 'Jack, Jill and George');

	responsibles.push('John');
	head = responsibles.slice(0,responsibles.length-1);
	tail = responsibles.slice(responsibles.length-1)[0];
	equal(head.length, 3);
	equal(tail, 'John');

	phrase = head.join(', ') + (tail ? ' and ' + tail : '');
	equal(_phrase(responsibles), 'Jack, Jill, George and John');

	start();
	
});

function _phrase(responsibles) {
	var head, tail;
	if (responsibles.length == 1) {
		head = responsibles;
		tail = undefined;
	}
	else if (responsibles.length > 1) {
		head = responsibles.slice(0,responsibles.length-1);
		tail = responsibles.slice(responsibles.length-1)[0];
	}
	else {
		return undefined;
	}
	return head.join(', ') + (tail ? ' and ' + tail : '');
}

test( "prepIndustry", function() {
	stop();
	expect(20);

	var bizPlanSummary = new BizPlanSummary();

	equal(bizPlanSummary._prepIndustry('Medicinal chemicals, uncompounded, manufacturing'), 'medicinal chemicals');
	equal(bizPlanSummary._prepIndustry('Seafood, canned, merchant wholesalers'), 'seafood');
	equal(bizPlanSummary._prepIndustry('Capes, waterproof (e.g., plastics, rubber, similar materials), cut and sewn from purchased fabric (except apparel contractors)'), 'capes');
	equal(bizPlanSummary._prepIndustry('Powdered drink mixes (except chocolate, coffee, tea, milk based) manufacturing'), 'powdered drink mixes manufacturing');
	equal(bizPlanSummary._prepIndustry('Vanities, metal household-type, manufacturing'), 'vanities');
	equal(bizPlanSummary._prepIndustry('Video tape stores'), 'video tape stores');
	equal(bizPlanSummary._prepIndustry('Exterior wood shutters manufacturing'), 'exterior wood shutters manufacturing');
	equal(bizPlanSummary._prepIndustry('Pizza parlors, limited-service'), 'limited-service pizza parlors');
	equal(bizPlanSummary._prepIndustry('Tractors, industrial, manufacturing'), 'tractors');
	equal(bizPlanSummary._prepIndustry('Chinaware, household-type, merchant wholesalers'), 'chinaware');
	equal(bizPlanSummary._prepIndustry('Nonhazardous waste treatment and disposal facilities (except combustors, incinerators, landfills, sewer systems, sewage treatment facilities)'), 'nonhazardous waste treatment and disposal facilities');
	equal(bizPlanSummary._prepIndustry('Space transportation, freight, nonscheduled'), 'space transportation');
	equal(bizPlanSummary._prepIndustry('Air-conditioner, window, repair and maintenance services'), 'air-conditioner');
	equal(bizPlanSummary._prepIndustry('Animal fats (except poultry and small game) produced in slaughtering plants'), 'animal fats produced in slaughtering plants');
	equal(bizPlanSummary._prepIndustry('Voltage regulators, transmission and distribution, manufacturing'), 'voltage regulators');
	equal(bizPlanSummary._prepIndustry('Mine ties, wood, treated, manufacturing'), 'mine ties');
	equal(bizPlanSummary._prepIndustry('Deodorants, personal, manufacturing'), 'deodorants');
	equal(bizPlanSummary._prepIndustry('Gas analyzers, industrial process-type, manufacturing'), 'gas analyzers');
	equal(bizPlanSummary._prepIndustry('Newspaper columnists, independent (freelance)'), 'independent newspaper columnists');
	equal(bizPlanSummary._prepIndustry('Environmental control system installation'), 'environmental control system installation');

	start();
});


test("cleanup", function() {
	stop();
	var sids = [
	stratFileId, 
	stratFileForGanttId
	];
	expect(sids.length);
	var requestsFinished = 0;

	function fireDeleteStratfile(sid) {
	    return $.ajax({
		url: serverURL + "/stratfiles/" + sid,
		type: "DELETE",
		dataType: 'json',
		contentType: "application/json; charset=utf-8"
		})
		.done(function(response, textStatus, jqXHR) {
			equal(response.status, "success", "cleanup check");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.error("%s: %s", textStatus, errorThrown);
		})
		.always(function() {
			if (++requestsFinished == sids.length) {
				start();
			}				
		});
	}

	var deferred = $.Deferred();
	deferred.resolve();

	$.each(sids, function(ix, sid) {
		deferred = deferred.then(function() {
			return fireDeleteStratfile(sid);
		});
	});

});