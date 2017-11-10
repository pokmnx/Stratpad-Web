define(['i18n!nls/BaseForm.i18n', 'backbone'],
	function(baseFormLocalizable) {

		var view = Backbone.View.extend({

			initialize: function(router, localizable) {
				this.router = router;
				this._localizable = _.defaults(localizable || {}, baseFormLocalizable);


			},

			localized: function(key) {
				if (key in this._localizable) {
					return this._localizable[key];
				} else {
					return key;
				}
			},

		});

		return view;
	});