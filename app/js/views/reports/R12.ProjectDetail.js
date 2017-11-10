define(['BaseReport', 'views/reports/R5.ThemeDetail', 'i18n!nls/R5.ThemeDetail.i18n', 'Config'],

    function(BaseReport, ProjectDetail, localizable, config) {

        var view = ProjectDetail.extend({

            initialize: function(router, gLocalizable) {
                _.defaults(localizable, gLocalizable);
                ProjectDetail.prototype.initialize.call(this, router, localizable);
            },            

            load: function() {
                BaseReport.prototype.load.call(this);

                var compiledTemplate = Handlebars.templates['reports/R5.ThemeDetail'];
                var projectPlanTemplate = compiledTemplate(this._localizable);
                this.$el = $(projectPlanTemplate).find('table#themeDetailReport');
                
                var self = this;

                // fetch report for current stratFile
                return $.ajax({
                    url: config.serverBaseUrl + "/reports/themedetail",
                    type: "GET",
                    dataType: 'json',
                    data: {
                        'id': self.router.stratFileManager.stratFileId
                    },
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        var numThemes = response.themes.length;
                        if (numThemes == 0) {
                            var $td = $('<th>').attr('colspan', '8').text(self.localized('r5_warn_no_themes'));
                            self.$el.find('tbody').append( $('<tr>').append($td) );
                            return;
                        };

                        // need to make a table for each theme
                        // can all be siblings
                        // use the table in the handlebars as a template
                        // will then go over each table and create some json
                        // each piece of json will be added to an array

                        self.sortThemes(response.themes);

                        // take a clone of our table template
                        var $parent = self.$el.parent();
                        var $tblTemplate = self.$el.remove();

                        for (var i = 0; i < response.themes.length; i++) {
                            var themeJson = response.themes[i];
                            
                            // new table for each theme
                            self.$el = $tblTemplate.clone();
                            self.$el.data('themeName', themeJson.name);
                            var $tbody = self.$el.find('tbody');

                            if (themeJson.objectives.length == 0) {
                                var $td = $('<th>').attr('colspan', '8').text(self.localized('r5_warn_no_objectives'));
                                self.$el.find('tbody').append( $('<tr>').append($td) );
                            } else {
                                self.addThemeDetailRows($tbody, themeJson);                            
                            }

                            $parent.append(self.$el);
                        };

                        self.$el = $parent.find('.reportTable');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            loadThemeDetailReport: function(json, $tbody) {
                // var $tbody = this.$el.find('tbody');
                this.addThemeDetailRows($tbody, json);
            },

            jsonForBizPlan: function($tbl) {
                // basically sending row by row json
                var json = [];

                // custom 2 row header
                var headings = [];
                $tbl.find('thead tr td, thead tr th').each(function() {
                    headings.push($(this).text());
                });

                // ["Objectives", "Scorecard", "", "", "Activity", "", "", ""]
                // ["", "Measure", "Target", "Date", "Action", "1st Year Cost", "Start", "End"]

                json.push({
                    "values": [sprintf(this.localized('r5_project_label_for_docx'), $tbl.data('themeName'))],
                    "indent": 1,
                    "border": 3
                });

                json.push({
                    "values": [headings[0], headings[1], "", "", headings[2], "", "", ""],
                    "indent": 1,
                    "border": 2
                });

                json.push({
                    "values": [""].concat(headings.slice(4)),
                    "indent": 1,
                    "border": 2
                });

                // go through the body, but not any nested tables
                $tbl.children('tbody').children('tr').each(function() {

                    // possible values are 1, 2, 3, 4, where 1 is no indent and the default if not specified
                    // look at the first td in a row for the class
                    // will be rowLevel1 (or 2,3,4)
                    var indent = 1;
                    var $row = $(this);
                    var $rowHeader = $row.children(":first");
                    if ($rowHeader.hasClass('rowLevel2')) {
                        indent = 2;
                    } 
                    else if ($rowHeader.hasClass('rowLevel3')) {
                        indent = 3;
                    } 
                    else if ($rowHeader.hasClass('rowLevel4')) {
                        indent = 4;
                    }
                    else if ($rowHeader.hasClass('objectiveGroup')) {
                        $rowHeader.text($rowHeader.text().toUpperCase());
                    }


                    // rowDivider1 goes on top of the row; rowDivider 2 and 3 go on the bottom
                    // possible values are:
                    //  0, nil or no attribute - no border
                    //  1 - 1 px solid top
                    //  2 - 2 px solid bottom
                    //  3 - 3 px double bottom
                    //  4 - both 1 and 3
                    var border = 0;
                    if ($row.hasClass('rowDivider1')) {
                        if ($row.hasClass('rowDivider3')) {
                            border = 4;
                        } else {
                            border = 1;
                        }
                    } else if ($row.hasClass('rowDivider2')) {
                        border = 2;
                    } else if ($row.hasClass('rowDivider3')) {
                        border = 3;
                    }

                    // there is a hierarchy of sorts here
                    // 1 objective
                    // multiple metrics per obj
                    // multiple activities per obj

                    // we need to straighten this out so that we have as many rows as max metrics|activities
                    // we are representing each row visually, so for example row 2 would not have the objective row header
                    // metrics and activities are in nested tables
                    var objName = $row.find('th:first').text();
                    var $metrics = $row.find('table:eq(0) tr');
                    var $activities = $row.find('table:eq(1) tr');

                    var numMetrics = $metrics.length;
                    var numActivities = $activities.length;
                    var numRows = Math.max(1, numMetrics, numActivities);

                    // push rows
                    for (var i = 0; i < numRows; i++) {
                        var row = {
                            "values": [],
                            "indent": indent,
                            "border": border
                        };

                        // objective
                        row.values.push( i==0 ? objName : '');

                        // metrics
                        if (numMetrics && i<numMetrics) {
                            $($metrics[i]).find('td').each(function() {
                                row.values.push($(this).text());
                            });
                        } else {
                            row.values.push('','','');
                        }

                        // activities
                        if (numActivities && i<numActivities) {
                            $($activities[i]).find('td').each(function() {
                                row.values.push($(this).text());
                            });
                        } else {
                            row.values.push('','','', '');
                        }

                        // send row
                        json.push(row);
                    };

                });

                return json;

            }

        });

        return view;
    });