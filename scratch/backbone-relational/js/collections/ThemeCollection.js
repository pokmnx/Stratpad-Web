define([
	'Backbone',
	'models/ThemeModel'
	],

	function( Backbone, ThemeModel ) {
	
    	var ThemeCollection = Backbone.Collection.extend({
    		model : ThemeModel,
    
    		localStorage : new Store("Themes"),
    
    		initialize : function() {
    			this.fetch();

                // If collection is empty, create defaults.
                if ( this.models.length === 0 ) {
                    this.add( { title : 'Grow customer base by 10%', startDate : new Date(2011,11,07) } );
                }

    		},

            comparator : function( model ) {
                return model.get( 'title' );
            }
    	});
    
    	return ThemeCollection;	

	}
);