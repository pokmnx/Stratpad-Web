define(['StratFile', 'ChartCollection', 'ChartListView', 'Dictionary', 'Chart', 'MetricChart', 'ProjectionChart', 'Projection', 'Config', 'spectrum'],

function(StratFile, ChartCollection, ChartListView, Dictionary, Chart, MetricChart, ProjectionChart, Projection, config) {

    var view = Backbone.View.extend({

        el: '#charts',

        initialize: function(router, localizable) {
            _.bindAll(this, "_showEditChartDialog", "_showAddChartDialog", "_showDeleteChartDialog", "_setUpChartDialog", "_monthYearHeader", "_applyPermissions");

            this.router = router;
            this.localizable = new Dictionary(localizable);
            var self = this;

            // load charts once SBM is finished
            $(document).bind("chartsLoaded.charts", function(e, chartCollection) {
            	// this seems to be a backbone bug - if chartCollection has 0 elements, it is not passed in the trigger
                self.chartCollection = self.router.stratBoardManager.chartCollection;
                self.$el.find('ul.chartHeader li.monthYearHeader').empty().append(self._monthYearHeader());
                self.chartListView = new ChartListView(self.router, self.chartCollection, self.startDate, self.localizable );
                self.chartListView.render();
                self._applyPermissions();
                self.$el.find('ul.sortable').spin(false);
                self.$el.find('.tooltip').tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250});
                
                // let shared users know what page we're on
                self.router.messageManager.sendPageUpdate();            
            });

            // new paradigm for us - on pageChanged, load up the charts again
            $(document).bind("pageChanged.charts", function() {
                console.debug("Get ready to fetch some charts data");
	            self.chartCollection = self.router.stratBoardManager.chartCollection;
                self.chartCollection.reset();
	            self.chartCollection.fetch({
	                success: function() {
	                    self.$el.find('ul.chartHeader li.monthYearHeader').empty().append(self._monthYearHeader());
	                    self.chartListView = new ChartListView(self.router, self.chartCollection, self.startDate, self.localizable );
	                    self.chartListView.render();
                        self._applyPermissions();
	                    self.$el.find('ul.sortable').spin(false);
                        self.$el.find('.tooltip').tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250});
	                },
	                error: function(model, xhr, options) {
	                    console.error(sprintf("Oops, couldn't load charts. Status: %s %s", xhr.status, xhr.statusText));
                        self._applyPermissions();
	                    self.$el.find('ul.sortable').spin(false);
	                }
	            });
                // let shared users know what page we're on
                self.router.messageManager.sendPageUpdate();                            
            });

            this.$el
                .off('click.chartTools')
                .on('click.chartTools', "button.icon-new-tools", function(e) {
                    // edit or add, depending on whether the row is an chart or a noRows                     
                    var $ele = $(this).closest('.chartItem');
                    var isNoRowsItem = $ele.find('.noCharts').length;
                    if (isNoRowsItem) {
                        self._showAddChartDialog(e);
                    } else {
                        var chartId = $ele.data().chartId;
                        self._showEditChartDialog(e, chartId);
                    }
                })
                .on('click.chartTools', "li.chartItem nav > .deleteChart", function(e) {
                    var chartId = $(this).closest('li.chartItem').data().chartId;
                    self._showDeleteChartDialog(e, chartId);
                });

            $('#pageContent')
                .off('click.newChart')
                .on('click.newChart', ".addButton, #newChart", function(e) {
                    self._showAddChartDialog(e);
                });

            this.$el.find('ul.sortable').spin();            

        },

        _applyPermissions: function() {

            var stratFile = this.router.stratFileManager.currentStratFile();

            // permissions status field
            var $perms = this.$el.find('.permissions');            

            if (stratFile.hasWriteAccess('STRATBOARD')) {

                this.$el.find('.addButton').show();

                $perms.hide();
                
            }
            else if (stratFile.hasReadAccess('STRATBOARD')) {

                this.$el.find('.addButton').hide();

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // no access

                this.$el.find('.addButton').hide();                    

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }

        },        

        _showEditChartDialog: function(e, chartId) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogEditChartTitle'),
                template = $('#dialogEditAddChart').clone().html();

            var chart = this.chartCollection.get(chartId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogEditChartOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    onSubmit: function(e) {
                        // add the chart

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        $vexContent.find('#chartFields').spin();

                        e.preventDefault();
                        e.stopPropagation();

                        // bug in select2 3.3.2, where disabled attr is added when set to readonly (fixed later)
                        $form.find('#chartType').attr('disabled', false);

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});
                        if (chart.entityName == 'MetricChart') {

                        	var metric = $form.find('#chartMetric').select2('data');
                        	var cs = _.find(Chart.colorSchemes, function(cs) {return (cs.colors[0] == data.chartColor.toUpperCase().replace(/^#/,''))});

                            // do this just so we can check what changed
				            chart.set({
				                'stratFileId': metric.stratFileId,
				                'themeId': metric.themeId,
				                'objectiveId': metric.objectiveId,
				                'metricId': metric.id,
	                            'title': data.chartTitle.length > 0 ? data.chartTitle : self.localizable.get('untitledChart'),
	                            'chartType': data.chartType.length > 0 ? data.chartType : null,
	                            'colorScheme': cs.idx.toString(),
	                            'zLayer': 0			                
				            });
				            chart.updateUrl();

	                        // if metric changes, we are actually deleting the old chart and making a new chart (because chart is a child of metric)
				            if (chart.changedAttributes() && 'metricId' in chart.changedAttributes()) {
					            var newChart = new MetricChart({
					                'stratFileId': metric.stratFileId,
					                'themeId': metric.themeId,
					                'objectiveId': metric.objectiveId,
					                'metricId': metric.id,
		                            'title': data.chartTitle.length > 0 ? data.chartTitle : self.localizable.get('untitledChart'),
		                            'chartType': data.chartType.length > 0 ? data.chartType : null,
		                            'colorScheme': cs.idx,
		                            'zLayer': 0
					            });

					           	newChart.save(null, {
		                            success: function(model, response, options) {
		                                console.debug("Saved chart with id: " + model.get("id"));
		                                self.chartCollection.add(model);
		                                $vexContent.find('#chartFields').spin(false);

                                        // delete the old chart
		                                var prev = chart.previousAttributes();
							            chart.set({
							                'stratFileId': prev.stratFileId,
							                'themeId': prev.themeId,
							                'objectiveId': prev.objectiveId,
							                'metricId': prev.metricId
							            });	
	        				            chart.updateUrl();	                                
			                            chart.destroy({
			                                success: function(model, response, options) {
			                                    console.debug("Deleted chart with id: " + model.get("id"));
			                                },
			                                error: function(model, xhr, options) {
			                                    console.error("Oops, couldn't delete chart.");
			                                }
			                            });
		                                
		                                // close
		                                return vex.close($vexContent.data().vex.id);
		                            },
		                            error: function(model, xhr, options) {
		                                console.error("Oops, couldn't save chart.");
		                                $vexContent.find('#chartFields').spin(false);
		                                // todo: error message
		                            }
		                        });                        					            	
				            }
				            else {
		                        chart.save(null, {
		                            success: function(model, response, options) {
		                                console.debug("Saved chart with id: " + model.get("id"));
		                                $vexContent.find('#chartFields').spin(false);
		                                
		                                // close
		                                return vex.close($vexContent.data().vex.id);
		                            },
		                            error: function(model, xhr, options) {
		                                console.error("Oops, couldn't save chart.");
		                                $vexContent.find('#chartFields').spin(false);
		                                // todo: error message
		                            }
		                        });                        					            	
				            }

                        } 
                        else {
                            // save projection chart - we'll have to change the projection if needed, and the ProjectionChart (point is not to lose the measurements)
                            console.debug('saving projection chart');

                            // do this just so we can check what changed
                            var cs = _.find(Chart.colorSchemes, function(cs) {return (cs.colors[0] == data.chartColor.toUpperCase().replace(/^#/,''))});
                            chart.set({
                                'title': data.chartTitle.length > 0 ? data.chartTitle : self.localizable.get('untitledChart'),
                                'chartType': data.chartType.length > 0 ? data.chartType : null, 
                                'colorScheme': cs.idx.toString()
                            });
                            chart.updateUrl();

                            var deferred = $.Deferred();
                            deferred.resolve();

                            // since projection never actually changes, can save the chart separately
                            // we're just using the constant accountName in the select, rather than the id, so that we don't need to keep track of full projection entities
                            var projectionAccountName = $form.find('#chartMetric').select2('data').id;
                            var projectionSource = data.hasOwnProperty('linkToQBO') ? 'QBO' : 'GAE';
                            var isProjectionChanged = projectionAccountName != chart.get('projectionAccountName') 
                                    || projectionSource != chart.get('projectionSource');
                            if (isProjectionChanged) {

                                // need to update the parent projection - don't need a new one or anything
                                var projection = new Projection({
                                    'id': chart.get('projectionId'),
                                    'stratFileId': chart.get('stratFileId'),
                                    'accountName': projectionAccountName,
                                    'source': data.linkToQBO ? 'QBO' : 'GAE'
                                });

                                // make sure our chartrow gets updated
                                chart.set('projectionAccountName', projectionAccountName);
                                chart.set('projectionSource', projectionSource);

                                // now save it
                                deferred = deferred.then(function() {
                                    return projection.save(null, {
                                        success:function(model, response, options) {
                                            console.debug('Saved projection: ' + projection.get('id'));
                                        },
                                        error: function(model, xhr, options) {
                                            console.error("Oops, couldn't save projection.");
                                            // todo: error message
                                        }
                                    });
                                });

                            };

                            if (chart.changedAttributes()) {
                                deferred = deferred.then(function() {
                                    return chart.save(null, {
                                        success:function(model, response, options) {
                                            console.debug("Saved chart with id: " + model.get("id"));
                                        },
                                        error: function(model, xhr, options) {
                                            console.error("Oops, couldn't save chart.");
                                            // todo: error message
                                        }
                                    });
                                });
                            };                            

                            // stop spin and close
                            deferred = deferred.then(function() {
                                console.debug('Finished edit chart');
                                $vexContent.find('#chartFields').spin(false);
                                return vex.close($vexContent.data().vex.id);
                            });


                        }
                    }                    
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    $dialog.find('#chartFields').spin();

                    // we can't let an existing projection chart switch to a metric chart, or vice-versa
                    var sourceType = chart.entityName == 'MetricChart' ? 'Metric' : 'Projection';
                    self._setUpChartDialog($dialog, sourceType);

                    // we can't let an existing projection chart switch chart type either, but we can do this immediately
                    $dialog.find('#chartType').attr('readonly', sourceType == 'Projection');

                    // populate - nb this will send out a change event if applicable
                    chart.fetch({
                        success: function(model) {
                            console.debug("Synched chart: " + model.get('title'));
                            $dialog.find('#chartFields').spin(false);

                            // name
                            $dialog.find('#chartTitle').val(model.get('title'));

                            // chartType
                            $dialog.find('#chartType').select2('val', model.get("chartType"));

                            // metric - this could be before or after we've downloaded metrics, so put it in the dom and set the widget
                            var sel = model.has('projectionId') ? model.get('projectionAccountName') : model.get('metricId');
                            $dialog.find('#chartMetric').val(sel).select2('val', sel);

                            // color
                            var colorScheme = model.has("colorScheme") ? model.get('colorScheme')*1 : 0;
                            var color = _.findWhere(Chart.colorSchemes, {idx:colorScheme}).colors[0];
                            $dialog.find('#chartColor').spectrum("set", color);

                            // no sense showing QBO linkage if no connection
                            if (config.qbo && chart.has('projectionId') && chart.get('hasAuthenticatedQBOConnection')) {
                                $dialog.find('.linkToQBO').show();
                                $dialog.find('#linkToQBO').prop('checked', chart.get('projectionSource') == 'QBO');
                            };

                            $dialog.find('#chartFields').spin(false);


                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
                            
                        }
                    });

                });

        },

        _showAddChartDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogAddChartTitle'),
                template = $('#dialogEditAddChart').clone().html();

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogAddChartOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],
                    onSubmit: function(e) {
                        // add the chart

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        // bug in select2 3.3.2, where disabled attr is added when set to readonly (fixed later)
                        $form.find('#chartType').attr('disabled', false);

                        // parse form data
                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        if (data.chartMetric.length) {
	                        $vexContent.find('#chartFields').spin();

                        	var chosenSource = $form.find('#chartMetric').select2('data');
							var cs = _.find(Chart.colorSchemes, function(cs) {return (cs.colors[0] == data.chartColor.toUpperCase().replace(/^#/,''))});

                            var stratFileId = self.router.stratFileManager.stratFileId;

                            // if this is a projection, we store it differently
                            var isProjection = !$.stratweb.isNumber(chosenSource.id);
                            if (isProjection) {

                                // another kind of chart - projectionChart (no metric, objective, theme) but has a projection eg AP, AR
                                //      - this is a dual chart by definition: shows projections and user-value or matching QBO values                                

                                var projection = new Projection({
                                    'stratFileId': stratFileId,
                                    'accountName': chosenSource.id,
                                    'source': data.linkToQBO ? 'QBO' : 'GAE'
                                });

                                var pChart = new ProjectionChart({
                                    'stratFileId': stratFileId,
                                    'title': data.chartTitle.length > 0 ? data.chartTitle : self.localizable.get('untitledChart'),
                                    'chartType': data.chartType.length > 0 ? data.chartType : null,
                                    'colorScheme': cs.idx,
                                    'showTarget': true, // so that we see the projected values straight away
                                    'zLayer': 0
                                });

                                var deferred = $.Deferred();
                                deferred.resolve();

                                deferred = deferred.then(function() {
                                    return projection.save(null, {
                                        success:function(model, response, options) {
                                            console.debug('Saved projection: ' + projection.get('id'));
                                            pChart.set('projectionId', projection.get('id'));
                                            pChart.updateUrl();
                                        },
                                        error: function(model, xhr, options) {
                                            console.error("Oops, couldn't save projection.");
                                            $vexContent.find('#chartFields').spin(false);
                                            // todo: error message
                                        }
                                    });
                                });

                                deferred = deferred.then(function() {
                                    return pChart.save(null, {
                                        success: function(model, response, options) {
                                            console.debug("Saved projection chart with id: " + model.get("id"));
                                            self.chartCollection.add(model);
                                            $vexContent.find('#chartFields').spin(false);
                                            
                                            // close
                                            return vex.close($vexContent.data().vex.id);
                                        },
                                        error: function(model, xhr, options) {
                                            console.error("Oops, couldn't save chart.");
                                            $vexContent.find('#chartFields').spin(false);
                                            // todo: error message
                                        }
                                    }); 
                                });

                            }
                            else {

                                var chart = new MetricChart({
                                    'stratFileId': chosenSource.stratFileId,
                                    'themeId': chosenSource.themeId,
                                    'objectiveId': chosenSource.objectiveId,
                                    'metricId': chosenSource.id,
                                    'title': data.chartTitle.length > 0 ? data.chartTitle : self.localizable.get('untitledChart'),
                                    'chartType': data.chartType.length > 0 ? data.chartType : null,
                                    'colorScheme': cs.idx,
                                    'zLayer': 0
                                });

                                chart.save(null, {
                                    success: function(model, response, options) {
                                        console.debug("Saved chart with id: " + model.get("id"));
                                        self.chartCollection.add(model);
                                        $vexContent.find('#chartFields').spin(false);
                                        
                                        // close
                                        return vex.close($vexContent.data().vex.id);
                                    },
                                    error: function(model, xhr, options) {
                                        console.error("Oops, couldn't save chart.");
                                        $vexContent.find('#chartFields').spin(false);
                                        // todo: error message
                                    }
                                });                         

                            }

                        } else {
                        	console.warn('Must choose a metric');
                        	var $ele = $form.find('#chartMetric').prev().find('a');
                        	$ele.css({
                        		border:'1px solid rgba(219, 121, 1, 1.0)',
                        		transition:'border 0.25s',
                        		'-webkit-transition':'border 0.25s'
                        	});
                        	setTimeout(function() {
                        		$ele.css({
	                        		border:'1px solid #aaa'
	                        	});
                        	}, 3000);
                        }

                    }
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    
                    self._setUpChartDialog($dialog);

                    // should we show the QBO linkage?
                    $.ajax({
                            url: config.serverBaseUrl + "/ipp/v3/isAuthenticated?stratFileId=" + self.router.stratFileManager.stratFileId,
                            type: "GET",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            global: false // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
                        })
                        .done(function(data) {
                            console.debug('Success QBO auth');

                            self.isConnectedToQBO = data.isAuthenticated;

                            // if authenticated, show qbo linkage and populate
                            if (config.qbo && self.isConnectedToQBO) {
                                $dialog.find('.linkToQBO').show();
                                $dialog.find('#linkToQBO').prop('checked', false);
                            };

                        })
                        .fail(function(data) {
                            console.debug('Failed QBO auth');
                        })                        
                        .always(function(data) {
                            console.debug('Checked QBO auth');
                            $dialog.find('#chartFields').spin(false);
                        });                    

                });
        },

        _showDeleteChartDialog: function(e, chartId) {
            e.preventDefault();
            e.stopPropagation();

            var chart = this.chartCollection.get(chartId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    message: sprintf(this.localizable.get('dialogDeleteChartMessage'), chart.escape('title')),
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogDeleteChartOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    callback: function(okPressed) {
                        if (okPressed) {
                            console.debug("deleting: " + chart.get('title'));
                            chart.destroy({
                                success: function(model, response, options) {
                                    console.debug("Deleted chart with id: " + model.get("id"));

                                }.bind(this),
                                error: function(model, xhr, options) {
                                    console.error("Oops, couldn't delete chart.");
                                }
                            });
                        };
                    }
                });
        },

        _setUpChartDialog: function($dialog, sourceType) {
            $dialog.find('#chartFields').spin();

            var self = this;
            var stratFileId = this.router.stratFileManager.stratFileId;

            // title
            $dialog.find('#chartTitle').change(function(event) {
                $(this).data('isUserEdited', true);
            });

            // type
            $dialog.find('#chartType').select2();
            $('.select2-container').css({
                    width: '100%'
                });

            // color
            var colors = _.map(Chart.colorSchemes, function(val, key) { return val.colors[0]; });
            var defaultColor = _.findWhere(Chart.colorSchemes, {idx:0}).colors[0];
            $dialog.find('#chartColor')
                .val(defaultColor)
                .spectrum({
                	flat: true,
    			    showPaletteOnly: true,
    			    showPalette:true,
    			    palette: [ colors ],
    			    showInitial: true,
    			    preferredFormat: "hex6"
    			});

            // link to QBO
            $dialog.find('#linkToQBO').change(function(ev) {
                var msg = $(this).is(':checked') ? self.localizable.get('msgUseQBOValues') : self.localizable.get('msgUseManualValues');
                $(this).parent('label').children('span').text(msg);
            });

            // fetch metrics and then select2
            $dialog.find('#chartMetric').css({
                width: '100%'
            });
		    $.ajax({
		        url: config.serverBaseUrl + sprintf("/stratfiles/%s/metrics", stratFileId),
		        type: "GET",
		        dataType: 'json',
				contentType: "application/json; charset=utf-8"
			})
			.done(function(response, textStatus, jqXHR) {

                // don't list metrics without a name
                var metrics = _.filter(response.data.metrics, function(metric){ return metric.summary && metric.summary.length > 0; });
                if (!metrics.length) {
                    metrics = [
                        { id: "NO_METRICS", summary: "No metrics", disabled: true }
                    ];
                };

                var results = [];
                var data = {results: results};
                // if editing, then you can't switch between metric and projection
                if (sourceType == 'Metric' || !sourceType) {
                    results.push({
                        summary: "Metrics",
                        children: metrics
                    });
                }
                if (sourceType == 'Projection' || !sourceType) {
                    results.push({
                        summary: "Projections",
                        children: [{
                            id: "REVENUE",
                            summary: self.localizable.get('REVENUE')
                        }, {
                            id: "TOTAL_EXPENSES",
                            summary: self.localizable.get('TOTAL_EXPENSES')
                        }, {
                            id: "CASH",
                            summary: self.localizable.get('CASH')
                        }, {
                            id: "NET_INCOME",
                            summary: self.localizable.get('NET_INCOME')
                        }, {
                            id: "ACCOUNTS_PAYABLE",
                            summary: self.localizable.get('ACCOUNTS_PAYABLE')
                        }, {
                            id: "ACCOUNTS_RECEIVABLE",
                            summary: self.localizable.get('ACCOUNTS_RECEIVABLE')
                        }, {
                            id: "COGS",
                            summary: self.localizable.get('COGS')
                        }]
                    });
                }

                // show metrics and projections
                var formatSelection = function(item) { 
                    return item.summary; 
                }
				var formatResult = function(item) { 
                    return _.escape(item.summary);
                }
				$dialog.find("#chartMetric")
                .select2({ 
                    data: data,
					formatSelection: formatSelection, // the selected
				    formatResult: formatResult // the list
				})
                .change(function(event) {
                    var isProjection = !$.stratweb.isNumber(event.val),
                        $chartTitle = $dialog.find('#chartTitle'),
                        title;

                    // reset
                    if ($chartTitle.val().length == 0) {
                        $chartTitle.data('isUserEdited', null);
                    }

                    // suggest a chart title
                    var isTitleUserEdited = $chartTitle.data('isUserEdited');
                    if (!isTitleUserEdited) {
                        if (isProjection) {
                            // Actual Revenue vs Projected Revenue
                            title = sprintf(self.localizable.get('suggestedProjectionChartTitle'), self.localizable.get(event.val), self.localizable.get(event.val));
                            $chartTitle.val(title);
                        } 
                        else {
                            // just the metric name
                            title = sprintf(self.localizable.get('suggestedMetricChartTitle'), $(this).select2('data').summary);
                        }
                        $chartTitle.val(title);
                    }

                    // chartTypes readonly iff projection
                    $dialog.find('#chartType').attr({ 'readonly': isProjection, 'disabled': false });

                    // only show qbo link iff projection
                    $dialog.find('.linkToQBO').toggle(config.qbo && self.isConnectedToQBO && isProjection);

                    // only barchart is applicable currently
                    if (isProjection) {
                        $('#chartType').select2('val', Chart.chartTypes.indexOf('ChartTypeBar'));
                    };

                });

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("%s: %s", textStatus, errorThrown);
			})
			.always(function() {
                $dialog.find('#chartFields').spin(false);
			});
        },

        _monthYearHeader: function() {
        	// we want to draw charts for the latest 2 years which have measurements
    		var lastMeasurementDates = [];
        	this.chartCollection.each(function(chart, idx) {
		       	var m = chart.get('measurements').sort(function(m1, m2) {
		          return m1.date > m2.date; // asc
		        });
		        if (m.length) {
		        	lastMeasurementDates.push(m[m.length-1].date);
		        };		        
        	});
        	lastMeasurementDates.sort(); // asc

        	var lastMeasurementDate;
        	if (lastMeasurementDates.length) {
        		lastMeasurementDate = moment(lastMeasurementDates[lastMeasurementDates.length-1].toString(), $.stratweb.dateFormats.in);
        	} else {
        		lastMeasurementDate = moment();
        	}
        	
        	var nextMonth = lastMeasurementDate.add('months', 1);
        	var dateIterator = nextMonth.subtract('years', 2).startOf('month');
        	this.startDate = moment(dateIterator);

        	var $hdr = $('<ul>');
        	for (var i = 0; i < 24; i++) {
        		var $li = $('<li>');
        		if (dateIterator.month() === 0) {
                    var $div = $('<div>');
                    $div.text(dateIterator.format('MMM').substr(0,1)).appendTo($li);
        			$('<span>').text(dateIterator.format('YYYY')).appendTo($div);
                    $li.appendTo($hdr);
        		} else {
                    $li.text(dateIterator.format('MMM').substr(0,1)).appendTo($hdr);                    
                }
        		dateIterator.add('months', 1);
        	};
        	return $hdr;
		}

    });

    return view;
});