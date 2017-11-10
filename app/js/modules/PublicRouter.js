define(['Config', 'PageLandingView', 'backbone'],

function(config, PageLandingView) {
	var Router = Backbone.Router.extend({

		initialize: function() {
						
			// landing page
			this.pageLandingView = new PageLandingView(this);

			// universal analytics, adwords, conversions
			this._setupAnalytics(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		},

		_setupAnalytics: function(i, s, o, g, r, a, m) {
			// this one is for signup conversion, only on production

			// global object
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments);
			}, i[r].l = 1 * new Date();
			
			// add script tag
			a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m);

			// init our account
			ga('create', 'UA-3611832-10', 'stratpad.com');

		}


	});

	return Router;
});