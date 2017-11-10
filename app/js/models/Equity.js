define(['Config', 'backbone'], 

function(config) {
    var EquityModel = Backbone.Model.extend({

        // there is only ever one (and always one) financials object
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/-1/equities",
        defaults: {
            // equal(equity.date, 201205);
            // equal(equity.value, 10000);
            // equal(equity.name, 'Mary Blue');            
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
            console.debug('Initing equity with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "equity" in json.data) {
                this.url = sprintf(this.urlRoot, json.data.equity.stratFileId) + "/" + json.data.equity.id;
                return json.data.equity;
            } else {
                // when we get a collection of equities, then we don't need to do this parsing
                return json;
            }

        }
    }, {
        entityName: "Equity"
    });
    return EquityModel;
 });