define(['ThemeCalculator'],

    function(ThemeCalculator) {

        var NetBenefitsCalculator = Class.extend({
            // idea is to gather up the duration and the relevant financial values for a theme
            // then, we calculate the values for each month, quarter, year over duration
            // sum them up and we are done

            // these properties end up on the prototype (this.__proto__)
            className: "NetBenefitsCalculator",

            initialize: function(themeJson) {

                // these props end up on the object (this)
                this.dateFormat = $.stratweb.dateFormats.in;
                this.themeJson = themeJson;

                // anon theme calc to cache  start and duration
                var tc = new ThemeCalculator(themeJson);
                this.startDate = tc.startDate;
                this.durationInMonths = tc.durationInMonths;
            },

            isEmpty: function(val) {
                return val != undefined && val != "";
            },

            hasValues: function(frequency) {
                // frequency = "OneTime" || "Monthly" || "Quarterly" || "Annually"
                var b =  
                this.isEmpty(this.themeJson["revenue" + frequency]) || 
                this.isEmpty(this.themeJson["cogs" + frequency]) || 
                this.isEmpty(this.themeJson["researchAndDevelopment" + frequency]) || 
                this.isEmpty(this.themeJson["generalAndAdmin" + frequency]) || 
                this.isEmpty(this.themeJson["salesAndMarketing" + frequency]);
                return b;
            },

            netBenefits: function() {
                var netBenefits = {};
                var numMonths = Math.min(this.durationInMonths, 12);

                var revTC = new ThemeCalculator(this.themeJson, ThemeCalculator.CalculatorTypeRevenue, this.durationInMonths, this.startDate);
                var cogsTC = new ThemeCalculator(this.themeJson, ThemeCalculator.CalculatorTypeCOGS, this.durationInMonths, this.startDate);
                var radTC = new ThemeCalculator(this.themeJson, ThemeCalculator.CalculatorTypeRAD, this.durationInMonths, this.startDate);
                var gaaTC = new ThemeCalculator(this.themeJson, ThemeCalculator.CalculatorTypeGAA, this.durationInMonths, this.startDate);
                var samTC = new ThemeCalculator(this.themeJson, ThemeCalculator.CalculatorTypeSAM, this.durationInMonths, this.startDate);


                revTC.calculate();
                cogsTC.calculate();
                radTC.calculate();
                gaaTC.calculate();
                samTC.calculate();

                // all the onetime rev/expenses for the duration
                var oneTimeRevenueBenefit = revTC.oneTimeValues[0] || 0;
                var oneTimeCogsBenefit = cogsTC.oneTimeValues[0] || 0;
                var oneTimeRadBenefit = radTC.oneTimeValues[0] || 0;
                var oneTimeGaaBenefit = gaaTC.oneTimeValues[0] || 0;
                var oneTimeSamBenefit = samTC.oneTimeValues[0] || 0;
                netBenefits.oneTimeBenefit = (oneTimeRevenueBenefit - oneTimeCogsBenefit) - (oneTimeRadBenefit + oneTimeGaaBenefit + oneTimeSamBenefit);


                // monthly
                var monthlyRevenueBenefit = 0;
                var monthlyCogsBenefit = 0;
                var monthlyRadBenefit = 0;
                var monthlyGaaBenefit = 0;
                var monthlySamBenefit = 0;

                for (var i = 0; i < numMonths; i++) {
                    monthlyRevenueBenefit += revTC.monthlyValues[i] || 0;
                    monthlyCogsBenefit += cogsTC.monthlyValues[i] || 0;
                    monthlyRadBenefit += radTC.monthlyValues[i] || 0;
                    monthlyGaaBenefit += gaaTC.monthlyValues[i] || 0;
                    monthlySamBenefit += samTC.monthlyValues[i] || 0;
                }
                netBenefits.monthlyBenefit = (monthlyRevenueBenefit - monthlyCogsBenefit) - (monthlyRadBenefit + monthlyGaaBenefit + monthlySamBenefit);


                // // quarterly - this doesn't actually happen anymore (no quarterly fields), but it doesn't hurt either
                // var quarterlyRevenueBenefit = 0;
                // var quarterlyCogsBenefit = 0;
                // var quarterlyRadBenefit = 0;
                // var quarterlyGaaBenefit = 0;
                // var quarterlySamBenefit = 0;

                // for (var i = 0; i < numMonths; i++) {
                //     quarterlyRevenueBenefit += revTC.quarterlyValues[i] || 0;
                //     quarterlyCogsBenefit += cogsTC.quarterlyValues[i] || 0;
                //     quarterlyRadBenefit += radTC.quarterlyValues[i] || 0;
                //     quarterlyGaaBenefit += gaaTC.quarterlyValues[i] || 0;
                //     quarterlySamBenefit += samTC.quarterlyValues[i] || 0;
                // }
                // netBenefits.quarterlyBenefit = (quarterlyRevenueBenefit - quarterlyCogsBenefit) - (quarterlyRadBenefit + quarterlyGaaBenefit + quarterlySamBenefit);


                // yearly
                var annualRevenueBenefit = 0;
                var annualCogsBenefit = 0;
                var annualRadBenefit = 0;
                var annualGaaBenefit = 0;
                var annualSamBenefit = 0;

                for (var i = 0; i < numMonths; i++) {
                    annualRevenueBenefit += revTC.annualValues[i] || 0;
                    annualCogsBenefit += cogsTC.annualValues[i] || 0;
                    annualRadBenefit += radTC.annualValues[i] || 0;
                    annualGaaBenefit += gaaTC.annualValues[i] || 0;
                    annualSamBenefit += samTC.annualValues[i] || 0;
                }
                netBenefits.annualBenefit = (annualRevenueBenefit - annualCogsBenefit) - (annualRadBenefit + annualGaaBenefit + annualSamBenefit);

                // seasonal
                var seasonalRevenueBenefit = 0;
                var seasonalCogsBenefit = 0;
                var seasonalRadBenefit = 0;
                var seasonalGaaBenefit = 0;
                var seasonalSamBenefit = 0;

                for (var i = 0; i < numMonths; i++) {
                    seasonalRevenueBenefit += revTC.seasonalValues[i] || 0;
                    seasonalCogsBenefit += cogsTC.seasonalValues[i] || 0;
                    seasonalRadBenefit += radTC.seasonalValues[i] || 0;
                    seasonalGaaBenefit += gaaTC.seasonalValues[i] || 0;
                    seasonalSamBenefit += samTC.seasonalValues[i] || 0;
                }
                netBenefits.seasonalBenefit = (seasonalRevenueBenefit - seasonalCogsBenefit) - (seasonalRadBenefit + seasonalGaaBenefit + seasonalSamBenefit);


                // net benefits (sum of the bottom row of totals)
                var totalBenefit = 0;
                totalBenefit += netBenefits.oneTimeBenefit;
                totalBenefit += netBenefits.monthlyBenefit;
                if (this.durationInMonths <= 12) {
                    totalBenefit += netBenefits.annualBenefit;
                }
                else {
                    totalBenefit += netBenefits.seasonalBenefit;
                }
                // totalBenefit += netBenefits.quarterlyBenefit;

                netBenefits.totalBenefit = totalBenefit;

                return netBenefits;

            }

        });

        return NetBenefitsCalculator;
    });