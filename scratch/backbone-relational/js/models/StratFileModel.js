define([
	'Backbone',
	'ThemeCollection',
	'models/ThemeModel'
	], 
	
	function( Backbone, ThemeCollection, ThemeModel ) {
		var stratFileModel = Backbone.RelationalModel.extend({
			relations : [
		        {
		          type : Backbone.HasMany,
		          key : 'theme',
		          relatedModel : ThemeModel,
		          includeInJSON : Backbone.Model.prototype.idAttribute,
		          collectionType : ThemeCollection,
                  
		          reverseRelation : {
		            type : Backbone.HasOne,
		            key : 'stratFile'
		          }
		        }
		      ],

			validate : function( attrs ) {
			if ( !attrs.title ) {
			       throw new Error( "The StratFile object does not validate." ); 
				}
			}
		});
		return stratFileModel;
	}
);