define([],
	function() {
		var Dictionary = Class.extend({

			// properties stick, as soon as they are set (ie leftmost props win, or fill in leftmost array with values from right side arrays)
			initialize: function() {
				if (arguments.length == 0) {
					this._obj = {};
				} else if (arguments.length == 1) {
					this._obj = arguments[0];
				} else {
					this._obj = arguments[0];
					for (var i=1; i<arguments.length; ++i) {
						_.defaults(this._obj, arguments[i]);
					}
				}
			},
			get: function(key) {
				if (key in this._obj) {
					return this._obj[key];
				} else {
					return key;
				}
			},
			all: function() {
				return this._obj;
			},
			put: function(key, value) {
				this._obj[key] = value;
			}
		});
		return Dictionary;
	});