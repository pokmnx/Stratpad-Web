define(['Config', 'i18n!nls/ProjectGuideView.i18n', 'i18n!nls/F4.ThemeDetail.i18n', 'Dictionary', 'Theme', 'ProjectNoteItemCollection', 'PageStructure', 'backbone'],

    function(config, localizable, f4localizable, Dictionary, Theme, ProjectNoteItemCollection, pageStructure) {

        var view = Backbone.View.extend({

            INPUT_ID_PREFIX : 'guide_',

            el: '#pageContent',

            initialize: function(router, theme) {
                _.bindAll(
                    this, "_addGuideToPage", "_hideGuide", "_maybeShowGuide", "_navGuidePage", "_load",
                    "_processInput", "_showGuide", "_startGuide", "_toggleGuide", "_toggleGuideDefault", "_addTheme");

				this.localizable = new Dictionary(localizable, f4localizable);
                this.router = router;
                this.theme = theme;
                this.user = $.parseJSON($.localStorage.getItem('user'));

	            this.stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
	            this.projectNoteItemCollection = new ProjectNoteItemCollection(null, {
		            stratFileId: this.stratFile.id,
		            themeId: this.theme.id
	            });

                // storage keys for guide usage stages user has reached

                this.completedKey = sprintf('%s-%s', 'guideCompletedOnce', this.user.id);
                this.hasSeenKey = sprintf('%s-%s', 'guideViewed', this.user.id);
                this.wantsToSeeKey = sprintf('%s-%s', 'guideWantsToView', this.user.id);

                this.guideOpen = false;

                // external elements
                this.$form = this.$el.find('#f4');
                this.$feedback = $('#feedback-form');
                this.$pageSlider = $('#pageSlider');

                // add the html to the page
                this._addGuideToPage();

                this.pgClick = this.router.clicktype + '.projectGuide';

                // remove all old listeners in .projectGuide NS
                this.$el
                    .off('.projectGuide');

                // override nav controls
                $('#pageControl')
                    .off('.projectGuide')
                    .on(this.pgClick, '#next, #prev, #last, #first', this._navGuidePage);

                // should we use the guide or the old project editor?
                this.$el
                    .on('change.projectGuide', '.continueGuide', this._toggleGuideDefault);

                // start button in project guide
                this.$el
                    .on(this.pgClick, '#startGuidedTour', this._startGuide);                    

                // textField behaviour
                this.$el
                    .on('change.projectGuide', '.guide_genericInput, .guide_themeFinChanges, .guide_themeFinAdjustment', this._processInput)
                    .on('keydown.projectGuide', '.guide_themeFinChanges', $.stratweb.integerField)
                    .on('keydown.projectGuide', '.guide_themeFinAdjustment', $.stratweb.decimalField);
                
                // if project name changes, make sure it is reflected everywhere
                this.theme
                    .off('change:name', null, "projectGuide")
                    .on('change:name', function(theme) {
                        this.$el.find('#guide_name').val(theme.get('name'));
                        this.$el.find('#guidePage7 .gContent > h2').text( sprintf(this.localizable.get('page7Heading'), theme.get('name')) );
                        this.$el.find('#guidePage8 .gContent > h2').text( sprintf(this.localizable.get('page8Heading'), theme.get('name')) );
                        this.$el.find('#guidePage9 .gContent > h2').text( sprintf(this.localizable.get('page9Heading'), theme.get('name')) );
                        this.$el.find('#guidePage10 .gContent > h2').text( sprintf(this.localizable.get('page10Heading'), theme.get('name')) );
                    }.bind(this), 'projectGuide');


                // toggle guide buttons

                this.$el
                    .on(this.pgClick, '#showGuide, #goExpertProject', this._toggleGuide)
                    .on(this.pgClick, '#addAnotherProject', this._addTheme);

                // disable help
                this.$el.find('#contentHelp')
                    .on(this.pgClick, function (e) {e.stopPropagation();});

                // responsible person
                var lastResults = [];

                this.$el.find("#guide_responsible").select2({
                    placeholder: "Responsible",
                    allowClear: true,
                    initSelection: function(element, callback) {
                        var data = {
                            id: element.val(),
                            text: element.val()
                        };
                        callback(data);
                    },
                    ajax: {
                        url: config.serverBaseUrl + "/responsibles",
                        type: "GET",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: function(term, page) {
                            // this is what is passed to the server; we will never have pages
                            return {
                                q: term
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            for (var i = 0; i < data.data.responsibles.length; i++) {
                                var resp = data.data.responsibles[i];
                                if ($.trim(resp).length > 0) {
                                    results.push({
                                        id: resp,
                                        text: resp
                                    });
                                }
                            }
                            lastResults = {
                                "results": results
                            };
                            return lastResults;
                        },
                        // because select2 sends ajax cancel as you type, and because this is status 0, don't forward to global handlers.
                        params: {
                            global: false
                        }                        
                    },
                    createSearchChoice: function(term) {
                        var text = term + (lastResults.results.some(function(r) {
                            return r.text == term
                        }) ? "" : " (new)");
                        return {
                            id: term,
                            text: text
                        };
                    }
                });
                this.$el.find("#guide_responsible").change(function(e) {
                    this.theme.set(this._removeInputPrefix(e.target.id), e.val);
                }.bind(this));

                // start and date behaviour
                var $startDate = this.$el.find('#guide_startDate');
                var $endDate = this.$el.find('#guide_endDate');
                $startDate.datepicker({
                    // todo: localized dates?
                    dateFormat: "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true,
                    showAnim: "slideDown",
                    onClose: function(dateText, datePicker) {
                        // min end Date must be at least this date; onClose picks up when we clear out a date too
                        $endDate.datepicker("option", "minDate", dateText);
                        if (dateText == '') {
                           this.theme.unset('startDate');
                        }
                    }.bind(this),
                    onSelect: function(dateText) {
                        this.theme.set('startDate', dateText.replace(/\-/g, ''));
                    }.bind(this)

                });
                $endDate.datepicker({
                    // todo: localized dates?
                    dateFormat: "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true,
                    showAnim: "slideDown",
                    onClose: function(dateText, datePicker) {
                        // max start date must be lte this date
                        $startDate.datepicker("option", "maxDate", dateText);
                        if (dateText == '') {
                            this.theme.unset('endDate');
                        }
                    }.bind(this),
                    onSelect: function(dateText) {
                        this.theme.set('endDate', dateText.replace(/\-/g, ''));
                    }.bind(this)
                });

                // show datepicker on icon click
                $endDate.prev('i').on(self.router.clicktype, function() {
                    if (!$endDate.prop('disabled')) 
                        $endDate.datepicker("show");
                });
                $startDate.prev('i').on(self.router.clicktype, function() {
                    if (!$startDate.prop('disabled'))                     
                        $startDate.datepicker("show");
                });


                this._maybeShowGuide();
                console.log('Inititalized project guide view');

            },

			_addGuideToPage: function() {

                console.log('Adding project guide to page.');

                var compiledTemplate = Handlebars.templates['pagetoolbar/ProjectGuideView'],
                    context = _.defaults({
                        page7Heading: sprintf(this.localizable.get('page7Heading'), this.theme.get('name')),
                        page8Heading: sprintf(this.localizable.get('page8Heading'), this.theme.get('name')),
                        page9Heading: sprintf(this.localizable.get('page9Heading'), this.theme.get('name')),
                        page10Heading: sprintf(this.localizable.get('page10Heading'), this.theme.get('name'))
                    }, this.localizable.all()),
                    html = compiledTemplate(context),
                    $guideContainer = $('<aside id="contentGuide" />'),
                    $header = $('#pageContent header');

                $guideContainer
                    .append(html)
                    .insertAfter($header);

                this.$trigger = $header.find('#showGuide');
                this.$container = $guideContainer;
                this.$mask = $('#helpMask');
                this.$menuMask = $('#menuHelpMask');
                this.$toolbarLis = $('#pageToolbar li');
                this.$mainContent = $('#pageContent > .content');

			},

			_hideGuide: function(){

                this.guideOpen = false;

                $(document).trigger('themeChanged');

                this.$trigger
                    .removeClass('open active');

                // close help window

                this.$container
                    .removeClass('active');

                this.$form
                    .removeClass('guideOpen');

                // can show the guide tab

                this.$feedback
                    .show();

                // show other toolbar items

                this.$toolbarLis
                    .not(this.$trigger)
                    .not('#showHelp')
                    .each(function () {
                        var $this = $(this);
                        $this.css('display', $this.attr('data-display'));
                    });

                // enable page slider

                this.$pageSlider.slider('enable').css('opacity', '1');

                // update pagenum in F4
                this.router.pageControlView.pageSliderView.updatePageNumber(this.router.page);

			},

            _maybeShowGuide: function(){

                var hasSeenGuide = $.localStorage.getItem(this.hasSeenKey),
                    wantsToSeeGuide = $.localStorage.getItem(this.wantsToSeeKey);

                if(!hasSeenGuide){
                    $.localStorage.setItem(this.hasSeenKey, '1');
                    $.localStorage.setItem(this.wantsToSeeKey, '1');
                    this.$el.find('.continueGuide').prop('checked', true);
                    this._showGuide();
                } else if(wantsToSeeGuide && wantsToSeeGuide === '1'){
                    this.$el.find('.continueGuide').prop('checked', true);
                    this._showGuide();
                }

            },

            _navGuidePage: function(e){

                if(this.guideOpen){

                    // if the guide is open, hijack the nav clicks and use them to navigate the guide instead

                    e.preventDefault();
                    e.stopPropagation();

                    var $this = $(e.currentTarget),
                        $currentSlide = this.$container.find('.active'),
                        pageCount = this.$container.find('.guidePage').length,
                        currentIndex =  $currentSlide.data('index');

                    if($this.is('#next')){

                       if(pageCount !== currentIndex){

                           $currentSlide
                               .removeClass('active')
                               .next()
                               .addClass('active');

                            this._updatePageNum();
                            
                       } else {

                           // end of guide

                           $.localStorage.setItem(this.completedKey, '1');

                           this.router.nextPage();

                       }


                    } else if($this.is('#prev')){

                        if(currentIndex !== 1){
                            $currentSlide
                                .removeClass('active')
                                .prev()
                                .addClass('active');

                            this._updatePageNum();
                        } else {

                            // before beginning of project guide
                            this.router.prevPage();
                        }
                    }

                }

            },

            _processInput: function(e){

                var $ele = $(e.target),
                    val = $ele.val(),
                    propName = this._removeInputPrefix($ele.attr("id"));

                if($ele.is('.guide_themeFinAdjustment'))
                    val = parseFloat(val, 10).toFixed(2);

                if($ele.is('.guide_themeFinChanges') || $ele.is('.guide_themeFinAdjustment'))
                    val = val ? Math.round(val) : undefined;

                if ($ele.is('#guide_name')) {
                    // don't let this be empty
                    val = val || this.localizable.get('default_theme_name');
                };

                var inputEmpty = ($ele.is('.guide_genericInput')) ? (!val.length) : (!val || val == 'NaN');

                if (inputEmpty) {
                   this.theme.unset(propName);
                   $ele.val('');
                } else {
                   this.theme.set(propName, val);
                   $ele.val(val);
                }

            },

            _removeInputPrefix: function(idString){

                return idString.replace(this.INPUT_ID_PREFIX, '');

            },

			_showGuide: function(){

                var hasCompletedGuide = $.localStorage.getItem(this.completedKey),
                    wantsToSeeGuide = $.localStorage.getItem(this.wantsToSeeKey);

                if(wantsToSeeGuide && wantsToSeeGuide === '1'){
                    this.$el.find('.continueGuide').prop('checked', true);
                }

                this.guideOpen = true;

                this.$trigger
                    .addClass('open active');

                // opens the guide window (we have a transition on top)

                this.$container
                    .addClass('active');

                // add container class for css usage

                this.$form
                    .addClass('guideOpen');

                // hide the feedback tab so it doesn't get in the way

                this.$feedback
                    .hide();

                // hide other toolbar items

                this.$toolbarLis
                    .not(this.$trigger)
                    .not('#showHelp')
                    .hide();

                if(hasCompletedGuide && hasCompletedGuide === '1' && this.$container.find('.active').is('#guidePage1')){
                    this.$container
                        .find('.active')
                        .removeClass('active');

                    var targetPage = (this.$el.is('.addingTheme')) ? '#guidePage2' : '#guidePage5';

                    this.$container
                        .find(targetPage)
                        .addClass('active');

                }

                this.$el.removeClass('addingTheme');

                this._updatePageNum();

                // populate
                this._load();

			},

            _updatePageNum: function() {
                var pageNum = this.$container.find('.active').data('index') - 1;
                this.router.pageControlView.pageSliderView.updatePageNumber(pageNum, 11);

                // disable page slider in this case, because it interferes with navigating the projects
                this.$pageSlider.slider('disable').css('opacity', '0.3');
            },

            _load: function() {

	            var self = this;

                // name
                this.$el.find('#guide_name').val(this.theme.get('name'));

                // startDate
                var startDate = $.stratweb.formattedDateForDatePicker(this.theme.get('startDate'));
                var $startDate = this.$el.find('#guide_startDate');
                $startDate.val(startDate);
                $startDate.datepicker().val(startDate);

                // endDate
                var endDate = $.stratweb.formattedDateForDatePicker(this.theme.get('endDate'));
                var $endDate = this.$el.find('#guide_endDate');
                $endDate.val(endDate);
                $endDate.datepicker().val(endDate);

                // if we have a startDate && an endDate (both presumed valid), then we should add some initial constraints
                if (startDate != '' && endDate != '') {
                    $startDate.datepicker("option", "maxDate", endDate);
                    $endDate.datepicker('option', 'minDate', startDate);
                };

                // responsible
                var $responsible = this.$el.find("#guide_responsible");
                $responsible.select2('val', this.theme.get('responsible'));

                // page 7
                this.$el.find('#guide_generalAndAdminOneTime').val(this.theme.get('generalAndAdminOneTime'));
                this.$el.find('#guide_salesAndMarketingOneTime').val(this.theme.get('salesAndMarketingOneTime'));
                this.$el.find('#guide_researchAndDevelopmentOneTime').val(this.theme.get('researchAndDevelopmentOneTime'));

                // page 8
                this.$el.find('#guide_researchAndDevelopmentMonthly').val(this.theme.get('researchAndDevelopmentMonthly'));
                this.$el.find('#guide_salesAndMarketingMonthly').val(this.theme.get('salesAndMarketingMonthly'));
                this.$el.find('#guide_generalAndAdminMonthly').val(this.theme.get('generalAndAdminMonthly'));
                this.$el.find('#guide_researchAndDevelopmentMonthlyAdjustment').val(this.theme.get('researchAndDevelopmentMonthlyAdjustment'));
                this.$el.find('#guide_salesAndMarketingMonthlyAdjustment').val(this.theme.get('salesAndMarketingMonthlyAdjustment'));
                this.$el.find('#guide_generalAndAdminMonthlyAdjustment').val(this.theme.get('generalAndAdminMonthlyAdjustment'));

                // page 9
                this.$el.find('#guide_revenueOneTime').val(this.theme.get('revenueOneTime'));
                this.$el.find('#guide_cogsOneTime').val(this.theme.get('cogsOneTime'));

                // page 10
                this.$el.find('#guide_revenueMonthly').val(this.theme.get('revenueMonthly'));
                this.$el.find('#guide_revenueMonthlyAdjustment').val(this.theme.get('revenueMonthlyAdjustment'));
                this.$el.find('#guide_cogsMonthly').val(this.theme.get('cogsMonthly'));
                this.$el.find('#guide_cogsMonthlyAdjustment').val(this.theme.get('cogsMonthlyAdjustment'));

	            // load up project notes and disable any inputs in guide that have them

	            this.projectNoteItemCollection.fetch({
		            success: function (notes) {
			            console.debug('Downloaded project notes: ' + notes.length);
			            notes.each(function(projectNoteItem) {
				            self.$el.find('#guide_' + projectNoteItem.get('field')).prop('disabled', true).addClass('field-has-notes');
			            });
		            },
		            error  : function (model, xhr, options) {
			            console.error(sprintf("Oops, couldn't load notes. Status: %s %s", xhr.status, xhr.statusText));
		            }
	            });

            },

            _startGuide: function(e){

                e.preventDefault();

                this.$container
                    .find('.active')
                    .removeClass('active')
                    .next()
                    .addClass('active');

            },

            _toggleGuide: function(e){

                e.preventDefault();
                e.stopPropagation();

                if(this.$trigger.is('.open'))
                    this._hideGuide();
                else
                    this._showGuide();

            },

            _toggleGuideDefault: function(e){

                var $this = $(e.currentTarget);

                // save
                $.localStorage.setItem(this.wantsToSeeKey, $this.is(':checked') ? '1' : '0');

                // make sure both are the same
                this.$el.find('.continueGuide').prop('checked', $this.is(':checked'));

            },

            _addTheme: function(e) {

                e.preventDefault();
                e.stopPropagation();

                var self = this,
                    $themeButton = $(e.target),
                    themeCollection = this.router.stratFileManager.themeCollection;

                // prevent rapid clicks
                $themeButton.off(this.pgClick);

                // determine order; we should always have >= 1 theme
                var order = 0;
                if (themeCollection.length) {
                    console.debug("theme ct: " + themeCollection.length);
                    var lastTheme = themeCollection.max(function(theme) {
                        return theme.get('order');
                    });
                    order = lastTheme.get('order') + 1;
                };

                // create new theme and save it
                var theme = new Theme({
                    'name': this.localizable.get('default_theme_name'),
                    'order': order
                }, {
                    'stratFileId': themeCollection.stratFileId
                });
                theme.save(null, {
                    success: function(model, response, options) {
                        themeCollection.add(theme); // will trigger the render

                        // navigate to new theme
                        var url = sprintf('nav/%s/%s/%s', pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, themeCollection.length - 1);
                        self.router.navigate(url, {
                            trigger: true,
                            replace: false
                        });

                        $('#pageContent').addClass('addingTheme');

                        // turn the add button back on again
                        $themeButton.on(self.pgClick, self._addTheme);

                        // self.$el.nanoScroller();

                    },
                    error: function(model, xhr, options) {
                        console.error("Oops, couldn't save theme.");
                        $themeButton.on(self.pgClick, self._addTheme);
                    }
                });

            }


        });

        return view;

    });