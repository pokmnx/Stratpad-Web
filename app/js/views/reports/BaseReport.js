define(['Config', 'i18n!nls/BaseReport.i18n', 'PageStructure'], 

    function(config, baseReportLocalizable, pageStructure) {

    var view = Class.extend({

        className: "BaseReport",

        el: '#pageContent',

        rowFormatter: $.stratweb.formatNumberWithParens,

        initialize: function(router, localizable) {
            _.bindAll(this, "load", "beforeRender", "showUnexpectedError");
            // basereport fills in props missing from localizable
            this._localizable = _.defaults(localizable || {}, baseReportLocalizable);

            this.router = router;

            // mimic a BackBone View
            this.$el = $(this.el);

            var self = this;

            // load in response to next/prev/click on sidebar nav
            // thing is, next/prev/click happens on the previous page - needs to be emitted after we initialize new page
            if (!this.boundEventPageChanged) {
                $(document).bind("pageChanged.reports", function(e, stratFileId) {
                    console.debug("pageChanged: loading report. " + self.reportName);
                    self.stratFileId = stratFileId;
                    self.load(e);
                });
                self.boundEventPageChanged = true;
            };

            // otherwise we have to defer load until StratFileManager finishes (ie on page reload, or the stratfile was switched)
            if (!this.boundEventStratFileLoaded) {
                $(document).bind("stratFileLoaded.reports", function(e, stratFile) {
                    console.debug("stratFileLoaded: loading report. " + self.reportName);

                    // when loading a new stratfile, always switch to first page (in case new stratfile doesn't have as many pages)
                    self.router.prepareStratPageForReport();

                    self.stratFileId = stratFile.get('id');
                    self.load(e);
                });
                self.boundEventStratFileLoaded = true;
            };

        },

        load: function() {
            var user = $.parseJSON($.localStorage.getItem('user'));
            if (!user) {
                // shouldn't ever get this situation
                console.error("No logged in user available. Need to relogin.");
                window.location = "index.html#login";
                return;
            }

            // let shared users know what page we're on
            this.router.messageManager.sendPageUpdate();            

            // now fetch report for current stratFile in subclass

        },

        localizedReportName: function() {
          return this.localized('heading');
        },            

        localized: function(key) {
            if (key in this._localizable) {
                return this._localizable[key];
            }
            else {
                return key;
            }
        },

        row: function(rowHeader, values) {
            var row = '';
            row += '<tr><td>' + rowHeader + '</td>';
            if (values) {
                $.each(values, function(index, value) {
                    if (!value) value = 0;
                    row += sprintf('<td val="%s">%s</td>', value, this.rowFormatter(value));
                }.bind(this));
            } else {
                row += '<td>&nbsp</td>';
            }
            row += '</tr>';
            return row;
        },

        contentForPdf: function() {
            // overridden for multipage reports
            return $('#pageContent article:first');
        },

        contentForCsv: function() {
            console.warn('Must be overridden for implementing reports.');
            return "No data.";
        },

		isExportEnabled: function(fileType){

			if (fileType == 'csv') {
				return false;
			}
			else if (fileType == 'pdf') {
				return true;
			}
			else if (fileType == 'docx') {
				return false;
			}
			else if (fileType == 'stratfile') {
				return true;
			} else {
				console.warn('Filetype not recognized by isExportEnabled.');
				return false;
			}
		},

        prepareTable: function() {
            var $tbl = $('.reportTable');
            $tbl.find('tbody').empty();
            return $tbl;
        },

        beforeRender: function(json) {
            var meta = json.meta;
            console.info(sprintf("%s - created: %s, duration: %s, fromCache: %s", this.reportName, moment(meta.generated).format(), meta.duration, meta.fromCache));
            delete json.meta;

            if (config.analytics) {
                ga('send', {
                  'hitType': 'event',          
                  'eventCategory': 'report',   
                  'eventAction': 'pageLoad',      
                  'eventLabel': this.reportName,
                  'eventValue': meta.duration
                });
            };

        },

        // 0-based year
        // note that json will be rearranged
        prepareForYear: function(json, year) {
            // limit to 12 columns
            // but also fill to 12 columns
            // slice the given year out
            // year total
            // subs year total

            var yearValues = {};
            $.each( json, function( groupTitle, rows ) {
                
                $.each( rows, function( rowHeader, values ) {
                    
                    // need to slice and potentially fill with 0's
                    var start = year * 12;
                    var end = Math.min((year+1)*12, values.length);
                    var vals = values.slice(start, end);
                    var ct = vals.length;

                    if (rowHeader == 'netCumulative') {
                        // the net cumulative is handled differently - we don't just sum and fill with 0's
                        // instead, we fill with the last value for the strategy/theme
                        // year sum is also the last monthly value of the year for the strategy/theme
                        // subsequent year sum is the last value for the strategy/theme over entire strategy duration
                        var lastVal = vals[ct-1];
                        for (var i = 0; i < 12-ct; i++) {
                            vals.push(lastVal);
                        }
                        vals.push(lastVal);
                        vals.push(values[values.length-1]);

                    } else {
                        var sum = _.reduce(vals, function(sum, num){ return sum + num; }, 0);
                        for (var i = 0; i < 12-ct; i++) {
                            vals.push(0);
                        };
                        vals.push(sum);

                        start = end;
                        end = values.length;
                        var futureVals = values.slice(start, end);
                        sum = _.reduce(futureVals, function(sum, num){ return sum + num; }, 0);
                        vals.push(sum);                        
                    }


                    // replace old array with new one
                    json[groupTitle][rowHeader] = vals;

                });
                
            });

        },

        spin:function(start) {
            if (start == undefined || start === true) {
                var $section = $('section > article section');
                var $loader = $('<div id="pageLoader"></div>');
                $section.prepend($loader);
                var w = $loader.parent().width();
                var h = $loader.parent().parent().height();
                $loader.css({position:'absolute', top:(h-44)/2+'px', left: (w-44)/2+'px'});
                $loader.show().spin();                
            } else {
                $('#pageLoader').spin(false).fadeOut(150);
            }
        },

        // all reports should sort themes automatically, by date
        // themes should be sorted by user order for F4 and sidebar only
        sortThemes: function(themes) {
            themes.sort(function(t1, t2) {
                if (t1.startDate && t2.startDate) {
                    return t1.startDate - t2.startDate; // -1 if t1 < t2
                } else if (t1.startDate) {
                    return 1; // t1 > undefined
                } else if (t2.startDate) {
                    return -1; // t2 > undefined
                } else {
                    // equal - use strings
                    return (t1.name || t1.themeName).localeCompare(t2.name || t2.themeName);
                }
                // user order
                // return t1.order - t2.order;
            });
        },

        sortObjectivesByDate: function(objectives) {
            objectives.sort(function(o1, o2) {
                // look at activities startDate, endDate and metrics.targetDate
                // take the earliest existing date
                var o1Dates = [];
                for (var i = o1.activities.length - 1; i >= 0; i--) {
                    var date = o1.activities[i].startDate;
                    if (date) { o1Dates.push(date); }
                    date = o1.activities[i].endDate;
                    if (date) { o1Dates.push(date); }
                };
                for (var i = o1.metrics.length - 1; i >= 0; i--) {
                    var date = o1.metrics[i].targetDate;
                    if (date) { o1Dates.push(date); }
                };
                var o2Dates = [];
                for (var i = o2.activities.length - 1; i >= 0; i--) {
                    var date = o2.activities[i].startDate;
                    if (date) { o2Dates.push(date); }
                    date = o2.activities[i].endDate;
                    if (date) { o2Dates.push(date); }
                };
                for (var i = o2.metrics.length - 1; i >= 0; i--) {
                    var date = o2.metrics[i].targetDate;
                    if (date) { o2Dates.push(date); }
                };
                o1Dates.sort();
                o2Dates.sort();

                if (o1Dates.length && o2Dates.length) {
                    return o1Dates[0] - o2Dates[0];
                } else if (o1Dates.length) {
                    return 1;
                } else if (o2Dates.length) {
                    return -1;
                } else {
                    return 0;
                }

            });
        },


        sortObjectivesByOrder: function(objectives) {
            var objectiveTypes = ["FINANCIAL", "CUSTOMER", "PROCESS", "STAFF", "COMMUNITY", "FUNDER"];
            objectives.sort(function(o1, o2) {
                var c1 = objectiveTypes.indexOf(o1.type) - objectiveTypes.indexOf(o2.type);
                if (c1 == 0) {
                    return o1.order - o2.order;
                } else {
                    return c1;
                }
                
            });
        },

        sortActivities: function(activities) {
            activities.sort(function(a1, a2) {
                // get the earliest existing date from startDate, endDate
                var a1Date = a1.startDate ? a1.startDate : a1.endDate;
                var a2Date = a2.startDate ? a2.startDate : a2.endDate;
                if (a1Date && a2Date) {
                    return a1Date - a2Date;
                } else if (a1Date) {
                    return 1;
                } else if (a2Date) {
                    return -1;
                } else {
                    return 0;
                }                
            });
        },

        sortMetrics: function(metrics) {
            metrics.sort(function(m1, m2) {
                if (m1.targetDate && m2.targetDate) {
                    return m1.targetDate - m2.targetDate;
                } else if (m1.targetDate) {
                    return 1;
                } else if (m2.targetDate) {
                    return -1;
                } else {
                    return 0;
                }                
            });
        },

        showUnexpectedError: function() {
            $('<div class="warning"></div>')
            .css({
              margin: '100px auto',
              width: '500px'
            })
            .html(this.localized('UNEXPECTED_ERROR')) // xss safe
            .appendTo($('#pageContent .content'));
        },

        subcontext: function() {
            // override if you want a subcontext in pdf
            return null;
        }

    });

    return view;
});