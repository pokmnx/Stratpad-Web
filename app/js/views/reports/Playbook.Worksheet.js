define(['BaseReport', 'views/reports/WorksheetDetail', 'i18n!nls/Worksheet.i18n', 'Config'],

    function(BaseReport, WorksheetDetail, WS_localizable, config) {

        var view = WorksheetDetail.extend({

            reportName: 'Playbook.Worksheet',

            // @override
            initialize: function(router, startDate) {
                _.bindAll(this, "load");

                // a moment
                this.startDate = startDate;

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                WorksheetDetail.prototype.initialize.call(this, router, WS_localizable);
                this.router = router;
            },

            // @override
            load: function(callback) {
                BaseReport.prototype.load.call(this);

                var self = this;

                // fetch report for current stratFile - return a promise
                return $.ajax({
                        url: config.serverBaseUrl + "/reports/worksheet/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': this.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.json = JSON.parse(JSON.stringify(response));

                        self.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';
                        self.loadWorksheetDetail(response, "MMM[linefeed]YYYY");
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

                // now add data for the current year
                this.addIncomeStatementRows($tbody, data, false);

                // // sum all the values in the row
                // this.addTotalColumn($thead, $tbody);


                $wrapper.append($tbl);

                // restore
                this.hasValues = hasValuesFunc;

                return $wrapper;
            },

            _datesRow: function(dates) {
                var dateRow = '';
                dateRow += '<tr class="rowDivider2">';
                dateRow += '<th>&nbsp;</th>';

                for (var i = 0; i < dates.length; ++i) {
                    dateRow += '<td>' + dates[i] + '</td>';
                };

                dateRow += '</tr>';
                return dateRow;

            }

        });

        return view;
    }
);