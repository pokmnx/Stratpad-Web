// override define in lib.js to give us one that works with NetBenefitsCalculator dependencies
function define(ary, func) {
	var tmpModel = func(window['ThemeCalculator']);
	var className = tmpModel.entityName || tmpModel.prototype.className;

	// place this class in the global namespace, for testing
	window[className] = tmpModel;
}

