define(['Config', 'BaseReport', 'PageStructure', 'i18n!nls/FinancialStatement.i18n'],

    function(config, BaseReport, pageStructure, fLocalizable) {

        var view = BaseReport.extend({

            // ie: Projections: Project Summary
            reportName: 'StrategyByTheme',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", 'subcontext');
                var l = _.extend({}, fLocalizable, localizable);
                BaseReport.prototype.initialize.call(this, router, l);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                $('table#strategyByTheme tbody').empty();
                $('table#strategyByTheme thead').empty();
                $('table#strategyByTheme caption').empty();

                this.$el.spin();

                // fetch report for current stratFile
                var self = this;

                $.ajax({
                    url: config.serverBaseUrl + "/reports/r3?id=" + this.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.sortThemes(response.themes);

                        // because json is altered for production of report, save a clone for pdf
                        self.json = JSON.parse(JSON.stringify(response));

                        var numThemes = response.themes.length;
                        if (numThemes == 0) {
                            var $warnDiv = $('<div class="warn"></div>');
                            $warnDiv.text(self.localized('warn_no_themes'));
                            $('#r3 article').append($warnDiv);
                            return;
                        };
                        var numYears = Math.ceil(response.themes[0].header.headers.length/12);

                        // verify we have the right number of pages in pageStructure, and add (or subtract) if necessary
                        pageStructure.setNumberOfReportPages(self.router.chapter, numYears);
                        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

                        var year = self.router.page;

                        // update subtitle
                        $('header > hgroup > h2').text(self.subcontext(year));

                        self.loadStrategyByTheme(self.prepareTable(), response, year);

						$('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });                

            },

            // @override
            beforeRender: function(json) {
                BaseReport.prototype.beforeRender.call(this, json);

                // todo: should have better localization strategy
                $('#disclaimer').text(this.localized('fs_disclaimer'));
            },

            subcontext: function(year) {
                if (year === undefined) {
                    year = self.router.page;
                };                
                var ordinal = this.localized((year+1)+'long');
                ordinal = ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
                return sprintf(this.localized('title'), ordinal);
            },            

			isExportEnabled: function(fileType){

				if (fileType == 'csv') {
					return true;
				}
				else {
					return BaseReport.prototype.isExportEnabled.call(this, fileType);
				}
			},

            contentForPdf: function() {
                // all years
                var numThemes = this.json.themes.length;
                if (numThemes == 0) {
                    console.warn("No themes.");
                    return $('<div></div>').text(this.localized('warn_no_themes'));
                };
                var numYears = Math.ceil(this.json.themes[0].header.headers.length/12);

                // todo: div.reportWrapper enables horizontal scrolling - could be an issue here, ignore for now (ie too many projects will cause an issue)
                var compiledTemplate = Handlebars.templates['reports/R3.StrategyByTheme'];
                var html = compiledTemplate(this._localizable);
                var $tblTemplate = $(html).find('.reportTable');

                var $wrapper = $('<div></div>');
                for (var year=0; year<numYears; ++year) {
                    var data = JSON.parse(JSON.stringify(this.json));

                    // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                    var $subcontext = $('<h6>')
                        .prop('id', 'subcontext' + (year+1))
                        .addClass('subcontextEntry')
                        .text(this.subcontext(year));
	                $wrapper.prepend($subcontext);

                    var $tbl = $tblTemplate.clone();
                    $tbl.css({'page-break-inside': 'avoid'}).addClass('dynamicSubcontext');
                    this.loadStrategyByTheme($tbl, data, year);

                    $wrapper.append($tbl);
                }

                // in order for prince headers to observe padding, we must figure out correct td width -- bizarre!!!
                var numRowSummaryCols = 2;
                var numCols = numThemes + numRowSummaryCols;
                $wrapper.prepend( $( sprintf("<style>.reportTable th, .reportTable td { width:%s !important; }</style>", 900/numCols + 'px') ) );

                return $wrapper;
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

            strategyByThemeHeadings: function(themes, year) {

                var themeHeadings = '';
                themeHeadings += '<tr class="rowDivider2">';
                themeHeadings += '<th>&nbsp;</th>';
                for (var i = 0; i < themes.length; i++) {
                    themeHeadings += '<td>' + _.escape(themes[i].name) + '</td>';
                }
                var ordinal = this.localized((year+1)+'long');
                ordinal = ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
                themeHeadings += '<td>' + sprintf(this.localized('nthYearTotal'), ordinal) + '</td>';
                themeHeadings += '<td>' + this.localized('subsYears') + '</td>';
                return themeHeadings;
            },

            loadStrategyByTheme: function($tbl, json, year) {
                // var $tbl = this.prepareTable();
                var theme_count = json.themes.length;
                var $thead = $tbl.find('thead');
                var $tbody = $tbl.find('tbody');

                $thead.empty().append(this.strategyByThemeHeadings(json.themes, year));
                $tbody.empty();

                // rearrange into rows, 1 theme per column, year totals, subs year totals
                var strategyByTheme = {
                    "revenue": {
                        "changeInRevenue": [],
                        "changeInCogs": [],
                        "total": []
                    },
                    "expenses": {
                        "changeInRd": [],
                        "changeInGa": [],
                        "changeInSm": [],
                        "total": []
                    },
                    "strategy": {
                        "netContribution": [],
                        "netCumulative": []
                    }
                };

                // nth year and sunsequent year sums across themes
                var changeInRevenueSubsYears = 0;
                var changeInCogsSubsYears = 0;
                var grossProfitSubsYears = 0;

                var changeInRdSubsYears = 0;
                var changeInGaSubsYears = 0;
                var changeInSmSubsYears = 0;
                var expensesSubsYears = 0;

                var netContributionSubsYears = 0;
                var netCumulativeSubsYears = 0;

                var changeInRevenueNthYear = 0;
                var changeInCogsNthYear = 0;
                var grossProfitNthYear = 0;

                var changeInRdNthYear = 0;
                var changeInGaNthYear = 0;
                var changeInSmNthYear = 0;
                var expensesNthYear = 0;

                var netContributionNthYear = 0;
                var netCumulativeNthYear = 0;

                for (var i = 0, ct = json.themes.length; i < ct; ++i) {
                    var themeJson = json.themes[i];
                    delete themeJson.name;
                    this.prepareForYear(themeJson, year);

                    // show the total for a theme, for the particular year
                    strategyByTheme.revenue.changeInRevenue.push(themeJson.revenue.changeInRevenue[12]);
                    strategyByTheme.revenue.changeInCogs.push(themeJson.revenue.changeInCogs[12]);
                    strategyByTheme.revenue.total.push(themeJson.revenue.total[12]);

                    strategyByTheme.expenses.changeInRd.push(themeJson.expenses.changeInRd[12]);
                    strategyByTheme.expenses.changeInGa.push(themeJson.expenses.changeInGa[12]);
                    strategyByTheme.expenses.changeInSm.push(themeJson.expenses.changeInSm[12]);
                    strategyByTheme.expenses.total.push(themeJson.expenses.total[12]);

                    strategyByTheme.strategy.netContribution.push(themeJson.strategy.netContribution[12]);
                    strategyByTheme.strategy.netCumulative.push(themeJson.strategy.netCumulative[12]);

                    // sum nth year over themes
                    changeInRevenueNthYear += themeJson.revenue.changeInRevenue[12];
                    changeInCogsNthYear += themeJson.revenue.changeInCogs[12];
                    grossProfitNthYear += themeJson.revenue.total[12];

                    changeInRdNthYear += themeJson.expenses.changeInRd[12];
                    changeInGaNthYear += themeJson.expenses.changeInGa[12];
                    changeInSmNthYear += themeJson.expenses.changeInSm[12];
                    expensesNthYear += themeJson.expenses.total[12];

                    netContributionNthYear += themeJson.strategy.netContribution[12];
                    netCumulativeNthYear += themeJson.strategy.netCumulative[12];

                    // sum subs years over themes
                    changeInRevenueSubsYears += themeJson.revenue.changeInRevenue[13];
                    changeInCogsSubsYears += themeJson.revenue.changeInCogs[13];
                    grossProfitSubsYears += themeJson.revenue.total[13];

                    changeInRdSubsYears += themeJson.expenses.changeInRd[13];
                    changeInGaSubsYears += themeJson.expenses.changeInGa[13];
                    changeInSmSubsYears += themeJson.expenses.changeInSm[13];
                    expensesSubsYears += themeJson.expenses.total[13];

                    netContributionSubsYears += themeJson.strategy.netContribution[13];
                    netCumulativeSubsYears += themeJson.strategy.netCumulative[13];

                };

                // show the sum of nth years in the second-last column
                strategyByTheme.revenue.changeInRevenue.push(changeInRevenueNthYear);
                strategyByTheme.revenue.changeInCogs.push(changeInCogsNthYear);
                strategyByTheme.revenue.total.push(grossProfitNthYear);

                strategyByTheme.expenses.changeInRd.push(changeInRdNthYear);
                strategyByTheme.expenses.changeInGa.push(changeInGaNthYear);
                strategyByTheme.expenses.changeInSm.push(changeInSmNthYear);
                strategyByTheme.expenses.total.push(expensesNthYear);

                strategyByTheme.strategy.netContribution.push(netContributionNthYear);
                strategyByTheme.strategy.netCumulative.push(netCumulativeNthYear);

                // show the sum of subs years in the last column
                strategyByTheme.revenue.changeInRevenue.push(changeInRevenueSubsYears);
                strategyByTheme.revenue.changeInCogs.push(changeInCogsSubsYears);
                strategyByTheme.revenue.total.push(grossProfitSubsYears);

                strategyByTheme.expenses.changeInRd.push(changeInRdSubsYears);
                strategyByTheme.expenses.changeInGa.push(changeInGaSubsYears);
                strategyByTheme.expenses.changeInSm.push(changeInSmSubsYears);
                strategyByTheme.expenses.total.push(expensesSubsYears);

                strategyByTheme.strategy.netContribution.push(netContributionSubsYears);
                strategyByTheme.strategy.netCumulative.push(netCumulativeSubsYears);

                this.addRows($tbody, strategyByTheme);

                // enable scrolling
                if (theme_count > 14) {
                    var table_width = (theme_count - 14) * 6.666666666666667 + 100;
                    $tbl.css('width', table_width + '%');
                    $('.reportWrapper').nanoScroller();
                }
            }


        });

        return view;
    });