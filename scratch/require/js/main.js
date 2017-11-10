// for this to work, it needs to go under a live webserver (cause of x-domain ajax restrictions)
// easiest is to fire up a python server in the above dir: python -m SimpleHTTPServer

requirejs.config({

	paths: {
		// these export $ and _ globally
		underscore: 'lib/underscore/underscore',
		jquery: 'lib/jquery/jquery-1.9.0',
		backbone: 'lib/backbone/backbone',
		sprintf: 'lib/sprintf/sprintf',

		Config: 'modules/Config',
		Router: 'modules/Router',
		HtmlHelper: 'modules/HtmlHelper',

		PageControlView: 'views/PageControlView',
	},
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone' // our global
        }
    }
});


define(
    ['backbone', 'Router', 'PageControlView', 'sprintf'],

    function (Backbone, Router, PageControlView) {
        console.log('global', $);
        console.log('global', _);
        console.log('global', Backbone);

		var router = new Router();
		Backbone.history.start();

		// hook up the next/prev
		var pageControlView = new PageControlView(router);

    }
);
