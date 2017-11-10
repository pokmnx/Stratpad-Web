define(['Config', 'backbone'],

    function(config) {
        var ProjectionModel = Backbone.Model.extend({

            entityName: "Projection",

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/projections",

            defaults: {
                // String accountName; eg REVENUE
                // String source; // can be GAE or QBO
                // 1-many ProjectionChart
                // 1-many MetricMeasurement
            },

            initialize: function(projection, options) {
                this.url = sprintf(this.urlRoot, projection.stratFileId);
                if ("id" in projection) {
                    this.url += "/" + projection.id;
                }
            },

            updateUrl: function() {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
                if (this.has("id")) {
                    this.url += "/" + this.id;
                }

            },

            // typically after we've saved a model to the server
            parse: function(json) {
                if ("data" in json && "projection" in json.data) {
                    var projection = json.data.projection;
                    this.url = sprintf(this.urlRoot, projection.stratFileId) + "/" + json.data.projection.id;
                    return projection;
                } else {
                    // when we get a collection of projections, then we don't need to do this parsing
                    return json;
                }
            }


        });
        return ProjectionModel;
    });