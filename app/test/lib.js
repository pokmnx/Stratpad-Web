function generateUUID() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return uuid;
}

// this will be called by our models eg StratFile, Theme
// it is designed to allow easy testing in place of our Backbone models, and maybe some other classes
// it is highly inflexible! It generally demands that your class takes a Config param and that's it
function define(ary, func) {

	// if we have vars in the global namespace, represented by the strings in ary (ie. the params of define), then add those to the func call
	// first param always config
	var tmpModel;
	if (ary.length > 1) {
		var funcName = ary[1];
		if (window.hasOwnProperty(funcName)) {
			tmpModel = func({serverBaseUrl: serverURL}, eval(funcName));			
		}
	};

	// eg when testing formats.js, or something that just wants jquery around as a dep
	if (ary.length == 1 && ary[0] == 'jquery') {
		func();
		return;
	}

	// we are basically calling the function that is a parameter of define, with a parameter representing our Config; ignoring the rest
	if (!tmpModel) tmpModel = func({serverBaseUrl: serverURL});
	var className = tmpModel.entityName || tmpModel.prototype.className;

	// we can add some more args if necessary
	if (className == 'StratFile') {
		// ensure AccessControlEntry is instantiated in the global namespace first (ie order of .js)
		tmpModel = func({serverBaseUrl: serverURL}, AccessControlEntry);
	};

	// place this class in the global namespace, for testing
	window[className] = tmpModel;
}

