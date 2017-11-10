// not included in the qtests - just a place to experiment, or do some utility

module("misc");

test( "lib test", function() {
    stop();
    expect(2);

	if (typeof console !== 'undefined') console.debug('jquery:', $.fn.jquery);
	if (typeof console !== 'undefined') console.debug('underscore: ', _.VERSION);
	equal( $.fn.jquery, "2.1.1", "jquery check" );
	equal( _.VERSION, "1.5.2", "Underscore check" );
    start();
});

test( "misc", function() {
	stop();
	expect(0);

	var subscriptionStartDate = moment("2014-02-01");

	var now = moment();
	var expiry = moment(subscriptionStartDate).endOf('day').add('years', 1);
	while (expiry.isBefore(now, 'day')) {
		expiry.add('years', 1);
	}

	console.debug("expiry=" + expiry.format());


	start();
});

test( "error", function() {
	stop();
	expect(2);

	var jqXHR = {};
	var error = $.stratweb.firstError(jqXHR.responseJSON, 'payment.unknownError');

	equal(error.key, 'payment.unknownError');
	equal(error.isValidation, false);

	start();
});




