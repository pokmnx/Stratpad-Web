var page = require('webpage').create(),
    system = require('system'),
    fs = require("fs"),
    input, output, size;
    
// /usr/bin/phantomjs cgi-bin/rasterize.js chart.html chart.png

input = system.args[1]; // .html
output = system.args[2]; // .png

page.onConsoleMessage = function (msg) {
    console.debug(msg);
};

page.open(input, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the input!');  
        phantom.exit();
    } else {
        // usually the html we have is a table
        // the trick is knowing height, before we render into the page, because otherwise we will get some margin (or cutoff) at the bottom of the page

        // zoom it so that we can get more detail
        // nothing special about 800 (often use 1336)
        page.zoomFactor = 3;
        pageWidth = 800*page.zoomFactor;
        page.viewportSize = { width: pageWidth, height: 9999 };

		var height = page.evaluate(function() {
            var w = document.getElementsByClassName('reportTable')[0].offsetWidth;
            var h = document.getElementsByClassName('reportTable')[0].offsetHeight;
            console.debug('reported: ' + w + 'x' + h);

			return h;
		});

        pageHeight = height*page.zoomFactor;

		page.viewportSize = { width: pageWidth, height: pageHeight };
		page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };

        console.debug("final: " + JSON.stringify(page.viewportSize));
    
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 200);
    }
});
