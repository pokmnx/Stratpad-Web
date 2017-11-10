define(['Config', 'BaseReport', 'MetricMeasurementCollection', 'Metric', 'ProjectionMeasurementCollection', 'Projection', 'Chart', 'ChartControlView', 'PageStructure', 'i18n!nls/StratBoardSummary.i18n', 'backbone'],

    function(config, BaseReport, MetricMeasurementCollection, Metric, ProjectionMeasurementCollection, Projection, Chart, ChartControlView, pageStructure, sbLocalizable) {

        var view = BaseReport.extend({

            el: 'article.chart',

            reportName: 'Chart',

            primaryChart: {
                chartModel:null, // backbone
                sourceModel:null, // backbone
                measurementCollection: null, // backbone
                measurements: null // massaged data
            }, 

            overlayChart: {},

            dataReady: 0,
            dataReadyThreshold: 0,

            initialize: function(router, chartModel, localizable) {
                _.bindAll(this, "load", "barChart", "lineChart", "toggleTarget", 'toggleTrendLine', 'changeColor', 
                    "_initMaxes", "_showHideTarget", '_showHideTrendLine', "_linearRegression", '_render', "_color", "_yAxisMax", '_reRender');
                _.defaults(localizable, sbLocalizable);
                BaseReport.prototype.initialize.call(this, router, localizable);

                this.primaryChart.chartModel = chartModel;

                // ipp & projection
                this.isProjectionChart = chartModel.entityName == 'ProjectionChart';

                var measurementCollection;
                if (this.isProjectionChart) {
                    measurementCollection = new ProjectionMeasurementCollection();
                    measurementCollection.setIds(chartModel.get('stratFileId'), chartModel.get('projectionId'));
                    this.primaryChart.measurementCollection = measurementCollection;

                    this.primaryChart.sourceModel = new Projection({
                        id: chartModel.get('projectionId'), 
                        stratFileId: chartModel.get('stratFileId')
                    });

                    // update measurements if projection source changes
                    this.primaryChart.sourceModel.off('change:source', null, 'ChartPage');
                    this.primaryChart.sourceModel.on('change:source', function(projection) {
                        console.debug('hey QBO');

                        // need to refresh our measurementCollection, because now it will have something totally different
                        this.primaryChart.measurementCollection.fetch({
                            reset: true,
                            success: function(collection) {
                                console.debug("Successfully downloaded new measurements.");
                                this._render();
                            }.bind(this),
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't load new measurements. Status: %s %s", xhr.status, xhr.statusText));
                            }
                        });

                    }.bind(this), 'ChartPage');
                } else {
                    measurementCollection = new MetricMeasurementCollection();
                    measurementCollection.setIds(chartModel.get('stratFileId'), chartModel.get('themeId'), chartModel.get('objectiveId'), chartModel.get('metricId'));
                    this.primaryChart.measurementCollection = measurementCollection;

                    this.primaryChart.sourceModel = new Metric({
                        id: chartModel.get('metricId'), 
                        stratFileId: chartModel.get('stratFileId'),
                        themeId: chartModel.get('themeId'),
                        objectiveId: chartModel.get('objectiveId')
                    });                    
                }

                // listen for new measurements being added to the model, and render
                // could possibly just chart update instead, if we made the measurement changes to our massaged data manaually
                measurementCollection.on("add", function(measurement) {
                    // sorted automatically
                    this._reRender();
                }.bind(this));

                measurementCollection.on("change", function(measurement) {
                    this.primaryChart.measurementCollection.sort();
                    this._reRender();
                }.bind(this));

                measurementCollection.on("destroy", function(measurement) {
                    this._reRender();
                }.bind(this));

                measurementCollection.on("reset", function() {
                    this._reRender();
                }.bind(this));

                // listen for changes to title
                this.primaryChart.chartModel.off('change:title', null, 'ChartPage');
                this.primaryChart.chartModel.on('change:title', function(chartModel) {
                    $('#pageContent header h2').text(chartModel.get('title'));
                }, 'ChartPage');                

            },

            load: function() {
                BaseReport.prototype.load.call(this);

                // because this is a basereport, load is called whenever we get a stratFileLoaded (we don't go through router)
                // since chartModel is kept around, it just re-renders the old chart
                // todo: note that we probably get this same scenario in reports with dynamic numbers of pages, and then switching to a stratfile with fewer report pages
                // we need to intercept and send the user to stratboardsummary
                var pageExists = pageStructure.pageExists(this.router.section, this.router.chapter, this.router.page);
                if (!pageExists) {
                    return this.router.showStratPage(this.router.section, 0, 0, true);
                };

                this.$el = $(this.el);
                this.$el.find('svg').empty();
                this.spin();

                var self = this, 
                    chartModel = this.primaryChart.chartModel;

                $('header hgroup h2').text(chartModel.get('title'));

                var h = this.$el.closest('#pageContent').height();
                this.$el.find('svg').css({
                    height: (h - 117) + 'px'
                });

                require(['nvd3'], function() {

                    // todo: overlays
                    // if (chartModel.has('overlay')) {
                    //     self.dataReadyThreshold += 1;
                    //     self._downloadOverlay(chartModel.get('overlay'));
                    // }

                    var deferred = $.Deferred();
                    deferred.resolve();

                    self.dataReadyThreshold += 1;
                    deferred = deferred.then(function() {
                        // the metric or the projection
                        return self.primaryChart.sourceModel.fetch({
                            success: function(model) {
                                self.dataReady += 1;
                                console.debug("Downloaded sourceModel for chart");
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't load sourceModel. Status: %s %s", xhr.status, xhr.statusText));
                            },
                            silent:true // don't hit the projection:change listener
                        });

                    });

                    self.dataReadyThreshold += 1;
                    deferred = deferred.then(function() {
                        return self.primaryChart.measurementCollection.fetch({
                            success: function(collection) {
                                console.debug("Successfully downloaded measurements.");
                                self.dataReady += 1;
                                self._render();
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't load measurements. Status: %s %s", xhr.status, xhr.statusText));
                            },
                            // we don't need to fire our listeners at this point
                            silent: true
                        });
                    });

                    if (self.isProjectionChart) {

                        // get the calculated values too; don't bother modeling this data
                        self.dataReadyThreshold += 1;
                        deferred = deferred.then(function() {
                            var stratFileId = self.primaryChart.chartModel.get('stratFileId');
                            var projectionId = self.primaryChart.chartModel.get('projectionId');
                            return $.ajax({
                                url: config.serverBaseUrl + "/stratfiles/" + stratFileId + "/projections/" + projectionId + "/calculatedValues",
                                type: "GET",
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8"
                            })
                            .done(function(response, textStatus, jqXHR) {
                                console.debug("Successfully downloaded projected values.");
                                self.projectedValues = response.data.measurements;
                                self.dataReady += 1;
                                self._render();
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                console.error("Oops couldn't load projected values. %s: %s", textStatus, errorThrown);
                            });                            
                        });

                    };

                });

            },

            // typically in response to a change in measurements
            _reRender: function() {
                this.$el.find('svg').empty();

                // reset chart handler, since otherwise it just keeps adding
                window.onresize = null;

                this._initMaxes();

                var chartType = this.primaryChart.chartModel.get('chartType');
                if (this.isProjectionChart) {
                    if (chartType == 1) {
                        // line plus bar
                        console.debug('todo: line plus bar');
                        this.projectionWithLineChart();
                    } else {
                        // bar plus bar
                        this.projectionWithBarChart();
                    }
                }
                else {
                    if (chartType == 1) {
                        // line
                        this.lineChart({
                        });
                    } else if (chartType == 2) {
                        // bar
                        this.barChart({
                        });
                    } else if (chartType == 3) {
                        // area
                        this.lineChart({
                            area: true
                        });
                    }                        
                }
            },

            _render: function() {
                // reset chart handler, since otherwise it just keeps adding
                window.onresize = null;

                var self = this, 
                    chartModel = this.primaryChart.chartModel;

                if (self.dataReady == self.dataReadyThreshold) {

                    // set up our chartControl, once everything is downloaded
                    this.chartControlView = new ChartControlView(this.router, this._localizable);
                    this.chartControlView.addChartControlToPage(this);
                    if (this.primaryChart.measurementCollection.length == 0) {
                      this.chartControlView.openChartControls();
                    };

                    self._initMaxes();

                    var chartType = chartModel.get('chartType');
                    if (this.isProjectionChart) {
                        if (chartType == 1) {
                            // line plus bar
                            console.debug('todo: line plus bar');
                            self.projectionWithLineChart();
                        } else {
                            // bar plus bar
                            self.projectionWithBarChart();
                        }
                    }
                    else {
                        if (chartType == 1) {
                            // line
                            self.lineChart({
                            });
                        } else if (chartType == 2) {
                            // bar
                            self.barChart({
                            });
                        } else if (chartType == 3) {
                            // area
                            self.lineChart({
                                area: true
                            });
                        }                        
                    }

                    // else don't render (eg.the overlay could be none = 0)
                    // comments is 4

                    // note that overlays will be a special case
                    // nv.models.linePlusBarChart
                    // nv.models.lineChart supports multiple series either area or not

                    
                    // note that we generally receive events twice, because we change, render, save, and get another change on successful save 
                    //  - (because we actually have some differences coming back from the server - wouldn't be there otherwise)
                    // we also have to make sure we don't just keep on adding listeners to the chartModel
                    chartModel.off("change:colorScheme", null, 'ChartPage');
                    chartModel.on("change:colorScheme", function(chartModel) {
                        if (self.isProjectionChart) {
                            // have to change the color right in the data series (or re-render, but that has the unpleasant side effect of rendering twice, because of above)
                            // there's also a way to get backbone to only emit an event once the color has been saved - would be a bit of a delay until we got this event though
                            // unfortunately can't get nv.d3 to query for the color in multiBarChart, which is why the direct set
                            var data = d3.select('article.chart svg').datum();
                            data[0].color = self._color();
                            if (data.length == 2) {
                                d3.select('article.chart svg').datum()[1].color = d3.rgb(self._color()).hsl().brighter().toString();
                                // d3.select('article.chart svg').datum()[1].color = self._color(1);
                            };
                        }
                        else {
                            // show/hiding the target takes care of updating the trendline
                            var showTarget = chartModel.get('showTarget');
                            self._showHideTarget(showTarget);
                        }
                        self.chart.update();                        

                    }, 'ChartPage');

                    chartModel.off("change:showTrend", null, 'ChartPage');
                    chartModel.on("change:showTrend", function(chartModel) {
                        var showTrend = chartModel.get('showTrend');
                        self._showHideTrendLine(showTrend);
                    }, 'ChartPage');

                    chartModel.off("change:showTarget", null, 'ChartPage');
                    chartModel.on("change:showTarget", function(chartModel) {
                        var showTarget = chartModel.get('showTarget');
                        self._showHideTarget(showTarget);
                    }, 'ChartPage');

                    chartModel.off("change:chartType", null, 'ChartPage');
                    chartModel.on("change:chartType", function(chartModel) {
                        console.debug('re-render chart!!!');
                        $('article.chart svg').empty();
                        self._render();
                    }, 'ChartPage');

                    self.spin(false);

                };
            },

            // todo: overlays
            // _downloadOverlay: function(uuid) {
            //     var chartModel = new Chart({uuid: uuid}, {isOverlay: true});

            //     this.dataReady +=1;
            //     this._render();
            //     return;

            //     var deferred = $.Deferred();
            //     deferred.resolve();

            //     deferred = deferred.then(function() {
            //         return chartModel.fetch({
            //             success: function(model) {

            //                 console.debug("Downloaded overlay chartModel");
            //             },
            //             error: function(model, xhr, options) {
            //                 console.error(sprintf("Oops, couldn't load overlay chartModel. Status: %s %s", xhr.status, xhr.statusText));
            //             }
            //         });
            //     });

            //     deferred = deferred.then(function() {
            //         return sourceModel.fetch({
            //             success: function(model) {
            //                 console.debug("Downloaded sourceModel for chart overlay");
            //             },
            //             error: function(model, xhr, options) {
            //                 console.error(sprintf("Oops, couldn't load overlay sourceModel. Status: %s %s", xhr.status, xhr.statusText));
            //             }
            //         });
            //     });

            //     deferred = deferred.then(function() {
            //         return measurementCollection.fetch({
            //             success: function(collection) {
            //                 console.debug("Successfully downloaded overlay measurements.");

            //                 // need to keep track of everything that needs downloading, before rendering

            //             },
            //             error: function(model, xhr, options) {
            //                 console.error(sprintf("Oops, couldn't load overlay measurements. Status: %s %s", xhr.status, xhr.statusText));
            //             }
            //         });
            //     });

            // },

            _initMaxes: function() {

                // it would appear that nv.d3 adds properties to these objects, but probably at the wrong level
                // it searches for color on an undefined datum, unless we massage our data initially, so massage it
                this.primaryChart.measurements = [];
                this.primaryChart.measurementCollection.each(function(measurement) {
                    // { date: 20131223, value: '1.56'}
                    var d = measurement.get('date').toString(); // string, for moment.js
                    var v = measurement.get('value')*1; // always a float, initially in the form of a string
                    // skip bad values
                    if (d.length == 8 && $.stratweb.isNumber(v) ) {
                        this.primaryChart.measurements.push({
                            date: d, 
                            value: v
                        });                        
                    };
                }.bind(this));

                // max measurement value
                this.maxValue = _.max(this.primaryChart.measurements, function(m) {
                    return m.value*1;
                }).value*1 || 0;                    

                this.minDate = _.min(this.primaryChart.measurements, function(m) {
                    return m.date*1;
                }).date || moment().format($.stratweb.dateFormats.in);

                this.maxDate = _.max(this.primaryChart.measurements, function(m) {
                    return m.date*1;
                }).date || moment(this.minDate.toString(), $.stratweb.dateFormats.in).add('years', 2).format($.stratweb.dateFormats.in);

            },
          

            lineChart: function(options) {

                var self = this;

                if (options === undefined) options = {};

                var data = [];
                data.push(
                {
                    key: this.primaryChart.sourceModel.get('summary') || this.localized(this.primaryChart.sourceModel.get('accountName')),
                    values: this.primaryChart.measurements,
                    area: options.hasOwnProperty('area') && options.area
                }
                // // overlay
                // ,{
                //     key: 'Test',
                //     values: [
                //         {date: '20120210', value: 800},
                //         {date: '20120310', value: 200},
                //         {date: '20120410', value: 1000},
                //         {date: '20120510', value: 700},
                //         {date: '20120610', value: 500},
                //     ],
                //     area: false
                // }
                );

                nv.addGraph(function() {

                    // vertical line shows where the mouse is (along the chart line)
                    var chart = nv.models.lineChart()
                        .useInteractiveGuideline(true)
                        .color(function() { return self._color(); })
                        .noData(self.localized('noDataChart'))
                        ;
                    self.chart = chart;

                    // determine startDate of series - default is now
                    var datum = data[0].values[0];
                    var startDate = moment();
                    if (datum) {
                        startDate = moment(datum.date, 'YYYYMMDD');
                    }

                    // when looking for the x value of a point, call this function with the current dataPoint (datum)
                    chart.x(function(datum, idx) {
                        // we have to normalize to some sort of x-values
                        var date = moment(datum.date, 'YYYYMMDD');
                        var days = date.diff(startDate, 'days');
                        return days;
                    });

                    // normalize y value
                    chart.y(function(datum, idx) {
                        return datum.value;
                    });

                    // force the y axis start and end
                    // nb. an area chart cannot go below 0
                    var maxVal = self.maxValue;
                    var showTarget = self.primaryChart.chartModel.has("showTarget") && self.primaryChart.chartModel.get("showTarget") != 0;
                    if (showTarget) {
                        // need both val and date, otherwise we couldn't plot anyway
                        var targetVal = self.primaryChart.sourceModel.has("targetValue") && self.primaryChart.sourceModel.has("targetDate") ? parseFloat(self.primaryChart.sourceModel.get('targetValue')) : 0;
                        maxVal = isNaN(targetVal) ? maxVal : Math.max(maxVal, targetVal);                            
                    };
                    chart.forceY([0, self._yAxisMax(maxVal)]);                        

                    // the start and end of the x axis
                    var minDate = moment(self.minDate, "YYYYMMDD").startOf('month'); // eg Feb 1, 2012

                    var maxDate = self.maxDate; // eg Jun 3, 2012
                    if (showTarget) {
                        // need both val and date, otherwise we couldn't plot anyway
                        var targetDate = self.primaryChart.sourceModel.has("targetValue") && self.primaryChart.sourceModel.has("targetDate") 
                            ? self.primaryChart.sourceModel.get('targetDate') : 0;
                        maxDate = Math.max(maxDate, targetDate);                            
                    };

                    // now we want the the first end of year which encompasses maxDate
                    var diff = moment(maxDate.toString(), "YYYYMMDD").diff(minDate, 'years'); // eg 0y
                    maxDate = moment(minDate).add('years', diff + 1);
                    maxDate.subtract('days', 1);

                    // now given that "0" is the first date measurement, calculate the relative dates
                    // eg chart.forceX([-14, 351]);
                    var start = minDate.diff(moment(self.minDate, "YYYYMMDD"), 'days');
                    var end = maxDate.diff(moment(self.minDate, "YYYYMMDD"), 'days');
                    chart.forceX([start, end]);

                    self.chart.renderTarget = self._renderTarget;
                    chart.renderTrendLine = self._renderTrendLine;

                    var formatter = function(d, idx) {
                        // add days back onto start
                        var date = moment(startDate);
                        date.add(d, 'days');
                        return date.format('MMM D, YYYY');
                    };
                    
                    chart.margin({
                        right: 40
                    });

                    // use our formatter for dates along the x-axis
                    chart.xAxis
                        .tickFormat(formatter);

                    // y axis number format and label
                    chart.yAxis
                        .axisLabel(self.primaryChart.sourceModel.get('summary'))
                        .tickFormat(d3.format(',f'));


                    // draw the chart
                    d3.select('article.chart svg')
                        .datum(data)
                        .transition()
                        .call(chart);

                    // takes care of trendLine too
                    self._showHideTarget(showTarget);

                    // resize listener
                    nv.utils.windowResize(function resizeChart() {
                        var h = self.$el.closest('#pageContent').height();
                        self.$el.find('svg').css({
                            height: (h - 117) + 'px'
                        });
                        chart.update();

                        // takes care of trendLine too
                        var showTarget = self.primaryChart.chartModel.has("showTarget") && self.primaryChart.chartModel.get("showTarget") != 0;
                        self._showHideTarget(showTarget);

                    });

                    return chart;
                });
            },

            barChart: function(options) {

                if (options === undefined) options = {};

                var self = this;

                // massage data
                var values = this.primaryChart.measurements.slice(0);
                var chartData = [{
                    key: this.primaryChart.sourceModel.get('summary') || this.localized(this.primaryChart.sourceModel.get('accountName')),
                    values: values
                }];

                // add data to finish off the year - there's no forceX for bar charts
                var date;
                if (this.primaryChart.measurements.length) {
                    var lastMeasurement = this.primaryChart.measurements[this.primaryChart.measurements.length-1];
                    date = moment( lastMeasurement.date, $.stratweb.dateFormats.in ).startOf('month');                  
                }
                else {
                    date = moment();
                }
                for (var i = 0, ct=(12-this.primaryChart.measurements.length%12); i < ct; i++) {
                    date.add('month', 1);
                    values.push({
                        date: date.format("YYYYMMDD"),
                        value: 0,
                        isData: false // not real data, for LR
                    });
                };

                nv.addGraph(function() {
                    self.chart = nv.models.multiBarChart()
                        // .barColor(d3.scale.category20().range())
                        .color(function() { return self._color(); })
                        .showControls(false) // grouped/stacked
                        // .delay(0) // little delay between animating each bar?
                        // .rotateLabels(45)
                        .groupSpacing(0.1)
                        .x(function(d) {
                            var date = moment(d.date, 'YYYYMMDD');
                            // placing on separate lines is a little tricky - would need to break into svg text/tspan elements
                            if (date.month() == 0) {
                                return date.format('MMM YYYY');
                            } else {
                                return date.format('MMM');
                            }
                            
                        })
                        .y(function(d) {
                            // this will be getY(d) in nv.d3.js
                            return d.value;
                        })
                        .tooltip(function(key, x, y, e, graph) {
                            return '<h3>' + key + '</h3>' +
                                   '<p>' +  y + ' in ' + x + '</p>';
                          })
                        .noData(self.localized('noDataChart'))
                      ;

                    // force the y axis start and end
                    var maxVal = self.maxValue;
                    var showTarget = self.primaryChart.chartModel.has("showTarget") && self.primaryChart.chartModel.get("showTarget") != 0;
                    if (showTarget) {
                        // need both val and date, otherwise we couldn't plot anyway
                        var targetVal = self.primaryChart.sourceModel.has("targetValue") && self.primaryChart.sourceModel.has("targetDate") ? parseFloat(self.primaryChart.sourceModel.get('targetValue')) : 0;
                        maxVal = isNaN(targetVal) ? maxVal : Math.max(maxVal, targetVal);                            
                    };
                    self.chart.forceY([0, self._yAxisMax(maxVal)]); 

                    self.chart.renderTarget = self._renderTarget;
                    self.chart.renderTrendLine = self._renderTrendLine;

                    self.chart.yAxis
                        .tickFormat(d3.format(',f'));

                    d3.select('article.chart svg')
                        .datum(chartData)
                        .transition()
                        .call(self.chart);

                    // takes care of trendLine too
                    self._showHideTarget(showTarget);

                    // reset nv.utils.windowResize
                    window.onresize = null;
                    nv.utils.windowResize(function resizeChart() {
                        var h = self.$el.closest('#pageContent').height();
                        self.$el.find('svg').css({
                            height: (h - 117) + 'px'
                        });
                        self.chart.update();

                        // takes care of trendLine too
                        var showTarget = self.primaryChart.chartModel.has("showTarget") && self.primaryChart.chartModel.get("showTarget") != 0;
                        self._showHideTarget(showTarget);

                    });

                    return self.chart;
                });


                // // if we use discreteBarChart, we can't really overlay because they don't share an x-axis
                // // if we use historicalBarChart, we can overlay, but we need to fool around with the data and group by month
                // // I think there's too many problems with historical

                // // can also use multibarChart, which also has an ordinal x-axis
                // // for overlay, we should massage data such that the linear line or area is also ordinal (rather than vice-versa)

                // ***
                // discreteBarChart or multibarchart (ordinal)
                // linePlusBarChart (linear)
                // lineChart (linear) does area and line + line and area + line and area + area
                // - we're just going to have to give up ordinality for now, in the line charts
                // ***

                // if we want ordinal throughout, will have to do custom charts (no area or line plots available for ordinal charts)
                // - also no way to make a linear chart look ordinal
            },

            projectionWithLineChart: function(options) {
                // todo
            },

            projectionWithBarChart: function(options) {
                if (options === undefined) options = {};

                var self = this;

                // let's assume we have those projection values handy from init
                // we'll also make sure initMaxes takes them into account, always

                // need to determine a startdate and duration
                // then run the measurements through our normalization routines


                // startDate can just be the strategyStartDate (ie the first date in the projections)
                // duration can look at the last measurement, min 1 year
                var numMeasurements = this.primaryChart.measurements ? this.primaryChart.measurements.length : 0;
                var startDate = moment(this.projectedValues[0].date.toString(), 'YYYYMMDD');
                var endDate, duration = 1;
                if (numMeasurements) {
                    endDate = moment(this.primaryChart.measurements[numMeasurements-1].date.toString(), 'YYYYMMDD');
                    var diff = endDate.diff(startDate, 'months') + 1;
                    diff = Math.max(diff, 12);
                    diff = Math.min(diff, 8*12);

                    // round up to nearest 12
                    duration = Math.floor(diff / 12) + ((diff%12)?1:0)
                }

                // massage data
                var m = this._filledArray(this.primaryChart.measurements, startDate, duration);

                // recalculate maxValue based on startDate
                var mValues = this._slicedArray(this.primaryChart.measurements, startDate, duration);                
                var maxValue = _.max(mValues, function(m) {
                    return m.value*1;
                }).value*1 || 0;

                var chartData = [{
                    key: sprintf(this.localized('actualValuesSeriesTitle'), this.localized(this.primaryChart.sourceModel.get('accountName'))),
                    values: m,
                    color: self._color()
                }];

                var showProjection = self.primaryChart.chartModel.has("showTarget") && self.primaryChart.chartModel.get("showTarget") != 0;
                if (showProjection) {
                    // eg.
                    // var pValues = [
                    //     { date: "20140423", value: 50},
                    //     { date: "20140523", value: 100},
                    //     { date: "20140623", value: 150}
                    // ];

                    // get data which matches our timeframe - at this point we are expecting a duration spanning a multiple of years
                    // var pValues = this.projectedValues.slice(0,24); // { date: 20140623, value: "150.000" }
                    var pValues = this._slicedArray(this.projectedValues, startDate, duration);

                    var pData = {
                      key: sprintf(this.localized('projectedValuesSeriesTitle'), this.localized(this.primaryChart.sourceModel.get('accountName'))),
                      values: pValues,
                      color: d3.rgb(self._color()).hsl().brighter().toString()
                      // color: self._color(1)

                        // complement color:
                        // var color = 0x320ae3;
                        // var complement = 0xffffff ^ color;                      
                    };
                    chartData.push(pData);

                    // max measurement value
                    this.pMaxValue = _.max(pValues, function(m) {
                      return m.value*1;
                    }).value*1; 

                }                     

                nv.addGraph(function() {
                  self.chart = nv.models.multiBarChart()
                      // .barColor(d3.scale.category20().range())
                      .color(function() { 
                        return self._color(); 
                    })
                      .showControls(false) // grouped/stacked
                      // .delay(0) // little delay between animating each bar?
                      // .rotateLabels(45)
                      .groupSpacing(0.1)
                      .x(function(d) {
                          var date = moment(d.date.toString(), 'YYYYMMDD');
                          // placing on separate lines is a little tricky - would need to break into svg text/tspan elements
                          // for this chart type (possible others too) labels must be unique
                          return date.format('MMM YY');                          
                      })
                      .y(function(d) {
                          // this will be getY(d) in nv.d3.js
                          return d.value*1;
                      })
                      .tooltip(function(key, x, y, e, graph) {
                          return '<h3>' + key + '</h3>' +
                                 '<p>' +  y + ' in ' + x + '</p>';
                        })
                    ;

                  // force the y axis start and end; use our locally calculated maxValue
                  var maxVal = Math.max(maxValue, showProjection ? self.pMaxValue : 0);
                  self.chart.forceY([0, self._yAxisMax(maxVal)]); // will dip below 0 as necessary, but without our algo

                  self.chart.renderTarget = self._renderTarget;
                  self.chart.renderTrendLine = self._renderTrendLine;

                  self.chart.yAxis
                      .tickFormat(d3.format(',f'));

                  d3.select('article.chart svg')
                      .datum(chartData)
                      .transition()
                      .call(self.chart);

                  // show trendLine if needed
                  var showTrendLine = self.primaryChart.chartModel.get('showTrend');
                  self._showHideTrendLine(showTrendLine);

                  // reset nv.utils.windowResize
                  window.onresize = null;
                  nv.utils.windowResize(function resizeChart() {
                      var h = self.$el.closest('#pageContent').height();
                      self.$el.find('svg').css({
                          height: (h - 117) + 'px'
                      });
                      self.chart.update();

                      // show trendLine if needed
                      var showTrendLine = self.primaryChart.chartModel.get('showTrend');
                      self._showHideTrendLine(showTrendLine);

                  });

                  return self.chart;
                });    

            },

            // determines a suitable max value for the y-axis, given the max point value
            _yAxisMax: function(maxVal) {
                // add 10%
                // bring it down to a number between 1 and 10 (1<n<=10), recording magnitude
                // round to 2, 4, 5, 8, 10
                // multiply by magnitude to restore correct scale
                // eg. 7200 -> 7.2 -> 7.92 -> 8 -> 8000
                // eg. 135 -> 1.35 -> 1.485 -> 2 -> 200

                if (!maxVal) { return 0; };
                
                var n = maxVal * 1.10;
                var magnitude = 0;
                while (n > 10) {
                    n /= 10;
                    magnitude++;
                }
                
                var i = 0;
                var rounds = [2,4,5,8,10];
                var round = 0;
                while (round < n) {
                    round = rounds[i++];
                }
                
                return round * Math.pow(10, magnitude);
            },

            // colorScheme can be an index or a keyName (eg. Red) or the actual colorscheme
            changeColor: function(colorScheme) {
                var which = 0, cs;
                if ($.stratweb.isNumber(colorScheme)) {
                    cs = _.findWhere(Chart.colorSchemes, {idx:colorScheme});
                }
                else if (typeof colorScheme === 'object' && colorScheme.hasOwnProperty('idx')) {
                    cs = colorScheme;
                }
                else {
                    colorScheme = colorScheme*1;
                    colorScheme = Math.min(colorScheme, Object.keys(Chart.colorSchemes).length-1);
                    cs = Chart.colorSchemes[colorScheme];
                }

                this.primaryChart.chartModel.set('colorScheme', cs.idx);
                // nb. we get one change event right now, and one after save (2 events)
                this.primaryChart.chartModel.save();

            },

            _color: function(which) {
                return Chart.hexColor(this.primaryChart.chartModel.get('colorScheme'), which);
            },

            toggleTarget: function() {
                var showTarget = this.primaryChart.chartModel.has("showTarget") && this.primaryChart.chartModel.get("showTarget") != 0;
                this.primaryChart.chartModel.set('showTarget', !showTarget);
                // nb. we get one change event right now, and one after save (2 events)
                this.primaryChart.chartModel.save();
            },

            _showHideTarget: function(showTarget) {
                // note that we will take care of updating the trendline as well (because the target can change the y-axis)

                if (this.isProjectionChart) {
                    // turn a bar chart overlay on and off, based on calculated values from a service
                    // we'll match the duration of the base values entered, or do at least 2 years from the start, to a max of 8 years
                    // we'll need to draw the projection as the base, and the values as the overlay
                    // we should get all the calculated values on init
                    if (showTarget) {
                        console.debug('todo: show projections');
                        // this will need to be a projectionWithBarChart (bar/bar) or a projectionWithLineChart (bar/line)
                        // a bar/area might not be a good fit
                        // start with bar/bar (multibar)

                        // we then have to make the chart type, the trendline and the color work
                        // easiest way to do that is if we stick with the values as the base layer, and the projections as the overlay
                        // might be able to just reverse the series at render time

                        // probably need to start with this type of chart initially, rather than when we hit the target button

                        // so in the end, all we will do here is turn off the overlay on the chart - which should be a rerender, but use the same dimensions
                        this._reRender();


                    }
                    else {
                        console.debug('hide projections');
                        this._reRender();

                        // this is probably the same chart, but with a param to turn off calculated values
                        // or is it the chart we have now? - the default chart?

                    }
                }
                else {

                    // metric chart shows regular targets
                    if (showTarget) {
                        if (this.primaryChart.sourceModel.has("targetValue") && this.primaryChart.sourceModel.has("targetDate")) {

                            // adjust the y-axis
                            var maxVal = this.maxValue;
                            var targetVal = parseFloat(this.primaryChart.sourceModel.get('targetValue'));
                            maxVal = isNaN(targetVal) ? maxVal : Math.max(maxVal, targetVal);                            
                            this.chart.forceY([0, this._yAxisMax(maxVal)]);  
                            this.chart.update();                      

                            // draw target
                            if (!isNaN(targetVal)) {
                                var xScale = this.chart.xScale || this.chart.multibar.xScale;
                                var yScale = this.chart.yScale || this.chart.multibar.yScale;
                                var x = xScale()(this.chart.x()({date:this.primaryChart.sourceModel.get('targetDate').toString()}));
                                var y = yScale()(this.chart.y()({value:targetVal}));

                                var w = (this.chart.lines || this.chart.multibar).width();
                                var h = (this.chart.lines || this.chart.multibar).height();

                                var color = d3.rgb('#' + this._color()).darker();

                                // if not stacked, want barWidth/2 otherwise want num
                                if (this.chart.multibar) {
                                    var offsetX = this.chart.multibar.xScale().rangeBand() * 0.5;
                                    x += offsetX;
                                };

                                this.chart.renderTarget(x, y, w, h, color);
                            };

                            // adjust trendline
                            var showTrend = this.primaryChart.chartModel.get('showTrend');
                            this._showHideTrendLine(showTrend);

                        } 
                        else {
                            var messageFormat = this.localized('targetWarning');
                            var message = sprintf(messageFormat, this.primaryChart.sourceModel.get('summary'));
                            vex.dialog.alert({
                                className: 'vex-theme-plain',
                                'message': message
                            }); 

                        }
                    } 
                    else {
                        // adjust the y-axis
                        this.chart.forceY([0, this._yAxisMax(this.maxValue)]);                        

                        // hide target
                        $('g.nv-wrap .sp-target').remove();

                        this.chart.update();

                        // adjust trendline
                        var showTrend = this.primaryChart.chartModel.get('showTrend');
                        this._showHideTrendLine(showTrend);

                    }

                }

            },

            toggleTrendLine: function() {
                var showTrend = this.primaryChart.chartModel.get('showTrend');
                this.primaryChart.chartModel.set('showTrend', !showTrend);
                // nb. we get one change event right now, and one after save (2 events)
                this.primaryChart.chartModel.save();
            },

            _showHideTrendLine: function(showTrendLine) {
                if (showTrendLine) {
                    var lr = this._linearRegression();
                    var w = (this.chart.lines || this.chart.multibar).width();
                    var h = (this.chart.lines || this.chart.multibar).height();
                    var color = d3.rgb('#' + this._color()).darker();
                    this.chart.renderTrendLine(lr[0] || 0, isNaN(lr[1]) ? h : lr[1], w, h, color);
                }
                else {
                    $('g.nv-wrap .sp-trendLine').remove();
                    this.chart.update();
                }
            },

            /**
             * return (a, b) that minimize
             * sum_i r_i * (a*x_i+b - y_i)^2
             */
            _linearRegression: function() {
                var i, 
                    x, y, r,
                    sumx=0, sumy=0, sumx2=0, sumy2=0, sumxy=0, sumr=0,
                    a, b;

                for(i=0;i<this.primaryChart.measurements.length;i++)
                {   
                    // this is our data pair
                    var xScale = this.chart.xScale || this.chart.multibar.xScale;
                    var yScale = this.chart.yScale || this.chart.multibar.yScale;
                    x = xScale()(this.chart.x()({date:this.primaryChart.measurements[i].date}));
                    y = yScale()(this.chart.y()({value:this.primaryChart.measurements[i].value}));

                    // this is the weight for that pair
                    // set to 1 (and simplify code accordingly, ie, sumr becomes xy.length) if weighting is not needed
                    r = 1;  

                    // consider checking for NaN in the x, y and r variables here 
                    // (add a continue statement in that case)

                    sumr += r;
                    sumx += r*x;
                    sumx2 += r*(x*x);
                    sumy += r*y;
                    sumy2 += r*(y*y);
                    sumxy += r*(x*y);
                }

                // note: the denominator is the variance of the random variable X
                // the only case when it is 0 is the degenerate case X==constant
                b = (sumy*sumx2 - sumx*sumxy)/(sumr*sumx2-sumx*sumx);
                a = (sumr*sumxy - sumx*sumy)/(sumr*sumx2-sumx*sumx);

                return [a, b];
            },

            _renderTrendLine: function(slope, yint, width, height, color) {
                // make sure we re-render without any other action
                // nb. with an area chart, we can't go value<0 (ie y>this.height())

                // origin is top left
                var xRange = [0, width];
                var yRange = [0, height];

                // points for our trendline, at x=0 and x=Xmax
                var p0 = [0, slope*0 + yint ];
                var p1 = [xRange[1], slope*xRange[1] + yint ];

                // basically the xrange of these points is ok to begin with, but the yrange might extend off the chart
                // do these points fit on the existing chart? eg. is the yint < 0 ?
                if (p0[1] > yRange[1]) {
                    // we have to recalculate p0, based on where it crosses the x-axis
                    // so what is x where y = yMax?
                    p0 = [(yRange[1]-yint)/slope, yRange[1]];
                };

                if (p0[1] < yRange[0]) {
                    // recalc at (xint, 0)
                    p0 = [(0-yint)/slope, 0];
                };

                if (p1[1] > yRange[1]) {
                    // what is x at y = yMax?
                    p1 = [(yRange[1]-yint)/slope, yRange[1]];
                };

                if (p1[1] < yRange[0]) {
                    // recalculate p1
                    p1 = [(yRange[0]-yint)/slope, yRange[0]];
                };

                var line = d3.select("g.nv-wrap .sp-trendLine line");

                if (line[0][0]) {
                    line
                    .style('stroke', color)
                    .transition()
                    // new coordinates; must follow chart.update()
                    .attr('x1', p0[0]).attr('y1', p0[1]).attr('x2', p1[0]).attr('y2', p1[1]);                            
                }
                else {
                    var container = d3.select("g.nv-wrap g")
                    .append('g')
                    .attr('class', 'sp-trendLine');

                    // horizontal line
                    container
                    .append("line")
                    .style('stroke', color)
                    .attr('x1', p0[0]).attr('y1', p0[1]).attr('x2', p1[0]).attr('y2', p1[1]);
                }
            },

            _renderTarget: function(x, y, width, height, color) {
                // make sure we re-render without any other action
                d3.select("g.nv-wrap .sp-target").remove();

                var container = d3.select("g.nv-wrap g")
                .append('g')
                .style('stroke', color)
                .style('fill', color)
                .attr('class', 'sp-target');

                // horizontal line
                container
                .append("line")
                .attr('x1', 0).attr('y1', y).attr('x2', width).attr('y2', y);

                // vertical line
                container
                .append("line")
                .attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', height);

                container
                .append('circle')
                .attr('cx', x).attr('cy', y).attr('r', 6)
            },

            /**
             * fill up the provided array with entries from startDate to duration; at least one entry per month; omit entries outside range
             * measurements - an array of eg. { date: "20161201", value: 2100}
             * startdate - a moment date
             * duration - number of years
             */
            _filledArray: function(measurements, startDate, duration) {

                // create a map with each monthyear -> ary
                // make sure each ary has at least one item
                // reconstruct the array from the map

                var map = {};
                var date = moment(startDate).subtract('months', 1).startOf('month');
                for (var i=0; i<duration*12; i++) {
                    date.add('months', 1);
                    var dateKey = date.format('YYYYMMDD');
                    if (!map.hasOwnProperty(dateKey)) {
                        map[dateKey] = [];
                    }
                    map[dateKey].push({ date: dateKey, value: null });
                }

                // fill up map
                for (var i = 0; i < measurements.length; i++) {
                    var entry = measurements[i];
                    var key = moment(entry.date.toString(), "YYYYMMDD").startOf('month').format('YYYYMMDD');
                    if (map.hasOwnProperty(key)) {
                        map[key].push(entry);
                    }
                };

                // re-construct array
                var filledAry = [];
                _.each(map, function(ary, key) {
                    if (ary.length == 1) {
                        filledAry.push(ary[0]);
                    }
                    else {
                        for (var i = 0; i < ary.length; i++) {
                            var entry = ary[i];
                            if (entry.value !== null) {
                                filledAry.push(entry);
                            };
                        };
                    }
                });

                // finally, sort
                _.sortBy(filledAry, function(entry) {
                    return entry.date;
                });

                return filledAry;

            },

            /**
             * From the provided projected Values, grab the slice which fits between startDate and startDate + duration; fill in lead or tail with null valued entries
             */
            _slicedArray: function(pMeasurements, startDate, duration) {
                var minDuration = 12; // months

                // assume dates are all on the first of the month
                // if we don't have pMeasurements for startDate over duration, then fill them in
                var dateKey = startDate.startOf('month').format('YYYYMMDD');
                var entry = _.find(pMeasurements, function(entry) {
                    return entry.date + '' === dateKey;
                });

                if (entry) {
                    var idx = pMeasurements.indexOf(entry);
                    var ary = pMeasurements.slice(idx, idx+duration*12);
                    if (ary.length < minDuration) {
                        return this._filledArray(ary, startDate, duration);
                    }
                    else {
                        return ary;
                    }
                }
                else {
                    // no pMeasurements with startDate - ie it is outside the range defined by startDate and duration
                    // do we have any intersection?

                    // find intersecting pMeasurements - any entries between startDate.firstOfMonth and startDate.firstOfMonth + duration
                    var start = startDate.startOf('month').format('YYYYMMDD')*1;
                    var end = moment(startDate.startOf('month')).add('years', duration).format('YYYYMMDD')*1;
                    var intersection = [];
                    for (var i = 0; i < pMeasurements.length; i++) {
                        var m = pMeasurements[i];
                        var d = m.date*1;
                        if (d >= start && d <= end) {
                            intersection.push(m);
                        }
                    };

                    var hasIntersection = intersection.length > 0;
                    if (hasIntersection) {
                        return this._filledArray(intersection, startDate, duration);
                    }
                    else {
                        return this._filledArray([], startDate, duration);
                    }
                }

            }          


        });

        return view;
    });