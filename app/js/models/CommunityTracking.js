define(['Config', 'backbone'], 

function(config) {
    var CommunityTrackingModel = Backbone.Model.extend({
        
        urlRoot: config.serverBaseUrl + '/serviceProviders/%s/stratfiles/%s/communityTrackings',
        defaults: {
            // datetime -> creationDate
            // prospect (user) -> the currentUser 
            // serviceProvider -> part of the url
            // serviceProviderName
            // action (impression, click, invitation)
            // cost
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("serviceProviderId" in options));
            var isInModel = ("serviceProviderId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a serviceProviderId!! Breaking.");
                return;
            };
            var isInOptions = (options && ("stratFileId" in options));
            var isInModel = ("stratFileId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a stratFileId!! Breaking.");
                return;
            };

            this.set('serviceProviderId', model.serviceProviderId || options.serviceProviderId);
            this.set('stratFileId', model.stratFileId || options.stratFileId);
            console.debug('Initing communityTracking for serviceProvider: ' + model.serviceProviderId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId'), this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId'), this.get('stratFileId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "communityTracking" in json.data) {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId'), this.get('stratFileId')) + "/" + json.data.communityTracking.id;
                return json.data.communityTracking;
            } else {
                // when we get a collection of communityTracking, then we don't need to do this parsing
                return json;
            }
        }


    }, {
        entityName: "CommunityTracking"
    });
    return CommunityTrackingModel;
 });