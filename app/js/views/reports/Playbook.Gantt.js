define(['BaseReport', 'views/reports/R6.Gantt', 'Config'],

    function(BaseReport, Gantt, config) {

        var view = Gantt.extend({

            reportName: 'Playbook.Gantt',

            // @override
            initialize: function(router, startDate) {
                _.bindAll(this, "load");

                // a moment
                this.startDate = startDate;

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                Gantt.prototype.initialize.call(this, router);
                this.router = router;
                // this.showMetrics = false;
            },

            // @override
            load: function() {
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

                        self.$el = $('<table id="gantt" class="reportTable"><thead><tr class="colHeader1"></tr></thead><tbody></tbody></table>');

                        self.numberOfColumns = 6;
                        self.chartStartDate = self.startDate;
                        self.computeColumnIntervalForStrategyDuration(6);
                        self.computeHeaders();
                        self.computeRows(response);

                        // deals with the height of the row
                        // attach it, so that we can compute heights
                        $('body').append(self.$el);
                        
                        // deal with heights
                        var $gantt_tds = self.$el.find('td:not(.first)');
                        self.sizeTableCells($gantt_tds);

                        // done with it so can remove from body
                        self.$el.remove();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            // @override
            addBar: function($row, themeOrActivity) {
                var startDate = moment(themeOrActivity.startDate.toString(), this.dateFormat);
                if ( startDate.isBefore(this.chartStartDate) ) {
                    startDate = this.chartStartDate;
                }
                var endDate = moment(themeOrActivity.endDate.toString(), this.dateFormat);
                var durationInDays = endDate.diff(startDate, "days");

                if (durationInDays <= 0) { return; };

                // how many columns? 
                var numCols = durationInDays / (this.columnIntervalInMonths * 30) * 100;
                var width = numCols + "%";

                // where is the start, in terms of a single column? ie 0-7? which column contains the start?
                // if we make startDate = 0 days, how many days to the start
                var offsetDays = startDate.diff(this.chartStartDate, "days");
                var offsetCols = offsetDays / (this.columnIntervalInMonths*30);
                var col = Math.floor(offsetCols) + 2;
                var offsetCol = offsetCols - Math.floor(offsetCols);
                var left = offsetCol*100 + "%";

                // assemble the green bar element
                var $bar = $("<b></b>");
                $bar.css({left:left, width:width});
                $bar.attr("title", sprintf("%s - %s", startDate.format($.stratweb.dateFormats.out), endDate.format($.stratweb.dateFormats.out)));

                // add it to correct col - nb, 1st data col is 2 (nth-child is 1-based, 1st col is rowHeader)
               if (col) {
                   $row.find("td:nth-child(" + col + ")").append($bar);
                } else {
                    console.warn(sprintf("Couldn't compute a col, because the chart doesn't encompass a required date. chartStartDate: %s, columnIntervalInMonths: %s", this.chartStartDate, this.columnIntervalInMonths));
                }

            },


        });

        return view;
    });