test( "html", function() {
	stop();
	expect(1);

	// this still works, but we've removed all files from there for now
    $.ajax({
        url: serverURL + "/static/en.lproj/welcome.htm",
        type: "GET",
        dataType: 'html'
	})
	.done(function(response, textStatus, jqXHR) {
		console.error("This file shouldn't exist");
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		equal( jqXHR.status, 404, "html download check" );
	})
	.always(function() {
		start();
	});


});


test( "images", function() {
	stop();
	expect(1);

	var img = $("<img />").attr('src', serverURL + "/images/reference/en.lproj/onstrategy-goal.jpg")
		.load(function() {
			if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				console.error("Broken image.");
			} else {
				equal( this.complete, true, "png download check" );
			}
			start();
		});
});
