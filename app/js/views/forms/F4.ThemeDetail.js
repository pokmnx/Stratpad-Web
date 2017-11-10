define(['StratFile', 'Theme', 'NetBenefitsCalculator', 'Config', 'Dictionary', 'ProjectGuideView', 'ProjectNotesManager', 'PageStructure', 'SeasonalManager', 'bonsai'],
    function(StratFile, Theme, NetBenefitsCalculator, config, Dictionary, ProjectGuideView, ProjectNotesManager, pageStructure, SeasonalManager) {

        var view = Backbone.View.extend({

            el: $('#pageContent'),

            initialize: function(router, theme, localizable) {

                // saving strategy:
                // bind listeners to UI controls
                // listeners modify the backbone model (theme)
                // we have a listener on theme for changes
                // use debounce to save the changes to server, while coalescing calls into one

                _.bindAll(this, "load", "calculateNetBenefits", 'applyPermissions', 'addProject', 'deleteProject', 'cloneProject', 'showNavigator');

                this.router = router;
                this.theme = theme;
                this.localizable = new Dictionary(localizable);
                var self = this;

                // the guide
                this.projectGuideView = new ProjectGuideView(this.router, this.theme);
                
                // hookup notes
                this.projectNotesManager = new ProjectNotesManager(this.router, this.theme, this.localizable);

                // hookup seasonal
                this.seasonalManager = new SeasonalManager(this.router, this.theme, this.localizable);

                // toolbar items
                $('#pageContent')
                    .off('click.projects')
                    .on('click.projects', 'li#addProject', this.addProject)
                    .on('click.projects', 'li#cloneProject', this.cloneProject)
                    .on('click.projects', 'li#deleteProject', this.deleteProject)
                    .on('click.projects', 'li#showNavigator', this.showNavigator);


                // hook up 'responsible' dropdown
                var $responsible = this.$el.find("#responsible");
                $responsible.selectize({
                    valueField: 'value',
                    labelField: 'name',
                    options: [],
                    searchField: 'name',
                    sortField   : 'name',
                    create: true,
                    maxItems: 1,
                    load: function(query, callback) {
                        if (!query.length) return callback();
                        $.ajax({
                            url: config.serverBaseUrl + "/responsibles",
                            type: 'GET',
                            data: {
                                q: query
                            },                            
                            error: function(response) {
                                callback();
                            },
                            success: function(response) {
                                var results = [];
                                _.each(response.data.responsibles, function(responsible) {
                                    if (responsible) {
                                        results.push({name:responsible, value:responsible});
                                    };
                                });
                                callback(results);
                            }
                        });
                    }
                });
                $responsible.change(function(e) {
                    this.theme.set(e.target.id, $(e.target).val());
                }.bind(this));

                // hook up date pickers
                var $startDate = this.$el.find('#startDate');
                var $endDate = this.$el.find('#endDate');
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
                        };
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
                        };   
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

	            // hook up financial changes
                $('#oneTimeAndMonthly .themeFinChanges, #seasonallyAndAnnually .themeFinChanges')
                // restrict input on financial changes (no decimals)
                .keydown($.stratweb.integerField)

                // save on return
                .keydown($.stratweb.returnField)

                // update backbone (which triggers a save)
                .change(function(e) {
                    var $ele = $(e.target);
                    var num = $ele.val();
                    num = num ? Math.round(num) : undefined;
                    var propName = $ele.attr("id");
                    if (!num || num == 'NaN') {
                        this.theme.unset(propName);
                        $ele.val('');
                    } else {
                        this.theme.set(propName, num);
                        $ele.val(num);
                    }
                    // call it again after save
                    this.calculateNetBenefits();
                }.bind(this));

                // hook up financial adjustments
                $('#oneTimeAndMonthly .themeFinAdjustment, #seasonallyAndAnnually .themeFinAdjustment')
                .keydown($.stratweb.decimalField)
                .keydown($.stratweb.returnField)
                .change(function(e) {
                    var $ele = $(e.target);
                    var num = parseFloat($ele.val(), 10).toFixed(2);
                    var propName = $ele.attr("id");
                    if (!num || num == 'NaN') {
                        this.theme.unset(propName);
                        $ele.val('');
                    } else {
                        this.theme.set(propName, num);
                        $ele.val(num);
                    }
                    // call it again after save
                    this.calculateNetBenefits();
                }.bind(this));

                // if we press enter, return or tab - commit changes
                var $themeName = this.$el.find('#name');
                $themeName.on('keypress', function(e) {
                    // can't actually capture the tab here
                    if (e.which == 10 || e.which == 13) {
                        e.target.blur();
                    }
                });

                // equivalent to a tab keypress
                $themeName.on('blur', function(e) {
                    var themeName = $themeName.val() || this.localizable.get('default_theme_name');
                    this.theme.set("name", themeName);
                    $themeName.val(this.theme.get('name'));
                }.bind(this));

                // listen for changes to theme
                this.theme.off( 'change', null, "ThemeDetail");
                this.theme.on( 'change', $.debounce( 800, false, function(theme) {
                    this.calculateNetBenefits();
	                var isError = false;
                    console.debug('theme changed: ' + JSON.stringify(theme.changedAttributes()) + '\nprev: ' +  JSON.stringify(theme.previousAttributes()) );
                    this.theme.save(null, {
                        silent: true,
                        success: function(response) {
                            this.router.showSaveMessage(this.localizable.get('allChangesSaved'), isError);

                        }.bind(this),
                        error: function(model, xhr, options) {
	                        isError = true;
                            this.router.showSaveMessage(this.localizable.get('changesNotSaved'), isError);
                        }.bind(this)                        
                    });
                }.bind(this)), 'ThemeDetail');

                // listen for when project guide commits some changes
                $(document)
                    .off('themeChanged')
                    .on('themeChanged', this.load);

                $(document)
                    .off('themesLoaded.themes')
                    .on("themesLoaded.themes", function(e, themeCollection) {
                        console.debug("Stratfile switched and themes loaded");
                        if (this.router.section = pageStructure.SECTION_FORM && this.router.chapter == pageStructure.CHAPTER_THEMES) {
                            this.router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, 0, true);
                        };

                    }.bind(this));

                // populate data
                this.load();

            },

            load: function() {

                this.$el.spin();

                // let shared users know what page we're on
                this.router.messageManager.sendPageUpdate();

                // load this up async
                this.projectNotesManager.load();

                // sync theme
                this.theme.fetch({
                    success: function(theme) {
                        var $form = $('#f4 form');

                        // name
                        $form.find('#name').val(theme.get('name'));

                        // startDate
                        var startDate = $.stratweb.formattedDateForDatePicker(theme.get('startDate'));
                        var $startDate = $form.find('#startDate');
                        $startDate.datepicker().val(startDate);

                        // endDate
                        var endDate = $.stratweb.formattedDateForDatePicker(theme.get('endDate'));
                        var $endDate = $form.find('#endDate');
                        $endDate.datepicker().val(endDate);

                        // if we have a startDate && an endDate (both presumed valid), then we should add some initial constraints
                        if (startDate != '' && endDate != '') {
                            $startDate.datepicker("option", "maxDate", endDate);
                            $endDate.datepicker('option', 'minDate', startDate);
                        };

                        var $responsible = $form.find("#responsible").selectize();
                        var responsible = theme.get('responsible');
                        $responsible[0].selectize.addOption({name: responsible, value: responsible});
                        $responsible[0].selectize.setValue(responsible);

                        // number grid
                        $('#oneTimeAndMonthly .themeFinChanges, #seasonallyAndAnnually .themeFinChanges').each(function() {
                            // only set the html if we have a val inside theme
                            if (theme.has(this.id)) {
                                $(this).val(theme.get(this.id));
                            } else {
                                $(this).val("");
                            }
                        });

                        // adjustment grid
                        $('#oneTimeAndMonthly .themeFinAdjustment, #seasonallyAndAnnually .themeFinAdjustment').each(function() {
                            if (theme.has(this.id)) {
                                $(this).val(theme.get(this.id).toFixed(2));
                            } else {
                                $(this).val("");
                            }
                        });

                        // seasonal
                        this.seasonalManager.populateProjectFields();

                        this.applyPermissions();

                        // calculations
                        this.calculateNetBenefits();

                        this.$el.spin(false);

                    }.bind(this),
                    error: function(model, xhr, options) {
                        console.error(sprintf("Oops, couldn't load theme. Status: %s %s", xhr.status, xhr.statusText));
                        this.$el.spin(false);

                    }
                });
            },

            applyPermissions: function() {
                var self = this,
                    stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                
                // permissions status field
                var $perms = this.$el.find('#f4 .permissions');

                // field can be readonly or disabled (with data wiped)
                if (stratFile.hasWriteAccess('PLAN')) {
                    $perms.hide();
                    // seasonal variations field is always read-only - not really a field
                    this.$el.find('.themeDetail input, #contentGuide input').not('.seasonal').each(function() {
                        $(this).prop('readonly', false);
                        $(this).prop('disabled', false);
                    });

                    // dates
                    this.$el.find('#startDate, #guide_startDate, #endDate, #guide_endDate').prop('disabled', false);                    

                    // toolbar items
                    $('#pageContent #pageToolbar li#addProject, #pageContent #pageToolbar li#cloneProject, #pageContent #pageToolbar li#deleteProject')
                        .removeClass('disabled');

                    
                }
                else if (stratFile.hasReadAccess('PLAN')) {
                    this.$el.find('.themeDetail input, #contentGuide input').not('.seasonal').each(function() {
                        $(this).prop('readonly', true);
                        $(this).prop('disabled', false);                          
                    });

                    // label
                    $perms.text(self.localizable.get('warn_readonly'));
                    $perms.show();

                    // readonly doesn't work on datepickers, so use disabled
                    this.$el.find('#startDate, #guide_startDate, #endDate, #guide_endDate').prop('disabled', true);

                    // toolbar items
                    $('#pageContent #pageToolbar li#addProject, #pageContent #pageToolbar li#cloneProject, #pageContent #pageToolbar li#deleteProject')
                        .addClass('disabled');

                }
                else {
                    // disabled - probably won't actually get here, but just to be safe
                    this.$el.find('.themeDetail input, #contentGuide input').not('.seasonal').each(function() {
                        $(this).prop('disabled', true);
                        $(this).val('');
                    });

                    // label
                    $perms.text(self.localizable.get('LBL_NO_ACCESS'));
                    $perms.show();                    

                    // toolbar items
                    $('#pageContent #pageToolbar li#addProject, #pageContent #pageToolbar li#cloneProject, #pageContent #pageToolbar li#deleteProject')
                        .addClass('disabled');

                }

                // simple way to route around the async nature of our calls, is to apply this twice, so it doesn't matter what order the calls finish
                this.projectNotesManager.applyPermissions();
            },

            calculateNetBenefits: function() {
                var netBenefitsCalculator = new NetBenefitsCalculator(this.theme.toJSON());
                var netBenefits = netBenefitsCalculator.netBenefits();

                var oneTime = netBenefitsCalculator.hasValues("OneTime") ? $.stratweb.formatNumberWithParens(netBenefits.oneTimeBenefit) : "";
                $('#benefitOneTime').text(oneTime);

                var monthly = netBenefitsCalculator.hasValues("Monthly") ? $.stratweb.formatNumberWithParens(netBenefits.monthlyBenefit) : "";
                $('#benefitMonthly').text(monthly);

                // NB
                // the thing is, we only show the first year of a multiyear project, so seasonal doesn't matter
                // when less than a year, we show a hypothetical year anyway, so seasonal still doesn't matter

                var annually = netBenefitsCalculator.hasValues("Annually") ? $.stratweb.formatNumberWithParens(netBenefits.annualBenefit) : "";
                $('#benefitAnnually').text(annually);                    

                var hasTotal = (oneTime + monthly + annually) !== "";
                $('.benefitTotal').text(hasTotal ? $.stratweb.formatNumberWithParens(netBenefits.totalBenefit) : "");
            },

            deleteProject: function(e) {
                e.preventDefault();
                e.stopPropagation();

                var stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                if (stratFile.hasWriteAccess('PLAN')) {

                    vex.dialog.confirm({
                        className: 'vex-theme-plain',
                        message: this.localizable.get('themeDeleteConfirm'),
                        buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('themeDeleteConfirmButton') }),
                                  $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                                        
                        callback: function(value) {
                            if (value) {
                                this.doDeleteProject();
                            };
                        }.bind(this)                
                    });

                };
            },

            doDeleteProject: function() {

                // we need to make sure no ui is showing for objectives/activities (or update it) - listeners
                // we also need to select the previous theme
                // and if this is the last theme, we need to make a new blank one and select that

                var addThemeOnSuccess = false;
                if (this.router.stratFileManager.themeCollection.length == 1) {
                    addThemeOnSuccess = true;
                }

                var stratFileId = this.theme.get('stratFileId');

                this.theme.destroy({
                    success: function(model, response, options) {
                        console.debug("Deleted theme with id: " + model.get("id"));

                        // todo: the projectNoteManager is holding onto old theme references

                        if (addThemeOnSuccess) {
                            var newTheme = new Theme({
                                'name': this.localizable.get('default_theme_name'),
                                'order': 0
                            }, {
                                'stratFileId': stratFileId
                            });
                            newTheme.save(null, {
                                success: function(model, response, options) {
                                    console.debug("Created theme with id: " + model.get("id"));
                                    var page = this.router.pageNavigationView.themeCollection.length-1;
                                    router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, page, true); 

                                }.bind(this),
                                error: function(model, xhr, options) {
                                    console.error("Oops, couldn't save theme.");
                                }
                            });

                        } else {
                            // now load up the last theme
                            var page = this.router.pageNavigationView.themeCollection.length-1;
                            router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, page, true); 
                        }
                    }.bind(this),
                    error: function(model, xhr, options) {
                        console.error("Oops, couldn't delete theme.");
                    }
                });
            },

            addProject: function(e) {
                e.preventDefault();
                e.stopPropagation();

                var stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                if (stratFile.hasWriteAccess('PLAN')) {
                    router.stratFileManager.addTheme();
                }
            },

            cloneProject: function(e) {
                e.preventDefault();
                e.stopPropagation();

                var self = this;
                var stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                if (stratFile.hasWriteAccess('PLAN')) {
                    // ask if we want to clone objectives
                    vex.dialog.open({
                      className: 'vex-theme-plain',
                      message: sprintf(this.localizable.get("msgCloneProject"), this.theme.get('name')),
                      input: sprintf('%s <input name="objectives" type="checkbox" value="true"/>', this.localizable.get('msgIncludeObjectives')),
                      callback: function(data) {
                        if (data === false) {
                          return console.debug('Cancelled');
                        }
                        var cloneObjectives = data.objectives == 'true';

                        router.stratFileManager.cloneTheme(self.theme, cloneObjectives);
                      }
                    });
                }
            },

            showNavigator: function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.router.pageNavigationView.showNavigator(this.theme);
            }


        });

        return view;
    });