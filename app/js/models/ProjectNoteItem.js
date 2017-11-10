define(['Config', 'backbone'],

    function(config) {

        var ProjectNoteItemModel = Backbone.Model.extend({

            entityName: "ProjectNoteItem",

	        urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/projectNoteItems",

	        defaults: {
		        "category":"Miscellaneous"
	        },

	        initialize:function(projectNoteItem, options) {

		        // we can't send unknown keys to the server
		        var isInOptions = (options && ("stratFileId" in options) && ("themeId" in options)),
			        isInModel = ("stratFileId" in projectNoteItem) && ("themeId" in projectNoteItem);

		        if (!isInModel && !isInOptions) {
			        console.error("You must provide a stratFileId and a themeId!! Breaking.");
			        return;
		        }

		        this.stratFileId = projectNoteItem.stratFileId || options.stratFileId;
			    this.themeId = projectNoteItem.themeId || options.themeId;

		        console.debug('Initing note with category: ' + projectNoteItem.category);

		        if ("id" in projectNoteItem) {
			        this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId) + "/" + projectNoteItem.id;
		        } else {
			        this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId);
		        }

	        },

	        // typically after we've saved a model to the server
	        parse: function(json) {

		        if ("data" in json && "projectNoteItem" in json.data) {
			        this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId) + "/" + json.data.projectNoteItem.id;
			        return json.data.projectNoteItem;
		        } else {
			        // when we get a collection of projectNoteItems, then we don't need to do this parsing
			        return json;
		        }
	        },

            updateUrl: function() {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
                if (this.has("id")) {
                    this.url += "/" + this.id;
                }

            },

            total: function() {
            	// fyi: staff is not a multiplier
            	// only deal with lines that have an amount
		        // if no quantity, use 1
		        // important to return null (not 0) if we don't have enough info
				var multiplier = $.stratweb.isNumber(this.get('quantity')) ? this.get('quantity') : 1;
		        var price = this.get('price');
		        return (price == undefined || price == '') ? undefined : price * multiplier;
			}

        });

        return ProjectNoteItemModel;

    });