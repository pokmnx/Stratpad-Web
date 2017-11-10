// just a place to store some "globals" for our formatting
define(['jquery'],
	function() {

		if ($.type($.stratweb) !== 'object') {
			$.stratweb = {};
		};
		$.stratweb.dateFormats = {
			'in': 'YYYYMMDD',
			'out': 'MMM D, YYYY',
			'full': 'MMMM D, YYYY',
			'datePicker': 'YYYY-MM-DD',
			'monthYear': 'MMM YYYY'
		};

		//  20130408L to a moment date (ie that is 2013-04-08)
		$.stratweb.dateFromLong = function(dateLong) {
			return moment(dateLong, 'YYYYMMDD');
		};

		$.stratweb.longFromDate = function(date) {
			return date.format('YYYYMMDD');
		};

		// we get user dates in long format from our service eg. 20130408L
		// our datePicker can be loaded with a value matching its format, which is typically '2013-04-08', or null
		$.stratweb.formattedDateForDatePicker = function(dateLong) {
			if (dateLong) {
				var date = dateLong.toString();
				return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
			} else {
				return null;
			}
		};

		// of course, this is english-only type formatting - see formats-test.js for examples
		$.stratweb.formatNumberWithParens = function(n) {
			var isNegative = n < 0;
			var parts = Math.abs(Math.round(n)).toString().split(".");
			var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
			return isNegative ? "(" + num + ")" : num;
		};

		$.stratweb.formatDecimalWithParens = function(n) {
			var isNegative = false;
			var num = new Number(n); // deals with strings too
			if (num.valueOf() < 0) {
				isNegative = true;
				num = new Number(Math.abs(num.valueOf()));
			};
			var isInteger = num.valueOf() == Math.floor(num.valueOf());
			if (isInteger) {
				return $.stratweb.formatNumberWithParens(n);
			} else {
				var displayNum = num.toFixed(2);
				return isNegative ? "(" + displayNum + ")" : displayNum;
			}
			
		};

		$.stratweb.formatDecimalWithPercent = function(n) {
			return (n*100).toFixed(2) + '%';
		};

		$.stratweb.stripNumberFormatting = function(s) {
			return s.replace(/[\(\)\,]/g, '');
		};

		$.stratweb.formatZipPostal = function(s) {
			var zipPattern = /^\d{5}$/;
			var postalPattern = /^([A-Z]\d[A-Z]) ?(\d[A-Z]\d$)/;

			if (zipPattern.test(s)) {
				return s;
			}
			else if (postalPattern.test(s)) {
				var parts = s.match(postalPattern);
				return parts[1] + ' ' + parts[2];
			} 
			else {
				return s;
			}
		}

	});