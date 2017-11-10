define(['FinancialStatement', 'Config', 'PageStructure'],

  function(FinancialStatement, config, pageStructure) {

    var view = FinancialStatement.extend({

      el: "#cashFlowSummary",

      reportName: 'CashFlowSummary',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "addCashFlowRows", "loadCashFlowSummary");
        FinancialStatement.prototype.initialize.call(this, router, localizable);

      },

      load: function() {
        FinancialStatement.prototype.load.call(this);

        this.$el.spin({top: '50px'});

        var self = this;

        pageStructure.setNumberOfReportPages(self.router.chapter, 1);
        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

        $.ajax({
          url: config.serverBaseUrl + "/reports/cashflow/summary",
          type: "GET",
          dataType: 'json',
          data: {
            'id': self.stratFileId
          },
          contentType: "application/json; charset=utf-8"
        })
          .done(function(response, textStatus, jqXHR) {

            self.beforeRender(response);

            self.loadCashFlowSummary(response);

          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("%s: %s", textStatus, errorThrown);
            self.showUnexpectedError();
          })
          .always(function() {
            self.$el.spin(false);
          });

      },

		isExportEnabled: function (fileType) {

			if (fileType == 'csv') {
				return true;
			}
			else {
				return FinancialStatement.prototype.isExportEnabled.call(this, fileType);
			}
		},

      addCashFlowRows: function($tbody, json, isDetail) {
        var fx = isDetail ? this.header : this.row;
        var investmentOrLoanSort = function(o1, o2) {
           var compare = o1.date.toString().localeCompare(o2.date);
           if (compare === 0) {
            compare = o1.name.toString().localeCompare(o2.name);
           }
           return compare;
        };        

        /////// operations

        $tbody.append(fx(this.localized('cf_operations')));
        $tbody.append(fx(this.localized('cf_netIncome'), json.operations.netIncome, 2));
        if (this.hasValues(json.operations.ar)) {
          $tbody.append(fx(this.localized('cf_arChange'), json.operations.ar, 3));
        };
        if (this.hasValues(json.operations.ap)) {
          $tbody.append(fx(this.localized('cf_apChange'), json.operations.ap, 3));
        };
        if (this.hasValues(json.operations.depreciation)) {
          $tbody.append(fx(this.localized('cf_depreciationChange'), json.operations.depreciation, 3));
        };
        if (this.hasValues(json.operations.inventory)) {
          $tbody.append(fx(this.localized('cf_inventoryChange'), json.operations.inventory, 3));
        };
        if (this.hasValues(json.operations.taxesAndDeductions)) {
          $tbody.append(fx(this.localized('cf_taxesAndDeductions'), json.operations.taxesAndDeductions, 3));
        };

        var $r = $(fx(this.localized('cf_cashFromOperations'), json.operations.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        $tbody.append(fx('&nbsp;'));

        /////// investments/assets

        $tbody.append(fx(this.localized('cf_investmentsChange')));
        for (var i=0, ct=json.investments.assets.length; i < ct; ++i) {
          var asset = json.investments.assets[i];
          if (this.hasValues(asset.values)) {
            $tbody.append(fx(_.escape(asset.name), asset.values, 2));
          };
        };
        if (this.hasValues(json.investments.prepaidSales)) {
          $tbody.append(fx(this.localized('cf_changesFromPrepaidSales'), json.investments.prepaidSales, 3));
        };
        if (this.hasValues(json.investments.prepaidPurchases)) {
          $tbody.append(fx(this.localized('cf_changesFromPrepaidPurchases'), json.investments.prepaidPurchases, 3));
        };
        var $r = $(fx(this.localized('cf_cashFromInvestments'), json.investments.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        $tbody.append(fx('&nbsp;'));


        /////// financing

        $tbody.append(fx(this.localized('cf_financingChange')));

        // mix the investments and loans together, then sort by date
        var financingChanges = json.financing.investments.concat(json.financing.loans);
        financingChanges.sort(investmentOrLoanSort);

        for (var i = 0; i < financingChanges.length; i++) {
          var financingChange = financingChanges[i];
          if (this.hasValues(financingChange.values)) {
            $tbody.append(fx(_.escape(financingChange.name), financingChange.values, 2));
          };
        };

        // subtotal
        var $r = $(fx(this.localized('cf_cashFromFinancing'), json.financing.subtotals));
        $r.addClass('rowDivider1');
        $tbody.append($r);

        $tbody.append(fx('&nbsp;'));


        /////// net

        $tbody.append(fx(this.localized('cf_changesToCash'), json.netCash.changes));
        $tbody.append(fx(this.localized('cf_startCash'), json.netCash.startCash));
        $r = $(fx(this.localized('cf_endCash'), json.netCash.endCash));
        $r.addClass('rowDivider1 rowDivider3');
        $tbody.append($r);
      },

      loadCashFlowSummary: function(json) {

        var $tbl = $(this.el).find('.reportTable');
        var $tbody = $tbl.find('tbody');
        var $thead = $tbl.find('thead');

        // add dates row
        $thead.empty().append(this.dates(json.startDate));

        this.addCashFlowRows($tbody.empty(), json);

        return $tbl;
      }

    });

    return view;
  });