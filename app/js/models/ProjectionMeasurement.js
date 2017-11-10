define(['Config', 'backbone'], 

function(config) {
    var MeasurementModel = Backbone.Model.extend({

        entityName: "ProjectionMeasurement",
        
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/projections/%s/measurements",
        
        defaults: {
            // equal(measurement.comment, 'Made it!');
            // equal(measurement.date, 20130522);
            // equal(measurement.value, 24000);            
        },

        initialize:function(measurement, options) {
            this.url = sprintf(this.urlRoot, measurement.stratFileId, measurement.projectionId);
            if ("id" in measurement) {
                this.url += "/" + measurement.id;
            }
        },

        updateUrl: function() {
            this.url = sprintf(this.urlRoot, this.stratFileId, this.projectionId);
            if (this.has("id")) {
                this.url += "/" + this.id;
            }
        },        

        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "measurement" in json.data) {
				var measurement = json.data.measurement;
	        	this.url = sprintf(this.urlRoot, measurement.stratFileId, measurement.projectionId) + "/" + json.data.measurement.id;
                return json.data.measurement;
            } else {
                // when we get a collection of measurements, then we don't need to do this parsing
                return json;
            }
        }

    });
    return MeasurementModel;
 });