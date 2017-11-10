test("F4 - Theme durations", function() {
	stop();
	expect(8);

	// durations
	var calculator = new NetBenefitsCalculator({startDate: 20120106, endDate: 20130410});
	equal(calculator.durationInMonths, 16, "theme duration");

	calculator = new NetBenefitsCalculator({startDate: 20120101, endDate: 20130401});
	equal(calculator.durationInMonths, 16, "theme duration");

	calculator = new NetBenefitsCalculator({startDate: 20120106, endDate: 20130330});
	equal(calculator.durationInMonths, 15, "theme duration");

	calculator = new NetBenefitsCalculator({startDate: 20120406, endDate: 20120510});
	equal(calculator.durationInMonths, 2, "theme duration");

	calculator = new NetBenefitsCalculator({startDate: 20121106, endDate: 20130410});
	equal(calculator.durationInMonths, 6, "theme duration");


	calculator = new NetBenefitsCalculator({startDate: 20121106});
	equal(calculator.durationInMonths, 12, "theme duration");

	calculator = new NetBenefitsCalculator({endDate: 20121106});
	equal(calculator.durationInMonths, 12, "theme duration");

	calculator = new NetBenefitsCalculator({});
	equal(calculator.durationInMonths, 12, "theme duration");

	start();

});

test("F4 - Theme calculations", function() {
	stop();
	expect(24);

	// values based on type
	var theme = {startDate: 20121106, endDate: 20130410, revenueMonthly: 100, cogsAnnually: 500};
	var revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue, 6, moment(theme.startDate.toString(), 'YYYYMMDD'));
	equal(revTC.oneTimeValue, undefined, "oneTimeValue");
	equal(revTC.monthlyValue, 100, "monthlyValue");
	equal(revTC.annualValue, undefined, "annualValue");

	revTC.calculate();
	equal(revTC.monthlyValues.length, revTC.durationInMonths, "number of monthly revenue values");
	equal(revTC.monthlyValues[0], 100, "value check");
	equal(revTC.monthlyValues[1], 100, "value check");
	equal(revTC.monthlyValues[2], 100, "value check");


	var cogsTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeCOGS, 6, moment(theme.startDate.toString(), 'YYYYMMDD'));
	equal(cogsTC.oneTimeValue, undefined, "oneTimeValue");
	equal(cogsTC.monthlyValue, undefined, "monthlyValue");
	equal(cogsTC.annualValue, 500, "annualValue");

	cogsTC.calculate();
	equal(cogsTC.seasonalValues.length, cogsTC.durationInMonths, "number of seasonal cogs values");
	equal(cogsTC.seasonalValues[0], 500*100/12/100, "value check");
	equal(cogsTC.seasonalValues[1], 500*100/12/100, "value check");
	equal(cogsTC.seasonalValues[2], 500*100/12/100, "value check");

	// check monthly sums for all revenue and expenses
	theme = {startDate: 20121106, endDate: 20130410, revenueMonthly: 100, revenueAnnually: 50, revenueOneTime: 200};
	revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue, 6, moment(theme.startDate.toString(), 'YYYYMMDD'));
	revTC.calculate();
	equal(revTC.monthlyCalculations.length, 6, "number of monthly sums");
	equal(revTC.monthlyCalculations[0].toFixed(2), 304.17, "month 1 total");
	equal(revTC.monthlyCalculations[1].toFixed(2), 104.17, "month 2 total");
	equal(revTC.monthlyCalculations[2].toFixed(2), 104.17, "month 3 total");
	equal(revTC.monthlyCalculations[3].toFixed(2), 104.17, "month 4 total");
	equal(revTC.monthlyCalculations[4].toFixed(2), 104.17, "month 5 total");
	equal(revTC.monthlyCalculations[5].toFixed(2), 104.17, "month 6 total");

	// adjustments
	theme.revenueMonthlyAdjustment = 10;
	revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue, 6, moment(theme.startDate.toString(), 'YYYYMMDD'));
	revTC.calculate();
	equal(revTC.monthlyValues[0], 100, "month 1 total");
	equal(revTC.monthlyValues[1], 110, "month 2 total");
	equal(revTC.monthlyValues[2], 121, "month 3 total");

	start();

});

test("F4 - Theme seasonal calculations", function() {
	stop();
	expect(15);

	// < 1 yr
	var theme = {startDate: 20121106, endDate: 20130410, revenueAnnually: 1000, seasonalRevenueAdjustments: [4,5,6,7,8,9,10,9,8,7,6,5]};
	var revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue);
	revTC.calculate();

	equal(revTC.seasonalValues[0], theme.revenueAnnually*0.06, "month 1 total - < 1yr");
	equal(revTC.seasonalValues[1], theme.revenueAnnually*0.05, "month 2 total");
	equal(revTC.seasonalValues[2], theme.revenueAnnually*0.04, "month 3 total");

	// > 1 yr, with no yearly adjustment
	theme = {startDate: 20121106, endDate: 20151105, revenueAnnually: 10000, seasonalRevenueAdjustments: [4,5,6,7,8,9,10,9,8,7,6,5]};
	revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue);
	revTC.calculate();

	equal(revTC.seasonalValues[0], theme.revenueAnnually*0.06, "month 1 total - y1, no yearly adjustment");
	equal(revTC.seasonalValues[1], theme.revenueAnnually*0.05, "month 2 total");
	equal(revTC.seasonalValues[2], theme.revenueAnnually*0.04, "month 3 total");


	equal(revTC.seasonalValues[12], theme.revenueAnnually*0.06, "month 1 total - y2");
	equal(revTC.seasonalValues[13], theme.revenueAnnually*0.05, "month 2 total");
	equal(revTC.seasonalValues[14], theme.revenueAnnually*0.04, "month 3 total");

	// > 1yr with a yearly adjustment
	theme = {startDate: 20121106, endDate: 20151105, revenueAnnually: 100, seasonalRevenueAdjustments: [4,5,6,7,8,9,10,9,8,7,6,5], revenueAnnuallyAdjustment:3 };
	revTC = new ThemeCalculator(theme, ThemeCalculator.CalculatorTypeRevenue);
	revTC.calculate();

	equal(revTC.seasonalValues[0], theme.revenueAnnually*0.06, "month 1 total - y1, with yearly adjustment");
	equal(revTC.seasonalValues[1], theme.revenueAnnually*0.05, "month 2 total");
	equal(revTC.seasonalValues[2], theme.revenueAnnually*0.04, "month 3 total");


	equal(revTC.seasonalValues[12], theme.revenueAnnually*0.06*1.03, "month 1 total - y2");
	equal(revTC.seasonalValues[13], theme.revenueAnnually*0.05*1.03, "month 2 total");
	equal(revTC.seasonalValues[14], theme.revenueAnnually*0.04*1.03, "month 3 total");

	start();

});

test("F4 - Theme netBenefit calculations", function() {
	stop();
	expect(5);

	var theme = {startDate: 20120906, endDate: 20130410, 
		revenueMonthly: 100, revenueAnnually: 50, revenueOneTime: 200,
		cogsMonthly: 50,
		researchAndDevelopmentMonthly: 10,
		generalAndAdminMonthly: 20
	};

	var netBenefitsCalculator = new NetBenefitsCalculator(theme);
	equal(netBenefitsCalculator.durationInMonths, 8, "theme duration");

	var netBenefits = netBenefitsCalculator.netBenefits();
    equal(netBenefits.oneTimeBenefit, 200, "oneTimeBenefit");
    equal(netBenefits.monthlyBenefit, 160, "monthlyBenefit");
    equal(netBenefits.seasonalBenefit.toFixed(2), 33.33, "seasonalBenefit"); // the portion of the annual that applies, but is ignored for total benefits < 1 yr
    equal(netBenefits.totalBenefit, 410, "totalBenefit");

	start();

});


test("F4 - Theme netBenefit calculations + seasonal variation", function() {
	stop();
	expect(5);

	var theme = {startDate: 20120906, endDate: 20130410, 
		revenueMonthly: 100, revenueAnnually: 50, revenueOneTime: 200,
		seasonalRevenueAdjustments: [5,6,7,8,14,17,12,9,8,6,4,4], revenueAnnuallyAdjustment:3,
		cogsMonthly: 50,
		researchAndDevelopmentMonthly: 10,
		generalAndAdminMonthly: 20
	};

	var netBenefitsCalculator = new NetBenefitsCalculator(theme);
	equal(netBenefitsCalculator.durationInMonths, 8, "theme duration");

	var netBenefits = netBenefitsCalculator.netBenefits();
    equal(netBenefits.oneTimeBenefit, 200, "oneTimeBenefit");
    equal(netBenefits.monthlyBenefit, 160, "monthlyBenefit");
    equal(netBenefits.seasonalBenefit.toFixed(2), 24, "seasonalBenefit"); // the portion of the annual that applies, but is ignored because we only present 1 yr
    equal(netBenefits.totalBenefit.toFixed(2), 410, "totalBenefit");

	start();

});


