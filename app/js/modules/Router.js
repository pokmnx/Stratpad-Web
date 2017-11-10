define(["i18n!nls/Global.i18n", 'Config', 'User', 'PageStructure', 'PageNavigationView', 'PageControlView', 'PageContentView',
		'PageMenubarView', 'ShareMenuView', 'ProfileMenuView', 'StratFileMenuView', 'InfoMenuView', 'StratFileManager', 'MessageManager',
		'FeedbackView', 'PageToolbarView', 'HelpDrawerView', 'StratBoardManager', 'WelcomeView', 'AcceptInviteDialog', 'UserPreferenceCollection', 
		'MyAccountManager', 'DispatchManager',

		'backboneCache', 'ipp', 'visibility',

		// we need r.js to know about these scripts so they can be "compiled" into one script - the dependency tracer can't figure them out because we require them dynamically
		// thus generally only applies to views
		'GenericForm', 'F1.AboutYourStrategy', 'DiscussionBase', 'Customers', 'KeyProblems', 'AddressProblems', 'Competitors', 'Management', 'SalesAndMarketing',
		'BizModel', 'Expansion', 'Aspiration', 'StrategyStatement', 'StrategyStatement', 'F4.ThemeDetail', 'ObjectivesDetail', 'ActivitiesDetail',
		'SearchDetailView', 'CommunityAgreementView',

		// these are views which the dependency tracer has no knowledge
		'views/community/lendersAndInvestors/BusinessBackgroundView', 'views/community/lendersAndInvestors/PersonalCreditHistoryView', 'views/community/lendersAndInvestors/MatchingLendersAndInvestorsView', 
		'views/community/matching/AccountantsView', 'views/community/matching/BookkeepersView', 
		'views/community/matching/ConsultantsView', 'views/community/matching/LawyersView', 'views/community/matching/CoachesView',
		'views/community/matching/MarketingFirmsView', 'views/community/matching/WebDesignersView', 'views/community/matching/GraphicDesignersView',
		'views/community/matching/SoftwareView',

		'views/community/myAccount/CompanyInfoAndBudgetView', 'views/community/myAccount/HowItWorksView',
		'views/community/myAccount/LocationView', 'views/community/myAccount/ReportView',

		'views/forms/financials/AccountsReceivableView', 'views/forms/financials/AccountsPayableView', 'views/forms/financials/OpeningBalancesView', 
		'views/forms/financials/LoansView', 'views/forms/financials/AssetsView', 'views/forms/financials/EquitiesView', 
		'views/forms/financials/InventoryView', 'views/forms/financials/EmployeeDeductionsView', 
		'views/forms/financials/SalesTaxView', 'views/forms/financials/IncomeTaxView',

		'views/reports/R1.StrategyMap', 'views/reports/R2.StrategyByMonth', 'views/reports/R3.StrategyByTheme',
		'views/reports/R4.ThemeByMonth', 'views/reports/R5.ThemeDetail', 'views/reports/R6.Gantt',
		'views/reports/R7.ProjectPlan', 'views/reports/R8.Agenda', 'views/reports/R9.BizPlanSummary', 'views/reports/R12.BizPlan', 'views/reports/Playbook',

		'views/stratboard/ChartPage', 'views/stratboard/StratBoardSummary'
	],

	function(gLocalizable, config, User, pageStructure, PageNavigationView, PageControlView, PageContentView,
		PageMenubarView, ShareMenuView, ProfileMenuView, StratFileMenuView, InfoMenuView, StratFileManager, MessageManager, 
        FeedbackView, PageToolbarView, HelpDrawerView, StratBoardManager, WelcomeView, AcceptInviteDialog, UserPreferenceCollection, 
        MyAccountManager, DispatchManager) {

		var Router = Backbone.Router.extend({

			routes: {
				"": "showStratPage",
				"nav/:section/:chapter/:page": "showStratPage", // eg stratweb.html#nav/1/1/3
				"ipp/disconnect": '_disconnnectIpp', // alias for nav/1/0/0, used by apps.intuit.com
				"ipp/welcome": '_welcomeIpp', // points to nav/0/0/0, used by apps.intuit.com
				"invite/:token": '_acceptInvite' // points to nav/0/0/0 and shows the accept dialog
			},

			// when we go through a backbone route (eg when pressing back) make sure emitPageChangeEvent=true
			execute: function(callback, args) {
				args.pop();
				args.push(true);
				if (callback) callback.apply(this, args);
			},

			// in minutes, idletime; server is set to 30 minutes
			clientSideTimeout: 30,

			initialize: function() {
				_.bindAll(this, "_scaleForIframe",
					"_showRefPage", "_maybeShowWelcome", "_showFormPage", '_showDiscussionPage', '_showFinancialsFormPage', '_showStratBoardPage',
					"_showReportPage", "_renderPage", "_trackPageview", "_setupAnalytics", "_sanitize", 
					"nextPage", "prevPage", "firstPage", "lastPage", "showStratPage", 'doLogout', 'pulse'
					);

				var self = this;

				// feel free to grab this user and make changes - fetch/save are to localstorage
				this.user = new User();
				this.user.fetch();

				// when going to grab user prefs, use this object
				// it is stored for 5 minutes, before going to grab a fresh version
				// add cache:true to the fetch options if you want to potentially use the cached
				// one key/value per UserPreference model
				// NB. need to use backboneCache instead of backbone (in your define statement), every time you are dealing with userPrefs
				// also, important to use the same model instance, when using backboneCache (ie it doesn't cache by id)
				this.userPrefs = new UserPreferenceCollection(null, {userId: this.user.get('id')});
				this.userPrefs.fetch({ 
					success: function(models) {
						// just want to remove the first page after we navigated there
						var firstPage = models.findWhere({ 'key': 'general.firstPage'});
						if (firstPage) firstPage.destroy({
							success: function(model) {
								console.debug("Destroyed userPref: " + JSON.stringify(model.toJSON()));
							}
						});
					}
				});

				if (_.isEmpty(this.user.attributes)) {
					console.warn("Not logged in!!");
					window.location = "index.html#login";
					return;					
				};

				// remove all .nano, and replace .nanoScroller, on OSX
		        var disableNano = Modernizr.mac; //&& jscd.browser == 'Chrome'
		        if (disableNano) {
		        	$.fn.nanoScroller = function(options) {
		        		console.debug('Disabling nanoscroller');
		        		$('.nano').css({'overflow-y': 'auto'}).removeClass('nano');
		        		// chrome needs an additional kick
		        		$('li.menuGroup').css({'display':'block'});

		        		// support scrollTo and scrollTop natively
		        		if (options && options.scrollTo && options.scrollTo.length) {
		        			console.debug('scroll to designated node');

		        			var $scrollTo = options.scrollTo;
		        			if ($(this).position().top != $scrollTo.position().top) {
								$(this).animate({
							        scrollTop: $scrollTo.position().top
							    }, 400);		        					        				
		        			};

		        		}
		        		else if (options && options.scrollTop != null) {
		        			console.debug('scroll to the top');

							$(this).animate({
						        scrollTop: options.scrollTop
						    }, 400);		        			

		        		}
		        	}
		        };

		        if (config.disableFinancials) {
		        	$('#pageNavigation #financials .enableFinancials').remove();
		        } else {
		        	$('#pageNavigation #financials .disabledFinancials').remove();
		        }

				// nice scrollbar for windows
				this.nanoScrollOpts = {
					iOSNativeScrolling: true
				};

				// also todo: we have lots of handled, but silent exceptions
				// catch unhandled exceptions - production only
				// window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
				//     console.error("Error occured: " + errorMsg);
				//     console.error("Probably want to reload the page at this point.");
				//     return false;
				// }

				var $html = $('html');

				// click/touch event consolidation
				this.clicktype = 'click';
				// also todo: revisit this when test hardware available.
//				if (window.navigator.pointerEnabled && $html.is('.no-chrome'))
//					this.clicktype = "pointerdown";
//				else if (window.navigator.msPointerEnabled && $html.is('.no-chrome'))
//					this.clicktype = "MSPointerDown";
				if('ontouchstart' in document.documentElement && ($html.is('.mobile') || $html.is('.ios')))
					this.clicktype = "touchstart";

				// universal analytics; every time we change a page, track via google analytics
				this._setupAnalytics(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

				this.stratFileManager = new StratFileManager(this);
				this.stratBoardManager = new StratBoardManager(this);
				if (config.channels) { 
					this.messageManager = new MessageManager(this); 
				} else {
					// disable the messageManager by overriding key methods
					console.warn('MessageManager disabled by config');
					this.messageManager = {
						sendPageUpdate: function() {},
						close: function() {
							var deferred = $.Deferred();
			                deferred.resolve();                
			                return deferred.promise();
						}
					}
				}
				this.myAccountManager = new MyAccountManager();
				this.dispatchManager = new DispatchManager();

				// keep our list of pages up to date
				pageStructure.initListeners(this.stratFileManager.themeCollection, this.stratFileManager.objectiveCollection, this.stratBoardManager.chartCollection);
				
				// hook up the next/prev
				this.pageControlView = new PageControlView(this);

				// the sidebar
				this.pageNavigationView = new PageNavigationView(this);

				// swiping on pagecontent
				this.pageContentView = new PageContentView(this);

				// the menus in the top right corner
				this.pageMenubarView = new PageMenubarView(this);
				this.shareMenuMenuView = new ShareMenuView(this, gLocalizable);
				this.profileMenuView = new ProfileMenuView(this, gLocalizable);
				this.stratFileMenuView = new StratFileMenuView(this, gLocalizable);
				this.infoMenuView = new InfoMenuView(this, gLocalizable);

				this.feedbackView = new FeedbackView(this);

				this.pageToolbarView = new PageToolbarView(this, gLocalizable);
				this.helpDrawerView = new HelpDrawerView(this, gLocalizable);
                this.welcomeView = new WelcomeView(this);

                // an array to store timeouts for sequential timeouts on welcome pages
                this.welcomeTimeouts = [];

				// idle time
				$.localStorage.setItem('lastUsedTime', new Date().getTime());
				setInterval(function() {$(document).trigger('asecond')}, 1000); // 1 second

				var resize_timer;
				$(window).resize(function() {
					clearTimeout(resize_timer);
					resize_timer = setTimeout(function() {
						self._scaleForIframe();
					}, 500);
				});

				// is msElapsed on the second indicated by seconds
				// eg. 5400,5 = true; 4900,5 = false; 5100,5 = true 
				var isElapsed = function(msElapsed, seconds) {
					var m = msElapsed%(seconds*1000);
					return m>=0 && m<1000 && msElapsed>1000;
				};

				// when the page loses focus, or you go to sleep
				$(document).on({

					// wake from sleep or page gains focus
					'show': function() {
						console.debug('The page gained visibility; the `show` event was triggered.');

						// check for timeout
						var now = new Date().getTime(); // ms
						var lastUsedTime = $.localStorage.getItem('lastUsedTime') * 1; // ms
						var diff = now - lastUsedTime;
						if (diff > self.clientSideTimeout * 60 * 1000) {
							console.debug("decided to logout: " + diff);
							self.doLogout({
								path: 'timeout'
							});
						}
						else {
							// restore mousemove
							$(document).on('mousemove.idletime', function(e) {
								$.localStorage.setItem('lastUsedTime', new Date().getTime());
							});							
						}

					},

					// page loses focus or we go to sleep, quit, etc
					'hide': function() {
						console.debug('The page lost visibility; the `hide` event was triggered.');
						
						// turn the mousemove off, so we don't set it before we have a chance to logout, eg after 24h of sleep
						$(document).off('mousemove.idletime');
					},

					'stratFileLoaded': function(e, stratFile) {
						var name = stratFile.get("name");
						document.title = sprintf("StratPad: %s", name);
						$('#stratFileTitle').text(name);

						// get rid of any warning messages - commented because this is removing the warning message - leaving a blank screen; 
						// might have been applicable in a different context, however
						// $('#pageContent .warning').remove();

						stratFile.off('change:name');
						stratFile.on('change:name', function(stratFile) {
							var name = stratFile.get("name");
							document.title = sprintf("StratPad: %s", _.escape(name));
							$('#stratFileTitle').text(name);
						});
					},

					// Zero the idle timer on mouse movement.
					'mousemove.idletime': function(e) {
						$.localStorage.setItem('lastUsedTime', new Date().getTime());
					},

					// Zero the idle timer on key pressed.
					'keypress': function(e) {
						$.localStorage.setItem('lastUsedTime', new Date().getTime());
					},

					// fire other events
					'asecond': function(e) {
						// have we been idle?
						var now = new Date().getTime(); // ms
						var lastUsedTime = $.localStorage.getItem('lastUsedTime') * 1; // ms

						// the number of ms we've been idle
						var diff = now - lastUsedTime;

						// send a checkSave event every 5s (that we've been idle)
						if (isElapsed(diff, 5)) {
							var secs = Math.floor(diff / 1000);
							$(document).trigger('checkSave', secs);
						};

						// send a generic idletime event every minute (that we've been idle)
						if (isElapsed(diff, 60)) {
							var mins = Math.floor(diff / 60000);
							$(document).trigger('idletime', mins);
						};

						// logout after 90 mins
						if (isElapsed(diff, self.clientSideTimeout * 60)) {
							self.doLogout({
								path: 'timeout'
							});
							return;
						};

						// pulse every 15 mins to keep server session alive while we are logged in client-side
						if (isElapsed(diff, 15 * 60)) {
							self.pulse();
						};
					}
				});
						
				// generic XSS routine to return safe, escaped strings as necessary, for rendering backbone models (use triple-stash)
				// handles empty and null/undefined values with an &nbsp; (that is not escaped)
				Handlebars.registerHelper('displayProp', function(model, key) {
				  if (model.has(key)) {
				    var val = model.get(key);
				    if (val != undefined && val != null && val != '') {
				      val = Handlebars.Utils.escapeExpression(val);
				      return new Handlebars.SafeString(val);
				    }
				  }
				  return new Handlebars.SafeString('&nbsp;');
				});

			},

			pulse: function() {
				$.ajax({
						url: config.serverBaseUrl + "/pulse",
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
					.success(function(jqXHR) {
						console.debug('Pulse to keep server-session alive.');
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						console.error("%s: %s", textStatus, errorThrown);
					});				
			},

			doLogout: function(opts) {
				// we also have several places in the app which check for user data in localstorage and redirect to index.html if not found - should be ok, but might want to revisit
				// also, in main, before we start, we will additionally check with the server for auth, and write localstorage as needed

				// invalidate the session and go to login screen with 'path', unless overridden with 'windowLocation'
				opts = opts || {};
				var self = this;

				this.messageManager.close()
					.then(function() {

						console.debug('sending logout');

						$.ajax({
							url: config.serverBaseUrl + "/logOut",
							type: "GET",
							dataType: 'json',
							contentType: "application/json; charset=utf-8"
						})
							.fail(function(jqXHR, textStatus, errorThrown) {
								console.error("Tried to logout but failed.");
								console.error("%s: %s", textStatus, errorThrown);
							})
							.always(function() {
								self.user.destroy();
								intuit.ipp.anywhere.logout(  function(){ 
									console.debug('ready to redirect to login');
									window.location = opts.windowLocation ? opts.windowLocation : "index.html#login" + (opts.path ? '/'+opts.path : '');
								});
							});

					});

			},

			_disconnnectIpp: function() {
				console.debug('Disconnect requested from apps.intuit.com');

				// F1
				var url = pageStructure.urlForCoords(pageStructure.SECTION_FORM, pageStructure.CHAPTER_ABOUT, 0);

				// update the address bar, the page, and the history
				this.navigate(url, {
					// yes, actually load up this new page here
					trigger: true,

					// we don't want this in the browser history, so do replace
					replace: true
				});

                vex.dialog.confirm({
                    className: 'vex-theme-plain',
                    message: gLocalizable.ippDisconnected,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: gLocalizable.btn_ok }) ]
                });

			},

			_welcomeIpp: function() {
				console.debug('Try/buy from apps.intuit.com');

				// Welcome
				var url = pageStructure.urlForCoords(pageStructure.SECTION_REFERENCE, pageStructure.CHAPTER_WELCOME, 0);

				// update the address bar, the page, and the history
				this.navigate(url, {
					// yes, actually load up this new page here
					trigger: true,

					// we don't want this in the browser history, so do replace
					replace: true
				});

				// inform for the welcome video
				var welcomeIppKey = sprintf('%s-%s', 'welcomeIpp', this.user.get('id')),
                    welcomeVideoKey = sprintf('%s-%s', 'welcomeVideo', this.user.get('id'));

				$.localStorage.setItem(welcomeIppKey, '1');

				var self = this,
					welcomeQBOMarkup = Handlebars.templates['dialogs/WelcomeQBO'];

				vex.dialog.open({
					className: 'vex-theme-plain welcomeQBO',
					message: sprintf('%s %s!', gLocalizable.welcome_video, self.user.get('firstname')),
					input: welcomeQBOMarkup,
					buttons:[
						$.extend({}, vex.dialog.buttons.YES, {text: gLocalizable.btn_walkthrough}),
						$.extend({}, vex.dialog.buttons.NO, {
                            text: gLocalizable.btn_chart,
                            click: function($vexContent) {
                                $vexContent.data().vex.value = 'chart';
                                return vex.close($vexContent.data().vex.id);
                            }
                        }),
						$.extend({}, vex.dialog.buttons.NO, {
                            text: gLocalizable.btn_welcome,
                            click: function($vexContent) {
                                $vexContent.data().vex.value = 'video';
                                return vex.close($vexContent.data().vex.id);
                            }
                        })
					],
					afterClose: function() {
						self.pageMenubarView.dismissMenuWithBodyClick = true;
					},
                    callback: function(data) {
                        if(data === 'video'){
                            self._showWelcomeVideo(welcomeVideoKey);

                        } else if(data === 'chart'){

							// First chart
							var url = pageStructure.urlForCoords(pageStructure.SECTION_STRATBOARD, 1, 0);

							// update the address bar, the page, and the history
							self.emitPageChangeEvent = true;
							self.navigate(url, {
								// yes, actually load up this new page here
								trigger: true,

								// we do want this in the browser history, so don't replace
								replace: false
							});
                            
                        } else {
                            // todo: pause welcome tour animations if this modal was kicked in and launch them here instead?

                        }
                    }
				});

			},

			_acceptInvite: function(token) {
				console.debug('Accept: ' + token);

				// Welcome
				var url = pageStructure.urlForCoords(pageStructure.SECTION_REFERENCE, pageStructure.CHAPTER_WELCOME, 0);

				// update the address bar, the page, and the history
				this.navigate(url, {
					// yes, actually load up this new page here
					trigger: true,

					// we don't want this in the browser history, so do replace
					replace: true
				});

				$(document).bind("stratFileLoaded.acceptInvite", function(e, stratFile) {
					// one of the items in the collection should have the sharedStratFileId, but need to wait
					var sharedStratFile = this.stratFileManager.stratFileCollection.find(function(stratFile) {
						if (stratFile.has('accessControlEntry')) {
							var ace = stratFile.get('accessControlEntry');
							return (!ace.accepted && ace.acceptToken == token);
						};
					});

					if (sharedStratFile) {
						// show the dialog
						var acceptInviteDialog = new AcceptInviteDialog(this);
						acceptInviteDialog.showSharedStratfileDialog(sharedStratFile.get('id'));					
					} 
					else {
						console.warn('Trying to show accept invite dialog with an unknown stratFile token: ' + token);
					}

					$(document).unbind('stratFileLoaded.acceptInvite');

				}.bind(this));

			},


			_scaleForIframe: function() {

				if ($('body').is('.location-section_business101') && $('#pageContent iframe').length) {

					var offset = 117,
						$pageContent = $('#pageContent');

					if ($pageContent.is('.initialized'))
						offset = 157;
					else
						$pageContent.addClass('initialized');

					if ($(window).width() < 1170)
						offset = offset + 40;

					var height = $pageContent.height() - offset,
						$pageArticle = $pageContent.find('article'),
						$pageIframe = $pageContent.find('iframe');

					$pageArticle.height(height);

					$pageIframe.height(height - 30);

				}

			},

            _showWelcomeVideo: function(welcomeVideoKey){

                var self = this,
                    videoMarkup = Handlebars.templates['dialogs/WelcomeVideo'];

                vex.dialog.open({
                    className: 'vex-theme-plain welcomeVideo',
                    message: sprintf('%s %s!', gLocalizable.welcome_video, self.user.get('firstname')),
                    input: videoMarkup,
                    buttons:[$.extend({}, vex.dialog.buttons.YES, {text: gLocalizable.btn_thanks})],
                    afterClose: function() {
                        self.pageMenubarView.dismissMenuWithBodyClick = true;
                        $.localStorage.setItem(welcomeVideoKey, '1');
                    }

                });

            },

			_maybeShowWelcome: function(){

				// have we seen the video?
				var welcomeVideoKey = sprintf('%s-%s', 'welcomeVideo', this.user.get('id')),
					hasWatchedVal = $.localStorage.getItem(welcomeVideoKey),
					hasWatched = (hasWatched == 1);

				// check if try/buy from intuit
				var welcomeIppKey = sprintf('%s-%s', 'welcomeIpp', this.user.get('id')),
					isWelcomeIppVal = $.localStorage.getItem(welcomeIppKey),
					isWelcomeIpp = !isWelcomeIpp || isWelcomeIpp !== '1';

				// show a different dialog if we show QBO welcome
				if(!(isWelcomeIpp || hasWatched)){

                    var self = this;

					setTimeout(function(){

                        self._showWelcomeVideo(welcomeVideoKey);

					}, 1000);

				}

			},

			_setBodyClass: function() {

				$('body')
					.removeClass (function (index, css) {
						return (css.match (/\blocation-\S+/g) || []).join(' ');
					})
					.addClass(sprintf('%s %s %s',
						'location-' + pageStructure.getSectionName(this.section).toLowerCase(),
						'location-' + pageStructure.getChapterName(this.section, this.chapter).toLowerCase(),
						'location-' + pageStructure.getPageName(this.section, this.chapter, this.page)).toLowerCase()
					);

			},

			prepareStratPageForReport: function() {
				this._sanitize(this.section, this.chapter, 0);
				this._setBodyClass();

				var url = pageStructure.urlForCoords(this.section, this.chapter, this.page);

				// update the address bar and the history
				this.navigate(url, {
					// just update the address bar - don't actually load up this new page here
					trigger: false,

					// we don't want this in the browser history, so do replace
					replace: true
				});

			},

			showStratPage: function(s, c, p, emitPageChangeEvent) {
				// this is called as we change (or reload) pages - it is not called when switching stratfiles (just the load event is emitted)

				// showStratPage is one of the backbone routes, so it won't emitPageChangeEvent, but we need it to do so (but not twice)
				// showStratPage is also a public method, called from other navigation ui's
				// has repercussions in BaseReport and switching stratfiles

				// also, if we supply a link like #nav/1/0/0 inline, we _won't_ get an emitPageChangeEvent, because we hit the backbone route
				// so typically, set router.emitPageChangeEvent to true, and then the show[...]Page will set it back to false
				// also binding to the click, and using router.navigate is preferable
				// and lastly, router.navigate will not reload the same page you're on (call showStratPage directly)
				if (emitPageChangeEvent === true) {
					this.emitPageChangeEvent = true;
				};

				// note that we can't check for secure cookies
				// also, this happens separately from initialize, so we need to check
				if (_.isEmpty(this.user.attributes)) {
					console.warn("Not logged in!!");
					window.location = "index.html#login";
					return;					
				};

				// it's a little late before it actually gets removed, so do it here
				$('.location-section_community #pageContent .content #communityRequirementsDialog').remove();				

				// show welcome video unless they've closed on that machine.
				this._maybeShowWelcome();

				// get rid of any warning messages
				$('#pageContent .warning').remove();

				// normalizes and makes sure these are valid numbers; sets correlating properties on this
				this._sanitize(s, c, p);

				// sets body class for section and chapter specific css styling.
				this._setBodyClass();

				// update the sidebar
				var $selected = this.pageNavigationView.selectPage(this.section, this.chapter, this.page);

				// grab a model if necessary
				// don't need to pass the stratfile model, better to use events in the view
				var model;
				if (this.section == pageStructure.SECTION_FORM && (this.chapter == pageStructure.CHAPTER_THEMES || this.chapter == pageStructure.CHAPTER_OBJECTIVES) && this.stratFileManager.themeCollection) {
					var themeId = $selected.attr('model');
					model = this.stratFileManager.themeCollection.get(themeId);
				} else if (this.section == pageStructure.SECTION_FORM && this.chapter == pageStructure.CHAPTER_ACTIVITIES && this.stratFileManager.objectiveCollection) {
					var objectiveId = $selected.attr('model');
					model = this.stratFileManager.objectiveCollection.get(objectiveId);
				} else if (this.section == pageStructure.SECTION_STRATBOARD) {
					var chartId = $selected.attr('model');
					model = this.stratBoardManager.chartCollection.get(chartId);
				}

				// todo: I think we need to define a generic page namespace
				// all listeners attached by reports or forms or charts go in the page ns
				// every time we switch a page, we unbind all the .page listeners
				// rather than having this.form or this.report, we can have this.page
				// refactor this.page to this.pageNumber?

				// there are some listeners we want to keep around, on navbar, for example
				// might be better to organize by component - eg .navbar

				// reset listeners in the GenericForm
				$(document).unbind('.genericForm');

				// remove old stratfileloaded, etc listeners
				$(document).unbind('.financials');
				$(document).unbind(".charts");

				// remove listeners in the .reports namespace
				$(document).unbind('.reports');

                // remove project guide nav intercept when moving page to page in forms
                $('#pageControl').off('.projectGuide');
				
				// R1 is listening to themes and objectives
                this.stratFileManager.themeCollection.off("sync", null, 'StrategyMap');
                this.stratFileManager.objectiveCollection.off("sync", null, 'StrategyMap');


				// might need to slide toggle nav sections to show the selected item (ie when using next/prev)
				$(document).trigger("pageNavUpdated", $selected);

				// show the content page
				if (this.section == pageStructure.SECTION_REFERENCE || this.section == pageStructure.SECTION_BUSINESS101) {
					this._showRefPage();
				} else if (this.section == pageStructure.SECTION_FORM && this.chapter == pageStructure.CHAPTER_FINANCIAL_EDITS) {
					this._showFinancialsFormPage();
				} else if (this.section == pageStructure.SECTION_FORM && this.chapter == pageStructure.CHAPTER_DISCUSSION) {
					this._showDiscussionPage();
				} else if (this.section == pageStructure.SECTION_FORM) {
					// we may have themes, objectives or activity models to deliver
					this._showFormPage(model);					
				} else if (this.section == pageStructure.SECTION_REPORT || this.section == pageStructure.SECTION_FINANCIALS || this.section == pageStructure.SECTION_PLAN) {
					this._showReportPage();
				} else if (this.section == pageStructure.SECTION_STRATBOARD) {
					this._showStratBoardPage(model);
				} else if (this.section == pageStructure.SECTION_COMMUNITY) {
					if (this.chapter == pageStructure.CHAPTER_MY_ACCOUNT || this.chapter == pageStructure.CHAPTER_HOW_CONNECT_WORKS) {
						this._showMyAccountPage();					
					} else {
						// todo: migrate whole section to use new rendering architecture
						var path = this.chapter == pageStructure.CHAPTER_LENDERS_AND_INVESTORS ? 'community/lendersAndInvestors/%s' : 'community/matching/%s';
						this._showCommunityPage(path);						
					}
				} else {
					console.warn('Need to specify what page to show.');
				}

				// test for iframe and perform layout changes if detected
				this._scaleForIframe();

				// figure out the new hash route
				var url = pageStructure.urlForCoords(this.section, this.chapter, this.page);

				// store the side navbar state
				this.pageNavigationView.storeNavState(this.section, this.chapter, this.page);

				// update the address bar and the history
				this.navigate(url, {
					// just update the address bar - don't actually load up this new page here
					trigger: false,

					// we want this in the browser history, so don't replace
					replace: false
				});

			},

			_setupAnalytics: function(i, s, o, g, r, a, m) {
				// most of our navigations have trigger turned off, so use this event
				if (config.analytics) {
					$(document).bind('pageNavUpdated', this._trackPageview);
				};

				// global object
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function() {
					(i[r].q = i[r].q || []).push(arguments);
				}, i[r].l = 1 * new Date();
				
				// add script tag
				a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);

				// init our account
				ga('create', 'UA-3611832-10', 'stratpad.com');

			},

			_trackPageview: function() {
				// https://developers.google.com/analytics/devguides/collection/analyticsjs/
				var url = pageStructure.urlForCoords(this.section, this.chapter, this.page);

				ga('send', 'pageview', {
					'page': url,
					'hitCallback': function() {
						console.debug('analytics.js done sending data: ' + url);
					}
				});
			},

			// show an https:// page in an iframe, or a (protected) static page from our rest server embedded (eg college/business101), or an image
			_showRefPage: function() {
				var $pageContentWrap = $('#pageContent'),
					$pageContent = $pageContentWrap.find('.content'),
					self = this;

	            // let shared users know what page we're on
	            this.messageManager.sendPageUpdate();  

	            // often, we use anchors with hrefs = #nav/6/5/0 inline, which won't produce an emitPageChangeEvent when clicked, and thus things like
	            // the welcome animations won't clean up, so clean them up; try not to use inline anchors!! bind to the click instead
                $('.spshake').removeClass('spAnimated spshake infinite');
                $('#newStratfile').tooltipster('hide');

				// figure out an ajax URL to load the content
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);

				// this is a WordPress embedded page
				if (filename.match(/^https?:\/\//i)) {
					// so hook everything up with a fairly standard iframe

					var heading = $("#pageNavigation span[class='active']").text();
					var html = '<header><hgroup><h1></h1><h2>&nbsp;</h2></hgroup></header><article class="group"><iframe src="" width="100%" height="100%" frameborder="0"></iframe></article>';
					$pageContent.html(html);
					$pageContent.find('hgroup h1').html(heading);
					$pageContent.find('iframe').attr('src', filename);

					// no help here

					// update the pageSlider (and headerPager)
					this.pageControlView.pageSliderView.attachHeaderPager();
					this.pageControlView.pageSliderView.updatePageNumber(this.page);

					// show nice scrollbars if needed
					$pageContentWrap.nanoScroller(this.nanoScrollOpts);

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				} 

				// any image URL - lets us mock up pages using screenshots
				else if (filename.match(/.png|.jpg$/)) {
					$pageContent.html(sprintf('<img src="%s" width="%s">', filename, $pageContent.width()));
				}

				// load text at the URL via ajax, and place the body text into pageContent
				else {

					var url;
					if (filename.match(/^\//)) {
						// local - welcome pages, strategy for entrepreneurs and small business toolkit
						// these are localized
						url = sprintf(filename, config.lang + '.lproj');
					} else {
						// in eg jstratpad/src/main/webapp/WEB-INF/static/en.lproj/...		
						// not actually using this now, but the resource is avialable if needed	
						url = sprintf('%s/static/%s.lproj/%s', config.serverBaseUrl, config.lang, filename);
					}

					// couldn't get text plugin to work x-domain - insists on its little <script> tag trick, and config overrides not working, so just use ajax
					$.ajax({
						url: url,
						type: "GET",
						dataType: 'html'
					})
						.done(function(response, textStatus, jqXHR) {

							// the ref html
							var content = "Error";
							var bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
							var matches = response.match(bodyRegExp);
							if (matches) {
								content = matches[1];
							} else {
								console.error("Couldn't fetch %s properly.", filename);
							}

							var html = this._fixImages(content);
							html = this._fixLinks(html);
							$pageContent.html(html);

							// in the welcome pages (in jstratpad), we have actions/hrefs on many of the buttons that need to do something reasonable
							$pageContent.find("a[href^='action']").on(self.clicktype, function(e) {
								return false;
							});

							// no help for ref pages

							// update the pageSlider (and headerPager)
							this.pageControlView.pageSliderView.attachHeaderPager();
							this.pageControlView.pageSliderView.updatePageNumber(this.page);

							$pageContentWrap.nanoScroller(this.nanoScrollOpts);

							if (this.emitPageChangeEvent) {
								$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
								this.emitPageChangeEvent = false;
							}

                            this.welcomeView.animateWelcome();

						}.bind(this))
						.fail(function(jqXHR, textStatus, errorThrown) {
							console.error("%s: %s", textStatus, errorThrown);
						});

				};

			},

			_showDiscussionPage: function() {
				// eg. views/forms/BizModel.js
				var path = pageStructure.getFileName(this.section, this.chapter, this.page);

				require([path], function(DiscussionPage) {

					// create the form
					this.pageView = null;
					this.pageView = new DiscussionPage(this);
					this.pageView.renderPage();

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},

			_showFormPage: function(model) {
				// model can be stratfile, theme, etc

				// eg. F1.AboutYourStrategy, F4
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);
				if (this.page < 0) {
					// need to bail out - this is usually because we are reloading a page that we don't know about yet
					// ie. we don't know about our theme pages until we go and fetch them
					console.error("Trying to load page which doesn't exist yet. Bailing out.");
					$('<div class="warning"></div>').css({
						margin: '100px auto',
						width: '500px'
					}).text(gLocalizable.WARN_NO_PAGE).appendTo($('#pageContent .content'));
					return;
				}

				var localizableUrl = sprintf('i18n!nls/%s.i18n', filename);

				require([localizableUrl || {}, filename], function(localizable, FormView) {

					// NB when switching stratfiles, we don't come through this route (get a stratfileloaded event)
					_.defaults(localizable, gLocalizable);

					// compile the handlebars template
					this._renderPage('forms/' + filename, localizable)

					// create the form
					this.form = null;
					if (model) {
						// todo: would actually be better to let these views grab the relevant models, like we do for F1-F3 and financials
						this.form = new FormView(this, model, localizable);
					} else {
						// F1-F3 don't need a model
						this.form = new FormView(this, localizable);						
					}

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},

			_showFinancialsFormPage: function() {
				// eg. AccountsReceivableView.js
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);

				var localizableUrl = 'i18n!nls/FinancialForms.i18n';

				// eg. views/forms/F1.AboutYourStrategy
				var jsUrl = sprintf('views/forms/financials/%s', filename);

				require([localizableUrl || {}, jsUrl], function(localizable, FinancialForm) {

					_.defaults(localizable, gLocalizable);
					this._renderPage('forms/financials/' + filename, localizable)

					// create the form
					this.form = null;
					this.form = new FinancialForm(this, localizable);

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},			

			_showReportPage: function() {
				// eg. BalanceSheetDetail
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);
				if (this.page < 0) {
					// need to bail out - this is usually because we are reloading a page that we don't know about yet
					// ie. we don't know about our theme pages until we go and fetch them, or how many report pages are in a report
					console.error("Trying to load page which doesn't exist yet. Bailing out.");
					$('<div class="warning"></div>').css({
						margin: '100px auto',
						width: '500px'
					}).text(gLocalizable.WARN_NO_PAGE).appendTo($('#pageContent .content'));
					return;
				}

				// todo: would like to have a common method on pages: getLocalizable ; then, each page can grab it's localizable files, extend properly and return here for rendering
				// we also shouldn't pollute gLocalizable - ie always use a copy when constructing
				// that way we can easily have common i18n files among multiple pages, and pages can control what they load
				// get rid of the automatic i18n loading here
				var localizableUrl = sprintf('i18n!nls/%s.i18n', filename);
				if (this.section == pageStructure.SECTION_FINANCIALS) {
					// re-use strings between details and summary - eg IncomeStatement.i18n.js
					var f = filename.replace(/Summary|Detail/, '');
					localizableUrl = sprintf('i18n!nls/%s.i18n', f);
				};

				// eg. views/reports/R2.StrategyByMonth
				var jsUrl = sprintf('views/reports/%s', filename);

				require([localizableUrl, jsUrl], function(localizable, Report) {

					// copy all of glocalizable to localizable, but have localizable take precedence
					// don't want to fill up glocalizable with tons of keys?
					_.defaults(localizable || {}, gLocalizable);
					this._renderPage('reports/' + filename, localizable);

					this.report = null;

					// create the report
					this.report = new Report(this, localizable);

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},

			_showStratBoardPage: function(chartModel) {
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);

				// if page > 0 then we have a chart, otherwise it's a list of charts
				// StratBoardManager for loading charts
				// on each chart page, we should do a refresh on the backbone chart before display
				// we will also need to get measurements for each chart, in /stratfiles/id/chart, in order to do the minicharts
				// load charting js late - it is big

				if (this.page < 0) {
					// show the summary page
					this.page = 0;
					this.chapter = 0;
				}

				var localizableUrl = sprintf('i18n!nls/%s.i18n', filename);
				var jsUrl = sprintf('views/stratboard/%s', filename);

				require([localizableUrl, jsUrl], function(localizable, ChartPage) {

					// copy all of glocalizable to localizable, but have localizable take precedence
					_.defaults(localizable || {}, gLocalizable);
					this._renderPage('stratboard/' + filename, localizable);

					this.report = null;

					// create the report
					if (this.chapter == 0) {
						this.report = new ChartPage(this, localizable);						
					} else {
						this.report = new ChartPage(this, chartModel, localizable);
					}

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},

			_showCommunityPage: function(path) {
				// eg. BusinessBackground.js
				var filename = pageStructure.getFileName(this.section, this.chapter, this.page);

				var localizableUrl = 'i18n!nls/Community.i18n';

				// eg. views/forms/F1.AboutYourStrategy
				var jsUrl = sprintf('views/' + path, filename);

				require([localizableUrl || {}, jsUrl], function(localizable, CommunityForm) {

					_.defaults(localizable, gLocalizable);
					this._renderPage(sprintf(path, filename), localizable)

					// create the form
					this.form = null;
					this.form = new CommunityForm(this, localizable);

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},

			// this is closer to how our pages should be built, with IOC
			_showMyAccountPage: function() {
				// eg. views/myCommunityAccount/HowItWorks
				var path = pageStructure.getFileName(this.section, this.chapter, this.page);

				require([path], function(CommunityPage) {

					// create the form
					this.pageView = null;
					this.pageView = new CommunityPage(this);
					this.pageView.renderPage();

					if (this.emitPageChangeEvent) {
						$(document).trigger("pageChanged", this.stratFileManager.stratFileId);
						this.emitPageChangeEvent = false;
					};

				}.bind(this));

			},


			// applied to all dynamic pages (ie not ref pages)
			_renderPage: function(template, localizable) {
				// grab the handlebars template
				var compiledTemplate = Handlebars.templates[template];
				var html = compiledTemplate(localizable);
				var $pageContentWrap = $('#pageContent');
				var $pageContent = $pageContentWrap.find('.content');
				$pageContent.empty();
				$pageContent.append(html);

				// add toolbar
				this.pageToolbarView.addToolbarToPage();

				// affix help
				this.helpDrawerView.addHelpToPage($pageContent);

				// update the pageSlider (and headerPager)
				this.pageControlView.pageSliderView.attachHeaderPager();
				this.pageControlView.pageSliderView.updatePageNumber(this.page);

				$pageContentWrap.nanoScroller(this.nanoScrollOpts);
			},

			nextPage: function() {
				var nextPageKey = pageStructure.nextPageKey(this.section, this.chapter, this.page);
				var parts = nextPageKey.split(',');
				this.showStratPage(parts[0], parts[1], parts[2], true);
			},

			prevPage: function() {
				var prevPageKey = pageStructure.prevPageKey(this.section, this.chapter, this.page);
				var parts = prevPageKey.split(',');
				this.showStratPage(parts[0], parts[1], parts[2], true);
			},

			firstPage: function() {
				var firstPageKey = pageStructure.firstPageKeyInChapter(this.section, this.chapter);
				var parts = firstPageKey.split(',');
				this.showStratPage(parts[0], parts[1], parts[2], true);
			},

			lastPage: function() {
				var lastPageKey = pageStructure.lastPageKeyInChapter(this.section, this.chapter);
				var parts = lastPageKey.split(',');
				this.showStratPage(parts[0], parts[1], parts[2], true);
			},

			_sanitize: function(s, c, p) {
				// can come as ints, or strings from our pageKey '002'
				// make sure s,c,p are within limits and then assign to properties
				// in other words after this, s, c, and p will always resolve to a page that exists

				var parts = pageStructure.sanitizedPageComponents(s, c, p);
				this.section = parts[0];
				this.chapter = parts[1];
				this.page = parts[2];
			},

			_fixImages: function(content) {
				// look for img tags, prepend "images/" to the value of the src attribute
				var s = "";
				var startIdx = 0;
				var re = new RegExp('<img.+src="([^"]+)"[^/]*/>', "igm"),
					m;
				while (m = re.exec(content)) {
					s += content.substring(startIdx, m.index);

					var imgTag = m[0].replace(m[1], sprintf("%s/images/reference/%s.lproj/", config.serverBaseUrl, config.lang) + m[1]);
					s += imgTag;
					startIdx = m.index + m[0].length;
				}
				s += content.substr(startIdx);

				return s;

			},

			_fixLinks: function(content) {
				// these were all links to other parts of the reference
				// all in each TOC
				// they have a custom url scheme. eg. toolkit://toolkit02.htm
				// that need to become #nav/0/3/1, for instance

				var s = "";
				var startIdx = 0;
				var re = new RegExp('<a +href="([^:]+)://([^"]+)"[^>]*>', "igm"),
					m;
				while (m = re.exec(content)) {
					s += content.substring(startIdx, m.index);

					var protocol = m[1];
					var pageName = m[2];

					if (protocol == "toolkit" || protocol == "onstrategy") {
						var replacement = sprintf("<a href='%s'>", pageStructure.navForPageRef(pageName));
						s += replacement;
					} else {
						// don't do anything for now; can attach something via jquery instead
						s += m[0];
					}
					startIdx = m.index + m[0].length;
				}
				s += content.substr(startIdx);

				return s;
			},

			showSaveMessage: function (msg, isError) {

				var msgClass = (isError) ? 'saveError' : 'saveSuccess';

				$('<div id="allChangesSaved" class="' + msgClass + '"><i class="icon-ui-checkmark-circle"></i><span></span></div>')
					.appendTo($('#contentWrapper #pageControl'))
					.stop(true, true)
					.fadeIn("fast", function () {
						$(this).delay(2500).fadeOut("slow", function () {
							$(this).remove();
						});
					})
					.find('span')
					.text(msg);
			}


		});

		return Router;
	});