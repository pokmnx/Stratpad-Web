define(['Config'],

	function (config) {

	    var pageStructure = {

	    	// could look up on the fly
	    	// eg. _.indexOf(pageStructure._pageTree, _.findWhere(pageStructure._pageTree, {name:'SECTION_FINANCIALS'}))
	    	// but just keep them uptodate manually for now
	    	
			SECTION_REFERENCE: 0,
			CHAPTER_WELCOME: 0,
			PAGE_READY_TO_START: 6,

			SECTION_FORM: 1,
			CHAPTER_ABOUT: 0,
			CHAPTER_DISCUSSION: 1,
			// CHAPTER_STRATEGY: 2,
			PAGE_STRATEGY: 7,
			CHAPTER_THEMES: 2,
			CHAPTER_OBJECTIVES: 3,
			CHAPTER_ACTIVITIES: 4,
			CHAPTER_FINANCIAL_EDITS: 5,

            SECTION_PLAN: 2,
            CHAPTER_BIZ_PLAN: 1,

			SECTION_REPORT: 3,
			CHAPTER_STRATEGY_MAP: 0,

			SECTION_FINANCIALS: 4,
			SECTION_STRATBOARD: 5,
			
			SECTION_COMMUNITY: 6,
			CHAPTER_HOW_CONNECT_WORKS: 0,
			PAGE_HOW_CONNECT_WORKS: 0,

			CHAPTER_LENDERS_AND_INVESTORS: 1,
			PAGE_BUSINESS_BACKGROUND: 0,

			CHAPTER_PROFESSIONAL_SERVICES: 2,

			CHAPTER_MY_ACCOUNT: 5,
			PAGE_CONNECT_REPORT: 3, 

			SECTION_BUSINESS101: 7,




	    	//*********** init

	    	initListeners: function(themeCollection, objectiveCollection, chartCollection) {
	    		var self = this;

	            // let pagestructure listen for theme additions
	            themeCollection.on("add", function(theme) {
	              console.debug("Adding theme to pageStructure: " + theme.get("name")  );
	              self.addThemePage();
	            });

	            // let pagestructure listen for theme removals
	            themeCollection.on("destroy", function(theme) {
	                console.debug("Removing theme from pageStructure: " + theme.get("name"));
	                self.removeThemePage();
	            }.bind(this));  

	            themeCollection.on("reset", function() {
	                console.debug("Removing all themes from pageStructure.");
	                self.resetThemePages();
	            }.bind(this));  


	            // for activities, remember that we list them by their objective, and show a list of activities for that objective
	            // thus, we listen for changes on the objective collection, and then add an activities page

	            // let pagestructure listen for objective additions
	            objectiveCollection.on("add", function(objective) {
	              console.debug("Adding objective to pageStructure: " + objective.get("summary")  );
	              self.addActivitiesDetailPage();
	            });

	            // let pagestructure listen for objective removals
	            objectiveCollection.on("destroy", function(objective) {
	                console.debug("Removing ActivitiesDetail page from pageStructure: " + objective.get("summary"));
	                self.removeActivitiesDetailPage();
	            }.bind(this));  

	            objectiveCollection.on("reset", function() {
	                console.debug("Removing all ActivitiesDetail pages from pageStructure.");
	                self.resetActivitiesDetailPages();
	            }.bind(this));  

	            // charts

	            chartCollection.on("add", function(chart) {
	              console.debug("Adding chart to pageStructure: " + chart.get("title")  );
	              self.addChartPage();
	            });

	            chartCollection.on("destroy", function(chart) {
	                console.debug("Removing Chart page from pageStructure: " + chart.get("summary"));
	                self.removeChartPage();
	            }.bind(this));  

	            chartCollection.on("reset", function() {
	                console.debug("Removing all Chart pages from pageStructure.");
	                self.resetChartPages();
	            }.bind(this));  

	    	},


	    	//*********** private

	    	_getPageTree: function() {
	    		
	    		if(!this._pageTree) {
			    	var financialPages;
			    	if (config.disableFinancials) {
			    		 financialPages = [
			                {name:'PAGE_AR', ref:'AccountsReceivableView'},
			                {name:'PAGE_AP', ref:'AccountsPayableView'},
			                {name:'PAGE_INVENTORY', ref:'InventoryView'},			                
			                {name:'PAGE_LOANS', ref:'LoansView'},
			                {name:'PAGE_ASSETS', ref:'AssetsView'},
			                {name:'PAGE_EQUITIES', ref:'EquitiesView'},
			                {name:'PAGE_SALES_TAX', ref:'SalesTaxView'},
			                {name:'PAGE_OPENING_BALANCES', ref:'OpeningBalancesView'}
			            ];
			    	} else {
			    		financialPages = [
			                {name:'PAGE_AR', ref:'AccountsReceivableView'},
			                {name:'PAGE_AP', ref:'AccountsPayableView'},
			                {name:'PAGE_INVENTORY', ref:'InventoryView'},
			                {name:'PAGE_LOANS', ref:'LoansView'},
			                {name:'PAGE_ASSETS', ref:'AssetsView'},
			                {name:'PAGE_EQUITIES', ref:'EquitiesView'},
			                {name:'PAGE_EMPLOYEE_DEDUCTIONS', ref:'EmployeeDeductionsView'},
			                {name:'PAGE_SALES_TAX', ref:'SalesTaxView'},
			                {name:'PAGE_INCOME_TAX', ref:'IncomeTaxView'},
			                {name:'PAGE_OPENING_BALANCES', ref:'OpeningBalancesView'}
			            ];
			    	};
	    			this._pageTree = 
					[
						{
							name: 'SECTION_REFERENCE',
							chapters: [
								{
                                    name:'CHAPTER_WELCOME',
                                    pages:[
                                        {ref:'/reference/%s/welcome/welcome01.html'},
                                        {ref:'/reference/%s/welcome/welcome02.html'},
                                        {ref:'/reference/%s/welcome/welcome03.html'},
                                        {ref:'/reference/%s/welcome/welcome04.html'},
                                        {ref:'/reference/%s/welcome/welcome05.html'},
                                        {ref:'/reference/%s/welcome/welcome06.html'},
                                        {ref:'/reference/%s/welcome/welcome07.html'}
                                    ]
                                }
							]
						},

						{
							name: 'SECTION_FORM',
							chapters: [
								{name:'CHAPTER_ABOUT', pages:[{ref:'F1.AboutYourStrategy'}]}, // 1 page
								{
									name:'CHAPTER_DISCUSSION',
									pages: [
										{name:'PAGE_CUSTOMERS', ref:'Customers', old:'F2.1.Discussion'},
										{name:'PAGE_KEY_PROBLEMS', ref:'KeyProblems', old:'F2.2.Discussion'},
										{name:'PAGE_ADDRESS_PROBLEMS', ref:'AddressProblems', old:'F2.3.Discussion'},
										{name:'PAGE_COMPETITORS', ref:'Competitors', old:'F2.4.Discussion'},
										{name:'PAGE_BIZ_MODEL', ref:'BizModel', old:'F2.5.Discussion'},
										{name:'PAGE_SALES_AND_MARKETING', ref:'SalesAndMarketing'},
										{name:'PAGE_EXPANSION', ref:'Expansion', old:'F2.6.Discussion'},
										{name:'PAGE_ASPIRATION', ref:'Aspiration', old:'F2.7.Discussion'},
										{name:'PAGE_STRATEGY', ref:'StrategyStatement', old:'F3.StrategyStatement'},
										{name:'PAGE_MANAGEMENT', ref:'Management'}
									]
								},
								{name:'CHAPTER_THEMES', ref:'F4.ThemeDetail', pages:[]}, // dynamic pages
								{name:'CHAPTER_OBJECTIVES', ref:'ObjectivesDetail', pages:[]}, // dynamic pages
								{name:'CHAPTER_ACTIVITIES', ref:'ActivitiesDetail', pages:[]}, // dynamic pages
                                {
                                    name: 'CHAPTER_FINANCIAL_EDITS',
                                    pages: financialPages
                                }								
							]
						},

                        {
                            name: 'SECTION_PLAN',
                            chapters: [
                                {name:'CHAPTER_SUMMARY_BIZ_PLAN', ref:'R9.BizPlanSummary', pages:[{ref:'R9.BizPlanSummary'}]},
                                {name:'CHAPTER_BIZ_PLAN', ref:'R12.BizPlan', pages:[{ref:'R12.BizPlan'}]},
                                {name:'CHAPTER_PLAYBOOK', ref:'Playbook', pages:[{ref:'Playbook'}]}                                
                            ]
                        },

						{
							name: 'SECTION_REPORT',
							chapters: [
								{name:'CHAPTER_STRATEGY_MAP', ref:'R1.StrategyMap', pages:[{ref:'R1.StrategyMap'}]},
								{name:'CHAPTER_PROJECT_DETAIL', ref:'R5.ThemeDetail', pages:[{ref:'R5.ThemeDetail'}]},
								{name:'CHAPTER_GANTT', ref:'R6.Gantt', pages:[{ref:'R6.Gantt'}]},
								{name:'CHAPTER_PROJECT_PLAN', ref:'R7.ProjectPlan', pages:[{ref:'R7.ProjectPlan'}]},
								{name:'CHAPTER_AGENDAS', ref:'R8.Agenda', pages:[{ref:'R8.Agenda'}]},
								{name:'CHAPTER_PROJECTIONS_MONTHLY_OVERALL', ref:'R2.StrategyByMonth', pages:[{ref:'R2.StrategyByMonth'}]},
								{name:'CHAPTER_PROJECTIONS_MONTHLY_PROJECT', ref:'R4.ThemeByMonth', pages:[{ref:'R4.ThemeByMonth'}]},
								{name:'CHAPTER_PROJECTIONS_SUMMARY', ref:'R3.StrategyByTheme', pages:[{ref:'R3.StrategyByTheme'}]}
							]
						},

						{
							name: 'SECTION_FINANCIALS',
							chapters: [
								{name:'CHAPTER_SUMMARY_IS', pages:[{ref:'IncomeStatementSummary'}]},
								{name:'CHAPTER_SUMMARY_CF', pages:[{ref:'CashFlowSummary'}]},
								{name:'CHAPTER_SUMMARY_BS', pages:[{ref:'BalanceSheetSummary'}]},
								{name:'CHAPTER_DETAIL_IS', pages:[{ref:'IncomeStatementDetail'}]},
								{name:'CHAPTER_DETAIL_CF', pages:[{ref:'CashFlowDetail'}]},
								{name:'CHAPTER_DETAIL_BS', pages:[{ref:'BalanceSheetDetail'}]},
								{name:'CHAPTER_DETAIL_WS', pages:[{ref:'WorksheetDetail'}]}
							]
						},

						{
							name: 'SECTION_STRATBOARD',
							chapters: [
								{name:'CHAPTER_SUMMARY_CHARTS', pages:[{ref:'StratBoardSummary'}]}
								// further chapters are dynamic, all have only a single page
							]
						},

						{
							name: 'SECTION_COMMUNITY',
							chapters: [
								{
									name: 'CHAPTER_HOW_CONNECT_WORKS',
									pages: [{name:'PAGE_HOW_CONNECT_WORKS', ref:'views/community/myAccount/HowItWorksView'}]
								},
								{
									name: 'CHAPTER_LENDERS_AND_INVESTORS',
									pages: [
										{name:'PAGE_BUSINESS_BACKGROUND', ref:'BusinessBackgroundView'},
										{name:'PAGE_PERSONAL_CREDIT_HISTORY', ref:'PersonalCreditHistoryView'},
										{name:'PAGE_MATCHING_LENDERS_INVESTORS', ref:'MatchingLendersAndInvestorsView'}
										]
								},
								{
									name: 'CHAPTER_PROFESSIONAL_SERVICES',
									pages: [
										{name:'PAGE_ACCOUNTANTS', ref:'AccountantsView'},
										{name:'PAGE_BOOKKEEPERS', ref:'BookkeepersView'},
										{name:'PAGE_CONSULTANTS', ref:'ConsultantsView'},
										{name:'PAGE_LAWYERS', ref:'LawyersView'},
									]
								},
								{
									name: 'CHAPTER_SUPPORT_SERVICES',
									pages: [
										{name:'PAGE_COACHES_AND_MENTORS', ref:'CoachesView'},
										{name:'PAGE_MARKETING_FIRMS', ref:'MarketingFirmsView'},
										{name:'PAGE_WEB_DESIGNERS', ref:'WebDesignersView'},
										{name:'PAGE_GRAPHIC_DESIGNERS', ref:'GraphicDesignersView'},
									]
								},									
								{
									name: 'CHAPTER_PRODUCTS',
									pages: [
										{name:'PAGE_SOFTWARE', ref:'SoftwareView'}
									]
								},
								{
									name: 'CHAPTER_MY_ACCOUNT',
									pages: [
										{ref:'views/community/myAccount/CompanyInfoAndBudgetView'},
										{ref:'views/community/myAccount/LocationView'},
										{ref:'views/community/myAccount/ReportView'}
									]
								}
							]
						},						

						{
							name: 'SECTION_BUSINESS101',
							chapters: [
								{
									name:'CHAPTER_STRATEGY',
									pages: [
										{name:'onStrategy01', ref:'/reference/%s/onStrategy01.htm'},
										{name:'onStrategy02', ref:'/reference/%s/onStrategy02.htm'},
										{name:'onStrategy03', ref:'/reference/%s/onStrategy03.htm'},
										{name:'onStrategy04', ref:'/reference/%s/onStrategy04.htm'},
										{name:'onStrategy05', ref:'/reference/%s/onStrategy05.htm'},
										{name:'onStrategy06', ref:'/reference/%s/onStrategy06.htm'},
										{name:'onStrategy07', ref:'/reference/%s/onStrategy07.htm'},
										{name:'onStrategy08', ref:'/reference/%s/onStrategy08.htm'},
										{name:'onStrategy09', ref:'/reference/%s/onStrategy09.htm'},
										{name:'onStrategy10', ref:'/reference/%s/onStrategy10.htm'},
										{name:'onStrategy11', ref:'/reference/%s/onStrategy11.htm'},
										{name:'onStrategy12', ref:'/reference/%s/onStrategy12.htm'},
										{name:'onStrategy13', ref:'/reference/%s/onStrategy13.htm'},
										{name:'onStrategy14', ref:'/reference/%s/onStrategy14.htm'},
										{name:'onStrategy15', ref:'/reference/%s/onStrategy15.htm'},
										{name:'onStrategy16', ref:'/reference/%s/onStrategy16.htm'},
										{name:'onStrategy17', ref:'/reference/%s/onStrategy17.htm'},
										{name:'onStrategy18', ref:'/reference/%s/onStrategy18.htm'},
										{name:'onStrategy19', ref:'/reference/%s/onStrategy19.htm'},
										{name:'onStrategy20', ref:'/reference/%s/onStrategy20.htm'},
										{name:'onStrategy21', ref:'/reference/%s/onStrategy21.htm'},
										{name:'onStrategy22', ref:'/reference/%s/onStrategy22.htm'},
										{name:'onStrategy23', ref:'/reference/%s/onStrategy23.htm'},
										{name:'onStrategy24', ref:'/reference/%s/onStrategy24.htm'},
										{name:'onStrategy25', ref:'/reference/%s/onStrategy25.htm'},
										{name:'onStrategy26', ref:'/reference/%s/onStrategy26.htm'},
										{name:'onStrategy27', ref:'/reference/%s/onStrategy27.htm'},
										{name:'onStrategy28', ref:'/reference/%s/onStrategy28.htm'}
									]
								},
								{
									name:'CHAPTER_TOOLKIT',
									pages: [
										{name:'toolkit01', ref:'/reference/%s/toolkit01.htm'},
										{name:'toolkit02', ref:'/reference/%s/toolkit02.htm'},
										{name:'toolkit03_5', ref:'/reference/%s/toolkit03_5.htm'},
										{name:'toolkit03', ref:'/reference/%s/toolkit03.htm'},
										{name:'toolkit04', ref:'/reference/%s/toolkit04.htm'},
										{name:'toolkit05', ref:'/reference/%s/toolkit05.htm'},
										{name:'toolkit06', ref:'/reference/%s/toolkit06.htm'},
										{name:'toolkit07', ref:'/reference/%s/toolkit07.htm'},
										{name:'toolkit08', ref:'/reference/%s/toolkit08.htm'},
										{name:'toolkit09', ref:'/reference/%s/toolkit09.htm'},
										{name:'toolkit10', ref:'/reference/%s/toolkit10.htm'},
										{name:'toolkit11', ref:'/reference/%s/toolkit11.htm'},
										{name:'toolkit12', ref:'/reference/%s/toolkit12.htm'},
										{name:'toolkit13', ref:'/reference/%s/toolkit13.htm'},
										{name:'toolkit14', ref:'/reference/%s/toolkit14.htm'},
										{name:'toolkit15', ref:'/reference/%s/toolkit15.htm'},
										{name:'toolkit16', ref:'/reference/%s/toolkit16.htm'},
										{name:'toolkit17', ref:'/reference/%s/toolkit17.htm'},
										{name:'toolkit18', ref:'/reference/%s/toolkit18.htm'},
										{name:'toolkit19', ref:'/reference/%s/toolkit19.htm'},
										{name:'toolkit20', ref:'/reference/%s/toolkit20.htm'}
									]
								},
								{name:'CHAPTER_STATEMENTS', pages:[{ref:config.wpUrl + '/schoolpages/understanding-financial-statements-2/?iframe=1'}]},
								{name:'CHAPTER_COACH', pages:[{ref:config.wpUrl + '/schoolpages/small-business-coach/?iframe=1'}]},
								{name:'CHAPTER_BASICS', pages:[{ref:config.wpUrl + '/schoolpages/financial-basics-for-the-savvy-startup/?iframe=1'}]},
								{name:'CHAPTER_HOW_DO_I', pages:[{ref:config.wpUrl + '/schoolpages/misc/?iframe=1'}]},
								{name:'CHAPTER_VIDEO_COURSE', pages:[{ref:config.wpUrl + '/schoolpages/create-your-business-plan-with-stratpad-21-videos/?iframe=1'}]}
							]
						}

					];

	    		};
	    		return this._pageTree;
	    	},

	        _getPageMap: function() {
	        	// {"000,000,000":"welcome01.htm", "000,000,001":"welcome02.htm", ...}
	        	// ie 0-based section,chapter,page:filename 
	        	if (!this._pageMap) {
	        		var pageTree = this._getPageTree();
					this._pageMap = {};
					for (var i = 0; i < pageTree.length; i++) {
						var section = pageTree[i];
						for (var j = 0; j < section.chapters.length; j++) {
							var chapter = section.chapters[j];
							for (var k = 0; k < chapter.pages.length; k++) {
								var page = chapter.pages[k];
								this._pageMap[this._key(i, j, k)] = page.ref;
							}
						}
					}
	        	}
	        	return this._pageMap;
	        },

			_zfill: function(number, size) {
				return (Math.pow(10,size) + number*1 + '').substr(1);
			},

			_key: function(s, c, p) {
				// zero-pad the numbers so that we can sort the keys effectively
				return sprintf('%s,%s,%s', this._zfill(s,3), this._zfill(c,3), this._zfill(p,3));
			},	    	


	    	//*********** activitiesDetail


	    	addActivitiesDetailPage: function() {
	    		var chapter = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_ACTIVITIES];
				chapter.pages.push({ref:chapter.ref});
	    		var key = this._key(this.SECTION_FORM, this.CHAPTER_ACTIVITIES, chapter.pages.length-1);
	    		var pageMap = this._getPageMap();
				pageMap[key] = chapter.ref;

	    	},

	    	removeActivitiesDetailPage: function() {
	    		var activityPages = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_ACTIVITIES].pages;
	    		if (activityPages.length > 0) {
		    		activityPages.pop();	    			
	    		};

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},

	    	resetActivitiesDetailPages: function() {
	    		this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_ACTIVITIES].pages = [];

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},


	    	//*********** ThemeDetail


	    	addThemePage: function() {
	    		var chapter = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_THEMES];
	    		chapter.pages.push({ref:chapter.ref});
	    		var key = this._key(this.SECTION_FORM, this.CHAPTER_THEMES, chapter.pages.length-1);
	    		var pageMap = this._getPageMap();
				pageMap[key] = chapter.ref;

				// we also have to do objectives at the same time
	    		chapter = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_OBJECTIVES];
	    		chapter.pages.push({ref:chapter.ref});
	    		var key = this._key(this.SECTION_FORM, this.CHAPTER_OBJECTIVES, chapter.pages.length-1);
	    		var pageMap = this._getPageMap();
				pageMap[key] = chapter.ref;

	    	},

	    	removeThemePage: function() {
	    		var themePages = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_THEMES].pages;
	    		if (themePages.length > 0) {
		    		themePages.pop();	    			
	    		};

	    		var objectivesDetailPages = this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_OBJECTIVES].pages;
	    		if (objectivesDetailPages.length > 0) {
		    		objectivesDetailPages.pop();	    			
	    		};

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},

	    	resetThemePages: function() {
	    		this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_THEMES].pages = [];
	    		this._getPageTree()[this.SECTION_FORM].chapters[this.CHAPTER_OBJECTIVES].pages = [];
	    		this._getPageTree()[this.SECTION_REPORT].chapters[this.CHAPTER_STRATEGY_MAP].pages = [{ref:'R1.StrategyMap'}];

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},


	    	//*********** charts


	    	addChartPage: function() {
	    		// there is only 1 chart page per chapter; really we're adding a chapter
	    		var chartChapters = this._getPageTree()[this.SECTION_STRATBOARD].chapters;
	    		chartChapters.push({pages:[{ref:'ChartPage'}]});

	    		var key = this._key(this.SECTION_STRATBOARD, chartChapters.length-1, 0);
	    		var pageMap = this._getPageMap();
				pageMap[key] = 'ChartPage';
	    	},

	    	removeChartPage: function() {
	    		var chartChapters = this._getPageTree()[this.SECTION_STRATBOARD].chapters;
	    		if (chartChapters.length > 0) {
		    		chartChapters.pop();			
	    		};

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},

	    	resetChartPages: function() {
	    		this._getPageTree()[this.SECTION_STRATBOARD].chapters = [this._getPageTree()[this.SECTION_STRATBOARD].chapters[0]];

	    		// lazily remove from pageMap (by recreating it) 
	    		this._pageMap = null;
	    	},


	    	//*********** misc


	    	// adds (or removes) a bunch of the requisite pages to the specified report chapter
	    	setNumberOfReportPages:function(reportChapterIndex, numberOfPages) {
	    		var chapter = this._getPageTree()[this.SECTION_REPORT].chapters[reportChapterIndex];
	    		if (chapter.pages.length != numberOfPages) {
	    			var reportPageName = chapter.ref;
	    			chapter.pages.length = 0;
		    		var pageMap = this._getPageMap();
	    			for (var i = 0; i < numberOfPages; i++) {
	    				// _pageTree
	    				chapter.pages.push({ref:reportPageName});
	    			};
		    		// lazily remove from pageMap (by recreating it) 
		    		this._pageMap = null;
	    		}
	    	},

	    	toggleCommunityPages:function(isReadOnly) {
    			var chapter = this._getPageTree()[this.SECTION_COMMUNITY].chapters[this.CHAPTER_LENDERS_AND_INVESTORS];
    			if (!this.chapterLendersAndInvestorsPages) {
    				this.chapterLendersAndInvestorsPages = chapter.pages;
    			}
	    		if (isReadOnly) {
	    			chapter.pages = [ this.chapterLendersAndInvestorsPages[0] ];
	    		}
	    		else {
	    			chapter.pages = this.chapterLendersAndInvestorsPages;
	    		}
	    	},

			// reverse lookup - given 'onStrategy02.htm', what is nav?
			navForPageRef: function(pageRef) {
				var key, pageMap = this._getPageMap();
				_.each(pageMap, function (v, k) {
				    if (v.endsWith(pageRef)) {
				      key = k;
				    }
				});

				var parts = key.split(',');
				var nav = sprintf('#nav/%s/%s/%s', parts[0]*1, parts[1]*1, parts[2]*1);
				return nav;
			},

			// given nav coords, what piece of js/html should we use?
			getFileName: function(section, chapter, page) {
				var pageTree = this._getPageTree();
				var s = pageTree[section];
				var c = s.chapters[chapter];
				if (page == -1) {
					return c.ref;
				}
				else if (page < c.pages.length) {
					return c.pages[page].ref;
				}
				else {
					return c.ref;
				}
			},

			// convenience function
			urlForCoords: function (section, chapter, page) {
				return sprintf('#nav/%s/%s/%s', section*1, chapter*1, page*1);
			},

			getSectionName: function(section) {
				var pageTree = this._getPageTree();
				var s = pageTree[section];
				if (s && s.hasOwnProperty('name') && s.name)  {
					return s.name;
				} else {
					return 'SECTION_' + section;
				}
			},

			getChapterName: function(section, chapter) {
				var pageTree = this._getPageTree();
				var s = pageTree[section];
				var c = s.chapters[chapter];
				if (c && c.hasOwnProperty('name') && c.name)  {
					return c.name;
				} else {
					// for charts, where we add chapters on the fly
					return 'CHAPTER_' + chapter;
				}
			},

			getPageName: function(section, chapter, page) {
				var pageTree = this._getPageTree();
				var s = pageTree[section];
				var c = s.chapters[chapter];
				if (page == -1) {
					return 'PAGE_' + page;
				}				
				else if (page < c.pages.length) {
					var p = c.pages[page];
					if (p.hasOwnProperty('name')) {
						return p.name;
					} else {
						return 'PAGE_' + page;
					}
				}
				else {
					return 'PAGE_' + page;
				}
			},

			getNumberOfPagesInChapter: function(section, chapter) {
				var pageTree = this._getPageTree();
				var c = pageTree[section].chapters[chapter];
				return  c.pages.length;
			},

			pageExists: function(section, chapter, page) {
				var pageTree = this._getPageTree();
				var s = pageTree[section];
				if (!s) return false;
				if (chapter >= s.chapters.length) return false;
				var c = s.chapters[chapter];
				return (page < c.pages.length);
			},


			//*********** page nav


			nextPageKey: function(section, chapter, page) {

				var pages = this._getPageMap();
				var curPageKey = this._key(section, chapter, page);
				var keys = Object.keys(pages).sort();
				var idx = _.indexOf(keys, curPageKey, true);

				var nextIdx = idx + 1;
				if (nextIdx >= keys.length) {
					nextIdx = 0;
				}

				var nextPageKey = keys[nextIdx];
				return nextPageKey;
			},

			prevPageKey: function(section, chapter, page) {
				var pages = this._getPageMap();
				var curPageKey = this._key(section, chapter, page);
				var keys = Object.keys(pages).sort();
				var idx = _.indexOf(keys, curPageKey, true);

				var prevIdx = idx - 1;
				if (prevIdx < 0) {
					prevIdx = keys.length - 1;
				}

				var prevPageKey = keys[prevIdx];
				return prevPageKey;
			},

			firstPageKeyInChapter: function(section, chapter) {
				return this._key(section, chapter, 0);
			},

			lastPageKeyInChapter: function(section, chapter) {
				var sections = this._getPageTree();
				var pages = sections[section].chapters[chapter].pages;
				return this._key(section, chapter, pages.length - 1);
			},

			sanitizedPageComponents: function(s, c, p) {
				// make sure s,c,p are within limits
				// in other words after this, s, c, and p will always resolve to a page that exists
				// except in the case of dynamic pages - we will send -1 because the ajax to tell us the proper page hasn't finished yet

				var sections = this._getPageTree();

				// don't allow 0's or nils, etc
				var section = s ? s : 0;
				var chapter = c ? c : 0;
				var page = p ? p : 0;

				// confine to limits; 0-based for sections, chapters, pages
				section = Math.max(0, section);
				section = Math.min(sections.length - 1, section);
				var chapters = sections[section].chapters;

				chapter = Math.max(0, chapter);
				chapter = Math.min(chapters.length - 1, chapter);
				var pages = chapters[chapter].pages;

				page = Math.max(0, page);
				page = Math.min(pages.length - 1, page);

				return [section, chapter, page];	
			}

	    };

	    return pageStructure;
	}
);