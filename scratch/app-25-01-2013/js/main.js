// for this to work, it needs to go under a live webserver (cause of x-domain ajax restrictions)
// easiest is to fire up a python server in the above dir: python -m SimpleHTTPServer

requirejs.config({

	paths: {
		// these export $ and _ globally
		underscore: 'lib/underscore/underscore',
		
		jquery: 'lib/jquery/jquery-1.9.0',
		jqueryUI: 'lib/jquery/jquery-ui-1.10.0.custom',
		spinjs: 'lib/jquery/jquery-spin.1.2.8.min',
		nicescroll: 'lib/jquery/jquery-nicescroll.3.1.2.min',
		
		backbone: 'lib/backbone/backbone',
		sprintf: 'lib/sprintf/sprintf',		
		jrespond: 'lib/jrespond/jrespond.0.8.3.min',

		Config: 'modules/Config',
		Router: 'modules/Router',
		HtmlHelper: 'modules/HtmlHelper',
		PageStructure: 'modules/PageStructure',

		PageControlView: 'views/PageControlView',
		PageNavigationView: 'views/PageNavigationView'
	},
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone' // our global
        },
	'spinjs': ['jquery'],
	'jqueryUI': ['jquery'],
	'jrespond': ['jquery'],
	'nicescroll': ['jquery']
    }
});


define(
    ['backbone', 'Router', 'sprintf', 'jqueryUI', 'spinjs', 'jrespond', 'nicescroll' ],

    function (Backbone, Router) {
        console.debug('global', $);
        console.debug('global', _);
        console.debug('global', Backbone);

        // kick off the app
		var router = new Router();
		Backbone.history.start();

    }
);
