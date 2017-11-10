define(['Config', 'AccessControlEntry', 'backbone'],

	function(config, AccessControlEntry) {
		var AccessControlEntryCollection = Backbone.Collection.extend({
			model: AccessControlEntry,
			// there is only ever one (and always one) financials object
			urlRoot: config.serverBaseUrl + "/stratfiles/%s/aces",
			initialize:function(models, options) {
				if (options) {
					this.stratFileId = options.stratFileId;
					this.url = sprintf(this.urlRoot, this.stratFileId);
				}
			},

			parse: function(json) {
				if ("data" in json && "accessControlEntries" in json.data) {
					return json.data.accessControlEntries;
				} else {
					console.warn("Raw AccessControlEntries being parsed!!!");
					return json;
				}
			},

			comparator: function(accessControlEntry) {
				return accessControlEntry.get("creationDate");
			}

		}, {
			entityName: "AccessControlEntryCollection"
		});
		return AccessControlEntryCollection;
	});