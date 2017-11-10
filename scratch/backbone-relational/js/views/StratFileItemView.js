define([
	'Backbone', 
	'Underscore', 
	'jQuery',
	'sprintf',
	],

	function(Backbone, _, $, sprintf) {
	   
		return Backbone.View.extend({

			initialize : function() {
				this.template = _.template( $('script#stratFileItem').html() );  
			},

			events : {
				'click .remove' : 'remove',
				'click .stratFileItem' : 'changeItem',
				'mouseover .stratFileItem' : 'pointerCursor',
				'mouseout .stratFileItem' : 'defaultCursor',
				'mouseover .details' : 'pointerCursor',
				'mouseout .details' : 'defaultCursor',
				'click "#stratFilesPage .details"' : 'showDetails',
			},

			remove : function( e ) {
				this.model.destroy();
			},

			changeItem : function() {
				var change = prompt("What do you want to change the value of " + this.model.get('title') + " to", this.model.get('title'))
				if (change!=null && change!="") {
					this.model.save({title: change});
					this.$el.empty();
					this.render();
				}
			},

			pointerCursor : function() {
				document.body.style.cursor = 'pointer';
			},

			defaultCursor : function() {
				document.body.style.cursor = 'default';
			},

			showDetails : function(e) {
				// we want to hide all of Stratfiles, show details instead
				var themeCollection = this.model.get('themeCollection');
				var t = '';
				if (themeCollection && themeCollection.length) {
					for (var i = 0; i < themeCollection.length; i++) {
						title = themeCollection.models[i].get('title');
						t += sprintf(" [Theme: %s]", title);
					};
				} else {
					t = "None."
				}
				var s = sprintf("title: %s, company: %s, themes: %s", this.model.get('title'), this.model.get('companyName'), t);
				alert(s);
			},

			render : function() {
				$(this.el).html( this.template({
					stratFile : this.model.attributes
				}));

				return this;
			}
		});
});