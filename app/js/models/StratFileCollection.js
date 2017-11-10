define(['Config', 'StratFile', 'backbone'], 

function(config, StratFile) {
	var StratFileCollection = Backbone.Collection.extend({
		model: StratFile,
 		url: config.serverBaseUrl + "/stratfiles",
        parse: function(json) {
            if ("data" in json && "stratFiles" in json.data) {
                return json.data.stratFiles;
            } else {
                console.warn("Raw StratFiles being parsed!!!");
                return json;
            }
        },
        comparator: function(stratFile) {
            return stratFile.get("lastAccessDate") *-1;
        }

	}, {
        entityName: "StratFileCollection"
    });
	return StratFileCollection;
});