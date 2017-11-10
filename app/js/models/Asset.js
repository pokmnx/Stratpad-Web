define(['Config', 'backbone'], 

function(config) {
    var AssetModel = Backbone.Model.extend({

        // there is only ever one (and always one) financials object - shortcut
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/%s/assets",
        defaults: {
            // equal(asset.name, 'Subaru WRX');
            // equal(asset.date, 201305);
            // equal(asset.type, 'MACHINERY');
            // equal(asset.value, 24000);
            // equal(asset.salvageValue, 21000);
            // equal(asset.depreciationTerm, 5);
            // equal(asset.depreciationType, 'STRAIGHT_LINE');
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

            // we actually don't need the financial id anymore, as all methods will now use the default financials, but it doesn't hurt
            isInOptions = (options && ("financialId" in options));
            isInModel = ("financialId" in model);
            if (!isInModel && !isInOptions) {                
                this.set('financialId', -1);
            } else {
                this.set('financialId', model.financialId || options.financialId);
            }

            console.debug('Initing asset with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "asset" in json.data) {
                this.url = sprintf(this.urlRoot, json.data.asset.stratFileId, json.data.asset.financialId) + "/" + json.data.asset.id;
                return json.data.asset;
            } else {
                // when we get a collection of assets, then we don't need to do this parsing
                return json;
            }

        }
    }, {
        entityName: "Asset"
    });
    return AssetModel;
 });