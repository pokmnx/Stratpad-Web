// shows all the objectives for a Theme
define(['BaseForm', 'ObjectiveListView', 'ObjectiveCollection', 'Objective', 'MetricCollection', 'MetricListView', 'Metric'],
	function(BaseForm, ObjectiveListView, ObjectiveCollection, Objective, MetricCollection, MetricListView, Metric) {

		var view = BaseForm.extend({

			el: 'article .themeObjective',

			initialize: function(router, theme, localizable) {

				_.bindAll(this, "load", "_showAddObjectiveDialog", "_showEditObjectiveDialog", '_setupSortable', '_resizeSection', '_resizeSection', '_deleteObjective', '_applyPermissions', '_showNavigator')

				// super
				BaseForm.prototype.initialize.call(this, router, localizable);
				this.theme = theme;

				// convenience vars
				var self = this,
					$financialSortable = this.$el.find('ul#financialSortable'),
					$customerSortable = this.$el.find('ul#customerSortable'),
					$processSortable = this.$el.find('ul#processSortable'),
					$staffSortable = this.$el.find('ul#staffSortable');

				// make each section sortable
				this._setupSortable($financialSortable);
				this._setupSortable($customerSortable);
				this._setupSortable($processSortable);
				this._setupSortable($staffSortable);

				// hook up each section header open/close and its add button
				this.$el
					.on(router.clicktype, '.stageHeader > i', function(e) {
						self._showAddObjectiveDialog(e, $(this).attr('data-type'));
					});

				// hook up each objective row to the vex dialog for editing
				this.$el
					.on('click', "li.objectiveSortableItem", function(e) {
						var stratFile = self.router.stratFileManager.stratFileCollection.get(self.theme.get('stratFileId'));
						if (!stratFile.hasReadAccess('PLAN')) { return; }

						// edit or add, depending on whether the row is an objective or a noRows
						var $ele = $(this);
						var isNoRowsItem = $ele.find('.noObjectives').length;
						var objectiveType = $ele.closest('.objectiveStage').find(':first i').attr('data-type');
						if (isNoRowsItem) {
							self._showAddObjectiveDialog(e, objectiveType);
						} else {
							var objectiveId = $ele.data().objectiveId;
							self._showEditObjectiveDialog(e, objectiveType, objectiveId);
						}
					})
					.on(this.router.clicktype, "li.objectiveSortableItem nav > .deleteObjective", function(e) {
						var objectiveId = $(this).closest('li.objectiveSortableItem').data().objectiveId;
						self._deleteObjective(e, objectiveId);
					});

                // toolbar items
                $('#pageContent')
                    .off('click.projects')
                    .on('click.projects', 'li#showNavigator', this._showNavigator);

				// we have 4 ObjectiveListViews, each listening to the same ObjectiveCollection, but displaying only its preferred type
				this.objectiveCollection = this.router.stratFileManager.objectiveCollection;

				// needs to filter by type and theme
				this.financialObjectiveListView = new ObjectiveListView(this.router, this.objectiveCollection, this._localizable, 'FINANCIAL', $financialSortable, this.theme);
				this.customerObjectiveListView = new ObjectiveListView(this.router, this.objectiveCollection, this._localizable, 'CUSTOMER', $customerSortable, this.theme);
				this.processObjectiveListView = new ObjectiveListView(this.router, this.objectiveCollection, this._localizable, 'PROCESS', $processSortable, this.theme);
				this.staffObjectiveListView = new ObjectiveListView(this.router, this.objectiveCollection, this._localizable, 'STAFF', $staffSortable, this.theme);

				this.load();

			},

			load: function() {
				var stratFileId = this.theme.get('stratFileId');
				var themeId = this.theme.id;
				if (!stratFileId || !themeId) {
					console.error("Programmer error: you must provide a stratFileId and a themeId");
					return;
				}

	            // let shared users know what page we're on
	            this.router.messageManager.sendPageUpdate();

				// subtitle
				var themeName = this.theme.get('name');
				var themePage = $(sprintf('#pageNavigation .navSection #themes .navItem span[model=%s]', themeId)).data('key');
				var $themeLink = $('<span>'); // wrapper
				$('<a>')
					.attr('href', '#nav/' + themePage.replace(/,/g, '/'))
					.text(themeName)
					.append($('<i>').addClass('icon-ui-arrow-right-4'))
					.appendTo($themeLink);
				$('header > hgroup > h2').html(sprintf(this.localized('title'), $themeLink.html())); // xss safe

				// spin
				this.$el.find('.objectiveStage:nth-child(1)').spin();

				// todo: save sort order
				
				// get/refresh the objectives for this theme, and then merge into global collection, where our listeners are
				var themeObjectiveCollection = new ObjectiveCollection(this.objectiveCollection.where({'themeId': themeId}));
				themeObjectiveCollection.setStratFileId(stratFileId);
				themeObjectiveCollection.setThemeId(themeId);

				themeObjectiveCollection.fetch({
					success: function(collection) {
						console.debug("Successfully downloaded objectives for theme: " + this.theme.get('name'));
						collection.each(function(objective) {
							this.objectiveCollection.add(objective, {merge: true});
						}.bind(this));

						this.financialObjectiveListView.render();
						this.customerObjectiveListView.render();
						this.processObjectiveListView.render();
						this.staffObjectiveListView.render();

						this._applyPermissions();

						this.$el.find('.objectiveStage:nth-child(1)').spin(false);
					}.bind(this),
					error: function(model, xhr, options) {
						console.error(sprintf("Oops, couldn't load objectives. Status: %s %s", xhr.status, xhr.statusText));
						this.$el.find('.objectiveStage:nth-child(1)').spin(false);
					},
					silent: true // send no 'add' events (cause they don't honour the collection order - do it manually in merge)
				});


			},

            _applyPermissions: function() {
                var self = this,
                    stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                
                // permissions status field
                var $perms = this.$el.find('.permissions');

                // field can be readonly or disabled (with data wiped)
                if (stratFile.hasWriteAccess('PLAN')) {
                    $perms.hide();

                    // trash buttons
                    this.$el.find('nav').each(function() {
                        $(this).attr('disabled', false);
                    });

                    // add buttons
                	this.$el.find('.icon-misc-plus').show();

                    
                }
                else if (stratFile.hasReadAccess('PLAN')) {

                	// trash buttons
                    this.$el.find('nav').each(function() {
                        $(this).attr('disabled', true);
                    });

                    // add buttons
                	this.$el.find('.icon-misc-plus').hide();

                    $perms.text(self.localized('warn_readonly'));
                    $perms.show();                	

                }
                else {
                    // disabled - probably won't actually get here, but just to be safe

                    // trash buttons
                    this.$el.find('nav').each(function() {
                        $(this).attr('disabled', true);
                    });

                    // add buttons
            		this.$el.find('.icon-misc-plus').hide();                    

                    $perms.text(self.localized('LBL_NO_ACCESS'));
                    $perms.show();

                }

            },


			_deleteObjective: function(e, objectiveId) {

				e.preventDefault();
				e.stopPropagation();

				var objective = this.objectiveCollection.get(objectiveId);

        		var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						message: sprintf(this.localized('dialogDeleteMessage'), objective.escape('summary')),
	                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localized('dialogObjectiveDelete') }),
	                              $.extend({}, vex.dialog.buttons.NO, { text: self.localized('btn_cancel') }) ],						
						callback: function(okPressed) {
							if (okPressed) {
								console.debug("deleting: " + objective.get('summary'));
								objective.destroy({
				                    success: function(model, response, options) {                        
				                        console.debug("Deleted objective with id: " + model.get("id"));

				                    }.bind(this),
				                    error: function(model, xhr, options) {
				                        console.error("Oops, couldn't delete objective.");
				                    }
								});								
							};						
						}
					});
			},

			_showEditObjectiveDialog: function(e, objectiveType, objectiveId) {

				e.preventDefault();
				e.stopPropagation();

				// dialog title
				var message = sprintf("%s %s", this.localized(objectiveType.toLowerCase() + 'Title'), this.localized('dialogEditObjectiveTitle'));
				var template = $('#objectiveDetailsDialog').clone().html();

				var objective = this.objectiveCollection.get(objectiveId);

				// default objective title, all metric values are optional
				// add metric and done buttons on the bottom
				// delete inline
				// edit inline
				// always have at least 1 metric? no

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '800px'
						},						
						message: message,
						input: template,

					    buttons: {
					      YES: {
					        text: this.localized('dialogObjectiveSave'),
					        type: 'submit',
					        className: 'vex-dialog-button-primary'
					      },
					      NO: {
					        text: this.localized('btn_cancel'),
					        type: 'button',
					        className: 'vex-dialog-button-secondary',
					        click: function($vexContent, event) {
								// close
								$vexContent.data().vex.value = false;
								return vex.close($vexContent.data().vex.id);
					        }
					      },
					      ADD: {
					        text: this.localized('dialogAddMetric'),
					        type: 'button',
					        className: 'vex-dialog-button-secondary',
					        click: function($vexContent, event) {
					        	// no need to close
					        	var metric = new Metric({
					        		id: 'new_' + $.stratweb.generateUUID(),
					        		stratFileId: objective.get('stratFileId'), 
					        		themeId: objective.get('themeId'), 
					        		objectiveId: objectiveId
					        	});
					        	self.metricCollection.add(metric);
					        }
					      }
					    },

	                    onSubmit: function(e) {
	                        // add the objective and metrics

	                        var $form, $vexContent;
	                        $form = $(this);
	                        $vexContent = $form.parent();
	                        e.preventDefault();
	                        e.stopPropagation();

	                        $vexContent.find('#objectiveFields').spin();

	                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

							console.debug(data);

							var triggerObjectiveChange = false;
						    var completed = 0, expected = 0;
						    var proceed = function() {
						    	completed += 1;
						        if (completed==expected) {
									// get the underlying row to update (particularly the metrics part)
									if (triggerObjectiveChange) {
										objective.trigger('change');
									};

									$vexContent.data().vex.value = false;
									return vex.close($vexContent.data().vex.id);							            
						        }
						    }

							// set objective properties NB. this will erase the record of any other changedAttributes, such as userId, etc
							// this happens regardless of whether a change actually happens or not
							// each set or unset updates hasChanged and changed, de novo (it doesn't accumulate)
							objective.set({
								'summary': data.objectiveName || self.localized('default_objective_name'),
								'reviewFrequency': data.reviewFrequency
							});

							// hitting save without changing anything
							if (!objective.hasChanged() && !self.saveMetrics) {
								expected = 1;
								proceed();
							};							

							// must measure change now (just the above two attrs)
							if ( objective.hasChanged() ) {

								// our server is a little prickly about these unexpected attributes - but this will alter hasChanged and changedAttributes
								objective.unset('metrics', {silent:true});
								objective.unset('metricCollection', {silent:true});
								objective.unset('stratFileId', {silent:true});
								objective.unset('themeId', {silent:true});
								objective.unset('userId', {silent:true});

								expected += 1;
								triggerObjectiveChange = true;

								objective.save(null, {
									success: function(model, response, options) {
										proceed();
										console.debug("Saved objective with id: " + model.get("id"));
									},
									error: function(model, xhr, options) {
										console.error("Oops, couldn't save objective.");
									}
								});									
							};

							if (self.saveMetrics) {
								expected += 1;
								triggerObjectiveChange = true;

								// replace temp ids
								self.metricCollection.each(function(metric, idx) {
									metric.set("summary", metric.get('summary') || self.localized('defaultMetricSummary'));
									if ( metric.has('id') && metric.id.toString().match(/^new_/) ) {
										metric.unset('id', {silent: true});
										metric.updateUrl();
									}
								});

								// save
								self.metricCollection.syncCollection({
						            success:function(metrics, response, options) {
						            	// update the original collection
						            	// no need to send an event, because the dialog is being closed anyway, and we get a re-render on objective:change
						            	objective.get('metricCollection').reset(metrics.models, {silent: true});
						            	proceed();
						            },
						            error: function(model, xhr, options) {
						                console.error("Oops, couldn't save metrics.");
						            }
						        });
							};	

						}
					})
					.bind('vexOpen', function() {
						var $dialog = $(this);
						$dialog.find('.vex-dialog-form').spin()
						$dialog.find('#reviewSelect').select2();
						$dialog.find('.select2-container').css({ width: '100%' });

						self.saveMetrics = false;

						objective.fetch({
							success: function(model) {
								// sync - nb this will send out a change event if applicable
								console.debug("Sync'ed objective: " + model.get('summary'));

								// summary
								$dialog.find('#objectiveName').val(model.get('summary'));

								// review frequency
								$dialog.find('#reviewSelect').select2('val', model.get('reviewFrequency'));

								// metrics - need to clone because we need to be able to cancel
								self.metricCollection = new MetricCollection(objective.get('metricCollection').toJSON());
								self.metricListView = new MetricListView(self.router, self.metricCollection, self._localizable);

								// set requisite ids on collection
								var stratFileId = model.get('stratFileId');
								var themeId = model.get('themeId');
								var objectiveId = model.id;
								if (!stratFileId || !themeId || !objectiveId) {
									console.error("You must provide a stratFileId, a themeId and an objectiveId");
									return;
								}
								self.metricCollection.setIds(stratFileId, themeId, objectiveId);

								// listen for changes in our collection
								self.metricCollection
								.on("remove", function(metric) {
									// destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
									console.debug("Scheduling metric for deletion: " + metric.get("summary"));
									self.saveMetrics = true;
								})
								.on("change", function(metric) {
									console.debug("Scheduling metric for save: " + metric.get("summary"));
									self.saveMetrics = true;
								})
								.on("add", function(metric) {
									console.debug("Scheduling metric for addition: " + metric.get("summary"));
									self.saveMetrics = true;
								});

								// because we initialized with a list of metrics, no add events, thus must render
								self.metricListView.render();

								// spin
								$dialog.find('.vex-dialog-form').spin(false);

							},
							error: function(model, xhr, options) {
								console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
								$dialog.find('.vex-dialog-form').spin(false);
							}
						});						
												
					});
			},

			_showAddObjectiveDialog: function(e, objectiveType) {

				e.preventDefault();
				e.stopPropagation();

				var message = sprintf("%s %s", this.localized(objectiveType.toLowerCase() + 'Title'), this.localized('dialogAddObjectiveTitle'));
				var template = $('#objectiveDetailsDialog').clone().html();

				// create objective
				var position = this.objectiveCollection.where({
					'type': objectiveType
				}).length;
				var objective = new Objective({
					'order': position,
					'stratFileId': this.theme.get('stratFileId'),
					'themeId': this.theme.get('id'),
					'type': objectiveType
				});

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '800px'
						},
						message: message,
						input: template,
					    buttons: {
					      YES: {
					        text: this.localized('dialogObjectiveAdd'),
					        type: 'submit',
					        className: 'vex-dialog-button-primary'
					      },
					      NO: {
					        text: this.localized('btn_cancel'),
					        type: 'button',
					        className: 'vex-dialog-button-secondary',
					        click: function($vexContent, event) {
					          $vexContent.data().vex.value = false;
					          return vex.close($vexContent.data().vex.id);
					        }
					      },
					      ADD: {
					        text: this.localized('dialogAddMetric'),
					        type: 'button',
					        className: 'vex-dialog-button-secondary',
					        click: function($vexContent, event) {
					        	// no need to close
					        	var metric = new Metric({
					        		id: 'new_' + $.stratweb.generateUUID(),
					        		stratFileId: objective.get('stratFileId'), 
					        		themeId: objective.get('themeId'), 
					        		objectiveId: 'new_' + $.stratweb.generateUUID()
					        	});
					        	self.metricCollection.add(metric);
					        }
					      }
					    },						
	                    onSubmit: function(e) {
	                        // add the objective and metrics

	                        var $form, $vexContent;
	                        $form = $(this);
	                        $vexContent = $form.parent();
	                        e.preventDefault();
	                        e.stopPropagation();

	                        $vexContent.find('#objectiveFields').spin();

	                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

							console.debug(data);

							objective.set({
								'summary': data.objectiveName || self.localized('defaultObjectiveSummary'),
								'reviewFrequency': data.reviewFrequency
							});

							objective.save(null, {
								success: function(model, response, options) {
									console.debug("Created objective with id: " + model.get("id"));

									// can now save metrics, if any
									if (self.metricCollection.length) {

										// set requisite ids on collection
										var stratFileId = model.get('stratFileId');
										var themeId = model.get('themeId');
										var objectiveId = model.id;
										if (!stratFileId || !themeId || !objectiveId) {
											console.error("You must provide a stratFileId, a themeId and an objectiveId");
											return;
										}
										self.metricCollection.setIds(stratFileId, themeId, objectiveId);

										// now we can replace temporary id
										self.metricCollection.each(function(metric, idx) {
											metric.set("objectiveId", objectiveId);
											metric.set("summary", metric.get('summary') || self.localized('defaultMetricSummary'));

											// we had to give our metrics a temporary id
											if ( metric.has('id') && metric.id.toString().match(/^new_/) ) {
												metric.unset('id', {silent: true});
												metric.updateUrl();
											}

										});

										// save
										self.metricCollection.syncCollection({
								            success:function(metrics, response, options) {

												console.debug("saved metrics: " + metrics.length);

												// add it to the proper collection
												objective.set('metricCollection', self.metricCollection);

												// add the objective, with its metricCollection, into the primary objectiveCollection (triggering an add event)
												self.objectiveCollection.add(objective);

												// close
												$vexContent.data().vex.value = false;
												return vex.close($vexContent.data().vex.id);

								            },
								            error: function(model, xhr, options) {
								                console.error("Oops, couldn't save metrics.");
								            }
								        });

									}
									else {
										// add the objective, with its metricCollection, into the primary objectiveCollection (triggering an add event)
										self.objectiveCollection.add(model);

										// close
										$vexContent.data().vex.value = false;
										return vex.close($vexContent.data().vex.id);
									}

								},
								error: function(model, xhr, options) {
									console.error("Oops, couldn't save objective.");
								}
							});

						}
					})
					.bind('vexOpen', function() {
						var $dialog = $(this);
						$dialog.find('#reviewSelect').select2();
						$dialog.find('.select2-container').css({ width: '100%' });

						// metrics
						self.metricCollection = new MetricCollection();
						self.metricListView = new MetricListView(self.router, self.metricCollection, self._localizable);

					});

			},

			_resizeSection: function($ele) {
				this._sectionOpenClose($ele, true);
			},

			_sectionOpenClose: function($ele, shouldOpen) {
				// $ele should be the div.stageHeader of the relevant li.objectiveStage (everything to do with one objectiveType section)
				var $wrapper = $ele.parents('#pageContent'),
					$target = $ele.next(),
					$inner = $target.children('.stageContentInner'),
					scroll = $wrapper.scrollTop(),
					poffset = $ele.position(),
					ptop = Math.ceil(poffset.top),
					toffset = scroll + ptop;

				$ele.addClass('animating');

				if (shouldOpen) {
					$ele.removeClass('closed');
					$target.height($inner.height() + 60).removeClass('closed');
					$wrapper.animate({
						scrollTop: toffset
					}, {
						duration: 800,
						easing: "easeInOutQuint"
					});

				} else {
					$ele.addClass('closed');
					$target.height(0).addClass('closed');
				}
				setTimeout(function() {
					$ele.removeClass('animating');
				}, 500);
			},

			_setupSortable: function($target) {
				$target.sortable({
					helper: function(event, element) {
						var clone = $(element).clone();
						var w = $(element).outerWidth();
						var h = $(element).outerHeight();
						clone.css({
							'width': w + 'px',
							'height': h + 'px'
						});
						return clone;
					}
				});
				$target.disableSelection();
			},

            _showNavigator: function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.router.pageNavigationView.showNavigator(this.theme);
            }


		});

		return view;
	});