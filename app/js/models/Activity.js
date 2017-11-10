define(['Config', 'backbone'],

    function(config) {
        var ActivityModel = Backbone.Model.extend({

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives/%s/activities",

            defaults: {},

            initialize: function(model, options) {
                // we can't send unknown keys to the server
                var isInOptions = (options && ("stratFileId" in options) && ("themeId" in options) && ("objectiveId" in options));
                var isInModel = ("stratFileId" in model) && ("themeId" in model) && ("objectiveId" in model);
                if (!isInModel && !isInOptions) {
                    console.error("You must provide a stratFileId a themeId, and an objectiveId!! Breaking.");
                    return;
                };
                var stratFileId = model.stratFileId || options.stratFileId;
                var themeId = model.themeId || options.themeId;
                var objectiveId = model.objectiveId || options.objectiveId;
                console.debug('Initing activity with name: ' + model.action);
                if ("id" in model) {
                    this.url = sprintf(this.urlRoot, stratFileId, themeId, objectiveId) + "/" + model.id;
                } else {
                    this.url = sprintf(this.urlRoot, stratFileId, themeId, objectiveId);
                }

            },

            // typically after we've saved an Activity to the server
            parse: function(json) {
                if ("data" in json && "activity" in json.data) {
                    this.url = sprintf(this.urlRoot, json.data.activity.stratFileId, json.data.activity.themeId, json.data.activity.objectiveId) + "/" + json.data.activity.id;
                    return json.data.activity;
                } else {
                    // when we get a collection of activities, then we don't need to do this parsing
                    return json;
                }
            }

        }, {
            entityName: "Activity"

        });
        return ActivityModel;
    });