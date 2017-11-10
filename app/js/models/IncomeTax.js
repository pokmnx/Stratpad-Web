define(['Config', 'backbone'], 

function(config) {
    var IncomeTaxModel = Backbone.Model.extend({

        // NB our model is IncomeTax, but the json uses the singular incomeTax        
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/%s/incomeTaxes",
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
            console.debug('Initing IncomeTax with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, json.data.incomeTax.stratFileId, json.data.incomeTax.financialId) + "/" + json.data.incomeTax.id;
            return json.data.incomeTax;
        }
    }, {
        entityName: "IncomeTax"
    });
    return IncomeTaxModel;
 });