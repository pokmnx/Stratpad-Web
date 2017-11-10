define(['Config', 'Chart', 'backbone'],

    function(config, Chart) {
        var ProjectionChartModel = Chart.extend({

            entityName: "ProjectionChart",

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/projections/%s/charts",

            defaults: {
                // String chartType;
                // String colorScheme;
                // Integer order;
                // String overlay;
                // Boolean showTarget;
                // Boolean showTrend;
                // String title;
                // String uuid;
                // Integer yAxisMax;
                // Integer zLayer;
            },

            initialize: function(chart, options) {
                this.url = sprintf(this.urlRoot, chart.stratFileId, chart.projectionId);
                if ("id" in chart) {
                    this.url += "/" + chart.id;
                }
            },

            updateUrl: function() {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('projectionId'));
                if (this.has('id')) {
                    this.url += "/" + this.id;
                }
            },

            // typically after we've saved a model to the server
            parse: function(json) {
                if ("data" in json && "chart" in json.data) {
                    var chart = json.data.chart;
                    this.url = sprintf(this.urlRoot, chart.stratFileId, chart.projectionId) + "/" + chart.id;
                    return chart;
                } else {
                    // when we get a collection of charts, then we don't need to do this parsing
                    return json;
                }
            }

        });
        return ProjectionChartModel;
    });