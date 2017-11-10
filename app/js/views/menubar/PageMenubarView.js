// generic functionality for the menus in the top menubar
define(['Config', 'i18n!nls/PageMenubarView.i18n', 'Dictionary', 'EditionManager', 'UpgradeMenuView', 'backbone'],

	function(config, localizable, Dictionary, EditionManager, UpgradeMenuView) {

		var view = Backbone.View.extend({

			el: '#navMenubar',

        	// the thing is, if we show a vex dialog from a menu, then clicking in the dialog will dismiss the menu, which we don't want
        	// so turn it off temporarily when we show a dialog on top of a menu
			dismissMenuWithBodyClick: true,

			initialize: function(router, gLocalizable) {

				_.bindAll(this, 'setHeightForMenu', 'closeMenu', 'logout', '_maybeShowBlueDotMenu');

				this.router = router;
				this.localizable = new Dictionary(localizable, gLocalizable);
				this.$contentWrapper = $('#contentWrapper');
                this.$blueDotMenu = $('#blueDotMenu');
				this.$signout = this.$el.parent().find('#stratPadSignout');
				this.userData = $.parseJSON($.localStorage.getItem('user'));
				this.upgradeMenuView = new UpgradeMenuView(this.router, gLocalizable);

				var compiledTemplate = Handlebars.templates['menu/PageMenubarView'],
					html = compiledTemplate(this.localizable.all());

				this.$el.append(html);

				this.$signout
					.text(this.localizable.get('signout'))
					.show()
					.on(this.router.clicktype, this.logout);

				// pertinent elements
				var self = this,
					$body = $('body'),
					$navMenus = $("#navMenubar .menu"),
					$navLi = $("#navMenubar > li"),
					$menuTriggers = self.$el.find('.tooltip'),
					resize_timer;

				// // free trial message
				// if (EditionManager.isFreeEdition()) {
				// 	var getMessage = function(date, trialEndDate) {
				// 	    var remaining = trialEndDate.diff(date, 'days');
				// 		if (trialEndDate.isAfter(date)) {
				// 			var daysMessage = remaining > 1 ? self.localizable.get('days') : self.localizable.get('day');
				// 			return remaining ? sprintf(self.localizable.get('trialRemainingReminder'), remaining, daysMessage) : self.localizable.get('lastTrialDayReminder');
				// 		} else {
				// 			return self.localizable.get('trialExpired');
				// 		}
				// 	};
				// 	var showDaysRemainingInTrial = function(e) {
				// 		var $el = self.$el.find('#navFreeTrial');
				// 		$el.show();
				// 		$el.find('span').text(getMessage(moment(), EditionManager.trialEndDate()));
				// 	};
				// 	$(document).on('idletime', showDaysRemainingInTrial);
				// 	showDaysRemainingInTrial();
				// } else {
				// 	this.$el.find('#navFreeTrial').hide();
				// }

                // each time a stratfile is loaded, test whether to show the intuit blue dot menu
                // also listen for connect/disconnect on F1

                $(document)
                    .bind('stratFileLoaded', function(e){self._maybeShowBlueDotMenu(e, false)})
                    .bind('ippAuthStatus', function(e, statusUpdated){self._maybeShowBlueDotMenu(e, statusUpdated);});

				// when clicking outside the menu, dismiss the menu
				$body
					.on(router.clicktype, function(){
						if (this.dismissMenuWithBodyClick) {
							$navLi.removeClass('active');
							$body.removeClass('navsettings-active');
						}
					}.bind(this));

				// store the original height of each menu in an attr, so it can be used to re-open the menu
				$navMenus
					.each(function() {
						var $this = $(this);
						$this.attr('data-height', $this.height())
					});

                // tooltips for triggers

                $menuTriggers.tooltipster({position:'bottom', touchDevices:false, delay:150, fixedWidth: 250, content:null,offsetY:'-15px'});
                $('#newStratfile').tooltipster({position:'bottom', touchDevices:false, delay:150, fixedWidth: 250, content:null,offsetY:'0px'});

				// handler for when we click on a menuTitle
				self.$el
					.on(router.clicktype, ".trigger", function( e ){
						e.stopPropagation();
						var $this = $(this),
							$thisMenu = $this.parent(),
							$otherMenus = $navLi.not($thisMenu);

                        $this.tooltipster('hide');

						$otherMenus
							.removeClass('active');

						if( $thisMenu.is('.active') ) {
							$thisMenu.removeClass('active');
							$body.removeClass('navsettings-active');


						} else {
							$thisMenu.addClass('active');
							$body.addClass('navsettings-active');

							self.$el.trigger('menuOpened', $this.parent());

							self.setHeightForMenu( $this.next(), self );
						}
					})
					.on(router.clicktype, ".menu", function( e ){
						e.stopPropagation();
					});
					// .on(router.clicktype, "#navFreeTrial", function(e) {
					// 	self.upgradeMenuView.showUpgradeDialog(self.userData.ipnProductCode, false);
					// });

				// if we resize the window, adjust the height of the menus
                $(window).resize(function() {
					clearTimeout(resize_timer);
					resize_timer = setTimeout(function(){
						self.setHeightForMenu( $navLi.find('.menu'), self );
					}, 500);
                }.bind(this));

			},

            _maybeShowBlueDotMenu: function(e, statusUpdated){

            	if (!config.qbo) {
            		this.$blueDotMenu.hide();
            		return;
            	};

                var self = this;

                // check if the loaded stratfile is connected and display the intuit menu if so.

                // first hide as catch all on every stratfile load

                this.$blueDotMenu.hide();

                if(e.type === 'stratFileLoaded'){
                    $.ajax({
                        url: config.serverBaseUrl + "/ipp/v3/isAuthenticated?stratFileId=" + self.router.stratFileManager.stratFileId,
                        type: "GET",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        global: false // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
                    })
                        .done(function(response) {

                            (response.isAuthenticated) ? self.$blueDotMenu.show() : self.$blueDotMenu.hide();

                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                        	if (jqXHR.status == 401) {
                        		// reasonable
	                            console.warn("Not authorized, therefore no blue dot.");
                        	} else {
	                            console.warn("%s: %s", textStatus, errorThrown);
                        	}

                            self.$blueDotMenu.hide();


                        });
                } else {

                    (statusUpdated) ? self.$blueDotMenu.show() : self.$blueDotMenu.hide();

                }

                intuit.ipp.anywhere.setup({
                    menuProxy: config.serverBaseUrl + '/ipp/v3/bluedot?stratFileId=' + self.router.stratFileManager.stratFileId,
                    grantUrl: config.serverBaseUrl + '/ipp/v3/requestToken?stratFileId=' + self.router.stratFileManager.stratFileId
                });

            },

			logout: function(e) {

				e.preventDefault();

				this.router.doLogout();

			},
			
			setHeightForMenu: function( $target, self ) {

				var $stratFilesList = $('#stratFiles');
				var $stratfileHeader = $('#navStratFile header');
				$stratFilesList.nanoScroller(router.nanoScrollOpts);

				var con_height = self.$contentWrapper.outerHeight(),
					this_height = $target.height() + 2,
					o_height = $target.attr('data-height'),
					sh_height = $stratfileHeader.height(),
					stratfileMenu = $target.parent().is('#navStratFile');

				if( this_height >= con_height || o_height >= con_height ) {
					$target.height(con_height - 62);
					if(stratfileMenu){
						var s_height = con_height - (62 + sh_height);
						$stratFilesList.height( s_height);
					}
				} else {
					$target.height(o_height);
					if(stratfileMenu){
						$stratFilesList.height(o_height - sh_height);
					}
				}
			},

            closeMenu: function($el) {
            	// we expect the li#menuid eg li#navStratFile
                $el.removeClass('active');
                $('body').removeClass('navsettings-active');
                $el
                    .find('.navSub')
                    .removeClass('nsOpen')
                    .width(0);
            }


		});

		return view;
	});