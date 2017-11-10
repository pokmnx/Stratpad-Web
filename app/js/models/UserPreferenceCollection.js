define(['Config', 'UserPreference', 'backbone'],

	function(config, UserPreference) {
		var UserPreferenceCollection = Backbone.Collection.extend({

			model: UserPreference,

			urlRoot: config.serverBaseUrl + "/users/%s/preferences",

			initialize:function(models, options) {
	            if (!options || !options.userId) {
	                console.error("You must provide a userId!! Breaking.");
	                return;
	            };
				
				this.userId = options.userId;
				this.url = sprintf(this.urlRoot, this.userId);
			},

			parse: function(json) {
				if ("data" in json && "userPreferences" in json.data) {
					return json.data.userPreferences;
				} else {
					console.warn("Raw UserPreferences being parsed!!!");
					return json;
				}
			},

			// models come in order from the server

		}, {

			entityName: "UserPreferenceCollection"

		});

		return UserPreferenceCollection;

	});