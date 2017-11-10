define(['Config', 'Activity', 'backbone'], 

function(config, Activity) {
	var ActivityCollection = Backbone.Collection.extend({
		model: Activity,
 		urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/activities",
 		initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.themeId = options.themeId;
                this.objectiveId = options.objectiveId;
                this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId);
            };
 		},

        setIds:function(stratFileId, themeId, objectiveId) {
            this.stratFileId = stratFileId;
            this.themeId = themeId;
            this.objectiveId = objectiveId;
            this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId, this.objectiveId);
        },

        parse: function(json) {
            if ("data" in json && "activities" in json.data) {
                return json.data.activities;
            } else {
                console.warn("Raw Activities being parsed!!!");
                return json;
            }
        },

		comparator: function(activity) {
			return activity.get("order");
		}

	}, {
        entityName: "ActivityCollection"
    });
	return ActivityCollection;
});