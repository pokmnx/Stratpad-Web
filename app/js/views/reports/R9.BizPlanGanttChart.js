define(['BaseReport', 'views/reports/R6.Gantt', 'Config'],

    function(BaseReport, Gantt, config) {

        var view = Gantt.extend({

            reportName: 'BizPlanSummary.Gantt',

            // @override
            initialize: function(router, localizable) {
                _.bindAll(this, "load");

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                Gantt.prototype.initialize.call(this, router, localizable);
                this.router = router;
                this.showMetrics = false;
            },

            // @override
            load: function(callback) {
                BaseReport.prototype.load.call(this);
                
                var self = this;

                // fetch report for current stratFile - return a promise
                return $.ajax({
                    url: config.serverBaseUrl + "/reports/gantt?id=" + this.router.stratFileManager.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.$el = $(self.el);
                        if (!self.$el.length) {
                            // detailed bizplan - this needs to be the same as what we see in the bizplansummary template
                            self.$el = $('<table id="gantt" class="reportTable"><thead><tr class="colHeader1"></tr></thead><tbody></tbody></table>');
                        };                        

                        // always 8 columns, but each column represents a variable amount of time
                        self.chartStartDate = moment(response.startDate.toString(), self.dateFormat).startOf("month");
                        self.computeColumnIntervalForStrategyDuration(response.duration);
                        self.computeHeaders();
                        self.computeRows(response);

                        // deals with the height of the row
                        // if it's not attached, we need to attach it, compute sizes, and then remove (ie for docx bizplan)
                        var isAttached = self.$el.closest('body').length;
                        if (!isAttached) {
                            // attach it, so that we can compute heights
                            $('body').append(self.$el);
                            
                            // deal with heights
                            var $gantt_tds = self.$el.find('td:not(.first)');
                            self.sizeTableCells($gantt_tds);

                            // done with it so can remove from body
                            self.$el.remove();

                        } else {
                            var $gantt_tds = self.$el.find('td:not(.first)');
                            self.sizeTableCells($gantt_tds);
                        }

                        // for compatibility with R9.BizPlanSummary
                        if (callback) callback('GanttChart');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            }

        });

        return view;
    });