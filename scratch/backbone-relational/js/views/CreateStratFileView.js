define([
		'jQuery',
		'Underscore',
		'Backbone',
		'models/StratFileModel'
	],
	
	function( $, _, Backbone, StratFileModel ) {
	   
		var createStratFileView = Backbone.View.extend({
		  
			initialize : function() {
                                
                // there is no context for this template - really this is html
				this.template = _.template( $( 'script#createStratFileTemplate' ).html() );
                
			},

			events : {
                'keypress .stratFileTitle' : 'onKeyPressed',
			},


			render : function() {
				$(this.el).html( this.template );
				return this;
			},
            
            
            // save new artist
            submitNewStratFile : function (e) {
                
                try{
                	// it would seem that the constructor makes all attributes passed to it automatically available
                    this.collection.add({
                    	title : this.$('.stratFileTitle').val()
                    });
                    
                    // this was to hide the text field, and to reset the URL
                    //this.trigger('artistAdded');

                } 
                catch(error) 
                {
                    console.log("Error: ", error.message);
                }
            },
            
            // submit if we pressed return
            onKeyPressed : function( e ) {
				if ( e.keyCode == 13) {
					this.submitNewStratFile( e );
					return false;
				}
			},

		});

		return createStratFileView;
	}	
);