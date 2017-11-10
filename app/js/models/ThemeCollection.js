define(['Config', 'Theme', 'backbone'], 

function(config, Theme) {
	var ThemeCollection = Backbone.Collection.extend({
		model: Theme,
 		urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes",
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
            if ("data" in json && "themes" in json.data) {
                return json.data.themes;
            } else {
                console.warn("Raw Themes being parsed!!!");
                return json;
            }
        },

		comparator: function(theme) {
			return theme.get("order");
		}

	}, {
        entityName: "ThemeCollection"
    });
	return ThemeCollection;
});