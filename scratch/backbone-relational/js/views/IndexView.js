define([	
		'jQuery',
		'Underscore',
		'Backbone',
		'models/StratFileModel',
        'StratFileItemView',
        'CreateStratFileView',
		'lib/backbone/backbone.localStorage',
	],

    function( $, _, Backbone, StratFileModel, StratFileItemView, CreateStratFileView ) {
	   
		var mainView = Backbone.View.extend({
            
			initialize : function(stratFileCollection) {
                
                this.stratFileCollection = stratFileCollection;

                // render if we detect any change to the model - third arg provides context (this)
				this.stratFileCollection.bind( 'all', this.render, this );
			},
            
            events : {

			},
            
        	render : function(e) {
                // called once for 'add' and once for 'relational:add'
                if (e == 'relational:add') return;

                // re-render all items from scratch
                this.$el.empty();

                // here we are rendering to the element hosted by this view
                // we are also processing our template, and giving it a context with all our stratFiles
                // in the router, we take the html generated here and attach it it to the appropriate div
                for (var i = 0; i < this.stratFileCollection.models.length; i++) {
                    console.debug('title: ' + this.stratFileCollection.models[i].get('title'));

                    // render a template for each strafile
                    // the model will be attached implicitly to StratFileItemView
                    // other params will be passed through to the initialize function
                    var stratFileView = new StratFileItemView({ model : this.stratFileCollection.models[i] });
                    this.$el.append( stratFileView.render().$el );

                };

                var createStratFileView = new CreateStratFileView({ collection: this.stratFileCollection });
                $('div#createStratFile').html( createStratFileView.render().$el );
            
			},

		});

		return mainView;
	}
);