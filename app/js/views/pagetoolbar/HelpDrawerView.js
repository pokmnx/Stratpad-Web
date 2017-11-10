define(['Config', 'i18n!nls/PageToolbarView.i18n', 'Dictionary', 'backbone'],

    function(config, localizable, Dictionary) {

        var view = Backbone.View.extend({

            initialize: function(router, gLocalizable) {
                _.bindAll(this, "addHelpToPage", "hideHelp", "showHelp", "toggleHelp");

				this.localizable = new Dictionary(localizable, gLocalizable);
                this.router = router;

                var self = this;

				self.$body = $('body');
				self.$feedback = $('#feedback-form');

				self.$body
					.on(self.router.clicktype, '#showHelp', function(e) {

						e.preventDefault();
						e.stopPropagation();
						self.toggleHelp();

					})
					.on(self.router.clicktype, '#menuHelpMask, #helpMask', function () {

						self.toggleHelp();

					})
					.on(self.router.clicktype, '#contentHelp', function (e) {

						e.stopPropagation();

					});

				$(document)
					.on('pageNavUpdated', function () {

						self.hideHelp();

					});


            },

			addHelpToPage: function($parent) {

				// in your article.pageContent, we look for div.stratFileHelp, detach it, and reattach it in the proper place
				// <div class="stratFileHelp">
				// 	<iframe src="" data-url="help/write-your-plan/about-your-company/?iframe=1" width="100%" height="90%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
				// </div>
				// that might be in your handlebars, or in an html file which is being included
				// the data-url is on www.stratpad.com in our wordpress instance
				// the iframe=1 param removes all wordpress chrome

				$('#helpMask, #menuHelpMask, #contentHelp').remove();

				var self = this,
					$helpMask = $('<div id="helpMask" />'),
					$menuHelpMask = $('<aside id="menuHelpMask" />'),
					$helpContainer = $('<aside id="contentHelp" />'),

					$helpContent = $parent.find('.stratFileHelp').detach(),
					$header = $('#pageContent header');

				$helpContainer
					.append($helpContent);

				$helpContainer
					.insertAfter($header);

				$helpMask
					.insertAfter($header);

				$menuHelpMask
					.appendTo('#pageHeader');

				//cache these objects for help interactions

				self.$trigger = $header.find('#showHelp');
				self.$container = $helpContainer;
				self.$mask = $helpMask;
				self.$menuMask = $menuHelpMask;
				self.$toolbarLis = $('#pageToolbar li');
				self.$mainContent = $('#pageContent > .content');

			},

			hideHelp: function(){
				var self = this;
				if(self.$body.is('.helpOpen')){

					var $iframe = self.$container.find('iframe');

					self.$trigger
						.removeClass('open active')
						.find('span')
						.removeClass()
						.addClass('icon-misc-question-sign')
						.parent()
						.tooltipster('destroy')
						.tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250, content:self.localizable.get('showHelp')});

					// close help window

					self.$container
						.removeClass('active')
						.spin(false);

					$iframe
						.attr('src', '');

					self.$body
						.removeClass('helpOpen');

					self.$mask
						.fadeOut(400);

					self.$menuMask
						.fadeOut(400);

					// can show the feedback tab

                    if(!self.$body.is('.guideOpen'))
					    self.$feedback.show();

					// show other toolbar items

					self.$toolbarLis
						.not(self.$trigger)
                        .not('#showGuide')
						.each(function () {
							var $this = $(this);
							$this.css('display', $this.attr('data-display'));
						});

					if(self.$mainContent.parent().is('.nano.has-scrollbar'))
						self.$mainContent.css('right', '-17px');
				}
			},

			showHelp: function(){
				var self = this;
				var $iframe = self.$container.find('iframe');

				self.$trigger
					.addClass('open active')
					.find('span')
					.removeClass()
					.addClass('icon-misc-remove-sign')
					.parent()
					.tooltipster('destroy')
					.tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250, content:self.localizable.get('hideHelp')});

				// opens the help window (we have a transition on top)

				self.$container
					.addClass('active');

				// add a spinner

				self.$container
					.spin('large', 'grey');

				// add body class for css usage

				self.$body
					.addClass('helpOpen');

				self.$mask
					.fadeIn(400);

				self.$menuMask
					.fadeIn(400);

				// update iframe with appropriate data 0.5s

				$iframe
					.attr('src', sprintf('%s%s', config.wpUrl, $iframe.attr('data-url')));

				setTimeout(function() {

					self.$container
						.spin(false);

				}, 1000);

				// hide the feedback tab so it doesn't get in the way

				self.$feedback
					.hide();

				// hide other toolbar items

				self.$toolbarLis
					.not(self.$trigger)
                    .not('#showGuide')
					.hide();

				if(self.$mainContent.parent().is('.nano.has-scrollbar'))
					self.$mainContent.css('right', '0');

			},

			toggleHelp: function(){
				var self = this;

				if(self.$trigger.is('.open'))
					self.hideHelp();
				else
					self.showHelp();

			}

        });

        return view;

    });