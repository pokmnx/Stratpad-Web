define(['Config', 'Asset', 'backbone'], 

function(config, Asset) {
	var AssetCollection = Backbone.Collection.extend({
		model: Asset,
        // there is only ever one (and always one) financials object
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/-1/assets",
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
            if ("data" in json && "assets" in json.data) {
                return json.data.assets;
            } else {
                console.warn("Raw Assets being parsed!!!");
                return json;
            }
        },

		comparator: function(asset) {
			return asset.get("date");
		}

	}, {
        entityName: "AssetCollection"
    });
	return AssetCollection;
});