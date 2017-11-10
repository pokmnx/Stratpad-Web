define(['BaseReport', 'views/reports/IncomeStatementDetail', 'i18n!nls/IncomeStatement.i18n', 'Config'],

    function(BaseReport, IncomeStatementDetail, CF_localizable, config) {

        var view = IncomeStatementDetail.extend({

            reportName: 'Playbook.IncomeStatement',

            // @override
            initialize: function(router, startDate, cashFlow) {
                _.bindAll(this, "load");

                // a moment
                this.startDate = startDate;

                // the cash flow statement
                this.cashFlow = cashFlow;

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                IncomeStatementDetail.prototype.initialize.call(this, router, CF_localizable);
                this.router = router;
            },

            // @override
            load: function(callback) {
                BaseReport.prototype.load.call(this);

                var self = this;

                // fetch report for current stratFile - return a promise
                return $.ajax({
                        url: config.serverBaseUrl + "/reports/incomestatement/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': this.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        // add cashflow to json
                        response.netCash = self.cashFlow.json.netCash;

                        // clone of json, since loadIncomeStatementDetail will alter it
                        self.json = JSON.parse(JSON.stringify(response));

                        // our element for building the table
                        self.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';

                        // some setup, alters response (which is our json), typically used for on screen
                        self.loadIncomeStatementDetail(response, "MMM[linefeed]YYYY");

                        // operates on (and manipulates) this.json
                        self.$el = self.contentForPlaybook();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                        self.showUnexpectedError();
                    });

            },

            contentForPlaybook: function() {
                // need to divide up our data into years
                // should have column headers on each year
                var $wrapper = $('<div></div>');

                // nb we can have unlimited loans, equities etc
                // make sure each table starts on a new page - it can still be split if needed
                var $tblTemplate = $('<table class="reportTable"><thead></thead><tbody></tbody></table>');
                $tblTemplate
                    .css({
                        'page-break-inside': 'avoid'
                    });
                // .addClass('dynamicSubcontext');

                // add disclaimer 
                var $tblFooter = $('<tfoot><tr><td>');
                $tblFooter
                    .appendTo($tblTemplate)
                    .find('td')
                    .attr('id', 'disclaimer')
                    .attr('colspan', 15)
                    .text(this.localized('fs_disclaimer'));

                // if every month is zeroes, though, we still want to hide it
                this.prepData();

                // the problem is it looks silly in revenues if we have a line item appear for a year or two, and then disappear, because it's zeroes
                // plus it needs to match what we see on screen, so disable hasValues on a year by year basis
                // todo: should consider removing this.hasValues calls all together, in favour of preping data up front
                var hasValuesFunc = this.hasValues;
                this.hasValues = function(values) {
                    return values && values.length;
                };

                var $tbl = $tblTemplate.clone();
                var $thead = $tbl.find('thead');
                var $tbody = $tbl.find('tbody');

                var dataStartDate = moment(this.json.startDate + '01', "YYYYMMDD");

                // calculate all dates, from the user startDate
                var dates = this.fullDatesArray(this.startDate, 7);

                // add dates row              
                $thead.append(this._datesRow(dates));

                // get the correct slice of data
                var data = this._dataForDates(this.json, dataStartDate, this.startDate);

                this.postProcessData(data);

                // now add data for the current year
                this.addIncomeStatementRows($tbody, data, false);

                // sum all the values in the row
                // this.addTotalColumn($thead, $tbody);

                $wrapper.append($tbl);

                // restore
                this.hasValues = hasValuesFunc;

                return $wrapper;
            },

            postProcessData: function(data) {

                var profitTotals = data.cogs.totals;
                var revTotals = data.revenue.subtotals;
                var expenseTotals = data.expenses.subtotals;
                var ebitdaTotals = data.ebitda.totals;

                // calc gross margins
                data.cogs.grossMargins = _.map(profitTotals, function(profitTotal, idx){ 
                    return profitTotal/revTotals[idx]; 
                });

                // calc exp as %rev
                data.expenses.expPercentRevenues = _.map(expenseTotals, function(expenseTotal, idx){ 
                    return expenseTotal/revTotals[idx]; 
                });

                // calc ebitda as %rev
                data.ebitda.ebitdaPercentRevenues = _.map(ebitdaTotals, function(ebitdaTotal, idx){ 
                    return ebitdaTotal/revTotals[idx]; 
                });

            },

            // @override
            _datesRow: function(dates) {
                var dateRow = '';
                dateRow += '<tr class="rowDivider2">';
                dateRow += '<th>&nbsp;</th>';

                for (var i = 0; i < dates.length; ++i) {
                    dateRow += '<td>' + dates[i] + '</td>';
                };

                dateRow += '</tr>';
                return dateRow;

            },

            // @override
            addIncomeStatementRows: function ($tbody, json) {

                // add 3 sections
                $tbody.append(this.revenue(json.revenue));
                $tbody.append(this.cogs(json.cogs));
                $tbody.append(this.expenses(json.expenses));

                // spacer
                $tbody.append(this.row('&nbsp;'));

                // ebitda
                $tbody.append(this.ebitda(json.ebitda));

                // spacer
                $tbody.append(this.row('&nbsp;'));                

                // cash
                $tbody.append(this.cash(json.netCash));

            },

            cash: function (section) {
                var $div = $('<div/>');

                // cash
                $div.append(this.row(this.localized('is_cash')));
                $div.append(this.row(this.localized('is_cashAtStart'), section.startCash, 2));
                $div.append(this.row(this.localized('is_cashAtEnd'), section.endCash, 2));

                return $div.html();                
            },

            ebitda: function (section) {
                var $div = $('<div/>');

                // ebitda
                $div.append(this.row(this.localized('is_ebitda'), section.totals));

                // ebitda percent
                var $r = $(this.row(this.localized('is_ebitdaPercentRevenues'), section.ebitdaPercentRevenues, 2, $.stratweb.formatDecimalWithPercent));
                $r.addClass('emphasis');
                $div.append($r);

                return $div.html();                
            },

            // @override
            revenue: function (section) {
                var $div = $('<div/>');

                // row header
                $div.append(this.row(this.localized('is_revenue'), section.subtotals));

                return $div.html();
            },

            // @override
            cogs: function (section) {
                // always show COGS and running total
                var $div = $('<div/>');

                // row header + subtotals
                $div.append(this.row(this.localized('is_cogs'), section.subtotals, 2));

                // revenue - cogs
                var $r = $(this.row(this.localized('is_grossProfit'), section.totals, 2));
                $r.addClass('rowDivider1');
                $div.append($r);

                var $r = $(this.row(this.localized('is_grossMargin'), section.grossMargins, 2, $.stratweb.formatDecimalWithPercent));
                $r.addClass('emphasis');
                $div.append($r);


                // spacer
                $div.append(this.row('&nbsp;'));

                return $div.html();
            },

            // @override
            expenses: function (section, isDetail) {
                var $div = $('<div/>');

                // row header
                $div.append(this.row(this.localized('is_expenses')));

                // rows for each expense
                $div.append(this.row(this.localized('is_generalAndAdministrative'), section.generalAndAdministrative, 2));
                $div.append(this.row(this.localized('is_researchAndDevelopment'), section.researchAndDevelopment, 2));
                $div.append(this.row(this.localized('is_salesAndMarketing'), section.salesAndMarketing, 2));

                // total row
                var $total = $(this.row('&nbsp;', section.subtotals));
                $total.addClass('rowDivider1');
                $div.append($total);

                // percent revenues
                var $r = $(this.row(this.localized('is_expPercentRevenues'), section.expPercentRevenues, 2, $.stratweb.formatDecimalWithPercent));
                $r.addClass('emphasis');
                $div.append($r);

                // no spacer

                return $div.html();
            },



        });

        return view;
    }
);