// this is the sidebar aka the navbar
// just remember that 'backbone' gives us a reference to our global instance (I think); if we don't reference this here - kaboom
define(['PageStructure', 'Theme', 'ThemeListView', 'ObjectivesNavListView', 'ActivitiesNavListView', 
	'ObjectiveCollection', 'ChartNavListView', 'ChartCollection', "i18n!nls/Global.i18n", 'Dictionary', 'PageStructure', 'backbone'],

function(pageStructure, Theme, ThemeListView, ObjectivesNavListView, ActivitiesNavListView, 
	ObjectiveCollection, ChartNavListView, ChartCollection, gLocalizable, Dictionary, pageStructure) {

    var view = Backbone.View.extend({

        el: '#pageNavigation',

        initialize: function(router) {
            this.router = router;
            this.themeCollection = this.router.stratFileManager.themeCollection;
            this.objectiveCollection = this.router.stratFileManager.objectiveCollection;
            this.chartCollection = this.router.stratBoardManager.chartCollection;
            this.localizable = new Dictionary(gLocalizable);

            _.bindAll(this, 'goPage', 'addTheme', 'storeNavState', 'goThemePage', 'goObjectivePage', 'showPageParentListInSidebar', 'selectPage');

			var self = this;
			this.$navSections = this.$el.find('.navSection');
			this.$navSubSections = this.$el.find('.navSubSection');

			this.router.user
				.off('change:hasCompletedConnect', null, 'PageNav')
				.on('change:hasCompletedConnect', function(model) {
					var pageKey = sprintf('%s,%s,%s', pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, pageStructure.PAGE_CONNECT_REPORT);
					var $li = self.$el.find('span[data-key="' + pageKey + '"]').closest('li');
					if (model.get('hasCompletedConnect')) {
						$li.removeClass('disabled');
					} else {
						$li.addClass('disabled');
					}
					// better to remove the page from pageStructure, rather than try to disable it - too many consequences
					// but in this case, we will show the disabled page
					
				}, 'PageNav');

			// make sure this div can scroll, even after adding new cells
	        this.$el.nanoScroller();

            // hook up main headers and subheaders
            this.$el.on(self.router.clicktype, "h6:not(.subLevel):not(.disabled), .subLevel:not(.disabled)", function() {

                var $this = $(this),
					storageKey = sprintf('%s-%s', $this.data('level'), self.router.user.get('id')),
					pageKey = $.localStorage.getItem(storageKey),
					$icon =  $this.find('i:eq(0)'),
					$thisSection = $this.next('ul');

				console.debug(sprintf('looking up %s = %s', storageKey, pageKey));	

				// if no data key, then grab the first page in this section
				if(!pageKey) {
					pageKey = $thisSection.find('.navItem').first().children('span').data('key');
				}

				// we're either opening/closing a header, or open a header and jump to a page

				var $active = $thisSection.find('.active');
				if ($active.length) {
					// just toggle
					$thisSection.slideToggle();

					// get the icon to match
					$icon.toggleClass('closed');

				} else {
					// load up the page
					self.goPage(pageKey);
				}

	            setTimeout(function(){
		            self.$el.nanoScroller({ scrollTo: $('span[data-key="' + pageKey + '"]') });
	            }, 600);

            });

			// can still click on disabled navItems
			this.$el.on(self.router.clicktype, ".navItem", function() {

				var $this = $(this),
					pageKey = $this.children('span').data('key');

				self.goPage(pageKey);
			});

            // This handles automatic toggling of sections in nav when not using the nav clicks themselves (ie next/prev)
			$(document)
				.on('pageNavUpdated', function (e, active) {

                    // the newly highlighted cell, which will be the first (or last remembered (this is for linear progression so first or last) ) cell in a section
					var $this = $(active);

					self.showPageParentListInSidebar($this.data('key'));

				});

            // this will take care of rendering the navbar cells for the themes, in response to theme additions, removals, and changes
            this.themeListView = new ThemeListView(this.router, this.themeCollection);

            // every time we add/remove a theme, we add/remove the matching Objectives navItem into that theme's objectives 
            this.objectivesNavListView = new ObjectivesNavListView(this.router, this.themeCollection);

            // every time we add/remove an activity, we add/remove the matching Activities navItem into that objective's activities
            this.activitiesNavListView = new ActivitiesNavListView(this.router, this.objectiveCollection);

            // charts can be added/removed on its first chapter, which is a single page, and always exists
            this.chartListView = new ChartNavListView(this.router, this.chartCollection);

            // hook up the add theme button
            var addThemeButton = this.$el.find('#themes i.add-button');
            addThemeButton
	            .off(self.router.clicktype)
	            .on(self.router.clicktype, this.addTheme);

            this.themeCollection.on("add", function(theme) {
		      	console.debug("added theme: " + theme.get('name') );

                // get the scrollbar to update for new theme
                this.$el.nanoScroller();
		    }.bind(this));

	        this.themeCollection.on("destroy", function(theme) {
	          console.debug("deleted theme: " + theme.get("name")  );
                // get the scrollbar to update for new theme
                this.$el.nanoScroller();
	        }.bind(this));

        },

        goPage: function(pageKey) {

            var parts = pageKey.split(',');

            this.router.showStratPage(parts[0], parts[1], parts[2], true);
        },

        // eg 1,3,1
        showPageParentListInSidebar: function(pageKey) {
        	// make sure the specified page reference in the sidebar is open and viewable

			var $thisPage = $(sprintf("span[data-key='%s']", pageKey));

        	var $thisChapter = $thisPage
        		.closest('ul.navSubSection');

        	var $thisSection = $thisPage
        		.closest('ul.navSection');

    		var $stratpad = $thisSection.closest('#stratpad');
    		var isStratPad = $stratpad.length;


        	// close all other navSections - basically anything else which has children
			this.$navSections
				.not($thisSection)
				.slideUp()
				.prev()
				.find('i:eq(0)')
				.addClass('closed');

			this.$navSubSections
				.not($thisChapter)
				.slideUp()
				.prev()
				.find('i:eq(0)')
				.addClass('closed');


			// open this subSection
			$thisChapter
        		.slideDown()
				.prev()
				.find('i:eq(0)')
				.removeClass('closed');

			// open this section
        	$thisSection
        		.slideDown()
				.prev()
				.find('i:eq(0)')
				.removeClass('closed');

			// hack: open/close stratpad too if necessary
        	if (isStratPad) {
        		// open this one too
        		$stratpad.find('ul:first')
	        		.slideDown()
					.prev()
					.find('i:eq(0)')
					.removeClass('closed');
        	} else {
        		// close it
        		$stratpad = this.$el.find('ul#stratpad');
        		$stratpad.find('ul:first')
	        		.slideUp()
					.prev()
					.find('i:eq(0)')
					.addClass('closed');
        	}

        },


        goThemePage: function(themeId) {
        	var pageKey = this.$el.find(sprintf("#themes li.navItem span[model=%s]", themeId)).data('key');
        	this.goPage(pageKey);
        },

        goObjectivePage: function(themeId) {
        	var pageKey = this.$el.find(sprintf("#objectives li.navItem span[model=%s]", themeId)).data('key');
        	this.goPage(pageKey);
        },

        goActivityPage: function(objectiveId) {
        	var pageKey = this.$el.find(sprintf("#activities li.navItem span[model=%s]", objectiveId)).data('key');
        	this.goPage(pageKey);
        },

		// stores the state of the navbar in localstorage, every time we view a page
		// this would be the ideal mechanism (but it's not implemented):
		//   for each parent header, we should store the same value eg. StratPad, WriteYourPlan and Discussion should all know we were on Key Problems (1,1,1)
        // eg. we may have stored storageKey: navStateStage1-5678444981518336 with storageValue: 1,0,0 or navStateStage1_3-5678444981518336 with 1,3,1		
		storeNavState: function(section, chapter, page) {

			if (page < 0) return;

			var subSection = '_' + chapter;

			// the parent elements that we click on need to have a data-level which matches navStateStage%s%s - that's how they check their key
			var storageKey = sprintf('navStateStage%s-%s', section, router.user.get('id')),
				subStorageKey = sprintf('navStateStage%s%s-%s', section, subSection, router.user.get('id')),
                storageValue = sprintf('%s,%s,%s', section, chapter, page);

            // little hack for #stratpad, since it doesn't have a standardized data-level
            var isStratPad = 
            	section != pageStructure.SECTION_REFERENCE 
            	&& section != pageStructure.SECTION_BUSINESS101
            	&& section != pageStructure.SECTION_COMMUNITY;
            if (isStratPad) {
	            var key = sprintf('%s-%s', this.$el.find('ul#stratpad > li > h6').data('level'), self.router.user.get('id'));
	            $.localStorage.setItem(key, storageValue);
            	console.debug(sprintf('storing stratpad hack: %s = %s', key, storageValue));
            }

            // if end of welcome sequence, store start in nav state

            var lastWelcomePage = sprintf('%s,%s,%s', pageStructure.SECTION_REFERENCE, pageStructure.CHAPTER_WELCOME, pageStructure.PAGE_READY_TO_START),
            	firstWelcomePage = sprintf('%s,%s,%s', pageStructure.SECTION_REFERENCE, pageStructure.CHAPTER_WELCOME, 0);
            storageValue = (storageValue === lastWelcomePage) ? firstWelcomePage : storageValue;

            // store keys and vals in localstorage
            console.debug(sprintf('storing %s = %s', storageKey, storageValue));
            console.debug(sprintf('storing %s = %s', subStorageKey, storageValue));            

			$.localStorage.setItem(storageKey, storageValue);
			$.localStorage.setItem(subStorageKey, storageValue);

		},

        addTheme: function(e) {

        	e.stopPropagation();
        	e.preventDefault();

            router.stratFileManager.addTheme();
        },

        // update the sidebar selection
        selectPage: function(section, chapter, page) {
			var $active = this.$el.find('span[class~="active"]');
			$active.removeClass('active');

			var $selected;
			if (section == pageStructure.SECTION_FORM && (chapter == pageStructure.CHAPTER_ABOUT)) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key^="%s,%s"]', section, chapter));
			} else if (section == pageStructure.SECTION_FORM && (chapter == pageStructure.CHAPTER_DISCUSSION)) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else if (section == pageStructure.SECTION_FORM && (chapter == pageStructure.CHAPTER_THEMES || chapter == pageStructure.CHAPTER_OBJECTIVES) && router.stratFileManager.themeCollection) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else if (section == pageStructure.SECTION_FORM && chapter == pageStructure.CHAPTER_ACTIVITIES && router.stratFileManager.objectiveCollection) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else if (section == pageStructure.SECTION_FORM && chapter == pageStructure.CHAPTER_FINANCIAL_EDITS) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else if (section == pageStructure.SECTION_STRATBOARD) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else if (section == pageStructure.SECTION_COMMUNITY && chapter >= pageStructure.CHAPTER_PROFESSIONAL_SERVICES) {
				$selected = $('#pageNavigation').find(sprintf('span[data-key="%s,%s,%s"]', section, chapter, page));
			} else {
				$selected = $('#pageNavigation').find(sprintf('span[data-key^="%s,%s"]', section, chapter));
			}  
			$selected.addClass('active'); 
			return $selected;     	
        },

        showNavigator: function(currentTheme, currentObjective) {

        	// current is based on whether we are currently looking at activities, objectives or projects in the sidebar

            var self = this,
            	$projects = $('<ul id="projects">');

            router.stratFileManager.themeCollection.each(
                function(theme) {
                    var isOpen = theme.get('id') == currentTheme.get('id');

                    var $li = $('<li>')
                        .addClass('project')
                        .data('themeId', theme.get('id'))
                        .append( $('<a>').text(theme.get('name')).attr('href', '#') );
                    if (isOpen) {
                    	$li.addClass('expanded');
	                    if (router.chapter == pageStructure.CHAPTER_THEMES) $li.addClass('current');
                    }
                    $projects.append($li);

                    var $objectives = $('<li>')
                        .addClass('objectives') 
                        .append( $('<a>').text(self.localizable.get('OBJECTIVES')).attr('href', '#') )
                        .append('<ul>')
                        .find('ul');
                    if (isOpen) {
                    	$objectives.parent().addClass('expanded');
						if (router.chapter == pageStructure.CHAPTER_OBJECTIVES) $objectives.parent().addClass('current');                        
                    }
                    var filteredCollection = router.stratFileManager.objectiveCollection.where({
                      'themeId': theme.get('id')
                    });
                    _.each(filteredCollection, function(objective) {
                        var $objLi = $('<li>')
                            .addClass('expanded')
                            .addClass('objective')
                            .data('objectiveId', objective.get('id'))
                            .append( $('<a>')
                                    .text(objective.get('summary'))
                                    .attr('href', '#') 
                            );


                        // fetch via ajax when we go to open? is it needed?
                        var $activities = $('<li>')
                            .addClass('activities')
                            // .addClass('has-children')
                            .append( $('<a>').text(self.localizable.get('ACTIVITIES')).attr('href', '#') )
                            .append('<ul>')
                            .find('ul');
                        if (currentObjective && objective.get('id') == currentObjective.get('id')) {
		                    if (router.chapter == pageStructure.CHAPTER_ACTIVITIES) $activities.parent().addClass('current');                                                
                        };
                        $objLi.append( $('<ul>').append($activities.parent()) );

                        $objectives.append($objLi);
                    });

                    $li.append( $('<ul>').append($objectives.parent()) );

                }
            );

            $projects.on(router.clicktype, 'a', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(e.target);
                var themeId = $this.closest('.project').data('themeId');
                console.debug('themeId = ' + themeId);

                // clicking project goes to the project
                // clicking objectives or an individual objective goes to objectives for the project
                // activities or an individual activity
                var isObjectives = $this.closest('li').is('.objectives');
                var objectiveId = $this.closest('li.objective').data('objectiveId');

                var isActivities = $this.closest('li').is('.activities');
                var activityId = $this.closest('li').data('activityId');

                if (isObjectives) {
                    router.pageNavigationView.goObjectivePage(themeId, objectiveId);
                } 
                else if (isActivities) {
                    router.pageNavigationView.goActivityPage(objectiveId);
                }
                else if (objectiveId) {
                    router.pageNavigationView.goObjectivePage(themeId, objectiveId);
                }
                else {
                    // go to project
                    router.pageNavigationView.goThemePage(themeId);
                }

                vex.close($this.closest('.vex').data().vex.id);

            });

            vex.dialog.open({
                className: 'vex-theme-plain',
                message: "Jump to projects, objectives or activities",
                contentClassName: 'navigator',
                buttons: [
                    $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
                    ],
                input: $projects,
                afterOpen: function($vexContent) {
                    return $vexContent.find('#projects').bonsai();
                }
            });
        }


    });

    return view;
});