define(['BaseReport', 'views/reports/R7.ProjectPlan', 'i18n!nls/R7.ProjectPlan.i18n', 'Config'],

    function(BaseReport, ProjectPlan, localizable, config) {

        var view = ProjectPlan.extend({

            initialize: function(router) {
                ProjectPlan.prototype.initialize.call(this, router, localizable);
            },            

            load: function() {
                BaseReport.prototype.load.call(this);

                var compiledTemplate = Handlebars.templates['reports/R7.ProjectPlan'];
                var projectPlanTemplate = compiledTemplate(this._localizable);
                this.$el = $(projectPlanTemplate).find('#projectPlanReport');
                
                var self = this;

                // fetch report for current stratFile
                return $.ajax({
                    url: config.serverBaseUrl + "/reports/projectplan",
                    type: "GET",
                    dataType: 'json',
                    data: {
                        'id': self.router.stratFileManager.stratFileId
                    },
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.renderTable(response);

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            }

        });

        return view;
    });