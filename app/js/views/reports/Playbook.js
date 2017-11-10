define(['BaseReport', 'StratFileInfo', 'Discussion', 'Config', 'UpgradeMenuView', 'EditionManager', 'i18n!nls/R9.BizPlanSummary.i18n', 
   'PlaybookBizPlanSummary', 'PlaybookGantt', 'PlaybookAgenda', 'PlaybookWorksheet', 'PlaybookCashFlow', 'PlaybookIncome', 'ExportDialog',
    // no idea why we can't simply place these paths in main
    'views/reports/BalanceSheetSummary', 'views/reports/BalanceSheetDetail', 
    'views/reports/CashFlowSummary', 'views/reports/CashFlowDetail', 
    'views/reports/IncomeStatementSummary', 'views/reports/IncomeStatementDetail',
    
    ],

    // todo: i18n
    function( BaseReport, StratFileInfo, Discussion, config, UpgradeMenuView, EditionManager, r9_localizable, 
        PlaybookBizPlanSummary, PlaybookGantt, PlaybookAgenda, PlaybookWorksheet, PlaybookCashFlow, PlaybookIncome, ExportDialog,
        BalanceSheetSummary, BalanceSheetDetail, 
        CashFlowSummary, CashFlowDetail, 
        IncomeStatementSummary, IncomeStatementDetail
        ) 
    {

        var view = BaseReport.extend({

            reportName: 'Playbook',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", 'downloadPlaybookPdf');
                _.defaults(localizable, r9_localizable);
                BaseReport.prototype.initialize.call(this, router, localizable);

                var self = this,
                    $btn = $('#pageContent section #downloadPlaybookPdf');
                $btn.removeAttr('disabled');
                $btn.on(this.router.clicktype, function(ev) {
                    $btn.attr('disabled','disabled');
                    self.downloadPlaybookPdf(ev);
                });

            },

            load: function() {
                BaseReport.prototype.load.call(this);

                // clear out status text
                $("#pageContent section #status span").text("");

                var $startDate = $('#pageContent #startDate');
                $startDate.val(moment().format('MMM YYYY'));
                $startDate.monthpicker({
                    pattern: 'mmm yyyy'
                });
                $startDate.prev('i').on(self.router.clicktype, function() {
                    $startDate.monthpicker("show");
                });                            

            },

            downloadPlaybookPdf: function(e) {
                var isExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportPlaybook);
                if(!isExportEnabled){
                    new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportPlaybook);
                    return;
                }

                var self = this;
                var $status = $("#pageContent section #status span");

                // clear out status text
                $status.text("");

                // spin
                var opts = _.extend({left: '-35px'}, $.fn.spin.presets.small); 
                $status.parent().spin(opts);

                // user-selected date
                this.startDate = moment($('#startDate').val(), 'MMM YYYY');

                // store content here temporarily
                self.content = {
                  "logo" : "",
                  "startDate": this.startDate.format('MMMM YYYY')
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
                            _.extend(self.content, {
                              "email" : user.email,
                              "fullname" : $.stratweb.fullname(user.firstname, user.lastname),
                              "report" : self.router.report.localizedReportName(), 
                              "company" : stratFileInfo.get('companyName'),
                              "title" : stratFileInfo.get('name'),
                              "lang" : "en",
                              "currency" : stratFileInfo.get('currency') || user.preferredCurrency || '$',
                            });

                            self.stratFileName = stratFileInfo.get('name');
                              
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

                            var bizPlanSummary = new PlaybookBizPlanSummary(self.router, r9_localizable);

                            // update json
                            _.extend(self.content, 
                                bizPlanSummary.generatePlayBookWhoWeAre(stratFileInfo, discussion), 
                                {
                                  "target_customers" : discussion.get('customersDescription'),
                                  "industry_issues" : discussion.get('keyProblems'),
                                  "solution" : discussion.get('addressProblems'),
                                  "competition" : discussion.get('competitorsDescription'),
                                  "business_model" : discussion.get('businessModelDescription'),
                                  "sales_and_marketing": discussion.get('salesAndMarketing'),
                                  "opportunities" : discussion.get('expansionOptionsDescription'),
                                  "management": discussion.get('management')

                                });

                            // we make a new BizPlanSummary
                            // it binds a listener to document as part of it's BaseReport.initialize
                            // thus when stratfile changes, it loads up again
                            // but we don't need that here!

                            bizPlanSummary = null;
                              
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load sourceModel. Status: %s %s", xhr.status, xhr.statusText));
                        }
                    });

                });



                // the Summary Gantt Chart
                deferred = deferred.then(function() {
                    $status.text("Generating Gantt Chart, Summarized...");

                    self.content.gantt = new PlaybookGantt(self.router, self.startDate);
                    return self.content.gantt.load();
                });

                // one month of Agenda using user-selected MONTH & YEAR.
                deferred = deferred.then(function() {
                    $status.text("Generating Project Agenda...");

                    self.content.playbookAgendaThisMonth = new PlaybookAgenda(self.router, self.startDate);
                    return self.content.playbookAgendaThisMonth.load();
                });

                // one month of Agenda using user-selected MONTH & YEAR.
                // sometimes the meetings at the end of month 1 are repeated at the beginning of month 2 - remove from month 2
                deferred = deferred.then(function(response) {
                    $status.text("Generating Project Agenda...");

                    var startDate = moment(self.startDate).add(1, 'month');

                    self.content.playbookAgendaNextMonth = new PlaybookAgenda(self.router, startDate);
                    return self.content.playbookAgendaNextMonth.load(response.meetings);
                });

                // get the worksheet, then start divvying it up
                deferred = deferred.then(function() {
                    $status.text("Fetching Worksheet...");

                    var startDate = moment(self.startDate).add(-1, 'month');

                    self.content.worksheet = new PlaybookWorksheet(self.router, startDate);
                    return self.content.worksheet.load();
                });

                // worksheet - revenue
                deferred = deferred.then(function() {
                    $status.text("Generating Revenue...");

                    // our worksheet table has been made, now grab the pertinent parts
                    var $el = self.content.worksheet.$el.clone();

                    // the tbody is a long collection of rows, which represent headers and data
                    // go through each one, and remove the unwanted
                    // Revenue, Cost of Goods Sold, Expenses, Staff Complement

                    var $trs = $el.find('.reportTable tbody tr');
                    var removing = false;
                    $trs.each(function(idx) {
                      var $tr = $(this);
                      if (removing) {
                        $tr.remove();
                      }
                      else if ($tr.hasClass('heading') && $tr.text().trim() == 'Revenue') {
                        $tr.remove();
                      }
                      else if ($tr.hasClass('heading') && $tr.text().trim() == 'Cost of Goods Sold') {
                        $tr.remove();
                        removing = true;
                      }

                    });
                    self.content.worksheetRevenue = $el.html();
                });

                // worksheet - cogs
                deferred = deferred.then(function() {
                    $status.text("Generating COGS...");

                    var $el = self.content.worksheet.$el.clone();

                    var $trs = $el.find('.reportTable tbody tr');
                    var removing = true;
                    $trs.each(function(idx) {
                      var $tr = $(this);
                      if ($tr.hasClass('heading') && $tr.text().trim() == 'Cost of Goods Sold') {
                        $tr.remove();
                        removing = false;
                      }
                      else if ($tr.hasClass('heading') && $tr.text().trim() == 'Expenses') {
                        $tr.remove();
                        removing = true;
                      }
                      else if (removing) {
                        $tr.remove();
                      }

                    });
                    self.content.worksheetCOGS = $el.html();
                });

                // worksheet - expenses
                deferred = deferred.then(function() {
                    $status.text("Generating Expenses...");

                    var $el = self.content.worksheet.$el.clone();

                    var $trs = $el.find('.reportTable tbody tr');
                    var removing = true;
                    $trs.each(function(idx) {
                      var $tr = $(this);
                      if ($tr.hasClass('heading') && $tr.text().trim() == 'Expenses') {
                        $tr.remove();
                        removing = false;
                      }
                      else if ($tr.hasClass('heading') && $tr.text().trim() == 'Staff Complement') {
                        $tr.remove();
                        removing = true;
                      }
                      else if (removing) {
                        $tr.remove();
                      }

                    });
                    self.content.worksheetExpenses = $el.html();
                });

                // cashflow - retrieve
                deferred = deferred.then(function() {
                    $status.text("Fetching Cash Flow Statement...");

                    var startDate = moment(self.startDate).add(-1, 'month');

                    self.content.cashflow = new PlaybookCashFlow(self.router, startDate);
                    return self.content.cashflow.load();
                });

                // incomeStatement - retrieve
                deferred = deferred.then(function() {
                    $status.text("Fetching Income Statement...");

                    var startDate = moment(self.startDate).add(-1, 'month');

                    self.content.income = new PlaybookIncome(self.router, startDate, self.content.cashflow);
                    return self.content.income.load();
                });                

                // worksheet - staff
                deferred = deferred.then(function() {
                    $status.text("Generating Staff Complement...");

                    var $el = self.content.worksheet.$el.clone();

                    var $trs = $el.find('.reportTable tbody tr');
                    var removing = true;
                    $trs.each(function(idx) {
                      var $tr = $(this);
                      if ($tr.hasClass('heading') && $tr.text().trim() == 'Staff Complement') {
                        $tr.remove();
                        removing = false;
                      }
                      else if (removing) {
                        $tr.remove();
                      }

                    });
                    self.content.worksheetStaffComplement = $el.html();
                });
                
                // use a hidden export dialog, it will grab our contentForPdf
                deferred = deferred.then(function() {
                    var exportDialog = new ExportDialog(self.router);
                    exportDialog.exportPdf(e);                    
                });

                // finish off
                deferred = deferred.then(function() {
                    $status.text("Business Playbook submitted. Please wait for your download.");
                    $status.parent().spin(false);
                    $('#pageContent section #downloadPlaybookPdf').removeAttr('disabled');

                    self.content = null;
                });

            },

            subcontext: function() {
                return "For " + this.startDate.format("MMM YYYY");
            },

            contentForPdf: function() {

                // grab the body for our content
                var compiledTemplate = Handlebars.templates['reports/PlaybookPdf'];
                var context = _.extend(this._localizable, this.content);
                var html = compiledTemplate(context);
                var $content = $(html);

                // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                // use the same subcontext over and over, in this case
                var $subcontext = $('<h6>')
                    .prop('id', 'subcontext1')
                    .addClass('subcontextEntry')
                    .text(this.subcontext());
                $content.prepend($subcontext);

                // .dynamicSubcontext is in the handlebars
                // with a dynamicSubcontext and a subcontext, you will get subcontext in the top right
                // not quite sure how dynamicSubcontext works, but it is a switch for this functionality

                return $content;
            }          

        });

        return view;
    });