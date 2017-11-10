define(['Config', 'BusinessLocation', 'backbone'],

	function(config, BusinessLocation) {
		var BusinessLocationCollection = Backbone.Collection.extend({

			model: BusinessLocation,

			urlRoot: config.serverBaseUrl + "/serviceProviders/%s/businessLocations",

			initialize:function(models, options) {
	            if (!options || !options.serviceProviderId) {
	                console.error("You must provide a serviceProviderId!! Breaking.");
	                return;
	            };
				
				this.serviceProviderId = options.serviceProviderId;
				this.url = sprintf(this.urlRoot, this.serviceProviderId);
			},

			parse: function(json) {
				if ("data" in json && "businessLocations" in json.data) {
					return json.data.businessLocations;
				} else {
					console.warn("Raw BusinessLocations being parsed!!!");
					return json;
				}
			},

			// models come in order from the server

		}, {

			entityName: "BusinessLocationCollection"

		});

		return BusinessLocationCollection;

	});