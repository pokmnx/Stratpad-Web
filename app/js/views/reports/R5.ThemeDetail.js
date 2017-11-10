define(['Config', 'BaseReport', 'PageStructure'],

    function(config, BaseReport, pageStructure) {

        var view = BaseReport.extend({

            reportName: 'ThemeDetail',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", "responsibleText", "subcontext", "contentForPdf");
                BaseReport.prototype.initialize.call(this, router, localizable);
            },

            // we get all themes at once
            // one page per theme
            load: function() {
                BaseReport.prototype.load.call(this);

                $('table#themeDetailReport tbody').empty();
                $('table#themeDetailReport tfoot .responsible').text('');
                $('.warn').remove();

                this.$el.spin();

                var self = this;

                // fetch report for current stratFile
                $.ajax({
                    url: config.serverBaseUrl + "/reports/themedetail?id=" + this.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        var numThemes = response.themes.length;
                        if (numThemes == 0) {
                            var $warnDiv = $('<div class="warn"></div>');
                            $warnDiv.text(self.localized('r5_warn_no_themes'));
                            $('#r5 article').append($warnDiv)
                            return;
                        };

                        var numObjectives = 0;
                        for (var i = response.themes.length - 1; i >= 0; i--) {
                            numObjectives += response.themes[i].objectives.length;
                        };
                        if (numObjectives == 0) {
                            var $warnDiv = $('<div class="warn"></div>');
                            $warnDiv.text(self.localized('r5_warn_no_objectives'));
                            $('#r5 article').append($warnDiv);
                        };

                        // verify we have the right number of pages in pageStructure, and add (or subtract) if necessary
                        pageStructure.setNumberOfReportPages(self.router.chapter, numThemes);
                        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

                        // massage and load up the data for the report
                        var themeIdx = self.router.page;
                        self.sortThemes(response.themes);
                        var themeJson = response.themes[themeIdx];

                        // because json is altered for production of report, save a clone for pdf
                        self.json = JSON.parse(JSON.stringify(response));                                                

                        if (numObjectives) {
                            self.loadThemeDetailReport(themeJson);
                        }

                        // update subtitle
                        $('header > hgroup > h2').text(self.subcontext());

                        // update responsible
                        $('table#themeDetailReport tfoot .responsible').text(self.responsibleText(themeJson));

                        // vertical scrolling
                        $('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });

            },

            subcontext: function(page) {
                if (page === undefined) {
                    page = this.router.page;
                };
                var themeJson = this.json.themes[page];
                return themeJson.name;
            },

            contentForPdf: function() {

                var numThemes = this.json.themes.length;
                if (numThemes == 0) {
                    return $('<div></div>').text(this.localized('r5_warn_no_themes'));
                };

                var numObjectives = 0;
                for (var i = this.json.themes.length - 1; i >= 0; i--) {
                    numObjectives += this.json.themes[i].objectives.length;
                };
                if (numObjectives == 0) {
                    return $('<div></div>').text(this.localized('r5_warn_no_objectives'));                    
                };

                // 1 table per theme
                var compiledTemplate = Handlebars.templates['reports/R5.ThemeDetail'];
                var html = compiledTemplate(this._localizable);
                var $tblTemplate = $(html).find('.reportTable'); 

                var $wrapper = $('<div></div>');
                for (var i=0; i<numThemes; ++i) {

                    var themeJson = this.json.themes[i];

                    // start up our table
                    var $tbl = $tblTemplate.clone();
                    $tbl.css({'page-break-inside': 'avoid'}).addClass('dynamicSubcontext');
                    var $tbody = $tbl.find('tbody');

                    // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                    var $subcontext = $('<h6>')
                        .prop('id', 'subcontext' + (i+1))
                        .addClass('subcontextEntry')
                        .text(this.subcontext(i));    
                    $wrapper.prepend($subcontext);

                    this.addThemeDetailRows($tbody, themeJson);
                    $tbl.find('tfoot .responsible').text(this.responsibleText(themeJson));

                    $wrapper.append($tbl);
                }

                return $wrapper;                
                
            },            

            responsibleText: function(themeJson) {

                var responsible = themeJson.responsible;

                if (responsible && responsible != '') {

                    if (themeJson.startDate) {
                        var startDate = moment(themeJson.startDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);

                        if (themeJson.endDate) {
                            var endDate = moment(themeJson.endDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_ALL_DATA"), responsible, startDate, endDate);
                        } else {
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_RESPONSIBLE_AND_NO_END_DATE"), responsible, startDate);
                        }

                    } else {

                        if (themeJson.endDate) {
                            var endDate = moment(themeJson.endDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_RESPONSIBLE_AND_NO_START_DATE"), responsible, endDate);
                        } else {
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_RESPONSIBLE_AND_NO_START_DATE_OR_END_DATE"), responsible);
                        }
                    }

                } else {

                    if (themeJson.startDate) {
                        var startDate = moment(themeJson.startDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);

                        if (themeJson.endDate) {
                            var endDate = moment(themeJson.endDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_NO_RESPONSIBLE"), startDate, endDate);

                        } else {
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_NO_RESPONSIBLE_AND_NO_END_DATE"), startDate);
                        }

                    } else {

                        if (themeJson.endDate) {
                            var endDate = moment(themeJson.endDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                            return sprintf(this.localized("RESPONSIBLE_TEMPLATE_NO_RESPONSIBLE_AND_NO_START_DATE"), endDate);

                        } else {
                            return this.localized("RESPONSIBLE_TEMPLATE_NO_DATA");
                        }
                    }

                }

                return responsible;

            },

            objectivesOfType: function(type, objectivesJson) {

                var ary = new Array();

                for (var i = 0; i < objectivesJson.length; i++) {
                    if (objectivesJson[i].type === type) {
                        ary.push(objectivesJson[i]);
                    }
                }
                this.sortObjectivesByDate(ary);
                return ary;
            },

            themeDetailObjective: function(json) {

                var objective = '';

                $.each(json, function(index, value) {

                    objective += sprintf('<tr><th>%s</th>', _.escape(value.name));

                    if (value.metrics.length) {
                        this.sortMetrics(value.metrics);
                        objective += '<td colspan=3><table><tbody>';
                        $.each(value.metrics, function(index, value) {
                            var targetDate = value.targetDate ? moment(value.targetDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out) : "&nbsp;";
                            objective += sprintf('<tr><td>%s</td><td class="target">%s</td><td>%s</td></tr>', this.valueOrNbsp(value.name), this.valueOrNbsp(value.targetValue), targetDate);
                        }.bind(this));
                        objective += '</tbody></table></td>';
                    } else {
                        objective += '<td colspan=3><table></table></td>';
                    }

                    if (value.activities.length) {
                        this.sortActivities(value.activities);
                        objective += '<td colspan=4><table><tbody>';
                        $.each(value.activities, function(index, value) {
                            var startDate = value.startDate ? moment(value.startDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out) : "&nbsp;";
                            var endDate = value.endDate ? moment(value.endDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out) : "&nbsp;";
                            objective += sprintf('<tr><td>%s</td><td class="activityCost">%s</td><td>%s</td><td>%s</td></tr>', this.valueOrNbsp(value.name), this.valueOrNbsp(value.firstYearCost), startDate, endDate);
                        }.bind(this));
                        objective += '</tbody></table></td></tr>';
                    } else {
                        objective += '<td colspan=4><table></table></td></tr>';
                    }
                }.bind(this));

                return objective;
            },

            themeDetailRow: function(groupHeading, json) {

                var row = '';

                if (json.length) {
                    row += '<tr class="rowDivider1">';
                    row += sprintf('<th class="objectiveGroup">%s</th><td colspan=7>&nbsp;</td>', _.escape(groupHeading));
                    row += '</tr>';
                    row += this.themeDetailObjective(json);
                }

                return row;
            },

            addThemeDetailRows: function($tbody, json) {

                var rows = '';
                rows += this.themeDetailRow(this.localized('OBJECTIVE_TYPE_FINANCIAL'), this.objectivesOfType('FINANCIAL', json.objectives));
                rows += this.themeDetailRow(this.localized('OBJECTIVE_TYPE_CUSTOMER'), this.objectivesOfType('CUSTOMER', json.objectives));
                rows += this.themeDetailRow(this.localized('OBJECTIVE_TYPE_PROCESS'), this.objectivesOfType('PROCESS', json.objectives));
                rows += this.themeDetailRow(this.localized('OBJECTIVE_TYPE_STAFF'), this.objectivesOfType('STAFF', json.objectives));

                $tbody.append(rows);
            },

            loadThemeDetailReport: function(json) {
                var $tbl = this.prepareTable();
                var $tbody = $tbl.find('tbody');
                $tbody.empty();
                this.addThemeDetailRows($tbody, json);
            },

            valueOrNbsp: function(value) {
                if (value)
                    return _.escape(value);
                else
                    return '&nbsp;';
            },


        });

        return view;
    });