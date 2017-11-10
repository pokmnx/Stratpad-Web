define(['Config', 'BaseReport'],

    function(config, BaseReport) {

        var view = BaseReport.extend({

            el:'#gantt',

            dateFormat: $.stratweb.dateFormats.in,

            reportName: 'Gantt',

            // in summary Gantt, we don't show metrics, but instead merge them with their parent objective
            showMetrics: true,

            numberOfColumns: 8,

            initialize: function(router, localizable) {
                _.bindAll(this, "load", "sizeTableCells", "refreshTableCellSizes", "computeHeaders", 
                    "computeRows", "computeColumnIntervalForStrategyDuration", "addBar", "addDiamond");
                BaseReport.prototype.initialize.call(this, router, localizable);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                this.$el.find("tr.colHeader1").empty();
                this.$el.find("tbody").empty();

                this.$el.spin({top: '50px'});
                
                var self = this;

                // fetch report for current stratFile
                $.ajax({
                    url: config.serverBaseUrl + "/reports/gantt?id=" + this.router.stratFileManager.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        // generally 8 columns, but each column represents a variable amount of time
                        self.chartStartDate = moment(response.startDate.toString(), self.dateFormat).startOf("month");
                        self.computeColumnIntervalForStrategyDuration(response.duration);
                        self.computeHeaders();
                        self.computeRows(response);

                        // deals with the height of the row
                        var $gantt_tds = $('#gantt td:not(.first)');
                        self.sizeTableCells($gantt_tds);

                        var resize_timer;
                        $(window).resize(function() {
                            clearTimeout(resize_timer);
                            resize_timer = setTimeout(function(){self.refreshTableCellSizes($gantt_tds)}, 500);
                        });

                        $('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error(sprintf("%s: %s", textStatus, errorThrown));
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });

            },

            computeHeaders: function() {
                var $row = this.$el.find("tr.colHeader1");
                var $rowHeader = $('<th></th>');
                $rowHeader.text(this.localized('r6_datesRowHeader'));
                $row.append($rowHeader);

                var date = this.chartStartDate.clone().startOf('month');
                for (var i = 0; i< this.numberOfColumns; ++i) {
                    date.add('months', i==0?0:this.columnIntervalInMonths);

                    var $colHeader = $('<th></th>');
                    $colHeader.text(date.format("MMM 'YY"));
                    $row.append($colHeader);
                }
            },

            computeRows: function(json) {
                var self = this;
                self.sortThemes(json.themes);
                _.each(json.themes, function(theme) {

                    // each theme gets a green bar from start to end date
                    var $row = $(sprintf("<tr class=\"theme\"><td class=\"first\"></td>%s</tr>", '<td></td>'.repeat(self.numberOfColumns)));
                    $row.find(".first").text(theme.name);
                    var $tbody = self.$el.find("tbody");
                    $tbody.append($row);

                    if (theme.startDate && theme.endDate) {
                        if (theme.startDate == theme.endDate) {
                            self.addDiamond($row, theme.startDate);
                        } else {
                            self.addBar($row, theme);
                        }

                    } else if (theme.startDate) {
                        // draw to the end
                        theme.endDate = self.chartStartDate.clone().add("months", self.numberOfColumns*self.columnIntervalInMonths).format(self.dateFormat);
                        self.addBar($row, theme);

                    } else if (theme.endDate) {
                        // draw from today to endDate, or from chartStart to endDate
                        var endDate = moment(theme.endDate.toString(), self.dateFormat);
                        var today = moment();
                        if (today.isBefore(endDate)) {
                            theme.startDate = today.format(self.dateFormat);
                        } else {
                            theme.startDate = self.chartStartDate.format(self.dateFormat);
                        }
                        
                    } else {
                        var endDate = self.chartStartDate.clone().add("months", self.numberOfColumns*self.columnIntervalInMonths);
                        var today = moment();
                        if (endDate.isAfter(today)) {
                            theme.startDate = today;
                        } else {
                            theme.startDate = self.chartStartDate;
                        }
                        theme.endDate = endDate;
                    }

                    self.sortObjectivesByDate(theme.objectives);
                    _.each(theme.objectives, function(objective) {
                        // empty row
                        var $row = $(sprintf("<tr class=\"objective\"><td class=\"first\"></td>%s</tr>", '<td></td>'.repeat(self.numberOfColumns)));
                        $row.find(".first").text(objective.name);
                        $tbody.append($row);

                        self.sortActivities(objective.activities);
                        _.each(objective.activities, function(activity) {
                            // grey bar
                            var $row = $(sprintf("<tr class=\"activity\"><td class=\"first\"></td>%s</tr>", '<td></td>'.repeat(self.numberOfColumns)));
                            $row.find(".first").text(activity.name);
                            $tbody.append($row);

                            if (activity.startDate && activity.endDate) {
                                if (activity.startDate == activity.endDate) {
                                    self.addDiamond($row, activity.startDate);
                                } else {
                                    self.addBar($row, activity);
                                }
                            } 
                            else if (activity.startDate) {
                                self.addDiamond($row, activity.startDate);
                            }
                            else if (activity.endDate) {
                                self.addDiamond($row, activity.endDate);
                            }
                            // else nothing

                        });

                        if (self.showMetrics) {
                            self.sortMetrics(objective.metrics);
                            _.each(objective.metrics, function(metric) {
                                if (metric.targetDate) {
                                    var rowHeader;
                                    if (metric.targetValue != undefined) {
                                        rowHeader = sprintf(self.localized("r6_metricReachRowHeader"), metric.targetValue, metric.name);
                                    } else {
                                        rowHeader = sprintf(self.localized("r6_metricAchieveRowHeader"), metric.name);
                                    }
                                    var $row = $(sprintf("<tr class=\"metric\"><td class=\"first\"></td>%s</tr>", '<td></td>'.repeat(self.numberOfColumns)));
                                    $row.find(".first").text(rowHeader);
                                    $tbody.append($row);

                                    self.addDiamond($row, metric.targetDate);

                                };
                            });                            
                        }
                        else {
                            // don't show metrics, instead if there is a metric with a target date, show the diamond in the objective; 
                            // if multiple metrics with target dates, take the latest date; 
                            // if no metrics - still show the objective basically as a header
                            // this also means we don't show metrics which just have a targetValue

                            var filteredMetrics = _.filter(objective.metrics, function(metric) {
                                if ('targetDate' in metric && metric.targetDate) {
                                    return true;
                                }
                            });

                            if (filteredMetrics.length == 0) {
                                // do nothing - leave objective as a header
                            }
                            else if (filteredMetrics == 1) {
                                self.addDiamond($row, filteredMetrics[0].targetDate);
                            }
                            else {
                                // sort by date desc - take the first
                                self.sortMetrics(filteredMetrics);
                                self.addDiamond($row, filteredMetrics[0].targetDate);
                            }

                        }

                    });

                });
            },

            addBar: function($row, themeOrActivity) {
                var startDate = moment(themeOrActivity.startDate.toString(), this.dateFormat);
                var endDate = moment(themeOrActivity.endDate.toString(), this.dateFormat);
                var durationInDays = endDate.diff(startDate, "days");

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

            addDiamond: function($row, targetDate) {
                var targetDate = moment(targetDate.toString(), this.dateFormat);

                // which column contains the targetDate?
                var col, left;
                var colEndDate = this.chartStartDate.clone();
                colEndDate.add('months', this.columnIntervalInMonths);
                for (var i=0; i<this.numberOfColumns; ++i) {
                    if (colEndDate.isAfter(targetDate) || colEndDate.isSame(targetDate)) {
                        // correct column
                        col = i + 2;

                        // now, how many days in this column? nb. can vary by several days
                        var colStartDate = colEndDate.clone().subtract('months', this.columnIntervalInMonths);
                        var days = colEndDate.diff(colStartDate, "days");
                        var offsetDays = targetDate.diff(colStartDate, "days");
                        left = offsetDays/days*100 + "%";

                        break;
                    } else {
                        colEndDate.add('months', this.columnIntervalInMonths);
                    }                    
                }

                // assemble the diamond element <i style="left:50%;"></i>
                var $diamond = $("<i></i>");
                $diamond.css({left:left});
                $diamond.attr("title", targetDate.format($.stratweb.dateFormats.out));

                // add it to correct col - nb, 1st data col is 2 (nth-child is 1-based, 1st col is rowHeader)
                if (col) {
                    $row.find("td:nth-child(" + col + ")").append($diamond);
                } else {
                    console.warn(sprintf("Couldn't compute a col, because the chart doesn't encompass a required date. chartStartDate: %s, columnIntervalInMonths: %s", this.chartStartDate, this.columnIntervalInMonths));
                }

            },          

            // for each cell (not including the row header) which will have either a diamond or a bar, add an innerWrapper div, and calc height
            sizeTableCells: function($tds) {
                $tds.each(function() {
                    var $el = $(this);
                    if ($el.html().length !== 0) {
                        var newDiv = $("<div />", {
                            "class": "innerWrapper",
                            "css": {
                                "height": $el.height(),
                                "width": "100%",
                                "position": "relative"
                            }
                        });
                        $el.wrapInner(newDiv);
                    }
                });
            },

            refreshTableCellSizes: function($tds) {
                $tds.each(function() {
                    var $td = $(this);
                    $td.children('.innerWrapper').css({
                        'height': 'auto'
                    });
                    $td.each(function() {
                        var $el = $(this);
                        if ($el.html().length !== 0) {
                            $el.children('.innerWrapper').height($el.height());
                        }
                    });
                });
            },

            computeColumnIntervalForStrategyDuration:function(durationInMonths)
            {
                // gernerally 8 columns
                if (durationInMonths <= this.numberOfColumns) {
                    this.columnIntervalInMonths = 1;
                }
                else if (durationInMonths <= this.numberOfColumns*3) {
                    this.columnIntervalInMonths = 3;
                }
                else if (durationInMonths <= this.numberOfColumns*6) {
                    this.columnIntervalInMonths = 6;
                }
                else {
                    this.columnIntervalInMonths = 12;
                }    
            }



        });

        return view;
    });