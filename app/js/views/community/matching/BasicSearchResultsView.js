// super class for all lenders and non-lenders search pages
define(['GenericForm', 'SearchDetailView', 'ServiceProviderSearchCollection', 'ServiceProvider', 'UserServiceProvider', 'PageStructure', 'FormDialog', 'Config', 'CommunityTracking'],

function(GenericForm, SearchDetailView, ServiceProviderSearchCollection, ServiceProvider, UserServiceProvider, pageStructure, FormDialog, config, CommunityTracking) {

    var view = GenericForm.extend({

        // how many parts do we need to load before turning off spinner? override as necessary
        numParts: 1,

        initialize: function(router, localizable) {
            GenericForm.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", "linkToMyAccount", 'referFriend', 'suggestCategory', 'gotoConnectSignup', 'gotoCompanyBasics', 'inviteProfessional', 'recordClick', 'claimServiceProvider');    

            // learning more about a search result
            this.searchDetailView = new SearchDetailView(this.router, this.category);

            // will need this later, when switching stratfiles, in concert with special treatment for readonly stratfiles
            var key = this.category.toLowerCase() + '_matching_title';
            this.title = this.localizable.get(key);  

            $('#pageContent')
                .off('click.community')
                .on('click.community', 'li#linkToMyAccount', this.linkToMyAccount)
                .on('click.community', 'li#referFriend', this.referFriend)
                .on('click.community', 'li#suggestCategory', this.suggestCategory);

            // toolbar item link content
            this.router.pageToolbarView.$pageToolbar.find('#linkToMyAccount .text').text(this.localizable.get(this.category.toLowerCase() + '_services_link'));

            // toolbar item refer content
            var key = this.localizable.get("referFriendText");
            var referText = sprintf(key, this.localizable.get(this.category.toLowerCase() + '_article'));
            this.router.pageToolbarView.$pageToolbar.find('#referFriend .text.refer').text(referText);

        },

        load: function() {
            GenericForm.prototype.load.call(this);

            $('#pageContent').nanoScroller({scrollTop: 0});          
            
            var self = this;

            // start spinning (we stop when all finishedLoadingPart events are received, determined by subclass)
            var opts = _.extend({top: '10px'}, $.fn.spin.presets.default);
            this.$el.spin(opts);

            var partCtr = 0;
            this.$el
                .off(".community")
                .on("finishedLoadingPart.community", function(event) {
                    if (++partCtr == self.numParts) {
                        self.$el.spin(false);
                    };
                });            

            // clear out any old matches
            var $searchResults = self.$el.find('.searchResults ul');
            $searchResults.empty();
            $searchResults
                .off('click')
                .on('click', '.searchResult.unapproved', this.recordClick);

            // reset message
            self.$el.find('.instructions').text(self.localizable.get('matching_instructions_wait'));

            // close details
            this.searchDetailView.hideSearchDetail();

            // if this is a read-only stratfile, don't bother with search
            var stratFile = this.router.stratFileManager.currentStratFile();
            if (stratFile.isSampleFile()) {

                self.$el.find('.instructions').text(this.localizable.get('matching_readonly'));

                self.$el.trigger('finishedLoadingPart');

            } else {

                // figure out if we should show the 'claimed' button in each search result
                if (!router.user.has('hasCompletedConnect')) {
                    var serviceProvider = new UserServiceProvider({userId: router.user.get('id')});
                    serviceProvider.fetch({
                        success: function(model) {
                            var progress = serviceProvider.progress(router.user);

                            // update user (also updates underlying router.user, and any listeners are notified)
                            router.user.set('hasCompletedConnect', progress.progress == 1);
                            router.user.save();

                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load UserServiceProvider. Status: %s %s", xhr.status, xhr.statusText) );
                        }
                    });            
                };

                // fetch matches
                var searchResults = new ServiceProviderSearchCollection(null, {stratFileId: stratFile.get('id'), category: this.category});
                searchResults.fetch({
                    success: function(models) {

                        // just some basic sanity checks, mostly for removing test results
                        // maintain order from server
                        var fis = models.filter(function(fi) {
                            return !$.stratweb.isBlank(fi.get('name')) && fi.get('status') != 'test';
                        }); 
                        fis = _.uniq(fis, false, function(fi) {
                            return fi.get('name');
                        });

                        // search results message with count
                        var services = self.localizable.get(self.category.toLowerCase() + '_services');
                        var msgFormat = fis.length == 1 ? self.localizable.get('matching_single'): self.localizable.get('matching_multiple');
                        var message = fis.length == 1 ? sprintf(msgFormat, services) : sprintf(msgFormat, fis.length, services);

                        // also needs to be if stratfile has no location
                        if (fis.length == 0 && self.category != 'Bank') {
                            if (stratFile.has('city')) {
                                message += sprintf(self.localizable.get('matching_zero'), self.localizable.get(self.category.toLowerCase() + '_article').toLowerCase());
                            } else {
                                message += self.localizable.get('matching_no_location');
                            }
                        }
                        var $instructions = self.$el.find('.instructions');
                        $instructions.html(message); // xss safe
                        $instructions
                            .on(self.router.clicktype, '#gotoConnectSignup', self.gotoConnectSignup) // tell the user to sign up
                            .on(self.router.clicktype, '#gotoCompanyBasics', self.gotoCompanyBasics) // tell the user to enter a location
                            .on(self.router.clicktype, '#inviteProfessional', self.inviteProfessional); // invite someone to fill up the results

                        // each match; NB. the server has ordered the results
                        var searchResultTemplate = Handlebars.templates['community/SearchResult'];
                        _.each(fis, function(serviceProvider) {
                            var status = serviceProvider.get('status');
                            if (status == 'approved' || status == 'premium') {
                                // non-scraped data has certain requirements
                                // might want to check on required fields too; server is only requiring name, bidPerLead and indirectly a location (city or zip), categories
                                // all: city, name, bidPerLead, servicesDescription, /*monthlyAdBudget*/, welcomeMessage, address1, city, zipPostal, categories, termsAccepted, payment
                                // this leaves possible empty bidPerLead, address1, city, zipPostal, termsAccepted, payment
                                // payment is synonymous with status, and if missing will be disabled
                                // bidPerLead is now priceForInvitation
                                if ( $.stratweb.isBlank(serviceProvider.get('servicesDescription')) || 
                                        $.stratweb.isBlank(serviceProvider.get('welcomeMessage')) || 
                                        $.stratweb.isBlank(serviceProvider.get('address1')) || 
                                        !serviceProvider.get('termsAccepted')
                                    ) {
                                    console.debug('Unapproving due to missing/filtered data: ' + serviceProvider.get('name') + ' ' + serviceProvider.get('id'));
                                    console.debug('servicesDescription: ' + serviceProvider.get('servicesDescription'));
                                    console.debug('welcomeMessage: ' + serviceProvider.get('welcomeMessage'));
                                    console.debug('address1: ' + serviceProvider.get('address1'));
                                    console.debug('termsAccepted: ' + serviceProvider.get('termsAccepted'));

                                    status = 'unapproved';
                                };
                            };

                            var servicesDescription = $.stratweb.isBlank(serviceProvider.get('servicesDescription')) ? '&nbsp;' : serviceProvider.get('servicesDescription').replace(/\\n|\n/g, '<br>');
                            var context = _.extend(
                                serviceProvider.toJSON(), 
                                {
                                    servicesDescription: new Handlebars.SafeString($.stratweb.escape(serviceProvider.get('servicesDescription'), ['b', 'i', 'u'])),
                                    logoUrl: sprintf("%s/financial-institutions/%s/logo", config.gcsBaseUrl, serviceProvider.get("docsFolderName")),
                                    certifications: _.map(serviceProvider.get('certifications'), serviceProvider.certificationLogoUrl.bind(serviceProvider)),
                                    accreditationLogos: _.map(serviceProvider.get('accreditationLogos'), serviceProvider.accreditationLogoUrl.bind(serviceProvider)),
                                    // todo: Learn More should always be on, but we need to add some server-side logic to notify the ServiceProvider when their budget is empty and people are asking for intros
                                    // for now, only enable if they have sufficient budget; unapproved intros *will* be handled server-side
                                    learnMore: ((status == 'approved' || status == 'premium') && serviceProvider.get('hasInvitesAvailable')) || status == 'unapproved',
                                    zipPostal: $.stratweb.formatZipPostal(serviceProvider.get('zipPostal')),

                                    // we'll show the claim button if the user has not completed another ServiceProvider (and not paid for another ServiceProvider)
                                    claimServiceProvider: ( status == 'unapproved' // claimable
                                        && !serviceProvider.has('userId') // nobody else has claimed it
                                        && !router.user.get('hasCompletedConnect') // you didn't already fill out connect for another service provider
                                        && !router.user.get('hasPaidConnect') // you didn't already pay for connect for another service provider
                                        ) 
                                },
                                self.localizable.all()
                                );

                            // cleanups
                            context.address1 = $.stratweb.strip($.trim(context.address1), ',');
                            context.address2 = $.stratweb.strip($.trim(context.address2), ',');
                            if (context.address1 == context.address2) context.address2 = null;

                            // hook up learn more and claim buttons
                            var $content = $(searchResultTemplate(context));
                            $content
                                .on(self.router.clicktype, '.learnMore', function(e) {
                                    e.preventDefault(); e.stopPropagation();
                                    self.searchDetailView.showSearchDetail(serviceProvider);
                                })
                                .on(self.router.clicktype, '.claimServiceProvider', self.claimServiceProvider);


                            // if no logo, use a default one instead
                            $content.find('li.logo img').on('error', function(e) {
                                $(this).attr('src', 'images/community/office.png');
                            });

                            // add classes to affect how rows get drawn, based on status of lender
                            $content.addClass(status); // approved, unapproved, premium, test

                            // tooltip if unapproved
                            if (status == 'unapproved') {
                                $content.prop('title', self.localizable.get('matching_not_signed_up'));
                                $content.tooltipster({position: 'top-left', maxWidth: 400});
                            };
                            
                            $searchResults.append( $content );
                        });

                        self.$el.trigger('finishedLoadingPart');
                    },
                    error: function(model, xhr, options) {
                        console.error("Oops couldn't fetch matching serviceProviders");
                        self.$el.find('.instructions').text(self.localizable.get('matching_error'));
                        self.$el.trigger('finishedLoadingPart');
                    }
                });

            }

        },

        // are you an eg accountant? link
        linkToMyAccount: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(e.target),
                self = this;

            if ($this.data('template') !== 'cached') {

                $this.tooltipster({
                    autoClose: true,
                    content: '',
                    contentCloning: false,
                    positionTracker: true,
                    contentAsHTML: true,

                    // on open
                    functionBefore: function(origin, continueTooltip) {

                        if (origin.data('template') !== 'cached') {

                            var template = Handlebars.templates['community/matching/ConnectLinkDialog'],
                                context = _.defaults(
                                    {
                                        'service': self.localizable.get(self.category.toLowerCase() + '_services')
                                    }, 
                                    self.localizable.all()),
                                $content = $(template(context));

                                $content.find('article a').on(router.clicktype, self.gotoConnectSignup);

                            origin.tooltipster('content', $content).data('template', 'cached');

                            continueTooltip();

                        } else {
                            continueTooltip();
                        }
                    },
                    interactive: true,
                    offsetY: '0px',
                    maxWidth: 500,
                    onlyOne: true,
                    theme: 'tooltipster-stratpad tooltip-small tooltip-important tooltip-form-dialog',
                    trigger: 'click'
                });

                $this.tooltipster('show');
            }

        },

        referFriend: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var articleAndCategory = this.localizable.get(this.category.toLowerCase() + '_article'), // "an Accountant"
                categoryLabel = articleAndCategory.replace(/an?\s+/, '').toLowerCase(), // "accountant"
                context = {
                    'serviceProviderCategoryLongLabel': articleAndCategory, 
                    'referAFriendTitle': this.localizable.get('referAFriendTitle'),
                    'serviceProviderCategoryLabel': categoryLabel
                },
                dialog = new FormDialog(this.router, 'community/matching/ReferFriendDialog', context);            

            dialog.showFormDialog(e, dialog.doReferFriend, this.category);
            
        },

        suggestCategory: function(e) {
            e.preventDefault();
            e.stopPropagation();            
            var dialog = new FormDialog(this.router, 'community/SuggestCategoryDialog', {});
            dialog.showFormDialog(e, dialog.doSuggestCategory);
        },

        gotoConnectSignup: function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();                
            };
            this.router.pageMenubarView.closeMenu(this.$el);
            var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0);
            this.router.emitPageChangeEvent = true;
            this.router.navigate(url, {
                trigger: true,
                replace: false
            });
        },

        gotoCompanyBasics: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.router.pageMenubarView.closeMenu(this.$el);
            var url = pageStructure.urlForCoords(pageStructure.SECTION_FORM, pageStructure.CHAPTER_ABOUT, 0);
            this.router.emitPageChangeEvent = true;
            this.router.navigate(url, {
                trigger: true,
                replace: false
            });
        },

        inviteProfessional: function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#pageToolbar #referFriend').click();
        },

        recordClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            // record clicks on searchresults, approved or not
            new CommunityTracking({
                serviceProviderId: $(e.target).closest('.searchResult').data('fid'),
                stratFileId: this.router.stratFileManager.stratFileId,
                action: 'click'})
            .save();
        },

        claimServiceProvider: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this,
                $btn = $(e.target),
                companyName = $btn.data('company-name'),
                serviceProviderId = $btn.data('service-provider-id');

            // show a tooltip, which explains what is about to happen
            var $vexContent = vex.dialog.open({
                className: 'vex-theme-plain',
                message: companyName,
                input: self.localizable.get('matching_dialog_msg_claim_service_provider'),
                buttons: [$.extend({}, vex.dialog.buttons.YES, { 
                            text: self.localizable.get('matching_dialog_btn_claim_service_provider')
                            }),
                          $.extend({}, vex.dialog.buttons.NO, { text: self.localizable.get('btn_cancel') }) ],                                        
                onSubmit: function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var opts = _.extend({left: '130px'}, $.fn.spin.presets.small),
                        $btns = $vexContent.find('.vex-dialog-buttons');
                    $btns.spin(opts);

                    // disable buttons
                    $btns.find('input').attr('disabled', true);

                    $.ajax({
                        url: sprintf("%s/serviceProviders/%s/link", config.serverBaseUrl, serviceProviderId),
                        type: "GET",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(response, textStatus, jqXHR) {

                            // switch buttons
                            $btns.find('input').css('display', 'none');
                            var $ok = $('<input type="button">').val(self.localizable.get('btn_ok')).addClass('vex-dialog-button-primary vex-dialog-button vex-last');
                            $ok.on(router.clicktype, function(e) {
                                // nav to My Connect Account
                                vex.close($vexContent.data().vex.id);
                                self.gotoConnectSignup();

                                // 10 minute timer
                                router.myAccountManager.startTimer(model);

                            });
                            $btns.append($ok);
                            $btns.spin(false);


                            // display message
                            $vexContent.find('.vex-dialog-input').append($('<div>').addClass('success').text(self.localizable.get('matching_claim_success')));
                            
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error(sprintf("%s: %s", textStatus, errorThrown));                            

                            // show a message
                            var error = $.stratweb.firstError(jqXHR.responseJSON, 'unknownError');
                            var message = self.localizable.get(error.key);
                            if (message == error.key) {
                                message = error.message;
                            }
                            console.error(sprintf("%s: %s", error.key, message));

                            $btns.find('input').attr('disabled', false);
                            $btns.spin(false);

                            $vexContent.find('.vex-dialog-input .warning').remove();
                            $vexContent.find('.vex-dialog-input').append($('<div>').addClass('warning').text(message));
                            
                        });

                }
            });            

        }


    });

    return view;
});