define(['BaseReport', 'views/reports/R9.BizPlanSummary', 'i18n!nls/R9.BizPlanSummary.i18n', 'Config'],

    function(BaseReport, BizPlanSummary, R9_localizable, config) {

        var view = BizPlanSummary.extend({

            reportName: 'Playbook.BizPlanSummary',

            // @override
            initialize: function(router, startDate) {
                _.bindAll(this, "load");

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                BizPlanSummary.prototype.initialize.call(this, router, R9_localizable);
            }

        });

        return view;
    });