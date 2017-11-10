define(['BaseReport', 'StratFileInfo', 'Discussion', 'Config', 'UpgradeMenuView', 'EditionManager', 'i18n!nls/R9.BizPlanSummary.i18n', 'views/reports/R9.BizPlanSummary',
    'BizPlanGanttChart', 'BizPlanGoalsChart', 'BizPlanProgressChart',
    // no idea why we can't simply place these paths in main
    'views/reports/BalanceSheetSummary', 'views/reports/BalanceSheetDetail', 
    'views/reports/CashFlowSummary', 'views/reports/CashFlowDetail', 
    'views/reports/IncomeStatementSummary', 'views/reports/IncomeStatementDetail', 'views/reports/WorksheetDetail',
    'views/reports/R12.ProjectPlan', 'views/reports/R12.ProjectDetail'
    ],

    function( BaseReport, StratFileInfo, Discussion, config, UpgradeMenuView, EditionManager, r9_localizable, BizPlanSummary,
        GanttChart, GoalsChart, ProgressChart, 
        BalanceSheetSummary, BalanceSheetDetail, 
        CashFlowSummary, CashFlowDetail, 
        IncomeStatementSummary, IncomeStatementDetail, WorksheetDetail,
        ProjectPlan, ProjectDetail) 
    {

        var view = BaseReport.extend({

            reportName: 'BizPlanSummary',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", 'downloadBizPlanDocx');
                _.defaults(localizable, r9_localizable);
                BaseReport.prototype.initialize.call(this, router, localizable);

                var self = this,
                    $btn = $('#pageContent section #downloadBizPlanDocx');
                $btn.removeAttr('disabled');
                $btn.on(this.router.clicktype, function(ev) {
                    $btn.attr('disabled','disabled');
                    self.downloadBizPlanDocx();
                });

            },

            load: function() {
                BaseReport.prototype.load.call(this);

                // clear out status text
                $("#pageContent section #status span").text("");
            },

            downloadBizPlanDocx: function() {
                var isDocxExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportDocx);
                if(!isDocxExportEnabled){
                    new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportDocx);
                    return;
                }

                var self = this;
                var $status = $("#pageContent section #status span");

                // clear out status text
                $status.text("");

                var opts = _.extend({left: '-35px'}, $.fn.spin.presets.small); 
                $status.parent().spin(opts);

                var content = {
                  "summary_ratios" : [],
                  "summary_schedules" : [],
                  "detailed_ratios" : [],
                  "detailed_schedules" : [],
                  "logo" : ""
                };

                var stratFileId = this.router.stratFileManager.stratFileId;

                var deferred = $.Deferred();
                deferred.resolve();



                // get the latest stratfileInfo
                var stratFileInfo = new StratFileInfo({stratFileId: stratFileId});
                deferred = deferred.then(function() {
                    $status.text("Generating Business Plan...");
                    return stratFileInfo.fetch({
                        success: function(model) {
                            console.debug("Downloaded StratFileInfo");

                            var user = $.parseJSON($.localStorage.getItem('user'));

                            // update json
                            _.extend(content, {
                              "email" : user.email,
                              "fullname" : $.stratweb.fullname(user.firstname, user.lastname),
                              "report" : self.router.report.localizedReportName(), 
                              "company" : stratFileInfo.get('companyName'),
                              "title" : stratFileInfo.get('name'),
                              "lang" : "en",
                              "currency" : stratFileInfo.get('currency') || user.preferredCurrency || '$',
                            });
                              
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load sourceModel. Status: %s %s", xhr.status, xhr.statusText));
                        }
                    });

                });



                // discussion and strategy fields
                var discussion = new Discussion({stratFileId: stratFileId});
                deferred = deferred.then(function() {
                    $status.text("Generating Discussion...");
                    return discussion.fetch({
                        success: function(model) {
                            console.debug("Downloaded Discussion");

                            var bizPlanSummary = new BizPlanSummary(self.router, r9_localizable);

                            // update json
                            _.extend(content, {

                              "introduction" : $.stratweb.stripHTML(bizPlanSummary.generateSectionAContentForStratFile(stratFileInfo, discussion).html().replace(/<br>/g, "\n")),
                              "target_customers" : discussion.get('customersDescription'),
                              "industry_issues" : discussion.get('keyProblems'),
                              "solution" : discussion.get('addressProblems'),
                              "competition" : discussion.get('competitorsDescription'),
                              "business_model" : discussion.get('businessModelDescription'),
                              "sales_and_marketing": discussion.get('salesAndMarketing'),
                              "opportunities" : discussion.get('expansionOptionsDescription'),
                              "management": discussion.get('management')

                            });

                            bizPlanSummary = null;
                              
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load sourceModel. Status: %s %s", xhr.status, xhr.statusText));
                        }
                    });

                });



                // the 3 summary charts (ala R9)
                deferred = deferred.then(function() {
                    $status.text("Generating Gantt Chart, Summarized...");

                    self.summaryGanttChart = new GanttChart(self.router, self._localizable);
                    return self.summaryGanttChart.load();
                });

                deferred = deferred.then(function() {
                    $status.text("Generating Key Metrics...");

                    self.goalsChart = new GoalsChart(self.router, self._localizable, self.summaryGanttChart.chartStartDate, self.summaryGanttChart.columnIntervalInMonths);
                    self.goalsChart.stratFileId = stratFileId;
                    return self.goalsChart.load();
                });

                deferred = deferred.then(function() {
                    $status.text("Generating Operational Financial Performance, Summarized...");

                    self.progressChart = new ProgressChart(self.router, self._localizable);
                    return self.progressChart.load();
                });



                // the 3 summary financial reports
                // - we need to render these to their html, then get that back as json suitable for our docx

                deferred = deferred.then(function() {
                    $status.text("Generating Summary Income Statement...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/incomestatement/summary",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/IncomeStatement.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);
                                var incomeStatementSheetSummary = new IncomeStatementSummary(self.router, localizable);
                                incomeStatementSheetSummary.el = '<div><table class="reportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = incomeStatementSheetSummary.loadIncomeStatementSummary(response);

                                content.summary_income_statement = self.jsonForTable($tbl, false);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });

                deferred = deferred.then(function() {
                    $status.text("Generating Summary Statement of Cash Flows...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/cashflow/summary",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/CashFlow.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var cashFlowSheetSummary = new CashFlowSummary(self.router, self._localizable);
                                cashFlowSheetSummary.el = '<div><table class="reportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = cashFlowSheetSummary.loadCashFlowSummary(response);

                                content.summary_cash_flow = self.jsonForTable($tbl, false);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });

                deferred = deferred.then(function() {
                    $status.text("Generating Summary Balance Sheet...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/balancesheet/summary",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/BalanceSheet.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var balanceSheetSummary = new BalanceSheetSummary(self.router, self._localizable);
                                balanceSheetSummary.el = '<div><table class="reportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = balanceSheetSummary.loadBalanceSheetSummary(response);

                                content.summary_balance_sheet = self.jsonForTable($tbl, false);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });



                // the 4 detailed financial reports

                deferred = deferred.then(function() {
                    $status.text("Generating Detailed Income Statement...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/incomestatement/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/IncomeStatement.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var incomeStatementSheetDetail = new IncomeStatementDetail(self.router, self._localizable);
                                incomeStatementSheetDetail.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = incomeStatementSheetDetail.loadIncomeStatementDetail(response, "MMM[linefeed]YYYY");

                                var duration = Math.ceil(incomeStatementSheetDetail.duration/12); // years
                                content.detailed_income_statement = self.jsonForTable($tbl, true, duration);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });

                deferred = deferred.then(function() {
                    $status.text("Generating Detailed Statement of Cash Flows...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/cashflow/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/CashFlow.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var cashFlowSheetDetail = new CashFlowDetail(self.router, self._localizable);
                                cashFlowSheetDetail.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = cashFlowSheetDetail.loadCashFlowDetail(response, "MMM[linefeed]YYYY");

                                var duration = Math.ceil(cashFlowSheetDetail.duration/12); // years
                                var cfJson = self.jsonForTable($tbl, true, duration);

                                // we need to do some special handling in the total columns on each page
                                for (var i = 0; i < cfJson.length; i++) {
                                    var pageJson = cfJson[i];
                                    var cashEndRow = pageJson[pageJson.length-1];
                                    var cashStartRow = pageJson[pageJson.length-2];

                                    // matches prev coloumn
                                    cashEndRow.values[cashEndRow.values.length-1] = cashEndRow.values[cashEndRow.values.length-2];

                                    // matches first value column
                                    cashStartRow.values[cashStartRow.values.length-1] = cashStartRow.values[1];

                                };

                                content.detailed_cash_flow = cfJson;
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });

                deferred = deferred.then(function() {
                    $status.text("Generating Detailed Balance Sheet...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/balancesheet/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/BalanceSheet.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var balanceSheetDetail = new BalanceSheetDetail(self.router, self._localizable);
                                balanceSheetDetail.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = balanceSheetDetail.loadBalanceSheetDetail(response, "MMM[linefeed]YYYY");

                                var duration = Math.ceil(balanceSheetDetail.duration/12); // years
                                content.detailed_balance_sheet = self.jsonForTable($tbl, true, duration, false);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });

                deferred = deferred.then(function() {
                    $status.text("Generating Detailed Worksheet...");

                    return $.ajax({
                        url: config.serverBaseUrl + "/reports/worksheet/details",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': self.router.stratFileManager.stratFileId
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            require(['i18n!nls/Worksheet.i18n'], function(localizable) {
                                var localizable = _.extend(self._localizable, localizable);

                                var worksheetDetail = new WorksheetDetail(self.router, self._localizable);
                                worksheetDetail.el = '<div><table id="fullReportTable" class="fullReportTable"><thead></thead><tbody></tbody></table></div>';
                                var $tbl = worksheetDetail.loadWorksheetDetail(response, "MMM[linefeed]YYYY");

                                var duration = Math.ceil(worksheetDetail.duration/12); // years
                                content.detailed_worksheet = self.jsonForTable($tbl, true, duration);
                            });

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("%s: %s", textStatus, errorThrown);
                        });

                });




                deferred = deferred.then(function() {
                    $status.text("Generating Gantt Chart, Detailed...");

                    self.ganttChart = new GanttChart(self.router, self._localizable);
                    self.ganttChart.showMetrics = true;
                    return self.ganttChart.load();
                });

                deferred = deferred.then(function() {
                    $status.text("Generating Project Plan...");

                    self.projectPlan = new ProjectPlan(self.router);
                    return self.projectPlan.load();
                });

                deferred = deferred.then(function() {
                    $status.text("Generating Project Detail Report...");

                    self.projectDetail = new ProjectDetail(self.router, self._localizable);
                    // create mutiple tables - one per theme/project and save in self.projectDetail.$el
                    return self.projectDetail.load();
                });


                // submit json
                deferred = deferred.then(function() {
                    $status.text("Generating Business Plan...");

                    // assemble summary charts
                    var opts = $.stratweb.defaultExportOpts({extension: 'docx'});

                    _.extend(content, {
                        "gantt": [],
                        "summary_gantt": [],
                        "metrics": [],
                        "performance": [],
                        "project_detail": []
                    });
                    
                    // eg. /css/style.1311260205.css or /css/style.css - both will work but first is cache-proof
                    var baseUrl = sprintf('https://%s', config.staticServerName);
                    var compiledTemplate = Handlebars.templates['reports/BizPlanPageWrapperForDocx'];

                    $.stratweb
                        .splitTable(self.summaryGanttChart.$el)
                        .each(
                            function() {
                                var pageMarkup = compiledTemplate({
                                    baseUrl: baseUrl,
                                    content: $('<div></div>').append($(this)).html() // wrap with div just so we can get innerhtml
                                });
                                content.summary_gantt.push(encodeURIComponent(pageMarkup));
                            }
                        );

                    $.stratweb
                        .splitTable(self.goalsChart.$el)
                        .each(
                            function() {
                                var pageMarkup = compiledTemplate({
                                    baseUrl: baseUrl,
                                    content: $('<div></div>').append($(this)).html() // wrap with div just so we can get innerhtml
                                });
                                content.metrics.push(encodeURIComponent(pageMarkup));
                            }
                        );                    

                    var progressMarkup = compiledTemplate({
                        baseUrl: baseUrl,
                        content: $('<div></div>').append(self.progressChart.$el).html()
                    });
                    content.performance.push(encodeURIComponent(progressMarkup));

                    // add full gantt
                    $.stratweb
                        .splitTable(self.ganttChart.$el)
                        .each(
                            function() {
                                var pageMarkup = compiledTemplate({
                                    baseUrl: baseUrl,
                                    content: $('<div></div>').append($(this)).html() // wrap with div just so we can get innerhtml
                                });
                                content.gantt.push(encodeURIComponent(pageMarkup));
                            }
                        );

                    // projectPlan report
                    content.project_plan = self.jsonForTable(self.projectPlan.$el, false);

                    // projectDetail (themeDetail) report
                    self.projectDetail.$el.each(function() {
                        // one table per page ie one page per project/theme
                        var jsonForTable = self.projectDetail.jsonForBizPlan($(this));
                        content.project_detail.push(jsonForTable);
                    });

                    // detailed bizplan
                    var postUrl = sprintf('%s/detailedbizplan', config.serverBaseUrl);

                    // set up a form so we can submit some html and get a download
                    var $docxForm = $('<form></form>').attr({'action': postUrl, 'method': 'POST'});
                    $('<input type="hidden" name="content">').val(JSON.stringify(content)).appendTo($docxForm);
                    $('<input type="hidden" name="inline">').val('false').appendTo($docxForm);
                    $('<input type="hidden" name="filename">').val(opts.fileName).appendTo($docxForm);
                    $('<input type="hidden" name="dateModified">').val(opts.stratFile.get('modificationDate')).appendTo($docxForm);
                    $docxForm.appendTo('body').submit();
                    $docxForm.remove();

                });

                // finish off
                deferred = deferred.then(function() {
                    $status.text("Business Plan submitted. Please wait for your download.");
                    $status.parent().spin(false);
                    $('#pageContent section #downloadBizPlanDocx').removeAttr('disabled');

                    self.summaryGanttChart = null;
                    self.goalsChart = null;
                    self.progressChart = null;
                });


            },

            // row by row json representation of some table html, for rendering in a Docx
            jsonForTable: function($tbl, isDetails, duration, includeTotalCol) {
                  includeTotalCol = includeTotalCol !== undefined ? includeTotalCol : true;
                  var json = [];

                  // go through the head - this assumes a single row header, which is good for financials, but not for project detail report
                  var row = {"values":[], "indent": 1, "border": 2};
                  $tbl.find('thead tr td, thead tr th').each(function() {
                        row["values"].push($(this).text());
                  });
                  json.push(row);

                  // through the body
                  $tbl.find('tbody tr').each(function() {
                        
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
                        }
                        else if ($row.hasClass('rowDivider2')) {
                              border = 2;
                        }
                        else if ($row.hasClass('rowDivider3')) {
                              border = 3;
                        }

                        var row = {"values":[], "indent": indent, "border": border};
                        $(this).find('td, th').each(function() {
                              if (isDetails) {
                                    var $cell = $(this);
                                    var val = $cell.attr('val');
                                    if (!val) {
                                          val = $cell.text();
                                    } else {
                                          val = val*1;
                                    }
                                    row["values"].push(val);                     
                              } else {
                                    row["values"].push($(this).text());
                              }
                        });
                        json.push(row);
                  });

                  if (isDetails) {
                        // figure out the duration (n) in years, <=8
                        // now, we go through this n times
                        // 1st col in values is always row header
                        // if it's 2 cols, it is a spacer or just a heading - can just copy verbatim
                        // we basically produce the same structure n times, with the next set of 12 values
                        // so an array of arrays
                        var pagedJson = [];
                        for (var i = 0; i < duration; i++) {
                              var pageJson = [];
                              for (var j = 0, ct = json.length; j < ct; ++j) {
                                    var row = json[j];
                                    var pagedRow = {"values":[], "indent": row.indent, "border": row.border};
                                    var rowHeader = row.values[0].replace(/\u00a0/g, " "); // get rid of &nbsp;
                                    pagedRow.values.push(rowHeader);
                                    if (row.values.length > 2) {
                                          var sliceStart = 1 + i*12;
                                          var sliceEnd = sliceStart + 12;
                                          var slice = row.values.slice(sliceStart, sliceEnd);
                                          var rowSum = 0;
                                          for (var k = 0; k < slice.length; k++) {
                                                if (j == 0) {
                                                      // col headers row
                                                      pagedRow.values.push(slice[k]);
                                                } else {
                                                      // value rows
                                                      pagedRow.values.push($.stratweb.formatNumberWithParens(slice[k]));
                                                      rowSum += slice[k];                                          
                                                }
                                          };
                                          if (includeTotalCol) {
                                              if (j==0) {
                                                    // column headers row doesn't need a 13th "total" column header
                                                    pagedRow.values.push("");
                                              } else {
                                                    pagedRow.values.push($.stratweb.formatNumberWithParens(rowSum));                                    
                                              }                                            
                                          };
                                    }
                                    pageJson.push(pagedRow);
                              };
                              pagedJson.push(pageJson);
                        };
                        return pagedJson;
                  } else {
                        return json;
                  }

            }            

        });

        return view;
    });