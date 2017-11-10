define(['BasicSearchResultsView', 'Config', 'FormDialog', 'CommunityAgreementView'],

function(BasicSearchResultsView, config, FormDialog, CommunityAgreementView) {

    var view = BasicSearchResultsView.extend({

        el: '#matchingLendersAndInvestors',

        category: 'Bank',

        numParts: 3,

        initialize: function(router, localizable) {
            BasicSearchResultsView.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", "showCommunityRequirementsDialog", "checkCommunityStratFileRequirements", "hasCompletedDiscussionPages", "hasProject", "hasSalesAndExpenses");    

            // set context late (override)
            this.suggestCategoryDialog = new FormDialog(this.router, 'community/lendersAndInvestors/ConnectRequestDialog', {});   

            // the agreement
            this.communityAgreementView = new CommunityAgreementView(this.router);         

        },

        load: function() {
            BasicSearchResultsView.prototype.load.call(this);

            var self = this;

            // drop down the agreement page as required
            this.communityAgreementView.maybeShowAgreement();            

            // remove any old dialog when switching stratfiles
            $('#pageContent #communityRequirementsDialog').remove();            

            // if you haven't fulfilled conditions, give the user some instructions
            var deferred = $.Deferred(),
                stratFileId = this.stratFile.get('id');
            deferred.resolve();

            // get discussions and IS - want this good for the banks; todo: consider using a cache
            deferred = deferred.then(function() {
                return $.ajax({
                    url: config.serverBaseUrl + "/stratfiles/" + stratFileId + "/discussions",
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {
                    self.discussion = response.data.discussion;
                    self.$el.trigger('finishedLoadingPart');
                    self.checkCommunityStratFileRequirements();
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error(sprintf("%s: %s", textStatus, errorThrown));
                    self.$el.trigger('finishedLoadingPart');
                });             
            });

            deferred = deferred.then(function() {
                return $.ajax({
                  url: config.serverBaseUrl + "/reports/incomestatement/details",
                  type: "GET",
                  dataType: 'json',
                  data: {
                    'id': stratFileId
                  },
                  contentType: "application/json; charset=utf-8"
                })
                  .done(function(response, textStatus, jqXHR) {
                    self.incomeStatement = response;
                    self.$el.trigger('finishedLoadingPart');
                    self.checkCommunityStratFileRequirements();
                  })
                  .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                    self.$el.trigger('finishedLoadingPart');
                  });
                     
            });


        },

        showCommunityRequirementsDialog: function(hasCompletedDiscussionPages, hasProject, hasSalesAndExpenses) {

            var self = this,
                message = this.localizable.get('dialogCommunityRequirementsTitle'),
                compiledTemplate = Handlebars.templates['community/lendersAndInvestors/CommunityRequirementsDialog'],
                context = this.localizable.all(),
                $html = $(compiledTemplate(context));

            $html.find('#discussionCheck').addClass(hasCompletedDiscussionPages ? "checkmark" : "ex");
            $html.find('#projectCheck').addClass(hasProject ? "checkmark" : "ex");
            $html.find('#salesCheck').addClass(hasSalesAndExpenses ? "checkmark" : "ex");

            // a fake vex, really, so that we can access it later
            $html.find('.vex-content').data('vex', {"id": 0});

            $('.location-section_community #pageContent .content #communityRequirementsDialog').remove();
            $('.location-section_community #pageContent .content').append($html);

        },        

        checkCommunityStratFileRequirements: function() {
            // we need to fetch the discussions and check 
            // we need to look at each theme
            // we need to fetch IS

            if (this.incomeStatement && this.discussion) {
                var hasCompletedDiscussionPages = this.hasCompletedDiscussionPages(this.discussion);
                var hasProject = this.hasProject();
                var hasSalesAndExpenses = this.hasSalesAndExpenses(this.incomeStatement);
                if (hasCompletedDiscussionPages && hasProject && hasSalesAndExpenses) {
                    console.debug('Community good to go');

                    // reset header - when we switch stratfiles we are just running @load, so the template isn't re-parsed
                    $('.location-chapter_lenders_and_investors header > hgroup > h2').text(this.title);

                    // // add pages back and update page num
                    // pageStructure.toggleCommunityPages(false);
                    // this.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);                

                    // show content
                    this.$el.find('.instructions, .formPanel, .security, .searchResults').show();
                    this.$el.find('.readOnlyPlan').hide();   

                } else {
                    
                    // show user a message
                    this.showCommunityRequirementsDialog(hasCompletedDiscussionPages, hasProject, hasSalesAndExpenses);

                }

            };

        },

        hasCompletedDiscussionPages: function(discussion) {
            // 140 chars per discussion page
            var isOK = true, ctr = 0;
            var discussionKeys = [              
                'customersDescription',
                'keyProblems',
                'addressProblems',
                'competitorsDescription',
                'businessModelDescription',
                'expansionOptionsDescription',
                'ultimateAspiration',
                'mediumTermStrategicGoal'
            ];
            _.each(discussionKeys, function(discussionKey) {
                if (discussion.hasOwnProperty(discussionKey)) {
                    ctr += 1;
                    if (discussion[discussionKey].length < 140) {
                        isOK = false;
                    };                    
                };
            })
            return isOK && ctr == discussionKeys.length;
        },

        hasProject: function() {
            // we always have 1 project, but make sure it has a decent name and a couple of values
            var themeCtr = 0;
            var hasGoodName = false;
            var hasValues = false;
            var self = this;
            this.router.stratFileManager.themeCollection.each(function(theme, idx) {
                themeCtr += 1;
                if (theme.get("name").length > 1 && theme.get("name") != self.localizable.get('default_theme_name')) {
                    hasGoodName = true;
                };
                if (theme.keys().length > 6) { // id, create, mod, order, userId, stratFileId
                    hasValues = true;
                };
            });
            return themeCtr >= 1 && hasGoodName && hasValues;
        },

        hasSalesAndExpenses: function(incomeStatement) {
            // look at netIncome line for 12 consecutive non-null vals
            var ctr = 0, max = 0;
            _.each(incomeStatement.netIncome.totals, function(val) {
                ctr = (val == null) ? 0 : ctr + 1;
                max = Math.max(ctr, max);
            });
            return max >= 12;
        }        

    });

    return view;
});