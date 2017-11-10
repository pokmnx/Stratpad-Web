// just remember this will work in Safari if loaded as file://, but not in other browsers (origin will be null and fail CORS)
// http://localhost:8000/test/qtest.html
// if you want to run any of the modules independently, you must run user management first (to get signed in)

QUnit.config.reorder = false;

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	options.xhrFields = {
		withCredentials: true
	};
	options.beforeSend = function (xhr) { 
        xhr.setRequestHeader('QTEST', 'TRUE');
    };
});

var serverURL = "https://jstratpad.appspot.com";
// var serverURL = "http://localhost:8888";

// setup logging (gives us levels and IE support)
var log = module.exports;

log.setLevel('debug');

console.trace = log.trace;
console.debug = log.debug;
console.info = log.info;
console.warn = log.warn;
console.error = log.error;  
