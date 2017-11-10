define(['Config', 'ConnectIntroductionsAdmin', 'ServiceProvidersAdmin', 'ConnectReferralsAdmin', 'LocationsAdmin', 'UsersAdmin', 'backbone', 'bootgrid', 'bootstrap'],

function(config, ConnectIntroductionsAdmin, ServiceProvidersAdmin, ConnectReferralsAdmin, LocationsAdmin, UsersAdmin) {
	var Router = Backbone.Router.extend({

		routes: {
			"": "showMain",
			"connectReferrals": "showConnectReferrals",
			"connectIntroductions": "showIntroductions",
			"serviceProviders": "showServiceProviders",
			"users": "showUsers",
			"locations": "showLocations"
		},

		dateFormat: "MMM D, YYYY, hh:mm:ss z",

		initialize: function() {
			_.bindAll(this, 'showMain', 'showConnectReferrals', 'showIntroductions', 'showServiceProviders', 'showUsers', 'showLocations');

		},

		updateNav: function(section) {
			$('nav li').removeClass('active');
			$('nav li #' + section).closest('li').addClass('active');
		},

		showMain: function() {
			// todo: could check credentials and show login
			console.debug('hi main');
		},

		showServiceProviders: function() {
			var self = this;

			this.updateNav('serviceProviders');

			this.serviceProvidersAdmin = new ServiceProvidersAdmin();

		},

		showConnectReferrals: function() {
			var self = this;

			this.updateNav('connectReferrals');

			this.connectReferralsAdmin = new ConnectReferralsAdmin();

		}, 

		showIntroductions: function() {
			var self = this;

			this.updateNav('connectIntroductions');

			this.connectIntroductionsAdmin = new ConnectIntroductionsAdmin();
		},

		showUsers: function() {
			var self = this;

			this.updateNav('users');

			this.usersAdmin = new UsersAdmin();
		},

		showLocations: function() {
			var self = this;

			this.updateNav('locations');

			this.locationsAdmin = new LocationsAdmin();
		}


	});

	return Router;
});