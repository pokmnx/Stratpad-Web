define(['Config', 'CommunityTracking', 'backbone'],

	function(config, CommunityTracking) {
		var CommunityTrackingCollection = Backbone.Collection.extend({

			model: CommunityTracking,

			urlRoot: config.serverBaseUrl + "/serviceProviders/%s/communityTrackings?startDate=%s&endDate=%s",

			initialize:function(models, options) {
	            if (!options || !options.serviceProviderId) {
	                console.error("You must provide a serviceProviderId!! Breaking.");
	                return;
	            };
				
				this.serviceProviderId = options.serviceProviderId;
				this.startDate = options.startDate ? options.startDate : '';
				this.endDate = options.endDate ? options.endDate : '';
				this.url = sprintf(this.urlRoot, this.serviceProviderId, this.startDate, this.endDate);
			},

			parse: function(json) {
				if ("data" in json && "communityTrackings" in json.data) {
					return json.data.communityTrackings;
				} else {
					console.warn("Raw communityTrackings being parsed!!!");
					return json;
				}
			},

		}, {

			entityName: "CommunityTrackingCollection"

		});

		return CommunityTrackingCollection;

	});