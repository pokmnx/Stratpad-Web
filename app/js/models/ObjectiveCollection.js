define(['Config', 'Objective', 'backbone'], 

function(config, Objective) {
	var ObjectiveCollection = Backbone.Collection.extend({
		model: Objective,
 		initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.themeId = ('themeId' in options) ? options.themeId : undefined;
                this._updateUrl();
            };
 		},

        _updateUrl: function() {
            // stratFileId is mandatory
            if (!this.stratFileId) {
                console.error("Must provide a stratFileId");
                this.url = undefined;
            }
            else if (this.stratFileId && this.themeId) {
                var url = config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives";
                this.url = sprintf(url, this.stratFileId, this.themeId);
            }
            else {
                var url = config.serverBaseUrl + "/stratfiles/%s/objectives";
                this.url = sprintf(url, this.stratFileId);
            }
        },

        setStratFileId:function(stratFileId) {
            this.stratFileId = stratFileId;
            this._updateUrl();
        },

        setThemeId:function(themeId) {
            this.themeId = themeId;
            this._updateUrl();
        },

        parse: function(json) {
            if ("data" in json && "objectives" in json.data) {
                return json.data.objectives;
            } else {
                console.warn("Raw Objectives being parsed!!!");
                return json;
            }
        },

		comparator: function(objective) {
            // sorted by type and then order
			return objective.get("type") + objective.get("order");
		}

	}, {
        entityName: "ObjectiveCollection"
    });
	return ObjectiveCollection;
});