define(['FinancialStatement', 'views/reports/BalanceSheetSummary', 'Config', 'PageStructure', 'ThemeCalculator'],

  function(FinancialStatement, BalanceSheetSummary, config, pageStructure, ThemeCalculator) {

    var view = BalanceSheetSummary.extend({

      el: "#balanceSheetDetail",

      reportName: 'BalanceSheetDetail',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "loadBalanceSheetDetail");
        BalanceSheetSummary.prototype.initialize.call(this, router, localizable);
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
          url: config.serverBaseUrl + "/reports/balancesheet/details",
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

            self.loadBalanceSheetDetail(response);

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

      loadBalanceSheetDetail: function(json, dateFormat) {
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
        this.addBalanceSheetRows($tbody.empty(), json, false);

        // now the row header column (ie table)
        // add a row and a td for each row
        var $tblDetailHeaders = $(this.el).find('.tableRowHeaders');
        $tbody = $tblDetailHeaders.find('tbody');
        this.addBalanceSheetRows($tbody.empty(), json, true);

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
        this._prepData();

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
          this.addBalanceSheetRows($tbody, data, false);

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
      _prepData: function() {
        if (!this.hasValues(this.json.assets.currentAssets.accountsReceivable)) {
          delete this.json.assets.currentAssets.accountsReceivable;
        };
        if (!this.hasValues(this.json.assets.currentAssets.inventory)) {
          delete this.json.assets.currentAssets.inventory
        };
        if (!this.hasValues(this.json.assets.currentAssets.prepaidPurchases)) {
          delete this.json.assets.currentAssets.prepaidPurchases
        };
        if (!this.hasValues(this.json.assets.longTermAssets.accumulatedDepreciation)) {
          delete this.json.assets.longTermAssets.accumulatedDepreciation
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.accountsPayable)) {
          delete this.json.liabilities.currentLiabilities.accountsPayable
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.prepaidSales)) {
          delete this.json.liabilities.currentLiabilities.prepaidSales
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.currentPortionOfLtd)) {
          delete this.json.liabilities.currentLiabilities.currentPortionOfLtd
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.employeeDeductions)) {
          delete this.json.liabilities.currentLiabilities.employeeDeductions
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.incomeTax)) {
          delete this.json.liabilities.currentLiabilities.incomeTax
        };
        if (!this.hasValues(this.json.liabilities.currentLiabilities.salesTax)) {
          delete this.json.liabilities.currentLiabilities.salesTax
        };
        if (!this.hasValues(this.json.equity.capitalStock)) {
          delete this.json.equity.capitalStock
        };
      },

      addTotalColumn: function($thead, $tbody) {
        // yes we're doing this after the fact, and we're not using the model data directly, 
        //  but this is the easiest way without full knowledge of the table structure
        $thead.find('tr').append(sprintf('<td>%s</td>', this.localized('bs_total')));
        $tbody.find('tr').each(function(idx, ele) {
          var $row = $(ele);
          if (!$row.hasClass('heading')) {
            // it's the value of the last td
            var sum = $row.find('td:last-child').attr('val');
            $row.append(sprintf('<td>%s</td>', $.stratweb.formatNumberWithParens(sum)));
          };
        });
      },

      contentForCsv: function() {
        return FinancialStatement.prototype.contentForCsv.call(this, $('#fullReportTable'));
      }


    });

    return view;
  });