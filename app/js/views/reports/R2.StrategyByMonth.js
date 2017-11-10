define(['Config', 'BaseReport', 'PageStructure', 'i18n!nls/FinancialStatement.i18n'],

    function(config, BaseReport, pageStructure, fLocalizable) {

        var view = BaseReport.extend({

            // ie: Projections: Monthly Overall
            reportName: 'StrategyByMonth',

            initialize: function(router, localizable) {
                var l = _.extend({}, fLocalizable, localizable);
                _.bindAll(this, "load", "datesRow", "addRows", "loadStratOrThemeByMonth", "contentForPdf", "subcontext");
                BaseReport.prototype.initialize.call(this, router, l);
            },

            // @override
            beforeRender: function(json) {
                BaseReport.prototype.beforeRender.call(this, json);

                // todo: should have better localization strategy
                $('#disclaimer').text(this.localized('fs_disclaimer'));
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                $('table#strategyByMonth tbody').empty();
                $('table#strategyByMonth thead').empty();
                $('table#strategyByMonth caption').empty();                

                this.$el.spin();
                
                var self = this;

                // fetch report for current stratFile
                $.ajax({
                    url: config.serverBaseUrl + "/reports/r2?id=" + this.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        // because json is altered for production of report, save a clone for pdf
                        self.json = JSON.parse(JSON.stringify(response));

                        // note that because we get all years at once, we could show this differently
                        var numYears = Math.ceil(response.header.headers.length/12);

                        // verify we have the right number of pages in pageStructure, and add (or subtract) if necessary
                        pageStructure.setNumberOfReportPages(self.router.chapter, numYears);
                        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

                        // massage and load up the data for the report
                        var year = self.router.page;
                        self.prepareForYear(response, year);
                        self.loadStratOrThemeByMonth(response, year);

                        // update subtitle
                        $('header > hgroup > h2').text(self.subcontext(year));

						$('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });
            },

            subcontext: function(year) {
                if (year === undefined) {
                    year = self.router.page;
                };
                var ordinal = this.localized((year+1)+'long');
                ordinal = ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
                return sprintf(this.localized('title'), ordinal);
            },

            contentForPdf: function() {
                // all years
                var numYears = Math.ceil(this.json.header.headers.length/12);

                var compiledTemplate = Handlebars.templates['reports/R2.StrategyByMonth'];
                var html = compiledTemplate(this._localizable);
                var $tblTemplate = $(html).find('.reportTable'); 

                var $wrapper = $('<div></div>');
                for (var year=0; year<numYears; ++year) {
                    var data = JSON.parse(JSON.stringify(this.json));
                    this.prepareForYear(data, year);

                    // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                    var $subcontext = $('<h6>')
                        .prop('id', 'subcontext' + (year+1))
                        .addClass('subcontextEntry')
                        .text(this.subcontext(year));                  
                    $wrapper.prepend($subcontext);

                    var $tbl = $tblTemplate.clone();
                    // ie. move the next table to the next page, rather than splitting it
                    $tbl.css({'page-break-inside': 'avoid'}).addClass('dynamicSubcontext');
                    var $thead = $tbl.find('thead');
                    var $tbody = $tbl.find('tbody');
                    $thead.append(this.datesRow(data.header.headers[0], year));

                    this.addRows($tbody, data);

                    $wrapper.append($tbl);
                }

                return $wrapper;
            },

			isExportEnabled: function(fileType){

				if (fileType == 'csv') {
					return true;
				}
				else {
					return BaseReport.prototype.isExportEnabled.call(this, fileType);
				}
			},

            contentForCsv: function() {
                var $wrapper = this.contentForPdf();

                // bit lazy, but convenient - now go through that html and produce csv
                var csv = "";
                $wrapper.find('.reportTable').each(function() {
                    var $tbl = $(this);

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

                    csv += '\n\n';

                });

                return csv;
            },

            datesRow: function(startDate, year) {
                // date is in format yyyyMM
                var date = moment(startDate + '01', $.stratweb.dateFormats.in);

                // the 12 months
                var dates = '';
                dates += '<tr class="rowDivider2">';
                dates += '<th>&nbsp;</th>';
                for (var i = 0; i < 12; i++) {
                    date.add('months', i > 0 ? 1 : 0);
                    dates += '<td>' + date.format('MMM YYYY') + '</td>';
                }
                var ordinal = this.localized((year+1)+'short');
                dates += sprintf('<td>%s</td><td>%s</td>', sprintf(this.localized('nthYearTotal'), ordinal ), this.localized('subsYears'))
                return dates;
            },

            addRows: function($tbody, json) {

                $tbody.append(this.row(this.localized('revenue')));
                $tbody.append(this.row(this.localized('changeInRevenue'), json.revenue.changeInRevenue));
                $tbody.append(this.row(this.localized('changeInCogs'), json.revenue.changeInCogs));
                var $r = $(this.row(this.localized('revenueSubtotals'), json.revenue.total));
                $r.addClass('rowDivider1 totals');
                $tbody.append($r);

                $tbody.append(this.row(this.localized('expenses')));
                $tbody.append(this.row(this.localized('changeInGa'), json.expenses.changeInGa));
                $tbody.append(this.row(this.localized('changeInRd'), json.expenses.changeInRd));
                $tbody.append(this.row(this.localized('changeInSm'), json.expenses.changeInSm));
                $r = $(this.row(this.localized('total'), json.expenses.total));
                $r.addClass('rowDivider1 totals');
                $tbody.append($r);

                $tbody.append(this.row(this.localized('totalForStrategy')));
                $tbody.append(this.row(this.localized('netContribution'), json.strategy.netContribution));
                $r = $(this.row(this.localized('netCumulative'), json.strategy.netCumulative));
                $r.addClass('rowDivider3 rowDivider1');
                $tbody.append($r);

            },

            loadStratOrThemeByMonth: function(json, year) {
                var $tbl = this.prepareTable();
                var $thead = $tbl.find('thead');
                var $tbody = $tbl.find('tbody');
                $thead.empty().append(this.datesRow(json.header.headers[0], year));

                $tbody.empty();

                this.addRows($tbody, json);
            }


        });

        return view;
    });