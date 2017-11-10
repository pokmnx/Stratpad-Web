define(['Config', 'backbone'], 

function(config) {
 	var ThemeModel = Backbone.Model.extend({
        
 		urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes",
        defaults: {
        	// we don't really have a need for defaults at this point, but it is nice to know the model
        	// these must match what we have on the App Engine side of things
        	
            // name 
            // startDate
            // endDate
            // mandatory
            // enhanceUniqueness
            // enhanceCustomerValue
            // responsible
            // order

            // creationDate
            // modificationDate
            // ...

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
            console.debug('Initing theme with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
            }

            var isClone = (options && ("sourceId" in options));
            if (isClone) {
                // ur is reset on parse (return)
                var includeObjectives = (options && ("includeObjectives" in options) && options.includeObjectives);
                this.url += sprintf("?sourceId=%s&includeObjectives=%s", options.sourceId, includeObjectives);
            }
            
        },
        // typically after we've saved a Theme to the server
        parse: function(json) {
            if ("data" in json && "theme" in json.data) {
                this.url = sprintf(this.urlRoot, json.data.theme.stratFileId) + "/" + json.data.theme.id;
                return json.data.theme;
            } else {
                // when we get a collection of themes, then we don't need to do this parsing
                return json;
            }
        }
 	}, {
        entityName: "Theme"
    });
 	return ThemeModel;
 });