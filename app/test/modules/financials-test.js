var stratFileId, financialId, openingBalancesId;
var assetId, equityId, loanId;

module("financials");
test( "create stratfile", function() {
	stop();
	expect(1);

    $.ajax({
        url: serverURL + "/stratfiles",
        type: "POST",
        data: JSON.stringify({ name: "Qunit financial stratfile", uuid: generateUUID() }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "stratfile creation check" );
		stratFileId = response.data.stratFile.id;
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


test( "check financials", function() {
	stop();
	expect(1);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials", serverURL, stratFileId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "financials retrieval check" );
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
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
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test("import stratFile", function() {
	stop();
	expect(3);

	// get the xml first
	$.ajax({
		url: "GetToMarket.xml"
	})
	.done(function(response, textStatus, jqXHR) {
		
		var formData = new FormData();
		formData.append('files[]', jqXHR.responseText);

	    $.ajax({
	    	// filename param is only for tests, since we're not actually uploading a File, but a big string
	    	// ie we send Content-Disposition: form-data; name="files[]"; filename="GetToMarket.xml" from the browser
	    	// Content-Disposition: form-data; name="files[]" from tests
	        url: serverURL + "/stratfiles?filename=GetToMarket.xml&overwrite=keepboth",
	        type: "POST",
	        processData: false,
	        cache: false,
	        data: formData,
			contentType: false // in order to get the correct multipart boundary
		})
		.done(function(response, textStatus, jqXHR) {
			equal( response.status, "success", "import check" );
			equal( response.data.stratFile.name, "Get to Market!", "Stratfile name check");

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

test( "check financials on GetToMarket", function() {
	stop();
	expect(1);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials", serverURL, stratFileId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "financials retrieval check" );
		
		financialId = response.data.financial.id;
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "another way to retrieve financials", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s", serverURL, stratFileId, financialId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "financials retrieval check" );

		// we get the identical response for both URL's
		equal( response.data.financial.accountsPayableTerm, 30, "accountsPayableTerm" );
		equal( response.data.financial.accountsReceivableTerm, 21, "accountsReceivableTerm" );
		equal( response.data.financial.creationDate, response.data.financial.modificationDate, "mDate should equal cDate" );
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "modify financials", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s", serverURL, stratFileId, financialId),
        type: "PUT",
        data: JSON.stringify({ accountsPayableTerm: 60, accountsReceivableTerm: 90 }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "financials retrieval check" );
		equal( response.data.financial.accountsPayableTerm, 60, "accountsPayableTerm" );
		equal( response.data.financial.accountsReceivableTerm, 90, "accountsReceivableTerm" );
		ok( response.data.financial.creationDate < response.data.financial.modificationDate, "mDate should be gt cDate" );
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


test( "get opening balances", function() {
	stop();
	expect(18);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/openingBalances", serverURL, stratFileId, financialId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "opening balances retrieval check" );

		equal(response.data.openingBalance.accountsPayable, 0);
		equal(response.data.openingBalance.accountsReceivable, 0);
		equal(response.data.openingBalance.capitalStock, 0);
		equal(response.data.openingBalance.cash, 0);
		equal(response.data.openingBalance.currentPortionOfLtd, 0);
		equal(response.data.openingBalance.employeeDeductionsPayable, 0);
		equal(response.data.openingBalance.incomeTaxesPayable, 0);
		equal(response.data.openingBalance.inventory, 0);
		equal(response.data.openingBalance.loansFromShareholders, 0);
		equal(response.data.openingBalance.longTermAssets, 0);
		equal(response.data.openingBalance.longTermLoan, 0);
		equal(response.data.openingBalance.otherAssets, 0);
		equal(response.data.openingBalance.otherLiabilities, 0);
		equal(response.data.openingBalance.prepaidExpenses, 0);
		equal(response.data.openingBalance.prepaidPurchases, 0);
		equal(response.data.openingBalance.salesTaxPayable, 0);
		equal(response.data.openingBalance.shortTermLoan, 0);
		
		openingBalancesId = response.data.openingBalance.id;

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "get opening balances w/o using financials", function() {
	stop();
	expect(18);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/-1/openingBalances", serverURL, stratFileId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "opening balances retrieval check" );

		equal(response.data.openingBalance.accountsPayable, 0);
		equal(response.data.openingBalance.accountsReceivable, 0);
		equal(response.data.openingBalance.capitalStock, 0);
		equal(response.data.openingBalance.cash, 0);
		equal(response.data.openingBalance.currentPortionOfLtd, 0);
		equal(response.data.openingBalance.employeeDeductionsPayable, 0);
		equal(response.data.openingBalance.incomeTaxesPayable, 0);
		equal(response.data.openingBalance.inventory, 0);
		equal(response.data.openingBalance.loansFromShareholders, 0);
		equal(response.data.openingBalance.longTermAssets, 0);
		equal(response.data.openingBalance.longTermLoan, 0);
		equal(response.data.openingBalance.otherAssets, 0);
		equal(response.data.openingBalance.otherLiabilities, 0);
		equal(response.data.openingBalance.prepaidExpenses, 0);
		equal(response.data.openingBalance.prepaidPurchases, 0);
		equal(response.data.openingBalance.salesTaxPayable, 0);
		equal(response.data.openingBalance.shortTermLoan, 0);
		
		openingBalancesId = response.data.openingBalance.id;

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


test( "modify opening balances", function() {
	stop();
	expect(3);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/openingBalances/%s", serverURL, stratFileId, financialId, openingBalancesId),
        type: "PUT",
        data: JSON.stringify({ accountsPayable: 20000, accountsReceivable: 50000 }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "financials retrieval check" );
		equal( response.data.openingBalance.accountsPayable, 20000, "accountsPayable" );
		equal( response.data.openingBalance.accountsReceivable, 50000, "accountsReceivable" );
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});



// asset, equity, loan

test( "get assets", function() {
	stop();
	expect(10);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/assets", serverURL, stratFileId, financialId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "assets retrieval check" );

		equal(response.data.assets.length, 1);

		var asset = response.data.assets[0];

		equal(asset.financialId, financialId);

		equal(asset.date, 201206);
		equal(asset.depreciationTerm, 7);
		equal(asset.depreciationType, 'STRAIGHT_LINE');
		equal(asset.name, 'BMW');
		equal(asset.salvageValue, 4000);
		equal(asset.type, 'MACHINERY');
		equal(asset.value, 24000);

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		start();
	});

});

test( "add asset", function() {
	stop();
	expect(8);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/assets", serverURL, stratFileId, financialId),
        type: "POST",
        data: JSON.stringify({ date: 201304, depreciationTerm: 5, depreciationType: 'STRAIGHT_LINE', name: 'Subaru', salvageValue: 20000, type: 'MACHINERY', value: 25000 }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add asset check" );

		var asset = response.data.asset;

		equal(asset.date, 201304);
		equal(asset.depreciationTerm, 5);
		equal(asset.depreciationType, 'STRAIGHT_LINE');
		equal(asset.name, 'Subaru');
		equal(asset.salvageValue, 20000);
		equal(asset.type, 'MACHINERY');
		equal(asset.value, 25000);

		assetId = asset.id;
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});


test( "mod asset", function() {
	stop();
	expect(8);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/assets/%s", serverURL, stratFileId, financialId, assetId),
        type: "PUT",
        data: JSON.stringify({ date: 201305, depreciationTerm: 5, depreciationType: 'STRAIGHT_LINE', name: 'Subaru WRX', salvageValue: 21000, type: 'MACHINERY', value: 24000 }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add asset check" );

		var asset = response.data.asset;

		equal(asset.date, 201305);
		equal(asset.depreciationTerm, 5);
		equal(asset.depreciationType, 'STRAIGHT_LINE');
		equal(asset.name, 'Subaru WRX');
		equal(asset.salvageValue, 21000);
		equal(asset.type, 'MACHINERY');
		equal(asset.value, 24000);

		assetId = asset.id;
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "delete asset", function() {
	stop();
	expect(1);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/assets/%s", serverURL, stratFileId, financialId, assetId),
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "delete asset check" );
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "get equities", function() {
	stop();
	expect(6);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/equities", serverURL, stratFileId, financialId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "equities retrieval check" );

		equal(response.data.equities.length, 1);

		var equity = response.data.equities[0];

		equal(equity.financialId, financialId);

		equal(equity.date, 201205);
		equal(equity.value, 10000);
		equal(equity.name, 'Mary Blue');

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		start();
	});

});

test( "add equity", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/equities", serverURL, stratFileId, financialId),
        type: "POST",
        data: JSON.stringify({ date: 201301, value: 500, name: 'NASA' }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add equity check" );

		var equity = response.data.equity;

		equal(equity.date, 201301);
		equal(equity.name, 'NASA');
		equal(equity.value, 500);

		equityId = equity.id;
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "mod equity", function() {
	stop();
	expect(4);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/equities/%s", serverURL, stratFileId, financialId, equityId),
        type: "PUT",
        data: JSON.stringify({ date: 201201, value: 5000, name: 'NASA Inc' }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add equity check" );

		var equity = response.data.equity;

		equal(equity.date, 201201);
		equal(equity.name, 'NASA Inc');
		equal(equity.value, 5000);

		equityId = equity.id;
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "delete equity", function() {
	stop();
	expect(1);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/equities/%s", serverURL, stratFileId, financialId, equityId),
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add equity check" );
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "get loans", function() {
	stop();
	expect(10);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/loans", serverURL, stratFileId, financialId),
        type: "GET",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "opening balances retrieval check" );

		equal(response.data.loans.length, 1);

		var loan = response.data.loans[0];

		equal(loan.financialId, financialId);

		equal(loan.name, 'Car');
		equal(loan.date, 201206);
		equal(loan.amount, 11000);
		equal(loan.term, 24);
		equal(loan.rate, 8);
		equal(loan.type, 'PRINCIPAL_PLUS_INTEREST');
		equal(loan.frequency, 'QUARTERLY');

		loanId = loan.id;

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		start();
	});

});

test( "add loan", function() {
	stop();
	expect(8);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/loans", serverURL, stratFileId, financialId),
        type: "POST",
        data: JSON.stringify({ name: 'Subaru', date: 201302, amount: 5000, term: 48, rate: 5, type: 'PRINCIPAL_PLUS_INTEREST', frequency: 'MONTHLY' }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add loan check" );

		var loan = response.data.loan;

		equal(loan.name, 'Subaru');
		equal(loan.date, 201302);
		equal(loan.amount, 5000);
		equal(loan.term, 48);
		equal(loan.rate, 5);
		equal(loan.type, 'PRINCIPAL_PLUS_INTEREST');
		equal(loan.frequency, 'MONTHLY');
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "mod loan", function() {
	stop();
	expect(8);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/loans/%s", serverURL, stratFileId, financialId, loanId),
        type: "PUT",
        data: JSON.stringify({ name: 'Subaru WRX', date: 201310, amount: 10000, term: 60, rate: 5, type: 'PRINCIPAL_PLUS_INTEREST', frequency: 'MONTHLY' }),
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add loan check" );

		var loan = response.data.loan;

		equal(loan.name, 'Subaru WRX');
		equal(loan.date, 201310);
		equal(loan.amount, 10000);
		equal(loan.term, 60);
		equal(loan.rate, 5);
		equal(loan.type, 'PRINCIPAL_PLUS_INTEREST');
		equal(loan.frequency, 'MONTHLY');
		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "delete loan", function() {
	stop();
	expect(1);

    $.ajax({
        url: sprintf("%s/stratfiles/%s/financials/%s/loans/%s", serverURL, stratFileId, financialId, loanId),
        type: "DELETE",
        dataType: 'json',
		contentType: "application/json; charset=utf-8"
	})
	.done(function(response, textStatus, jqXHR) {
		equal( response.status, "success", "add loan check" );		
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
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
		console.error("%s: %s", textStatus, errorThrown);
	})
	.always(function() {
		// helps qunit go on its way
		start();
	});

});

test( "generate summary dates row", function() {
    stop();
    expect(43);

    var fs = new FinancialStatement();

    // // old way
    // var $dateRow = $(fs.dates('201205'));    
    // equal($($dateRow.find('td')[0]).text(), 'May 2012');
    // equal($($dateRow.find('td')[1]).text(), 'Jun 2012');
    // equal($($dateRow.find('td')[2]).text(), 'Jul 2012');
    // equal($($dateRow.find('td')[3]).text(), 'Aug 2012');
    // equal($($dateRow.find('td')[4]).text(), 'Sep 2012');
    // equal($($dateRow.find('td')[5]).text(), 'Oct 2012');
    // equal($($dateRow.find('td')[6]).text(), 'Q3 2013'); // Nov2012-Jan2013
    // equal($($dateRow.find('td')[7]).text(), 'Q4 2013'); // Feb2013-Apr2013
    // equal($($dateRow.find('td')[8]).text(), 'Q1 2013'); // May2013-Jul2013
    // equal($($dateRow.find('td')[9]).text(), 'Q2 2013'); // Aug2013-Oct2013
    // equal($($dateRow.find('td')[10]).text(), '2013');
    // equal($($dateRow.find('td')[11]).text(), '2014');
    // equal($($dateRow.find('td')[12]).text(), '2015');
    // equal($($dateRow.find('td')[13]).text(), '2016');
    // equal($dateRow.find('td').length, 14);

// first six months of the overall plan
// The quarter immediately following the sixth month. This should be titled Q3 & the year of the 12th month.
// The quarter immediately following. This should be titled Q4 & the year that this quarter ends.
// The quarter immediately following. This should be titled Q1 & the year AFTER the year of the previous quarter.
// The quarter immediately following. This should be titled Q2 & the year of the quarter in the previous bullet.
// The year that INCLUDES the two quarters in the previous two bullets.
// Then the three years following the year in the previous bullet.

    var $dateRow = $(fs.dates('201205'));
    equal($($dateRow.find('td')[0]).text(), 'May 2012');
    equal($($dateRow.find('td')[1]).text(), 'Jun 2012');
    equal($($dateRow.find('td')[2]).text(), 'Jul 2012');
    equal($($dateRow.find('td')[3]).text(), 'Aug 2012');
    equal($($dateRow.find('td')[4]).text(), 'Sep 2012');
    equal($($dateRow.find('td')[5]).text(), 'Oct 2012');
    equal($($dateRow.find('td')[6]).text(), 'Q3 2013'); // Nov2012-Jan2013
    equal($($dateRow.find('td')[7]).text(), 'Q4 2013'); // Feb2013-Apr2013
    equal($($dateRow.find('td')[8]).text(), 'Q1 2014'); // May2013-Jul2013
    equal($($dateRow.find('td')[9]).text(), 'Q2 2014'); // Aug2013-Oct2013
    equal($($dateRow.find('td')[10]).text(), '2014');
    equal($($dateRow.find('td')[11]).text(), '2015');
    equal($($dateRow.find('td')[12]).text(), '2016');
    equal($($dateRow.find('td')[13]).text(), '2017');
    equal($dateRow.find('td').length, 14);

    $dateRow = $(fs.dates('201408'));
    equal($($dateRow.find('td')[0]).text(), 'Aug 2014');
    equal($($dateRow.find('td')[5]).text(), 'Jan 2015');
    equal($($dateRow.find('td')[6]).text(), 'Q3 2015'); // Feb-Apr2015
    equal($($dateRow.find('td')[7]).text(), 'Q4 2015'); // May-Jul2015
    equal($($dateRow.find('td')[8]).text(), 'Q1 2016'); // Aug-Oct2015
    equal($($dateRow.find('td')[9]).text(), 'Q2 2016'); // Nov2015-Jan2016
    equal($($dateRow.find('td')[10]).text(), '2016');

    $dateRow = $(fs.dates('201502'));
    equal($($dateRow.find('td')[0]).text(), 'Feb 2015');
    equal($($dateRow.find('td')[5]).text(), 'Jul 2015');
    equal($($dateRow.find('td')[6]).text(), 'Q3 2016'); // Aug-Oct2015
    equal($($dateRow.find('td')[7]).text(), 'Q4 2016'); // Nov2015-Jan2016
    equal($($dateRow.find('td')[8]).text(), 'Q1 2017'); // Feb-Apr2016
    equal($($dateRow.find('td')[9]).text(), 'Q2 2017'); // May2016-Jul2016
    equal($($dateRow.find('td')[10]).text(), '2017');

    $dateRow = $(fs.dates('201401'));
    equal($($dateRow.find('td')[0]).text(), 'Jan 2014');
    equal($($dateRow.find('td')[5]).text(), 'Jun 2014');
    equal($($dateRow.find('td')[6]).text(), 'Q3 2014'); // Jul-Sep2014
    equal($($dateRow.find('td')[7]).text(), 'Q4 2014'); // Oct-Dec2014
    equal($($dateRow.find('td')[8]).text(), 'Q1 2015'); // Jan-Mar2015
    equal($($dateRow.find('td')[9]).text(), 'Q2 2015'); // Apr-Jun2015
    equal($($dateRow.find('td')[10]).text(), '2015');

    $dateRow = $(fs.dates('201403'));
    equal($($dateRow.find('td')[0]).text(), 'Mar 2014');
    equal($($dateRow.find('td')[5]).text(), 'Aug 2014');
    equal($($dateRow.find('td')[6]).text(), 'Q3 2015'); // Sep-Nov2014
    equal($($dateRow.find('td')[7]).text(), 'Q4 2015'); // Dec2014-Feb2015
    equal($($dateRow.find('td')[8]).text(), 'Q1 2016'); // Mar-May2015
    equal($($dateRow.find('td')[9]).text(), 'Q2 2016'); // Jun-Aug2015
    equal($($dateRow.find('td')[10]).text(), '2016');


    start();
});

