define(['Config', 'MetricMeasurement', 'backbone'], 

function(config, MetricMeasurement) {
    var MetricMeasurementCollection = Backbone.Collection.extend({
        model: MetricMeasurement,
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/metrics/%s/measurements",
        initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.themeId = options.themeId;
                this.objectiveId = options.objectiveId;
                this.metricId = options.metricId;
                this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId, this.metricId);
            };
        },

        setIds:function(stratFileId, themeId, objectiveId, metricId) {
            this.stratFileId = stratFileId;
            this.themeId = themeId;
            this.objectiveId = objectiveId;
            this.metricId = metricId;
            this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId, this.metricId);
        },

        parse: function(json) {
            if ("data" in json && "measurements" in json.data) {
                return json.data.measurements;
            } else {
                console.warn("Raw Measurements being parsed!!!");
                return json;
            }
        },
        comparator: function(measurement) {
            return measurement.get("date");
        },

        fetch: function(options) {
            // since we don't include parent ids in measurement from server, add them now

            var success = options.success;
            var error = options.error;

            var self = this;
            var opts = {
                success: function(collection, response) {
                    collection.each(function(measurement) {
                        measurement.stratFileId = self.stratFileId;
                        measurement.themeId = self.themeId;
                        measurement.objectiveId = self.objectiveId;
                        measurement.metricId = self.metricId;
                        measurement.updateUrl();
                    });

                    success(collection, response);
                },
                error: function(model, xhr, options) {
                    error(model, xhr, options);
                }
            };

            // overwrite old success and error, but maintain any other options
            _.extend(options, opts);

            return Backbone.Collection.prototype.fetch.call(this, options);
        }

    }, {
        entityName: "MetricMeasurementCollection"
    });
    return MetricMeasurementCollection;
});