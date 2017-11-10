define(['backbone'],
	function() {

		var view = Backbone.View.extend({

			// will surround the handlebar template with a li
			tagName: 'li',
			className: 'note-item',

			initialize: function(router, projectNoteItem, localizable) {
				_.bindAll(this, 'render');
				this.router = router;
				this.projectNoteItem = projectNoteItem;
				this.localizable = localizable;
				this.stratFile = router.stratFileManager.currentStratFile();
			},

			render: function() {

				// properties are simply absent if they were not set

				var compiledTemplate = Handlebars.templates['forms/themes/ProjectNoteItemRow'],
                    noteJson = this.projectNoteItem.toJSON(),
                    total = this.projectNoteItem.total(),
                    context = _.extend(
                    	noteJson, 
                    	this.localizable.all(), 
                    	{
                    		nrTotal: total != null ? total.toFixed(2) : null, 
                    		readonly: this.stratFile.isReadOnly('PLAN'),
                    		hasWrite: this.stratFile.hasWriteAccess('PLAN')
                    	});

				var html = compiledTemplate(context);

				this.$el.html(html); // xss safe
				this.$el.data('projectNoteItemId', this.projectNoteItem.id);

				return this;
			},

			updateTotal: function() {
				var total = this.projectNoteItem.total();
				this.$el.find('.nrTotal').text(total != null ? total.toFixed(2) : null);
			}

		});

		return view;
	});