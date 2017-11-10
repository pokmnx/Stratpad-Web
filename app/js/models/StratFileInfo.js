define(['Config', 'backbone'], 

function(config) {
 	var StratFileInfoModel = Backbone.Model.extend({
 		urlRoot: config.serverBaseUrl + "/stratfileInfos",
        defaults: {
        	// this is actually an alias to /stratfiles - we're only interested in GET and PUT, but all methods are there 
            // NB the ids are actually stratfile ids    	
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
            console.debug('Initing stratfileinfo for stratfile: ' + model.stratFileId);
            this.url = this.urlRoot + '/' + this.get('stratFileId');            
        },        
        parse: function(json) {
            if ("data" in json && "stratFile" in json.data) {
                this.url = this.urlRoot + "/" + json.data.stratFile.id;
                return json.data.stratFile;
            } 
            else {
                // when we get a collection of stratfiles, then we don't need to do this parsing
                return json;
            }
        }

 	}, {
        entityName: "StratFileInfo"
    });
 	return StratFileInfoModel;
 });