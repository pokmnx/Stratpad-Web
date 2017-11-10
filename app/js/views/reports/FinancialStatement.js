define(['Config', 'BaseReport', 'i18n!nls/FinancialStatement.i18n'],

  function(config, BaseReport, fLocalizable) {

    var view = BaseReport.extend({

      // useful for tests
      className: 'FinancialStatement',

      initialize: function(router, localizable) {
        var l = _.extend({}, fLocalizable, localizable);
        BaseReport.prototype.initialize.call(this, router, l);
        _.bindAll(this, 'load', 'localizedReportName', 'dates', 'fullDates', 'fullDatesArray', 'hasValues',
          'row', 'header', '_datesRowForYear', '_dataForYear', 'contentForCsv', 'slice8yArrays');
      },

      load: function() {
        BaseReport.prototype.load.call(this);
      },

      // @override
      localizedReportName: function() {
        return this.localized('title');
      },

      // @override
      beforeRender: function(json) {
        BaseReport.prototype.beforeRender.call(this, json);

        // todo: should have better localization strategy
        $('#disclaimer').text(this.localized('fs_disclaimer'));
      },

      // gives us a <tr> of 14 dates, spanning 5 yrs and 6 months, in varying formats (for summary financial statements)
      dates: function(startDate) {

        // startDate is in format yyyyMM
        // this is a pointer to our current date too
        var date = moment(startDate + '01', "YYYYMMDD");

        // clone and re-value the param
        startDate = moment(date);

        // first six months of the overall plan
        var dateRow = '';
        dateRow += '<tr class="rowDivider2">';
        dateRow += '<th>&nbsp;</th>';
        for (var i = 0; i < 6; i++) {
          date.add('months', i > 0 ? 1 : 0);
          dateRow += '<td>' + date.format('MMM YYYY') + '</td>';
        };

        // The quarter immediately following the sixth month. This should be titled Q3 & the year of the 12th month.
        date.add('months', 3);
        var yearEndDate = moment(startDate).add('months', 12).subtract('days', 1); // the end of the year, rather than the start of the next
        dateRow += '<td>Q3' + yearEndDate.format(' YYYY') + '</td>';

        // The quarter immediately following. This should be titled Q4 & the year that this quarter ends.
        date.add('months', 3);
        dateRow += '<td>Q4' + yearEndDate.format(' YYYY') + '</td>';

        // The quarter immediately following. This should be titled Q1 & the year AFTER the year of the previous quarter.
        date.add('months', 3);
        yearEndDate.add('years', 1);
        dateRow += '<td>Q1' + yearEndDate.format(' YYYY') + '</td>';

        // The quarter immediately following. This should be titled Q2 & the year of the quarter in the previous bullet.
        dateRow += '<td>Q2' + yearEndDate.format(' YYYY') + '</td>';

        // The year that INCLUDES the two quarters in the previous two bullets.
        dateRow += '<td>' + yearEndDate.format('YYYY') + '</td>';

        // Then the three years following the year in the previous bullet.
        for (var i = 1; i <= 3; i++) {
          yearEndDate.add('years', 1);
          dateRow += '<td>' + yearEndDate.format('YYYY') + '</td>';
        };

        dateRow += '</tr>';
        return dateRow;
      },

      // gives us a <tr> of 96 months in dateFormat (defaults to MMM YYYY) format
      fullDates: function(startDate, len, dateFormat) {
        len = len || 8 * 12;
        dateFormat = dateFormat || "MMM YYYY";
        var dateRow = '';
        dateRow += '<tr class="rowDivider2">';
        dateRow += '<th>&nbsp;</th>';

        var dateAry = this.fullDatesArray(startDate, len, dateFormat);
        for (var i = 0; i < dateAry.length; ++i) {
          dateRow += '<td>' + dateAry[i] + '</td>';
        };
        dateRow += '</tr>';

        return dateRow;
      },

      // gives us an array of default 96 months in dateFormat (defaults to MMM YYYY) format
      fullDatesArray: function(startDate, len, dateFormat) {
        len = len || 8 * 12;
        dateFormat = dateFormat || "MMM YYYY";

        // date is in format yyyyMM
        var date = moment.isMoment(startDate) ? moment(startDate) : moment(startDate + '01', "YYYYMMDD");

        // push month onto array
        var dates = [];
        for (var i = 0; i < len; i++) {
          date.add('months', i > 0 ? 1 : 0);
          dates.push(date.format(dateFormat));
        };
        return dates;
      },

      // true if any of the values are non-falsy
      hasValues: function(values) {
        if (!values) {
          return false;
        };
        for (var i = values.length - 1; i >= 0; i--) {
          var val = values[i];
          if (val) {
            return true;
          };
        };
        return false;
      },

      // indentLevel 1 is 0 px and the default; 2 is 5px (.rowLevel2)
      row: function(rowHeader, values, indentLevel, rowFormatter) {
        var row = '';
        rowFormatter = rowFormatter || this.rowFormatter;
        indentLevel = indentLevel ? indentLevel : 1;
        row += sprintf('<tr class="%s"><td class="rowLevel%s">%s</td>', (values ? '' : 'heading'), indentLevel, rowHeader);
        if (values) {
          $.each(values, function(index, value) {
            if (!value) value = 0;
            row += '<td val="' + value + '">' + rowFormatter(value) + '</td>';
          }.bind(this));
        } else {
          row += '<td>&nbsp</td>';
        }
        row += '</tr>';
        return row;
      },

      // we use this to give us the single row header column in the scrolling detail table
      header: function(rowHeader, values, indentLevel) {
        // keep the values param, even though not used, so that we can interchange 'header' with 'row' calls
        indentLevel = indentLevel ? indentLevel : 1;
        var row = '<tr><td class="rowLevel' + indentLevel + '">' + ($.stratweb.isBlank(rowHeader) ? '&nbsp;' : rowHeader) + '</td></tr>';
        return row;
      },

      _datesRowForYear: function(dates, year) {
        var dateRow = '';
        dateRow += '<tr class="rowDivider2">';
        dateRow += '<th>&nbsp;</th>';

        var dateAry = dates.slice(year * 12, (year + 1) * 12);

        for (var i = 0; i < dateAry.length; ++i) {
          dateRow += '<td>' + dateAry[i] + '</td>';
        };

        dateRow += '</tr>';
        return dateRow;

      },

      _dataForYear: function(data, year) {
        // create a new object with a bunch of sliced arrays
        // go through all objects and slice any arrays found
        var obj = {};
        var keys = _.keys(data);
        _.each(keys, function(key) {
          if (_.isArray(data[key])) {
            if (data[key].length % 12 == 0) {
              // cut it down and add it
              obj[key] = data[key].slice(year * 12, (year + 1) * 12);
            } else {
              obj[key] = [];
              var ary = data[key];
              for (var i = 0; i < ary.length; i++) {
                obj[key][i] = this._dataForYear(ary[i], year);
              };
            }
          } else if (_.isObject(data[key])) {
            // have to go through it again
            obj[key] = this._dataForYear(data[key], year);
          } else {
            // string, number, etc
            obj[key] = data[key];
          }

        }.bind(this));

        return obj;

      },

      // dataEndDate and userEndDate are optional and will be calculated if not provided
      // userStartDate already has one month subtracted
      _dataForDates: function(data, dataStartDate, userStartDate, dataEndDate, userEndDate) {
        // create a new object with a bunch of sliced arrays
        // go through all objects and slice any arrays found
        // if out of bounds, just return 0s
        // eg project might start next year, or it might have ended last year

        var dataEndDate = dataEndDate || moment(dataStartDate).add(this.duration, 'months');
        var userEndDate = userEndDate || moment(userStartDate).add(7, 'months');

        // no intersection at all, answer will just be 0's - short circuit
        var useZeroes = userStartDate.isAfter(dataEndDate) || userEndDate.isBefore(dataStartDate);
        var zeroes = [0, 0, 0, 0, 0, 0, 0]; // 6 + 1 months

        // is the user start and end fully contained within the data start and end?
        var isContained = (userStartDate.isSame(dataStartDate, 'months') || userStartDate.isAfter(dataStartDate)) && (userEndDate.isSame(dataEndDate, 'months') || userEndDate.isBefore(dataEndDate));

        // eg 201606 diff 201501 = 17
        var offset = userStartDate.diff(dataStartDate, 'months');

        var obj = {};
        var keys = _.keys(data);
        _.each(keys, function(key) {
          if (_.isArray(data[key])) {
            // sometimes we have an array of objects, we only want to slice arrays of numbers/nulls
            if (data[key].length && !_.isObject(data[key][0])) {
              // an array of numbers
              if (useZeroes) {
                obj[key] = zeroes;
              } else {
                if (isContained) {
                  // get the appropriate slice of the data
                  obj[key] = data[key].slice(offset, offset + 7);
                } else {
                  // we will have some zeroes at the beginning
                  if (offset > 0) {
                    obj[key] = Array(offset).fill(0);
                    obj[key].concat(data[key].slice(0, 7 - offset));
                  } else { // zeroes at the end
                    // data from the server always goes for 8y, even if we only have 3 month duration
                    obj[key] = data[key].slice(offset, 7)
                  }
                }
              }
            } else {
              // an array of objects
              obj[key] = [];
              _.each(data[key], function(o) {
                obj[key].push(this._dataForDates(o, dataStartDate, userStartDate, dataEndDate, userEndDate));
              }.bind(this));
            }

          } else if (_.isObject(data[key])) {
            // have to go through it again
            obj[key] = this._dataForDates(data[key], dataStartDate, userStartDate, dataEndDate, userEndDate);
          } else {
            // string, number, etc
            obj[key] = data[key];
          }

        }.bind(this));

        return obj;

      },

      subcontext: function(year) {
        return sprintf(this.localized('fs_subcontext'), year);
      },

      contentForCsv: function($tbl) {
        if (!$tbl) {
          $tbl = $(this.el).find('.reportTable');
        };
        var csv = "";

        // go through the head
        $tbl.find('thead tr td, thead tr th').each(function() {
          csv += '"' + $(this).text().trim() + '",';
        });
        csv += '\n';

        // through the body
        $tbl.find('tbody tr').each(function() {
          $(this).find('td, th').each(function() {
            var $cell = $(this);
            var val = $cell.attr('val');
            if (!val) {
              val = $cell.text().trim();
            };
            csv += '"' + val + '",';
          });
          csv += '\n';
        });

        return csv;
      },

      // parent is an object that may contain arrays
      slice8yArrays: function(obj, len) {
        var keys = Object.keys(obj);
        _.each(keys, function(key) {
          // if we have one of our 8y arrays, then slice it
          if (_.isArray(obj[key]) && obj[key].length == 8 * 12) {
            obj[key] = obj[key].slice(0, len);
          } else if (_.isObject(obj[key])) {
            this.slice8yArrays(obj[key], len);
          }
        }.bind(this));

      }

    });

    return view;
  });