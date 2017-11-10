define(['FinancialStatement', 'views/reports/IncomeStatementSummary', 'Config', 'PageStructure', 'ThemeCalculator'],

  function(FinancialStatement, IncomeStatementSummary, config, pageStructure, ThemeCalculator) {

    var view = IncomeStatementSummary.extend({

      el: "#incomeStatementDetail",

      reportName: 'IncomeStatementDetail',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "loadIncomeStatementDetail", "isExportEnabled", "contentForPdf", "contentForCsv", "prepData", "addTotalColumn");
        IncomeStatementSummary.prototype.initialize.call(this, router, localizable);
      },

      load: function() {
        FinancialStatement.prototype.load.call(this);

        this.$el.spin({top: '50px'});

        var self = this;

        pageStructure.setNumberOfReportPages(self.router.chapter, 1);
        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

        $.ajax({
          url: config.serverBaseUrl + "/reports/incomestatement/details",
          type: "GET",
          dataType: 'json',
          data: {
            'id': self.stratFileId
          },
          contentType: "application/json; charset=utf-8"
        })
          .done(function(response, textStatus, jqXHR) {

            // because json is altered for production of report, save a clone for pdf
            self.json = JSON.parse(JSON.stringify(response));

            self.beforeRender(response);

            self.loadIncomeStatementDetail(response);

          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("%s: %s", textStatus, errorThrown);
            self.showUnexpectedError();
          })
          .always(function() {
            self.$el.spin(false);
          });

      },

      isExportEnabled: function(fileType) {

        if (fileType == 'csv') {
          return true;
        } else {
          return FinancialStatement.prototype.isExportEnabled.call(this, fileType);
        }
      },

      loadIncomeStatementDetail: function(json, dateFormat) {
        // we can get rid of years after the year in which the strategyEndDate occurs
        // will need to slice some rows
        this.duration = new ThemeCalculator(json).durationInMonths;
        var duration = Math.ceil(this.duration / 12) * 12; // nearest multiple of 12 months
        var cssWidth = duration / 12 * 100 + '%';

        this.slice8yArrays(json, duration);

        // this tbl is the main content of the report
        var $tbl = $(this.el).find('.fullReportTable');
        $tbl.css({
          width: cssWidth
        });
        var $tbody = $tbl.find('tbody');
        var $thead = $tbl.find('thead');
        $thead.empty().append(this.fullDates(json.startDate, duration, dateFormat));
        this.addIncomeStatementRows($tbody.empty(), json, false);

        // now the row header column (ie table)
        // add a row and a td for each row
        var $tblDetailHeaders = $(this.el).find('.tableRowHeaders');
        $tbody = $tblDetailHeaders.find('tbody');
        this.addIncomeStatementRows($tbody.empty(), json, true);

        return $tbl;
      },

      contentForPdf: function() {
        var duration = Math.ceil(this.duration / 12); // years

        // need to divide up our data into years
        // should have column headers on each year
        var $wrapper = $('<div></div>');

        // nb we can have unlimited loans, equities etc
        // make sure each table starts on a new page - it can still be split if needed
        var $tblTemplate = $('<table class="reportTable"><thead></thead><tbody></tbody></table>');
        $tblTemplate
          .css({
            'page-break-inside': 'avoid'
          })
          .addClass('dynamicSubcontext');

        // add disclaimer 
        var $tblFooter = $('<tfoot><tr><td>');
        $tblFooter
          .appendTo($tblTemplate)
          .find('td')
          .attr('id', 'disclaimer')
          .attr('colspan', 15)
          .text(this.localized('fs_disclaimer'));

        // calculate all dates
        var dates = this.fullDatesArray(this.json.startDate);

        // if every month is zeroes, though, we still want to hide it
        this.prepData();

        // the problem is it looks silly in revenues if we have a line item appear for a year or two, and then disappear, because it's zeroes
        // plus it needs to match what we see on screen, so disable hasValues on a year by year basis
        // todo: should consider removing this.hasValues calls all together, in favour of preping data up front
        var hasValuesFunc = this.hasValues;
        this.hasValues = function(values) {
          return values && values.length;
        };

        for (var year = 0; year < duration; ++year) {
          var $tbl = $tblTemplate.clone();
          var $thead = $tbl.find('thead');
          var $tbody = $tbl.find('tbody');

          // add dates row for the current year
          $thead.append(this._datesRowForYear(dates, year));

          // get the correct slice of data
          var data = this._dataForYear(this.json, year);

          // now add data for the current year
          this.addIncomeStatementRows($tbody, data, false);

          // sum all the values in the row
          this.addTotalColumn($thead, $tbody);

          // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
          var $subcontext = $('<h6>')
            .prop('id', 'subcontext' + (year + 1))
            .addClass('subcontextEntry')
            .text(this.subcontext(year + 1));
          $wrapper.prepend($subcontext);

          $wrapper.append($tbl);
        }

        // restore
        this.hasValues = hasValuesFunc;

        return $wrapper;
      },

      // remove revenue lines which have no data; doesn't apply to notes
      prepData: function() {
        var revLines = this.json.revenue.data;
        for (var i = revLines.length - 1; i >= 0; i--) {
          var values = revLines[i].values
          if (!this.hasValues(values)) {
            revLines.splice(i, 1);
          };
        };
      },

      addTotalColumn: function($thead, $tbody) {
        // yes we're doing this after the fact, and we're not using the model data directly, 
        //  but this is the easiest way without full knowledge of the table structure
        $thead.find('tr').append(sprintf('<td>%s</td>', this.localized('is_total')));
        $tbody.find('tr').each(function(idx, ele) {
          $row = $(ele);
          // add a total column if not a heading
          // totalType can be none, prev, sum to determine what happens in the last column
          if (!$row.hasClass('heading')) {
            var totalType = $row.attr('totalType');
            if (!totalType || totalType == 'sum') {
              // default is to sum all the tds inside
              var sum = 0;
              $row.find('td').each(function(idx, ele) {
                sum += parseFloat($(ele).attr('val')) || 0;
              });
              $row.append(sprintf('<td>%s</td>', $.stratweb.formatNumberWithParens(sum)));
            }
            else if (totalType == 'prev') {
              var prev = $row.find('td').last().text();
              $row.append(sprintf('<td>%s</td>', prev));
            }
            // else don't do anything (ie totalType == none)
          };
        });
      },

      contentForCsv: function() {
        return FinancialStatement.prototype.contentForCsv.call(this, $('#fullReportTable'));
      }


    });

    return view;
  });