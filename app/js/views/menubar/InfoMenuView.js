define(['PageStructure', 'Config', 'backbone'],

    function(pageStructure, config) {

        var view = Backbone.View.extend({

            el: 'li#navInfo',

            initialize: function(router, gLocalizable) {

                this._localizable = gLocalizable;
                this.router = router;

				var self = this;

                var context = _.extend(this._localizable, {
                	year: new Date().getFullYear(),
                	version: config.version,
                	buildDate: config.buildDate,
                	sha1: config.sha1
                });

                var compiledTemplate = Handlebars.templates['menu/InfoMenuView'];
				var html = compiledTemplate(context);

				this.$el.find('.content').append(html);

				// toggle the sha1 with the buildDate
				this.$el
					.on(router.clicktype, '.buildDetails', function() {
						$(this).find('span:nth-child(1)').toggle();
						$(this).find('span:nth-child(2)').toggle();
					})
					.on(router.clicktype, '.trigger', function() {
						self.$el.find('.nano').nanoScroller();
					});

				this.$el
					.on(router.clicktype, '.showWelcomeVideo', function() {

						var videoMarkup = Handlebars.templates['dialogs/WelcomeVideo'],
							user = $.parseJSON($.localStorage.getItem('user'));

						vex.dialog.open({
							className: 'vex-theme-plain welcomeVideo',
							message: sprintf('%s %s!', gLocalizable.welcome_video, user.firstname),
							input: videoMarkup,
							buttons:[$.extend({}, vex.dialog.buttons.YES, {text: gLocalizable.btn_thanks})],
							afterClose: function() {
								self.pageMenubarView.dismissMenuWithBodyClick = true;
							}

						});

					});

            }

        });

        return view;
    });