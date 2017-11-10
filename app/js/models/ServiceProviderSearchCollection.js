define(['Config', 'ServiceProvider', 'backbone'],

	function(config, ServiceProvider) {
		var ServiceProviderSearchCollection = Backbone.Collection.extend({

			model: ServiceProvider,

			// differs from a "ServiceProviderCollection" which would be all of them, and at /serviceProviders
			// plus the results don't contain all the fields
			urlRoot: config.serverBaseUrl + "/stratfiles/%s/serviceProviders?category=%s",

			initialize:function(models, options) {
	            if (!options || !options.stratFileId) {
	                console.error("You must provide a stratFileId!! Breaking.");
	                return;
	            };
				
				this.stratFileId = options.stratFileId;
				this.category = options.category ? options.category : 'Bank';
				this.url = sprintf(this.urlRoot, this.stratFileId, this.category);
			},

			parse: function(json) {
				if ("data" in json && "serviceProviders" in json.data) {
					return json.data.serviceProviders;
				} else {
					console.warn("Raw ServiceProviders being parsed!!!");
					return json;
				}
			},

			// models come in order from the server

		}, {

			entityName: "ServiceProviderSearchCollection"

		});

		return ServiceProviderSearchCollection;

	});