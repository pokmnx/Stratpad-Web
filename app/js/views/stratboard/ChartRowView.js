define(['Chart', 'backbone'],
  function(Chart) {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.chartItem
      tagName: 'li',
      className: 'chartItem',

      initialize: function(router, chart, startDate, localizable) {
        _.bindAll(this, 'render', '_firstValue', '_lastValue', '_onTarget', '_linearRegression', '_miniLineChart', '_yAxisMax');
        this.router = router;
        this.chart = chart;
        this.startDate = startDate;
        this.localizable = localizable;

        // reset nv.utils.windowResize
        window.onresize = null;
      },

      render: function() {
        // properties are simply absent if they were not set

        var compiledTemplate = Handlebars.templates['stratboard/ChartRowView'];
        var context = _.extend(this.localizable.all(), this.chart.toJSON(), {
          // additional strings
          firstValue: this._firstValue(),
          lastValue: this._lastValue(),
          onTarget: this._onTarget(),
          hasWriteAccess: this.router.stratFileManager.currentStratFile().hasWriteAccess('STRATBOARD'),
          isQBOChart:(this.chart.get('hasAuthenticatedQBOConnection') && this.chart.get('projectionSource') == 'QBO')
        });

        if (this.chart.entityName == 'MetricChart') {
          context.subtext1 = this.chart.get('themeName');
          context.subtext2 = this.chart.get('objectiveSummary');
          context.subtext1Hint = sprintf(this.localizable.get('hintProject'), this.chart.get('themeName'));
          context.subtext2Hint = sprintf(this.localizable.get('hintObjective'), this.chart.get('objectiveSummary'));
        } else {
          context.subtext1 = sprintf(this.localizable.get('msgProjection'), this.localizable.get(this.chart.get('projectionAccountName')));
          context.subtext2 = null;
          context.subtext1Hint = null;
          context.subtext2Hint = null;
        }


        var html = compiledTemplate(context);
        this.$el.html(html); // xss safe
        this.$el.data('chartId', this.chart.id);
        this.$el.on(this.router.clicktype, 'svg, .icon-new-expand', function(e) {
          e.stopPropagation();
          e.preventDefault();
          var key = $(sprintf('#pageNavigation .stratboard span[model=%s]', this.chart.get('id'))).data('key');
          var parts = key.split(',');
          this.router.showStratPage(parts[0], parts[1], parts[2], true);
        }.bind(this));

        require(['nvd3'], function() {
          var options = {
            startDate: this.startDate
          };
          var chartType = this.chart.get('chartType');
          if (chartType == 1) {
            // line
            this._miniLineChart(options);
          } else if (chartType == 2) {
            // bar
            this._miniBarChart(options);
          } else if (chartType == 3) {
            // area
            _.extend(options, {
              area: true
            });
            this._miniLineChart(options);
          }
        }.bind(this));

        return this;
      },

      _firstValue: function() {
        var m = this.chart.get('measurements').sort(function(m1, m2) {
          return m1.date > m2.date;
        });
        m = _.filter(m, function(measurement) {
          return measurement.value != undefined
        });
        if (m.length) {
          var val = m[0].value;
          return ($.stratweb.isNumber(val)) ? $.stratweb.formatNumberWithParens(val) : this.localizable.get('N/A');
        } else {
          return this.localizable.get('N/A');
        }
      },

      _lastValue: function() {
        var m = this.chart.get('measurements').sort(function(m1, m2) {
          return m1.date > m2.date;
        });
        m = _.filter(m, function(measurement) {
          return measurement.value != undefined
        });
        if (m.length) {
          var val = m[m.length - 1].value;
          return ($.stratweb.isNumber(val)) ? $.stratweb.formatNumberWithParens(val) : this.localizable.get('N/A');
        } else {
          return this.localizable.get('N/A');
        }
      },

      _onTarget: function() {
        // measurements is just a pure array
        if (this.chart.get('measurements').length) {

          // sort by date
          var m = this.chart.get('measurements').sort(function(m1, m2) {
            return m1.date > m2.date;
          });
          // filter out measurements with no value
          m = _.filter(m, function(measurement) {
            return measurement.value != undefined
          });

          if (m.length) {

            var day0 = moment(m[0].date.toString(), $.stratweb.dateFormats. in );

            if (this.chart.has('targetDate') && this.chart.has('targetValue')) {
              var lr = this._linearRegression(m, day0);
              var targetDate = moment(this.chart.get('targetDate').toString(), $.stratweb.dateFormats. in );
              var targetValue = this.chart.get('targetValue');
              var x = targetDate.diff(day0, 'days');
              var actualValue = lr[0] * x + lr[1];

              var successIndicator = 'MEET_OR_EXCEED';
              if (this.chart.has('successIndicator')) {
                successIndicator = this.chart.get('successIndicator');
              };

              if (successIndicator == 'MEET_OR_EXCEED') {
                return (actualValue >= targetValue) ? this.localizable.get('YES') : this.localizable.get('NO');
              } else {
                return (actualValue <= targetValue) ? this.localizable.get('YES') : this.localizable.get('NO');
              }

            } else {
              return this.localizable.get('N/A');
            }

          } else {
            return this.localizable.get('N/A');
          }

        } else {
          return this.localizable.get('N/A');
        }
      },

      // return (a, b) that minimize
      // sum_i r_i * (a*x_i+b - y_i)^2
      _linearRegression: function(measurements, day0) {
        var i,
          x, y, r,
          sumx = 0,
          sumy = 0,
          sumx2 = 0,
          sumy2 = 0,
          sumxy = 0,
          sumr = 0,
          a, b;

        for (i = 0; i < measurements.length; i++) {
          // this is our data pair
          var d = moment(measurements[i].date.toString(), $.stratweb.dateFormats. in );
          var x = d.diff(day0, 'days');
          var y = measurements[i].value;

          // this is the weight for that pair
          // set to 1 (and simplify code accordingly, ie, sumr becomes xy.length) if weighting is not needed
          r = 1;

          // consider checking for NaN in the x, y and r variables here 
          // (add a continue statement in that case)

          sumr += r;
          sumx += r * x;
          sumx2 += r * (x * x);
          sumy += r * y;
          sumy2 += r * (y * y);
          sumxy += r * (x * y);
        }

        // note: the denominator is the variance of the random variable X
        // the only case when it is 0 is the degenerate case X==constant
        b = (sumy * sumx2 - sumx * sumxy) / (sumr * sumx2 - sumx * sumx);
        a = (sumr * sumxy - sumx * sumy) / (sumr * sumx2 - sumx * sumx);

        return [a, b];
      },

      _miniBarChart: function(options) {

        var self = this;

        options = _.defaults(options || {}, {
          startDate: moment().subtract('years', 2),
          endDate: moment(this.startDate).add('years', 2)
        });

        // fill in data - there's no forceX for bar charts
        var dateIterator = moment(options.startDate);
        var values = [];
        for (var i = 0; i < 24; i++) {
          values.push({
            date: dateIterator.format("YYYYMMDD"),
            value: 0,
            isData: false // not real data, for LR
          });
          dateIterator.add('month', 1);
        };

        // we can use a trick - real values should draw on top of these baseline 0's
        var measurements = this.chart.get('measurements');
        for (var i = 0, ct = measurements.length; i < ct; ++i) {
          values.push(measurements[i]);
        }

        // if no real values though, we still want to display our no data message
        if (!measurements.length) {
          values = [];
          self.$el.addClass('noValueSummaryChart');
        }

        // set up data for nv.d3
        var data = [];
        data.push({
          key: 'miniChart',
          values: values
        });

        nv.addGraph(function() {
          var chart = nv.models.multiBarChart()
            .color(function() {
              return Chart.hexColor(self.chart.get('colorScheme'));
            })
            .showControls(false) // grouped/stacked
            .showLegend(false)
            .showXAxis(false)
            .showYAxis(true)
            .x(function(d) {
              var date = moment(d.date.toString(), 'YYYYMMDD');
              return date.format('MMM YYYY');
            })
            .y(function(d) {
              return d.value * 1;
            })
            .tooltip(function(key, x, y, e, graph) {
              return '<p>' + e.value + ' in ' + x + '</p>';
            })
            .noData(self.localizable.get('NO_DATA'))
            ;

            self.$el.addClass('qboSummaryChart');

          if (self.chart.get('hasAuthenticatedQBOConnection') && self.chart.get('projectionSource') == 'QBO') {
            chart.noData(self.localizable.get('QBO_LINK'));
            self.$el.addClass('qboSummaryChart');
          }
          else if (self.chart.has('projectionId') && self.chart.get('projectionId')) {
            chart.noData(self.localizable.get('PROJECTED_VALUES'));
              if (!measurements.length) {
                self.$el.addClass('projectedSummaryChart');
              }
          }



          // use our formatter for dates along the x-axis
          chart.yAxis
            .tickFormat(function() {
              return '';
            }).ticks(5);

          chart.forceY([0]);

          chart.margin({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          });

          d3.select(self.$el.find('svg').get(0))
            .datum(data)
            .call(chart);

          nv.utils.windowResize(function resizeChart() {
            chart.update();
          });

          return chart;

        });

      },

      _miniLineChart: function(options) {

        var self = this;

        options = _.defaults(options || {}, {
          startDate: moment().subtract('years', 2),
          endDate: moment(this.startDate).add('years', 2)
        });

        var data = [];
        data.push({
          key: 'miniChart',
          values: this.chart.get('measurements'),
          area: 'area' in options && options.area
        });

        nv.addGraph(function() {

          // vertical line shows where the mouse is (along the chart line)
          var chart = nv.models.lineChart()
            .useInteractiveGuideline(false)
            .color(function() {
              return Chart.hexColor(self.chart.get('colorScheme'));
            })
            .tooltips(true)
            .showLegend(false)
            .showXAxis(false)
            .showYAxis(true)
            .tooltipContent(function(key, x, y, e, graph) {
              var date = moment(options.startDate).add('days', x).format('MMM DD, YYYY');
              return '<p>' + e.point.value + ' on ' + date + '</p>';
            })
            .noData(self.localizable.get('NO_DATA'))
            ;

          if (self.chart.get('projectionSource') == 'QBO') {
            chart.noData(self.localizable.get('QBO_LINK'));
            self.$el.addClass('qboSummaryChart');
          }
          else if (self.chart.has('projectionId') && self.chart.get('projectionId')) {
            chart.noData(self.localizable.get('PROJECTED_VALUES'));
              if (!self.chart.get('measurements').length) {
                self.$el.addClass('projectedSummaryChart');
              }
          }

          if (!self.chart.get('measurements').length) {
            self.$el.addClass('noValueSummaryChart');
          }

          // when looking for the x value of a point, call this function with the current dataPoint (datum)
          chart.x(function(datum, idx) {
            // we have to normalize to some sort of x-values
            var date = moment(datum.date.toString(), 'YYYYMMDD');
            var days = date.diff(options.startDate, 'days');
            return days;
          });

          // normalize y value
          chart.y(function(datum, idx) {
            return datum.value;
          });

          // use our formatter for dates along the x-axis
          chart.yAxis
            .tickFormat(function() {
              return '';
            }).ticks(5);

          var maxValue = _.max(data[0].values, function(m) {
                  return m.value*1;
              }).value*1; 

          chart.forceY([0, self._yAxisMax(maxValue)]);
          chart.forceX([0, 365 * 2]);

          chart.margin({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          });

          // this would turn off the circles and tooltips
          // chart.lines.scatter.interactive(false);

          // draw the chart
          d3.select(self.$el.find('svg').get(0))
            .datum(data)
            .call(chart);

          // resize listener
          nv.utils.windowResize(function resizeChart() {
            chart.update();
          });

          return chart;
        });
      },

      _yAxisMax: function(maxVal) {
        // add 10%
        // bring it down to a number between 1 and 10 (1<n<=10), recording magnitude
        // round to 2, 4, 5, 8, 10
        // multiply by magnitude to restore correct scale
        // eg. 7200 -> 7.2 -> 7.92 -> 8 -> 8000
        // eg. 135 -> 1.35 -> 1.485 -> 2 -> 200

        var n = maxVal * 1.10;
        var magnitude = 0;
        while (n > 10) {
          n /= 10;
          magnitude++;
        }

        var i = 0;
        var rounds = [2, 4, 5, 8, 10];
        var round = 0;
        while (round < n) {
          round = rounds[i++];
        }

        return round * Math.pow(10, magnitude);
      }

    });

    return view;
  });