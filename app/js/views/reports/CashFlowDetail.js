define(['FinancialStatement', 'views/reports/CashFlowSummary', 'Config', 'PageStructure', 'ThemeCalculator'],

  function(FinancialStatement, CashFlowSummary, config, pageStructure, ThemeCalculator) {

    var view = CashFlowSummary.extend({

      el: "#cashFlowDetail",

      reportName: 'CashFlowDetail',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "loadCashFlowDetail");
        CashFlowSummary.prototype.initialize.call(this, router, localizable);
      },

      load: function() {
        FinancialStatement.prototype.load.call(this);

        this.$el.spin({
          top: '50px'
        });

        var self = this;

        pageStructure.setNumberOfReportPages(self.router.chapter, 1);
        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

        $.ajax({
          url: config.serverBaseUrl + "/reports/cashflow/details",
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

            self.loadCashFlowDetail(response);

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

      loadCashFlowDetail: function(json, dateFormat) {
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
        this.addCashFlowRows($tbody.empty(), json, false);

        // now the row header column (ie table)
        // add a row and a td for each row
        var $tblDetailHeaders = $(this.el).find('.tableRowHeaders');
        $tbody = $tblDetailHeaders.find('tbody');
        this.addCashFlowRows($tbody.empty(), json, true);

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
          this.addCashFlowRows($tbody, data, false);

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

      // remove lines which have no data
      prepData: function() {
        if (!this.hasValues(this.json.operations.ar)) {
          delete this.json.operations.ar;
        };
        if (!this.hasValues(this.json.operations.ap)) {
          delete this.json.operations.ap;
        };
        if (!this.hasValues(this.json.operations.depreciation)) {
          delete this.json.operations.depreciation;
        };
        if (!this.hasValues(this.json.operations.inventory)) {
          delete this.json.operations.inventory;
        };
        if (!this.hasValues(this.json.operations.taxesAndDeductions)) {
          delete this.json.operations.taxesAndDeductions;
        };
        if (!this.hasValues(this.json.investments.prepaidSales)) {
          delete this.json.investments.prepaidSales;
        };
        if (!this.hasValues(this.json.investments.prepaidPurchases)) {
          delete this.json.investments.prepaidPurchases;
        };
        for (var i = this.json.investments.assets.length - 1; i >= 0; i--) {
          var asset = this.json.investments.assets[i];
          if (!this.hasValues(asset.values)) {
            this.json.investments.assets.splice(i, 1);
          };
        };
        for (var i = this.json.financing.investments.length - 1; i >= 0; i--) {
          var investment = this.json.financing.investments[i];
          if (!this.hasValues(investment.values)) {
            this.json.financing.investments.splice(i, 1);
          };
        };
        for (var i = this.json.financing.loans.length - 1; i >= 0; i--) {
          var loan = this.json.financing.loans[i];
          if (!this.hasValues(loan.values)) {
            this.json.financing.loans.splice(i, 1);
          };
        };
      },

      addTotalColumn: function($thead, $tbody) {
        // yes we're doing this after the fact, and we're not using the model data directly, 
        //  but this is the easiest way without full knowledge of the table structure
        $thead.find('tr').append(sprintf('<td>%s</td>', this.localized('cf_total')));
        $tbody.find('tr').each(function(idx, ele) {
          $row = $(ele);
          if (!$row.hasClass('heading')) {
            // sum all the tds inside
            var sum = 0;
            $row.find('td').each(function(idx, ele) {
              sum += parseFloat($(ele).attr('val')) || 0;
            });
            $row.append(sprintf('<td>%s</td>', $.stratweb.formatNumberWithParens(sum)));
          };
        });

        // the last two rows are treated differently (cash at start and end)
        var $cashEndRow = $tbody.find('tr:last');
        var $cashStartRow = $cashEndRow.prev();

        // matches prev coloumn
        var $totalColumn = $cashEndRow.find('td:last');
        $totalColumn.text($totalColumn.prev().text());

        // matches first column
        $totalColumn = $cashStartRow.find('td:last');
        $totalColumn.text($cashStartRow.find('td:nth-child(2)').text());

      },

      contentForCsv: function() {
        return FinancialStatement.prototype.contentForCsv.call(this, $('#fullReportTable'));
      }


    });

    return view;
  });