// shows a list of ProjectNoteItems in the adjustment inputs
define(['ProjectNoteItemRowView', 'backbone'],
	function(ProjectNoteItemRowView, ProjectNoteItem) {

		var view = Backbone.View.extend({

			// the ul that we should be adding/removing items from
			el: '#projectNoteItems',

			projectNoteItemRowViews: {},

			initialize: function(router, theme, projectNoteItemCollection, field, localizable) {
				_.bindAll(this, "render", "renderOne", "removeOne", "updateTotal", "clearRows");
				this.router = router;
				this.theme = theme;
				this.projectNoteItemCollection = projectNoteItemCollection;
				this.field = field;
				this.localizable = localizable;

				// listen for new projectNoteItems being added to the model, and render
				this.projectNoteItemCollection
					.off('add', null, 'pniListView')
					.on("add", function(projectNoteItem) {
						console.debug("Rendering projectNoteItemRowView for category: " + projectNoteItem.get("category"));
						this.renderOne(projectNoteItem);
						this.updateTotal();						
				}.bind(this), 'pniListView' );

				this.projectNoteItemCollection
					.off('change', null, 'pniListView')
					.on("change", function(projectNoteItem) {
						this.updateTotal();
				}.bind(this), 'pniListView' );					

				this.projectNoteItemCollection
					.off('destroy', null, 'pniListView')
					.on("destroy", function(projectNoteItem) {
						// destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
						console.debug("Removing projectNoteItem for category: " + projectNoteItem.get("category"));
						this.removeOne(projectNoteItem);
						this.updateTotal();						
				}.bind(this), 'pniListView');

				// reset means that you want to delete all items from the collection (on server too) and re-render
				this.projectNoteItemCollection
					.off('reset', null, 'pniListView')
					.on("reset", function() {
						console.debug("Resetting/removing all projectNoteItemRowViews");
						this.projectNoteItemRowViews = {};
						this.$el.find('li').remove();
						this.updateTotal();
					}.bind(this), 'pniListView');

			},

			// renders all rows in a section and appends to our tooltip ul
			render: function() {

				this.$el.find('> li').remove();

		        var filteredCollection = this.projectNoteItemCollection.where({
		          'field': this.field
		        });

				console.debug("Rendering projectNoteItemRowViews: " + filteredCollection.length);

		        _.each(filteredCollection, function(projectNoteItem, idx) {
		          this.renderOne(projectNoteItem);
		        }.bind(this));

		        // custom header for category
		        var heading;
		        if (this.field.indexOf('revenue') != -1) {
		        	heading = this.localizable.get('notesCategoryHeaderRevenue');
		        }
		        else if (this.field.indexOf('cogs') != -1) {
		        	heading = this.localizable.get('notesCategoryHeaderCogs');
		        }
		        else {
		        	heading = this.localizable.get('notesCategoryHeaderExpenses');
		        }
		        this.$el.closest('.notes-tooltip').find('.notesCategoryHeader').text(heading);

		        this.updateTotal();

				// allow the notes window to resize
				$(document).trigger('notesRendered', this.$el.closest('.notes-tooltip'));
			},

			// adds one rendered projectNoteItemRowView to the end of the list
			renderOne: function(projectNoteItem) {

				var projectNoteItemRowView = new ProjectNoteItemRowView(this.router, projectNoteItem, this.localizable);

				projectNoteItem
					.off('change', null, 'note')
					.on("change", function(projectNoteItem) {
						console.debug("Updating the projectNoteItem row for field: " + projectNoteItem.get("field")  );
						projectNoteItemRowView.updateTotal();
					}, 'note');

				this.$el.append(projectNoteItemRowView.render().el);
				this.projectNoteItemRowViews[projectNoteItem.id.toString()] = projectNoteItemRowView;
			},

			removeOne: function(projectNoteItem) {
				// look through projectNoteItemRowViews for a matching projectNoteItem
				var projectNoteItemRowView = this.projectNoteItemRowViews[projectNoteItem.id.toString()];
				if (projectNoteItemRowView) {
					projectNoteItemRowView.$el.fadeOut(400, function() {
						$(this).remove();
					});
					delete this.projectNoteItemRowViews[projectNoteItem.id.toString()];

				} 
				else {
					console.warn("Couldn't remove Note with id: " + projectNoteItem.id);
				}
			},

			updateTotal: function() {
				var total = null;

		        var filteredCollection = this.projectNoteItemCollection.where({
		          'field': this.field
		        });

		        _.each(filteredCollection, function(projectNoteItem, idx) {
		        	var subtotal = projectNoteItem.total();
		        	if (subtotal != undefined) {
		        		total += subtotal;
		        	};
		        });

		        console.debug(sprintf('notes total for %s = %s', this.field, total));

		        if (total != null) {
		        	total = Math.round(total);
		        };

                // set the total
		        $('.tooltip-notes')
			        .find('#notesTotal').text(total);

                // on theme page - display and trigger a save
		        $('#' + this.field).val(total);
		        this.theme.set(this.field, total);

			},

			clearRows: function() {
				this.$el.find('> li').remove();
			}

		});

		return view;
	});