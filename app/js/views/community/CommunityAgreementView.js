define(['Config', 'i18n!nls/Community.i18n', 'Dictionary', 'Config', 'UserPreference', 'backboneCache'],

    function(config, localizable, Dictionary, config, UserPreference) {

        var view = Backbone.View.extend({

	        el: '#pageContent',

            initialize: function(router) {
                _.bindAll(this, "_addAgreementToPage", "_hideAgreement", "_showAgreement", "_toggleAgreement",
                 "_updateAgreement", "_understandAgreement", "maybeShowAgreement");

				this.localizable = new Dictionary(localizable);
                this.router = router;

	            this.$body = $('body');
	            this.$feedback = $('#feedback-form');

	            // add the html to the page
	            this._addAgreementToPage();

	            // remove all old listeners in .communityAgreement NS
	            this.$body
		            .off('.communityAgreement');

		        // hook up controls, including toolbar button
	            this.$body
					.on('click.communityAgreement', '#showCommunityAgreement, #hideAgreement', this._toggleAgreement) // #menuHelpMask, #helpMask, 
					.on('click.communityAgreement', '#communityAgreement', function (e) {e.stopPropagation();})
					.on('click.communityAgreement', '#understandAgreement', this._understandAgreement)
					.on('change.communityAgreement', '#showAgreementAlways', this._updateAgreement);

				$(document)
					.on('pageNavUpdated', this._hideAgreement);
            },

	        _addAgreementToPage: function() {

		        console.log('Adding community agreement to page.');

		        var compiledTemplate = Handlebars.templates['community/CommunityAgreementView'],
			        html = compiledTemplate(this.localizable.all()),
			        $guideContainer = $('<aside id="communityAgreement" />'),
			        $header = $('#pageContent header');

		        $guideContainer
			        .append(html)
			        .insertAfter($header);

		        this.$trigger = $header.find('#showCommunityAgreement');
		        this.$container = $guideContainer;
		        // this.$mask = $('#helpMask');
		        // this.$menuMask = $('#menuHelpMask');
		        this.$toolbarLis = $('#pageToolbar li');
		        this.$mainContent = $('#pageContent > .content');
		        this.$article = $('#pageContent article');

			},

			_understandAgreement: function() {
				this._hideAgreement();
			},

	        _hideAgreement: function(){

		        this.agreementOpen = false;

	            this.$article.show();

		        this.$trigger
			        .removeClass('open active');

		        // close help window

		        this.$container
			        .removeClass('active');

		        // can show the guide tab

		        this.$feedback
			        .show();


	        },

	        _showAgreement: function(){

		        this.agreementOpen = true;

		        var self = this;

		        this.$trigger
			        .addClass('open active');

		        // opens the guide window (we have a transition on top)

		        this.$container
			        .addClass('active');

		        // hide the feedback tab so it doesn't get in the way

		        this.$feedback
			        .hide();

		        setTimeout(function(){
			        self.$article.hide();
		        }, 600);
	        },

			_toggleAgreement: function(e){

				e.preventDefault();
				e.stopPropagation();

				if(this.$trigger.is('.open'))
					this._hideAgreement();
				else {
					this._showAgreement();

					// update checkbox
					var shouldShowAgreement = this._getShouldShowAgreement();
					var $showAgreementAlways = $('#showAgreementAlways');
					$showAgreementAlways.prop('checked', shouldShowAgreement);
				}
			},

			_updateAgreement: function(e) {
				e.preventDefault();
				e.stopPropagation();

				var shouldShowAgreement = $(e.target).is(':checked');

				router.userPrefs.fetch({ cache: true, expires: 5*60 });
				var showAgreementPref = router.userPrefs.findWhere({ key: 'community.showAgreement'});
				showAgreementPref.set("value", shouldShowAgreement);
				showAgreementPref.save(null, {
					success: function(model) {
						console.debug("Saved pref: " + JSON.stringify(model.toJSON()) );
					}, 
	                error: function(model, xhr, options) {
	                    console.error("Oops, couldn't save pref: " + JSON.stringify(model.toJSON()) );
	                }
				});
			},

			maybeShowAgreement: function() {
				var shouldShowAgreement = this._getShouldShowAgreement();
				var $showAgreementAlways = $('#showAgreementAlways');

				$showAgreementAlways.prop('checked', shouldShowAgreement);
				if (shouldShowAgreement) {
					this._showAgreement();
				};
			},

			_getShouldShowAgreement: function() {
				router.userPrefs.fetch({ cache: true, expires: 5*60 });
				var showAgreementPref = router.userPrefs.findWhere({ key: 'community.showAgreement'});
				if (showAgreementPref) {
					return showAgreementPref.get('value') == 'true';
				} else {
					showAgreementPref = new UserPreference({key: 'community.showAgreement', value: true, userId: router.user.get('id')});
					showAgreementPref.save(null, {
						success: function(model) {
							router.userPrefs.add(model);
							console.debug("Saved pref: " + JSON.stringify(model.toJSON()) );
						}, 
		                error: function(model, xhr, options) {
		                    console.error("Oops, couldn't save pref: " + JSON.stringify(model.toJSON()) );
		                }
					});
					return true;
				}
			}

        });

        return view;

    });