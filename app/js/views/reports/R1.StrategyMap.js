define(['BaseReport', 'svg', 'PageStructure', 'Discussion'],

    function(BaseReport, SVG, pageStructure, Discussion) {

        var view = BaseReport.extend({

            reportName: 'StrategyMap',
            className: "StrategyMap",

            maxWidth: 6,
            maxThemesPerPage: 3,

            initialize: function(router, localizable) {
                _.bindAll(this, "load", 'draw', 'defferedLoad', 'renderToScreen', 'contentForPdf', 'createStratMapThemes', 'subSetOfObjectives', 'themeWidth');
                BaseReport.prototype.initialize.call(this, router, localizable);

                this.parts = 3;
                this.counter = 0;

                var self = this;

                if (!this.router) { return; } // support testing

                // we need to wait for the themeCollection and objectiveCollection to sync before rendering
                this.sfm = this.router.stratFileManager;
                this.sfm.themeCollection.on("sync", function() {
                      console.debug("Finished themeCollection sync" );
                      self.counter += 1;
                      self.defferedLoad();
                }, this.reportName);

                this.sfm.objectiveCollection.on("sync", function() {
                      console.debug("Finished objectiveCollection sync" );
                      self.counter += 1;
                      self.defferedLoad();
                }, this.reportName);

            },

            load: function(e) {
                // called when the page reloads, the stratfile is swapped, or the page is changed

                var self = this;

                BaseReport.prototype.load.call(this);

                $('#strategyMap').empty();
                $('#strategyMap').spin({top: '50px'}); 

                this.discussion = new Discussion({stratFileId: this.sfm.stratFileId});
                this.discussion
                    .off('sync', null, 'R1')
                    .on('sync', function() {
                          console.debug("Finished discussion sync" );
                          self.counter += 1;
                          self.defferedLoad();                    
                    }, 'R1');                

                if (e.type == 'pageChanged') {
                    // reload if its our first page, otherwise render what we have
                    if (this.router.page == 0) {
                        this.counter = 0;
                        this.sfm.themeCollection.fetch();
                        this.sfm.objectiveCollection.fetch();
                        this.discussion.fetch();
                    } else {
                        this.counter = 2;
                        this.discussion.fetch();
                    }

                } else if (e.type == 'stratFileLoaded') {
                    // could come from changing stratfiles, or if we initiated after a pageChanged (ie above on page 0), or if we reloaded the page

                    this.counter = 0;
                    this.discussion.fetch();
    
                    // reset to page 0 if we're changing stratfiles
                    var pageExists = pageStructure.pageExists(this.router.section, this.router.chapter, this.router.page);
                    if (!pageExists) {
                        this.router.page = 0;

                        var url = sprintf('#nav/%s/%s/%s', this.router.section, this.router.chapter, this.router.page);

                        // store the side navbar state
                        this.router._storeNavState();

                        // update the address bar and the history
                        this.router.navigate(url, {
                            // just update the address bar - don't actually load up this new page here
                            trigger: false,

                            // we want this in the browser history, so don't replace
                            replace: false
                        });

                    };

                } else {
                    console.warn('unknown event - ignoring');
                }

            },

            defferedLoad: function() {

                // make sure everything is loaded before rendering
                if (this.counter < this.parts) return;

                this.renderToScreen();

            },

            renderToScreen: function() {

                var $strategyMap = $('#strategyMap');

                // defensive
                $strategyMap.empty();
                
                // now we need to figure out how many pages we have
                // it is dictated by the number of themes and the number of objectives for a particular type
                // we can take up to 6 objectives across a page; 3 themes max per page
                // themes go in user order
                // fill up the 6 slots in order, splitting themes as necessary
                
                // so 1 theme, 4 objectives would be 1 page
                // 2 themes, 4 and 2 obj would be 1 page
                // 3 themes, 3 and 2 and 1 would be 1 page
                // 4 themes, 3x 1 and 2 would be 2 pages

                var stratMapThemes = this.createStratMapThemes();
                var numPages = Math.max(Object.keys(stratMapThemes).length, 1);

                // verify we have the right number of pages in pageStructure, and add (or subtract) if necessary
                pageStructure.setNumberOfReportPages(self.router.chapter, numPages);
                self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

                // strategy statement
                var r1 = {};
                r1.strategy = {};
                r1.strategy.goal = this.discussion.get('mediumTermStrategicGoal');
                if (!r1.strategy.goal || r1.strategy.goal == '') {
                    r1.strategy.goal = this.localized('r1_warn_no_strategy');
                }

                // themes
                r1.themes = stratMapThemes['page' + self.router.page];

                this.draw(r1, 'strategyMap');

                $('#pageContent').nanoScroller();


                $strategyMap
                    .css('height', $strategyMap.find('svg').attr('height'))
                    .spin(false);
            }, 

            contentForPdf: function() {
                var stratMapThemes = this.createStratMapThemes();
                var numPages = Math.max(Object.keys(stratMapThemes).length, 1);

                var $wrapper = $('<div id="printmap"></div>').css('display', 'none').appendTo($('body'));
                for (var page = 0; page < numPages; ++page) {
                    var $div = $('<div></div>').attr('id', 'page'+page).addClass('dynamicSubcontext').appendTo($wrapper);

                    // strategy statement
                    var r1 = {};
                    r1.strategy = {};
                    r1.strategy.goal = this.discussion.get('mediumTermStrategicGoal');
                    if (!r1.strategy.goal || r1.strategy.goal == '') {
                        r1.strategy.goal = this.localized('r1_warn_no_strategy');
                    };

                    // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                    var $subcontext = $('<h6>')
                        .prop('id', 'subcontext' + (page+1))
                        .addClass('subcontextEntry');
                    $wrapper.prepend($subcontext);

                    // themes
                    r1.themes = stratMapThemes['page' + page];

                    this.draw(r1, 'page'+page);
                };

                // prince doesn't see these as transparent
                $wrapper.find('svg a').remove();

                return $wrapper.remove();
            },            

            // draw into #strategyMap
            draw: function(json, nodeName) {

                // suitable for strategyWidth = 640px
                var objWidth = 100;
                var spacer = 8;
                var themeWidth = 2*objWidth + spacer;
                var rowHeight = 55;
                var rowSpacer = 50;

                var rowTop = 20;
                var rowLeft = 250;

                var canvas = SVG(nodeName).size('100%', '620px');
                canvas.initArrowHead();

                // all text
                canvas.style({'fill': '#444'});

                var showPointer = function() {
                    $(this).css('cursor','pointer');
                };

                // strategy statement - the bubble is clickable, text is not
                canvas.rowHeader({x:0, y:rowTop, width:rowLeft, height:rowHeight}, this.localized("strategy"), null);
                var strategy = canvas
                    .bubble({x:rowLeft, y:rowTop, width:themeWidth * 3 + spacer * 2, height:rowHeight}, '#eee', json.strategy.goal)
                    .on(this.router.clicktype, function() { 
                        this.router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_DISCUSSION, pageStructure.PAGE_STRATEGY, true);
                    }.bind(this))
                    .on('mouseover', showPointer);

                // themes & objectives
                rowTop += rowHeight + rowSpacer;
                var numThemes = json.themes.length;
                var totalSpan = 0;
                _.each(json.themes, function(themeWrapper) {
                    totalSpan += this.themeWidth(themeWrapper.objectives);
                }.bind(this));
                var contentWidth = totalSpan*objWidth + (totalSpan-1)*spacer;
                var insetLeft = (strategy.attr('width') - contentWidth)/2;
                var colLeft = rowLeft + insetLeft;
                var themeLeft = colLeft; 

                var showThemePage = function(themeId) { 
                    this.router.pageNavigationView.goThemePage(themeId);
                };

                var showObjectivePage = function(themeId) { 
                    this.router.pageNavigationView.goObjectivePage(themeId);
                };


                _.each(json.themes, function(themeWrapper, i) {

                    // themes
                    // - can only have 1, 2, or 3
                    // their position is dictated by the max number of objectives that they own - they go in the center of that
                    // we know that there can only be 6 objectives total across all themes on a page
                    // start at **bottom** row of objectives, so we can draw bubbles on top of the lines
                    // center objectives under their theme
                    // objects are plotted with a top-left origin


                    // we have 6 columns, and 5 spacers (6*100 + 5*8 = 640)
                    // column edges are flush with canvas area
                    // a theme width is 2 column plus 1 spacer
                    // max 3 themes
                    // all spacers are the same width, and separate all objects
                    // determine colwidth for a theme - 2-6
                    // determine total colWidths, so that we can figure out how much to inset the canvas, so the content is centered
                    // keep track of where we are as we progress across the page

                    // var strategyWidth = strategy.attr('width');
                    var themeSpan = this.themeWidth(themeWrapper.objectives);

                    // center theme in its themespan
                    var tw = objWidth*themeSpan + spacer*(themeSpan-1);
                    themeLeft = colLeft + tw/2 - themeWidth/2;

                    var themeBubble = canvas
                        .bubble({x:themeLeft, y:rowTop, width:themeWidth, height:rowHeight}, '#ccc', themeWrapper.theme.name)
                        .on(this.router.clicktype, function() { showThemePage(themeWrapper.theme.id); } )
                        .on('mouseover', showPointer);
                    themeBubble.arrow(strategy);
                    canvas.rowHeader({x:0, y:rowTop, width:rowLeft, height:rowHeight}, this.localized("themes"), this.localized('STRATEGY_MAP_VIEW_DESC_THEMES'));

                    // start at **bottom** row of objectives, so we can draw bubbles on top of the lines
                    var numObjectives, objLeft, objInset;
                    var objRowTop = rowTop + ((rowHeight + rowSpacer) * 4);
                    var staffObjectives = _.where(themeWrapper.objectives, {
                        type: 'STAFF'
                    });
                    canvas.rowHeader({x:0, y:objRowTop, width:rowLeft, height:rowHeight}, this.localized("OBJECTIVE_TYPE_STAFF"), this.localized('STRATEGY_MAP_VIEW_DESC_STAFF'));
                    numObjectives = staffObjectives.length;
                    objLeft = colLeft;
                    objLeft += (tw - (numObjectives*objWidth + (numObjectives-1)*spacer))/2;
                    _.each(staffObjectives, function(objective, j) {
                        var objectiveBubble = canvas
                            .bubble({x:objLeft, y:objRowTop, width:objWidth, height:rowHeight}, 'yellow', objective.summary)
                            .on(this.router.clicktype, function() { showObjectivePage(themeWrapper.theme.id); } )
                            .on('mouseover', showPointer);

                        objectiveBubble.arrow(themeBubble);
                        objLeft += objWidth + spacer;                        
                    });

                    objRowTop = rowTop + ((rowHeight + rowSpacer) * 3);
                    var processObjectives = _.where(themeWrapper.objectives, {
                        type: 'PROCESS'
                    });
                    canvas.rowHeader({x:0, y:objRowTop, width:rowLeft, height:rowHeight}, this.localized("OBJECTIVE_TYPE_PROCESS"), this.localized('STRATEGY_MAP_VIEW_DESC_PROCESS'));
                    numObjectives = processObjectives.length;
                    objLeft = colLeft;
                    objLeft += (tw - (numObjectives*objWidth + (numObjectives-1)*spacer))/2;
                    _.each(processObjectives, function(objective, j) {
                        var objectiveBubble = canvas
                            .bubble({x:objLeft, y:objRowTop, width:objWidth, height:rowHeight}, 'lightcyan', objective.summary)
                            .on(this.router.clicktype, function() { showObjectivePage(themeWrapper.theme.id); } )
                            .on('mouseover', showPointer);                            
                        objectiveBubble.arrow(themeBubble);
                        objLeft += objWidth + spacer;
                    });

                    objRowTop = rowTop + ((rowHeight + rowSpacer) * 2);
                    var customerObjectives = _.where(themeWrapper.objectives, {
                        type: 'CUSTOMER'
                    });
                    canvas.rowHeader({x:0, y:objRowTop, width:rowLeft, height:rowHeight}, this.localized("OBJECTIVE_TYPE_CUSTOMER"), this.localized('STRATEGY_MAP_VIEW_DESC_CUSTOMER'));
                    numObjectives = customerObjectives.length;
                    objLeft = colLeft;
                    objLeft += (tw - (numObjectives*objWidth + (numObjectives-1)*spacer))/2;
                    _.each(customerObjectives, function(objective, j) {
                        var objectiveBubble = canvas
                            .bubble({x:objLeft, y:objRowTop, width:objWidth, height:rowHeight}, 'orange', objective.summary)
                            .on(this.router.clicktype, function() { showObjectivePage(themeWrapper.theme.id); } )
                            .on('mouseover', showPointer);                            
                        objectiveBubble.arrow(themeBubble);
                        objLeft += objWidth + spacer;
                    });

                    objRowTop = rowTop + ((rowHeight + rowSpacer) * 1);
                    var financialObjectives = _.where(themeWrapper.objectives, {
                        type: 'FINANCIAL'
                    });
                    canvas.rowHeader({x:0, y:objRowTop, width:rowLeft, height:rowHeight}, this.localized("OBJECTIVE_TYPE_FINANCIAL"), this.localized('STRATEGY_MAP_VIEW_DESC_FINANCIAL'));
                    numObjectives = financialObjectives.length;
                    objLeft = colLeft;
                    objLeft += (tw - (numObjectives*objWidth + (numObjectives-1)*spacer))/2;
                    _.each(financialObjectives, function(objective, j) {
                        var objectiveBubble = canvas
                            .bubble({x:objLeft, y:objRowTop, width:objWidth, height:rowHeight}, 'lightgreen', objective.summary)
                            .on(this.router.clicktype, function() { showObjectivePage(themeWrapper.theme.id); } )
                            .on('mouseover', showPointer);                            
                        objectiveBubble.arrow(themeBubble);
                        objLeft += objWidth + spacer;
                    });

                    colLeft += tw + spacer;

                }.bind(this));

            },

            createStratMapThemes: function() {
                // now we need to figure out how many pages we have
                // it is dictated by the number of themes and the number of objectives for a particular type
                // we can take up to 6 objectives across a page; 3 themes max per page
                // themes go in user order
                // fill up the 6 slots in order, splitting themes as necessary
                
                // so 1 theme, 4 objectives would be 1 page
                // 2 themes, 4 and 2 obj would be 1 page
                // 3 themes, 3 and 2 and 1 would be 1 page
                // 4 themes, 3x 1 and 2 would be 2 pages
                                
                var sumWidths=0, themeCtr=0, curPageNum=0;
                var stratMapThemesDict = {}; // pageNum -> array of stratMapTheme

                // assign objectives to theme
                var sortedObjectives = this.sfm.objectiveCollection.toJSON();
                
                var sortedThemes = this.sfm.themeCollection.toJSON();
                this.sortThemes(sortedThemes);
                _.each(sortedThemes, function(theme) {
                    theme.type = 'Theme';
                    theme.objectives = _.where(sortedObjectives, {themeId: theme.id});
                });

                // now go through all our themes, and assign pageNum and objectives properties 
                //   by placing them in StratMapTheme container objects
                var ctr = 0;
                while (ctr < sortedThemes.length) {

                    // when a theme is split, it will be a StratMapTheme inserted into our array
                    var themeWidth;
                    var smt = {};
                    var objectives;
                    var obj = sortedThemes[ctr];
                    if (obj.type === 'Theme') {
                        // just a regular theme to deal with
                        smt.theme = obj;
                        objectives = smt.theme.objectives;
                        themeWidth = this.themeWidth(objectives);
                        
                    } else if (obj.type === 'SplitTheme') {
                        // take the properties for smt from the splitTheme
                        var splitTheme = obj;
                        smt.theme = splitTheme.theme;
                        objectives = splitTheme.objectives;
                        themeWidth = this.themeWidth(objectives);
                        
                    } else {
                        // error
                        console.error("Yikes - what is this in our array?" + obj);
                        return;
                    }
                    smt.pageNum = curPageNum;
                    
                    themeCtr++;

                    // what subset of objectives are on this page?
                    if (sumWidths + themeWidth > this.maxWidth) {
                        // we have to split this theme
                        var width = this.maxWidth - sumWidths;
                        
                        // no point in splitting if only 1 slot left (need 2)
                        // if less than 2, just put it on the next page 
                        if (width < 2) {
                            sortedThemes.splice(ctr+1, 0, smt.theme);
                            curPageNum++;
                            sumWidths = 0;
                            themeCtr = 0;
                            ctr++;
                            continue;
                        } else {
                            // make a new theme to be processed
                            var splitTheme = {type:'SplitTheme'};
                            splitTheme.theme = smt.theme;
                            
                            // put the first set on the current smt
                            smt.objectives = this.subSetOfObjectives(objectives, width, false);
                            
                            // put the remainder of the objectives on the splitTheme for subsequent processing
                            splitTheme.objectives = this.subSetOfObjectives(objectives, width, true);
                            
                            // add the splitTheme for subsequent processing
                            sortedThemes.splice(ctr+1, 0, splitTheme);

                        }
                        
                    } else {
                        // all objectives fit
                        smt.objectives = objectives;
                    }

                    // store the stratMapTheme that we have assembled in an array in a dict, keyed by pagenum
                    if (stratMapThemesDict.hasOwnProperty('page'+curPageNum)) {
                        stratMapThemesDict['page'+curPageNum].push(smt);
                    } else {
                        stratMapThemesDict['page'+curPageNum] = [smt];
                    }

                    // this is the full theme width for this iteration
                    // do we increment the page? ie. when we add this theme's objectives to the page, will it exceed our limit? 
                    sumWidths += themeWidth;
                    if (sumWidths >= this.maxWidth || themeCtr >= this.maxThemesPerPage) {
                        curPageNum++;
                        // figure out what is going on to the next page; 
                        // needs to be zero if we're not going to resolve on the next page
                        if (themeWidth > this.maxWidth) {
                            sumWidths = 0;
                        } else {
                            sumWidths = sumWidths % this.maxWidth; 
                        }
                        themeCtr = 0;
                    }
                    
                    ctr++;
                }

                return stratMapThemesDict;
            },

            /**
             * This grabs a subset of objectives, from objectives, across all types. We will never
             * have more than (count = width) objectives per type.
             * If forRemainder is true, then we grab the opposite subset of objectives.
             */
            subSetOfObjectives: function(objectives, width, forRemainder) {
                var subset = [];
                this.sortObjectivesByOrder(objectives);
                var mappedObjectives = {};
                
                // organize into map of category -> array of objectives
                _.each(objectives, function(objective) {
                    if (mappedObjectives.hasOwnProperty(objective.type)) {
                        mappedObjectives[objective.type].push(objective);
                    }
                    else {
                        mappedObjectives[objective.type] = [objective];
                    }
                });
                
                // now place objectives up to width in subset (respecting their order)
                _.each(mappedObjectives, function(objectives, type) {
                    for (var i = 0, ct=Math.min(width, objectives.length); i < ct; ++i) {
                        subset.push(objectives[i]);
                    };
                });
                
                // now return either the subset we made, or whatever was left over
                if (forRemainder) {
                    return _.difference(objectives, subset);
                } else {
                    return subset;
                }
            },           

            /*
             * max number of objectives of one particular type, amongst objectives
             */
            themeWidth: function(objectives) {
                // map of objectiveCategory -> ct
                var counts = {};
                this.sortObjectivesByOrder(objectives);
                _.each(objectives, function(objective) {
                    if (counts.hasOwnProperty(objective.type)) {
                        counts[objective.type] += 1;
                    }
                    else {
                        counts[objective.type] = 1;
                    }
                });

                // highest number of objectives
                var themeWidth = _.reduce(_.values(counts), function(memo, num){ return Math.max(memo, num); }, 0);

                // normalize to at least 2
                return Math.max(2, themeWidth);
            }

        });

        return view;
    });