define(['Config', 'ProjectNoteItem', 'backbone'],

	function(config, ProjectNoteItem) {
		var ProjectNoteItemCollection = Backbone.Collection.extend({

			model: ProjectNoteItem,

			urlRoot: config.serverBaseUrl + "/stratfiles/%s/themes/%s/projectNoteItems",

			initialize:function(models, options) {
				if (options) {
					this.stratFileId = options.stratFileId;
					this.themeId = options.themeId;
					this.url = sprintf(this.urlRoot, this.stratFileId, this.themeId);
				}
			},

			parse: function(json) {
				if ("data" in json && "projectNoteItems" in json.data) {
					return json.data.projectNoteItems;
				} else {
					console.warn("Raw ProjectNoteItems being parsed!!!");
					return json;
				}
			},

			comparator: function(projectNoteItem) {
				return projectNoteItem.get("creationDate");
			}

		}, {

			entityName: "ProjectNoteItemCollection"

		});

		return ProjectNoteItemCollection;

	});