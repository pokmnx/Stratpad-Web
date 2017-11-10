define(['BaseReport', 'views/reports/R6.Gantt', 'Config'],

    function(BaseReport, Gantt, config) {

        var view = Gantt.extend({

            reportName: 'BizPlanSummary.Progress',

            el: '#progress',

            initialize: function(router, localizable) {
                _.bindAll(this, "load");

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                Gantt.prototype.initialize.call(this, router, localizable);
                this.router = router;
            },

            load: function(callback) {
                BaseReport.prototype.load.call(this);

                var self = this;

                // fetch report for current stratFile
                return $.ajax({
                    url: config.serverBaseUrl + "/reports/r2?id=" + this.router.stratFileManager.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        // note that we have the option of dividing all values by 1000 here (basically if any values are greater than 100 000)
                        // - we might not need this though - we have more room on web
                        // this is bascally the R2 report, without paging, and condensed into 8+1 columns

                        self.$el = $(self.el);
                        if (!self.$el.length) {
                            // detailed bizplan - this needs to be the same as what we see in the bizplansummary template
                            self.$el = $('<table id="progress" class="reportTable"><thead><tr class="colHeader1"></tr></thead><tbody></tbody></table>');
                        };

                        // always 8 columns, but each column represents a variable amount of time
                        var durationInMonths = response.header.headers.length;
                        self.chartStartDate = moment(response.header.headers[0] + '01', self.dateFormat);
                        self.computeColumnIntervalForStrategyDuration(durationInMonths);
                        self.computeHeaders();
                        self.computeRows(response);

                        var stratFile = self.router.stratFileManager.stratFileCollection.get(self.router.stratFileManager.stratFileId);
                        var user = $.parseJSON($.localStorage.getItem('user'));
                        var currency = stratFile.get('currency') || user.preferredCurrency || '$';
                        var shouldDivideByOneThousand = false;
                        var footerKey = self.localized(shouldDivideByOneThousand ? "ALLOWING_US_TO_PROGRESS_FOOTER_THOUSANDS_TEMPLATE" : "ALLOWING_US_TO_PROGRESS_FOOTER_TEMPLATE");
                        var footer = sprintf("<tfoot><tr><td colspan=\"9\">%s</td></tr></tfoot>", sprintf(footerKey, _.escape(currency)));
                        self.$el.append(footer);

                        // for compatibility with R9.BizPlanSummary
                        if (callback) callback('ProgressChart');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            computeRows: function(json) {
                // basically we have the same rows we see in R2, with slightly different name
                // we just need to sum things up properly to fit into the 8 columns
                var self = this;

                // remove the date headers, to avoid calcs
                delete json.header;

                // netCumulative handled differently
                var netCumulativeValues = json.strategy.netCumulative;
                delete json.strategy.netCumulative;

                // calcs
                var order = [{
                    'groupHeader': 'revenue',
                    'rowHeadings': ['changeInRevenue', 'changeInCogs', 'total']
                }, {
                    'groupHeader': 'expenses',
                    'rowHeadings': ['changeInGa', 'changeInRd', 'changeInSm', 'total']
                }, {
                    'groupHeader': 'strategy',
                    'rowHeadings': ['netContribution' /*, 'netCumulative' */ ]
                }];
                var $tbody = this.$el.find("tbody");
                _.each(order, function(group) {
                    var groupHeader = group.groupHeader;
                    _.each(group.rowHeadings, function(rowHeading) {
                        var values = json[groupHeader][rowHeading];

                        var $row = $("<tr><td class=\"first\"></td></tr>");
                        $row.find(".first").text(self.localized(sprintf("%s_%s", groupHeader, rowHeading)));
                        $tbody.append($row);
                        // need to reduce the length of values to <= 8
                        var summedVals = [];
                        for (var j=0; j<8; ++j) {
                            var start = j*self.columnIntervalInMonths;
                            var end = Math.min(start + self.columnIntervalInMonths, values.length);
                            if (start < values.length) {
                                var sum = 0;
                                for (var k = start; k < end; ++k) {
                                    sum += values[k];
                                }
                                summedVals.push(sum);
                            };
                        }

                        for (var i=0; i<8; ++i) {
                            if (values.length > i) {
                                $row.append(sprintf("<td data='%s'>%s</td>", summedVals[i], $.stratweb.formatNumberWithParens(self.value(summedVals[i]))));
                            } else {
                                $row.append("<td>0</td>");
                            }
                        }
                    });
                });

                // netCumulative - take the existing netCumulative and add this column's netContribution
                var netCumulative = 0;
                var $row = $("<tr><td class=\"first\"></td></tr>");
                $row.find(".first").text(self.localized(sprintf("%s_%s", "strategy", "netCumulative")));
                $tbody.find('tr:last-child td:not(.first)').each(function(idx, ele) {
                    var data = $(ele).attr('data');
                    if (data != undefined && data != "undefined")
                        netCumulative += data*1;
                    $row.append("<td>" + $.stratweb.formatNumberWithParens(self.value(netCumulative)) + "</td>");
                });
                $tbody.append($row);

            },

            value: function(value) {
                if (value == undefined || value == null) {
                    return 0;
                } else {
                    return value;
                }
            }

        });

        return view;
    });