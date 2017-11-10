$.fn.renderHockey = function() {

	// note that we're using precompiled templates, meaning that all .handlebars files have been compiled into templates.js
	// we could additionally use runtime templates, where we would grab the template from app.html and compile it at runtime
	// we can also use underscore templates, which expose a little more logic control than handlebars, but have no precompile capability

	// this returns a js function which was created by compiling hockey.handlebars
	var compiledTemplate = Handlebars.templates['hockey'];

	// data
	var players = {

		listTitle: "Olympic Hockey Players",

		listItems: [{
			name: "Manon Rhéaume",
			hasOlympicGold: true
		}, 

		{
			name: "Roberto Luongo",
			hasOlympicGold: true
		},

		{
			name: "Ryan Kesler",
			hasOlympicGold: false
		},

		{
			name: "Henrik Sedin",
			hasOlympicGold: false
		}]

	};

	// helper to determine if anyone got gold
	Handlebars.registerHelper('hasGold', function(options) {
		// nb. we can't just use #if helper in these cases, because the boolean arg would also need to be a helper
		// - handlebars just renders the actual bool representation in these cases, rather than the template
		var list = players.listItems;
		var hasGold = _.any(_.pluck(players.listItems, "hasOlympicGold"));
		return hasGold ? options.fn(this) : options.inverse(this);
	});

	// now execute it with a context; opportunity for localization
	var html = compiledTemplate(players);

	// append
	return this.append(html);

};

/*

// underscore js and template

$.fn.renderHockey = function() {

		// When rending an underscore template, we want top-level
		// variables to be referenced as part of an object. For
		// technical reasons (scope-chain search), this speeds up
		// rendering; however, more importantly, this also allows our
		// templates to look / feel more like our server-side
		// templates that use the rc (Request Context / Colletion) in
		// order to render their markup.
		_.templateSettings.variable = "rc";


		// Grab the HTML out of our template tag and pre-compile it.
		var template = _.template(
			$("script.hockey").html()
		);


		// Define our render data (to be put into the "rc" variable).
		var templateData = {

			listTitle: "Olympic Hockey Players",

			listItems: [{
				name: "Manon Rhéaume",
				hasOlympicGold: true
			}, {
				name: "Roberto Luongo",
				hasOlympicGold: true
			},

			{
				name: "Ryan Kesler",
				hasOlympicGold: false
			},

			{
				name: "Henrik Sedin",
				hasOlympicGold: false
			}]

		};


		// Render the underscore template and inject it after #gymnastics
		// in our current DOM.
		return this.append(
		template(templateData));

};

// in app.html
<script type="text/template" class="hockey">

  <h2>
    <%- rc.listTitle %>
  </h2>
  <ul>
    <% _.each( rc.listItems, function( listItem ){ %>
    <li>
      <%- listItem.name %><% if ( listItem.hasOlympicGold ){ %>
      <em>*</em><% } %>
    </li><% }); %>
  </ul>
  <% var showFootnote = _.any(_.pluck( rc.listItems, "hasOlympicGold" )); %>
  <% if ( showFootnote ){ %>
  <p style="font-size: 12px ;">
    <em>* Olympic gold medalist</em>
  </p><% } %>

</script>


*/
