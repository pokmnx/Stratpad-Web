define(['Config', 'Dictionary', 'i18n!nls/PageToolbarView.i18n', 'i18n!nls/ChartPage.i18n', 'i18n!nls/StratBoardSummary.i18n', 'Chart', 'MeasurementListView', 'MetricMeasurement', 'ProjectionMeasurement', 'jqueryUIButton', 'backbone', 'spectrum'],

	function(config, Dictionary, tLocalizable, cLocalizable, sLocalizable, Chart, MeasurementListView, MetricMeasurement, ProjectionMeasurement) {

		var view = Backbone.View.extend({

			initialize: function(router, gLocalizable) {
				_.bindAll(this, "addChartControlToPage", 'openChartControls', '_manageMeasurementsDialog', '_setupMeasurementDialog', '_showAddMeasurementDialog', '_showDeleteMeasurementDialog', '_showEditMeasurementDialog', '_applyPermissions');

				this.localizable = new Dictionary(gLocalizable, sLocalizable, cLocalizable, tLocalizable);
				this.router = router;

				var self = this;

				$("#pageContent")
					.off(this.router.clicktype, "#showChartControl")
					.on(this.router.clicktype, "#showChartControl", function(e) {

						e.preventDefault();

						var $showChartControl = $(this),
							$chartControlDrawer = $('#chartControlDrawer'),
							$toolbarItems = $('#pageToolbar li');

						if ($showChartControl.is('.open')) {
                            
                            // hide the chart control pane

							$showChartControl
								.removeClass('open')
								.find('span')
								.removeClass()
								.addClass('icon-new-tools')
								.parent()
								.tooltipster('destroy')
								.tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250, content:self.localizable.get('showChartControls')});

							$showChartControl
								.removeClass('chart-settings-open');

							$chartControlDrawer
								.removeClass('active');

							// can show the feedback tab
							$('#feedback-form').show();
							// show other toolbar items
							$toolbarItems
								.not($showChartControl)
								.each(function () {
									var $this = $(this);
									$this.css('display', $this.attr('data-display'));
								});

						} else {
							self.openChartControls($showChartControl, $chartControlDrawer, $toolbarItems);
						}
					});

			},

			openChartControls: function($showChartControl, $chartControlDrawer, $toolbarItems) {

				var $showChartControl = $showChartControl || $("#pageContent #pageToolbar #showChartControl"),
					$chartControlDrawer = $chartControlDrawer || $('#pageContent #chartControlDrawer'),
					$toolbarItems = $toolbarItems || $('#pageToolbar li');

				$showChartControl
					.addClass('open')
					.find('span')
					.removeClass()
					.addClass('icon-misc-remove-sign')
					.parent()
					.tooltipster('destroy')
					.tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250, content:this.localizable.get('hideChartControls')});

				$showChartControl
					.addClass('chart-settings-open');

				$chartControlDrawer
					.addClass('active');

				// hide the feedback tab so it doesn't get in the way
				$('#feedback-form').hide();

				// hide other toolbar items as part of our general UI behaviour
				$toolbarItems.not($showChartControl).hide();
				
			},

			addChartControlToPage: function(chartPage) {

				// don't add it to pages missing this node?
                if($('#chartControlDrawer').length)
                    return;

				var self = this;

				// measurements for the main chart
				this.measurementCollection = chartPage.primaryChart.measurementCollection;

				// the Chart.js backbone entity
				this.chartModel = chartPage.primaryChart.chartModel;

				// can be a Metric or a Projection
				this.sourceModel = chartPage.primaryChart.sourceModel;

				var compiledTemplate = Handlebars.templates['stratboard/ChartControlView'];
				var context = _.extend(this.localizable.all(), {
					sourceName: this.sourceModel.get('summary') || this.localizable.get(this.sourceModel.get('accountName'))
				});
				var $html = $(compiledTemplate(context));
                $html.insertAfter('#pageContent header');

				// checkboxen
				$html.find('#toggleTarget').prop('checked', this.chartModel.get('showTarget'));
				$html.find('#toggleTrendLine').prop('checked', this.chartModel.get('showTrend'));
				$html.find("input:checkbox")
					.button({
						icons: {
							primary: "ui-icon-circle-check"
						}
					})
					.click(function() {
						// we put the methodName in the id of the checkbox eg. toggleTarget
						self.router.report[this.id]();
					});

				// type
				$html.find('#chartType')
					.val(self.chartModel.get('chartType'))
					.attr('disabled', this.sourceModel.entityName == 'Projection')
					.select2()
					.change(function(e) {
						self.chartModel.set("chartType", $(this).val());
						self.chartModel.save({
							success: function(model, response) {
								console.debug('Saved chart');
							},
							error: function(model, xhr, options) {
								console.error(sprintf("Oops, couldn't load themes. Status: %s %s", xhr.status, xhr.statusText));
							}
						});
					});

				// color
				var colors = _.map(Chart.colorSchemes, function(val, key) {
					return val.colors[0];
				});
				var colorScheme = self.chartModel.has("colorScheme") ? self.chartModel.get('colorScheme') * 1 : 0;
				var color = _.findWhere(Chart.colorSchemes, {
					idx: colorScheme
				}).colors[0];
				$html.find('#chartColor')
					.val(color)
					.spectrum({
						flat: true,
						showPaletteOnly: true,
						showPalette: true,
						palette: [colors],
						showInitial: true,
						preferredFormat: "hex6"
					})
					.on('change', function(e) {
						var color = $(this).val();
						var cs = _.find(Chart.colorSchemes, function(cs) {
							return (cs.colors[0] == color.toUpperCase().replace(/^#/,''))
						});
						self.router.report.changeColor(cs);
					});

				// if we press enter, return or tab - commit changes
				$html.find('#chartTitle')
					.val(self.chartModel.get('title'))
					.on('keypress', function(e) {
						// can't actually capture the tab here
						if (e.which == 10 || e.which == 13) {
							e.target.blur();
						}
					})
					.on('blur', function(e) {
						// equivalent to a tab keypress
						if (!self.router.stratFileManager.currentStratFile().hasWriteAccess('STRATBOARD')) { return; };
                        var title = $(this).val();
						self.chartModel.set("title", title);
						self.chartModel.save({
							success: function(model, response) {
								console.debug('Saved chart');
							},
							error: function(model, xhr, options) {
								console.error(sprintf("Oops, couldn't load themes. Status: %s %s", xhr.status, xhr.statusText));
							}
						});
					});

				var isLinked = self.sourceModel.get('source') == 'QBO';
				var $btnMeasurements = $html.find('#btnMeasurements');
				$btnMeasurements
					.button({ 
						label: isLinked ? self.localizable.get('btnMeasurementsLinkedToQBO') : self.localizable.get('btnMeasurements'),
						disabled: isLinked
					})
					.click(function(e) {
						self._manageMeasurementsDialog(e);
					});

				// update values button in chartcontrolview
	            self.sourceModel.off('change:source', null, 'ChartControl');
                self.sourceModel.on('change:source', function(projection) {
                    if (projection.get('source') == 'QBO') {
                    	$btnMeasurements.button( "option", "disabled", true );
                    	$btnMeasurements.button( "option", "label", self.localizable.get('btnMeasurementsLinkedToQBO')  );
                    }
                    else {
                    	$btnMeasurements.button( "option", "disabled", false );
                    	$btnMeasurements.button( "option", "label", self.localizable.get('btnMeasurements') );                    	
                    }
                }, 'ChartControl');

                self._applyPermissions();

			},

	        _applyPermissions: function() {

	            var stratFile = this.router.stratFileManager.currentStratFile();

	            // permissions status field
	            var $chartControlDrawer = $('#pageContent #chartControlDrawer');
	            var $perms = $chartControlDrawer.find('.permissions');            

				// let's leave target, trendline and color enabled - they won't save when changed, but are useful in readonly state
				// disable title, chartType, values

				// note that the chartType may already be rendered disabled, if this is a projection chart (temporary)
				var isProjection = this.sourceModel.entityName == 'Projection';

	            if (stratFile.hasWriteAccess('STRATBOARD')) {

	            	// enable it only if not a projection chart
					$chartControlDrawer.find('#chartType').prop('disabled', !isProjection);
					$chartControlDrawer.find('#chartTitle').prop({'readonly': false, 'disabled': false});

					// don't change the existing setting - it responds to qbo linkage
	                // $chartControlDrawer.find('#btnMeasurements').button( "option", "disabled", false );

	                $perms.hide();
	                
	            }
	            else if (stratFile.hasReadAccess('STRATBOARD')) {

					$chartControlDrawer.find('#chartType').prop('disabled', true);
					$chartControlDrawer.find('#chartTitle').prop({'readonly': true, 'disabled': false});
	                $chartControlDrawer.find('#btnMeasurements').button( "option", "disabled", true );

	                $perms.text(this.localizable.get('warn_readonly'));
	                $perms.show();                  

	            }
	            else {
	                // no access - shouldn't actually ever get here

					$chartControlDrawer.find('#chartType').prop('disabled', true);
					$chartControlDrawer.find('#chartTitle').prop({'readonly': true, 'disabled': true});
	                $chartControlDrawer.find('#btnMeasurements').button( "option", "disabled", true );

	                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
	                $perms.show();

	            }

	        },

			////////////////////////////////			

			_manageMeasurementsDialog: function(e) {
				e.preventDefault();
				e.stopPropagation();

				var message = this.localizable.get('dialogManageMeasurementsTitle'),
					template = $('#dialogManageMeasurements').clone().html();

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '700px'
						},
						message: message,
						input: template,
						buttons: [{
							text: self.localizable.get('btn_done'),
							type: 'button',
							className: 'vex-dialog-button-primary',
							click: function($vexContent, event) {
								return vex.close($vexContent.data().vex.id);
							}
						}]
					})
					.bind('vexOpen', function() {
						var $dialog = $(this);
						$dialog.find('#measurements').spin();

						if (!config.qbo) {
							$dialog.find('.linkQboButton').hide();
						};

						$dialog
							.on(self.router.clicktype, "li.measurementItem", function(e) {
								// edit or add, depending on whether the row is an measurement or a noRows                     
								var $ele = $(this);
								var isNoRowsItem = $ele.find('.noMeasurements').length;
								if (isNoRowsItem) {
									self._showAddMeasurementDialog(e);
								} else {
									var measurementId = $(this).attr('measurementId');
									self._showEditMeasurementDialog(e, measurementId);
								}
							})
							.on(self.router.clicktype, ".linkQboButton", function(e) {
								self._linkToQBO(e);
							})
							.on(self.router.clicktype, ".addButton", function(e) {
								self._showAddMeasurementDialog(e);
							})
							.on(self.router.clicktype, "li.measurementItem nav > .deleteMeasurement", function(e) {
								var measurementId = $(this).closest('li.measurementItem').attr('measurementId');
								self._showDeleteMeasurementDialog(e, measurementId);
							});

						// populate - nb this will send out a change event if applicable
						self.measurementCollection.fetch({
							success: function(models) {
								console.debug("Synced measurements: " + models.length);
								$dialog.find('#measurements').spin(false);

								// render lists
								var measurementListView = new MeasurementListView(self.router, self.measurementCollection, self.localizable);
								measurementListView.render();

							},
							error: function(models, xhr, options) {
								console.error(sprintf("Oops, couldn't sync measurements. Status: %s %s", xhr.status, xhr.statusText));
								$dialog.find('#measurements').spin(false);
							}
						});

					});
			},

			////////////////////////////////

			_linkToQBO: function(e) {

				// link to QBO, spin, close, chart
				// values button can change to a "Linked to QBO" display area, or disabled button

				e.preventDefault();
				e.stopPropagation();

				var self = this;

				// show a confirm dialog if linking would 'overwrite' their existing data
				if (self.measurementCollection.length) {
	                vex.dialog.confirm({
	                    className: 'vex-theme-plain',
	                    message: self.localizable.get('dialogManageMeasurementsLinkToQBOWarning'),
	                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localizable.get('btn_ok') }),
	                              $.extend({}, vex.dialog.buttons.NO, { text: self.localizable.get('btn_cancel') }) ],                                        
	                    callback: function(value) {
	                        if (value) {

	                        	$('#measurements').spin();

								// store that we are using QBO rather than manual measurements
								self.sourceModel.save({source: 'QBO'}, {
									// we have to wait until projection is saved, because otherwise the 
									// change event will trigger a download of measurements before projection source is saved
									wait: true,
									success: function(model, response, options) {
										console.debug("Linked to Proection to QBO successfully.");
										$('#measurements').spin(false);
										vex.close($('.vex .vex-content').data().vex.id);
									},
									failure: function() {
										console.error("Failed to link Proection to QBO.");
										$('#measurements').spin(false);
										vex.close($('.vex .vex-content').data().vex.id);
									}
								});

	                        };
	                    }
	                });

				}
				else {

					$('#measurements').spin();

					// store that we are using QBO rather than manual measurements
					self.sourceModel.save({source: 'QBO'}, {
						// we have to wait until projection is saved, because otherwise the 
						// change event will trigger a download of measurements before projection source is saved
						wait: true,
						success: function(model, response, options) {
							console.debug("Linked to Projection to QBO successfully.");
							$('#measurements').spin(false);
							vex.close($('.vex .vex-content').data().vex.id);
						},
						failure: function() {
							console.error("Failed to link Proection to QBO.");
							$('#measurements').spin(false);
							vex.close($('.vex .vex-content').data().vex.id);							
						}
					});

				}
			},

			/////////////////////////////////////////////////////////////////////////
			// instantiated by the manageMeasurementsDialog

			_showDeleteMeasurementDialog: function(e, measurementId) {
				e.preventDefault();
				e.stopPropagation();

				var measurement = this.measurementCollection.get(measurementId);

				var date = measurement.has('date') ? moment(measurement.get('date').toString(), $.stratweb.dateFormats. in ) : null;
				var formattedDate = date ? date.format($.stratweb.dateFormats.out) : null;

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							'margin-top': '50px'
						},
						message: sprintf(this.localizable.get('dialogDeleteMeasurementMessage'), formattedDate),
						buttons: [$.extend({}, vex.dialog.buttons.YES, {
								text: this.localizable.get('dialogDeleteMeasurementOk')
							}),
							$.extend({}, vex.dialog.buttons.NO, {
								text: this.localizable.get('btn_cancel')
							})
						],
						callback: function(okPressed) {
							if (okPressed) {
								console.debug("deleting: " + measurement.get('id'));
								measurement.destroy({
									success: function(model, response, options) {
										console.debug("Deleted measurement with id: " + model.get("id"));

									}.bind(this),
									error: function(model, xhr, options) {
										console.error("Oops, couldn't delete measurement.");
									}
								});
							};
						}
					});
			},

			_showEditMeasurementDialog: function(e, measurementId) {
				e.preventDefault();
				e.stopPropagation();

				var message = this.localizable.get('dialogEditMeasurementTitle'),
					template = $('#dialogEditAddMeasurement').clone().html(),
					measurement = this.measurementCollection.get(measurementId);

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							'margin-top': '50px'
						},
						message: message,
						input: template,
						buttons: [$.extend({}, vex.dialog.buttons.YES, {
								text: this.localizable.get('dialogEditMeasurementOk')
							}),
							$.extend({}, vex.dialog.buttons.NO, {
								text: this.localizable.get('btn_cancel')
							})
						],
						onSubmit: function(e) {
							// update the measurement

							var $form, $vexContent;
							$form = $(this);
							$vexContent = $form.parent();
							e.preventDefault();
							e.stopPropagation();

							$vexContent.find('#measurementFields').spin();

							var data = _.reduce($form.serializeArray(), function(a, b) {
								a[b.name] = b.value;
								return a
							}, {});

							// always need a date
							var formattedDate = $.stratweb.formattedInterchangeDate(data.measurementDate);
							if (formattedDate === '') { formattedDate = moment().format($.stratweb.dateFormats.in)};

							// use today if not set
							measurement.set({
								comment: data.measurementComment.length > 0 ? data.measurementComment : null,
								date: formattedDate,
								value: data.measurementValue.length > 0 ? data.measurementValue : null
							});

							measurement.save(null, {
								success: function(model, response, options) {
									console.debug("Saved measurement with id: " + model.get("id"));
									$vexContent.find('#measurementFields').spin(false);

									// close
									return vex.close($vexContent.data().vex.id);
								},
								error: function(model, xhr, options) {
									console.error("Oops, couldn't save measurement.");
									// error message
								}
							});
						}
					})
					.bind('vexOpen', function() {
						var $dialog = $(this);
						$dialog.find('.vex-dialog-buttons').spin('small')
						self._setupMeasurementDialog($dialog);

						// populate - nb this will send out a sync event
						measurement.fetch({
							success: function(model) {
								console.debug("Synced measurement: " + model.get('id'));
								$dialog.find('.vex-dialog-buttons').spin(false);

								// populate fields
								$dialog.find('#measurementComment').val(model.get('comment'));
								$dialog.find('#measurementValue').val(model.get('value'));

								// date
								var date = $.stratweb.formattedDateForDatePicker(model.get('date'));
								var $date = $dialog.find('#measurementDate');
								$date.datepicker().val(date);
							},
							error: function(model, xhr, options) {
								console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
								$dialog.find('.vex-dialog-buttons').spin(false);
							}
						});			            

					});				
			},

			_showAddMeasurementDialog: function(e) {
				e.preventDefault();
				e.stopPropagation();

				var message = this.localizable.get('dialogAddMeasurementTitle'),
					template = $('#dialogEditAddMeasurement').clone().html(),
					isProjection = this.sourceModel.entityName == 'Projection',
					measurement;

				if (isProjection) {
					measurement = new ProjectionMeasurement({
						'projectionId': this.sourceModel.get('id'),
						'stratFileId': this.sourceModel.get('stratFileId')
					});
				}
				else {
					measurement = new MetricMeasurement({
						'metricId': this.sourceModel.get('id'),
						'stratFileId': this.sourceModel.get('stratFileId'),
						'objectiveId': this.sourceModel.get('objectiveId'),
						'themeId': this.sourceModel.get('themeId')
					});
				}


				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							'margin-top': '50px'
						},
						message: message,
						input: template,
						buttons: [$.extend({}, vex.dialog.buttons.YES, {
								text: this.localizable.get('dialogAddMeasurementOk')
							}),
							$.extend({}, vex.dialog.buttons.NO, {
								text: this.localizable.get('btn_cancel')
							})
						],
						onSubmit: function(e) {
							// add the measurement

							var $form, $vexContent;
							$form = $(this);
							$vexContent = $form.parent();
							e.preventDefault();
							e.stopPropagation();

							$vexContent.find('#measurementFields').spin();

							var data = _.reduce($form.serializeArray(), function(a, b) {
								a[b.name] = b.value;
								return a
							}, {});

							// always need a date
							var formattedDate = $.stratweb.formattedInterchangeDate(data.measurementDate);
							if (formattedDate === '') { formattedDate = moment().format($.stratweb.dateFormats.in)};

							// use today if not set
							measurement.set({
								comment: data.measurementComment.length > 0 ? data.measurementComment : null,
								date: formattedDate,
								value: data.measurementValue.length > 0 ? data.measurementValue : null
							});

							measurement.save(null, {
								success: function(model, response, options) {
									console.debug("Saved measurement with id: " + model.get("id"));
									self.measurementCollection.add(model);
									$vexContent.find('#measurementFields').spin(false);

									// close
									return vex.close($vexContent.data().vex.id);
								},
								error: function(model, xhr, options) {
									console.error("Oops, couldn't save measurement.");
									// error message
								}
							});
						}
					})
					.bind('vexOpen', function() {
						self._setupMeasurementDialog($(this));
					});
			},

			_setupMeasurementDialog: function($dialog) {

	            // restrict input on numeric fields (no decimals on changes)
	            $dialog.find("#measurementValue")
	            	.keydown($.stratweb.decimalField)
	            	.css({
		                width: '100%'
		            })
		            .focus();

				// the date
				var $measurementDate = $dialog.find('#measurementDate');
				$measurementDate.datepicker({
					// todo: localized dates?
					dateFormat: "yy-mm-dd",
					changeMonth: true,
					changeYear: true,
					showAnim: "slideDown",
				});
                $measurementDate.prev('i').on('click', function() {
                    $measurementDate.datepicker("show");
                });
			}

		});

		return view;
	});