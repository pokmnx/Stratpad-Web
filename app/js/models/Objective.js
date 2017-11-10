define(['Config', 'MetricCollection', 'backbone'],

    function(config, MetricCollection) {
        var ObjectiveModel = Backbone.Model.extend({

            urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/objectives",

            defaults: {},

            initialize: function(model, options) {
                // we can't send unknown keys to the server
                var isInOptions = (options && ("stratFileId" in options) && ("themeId" in options));
                var isInModel = ("stratFileId" in model) && ("themeId" in model);
                if (!isInModel && !isInOptions) {
                    console.error("You must provide a stratFileId and a themeId!! Breaking.");
                    return;
                };
                this.set('stratFileId', model.stratFileId || options.stratFileId);
                this.set('themeId', model.themeId || options.themeId);
                console.debug('Initing objective with name: ' + model.summary);
                if ("id" in model) {
                    this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('themeId')) + "/" + model.id;
                } else {
                    this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('themeId'));
                }

            },

            // typically after we've saved an Objective to the server
            parse: function(json) {
                if ("data" in json && "objective" in json.data) {
                    this.url = sprintf(this.urlRoot, json.data.objective.stratFileId, json.data.objective.themeId) + "/" + json.data.objective.id;
                    if ('metrics' in json.data.objective) {
                        var metricCollection = new MetricCollection(json.data.objective.metrics, {
                            stratFileId: json.data.objective.stratFileId,
                            themeId: json.data.objective.themeId,
                            objectiveId: json.data.objective.id
                        });
                        json.data.objective.metricCollection = metricCollection;
                        console.debug('**** found metrics on objective');
                    };

                    return json.data.objective;
                } else {
                    // when we get a collection of metrics, we end up here
                    if ('metrics' in json) {
                        var metricCollection = new MetricCollection(json.metrics, {
                            stratFileId: json.stratFileId,
                            themeId: json.themeId,
                            objectiveId: json.id
                        });
                        json.metricCollection = metricCollection;
                        console.debug('**** found metrics on objective (from collection)');
                    };
                    return json;
                }
            }

        }, {
            entityName: "Objective"

        });
        return ObjectiveModel;
    });