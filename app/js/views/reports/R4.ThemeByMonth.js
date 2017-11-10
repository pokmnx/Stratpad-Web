define(['Config', 'BaseReport', 'views/reports/R2.StrategyByMonth', 'PageStructure', 'i18n!nls/FinancialStatement.i18n'],

    function(config, BaseReport, R2Report, pageStructure, fLocalizable) {

        var view = R2Report.extend({

            // ie: Projections: Monthly Project
            reportName: 'ThemeByMonth',

            initialize: function(router, localizable) {
                _.bindAll(this, "load");
                var l = _.extend({}, fLocalizable, localizable);
                BaseReport.prototype.initialize.call(this, router, l);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                $('table#themeByMonth tbody').empty();
                $('table#themeByMonth thead').empty();
                $('table#themeByMonth caption').empty();

                this.$el.spin();

                // fetch report for current stratFile
                var self = this;

                $.ajax({
                    url: config.serverBaseUrl + "/reports/r4?id=" + this.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        // number of pages is sum(number of years per theme)
                        // we can then show theme 0, year 0 or theme 2, year 1

                        self.sortThemes(response.themes);

                        // because json is altered for production of report, save a clone for pdf
                        self.json = JSON.parse(JSON.stringify(response));

                        var numThemes = response.themes.length;
                        if (numThemes == 0) {
                            var $warnDiv = $('<div class="warn"></div>');
                            $warnDiv.text(self.localized('warn_no_themes'));
                            $('#r4 article').append($warnDiv);
                            return;
                        };

                        // takes into account themes and years
                        var pageIdx = self.router.page;
                        
                        // total number of pages
                        var numPages = 0;
                        _.each(response.themes, function(themeJson) {
                            var numYears = Math.ceil(themeJson.header.headers.length/12);
                            numPages += numYears;
                        });

                        // verify we have the right number of pages in pageStructure, and add (or subtract) if necessary
                        pageStructure.setNumberOfReportPages(self.router.chapter, numPages);
                        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

                        var themeIdx = self.getThemeIdx(response.themes, pageIdx);
                        var year = self.getYear(response.themes, pageIdx);

                        // determine themeName (removing from data before massage)
                        var themeName = response.themes[themeIdx].name;
                        delete response.themes[themeIdx].name;

                        // massage and load up the data for the report
                        self.prepareForYear(response.themes[themeIdx], year);
                        self.loadStratOrThemeByMonth(response.themes[themeIdx], year);

                        // update subtitle
                        $('header > hgroup > h2').text(self.subcontext(year, themeName));

						$('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });

            },

            subcontext: function(year, themeName) {
                if (year === undefined) {
                    var pageIdx = this.router.page;
                    year = this.getYear(this.json.themes, pageIdx);
                    var themeIdx = this.getThemeIdx(this.json.themes, pageIdx);
                    themeName = this.json.themes[themeIdx].name;                    
                };                
                var ordinal = this.localized((year+1)+'long');
                ordinal = ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
                return sprintf(this.localized('title'), themeName, ordinal);
            },            

            contentForPdf: function() {
                // all years
                var numThemes = this.json.themes.length;
                if (numThemes == 0) {
                    console.warn("No themes.");
                    return $('<div></div>').text(this.localized('warn_no_themes'));
                };

                // total number of pages
                var numPages = 0;
                _.each(this.json.themes, function(themeJson) {
                    var numYears = Math.ceil(themeJson.header.headers.length/12);
                    numPages += numYears;
                });

                var compiledTemplate = Handlebars.templates['reports/R4.ThemeByMonth'];
                var html = compiledTemplate(this._localizable);
                var $tblTemplate = $(html).find('.reportTable');

                var $wrapper = $('<div></div>');
                for (var i=0; i<numPages; ++i) {
                    var themeIdx = this.getThemeIdx(this.json.themes, i);
                    var year = this.getYear(this.json.themes, i);

                    // use a clone, so we don't screw up subsequent years
                    var themeData = JSON.parse(JSON.stringify(this.json.themes[themeIdx]));

                    // determine themeName (removing from data before massage)
                    var themeName = themeData.name;
                    delete themeData.name;
                    this.prepareForYear(themeData, year);

	                // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                    var $subcontext = $('<h6>')
                        .prop('id', 'subcontext' + (i+1))
                        .addClass('subcontextEntry')
                        .text(this.subcontext(year, themeName));
	                $wrapper.prepend($subcontext);

                    // start up our table
                    var $tbl = $tblTemplate.clone();
                    $tbl.css({'page-break-inside': 'avoid'}).addClass('dynamicSubcontext');
                    var $thead = $tbl.find('thead');
                    var $tbody = $tbl.find('tbody');
                    $thead.append(this.datesRow(themeData.header.headers[0], year));

                    this.addRows($tbody, themeData);

                    $wrapper.append($tbl);
                }

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


            getThemeIdx: function(themes, pageIdx) {
                var ctr = 0, themeIdx = 0;
                for (var i=0; i<themes.length;++i) {
                    var numYears = Math.ceil(themes[i].header.headers.length/12);
                    ctr += numYears;
                    if (pageIdx < ctr) {
                        return themeIdx;
                    } else {
                        themeIdx++;
                    }        
                }
            },

            getYear: function(themes, pageIdx) {
                var ctr = 0;
                for (var i=0; i<themes.length;++i) {
                    var numYears = Math.ceil(themes[i].header.headers.length/12);
                    if (pageIdx < ctr + numYears) {
                        return pageIdx - ctr;
                    } else {
                        ctr += numYears;
                    }
                }
            }

        });

        return view;
    });