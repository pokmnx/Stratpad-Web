define([
    'Backbone',
    'models/StratFileModel',
    'ThemeCollection'
    ],

    function( Backbone, StratFileModel, ThemeCollection ) {
    
        var stratFileCollection = Backbone.Collection.extend({
            model : StratFileModel,
    
            localStorage : new Store( "StratFiles" ),
    
            initialize : function() {
                this.fetch();
    
                // If collection is empty, create defaults.
                if ( this.models.length === 0 ) {
                    var themeCollection = new ThemeCollection();

                    this.add( { title : '2013 Expansion Plan', companyName : "Mobilesce Inc." } );
                    this.add( { title : 'Marketing Plan', companyName: "GTI", 'themeCollection' : themeCollection } );

                }

            },

            comparator : function( model ) {
                return model.get( 'title' );
            }
        });
    
        return stratFileCollection;
    }
);