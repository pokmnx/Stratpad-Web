define([
      'Backbone'
    ],
  function( Backbone ) {
    var ThemeModel = Backbone.RelationalModel.extend({
      
      validate : function( attrs ) {
        if ( !attrs.title) {
               throw new Error( "The Theme object does not validate." );
        }
      }  
    });

    return ThemeModel;
  }
);