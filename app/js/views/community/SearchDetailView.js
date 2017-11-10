define(['Config', 'i18n!nls/Community.i18n', 'Dictionary', 'Config', 'ServiceProvider', 'CommunityTracking', 'PageStructure', 'backbone'],

    function(config, localizable, Dictionary, config, ServiceProvider, CommunityTracking, pageStructure) {

        var view = Backbone.View.extend({

	        el: '#pageContent',

            initialize: function(router, category) {
                _.bindAll(this, '_load', '_introduceLender', "_addSearchDetailToPage", "hideSearchDetail", "showSearchDetail");

				this.localizable = new Dictionary(localizable);
                this.router = router;
                this.category = category;

	            this.$body = $('body');
	            this.$feedback = $('#feedback-form');

	            // add the html to the page
	            this._addSearchDetailToPage();

	            this.$body
	            	.off('click.communitySearchDetail')
					.on('click.communitySearchDetail', '#hideSearchDetail', this.hideSearchDetail)
					.on('click.communitySearchDetail', '#introduceLender', this._introduceLender)

				// if we changed the page, hide the search detail
				$(document)
					.on('pageNavUpdated', this.hideSearchDetail);

            },

			_load: function() {
				var self = this,
					$searchDetail = this.$el.find('aside#communitySearchDetail');

				// if we click on a doc before intro - show vex asking if you want an intro
				$searchDetail
					.off('click.communitySearchDetail')
					.on('click.communitySearchDetail', '.documents a.disabled', function(e) { 
						e.preventDefault(); 
						e.stopPropagation();

                        vex.dialog.confirm({
                            className: 'vex-theme-plain',
                            message: self.localizable.get('matching_request_intro'),
                            buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localizable.get('YES') }),
                                      $.extend({}, vex.dialog.buttons.NO, { text: self.localizable.get('NO') }) ],
                            callback: function(value) {
                                if (value) {
                                	self._introduceLender();
                                };
                                return false;
                            }
                        });
					});				

				// render detail
				var searchDetailTemplate = Handlebars.templates['community/SearchDetailView'],
					context = _.extend(
						this.serviceProvider.toJSON(), 
						{
							logoUrl: sprintf("%s/financial-institutions/%s/logo", config.gcsBaseUrl, self.serviceProvider.get("docsFolderName")),
                            certifications: _.map(self.serviceProvider.get('certifications'), self.serviceProvider.certificationLogoUrl.bind(self.serviceProvider)),
                            accreditationLogos: _.map(self.serviceProvider.get('accreditationLogos'), self.serviceProvider.accreditationLogoUrl.bind(self.serviceProvider)),
							isLender: this.category == 'Bank',
							zipPostal: $.stratweb.formatZipPostal(this.serviceProvider.get('zipPostal')),
							welcomeMessage: new Handlebars.SafeString($.stratweb.escape(self.serviceProvider.get('welcomeMessage'), ['b', 'i', 'u', 'p', 'li'])),
							approved: this.serviceProvider.status == 'premium' || this.serviceProvider.status == 'approved'
						},
						this.localizable.all()
					),
					$content = $(searchDetailTemplate(context));
				this.$container.empty().append($content);
				this.$container[0].scrollTop = 0;

				// if no logo, use a generic image
                $content.find('li.logo img').on('error', function(e) {
	                $(this).attr('src', 'images/community/office.png');
	            });

				// contextual content based on whether or not the intro has been sent
				if ( this.serviceProvider.get('invitationSent') ) {
					// show step 2 instructions
					var $lenderIntro = $searchDetail.find('.lenderIntroduction');
					$lenderIntro.find('.part1').removeClass('active');
					$lenderIntro.find('.part2').show().addClass('active');
				}	            

            	var $docsList = $searchDetail.find('.documents ul');
            	$docsList.empty();

				// load docs
                $.ajax({
                    url: config.serverBaseUrl + sprintf('/serviceProviders/%s/docs', this.serviceProvider.get('id')),
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {

                	// skip logo and accreditations
                	var accreditations = self.serviceProvider.get('accreditationLogos');
					var docs = _.filter(response.data.docs, function(docName) {
						return docName.indexOf('logo') < 0 && $.inArray(docName, accreditations) < 0; 
					});

					// the rest must be docs, so display them
					_.each(docs, function(doc) {
						var folderName = self.serviceProvider.get("docsFolderName");
						var docName = doc.replace(folderName + '/', "");
						var url = sprintf("%s/financial-institutions/%s/%s", config.gcsBaseUrl, folderName, encodeURI(docName))

						$docsList.append($('<li>').append($('<a>').attr('href', url).attr('target', '_blank').addClass('disabled').text(docName)));
					});

					// append bizplan
					var bizplanurl = pageStructure.urlForCoords(pageStructure.SECTION_PLAN, pageStructure.CHAPTER_BIZ_PLAN, 0);
					var $li = $('<li>').append($('<a>').attr('href', bizplanurl).addClass('disabled').text(self.localizable.get('matching_business_plan_doc')));
					$docsList.append($li);

					// unlock docs
					if ( self.serviceProvider.get('invitationSent') ) {
						$docsList.find('a.disabled').removeClass('disabled');
					}
                    
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                })
                .always(function() {
                	$docsList.closest('.documents').spin(false);
                });

				// do a community tracking each time we open, regardless if invite already sent
				new CommunityTracking({
					serviceProviderId: this.serviceProvider.get('id'),
					stratFileId: this.router.stratFileManager.stratFileId,
					action: 'click'})
				.save();

			},

			_introduceLender: function() {
				var self = this,
					$lenderIntro = self.$el.find('.lenderIntroduction');

				$lenderIntro.spin();

				// ask for introduction to FI - these can be custom intros, implemented server-side (avoid CORS problems, resource-fetching and state updates)
                $.ajax({
                    url: config.serverBaseUrl + sprintf('/serviceProviders/%s/stratfiles/%s/intro?category=%s', 
                    	this.serviceProvider.get('id'), this.router.stratFileManager.stratFileId, this.category),
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {

                	// never saved (calculated on the fly by server), but needed to keep state if user opens up again
                	self.serviceProvider.set('invitationSent', true);
                    
					// show step 2 instructions
					$lenderIntro.find('.part1').removeClass('active');
					$lenderIntro.find('.part2').show().addClass('active');

					// update search detail button in underlying list
					self.$el.find(sprintf('.searchResult[data-fid=%s] .learnMore', self.serviceProvider.get('id')))
						.addClass('orange-btn')
						.text(self.localizable.get('matching_btn_intro_request_sent'));

					// unlock docs
					self.$el.find('.documents a.disabled').removeClass('disabled');
                    
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                })
                .always(function() {
                	$lenderIntro.spin(false);
                });

			},

	        _addSearchDetailToPage: function() {

	        	// sort of a skeleton
		        var compiledTemplate = Handlebars.templates['community/SearchDetailView'],
			        html = compiledTemplate(this.localizable.all()),
			        $guideContainer = $('<aside id="communitySearchDetail" />'),
			        $header = $('#pageContent header');

		        $guideContainer
			        .append(html)
			        .insertAfter($header);

		        this.$container = $guideContainer;
		        this.$toolbarLis = $('#pageToolbar li');

			},

	        hideSearchDetail: function(){

	        	var self = this;

	        	this.serviceProvider = null;

	            setTimeout(function(){
			        self.$container.hide();
		        }, 600);

		        // close help window

		        this.$container
			        .removeClass('active');

		        // can show the guide tab

		        this.$feedback.show();

		        // reshow the search results
		        this.$el.find('.searchResults').show();

	        },

	        showSearchDetail: function(serviceProvider){

	        	var self=this;

	        	this.serviceProvider = serviceProvider;

	        	this._load();

		        // opens the guide window (we have a css transition on left)
		        this.$container.show();
		        setTimeout(function(){
			        self.$container.addClass('active');
		        }, 100);

		        // hide the feedback tab so it doesn't get in the way
		        this.$feedback.hide();

		        // when animation finishes
		        this.$container.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
	                // search results can be much longer than search detail, and screws up scrolling
		        	self.$el.find('.searchResults').hide();

		        	// otherwise it calculates the wrong positions
		        	self.$el.find('.documents').spin('small');

		        	self.$container.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
		        });

			},

        });

        return view;

    });