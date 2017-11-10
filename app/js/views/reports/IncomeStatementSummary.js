define(['FinancialStatement', 'Config', 'PageStructure'],

	function (FinancialStatement, config, pageStructure) {

		var view = FinancialStatement.extend({

			el: "#incomeStatementSummary",

			reportName: 'IncomeStatementSummary',

			initialize: function (router, localizable) {
				_.bindAll(this, "load", "revenue", "cogs", "expenses", "addIncomeStatementRows", "loadIncomeStatementSummary");
				FinancialStatement.prototype.initialize.call(this, router, localizable);
			},

			load: function () {
				FinancialStatement.prototype.load.call(this);

                this.$el.spin({top: '50px'});

				var self = this;

				pageStructure.setNumberOfReportPages(self.router.chapter, 1);
				self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

				$.ajax({
					url        : config.serverBaseUrl + "/reports/incomestatement/summary",
					type       : "GET",
					dataType   : 'json',
					data       : {
						'id': self.stratFileId
					},
					contentType: "application/json; charset=utf-8"
				})
					.done(function (response, textStatus, jqXHR) {

						self.beforeRender(response);

						self.loadIncomeStatementSummary(response);

					})
					.fail(function (jqXHR, textStatus, errorThrown) {
						console.error("%s: %s", textStatus, errorThrown);
						self.showUnexpectedError();
					})
					.always(function () {
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

			revenue: function (section, isDetail) {
				var $div = $('<div/>');

				// for the detail table, reuse this code for row headers and content data
				var fx = isDetail ? this.header : this.row;

				// row header
				$div.append(fx(this.localized('is_revenue')));

				// rows for each theme; don't show if no values
				if (section.data) {
					$.each(section.data, function (index, r) {
						var hasNonZeroValues = this.hasValues(r.values);
						if (hasNonZeroValues) {
							$div.append(fx(this.localized(_.escape(r.name)), r.values, 2));
						}
						;
					}.bind(this));
				}
				;

				// total row
				var $total = $(fx('&nbsp;', section.subtotals));
				$total.addClass('rowDivider1');
				$div.append($total);

				// spacer
				$div.append(fx('&nbsp;'));

				return $div.html();
			},

			cogs: function (section, isDetail) {
				// always show COGS and running total
				var $div = $('<div/>');

				// for the detail table, reuse this code for row headers and content data
				var fx = isDetail ? this.header : this.row;

				// row header + subtotals
				$div.append(fx(this.localized('is_cogs'), section.subtotals));

				// revenue - cogs
				var $r = $(fx(this.localized('is_grossProfit'), section.totals));
				$r.addClass('rowDivider1');
				$div.append($r);

				// spacer
				$div.append(fx('&nbsp;'));

				return $div.html();
			},

			expenses: function (section, isDetail) {
				var $div = $('<div/>');

				// for the detail table, reuse this code for row headers and content data
				var fx = isDetail ? this.header : this.row;

				// row header
				$div.append(fx(this.localized('is_expenses')));

				// rows for each expense
				$div.append(fx(this.localized('is_generalAndAdministrative'), section.generalAndAdministrative, 2));
				$div.append(fx(this.localized('is_researchAndDevelopment'), section.researchAndDevelopment, 2));
				$div.append(fx(this.localized('is_salesAndMarketing'), section.salesAndMarketing, 2));

				// total row
				var $total = $(fx('&nbsp;', section.subtotals));
				$total.addClass('rowDivider1');
				$div.append($total);

				// no spacer

				return $div.html();
			},

			addIncomeStatementRows: function ($tbody, json, isDetail) {
				var fx = isDetail ? this.header : this.row;

				// add 3 sections
				$tbody.append(this.revenue(json.revenue, isDetail));
				$tbody.append(this.cogs(json.cogs, isDetail));
				$tbody.append(this.expenses(json.expenses, isDetail));

				var $r = $(fx(this.localized('is_ebitda'), json.ebitda.totals));
				$r.addClass('rowDivider1');
				$tbody.append($r);
				$tbody.append(fx(this.localized('is_depreciation'), json.ebitda.depreciation, 2));

				$r = $(fx(this.localized('is_ebit'), json.ebit.totals));
				$r.addClass('rowDivider1');
				$tbody.append($r);
				$tbody.append(fx(this.localized('is_interest'), json.ebit.interest, 2));

				$r = $(fx(this.localized('is_ebt'), json.ebt.totals));
				$r.addClass('rowDivider1');
				$tbody.append($r);
				$tbody.append(fx(this.localized('is_incomeTaxes'), json.ebt.incomeTaxes, 2));

				$r = $(fx(this.localized('is_net'), json.netIncome.totals));
				$r.addClass('rowDivider1 rowDivider3');
				$tbody.append($r);

				// staff on worksheet
				if (json.staffComplement) {
					$tbody.append(fx('&nbsp;'));
					$tbody.append(this.staff(json.staffComplement, isDetail));
				};

			},

			loadIncomeStatementSummary: function (json) {

				var $tbl = $(this.el).find('.reportTable');
				var $tbody = $tbl.find('tbody');
				var $thead = $tbl.find('thead');

				// add dates row
				$thead.empty().append(this.dates(json.startDate));

				this.addIncomeStatementRows($tbody.empty(), json, false);

				return $tbl;
			}

		});

		return view;
	});