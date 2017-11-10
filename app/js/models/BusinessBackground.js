define(['Config', 'backbone'], 

function(config) {
    var BusinessBackgroundModel = Backbone.Model.extend({
        
        // note that a GET on this URL will give us a single BB, rather than an array that we normally expect
        // ie 1:1 with StratFile
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/businessBackgrounds",
        defaults: {
            // String businessStructure;
            // Integer industryCodeNaics;
            // String industry;
            // String duns;
            // String financingTypeRequested;
            // Long moneyRequiredMax;
            // Long moneyRequiredMin;
            // String preferredLanguage;
            // ArrayList<String> requestedAssetTypes; - todo: was primaryAssetType
            // Boolean profitable;
            // Long revenueMax;
            // Long revenueMin;
            // Integer yearsInBusiness;
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
            console.debug('Initing businessBackground for stratfile: ' + model.stratFileId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + json.data.businessBackground.id;
            return json.data.businessBackground;
        }
    }, {
        entityName: "BusinessBackground"
    });
    return BusinessBackgroundModel;
 });