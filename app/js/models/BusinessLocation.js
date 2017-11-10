define(['Config', 'backbone'], 

function(config) {
    var BusinessLocationModel = Backbone.Model.extend({
        
        urlRoot: config.serverBaseUrl + "/serviceProviders/%s/businessLocations",
        defaults: {
            // Ref<ServiceProvider> serviceProvider;            
            // String city;
            // String country;
            // String provinceState;
            // String zipPostal;
            // List<ServiceProviderCategory> categories;
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("serviceProviderId" in options));
            var isInModel = ("serviceProviderId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a serviceProviderId!! Breaking.");
                return;
            };
            this.set('serviceProviderId', model.serviceProviderId || options.serviceProviderId);
            console.debug('Initing BusinessLocation for serviceProvider: ' + model.serviceProviderId);

            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId'));
            }

        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "businessLocation" in json.data) {
                this.url = sprintf(this.urlRoot, this.get('serviceProviderId')) + "/" + json.data.businessLocation.id;
                return json.data.businessLocation;
            } else {
                // when we get a collection of businessLocation, then we don't need to do this parsing
                return json;
            }
        }

    }, {
        entityName: "BusinessLocation"
    });
    return BusinessLocationModel;
 });