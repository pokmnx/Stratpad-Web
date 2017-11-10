define(['Config', 'Metric', 'backbone'], 

function(config, Metric) {
	var MetricCollection = Backbone.Collection.extend({
		model: Metric,
 		urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/metrics",
 		initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.themeId = options.themeId;
                this.objectiveId = options.objectiveId;
                this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId);
            };
 		},

        setIds:function(stratFileId, themeId, objectiveId) {
            this.stratFileId = stratFileId;
            this.themeId = themeId;
            this.objectiveId = objectiveId;
            this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId);
        },

        parse: function(json) {
            if ("data" in json && "metrics" in json.data) {
                return json.data.metrics;
            } else {
                console.warn("Raw Activities being parsed!!!");
                return json;
            }
        },

        syncCollection: function(options) {
            var collection = this;
            options = _.extend(options || {});
            var success = options.hasOwnProperty('success') ? options.success : null;
            options = _.extend(options, {
              success: function(model, resp, xhr) {
                collection.reset(collection.parse(model));
                success.call(this, collection, resp, xhr);
              }
            });
            Backbone.sync('update', this, options);
        },
        
        comparator: function(metric) {
            return metric.get("creationDate");
        }             

	}, {
        entityName: "MetricCollection"
    });
	return MetricCollection;
});