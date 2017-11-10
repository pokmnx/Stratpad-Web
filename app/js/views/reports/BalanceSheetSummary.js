define(['FinancialStatement', 'Config', 'PageStructure'],

  function(FinancialStatement, config, pageStructure) {

    var view = FinancialStatement.extend({

      el: "#balanceSheetSummary",

      reportName: 'BalanceSheetSummary',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "addBalanceSheetRows", "loadBalanceSheetSummary");
        FinancialStatement.prototype.initialize.call(this, router, localizable);
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
          url: config.serverBaseUrl + "/reports/balancesheet/summary",
          type: "GET",
          dataType: 'json',
          data: {
            'id': self.stratFileId
          },
          contentType: "application/json; charset=utf-8"
        })
          .done(function(response, textStatus, jqXHR) {

            self.beforeRender(response);

            self.loadBalanceSheetSummary(response);

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

      addBalanceSheetRows: function($tbody, json, isDetail) {
        var fx = isDetail ? this.header : this.row;
        var assetOrLoanSort = function(o1, o2) {
          var compare = o1.date.toString().localeCompare(o2.date);
          if (compare === 0) {
            compare = o1.name.toString().localeCompare(o2.name);
          }
          return compare;
        };

        /////// assets

        $tbody.append(fx(this.localized('bs_assets')));
        $tbody.append(fx(this.localized('bs_currentAssets'), null, 2));
        $tbody.append(fx(this.localized('bs_cash'), json.assets.currentAssets.cash, 3));
        if (this.hasValues(json.assets.currentAssets.accountsReceivable)) {
          $tbody.append(fx(this.localized('bs_ar'), json.assets.currentAssets.accountsReceivable, 3));
        };
        if (this.hasValues(json.assets.currentAssets.inventory)) {
          $tbody.append(fx(this.localized('bs_inventory'), json.assets.currentAssets.inventory, 3));
        };
        if (this.hasValues(json.assets.currentAssets.prepaidPurchases)) {
          $tbody.append(fx(this.localized('bs_prepaidPurchases'), json.assets.currentAssets.prepaidPurchases, 3));
        };
        var $r = $(fx('&nbsp;', json.assets.currentAssets.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        $tbody.append(fx(this.localized('bs_longTermAssets'), null, 2));
        json.assets.longTermAssets.assets = json.assets.longTermAssets.assets || [];
        json.assets.longTermAssets.assets.sort(assetOrLoanSort);
        for (var i = 0, ct = json.assets.longTermAssets.assets.length; i < ct; ++i) {
          var asset = json.assets.longTermAssets.assets[i];
          $tbody.append(fx(_.escape(asset.name), asset.values, 3));
        };
        if (this.hasValues(json.assets.longTermAssets.accumulatedDepreciation)) {
          $tbody.append(fx(this.localized('bs_accumulatedDepreciation'), json.assets.longTermAssets.accumulatedDepreciation, 3));
        };
        var $r = $(fx('&nbsp;', json.assets.longTermAssets.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        var $r = $(fx('&nbsp;', json.assets.subtotals));
        $r.addClass('rowDivider1 rowDivider3');
        $tbody.append($r);

        $tbody.append(fx('&nbsp;'));

        /////// liabilities

        $tbody.append(fx(this.localized('bs_liabilities')));

        // current
        $tbody.append(fx(this.localized('bs_currentLiabilities'), null, 2));
        if (this.hasValues(json.liabilities.currentLiabilities.accountsPayable)) {
          $tbody.append(fx(this.localized('bs_ap'), json.liabilities.currentLiabilities.accountsPayable, 3));
        };
        if (this.hasValues(json.liabilities.currentLiabilities.prepaidSales)) {
          $tbody.append(fx(this.localized('bs_prepaidSales'), json.liabilities.currentLiabilities.prepaidSales, 3));
        };
        if (this.hasValues(json.liabilities.currentLiabilities.currentPortionOfLtd)) {
          $tbody.append(fx(this.localized('bs_currentPortionOfLtd'), json.liabilities.currentLiabilities.currentPortionOfLtd, 3));
        };
        if (this.hasValues(json.liabilities.currentLiabilities.employeeDeductions)) {
          $tbody.append(fx(this.localized('bs_employeeDeductions'), json.liabilities.currentLiabilities.employeeDeductions, 3));
        };
        if (this.hasValues(json.liabilities.currentLiabilities.incomeTax)) {
          $tbody.append(fx(this.localized('bs_incomeTax'), json.liabilities.currentLiabilities.incomeTax, 3));
        };
        if (this.hasValues(json.liabilities.currentLiabilities.salesTax)) {
          $tbody.append(fx(this.localized('bs_salesTax'), json.liabilities.currentLiabilities.salesTax, 3));
        };
        json.liabilities.currentLiabilities.loans = json.liabilities.currentLiabilities.loans || [];
        json.liabilities.currentLiabilities.loans.sort(assetOrLoanSort);
        for (var i = 0, ct = json.liabilities.currentLiabilities.loans.length; i < ct; ++i) {
          var loan = json.liabilities.currentLiabilities.loans[i];
          $tbody.append(fx(_.escape(loan.name), loan.values, 3));
        };
        var $r = $(fx('&nbsp;', json.liabilities.currentLiabilities.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        // longterm
        $tbody.append(fx(this.localized('bs_longTermLiabilities'), null, 2));
        json.liabilities.longTermLiabilities.loans = json.liabilities.longTermLiabilities.loans || [];
        json.liabilities.longTermLiabilities.loans.sort(assetOrLoanSort);
        for (var i = 0, ct = json.liabilities.longTermLiabilities.loans.length; i < ct; ++i) {
          var loan = json.liabilities.longTermLiabilities.loans[i];
          $tbody.append(fx(_.escape(loan.name), loan.values, 3));
        };
        var $r = $(fx('&nbsp;', json.liabilities.longTermLiabilities.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        var $r = $(fx('&nbsp;', json.liabilities.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        $tbody.append(fx('&nbsp;'));

        /////// equity

        $tbody.append(fx(this.localized('bs_equity')));
        $tbody.append(fx(this.localized('bs_retainedEarnings'), json.equity.retainedEarnings, 2));
        if (this.hasValues(json.equity.capitalStock)) {
          $tbody.append(fx(this.localized('bs_capitalStock'), json.equity.capitalStock, 2));
        };
        var $r = $(fx('&nbsp;', json.equity.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        /////// totals      

        // var $r = $(fx(this.localized('bs_totalLiabilitiesAndEquity'), json.totalLiabilitiesAndEquity.totals));
        var $r = $(fx('&nbsp;', json.totalLiabilitiesAndEquity.totals));
        $r.addClass('rowDivider1 rowDivider3');
        $tbody.append($r);
      },

      loadBalanceSheetSummary: function(json) {

        var $tbl = $(this.el).find('.reportTable');
        var $tbody = $tbl.find('tbody');
        var $thead = $tbl.find('thead');

        // add dates row
        $thead.empty().append(this.dates(json.startDate));

        this.addBalanceSheetRows($tbody.empty(), json);

        return $tbl;
      }


    });

    return view;
  });