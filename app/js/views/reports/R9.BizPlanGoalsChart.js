define(['BaseReport', 'views/reports/R6.Gantt', 'Config'],

    function(BaseReport, Gantt, config) {

        var view = Gantt.extend({

            reportName: 'BizPlanSummary.Goals',

            // @override
            el:'#goals',

            // @override
            initialize: function(router, localizable, chartStartDate, columnIntervalInMonths) {
                _.bindAll(this, "load");

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                Gantt.prototype.initialize.call(this, router, localizable);
                this.router = router;
                this.chartStartDate = chartStartDate;
                this.columnIntervalInMonths = columnIntervalInMonths;
            },

            // @override
            load: function(callback) {
                BaseReport.prototype.load.call(this);
                
                var self = this;

                // fetch report for current stratFile
                return $.ajax({
                    url: config.serverBaseUrl + "/reports/r9?id=" + this.router.stratFileManager.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.$el = $(self.el);
                        if (!self.$el.length) {
                            // detailed bizplan - this needs to be the same as what we see in the bizplansummary template
                            self.$el = $('<table id="goals" class="reportTable"><thead><tr class="colHeader1"></tr></thead><tbody></tbody></table>');
                        };

                        // always 8 columns, but each column represents a variable amount of time
                        self.computeHeaders();
                        self.computeRows(response);

                        // for compatibility with R9.BizPlanSummary
                        if (callback) callback('GoalsChart');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            // @override
            computeRows: function(json) {
                var self = this;
                self.sortMetrics(json.metrics);
                _.each(json.metrics, function(metric) {

                    // each metric with a date and a value gets a number in its column
                    if (metric.targetDate && !$.stratweb.isBlank(metric.targetValue)) {
                        // add a row
                        var $row = $("<tr><td class=\"first\"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
                        $row.find(".first").text(metric.summary);
                        var $tbody = self.$el.find("tbody");
                        $tbody.append($row);

                        // find the correct column
                        var col;
                        var colEndDate = self.chartStartDate.clone();
                        var targetDate = moment(metric.targetDate.toString(), self.dateFormat);
                        colEndDate.add('months', self.columnIntervalInMonths);
                        for (var i=0; i<8; ++i) {
                            if (colEndDate.isAfter(targetDate) || colEndDate.isSame(targetDate)) {
                                // correct column
                                col = i + 2;
                                break;
                            } else {
                                colEndDate.add('months', self.columnIntervalInMonths);
                            }                    
                        }
                        var val = metric.targetValue;
                        var targetValue = $.stratweb.isNumber(val) ? $.stratweb.formatNumberWithParens(val) : val;
						$row.find('td:nth-child(' + col + ')').text(targetValue);

                    }

                });
                if (json.metrics.length == 0) {
                    var $row = $('<tr>').append( $('<td>').attr('colspan', 9).text(self.localized('no_goals')) );
                    self.$el.find("tbody").append($row);                    
                };
            }

        });

        return view;
    });