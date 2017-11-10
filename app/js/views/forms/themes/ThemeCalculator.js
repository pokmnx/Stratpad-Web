define([],

    function() {

        var ThemeCalculator = Class.extend({
            // idea is to gather up the duration and the relevant financial values for a theme, on a certain revenue on expense type (eg. COGS)
            // then, we calculate the values for each month, quarter, year over duration
            // sum them up and we are done

            // these properties end up on the prototype (this.__proto__)
            className: "ThemeCalculator",

            // startDate is an instance of moment
            initialize: function(themeJson, calculatorType, durationInMonths, startDate) {

                // these props end up on the object (this)
                this.dateFormat = $.stratweb.dateFormats.in;
                if (durationInMonths && startDate) {
                    // use predetermined (probably cached) values
                    this.startDate = startDate;
                    this.durationInMonths = durationInMonths;
                } else {
                    this.calculateStartAndDuration(themeJson);
                }

                this.oneTimeValues = [];
                this.monthlyValues = [];
                // this.quarterlyValues = [];
                this.seasonalValues = [];
                this.annualValues = [];

                // sum of oneTime, monthly, quarterly, seasonal and annual values, for each month
                this.monthlyCalculations = [];

                this.oneTimeValue = themeJson[calculatorType + "OneTime"];
                this.monthlyValue = themeJson[calculatorType + "Monthly"];
                // this.quarterlyValue = themeJson[calculatorType + "Quarterly"];
                this.annualValue = themeJson[calculatorType + "Annually"];
                
                this.monthlyAdjustment = themeJson[calculatorType + "MonthlyAdjustment"] || 0;
                // this.quarterlyAdjustment = themeJson[calculatorType + "QuarterlyAdjustment"] || 0;
                this.seasonalAdjustments = themeJson[sprintf('seasonal%sAdjustments', $.stratweb.capitalize(calculatorType))] || [];
                this.annualAdjustment = themeJson[calculatorType + "AnnuallyAdjustment"] || 0;

            },

            calculateStartAndDuration: function(themeJson) {

                if (themeJson.startDate && themeJson.endDate) {

                    // normalize to first of month and get diff
                    this.startDate = moment(themeJson.startDate.toString(), this.dateFormat);
                    var endDate = moment(themeJson.endDate.toString(), this.dateFormat);
                    this.durationInMonths = endDate.diff(this.startDate, "months") + 1;


                } else if (themeJson.startDate) {
                    // from startDate for 12 months
                    this.startDate = moment(themeJson.startDate.toString(), this.dateFormat);
                    this.durationInMonths = 12;

                } else if (themeJson.endDate) {
                    // from now until endDate if now < endDate, otherwise (endDate - 12 mo) to endDate
                    var now = moment();
                    var endDate = moment(themeJson.endDate.toString(), this.dateFormat);
                    if (now.isBefore(endDate)) {
                        this.startDate = now;
                        this.durationInMonths = endDate.diff(now, "months") + 1;
                    } else {
                        this.startDate = endDate.subtract(12, 'months');
                        this.durationInMonths = 12;
                    }

                } else {
                    // from now until 12 months from now
                    this.startDate = moment();
                    this.durationInMonths = 12;
                }

            },

            calculate: function() {

                this.calculateOneTimeValues();
                this.calculateMonthlyValues();
                // this.calculateQuarterlyValues();
                this.calculateSeasonalValues();
                this.calculateAnnualValues();   
                
                // sum the one-time, monthly, quarterly, and annual value for each month    
                for (var i = 0; i < this.durationInMonths; i++) {
                    var sum = 0;        
                    sum += this.oneTimeValues[i] || 0;
                    sum += this.monthlyValues[i] || 0;
                    // sum += this.quarterlyValues[i] || 0;
                    sum += this.seasonalValues[i] || 0;
                    // sum += this.annualValues[i] || 0;

                    this.monthlyCalculations.push(sum);
                }   
            },

            calculateOneTimeValues: function()
            {
                // no adjustments here
                for (var i = 0; i < this.durationInMonths; i++) {
                    if (i == 0) {
                        // nils become 0's
                        this.oneTimeValues.push(this.oneTimeValue);
                    } else {
                        this.oneTimeValues.push(0);
                    }
                }
            },

            calculateMonthlyValues: function()
            {
                // for each month, we have to compound the values
                var basicMonthly = this.monthlyValue;
                for (var i = 0; i < this.durationInMonths; i++) {
                    this.monthlyValues.push(basicMonthly);
                    basicMonthly = basicMonthly + (basicMonthly * this.monthlyAdjustment/100);
                }
            },

            calculateSeasonalValues: function() 
            {
                // this takes care of the old quarterly and annual values, as well as the new seasonal adjustments, and also annual adjustments
                // NB we do the calculation for as many years/months as we have, and then display what we need (which is 1y for net benefits)

                // possibilities:
                // we have an annual value (with implied even distro across months)
                // we have an annual and a seasonal distro
                // we have an annual value with a seasonal distro, plus an annual adjustment

                var annualMultiplier = 1;

                for (var i = 0; i < this.durationInMonths; i++) {

                    // we want a value for every month
                    // = 120000 * 0.06 * 1.0 (* 1.03 for y2, * 1.0609 for y3 etc)

                    // figure out month; first val in array is Jan, so if startDate is in May (5), then we use the 4th value in the array first (for i = 0)
                    var month = i + this.startDate.format('M')*1 - 1;
                    var monthlyValue = this.annualValue * this.seasonalAdjustment(month) * annualMultiplier;
                    this.seasonalValues.push(monthlyValue);

                    // increase the annual adjustment if we go beyond 1y
                    if (i >= 11 && i % 11 == 0) {
                        annualMultiplier = annualMultiplier * (1+this.annualAdjustment/100);
                    }

                }

            },

            seasonalAdjustment: function(month) {
                // remember that seasonalAdjustments are stored as an array of 12 months starting in january

                // if no seasonalAdjustments, we must use 8.333 to represent a year
                if (_.filter(this.seasonalAdjustments, function(val) { return val != null && val != 0; }).length == 0  ) {
                    return 100/12/100;
                };

                month = month % 12;
                if (month < this.seasonalAdjustments.length) {
                    return this.seasonalAdjustments[month]/100;
                }
                else {
                    return 0;
                }

            },

            calculateAnnualValues: function()
            {
                var basicAnnual = this.annualValue;
                    
                // when optimistic, annual values are included in the starting month of each year over the
                // duration of the theme.  e.g., months 0, 12, 24 ...
                for (var i = 0; i < this.durationInMonths; i++) {
                    
                    if (i % 12 == 0) {
                        this.annualValues.push(basicAnnual);
                        basicAnnual = basicAnnual + (basicAnnual * this.annualAdjustment/100);
                    } else {
                        this.annualValues.push(0);
                    }  

                }
            }          

        });

        // "statics"
        ThemeCalculator.CalculatorTypeRevenue = "revenue";
        ThemeCalculator.CalculatorTypeCOGS = "cogs";
        ThemeCalculator.CalculatorTypeRAD = "researchAndDevelopment";
        ThemeCalculator.CalculatorTypeGAA = "generalAndAdmin";
        ThemeCalculator.CalculatorTypeSAM = "salesAndMarketing";

        return ThemeCalculator;
    });