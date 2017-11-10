require(
["jquery", "underscore", "hockey", "handlebars", "templates", "cycling", "backbone", "json2", "backbone-localstorage", "backbone-simperium", "simperium", "modernizr", "todos"], function($) {

	$(function() {

		$("#todos").startTodos();

		// just some example handlbar templates
		$("#hockey").renderHockey();

		$("#cycling").renderCycling();

	});
});