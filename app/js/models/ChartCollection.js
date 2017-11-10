define(['Config', 'Chart', 'MetricChart', 'ProjectionChart', 'backbone'], 

function(config, Chart, MetricChart, ProjectionChart) {
	var ChartCollection = Backbone.Collection.extend({
		model: Chart,

        // this will be a collection of Chart base classes, which could be ProjectionChart or MetricChart (latter is the old Chart)
 		urlRoot: config.serverBaseUrl + "/stratfiles/%s/charts",

 		initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.url = sprintf(this.urlRoot, this.stratFileId);                
            };
 		},

        setStratFileId:function(stratFileId) {
            this.stratFileId = stratFileId;
            this.url = sprintf(this.urlRoot, this.stratFileId);            
        },

        parse: function(json) {
            if ("data" in json && "charts" in json.data) {
                return json.data.charts;
            } else {
                console.warn("Raw Charts being parsed!!!");
                return json;
            }
        },

		comparator: function(chart) {
			return chart.get("creationDate");
		},

        model: function(attrs, options) {
            if (attrs.projectionId && attrs.projectionId > 0) {
                return new ProjectionChart(attrs, options);
            } else {
                return new MetricChart(attrs, options);
            }
        }

	}, {
        entityName: "ChartCollection"
    });
	return ChartCollection;
});