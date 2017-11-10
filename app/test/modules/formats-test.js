// not included in the qtests - just a place to experiment, or do some utility

module("format");

test( "formatNumberWithParens test", function() {
    stop();
    expect(14);

	equal( $.stratweb.formatNumberWithParens(63), '63');
	equal( $.stratweb.formatNumberWithParens(-40), '(40)');
	equal( $.stratweb.formatNumberWithParens(1000), '1,000');
	equal( $.stratweb.formatNumberWithParens(100.64), '101');
	equal( $.stratweb.formatNumberWithParens(100.6), '101');
	equal( $.stratweb.formatNumberWithParens(100.655), '101');
	equal( $.stratweb.formatNumberWithParens(-100.655), '(101)');

	equal( $.stratweb.formatNumberWithParens('63'), '63');
	equal( $.stratweb.formatNumberWithParens('-40'), '(40)');
	equal( $.stratweb.formatNumberWithParens('1000'), '1,000');
	equal( $.stratweb.formatNumberWithParens('100.64'), '101');
	equal( $.stratweb.formatNumberWithParens('100.6'), '101');
	equal( $.stratweb.formatNumberWithParens('100.655'), '101');
	equal( $.stratweb.formatNumberWithParens('-100.655'), '(101)');

    start();
});


test( "formatDecimalWithParens test", function() {
    stop();
    expect(14);

	equal( $.stratweb.formatDecimalWithParens(63), '63');
	equal( $.stratweb.formatDecimalWithParens(-40), '(40)');
	equal( $.stratweb.formatDecimalWithParens(1000), '1,000');
	equal( $.stratweb.formatDecimalWithParens(100.64), '100.64');
	equal( $.stratweb.formatDecimalWithParens(100.6), '100.60');
	equal( $.stratweb.formatDecimalWithParens(100.655), '100.66');
	equal( $.stratweb.formatDecimalWithParens(-100.655), '(100.66)');

	equal( $.stratweb.formatDecimalWithParens('63'), '63');
	equal( $.stratweb.formatDecimalWithParens('-40'), '(40)');
	equal( $.stratweb.formatDecimalWithParens('1000'), '1,000');
	equal( $.stratweb.formatDecimalWithParens('100.64'), '100.64');
	equal( $.stratweb.formatDecimalWithParens('100.6'), '100.60');
	equal( $.stratweb.formatDecimalWithParens('100.655'), '100.66');
	equal( $.stratweb.formatDecimalWithParens('-100.655'), '(100.66)');


    start();
});


