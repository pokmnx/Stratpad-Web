require.config({
	paths: {
		// these are little wrappers which load a certain version of the appropriate lib
		// todo: we have an old version of require which needs order.js
		jQuery : 'lib/jquery/jquery',
		Underscore : 'lib/underscore/underscore',
		Backbone : 'lib/backbone/backbone',

		sprintf: 'lib/sprintf/sprintf',

		StratFileCollection : 'collections/StratFileCollection',
		ThemeCollection : 'collections/ThemeCollection',

		IndexView: 'views/IndexView',
		StratFileItemView: 'views/StratFileItemView',
		CreateStratFileView: 'views/CreateStratFileView',

		Router : 'router',
	}
});

require( ['jQuery',
	'Underscore',
	'Backbone',
	'Router'],

	function( $, _, Backbone, Router ) {
		var router = new Router();
		Backbone.history.start();
	}
);


