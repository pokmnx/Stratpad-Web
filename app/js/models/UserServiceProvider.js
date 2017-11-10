// just like a ServiceProvider, except it is owned by a user, and we only allow 1 per user
define(['Config', 'ServiceProvider', 'backbone'], 

function(config, ServiceProvider) {
    var UserServiceProviderModel = ServiceProvider.extend({
        
        // note that a GET on this URL will give us a single SP, rather than an array that we normally expect
        // ie 1:1 with User
        urlRoot: config.serverBaseUrl + "/users/%s/serviceProviders",

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("userId" in options));
            var isInModel = ("userId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a userId!! Breaking.");
                return;
            };
            this.set('userId', model.userId || options.userId);
            console.debug('Initing UserServiceProvider for user: ' + model.userId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('userId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + json.data.serviceProvider.id;
            return json.data.serviceProvider;
        }
    }, {
        entityName: "UserServiceProvider"
    });
    return UserServiceProviderModel;
 });