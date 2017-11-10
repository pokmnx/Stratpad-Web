// common field behaviour for entering numbers
define(['jquery'],
	function() {

		if ($.type($.stratweb) !== 'object') {
			$.stratweb = {};
		};

		$.stratweb.unsignedIntegerField = function(e) {
			var key = e.charCode || e.keyCode || 0;
			// restrict input
			return (
				(e.ctrlKey === true || e.metaKey === true) ||
				key == 8 || // backspace
				key == 9 || // tab
				key == 46 || // delete
				(key >= 35 && key <= 40) || // arrows
				(key >= 48 && key <= 57) || // 0-10
				(key >= 96 && key <= 105)); // 0-10 keypad
		};

		$.stratweb.integerField = function(e) {
			var key = e.charCode || e.keyCode || 0;
			var isIntegerChar = $.stratweb.unsignedIntegerField(e);
			return (
				isIntegerChar ||
				key == 109 || // '-' numberpad
				key == 173 || // '-' firefox
				key == 189);  // '-'				
		};

		$.stratweb.decimalField = function(e) {
			var key = e.charCode || e.keyCode || 0;
			// restrict input
			var isDecimalChar = $.stratweb.unsignedDecimalField(e);
			return (
				isDecimalChar ||
				key == 109 || // '-' numberpad
				key == 173 || // '-' firefox
				key == 189);  // '-'
		};

		$.stratweb.unsignedDecimalField = function(e) {
			var key = e.charCode || e.keyCode || 0;
			// restrict input
			return (
				(e.ctrlKey === true || e.metaKey === true) ||
				key == 8 || // backspace
				key == 9 || // tab
				key == 46 || // delete
				(key >= 35 && key <= 40) ||  // arrows
				(key >= 48 && key <= 57) ||  // 0-10
				(key >= 96 && key <= 105)||  // 0-10 keypad
				key == 110 ||				 // '.' keypad
				key == 190);				 // '.'

		};

	});