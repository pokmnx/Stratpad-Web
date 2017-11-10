define(["i18n!nls/StratFileMenuView.i18n", 'AccessControlEntry', 'EditionManager', 'backbone'],
	function (localized, AccessControlEntry, EditionManager) {

		var view = Backbone.View.extend({

			tagName  : 'article',
			className: 'stratFileItem',

			initialize: function (router, stratFile) {
				_.bindAll(this, "render");
				this.router = router;
				this.stratFile = stratFile;
			},

			render: function () {

				var context = this.stratFile.toJSON();

                var ace = !(this.stratFile.isOwner()) ? new AccessControlEntry(this.stratFile.get('accessControlEntry')) : false;
                var unAcceptedShare = (ace && !ace.get('accepted'));
                var pendingSharer = (unAcceptedShare) ? sprintf(localized.pendingSharer, ace.get('owner').fullName) : localized.pendingSharer;
                var isShared = !this.stratFile.isOwner() && !this.stratFile.isSampleFile();

				_.extend(context, localized, {
					'isSampleFile': this.stratFile.isSampleFile(),
                    'isOwner': this.stratFile.isOwner(),
                    'unAcceptedShare': unAcceptedShare,
                    'pendingSharer': pendingSharer,
                    'isShared': isShared,
					'date': sprintf("%s %s", localized.edited, moment(this.stratFile.get("modificationDate")).fromNow())
				});

				var compiledTemplate = Handlebars.templates['menu/StratFileCellView'];
				var html = compiledTemplate(context);
				this.$el
                    .attr('data-id', this.stratFile.id)
                    .html(html) // xss safe
                    .find('.stratFileName')
                    .text(context.name)
                    .next()
                    .text(context.companyName);

                // add class to el for pending shared stratfiles

                if(unAcceptedShare){
                    this.$el
                        .addClass('pendingAcceptance');
                }

				return this;
			},

			select: function () {
				this.$el.addClass('active');
			}

		});

		return view;
	});