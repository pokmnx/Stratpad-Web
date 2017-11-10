define([
	'jQuery',
	'Underscore',
	'Backbone',
    'StratFileCollection',
	'IndexView',
    ],

    function( $, _, Backbone, StratFileCollection, IndexView )
    {
		return AppRouter = Backbone.Router.extend({
			
            initialize : function() {

                // clear out the db, for development
                // nb we need one store per entity
                // also, by def'n, we're working with a single user's data
                window.localStorage.clear();
                
                // create a new collection of stratfiles (or load it up)
                this.stratFileCollection = new StratFileCollection();
			},

			routes : {
                // if no hashbang, then invoke our index function
				'' : 'index',
			},

			index : function() {
                
                // this is our initial view, which shows stratfiles
                var indexView = new IndexView(this.stratFileCollection);
				indexView.render();

                $('#stratFiles').html(indexView.el);

			},
            
		});
});
