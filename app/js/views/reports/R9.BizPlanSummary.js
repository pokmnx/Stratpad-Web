define(['Config', 'BaseReport', 'StratFileInfo', 'Discussion', 
    'BizPlanGanttChart', 'BizPlanGoalsChart', 'BizPlanProgressChart'],

    function(config, BaseReport, StratFileInfo, Discussion, GanttChart, GoalsChart, ProgressChart) {

        var view = BaseReport.extend({

            reportName: 'BizPlanSummary',

            className: 'BizPlanSummary',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", "generateSectionAContentForStratFile", "generateSectionBContentForStratFile", "isExportEnabled",
                    "_generateCompanyBasicsDescriptionForStratFile", "_generateLocationDescriptionForStratFile", "_generateSectorDescriptionForStratFile",
                    "_footerText", "_prepareContentText", "_refreshTableCellSizes", "_finishedLoadingPart"
                    );
                BaseReport.prototype.initialize.call(this, router, localizable);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                $('#contentA').remove();
                $('#contentB').remove();
                $('#copyright').remove();

                $('#gantt thead tr.colHeader1').empty();
                $('#gantt tbody').empty();

                $('#goals thead tr.colHeader1').empty();
                $('#goals tbody').empty();

                $('#progress thead tr.colHeader1').empty();
                $('#progress tbody').empty();
                $('#progress tfoot').remove();

                var self = this;

                this.ganttChart = null;
                this.progressChart = null;
                this.goalsChart = null;

                this.parts = {
                    "BizPlanSummary": 0,
                    "GanttChart": 0,
                    "GoalsChart": 0,
                    "ProgressChart": 0
                };

                this.spin();

                // load up discussion and stratfileinfo
                var deferreds = [];

                this.stratFileInfo = new StratFileInfo({stratFileId: this.stratFileId});                
                deferreds.push(this.stratFileInfo.fetch({
                    success: function(model, xhr, options) {
                        console.debug('Loaded StratFileInfo');
                    },
                    error: function(model, xhr, options) {
                        console.error(sprintf("Oops, couldn't load StratFileInfo. Status: %s %s", xhr.status, xhr.statusText) );
                    }                    
                }));

                this.discussion = new Discussion({stratFileId: this.stratFileId});
                deferreds.push(this.discussion.fetch({
                    success: function(model, xhr, options) {
                        console.debug('Loaded Discussion');
                    },
                    error: function(model, xhr, options) {
                        console.error(sprintf("Oops, couldn't load Discussion. Status: %s %s", xhr.status, xhr.statusText) );
                    }                                        
                }));

                $.when.apply($, deferreds).done(function() {
                    // we do actually get two arrays of 3 items each passed in as arguments here - unfortunately they are raw from $.ajax (rather than the backbone models)

                    $('#sectiona').append(self.generateSectionAContentForStratFile(self.stratFileInfo, self.discussion));
                    $('#sectionb').append(self.generateSectionBContentForStratFile(self.discussion));

                    // section c - will load goals chart when this finishes
                    self.ganttChart = new GanttChart(self.router, self._localizable);                        
                    self.ganttChart.load(self._finishedLoadingPart);

                    // section e
                    self.progressChart = new ProgressChart(self.router, self._localizable);
                    self.progressChart.load(self._finishedLoadingPart);

                    // copyright - append late so that the report loading looks decent
                    $("#sectione").parent().append("<div id=\"copyright\">" + self._footerText() + "</div>");

                    self._finishedLoadingPart("BizPlanSummary");

                    $('#pageContent').nanoScroller();
                });             

            },

			isExportEnabled: function(fileType){

				if (fileType == 'docx') {
					return true;
				}
				else {
					return BaseReport.prototype.isExportEnabled.call(this, fileType);
				}
			},

            subcontext: function() {
                // stratfile name, or perhaps the logo
                return this.stratFileInfo.get('name');
            },

            contentForPdf: function() {
                var $content = BaseReport.prototype.contentForPdf.call(this).clone();

                // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                // use the same subcontext over and over, in this case
                var $subcontext = $('<h6>')
                    .prop('id', 'subcontext1')
                    .addClass('subcontextEntry')
                    .text(this.subcontext());
                $content.prepend($subcontext);

                $content.find('#sectiona').addClass('dynamicSubcontext');

                return $content;
            },

            _finishedLoadingPart: function(part) {
                this.parts[part] = 1;
                var vals = _.values(this.parts);
                var sum = _.reduce(vals, function(memo, num){ return memo + num; }, 0);
                
                // are all parts loaded?
                if (sum == vals.length) {
                    this.spin(false);

                    $('#pageContent').nanoScroller();

                    // only need to refresh gantt
                    var $tds = $('#gantt.reportTable td:not(.first)');
                    var self = this;
                    var resize_timer;
                    $(window).resize(function() {
                        clearTimeout(resize_timer);
                        resize_timer = setTimeout(self._refreshTableCellSizes($tds), 500);
                    });
                }

                // have to wait until we've determined some dates and durations
                if (part == 'GanttChart') {
                    this.goalsChart = new GoalsChart(this.router, this._localizable, this.ganttChart.chartStartDate, this.ganttChart.columnIntervalInMonths);
                    this.goalsChart.load(this._finishedLoadingPart);
                };
            },

            _refreshTableCellSizes: function($tds) {
                $tds.each(function() {
                    var $td = $(this);
                    $td.children('.innerWrapper').css({
                        'height': 'auto'
                    });
                    $td.each(function() {
                        var $el = $(this);
                        if ($el.html().length !== 0) {
                            $el.children('.innerWrapper').height($el.height());
                        }
                    });
                });
            },

            _prepareContentText: function(contentText) {
                return contentText == undefined ? "" : _.escape(contentText.trim());
            },            

            // section a

            generateSectionAContentForStratFile: function(stratFileInfo, discussion) {
                // Section A:
                // - Company Basics
                // - What is Your Ultimate Aspiration?
                // - What is Your Medium Range Strategic Goal?

                var sectionAContent = $('<div id="contentA"></div>');

                var companyBasics = this._generateCompanyBasicsDescriptionForStratFile(stratFileInfo);
                if (!$.stratweb.isBlank(companyBasics)) 
                    sectionAContent.append(sprintf("%s<br/><br/>", companyBasics));
                if (!$.stratweb.isBlank(discussion.get('ultimateAspiration')))
                    sectionAContent.append(sprintf("%s<br/><br/>", discussion.escape('ultimateAspiration').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank(discussion.get('mediumTermStrategicGoal')))
                    sectionAContent.append(sprintf("%s", discussion.escape('mediumTermStrategicGoal').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));

                return sectionAContent;
            },

            generatePlayBookWhoWeAre: function(stratFileInfo, discussion) {
                return {
                    companyBasics: this._generateCompanyBasicsDescriptionForStratFile(stratFileInfo),
                    ultimateAspiration: discussion.escape('ultimateAspiration').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>"),
                    mediumTermStrategicGoal: discussion.escape('mediumTermStrategicGoal').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")
                }
            },

            _generateCompanyBasicsDescriptionForStratFile: function(stratFileInfo) {
                // we need to have either a company name and location, or a company name and sector.

                var companyName = this._prepareContentText(stratFileInfo.get('companyName'));
                if ($.stratweb.isBlank(companyName)) {
                    return ""; //doesn't make sense to return anything if there is no company name.
                }

                var location = this._generateLocationDescriptionForStratFile(stratFileInfo);
                var sector = this._generateSectorDescriptionForStratFile(stratFileInfo);

                // don't return anything if we only have a company name...
                if ($.stratweb.isBlank(location) && $.stratweb.isBlank(sector)) {
                    return "";
                } else {
                    if (!$.stratweb.isBlank(location) && !$.stratweb.isBlank(sector)) {
                        return sprintf("<strong>%s</strong> %s %s %s.", companyName, location, this.localized("AND"), sector);
                    } else if ($.stratweb.isBlank(location)) {
                        return sprintf("<strong>%s</strong> %s.", companyName, sector);
                    } else {
                        return sprintf("<strong>%s</strong> %s.", companyName, location);
                    }
                }
            },

            _generateLocationDescriptionForStratFile: function(stratFileInfo) {
                var city = this._prepareContentText(stratFileInfo.get('city'));
                var provinceState = this._prepareContentText(stratFileInfo.get('provinceState'));
                var country = this._prepareContentText(stratFileInfo.get('country'));
                var location = "";

                // only include a location description if we have a city.
                if (!$.stratweb.isBlank(city)) {

                    var cityProvCountry = "";

                    if ($.stratweb.isBlank(provinceState)) {

                        if ($.stratweb.isBlank(country)) {
                            cityProvCountry = city;
                        } else {
                            cityProvCountry = sprintf("%s, %s", city, country);
                        }

                    } else {

                        if ($.stratweb.isBlank(country)) {
                            cityProvCountry = sprintf("%s, %s", city, provinceState);
                        } else {
                            cityProvCountry = sprintf("%s, %s, %s", city, provinceState, country);
                        }
                    }

                    location = sprintf(this.localized("COMPANY_LOCATION_TEMPLATE"), cityProvCountry);
                }
                return location;
            },

            _generateSectorDescriptionForStratFile: function(stratFileInfo) {
                var sector1 = this._prepareContentText(this._prepIndustry(stratFileInfo.get('industry')));
                var sector2 = this._prepareContentText(this._prepIndustry(stratFileInfo.get('industryAlt')));

                if (!$.stratweb.isBlank(sector1) && !$.stratweb.isBlank(sector2)) {
                    return sprintf(this.localized('COMPANY_SECTORS'), sector1, sector2);
                }
                else if (!$.stratweb.isBlank(sector1)) {
                    return sprintf(this.localized("COMPANY_SECTOR"), sector1);
                }
                else {
                    return "";
                }

            },

            _prepIndustry: function(industry) {
                if ($.stratweb.isBlank(industry)) {
                    return industry;
                };

                // remove brackets
                industry = industry.replace(/\s?\([^\)]+\)\s?/, " ").trim();

                var m = industry.match(/,/g)
                var count = m ? m.length : 0;
                if (count == 0) {
                    return industry.toLowerCase();
                }
                else if (count == 1) {
                    // if we find an industry which just has two parts (eg. Agencies, real estate) change it to real estate agencies
                    var parts = industry.split(',');
                    return parts[1].toLowerCase().trim() + ' ' + parts[0].toLowerCase().trim();
                } else {
                    // if we find an industry with multiple commas, just use the first part
                    return industry.split(',')[0].toLowerCase();
                }
            },
            // section b

            generateSectionBContentForStratFile: function(discussion) {
                // Section B
                // - Describe Customers
                // - Key Problems
                // - How You Address Customer Problems
                // - Who Are Your Competitors?
                // - Discuss Your Business Model
                // - Discuss Expansion Options

                var sectionBContent = $('<div id="contentB"></div>');
                if (!$.stratweb.isBlank( discussion.get('customersDescription')))
                    sectionBContent.append(sprintf("%s<br/><br/>",  discussion.escape('customersDescription').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank( discussion.get('keyProblems')))
                    sectionBContent.append(sprintf("%s<br/><br/>",  discussion.escape('keyProblems').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank( discussion.get('addressProblems')))
                    sectionBContent.append(sprintf("%s<br/><br/>",  discussion.escape('addressProblems').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank( discussion.get('competitorsDescription')))
                    sectionBContent.append(sprintf("%s<br/><br/>",  discussion.escape('competitorsDescription').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank( discussion.get('businessModelDescription')))
                    sectionBContent.append(sprintf("%s<br/><br/>",  discussion.escape('businessModelDescription').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                if (!$.stratweb.isBlank( discussion.get('expansionOptionsDescription')))
                    sectionBContent.append(sprintf("%s",  discussion.escape('expansionOptionsDescription').replace("\r\n", "<br/>").replace(/[\r|\n]/g, "<br/>")));
                return sectionBContent;
            },

            // footer

            _footerText: function()
            {
                var year = moment().format('YYYY');                
                var companyName = $.stratweb.isBlank(this.stratFileInfo.get('companyName')) ? sprintf("[%s]", this.localized("COMPANY_NAME")) : this.stratFileInfo.escape('companyName');
                var copyrightText = sprintf(this.localized("R9_COPYRIGHT_TEMPLATE"), year, companyName);
                
                // if the copyright text doesn't end with a period, then ensure we add one before continuing.
                if (copyrightText.charAt(copyrightText.length-1) != '.') {
                    copyrightText += '.';
                }
                
                return sprintf("%s %s", copyrightText, this.localized("R9_ALL_RIGHTS_RESERVED"));
            }



        });

        return view;
    });