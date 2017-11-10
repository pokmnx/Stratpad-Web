define(['Config', 'Chart', 'backbone'],

    function(config, Chart) {

        // we need to be able to handle both metric-based charts and projection-based charts in the ChartCollection
        var MetricChartModel = Chart.extend({

            entityName: "MetricChart",

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/metrics/%s/charts",

            overlayUrl: config.serverBaseUrl + '/charts/uuid/%s',

            initialize: function(chart, options) {
                if (options && options.isOverlay) {
                    this.url = sprintf(this.overlayUrl, chart.uuid);
                } else {
                    this.url = sprintf(this.urlRoot, chart.stratFileId, chart.themeId, chart.objectiveId, chart.metricId);
                    if ("id" in chart) {
                        this.url += "/" + chart.id;
                    }
                }
            },

            updateUrl: function() {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('themeId'), this.get('objectiveId'), this.get('metricId'));
                if (this.has("id")) {
                    this.url += "/" + this.id;
                }

            },

            // typically after we've saved a model to the server
            parse: function(json) {
                if ("data" in json && "chart" in json.data) {
                    var chart = json.data.chart;
                    this.url = sprintf(this.urlRoot, chart.stratFileId, chart.themeId, chart.objectiveId, chart.metricId) + "/" + json.data.chart.id;
                    return chart;
                } else {
                    // when we get a collection of charts, then we don't need to do this parsing
                    return json;
                }
            }

        });
        return MetricChartModel;
    });