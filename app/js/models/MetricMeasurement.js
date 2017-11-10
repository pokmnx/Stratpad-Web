define(['Config', 'backbone'], 

function(config) {
    var MeasurementModel = Backbone.Model.extend({

        entityName: "MetricMeasurement",
        
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/metrics/%s/measurements",
        
        defaults: {
            // equal(measurement.comment, 'Made it!');
            // equal(measurement.date, 20130522);
            // equal(measurement.value, 24000);            
        },

        initialize:function(measurement, options) {
            this.url = sprintf(this.urlRoot, measurement.stratFileId, measurement.themeId, measurement.objectiveId, measurement.metricId );
            if ("id" in measurement) {
                this.url += "/" + measurement.id;
            }
        },

        updateUrl: function() {
            this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId, this.metricId);
            if (this.has("id")) {
                this.url += "/" + this.id;
            }
        },        

        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "measurement" in json.data) {
				var measurement = json.data.measurement;
	        	this.url = sprintf(this.urlRoot, measurement.stratFileId, measurement.themeId, measurement.objectiveId, measurement.metricId ) + "/" + json.data.measurement.id;
                return json.data.measurement;
            } else {
                // when we get a collection of measurements, then we don't need to do this parsing
                return json;
            }
        }

    });
    return MeasurementModel;
 });