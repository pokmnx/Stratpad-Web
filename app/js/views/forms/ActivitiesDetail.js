// shows all the activities for an objective
define(['Config', 'BaseForm', 'ActivityCollection', 'Activity', 'ActivityListView'],
	function(config, BaseForm, ActivityCollection, Activity, ActivityListView) {

		var view = BaseForm.extend({

			el: 'article .objectiveActivities',

			initialize: function(router, objective, localizable) {

				// each cell should listen for name changes from objectives
				// activity nav list has to listen for add/delete
				// should grab the objective from objectiveCollections and fetch when we load up this detail (sends out change events)

				_.bindAll(this, "load", '_deleteActivity', '_showEditActivityDialog', '_setUpActivityDialog', '_showAddActivityDialog', '_applyPermissions', '_showNavigator');

				// super
				BaseForm.prototype.initialize.call(this, router, localizable);
				this.objective = objective;

				console.debug('Loading activities for objective: ' + objective.get('summary'));

				// hook up each objective row to the vex dialog for editing
				var self = this;
				this.$el
					.on('click', "li.activitySortableItem", function(e) {
						var stratFile = self.router.stratFileManager.stratFileCollection.get(self.objective.get('stratFileId'));
						if (!stratFile.hasReadAccess('PLAN')) { return; }

						// edit or add, depending on whether the row is an activity or a noRows						
						var $ele = $(this);
						var isNoRowsItem = $ele.find('.noActivities').length;
						if (isNoRowsItem) {
							self._showAddActivityDialog(e);
						} else {
							var activityId = $(this).data().activityId;
							self._showEditActivityDialog(e, activityId);
						}

					})
					.on(this.router.clicktype, ".addButton", function(e) {
						self._showAddActivityDialog(e);
					})
					.on(this.router.clicktype, "li.activitySortableItem nav > .deleteActivity", function(e) {
						var activityId = $(this).closest('li.activitySortableItem').data().activityId;
						self._deleteActivity(e, activityId);
					});

                // toolbar items
                $('#pageContent')
                    .off('click.projects')
                    .on('click.projects', 'li#showNavigator', this._showNavigator);

				this.activityCollection = new ActivityCollection();
				this.activityListView = new ActivityListView(this.router, this.activityCollection, this._localizable);

				this.load();

			},

			load: function() {
				// assert
				var stratFileId = this.objective.get('stratFileId');
				var themeId = this.objective.get('themeId');
				var objectiveId = this.objective.id;
				if (!stratFileId || !themeId || !objectiveId) {
					console.error("Programmer error: you must provide a stratFileId, a themeId and an objectiveId");
					return;
				}

	            // let shared users know what page we're on
	            this.router.messageManager.sendPageUpdate();
				
				// subtitle
				var themeName = this.router.stratFileManager.themeCollection.get(themeId).get('name');
				var objectiveName = this.objective.get('summary');

				var themePage = $(sprintf('#pageNavigation .navSection #themes .navItem span[model=%s]', themeId)).data('key');
				var themeLink = '#nav/' + themePage.replace(/,/g, '/');

				var objectivePage = $(sprintf('#pageNavigation .navSection #objectives .navItem span[model=%s]', themeId)).data('key');
				var objectiveLink = '#nav/' + objectivePage.replace(/,/g, '/');

                var $themeLink = $('<span>'); // wrapper
				$('<a>')
					.attr('href', '#nav/' + themePage.replace(/,/g, '/'))
					.text(themeName)
					.append($('<i>').addClass('icon-ui-arrow-right-4'))
					.appendTo($themeLink);

				var $objectiveLink = $('<span>'); // wrapper
				$('<a>')
					.attr('href', '#nav/' + objectivePage.replace(/,/g, '/'))
					.text(objectiveName)
					.append($('<i>').addClass('icon-ui-arrow-right-4'))
					.appendTo($objectiveLink);

				$('header > hgroup > h2').html(sprintf(this.localized('title'), $objectiveLink.html(), $themeLink.html() )); // xss safe


				// spin
				this.$el.find('.addButton').hide();
				this.$el.find('#activitiesSortable').spin({
					top: '70px'
				});

				this.activityCollection.reset();
				this.activityCollection.setIds(stratFileId, themeId, objectiveId);

				// this will get the activities for an objective, when user taps on an activitiesDetail item
				this.activityCollection.fetch({
					success: function(model) {
						console.debug("Successfully downloaded activities.");
						this.activityListView.render();
						this._applyPermissions();
						this.$el.find('#activitiesSortable').spin(false);
					}.bind(this),
					error: function(model, xhr, options) {
						this.$el.find('#activitiesSortable').spin(false);
						console.error(sprintf("Oops, couldn't load activities. Status: %s %s", xhr.status, xhr.statusText));
					},
					silent: true // send no 'add' events (cause they don't honour the collection order)
				});

			},

            _applyPermissions: function() {
                var self = this,
                    stratFile = this.router.stratFileManager.stratFileCollection.get(this.objective.get('stratFileId'));
                
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
                	this.$el.find('.addButton').show();
                    
                }
                else if (stratFile.hasReadAccess('PLAN')) {

                	// trash buttons
                    this.$el.find('nav').each(function() {
                        $(this).attr('disabled', true);
                    });

                    // add buttons
                	this.$el.find('.addButton').hide();


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
					this.$el.find('.addButton').hide();                    

                    $perms.text(self.localized('LBL_NO_ACCESS'));
                    $perms.show();

                }

            },			

			_showEditActivityDialog: function(e, activityId) {
				e.preventDefault();
				e.stopPropagation();

				var message = this.localized('dialogEditActivityTitle'),
					template = $('#activityDetailsDialog').clone().html();

				var activity = this.activityCollection.get(activityId);

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '700px'
						},
						message: message,
						input: template,
	                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localized('dialogActivitySave') }),
	                              $.extend({}, vex.dialog.buttons.NO, { text: self.localized('btn_cancel') }) ],						
						callback: function(data) {
							// is false if cancelled
							if (data) {
								// add the activity
								console.log(data);

								var startDate = $.stratweb.formattedInterchangeDate(data.activityStartDate);
								var endDate = $.stratweb.formattedInterchangeDate(data.activityEndDate);

								activity.set({
									'action': data.activityAction,
									'endDate': endDate,
									'ongoingCost': data.activityOngoingCost,
									'responsible': data.activityResponsible,
									'ongoingFrequency': data.activityOngoingFrequency,
									'startDate': startDate,
									'upfrontCost': data.activityUpfrontCost,
								});

								activity.save(null, {
									success: function(model, response, options) {
										console.debug("Saved activity with id: " + model.get("id"));
									},
									error: function(model, xhr, options) {
										console.error("Oops, couldn't save activity.");
									}
								});


							}
						}
					})
					.bind('vexOpen', function() {
						var $dialog = $(this);
						$dialog.find('.vex-dialog-buttons').spin('small')
						self._setUpActivityDialog($dialog);

						// populate - nb this will send out a change event if applicable
						activity.fetch({
							success: function(model) {
								console.debug("Synced activity: " + model.get('action'));
								$dialog.find('.vex-dialog-buttons').spin(false);

								// action
								$dialog.find('#activityAction').val(model.get('action'));

								// responsible
								$dialog.find('#activityResponsible').select2('val', model.get("responsible"));

								// startDate
								var startDate = $.stratweb.formattedDateForDatePicker(model.get('startDate'));
								var startDateEle = $dialog.find('#activityStartDate');
								startDateEle.datepicker().val(startDate);

								// endDate
								var endDate = $.stratweb.formattedDateForDatePicker(model.get('endDate'));
								var endDateEle = $dialog.find('#activityEndDate');
								endDateEle.datepicker().val(endDate);

								// if we have a startDate && an endDate (both presumed valid), then we should add some initial constraints
								if (startDate != '' && endDate != '') {
									console.debug('constraining dates');
									startDateEle.datepicker("option", "maxDate", endDate);
									endDateEle.datepicker('option', 'minDate', startDate);
								};

								// upfront cost
								$dialog.find('#activityUpfrontCost').val(model.get('upfrontCost'));

								// ongoing cost
								$dialog.find('#activityOngoingCost').val(model.get('ongoingCost'));

								// ongoing frequency
								$dialog.find('#activityOngoingFrequency').select2('val', model.get('ongoingFrequency'));

							},
							error: function(model, xhr, options) {
								console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
								$dialog.find('.vex-dialog-buttons').spin(false);
							}
						});

					});

			},

			_showAddActivityDialog: function(e) {

				e.preventDefault();
				e.stopPropagation();

				var message = this.localized('dialogAddActivityTitle'),
					template = $('#activityDetailsDialog').clone().html();

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '700px'
						},
						message: message,
						input: template,
	                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localized('dialogActivityAdd') }),
	                              $.extend({}, vex.dialog.buttons.NO, { text: self.localized('btn_cancel') }) ],						
						callback: function(data) {
							// is false if cancelled
							if (data) {
								// add the activity
								console.log(data);

								var startDate = $.stratweb.formattedInterchangeDate(data.activityStartDate);
								var endDate = $.stratweb.formattedInterchangeDate(data.activityEndDate);

								var position = self.activityCollection.length;
								var activity = new Activity({
									'action': data.activityAction ? data.activityAction : self.localized('default_activity_name'),
									'endDate': endDate,
									'ongoingCost': data.activityOngoingCost,
									'responsible': data.activityResponsible,
									'ongoingFrequency': data.activityOngoingFrequency,
									'startDate': startDate,
									'upfrontCost': data.activityUpfrontCost,
									'order': position,
									'objectiveId': self.objective.id,
									'themeId': self.objective.themeId || self.objective.get('themeId'),
									'stratFileId': self.objective.stratFileId || self.objective.get('stratFileId')
								});
								activity.save(null, {
									success: function(model, response, options) {
										console.debug("Created activity with id: " + model.get("id"));
										self.activityCollection.add(model);
									},
									error: function(model, xhr, options) {
										console.error("Oops, couldn't save activity.");
									}
								});

							}
						}
					})
					.bind('vexOpen', function() {
						self._setUpActivityDialog($(this));
					});

			},

			_setUpActivityDialog: function($dialog) {

				var self = this;

				// frequency
				$dialog.find('#activityOngoingFrequency').select2();

				// hook up dates
				var $startDate = $dialog.find('#activityStartDate');
				var $endDate = $dialog.find('#activityEndDate');

				$startDate.datepicker({
					// todo: localized dates?
					dateFormat: "yy-mm-dd",
					changeMonth: true,
					changeYear: true,
					showAnim: "slideDown",
					onClose: function(dateText, datePicker) {
						// min end Date must be at least this date; onClose picks up when we clear out a date too
						$('#activityEndDate').datepicker("option", "minDate", dateText);
					}
				});
				$endDate.datepicker({
					// todo: localized dates?
					dateFormat: "yy-mm-dd",
					changeMonth: true,
					changeYear: true,
					showAnim: "slideDown",
					onClose: function(dateText, datePicker) {
						// max start date must be lte this date
						$('#activityStartDate').datepicker("option", "maxDate", dateText);
					}
				});
				$endDate.prev('i').on(self.router.clicktype, function() {
                    $endDate.datepicker("show");
                });
                $startDate.prev('i').on(self.router.clicktype, function() {
                    $startDate.datepicker("show");
                });


				// restrict input on numeric fields (no decimals on changes)
				$dialog.find("input[type='number']").keydown($.stratweb.integerField).css({
					width: '100%'
				});

				// hook up 'responsible' dropdown
				var lastResults = [];
				var responsibleEle = $dialog.find("#activityResponsible");
				responsibleEle.select2({
					placeholder: this._localizable.plhrActivityResponsible,
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
							};
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

				$('.select2-container').css({
					width: '100%'
				});
			},

			_deleteActivity: function(e, activityId) {
				e.preventDefault();
				e.stopPropagation();

				var activity = this.activityCollection.get(activityId);

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						message: sprintf(this.localized('dialogDeleteMessage'), activity.escape('action')),
	                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localized('dialogActivityDelete') }),
	                              $.extend({}, vex.dialog.buttons.NO, { text: self.localized('btn_cancel') }) ],						
						callback: function(okPressed) {
							if (okPressed) {
								console.debug("deleting: " + activity.get('action'));
								activity.destroy({
									success: function(model, response, options) {
										console.debug("Deleted activity with id: " + model.get("id"));

									}.bind(this),
									error: function(model, xhr, options) {
										console.error("Oops, couldn't delete activity.");
									}
								});
							};
						}
					});
			},

            _showNavigator: function(e) {
                e.preventDefault();
                e.stopPropagation();

				var theme = this.router.stratFileManager.themeCollection.get(this.objective.get('themeId'));
                this.router.pageNavigationView.showNavigator(theme, this.objective);
            }


		});

		return view;
	});