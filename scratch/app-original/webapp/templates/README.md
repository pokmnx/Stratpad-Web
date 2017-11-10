The first thing that happens is we prepare the handlebars templates. All html files will be processed.
Files containing an element with a template='handlebars' attribute will have that element written to
a .handlebars file. Otherwise the entire html will be written to a .handlebars file. You must give a 
root element to your html file. Handlebars templates are ignored by git.

	python prepareTemplates.py

The handlebars files are then precompiled into templates.js using:

	handlebars webapp/templates/ > webapp/scripts/templates.js 

- templates.js is gitignored, since we create it each time.
- require.js then includes templates.js
- build.sh includes this step automatically

- convention is:
	- make a [module].handlebars
	- make a [module].js
	- add it to app.build.js
	- require it in main.js
	- hook it up to an element in main.js
	
- you can load .handlebars html snippets directly in your browser for development
