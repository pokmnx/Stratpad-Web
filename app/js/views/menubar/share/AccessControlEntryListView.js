// shows a list of accessControlEntrys in the Financials -> Options page
define(['AccessControlEntryRowView', 'backbone'],
	function(AccessControlEntryRowView) {

		var view = Backbone.View.extend({

			// the ul that we should be adding/removing items from
			el: '#accessControlEntries',

			accessControlEntryRowViews: {},

			initialize: function(router, accessControlEntryCollection, localizable) {
				_.bindAll(this, "render", "renderOne", "removeOne");
				this.router = router;
				this.accessControlEntryCollection = accessControlEntryCollection;
				this.localizable = localizable;

				// listen for new accessControlEntrys being added to the model, and render
				this.accessControlEntryCollection
					.off('add', null, 'ace')
					.on("add", function(accessControlEntry) {
						console.debug("Rendering accessControlEntryRowView for email: " + accessControlEntry.get("userEmail"));
						this.renderOne(accessControlEntry);
				}.bind(this), 'ace' );

				this.accessControlEntryCollection
					.off('destroy', null, 'ace')
					.on("destroy", function(accessControlEntry) {
						// destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
						console.debug("Removing accessControlEntryRowView from display for email: " + accessControlEntry.get("userEmail"));
						this.removeOne(accessControlEntry);
				}.bind(this), 'ace');

				this.accessControlEntryCollection
					.off('reset', null, 'ace')
					.on("reset", function() {
						console.debug("Resetting/removing all accessControlEntryRowViews");
						this.accessControlEntryRowViews = {};
						this.$el.find('li').remove();
					}.bind(this), 'ace');

			},

			// renders all cells in a section and appends to our #[sortable] ul
			render: function() {
				console.debug("Rendering accessControlEntryRowViews: " + this.accessControlEntryCollection.length);
				this.$el.find('li').remove();
				this.accessControlEntryCollection.each(function(accessControlEntry) {
					this.renderOne(accessControlEntry);
				}.bind(this));
			},

			// adds one rendered accessControlEntryRowView to the end of the list
			renderOne: function(accessControlEntry) {
				var accessControlEntryRowView = new AccessControlEntryRowView(this.router, accessControlEntry, this.localizable);

				accessControlEntry
					.off('change', null, 'ace')
					.on("change", function(accessControlEntry) {

						console.debug("Updating the accessControlEntry row for: " + accessControlEntry.get("principal").fullName  );

                        accessControlEntryRowView.lockMenuForUpdate();

                        accessControlEntry
                            .save(null, {
                                success: function(response) {

                                    console.info("saved ace for: " + accessControlEntry.get("principal").fullName);
                                    accessControlEntryRowView.unlockMenu();

                                },
                                error: function(model, xhr, options) {

                                    console.error(sprintf("Oops, couldn't save ace. Status: %s %s", xhr.status, xhr.statusText) );
                                    accessControlEntryRowView.unlockMenu();

                                },
                                silent: true
                            });

					}, 'ace');

				this.$el.append(accessControlEntryRowView.render().el);
				this.accessControlEntryRowViews[accessControlEntry.id.toString()] = accessControlEntryRowView;
			},

			removeOne: function(accessControlEntry) {
				// look through accessControlEntryRowViews for a matching accessControlEntry
				var accessControlEntryRowView = this.accessControlEntryRowViews[accessControlEntry.id.toString()];
				if (accessControlEntryRowView) {
					accessControlEntryRowView.$el.fadeOut(400, function() {
						$(this).remove();
					});
					delete this.accessControlEntryRowViews[accessControlEntry.id.toString()];

				} 
				else {
					console.warn("Couldn't remove ACE with id: " + accessControlEntry.id);
				}
			}

		});

		return view;
	});