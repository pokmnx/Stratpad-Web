/*

jQuery plugin for spin js - http://fgnass.github.io/spin.js/

You can now create a spinner using any of the variants below:

$("#el").spin(); // Produces default Spinner using the text color of #el.
$("#el").spin("small"); // Produces a 'small' Spinner using the text color of #el.
$("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
$("#el").spin({ ... }); // Produces a Spinner using your custom settings.

var opts = _.extend({left: '400px'}, $.fn.spin.presets.small);
$("#el").spin(opts);

$("#el").spin(false); // Kills the spinner.

*/

// shows a list of activities for a given Objective
define(['spinjs'],
	function(Spinner) {

		$.fn.spin = function(opts, color) {
			var presets = $.fn.spin.presets;
			return this.each(function() {
				var $this = $(this),
					data = $this.data();
				if (data.spinner) {
					data.spinner.stop();
					delete data.spinner
				}
				if (opts !== false) {
					if (typeof opts === "string") {
						if (opts in presets) {
							opts = presets[opts]
						} else {
							opts = {}
						} 
						if (color) {
							opts.color = color
						}
					}
					data.spinner = new Spinner($.extend({
						color: $this.css('color')
					}, opts)).spin(this)
				}
			})
		};

		$.fn.spin.presets = {
			"tiny": {
				lines: 8,
				length: 2,
				width: 2,
				radius: 3
			},
			"small": {
				lines: 8,
				length: 4,
				width: 3,
				radius: 5
			},
			"large": {
				lines: 13,
				length: 13,
				width: 4,
				radius: 12
			},
			"nav_slider": {
				lines: 13,
				length: 10,
				width: 4,
				radius: 9
			},
			default: {
			    lines: 12,
			    length: 7,
			    width: 5, 
			    radius: 10
			}
		};


	});