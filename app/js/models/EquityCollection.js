define(['Config', 'Equity', 'backbone'], 

function(config, Equity) {
	var EquityCollection = Backbone.Collection.extend({
		model: Equity,
        // there is only ever one (and always one) financials object
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/-1/equities",
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
            if ("data" in json && "equities" in json.data) {
                return json.data.equities;
            } else {
                console.warn("Raw Equities being parsed!!!");
                return json;
            }
        },

		comparator: function(equity) {
			return equity.get("date");
		}

	}, {
        entityName: "EquityCollection"
    });
	return EquityCollection;
});