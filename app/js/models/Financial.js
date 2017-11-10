define(['Config', 'backbone'], 

function(config) {
    var FinancialModel = Backbone.Model.extend({
        
        // note that a GET on this URL will give us a single financial, rather than an array that we normally expect
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials",
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
            console.debug('Initing financial for stratfile: ' + model.stratFileId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, json.data.financial.stratFileId) + "/" + json.data.financial.id;
            return json.data.financial;
        }
    }, {
        entityName: "Financial"
    });
    return FinancialModel;
 });