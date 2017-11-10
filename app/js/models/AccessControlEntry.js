define(['Config', 'backbone'],

	/*
		{
			"owner": {
				"email": "drone@faction23.com",
				"fullName": "samuel estok",
				"id": 5863987568705536
			},
			"permissions": [{
				"domain": "STRATBOARD",
				"id": 5097662860754944,
				"permission": "WRITE"
			}, {
				"domain": "PLAN",
				"id": 5660612814176256,
				"permission": "READ"
			}],
			"principal": {
				"email": "julian@mobilesce.com",
				"fullName": "Julian Wood",
				"id": 5678444981518336
			},
			"stratFileName": "Awesome",
			"stratFileId": 5634918507872256,
			"accepted": false,
			"acceptToken": "e2c3d1bab453f3f9e4f35fd2bed0a5af88c39660",
			"id": 5097662860754944
		}

		// domain can be ALL, PLAN, STRATBOARD
        // permission can be READ, WRITE

	*/

	function(config) {
		var AccessControlEntryModel = Backbone.Model.extend({

				urlRoot: config.serverBaseUrl + "/stratfiles/%s/aces",

				initialize:function(accesscontrolentry, options) {
					this.url = sprintf(this.urlRoot, accesscontrolentry.stratFileId );
					if ("id" in accesscontrolentry) {
						this.url += "/" + accesscontrolentry.id;
					}
				},

				// typically after we've saved a model to the server
				parse: function(json) {
					if ("data" in json && "accessControlEntry" in json.data) {
						var accesscontrolentry = json.data.accessControlEntry;
						this.url = sprintf(this.urlRoot, accesscontrolentry.stratFileId ) + "/" + accesscontrolentry.id;
						return accesscontrolentry;
					} else {
						// when we get a collection of accesscontrolentrys, then we don't need to do this parsing
						return json;
					}
				},

				hasWriteAccess: function(domain) {
					var perm = _.findWhere(this.get('permissions'), {domain: domain});
					if (perm) {
						return perm.permission === 'WRITE' && this.isAccepted();
					} else {
						return false;
					}
				},

				hasReadAccess: function(domain) {
					var perm = _.findWhere(this.get('permissions'), {domain: domain});
					if (perm) {
						return (perm.permission === 'WRITE' || perm.permission === 'READ') && this.isAccepted();
					} else {
						return false;
					}
				},

				isAccepted: function() {
					return this.has("accepted") && this.get("accepted") === true;
				}



			}, {

				entityName: "AccessControlEntry"

			}
		);
		return AccessControlEntryModel;
	}
);