// thought about a single entity with an infinite number of properties, but it doesn't map well with REST
// so we have a UserPreferenceCollection; each UserPreference entity maps with a single key and value
// we use backbone-cache for syncing the collection
define(['Config', 'backbone'], 

function(config) {
    var UserPreferenceModel = Backbone.Model.extend({
        
        urlRoot: config.serverBaseUrl + "/users/%s/preferences",
        defaults: {
            // Long userId
            // String key 
            // String value
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("userId" in options));
            var isInModel = ("userId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a userId!! Breaking.");
                return;
            };
            this.set('userId', model.userId || options.userId);
            console.debug('Initing UserPreference for user: ' + model.userId);

            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('userId'));
            }

        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "userPreference" in json.data) {
                this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + json.data.userPreference.id;
                return json.data.userPreference;
            } else {
                // when we get a collection of userPreference, then we don't need to do this parsing
                return json;
            }
        }

    }, {
        entityName: "UserPreference"
    });
    return UserPreferenceModel;
 });