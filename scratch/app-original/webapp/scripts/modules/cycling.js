$.fn.renderCycling = function() {

		// // this is how you would render a handlebars template, sitting in app.html

		// var source   = $("script.cycling").html();
		// var template = Handlebars.compile(source);
		// var context = {title: "My New Post", content: "This is my first post!"}
		// var html    = template(context);

		// this is how we embed and execute a pre-compiled template from templates.js

		// this returns a function
		var compiledTemplate = Handlebars.templates['cycling'];

		// now execute it with a context; opportunity for localization
		var html = compiledTemplate({title: "Cycling Rulez", content: "This is my first cycling post!"});

		// append
		return this.append(html);

};
