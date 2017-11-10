moment.lang('en', {
	relativeTime : {
		future: "in %s",
		past:   "%s ago",
		s:  "seconds",
		m:  "a minute",
		mm: "%d minutes",
		h:  "an hour",
		hh: "%d hours",
		d:  "a day",
		dd: "%d days",
		M:  "a month",
		MM: "%d months",
		y:  "a year",
		yy: "%d years"
	},
        postformat : function (formattedDate) {
        	// introduce linefeed - doesn't work the way documented (ie "MMM[\n]YYYY" should work, but leaves the braces behind)
        	// eg. moment().format("MMM[linefeed]YYYY") 
        	// -> "Jun\n2014"
            return formattedDate.replace('linefeed', '\n');
        }
});