define(['Config', 'backbone'], 

function(config) {
    var OpeningBalancesModel = Backbone.Model.extend({

        // NB our model is OpeningBalances, but the json uses the singular openingBalance        
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/%s/openingBalances",
        defaults: {
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("stratFileId" in options));
            var isInModel = ("stratFileId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a stratFileId!! Breaking.");
                return;
            };
            this.set('stratFileId', model.stratFileId || options.stratFileId);
            this.set('financialId', model.financialId || options.financialId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, json.data.openingBalance.stratFileId, json.data.openingBalance.financialId) + "/" + json.data.openingBalance.id;
            return json.data.openingBalance;
        },
        // override - queues AJAX saves, so that any new state isn't overwritten when response is parsed
        save: function(attrs,options) {
            router.dispatchManager.save(this, attrs, options)
        }

    }, {
        entityName: "OpeningBalances"
    });
    return OpeningBalancesModel;
 });