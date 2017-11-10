define(['Config', 'backbone'],

    function(config) {
        var MetricModel = Backbone.Model.extend({

            entityName: "Metric",

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/metrics",

            defaults: {
                // String summary;
                // Long targetDate;
                // String targetValue;                
                // SuccessIndicator successIndicator
                // Objective objective
                // 1-many MetricChart
                // 1-many MetricMeasurement
            },

            initialize: function(model, options) {
                // we can't send unknown keys to the server
                var isInOptions = (options && ("stratFileId" in options) && ("themeId" in options) && ("objectiveId" in options));
                var isInModel = model && ("stratFileId" in model) && ("themeId" in model) && ("objectiveId" in model);
                if (!isInModel && !isInOptions) {
                    console.error("You must provide a stratFileId a themeId, and an objectiveId!! Breaking.");
                    return;
                };
                this.set('stratFileId', model.stratFileId || options.stratFileId);
                this.set('themeId', model.themeId || options.themeId);
                this.set('objectiveId', model.objectiveId || options.objectiveId);
                console.debug('Initing metric with name: ' + model.summary);
                this.updateUrl();
            },

            updateUrl: function() {
                var stratFileId = this.get('stratFileId');
                var themeId = this.get('themeId');
                var objectiveId = this.get('objectiveId');

                if (this.has('id')) {
                    this.url = sprintf(this.urlRoot, stratFileId, themeId, objectiveId) + "/" + this.get('id');
                } else {
                    this.url = sprintf(this.urlRoot, stratFileId, themeId, objectiveId);
                }
            },

            // typically after we've saved an Metric to the server
            parse: function(json) {
                if ("data" in json && "metric" in json.data) {
                    this.url = sprintf(this.urlRoot, json.data.metric.stratFileId, json.data.metric.themeId, json.data.metric.objectiveId) + "/" + json.data.metric.id;
                    return json.data.metric;
                } else {
                    // when we get a collection of metrics, then we don't need to do this parsing
                    return json;
                }
            }

        }, {
            entityName: "Metric" // akin to giving us a static eg Chart.entityName, whereas above it is chart.entityName - used in tests
        });
        return MetricModel;
    });