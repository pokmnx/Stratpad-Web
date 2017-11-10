define(['PageStructure', 'UpgradeMenuView', 'Config', 'i18n!nls/StratFileMenuView.i18n', 'StratFileListView', 'StratFile', 'EditionManager', 'ExportDialog', 'AcceptInviteDialog', 'backbone', 'fileUpload'],

    function(pageStructure, UpgradeMenuView, config, localizable, StratFileListView, StratFile, EditionManager, ExportDialog, AcceptInviteDialog) {

        var view = Backbone.View.extend({

            el: 'li#navStratFile',

            initialize: function(router, gLocalizable) {
                _.bindAll(this, "deleteOrRemoveStratfile", "copyStratfile", "newStratfile", "loadStratFile",
                    "importStratFile", "showMessageInImportDialog", "localized");

                this._localizable = _.defaults(localizable || {}, gLocalizable);
                this.router = router;
                this.stratFileCollection = this.router.stratFileManager.stratFileCollection;

                // our basic template
                var compiledTemplate = Handlebars.templates['menu/StratFileMenuView'],
					html = compiledTemplate(this._localizable),
					self = this;
				$('#navStratFile .menu').append(html);

                // we own the StratFileListView
                this.stratFileListView = new StratFileListView(this.router, this.stratFileCollection);

				// import, export, delete, clone, load and sharing-accept handlers
				this.$el
					.on(this.router.clicktype, '#exportStratFile', function(e) {
						var exportDialog = new ExportDialog(this.router);
						exportDialog.exportStratFile(e);
						this.router.pageMenubarView.closeMenu(this.$el);
					}.bind(this))
					.on(this.router.clicktype, '#importStratFile', function(e) {
						this.importStratFile(e);
					}.bind(this))
                    .on(this.router.clicktype, '.pendingAcceptance', function(e) {
	                	var sharedStratFileId = $(e.currentTarget).data('id');
						var acceptInviteDialog = new AcceptInviteDialog(this.router);
						acceptInviteDialog.showSharedStratfileDialog(sharedStratFileId);
						this.router.pageMenubarView.closeMenu(this.$el);						       
                    }.bind(this))
					.on(this.router.clicktype, 'article', this.loadStratFile)
					.on(this.router.clicktype, '.deleteStratfile', this.deleteOrRemoveStratfile)
					.on(this.router.clicktype, '.copyStratfile', this.copyStratfile);

                // when the menu actually opens
				$('#navMenubar').bind('menuOpened', function(e, menu) {
					if($(menu).is('#navStratFile')){
						console.debug('stratfiles menu opened');
						
						// because we repopulate from scratch, prevent the flash on the selected stratfile
						self.$el.find('.stratFileItem.active').removeClass('active');

						// spin
						var $header = self.$el.find('header'),
						 	opts = _.extend({left: '190px'}, $.fn.spin.presets.small);
                        $header.spin(opts);

						// repopulate
						self.stratFileCollection.fetch({
							success: function() {
								$header.spin(false);
							},
							error: function() {
								$header.spin(false);
							}
						});
					}
				});

                // hook up new stratfile button
                this.newStratfileButton = $('#newStratfile');                
                this.newStratfileButton.on(router.clicktype, self.newStratfile);

                $(document).bind("stratFileLoaded", function(e, stratFile) {

                	// if we create or select a new stratfile, turn off the spinner after loading 
                    self.newStratfileButton
                        .prop('disabled', false)
                        .find('i')
                        .removeClass('spinning')
                        .spin(false);

                    // navigate to 'about your company' when it's a new stratfile
                    if (this.navigateToStart) {
                        this.router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_ABOUT, 0, true); 
                        this.navigateToStart = false;                       
                    }

                }.bind(this));

            },

            loadStratFile: function(e) {

                e.preventDefault();

                var $ele = $(e.target),
                    $container = $ele.closest('article');

                if(!$container.is('.pendingAcceptance')){

                    var stratFileId = $container.attr('data-id');

                    console.log('load selected stratfile: ' + stratFileId);

                    // load the new stratfile and notify listeners
                    this.router.stratFileManager.loadStratFile(stratFileId);

                    // close the menu - eventually all pages will have a spinner while loading to help with any delays
                    this.router.pageMenubarView.closeMenu(this.$el);
                }

            },

			importStratFile: function(e) {
				// key points: we return an error if you try to upload one of your stratfiles with the same uuid (replace dialog)
				// if it is somebody else's stratfile, and you import it, we will give it a new uuid silently (no replace dialog)
				//  - ie. there is no way we could ever replace somebody else's stratfile in the db with the existing uuid

				e.preventDefault();
				e.stopPropagation();				

				var isStratFileImportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureImportStratFile);

				if(!isStratFileImportEnabled){
                	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureImportStratFile);

				} else {
					console.debug("Show file upload");
					this.router.pageMenubarView.closeMenu(this.$el);

					var compiledTemplate = Handlebars.templates['dialogs/FileUpload'];
					var html = compiledTemplate(this._localizable);
					var self = this;
					vex
						.dialog.open({
							className: 'vex-theme-plain importStratFile',
							message: self.localized('importDialog_title'),
							input: html,
							// single done button
							buttons: [{
										  text: self.localized('btn_done'),
										  type: 'button',
										  className: 'vex-dialog-button-primary',
										  click: function($vexContent, event) {
											  return vex.close($vexContent.data().vex.id);
										  }
									  }],
							callback: function(stratFile) {
								// is false if unsuccessful
								if (stratFile) {
									// load up the stratfile
									self.router.stratFileManager.stratFileCollection.add(stratFile, {at: 0});
									$(document).trigger("stratFileLoaded", stratFile);
								}
							}
						})
						.bind('vexOpen', function(e, vex) {
							console.debug("FileUpload dialog ready!");

							var $dialogTitle = vex.$vexContent.find('.vex-dialog-message'), 
								$btnOk = vex.$vexContent.find('.vex-dialog-button-primary');;
							$('<span>').addClass('icon-ui-question').attr('title', self.localized('importDialog_title_tip')).appendTo($dialogTitle);

							$dialogTitle.find('span')
								.tooltipster({position:'bottom-left', touchDevices:true, delay:150 });

							// update the filupload url when changing the replace checkbox
							$('#fileUploadDialog #overwrite input[type=radio]').on('change', function() {
								var $radio = $(this);
								var isChecked = $radio.is(':checked');
								$('#fileupload').fileupload({url: config.serverBaseUrl + "/stratfiles" + (isChecked ? '?overwrite=' + $radio.val() : '') });
							});

							$('#fileupload').fileupload({
								url: config.serverBaseUrl + "/stratfiles",
								dataType: 'json',
								add: function (e, data) {
									var goUpload = true;
									var uploadFile = data.files[0];

									// validation
									if (!(/\.(xml|stratfile|stratbak)$/i).test(uploadFile.name)) {
										self.showMessageInImportDialog(self.localized('importDialog_msg_invalid_stratfile'));
										goUpload = false;
									}
									if (uploadFile.size > 1000000) { // 2mb
										self.showMessageInImportDialog(self.localized('importDialog_msg_file_too_large'));
										goUpload = false;
									}

									// start upload
									if (goUpload == true) {
										$btnOk.prop('disabled', true);
										self.showMessageInImportDialog(self.localized('importDialog_msg_uploading'));
										var opts = _.extend({left: '400px'}, $.fn.spin.presets.small);
										$dialogTitle.spin(opts);
										data.submit();
									}
								},
								done: function(e, data) {
									if (data.result.status == 'success') {
										var stratFile = new StratFile(data.result.data.stratFile);
										console.debug(sprintf("Uploaded: %s: %s", stratFile.get('name'), stratFile.get('id')));
										self.showMessageInImportDialog(self.localized('importDialog_msg_success'));
										vex.$vexContent.data().vex.value = stratFile;
									} else {
										var messageKey = $.stratweb.firstError(data.result, 'import.unknownError').key;
										var message = self.localized(messageKey);

										console.error("Problem uploading stratfile: " + messageKey);
										self.showMessageInImportDialog(message);
										$('#fileUploadDialog .progressBar > div').css({width: '0'});
										vex.$vexContent.data().vex.value = false;
									}
									$dialogTitle.spin(false);
									$btnOk.prop('disabled', false);
								},
								fail: function(e, data) {
									// 500, 409, 401 errors
									console.error("Problem uploading stratfile: " + data.errorThrown);
									if (data.jqXHR.status == 409) {
										message = self.localized('importDialog_msg_duplicate_stratfile');
										$('#fileUploadDialog #overwrite').show('slow');
									} else {
										var error = $.stratweb.firstError(data.jqXHR.responseJSON, 'importDialog_msg_generic_error');
										message = self.localized(error.key);
									}

									self.showMessageInImportDialog(message);
									$('#fileUploadDialog .progressBar > div').css({width: '0'});
									vex.$vexContent.data().vex.value = false;
									$dialogTitle.spin(false);
									$btnOk.prop('disabled', false);
								},
								progressall: function(e, data) {
									var progress = parseInt(data.loaded / data.total * 100, 10);
									$('#fileUploadDialog .progressBar > div').css(
										'width',
										progress + '%'
									);
									if (progress == 100) {
										self.showMessageInImportDialog(self.localized('importDialog_msg_processing'));
									}
								}
							});

						});
				}

			},

			showMessageInImportDialog: function(message) {
				// quickly show a message, on the import dialog, for the user to see
				$('.importStratFile .vex-dialog-buttons span').remove();
				$('<span/>').text(message).prependTo( $('.importStratFile .vex-dialog-buttons') ).delay(8000).fadeOut({duration: 1000, complete: function() {$(this).remove();}});
			},

            deleteOrRemoveStratfile: function(e) {

                e.preventDefault();
                e.stopPropagation();

                var $this = $(e.target),
                    $wrapper = $this.parents('.stratFileItem'),
                    $header = $wrapper.parent().prev(),
                    stratFileId = $wrapper.data('id'),
                    stratFile = this.stratFileCollection.get(stratFileId),
                    message = stratFile.isOwner() 
                    	? sprintf(this._localizable.confirmDeleteMessage, stratFile.escape('name')) 
                    	: sprintf(this._localizable.confirmRemoveMessage, stratFile.escape('name'))

                if ($this.attr('disabled')) {
                    return false;
                };

                this.router.pageMenubarView.dismissMenuWithBodyClick = false;

                vex.dialog.confirm({
                    className: 'vex-theme-plain',
                    message: message,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this._localizable.btn_ok }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this._localizable.btn_cancel }) ],                                        
                    callback: function(value) {
                        if (value) {

 							var opts = _.extend({left: '190px'}, $.fn.spin.presets.small);
                            $header.spin(opts);

                            // are we deleting the current stratfile?
                            var isCurrentStratFile = (stratFileId == this.router.stratFileManager.stratFileId);

                            // is this the last stratfile?
                            var isLastStratFile = (this.stratFileCollection.length == 1);

                            // the stratfile pos
                            var position = this.stratFileCollection.indexOf(stratFile);

                            // if we're at the end, go previous; otherwise, go next
                            var nextPosition = (position == this.stratFileCollection.length - 1) ? position - 1 : position;

                            var outcomes = {
                                success: function() {

                                    if (isLastStratFile) {
                                    	// we don't actually ever get here, because there are a few shared ones
                                        this.router.stratFileManager.createStratFile();
                                    } else if (isCurrentStratFile) {
                                        // select and load the next one
                                        var newStratFile = this.stratFileCollection.at(nextPosition);

                                        // load up the stratfile
                                        this.router.stratFileManager.loadStratFile(newStratFile.get('id'));
                                    } else {
                                        $header.spin(false);
                                    }

                                }.bind(this),
                                error: function() {
                                    console.error("Oops, couldn't delete stratFile.");
                                    $header.spin(false);
                                }
                            };

                            if (stratFile.isOwner()) {
	                            stratFile.destroy(outcomes);
							}
							else {
								stratFile.unlink(outcomes);
							}

                        };
                    }.bind(this),
                    afterClose: function() {
                        this.router.pageMenubarView.dismissMenuWithBodyClick = true;
                    }.bind(this)
                });

            },

            copyStratfile: function(e) {
                // really a clone function
                e.preventDefault();
                e.stopPropagation();

				var isStratFileCloneEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureCloneStratFile);



				if(!isStratFileCloneEnabled){
                	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureCloneStratFile);					

				} else {

					var $this = $(e.target),
						$wrapper = $this.parents('.stratFileItem'),
						$header = this.$el.find('header'),
						stratFileId = $wrapper.data('id');

					var opts = _.extend({left: '190px'}, $.fn.spin.presets.small);
                    $header.spin(opts);


					console.debug("cloning new stratfile: " + stratFileId);

					$.ajax({
						url: config.serverBaseUrl + sprintf("/stratfiles/%s/clone", stratFileId),
						type: "GET",
						dataType: 'json',
						contentType: "application/json; charset=utf-8"
					})
						.done(function(response, textStatus, jqXHR) {

							var cloneStratFile = new StratFile(response.data.stratFile);
							this.stratFileCollection.add(cloneStratFile, {
								at: 0
							});

							// this is pretty fresh - don't need to fetch again
							$(document).trigger("stratFileLoaded", cloneStratFile);

							// select in menu
							this.stratFileListView.select(cloneStratFile.get('id'));

						}.bind(this))
						.fail(function(jqXHR, textStatus, errorThrown) {
							console.error("%s: %s", textStatus, errorThrown);
						})
						.always(function() {
							$header.spin(false);
						});
				}

            },

            newStratfile: function(e) {
                e.preventDefault();
                e.stopPropagation();

				var isStratFileCreateEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureCreateStratFile);

				if(!isStratFileCreateEnabled){

                	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureCreateStratFile);					

				} else {

                    $('#navMenubar > li').removeClass('active');
                    $('body')
                        .removeClass('navsettings-active')
                        .addClass('new-strafile-created');

                    this.newStratfileButton
                        .removeClass('spAnimated spshake infinite')
                        .tooltipster('hide')
                        .prop('disabled', true)
                        .find('i')
                        .addClass('spinning')
                        .spin('small');

					console.debug("creating new stratfile");
					this.navigateToStart = true;
					this.router.stratFileManager.createStratFile(true);
				}
            },

			localized: function(key) {
				if (key in this._localizable) {
					return this._localizable[key];
				}
				else {
					return key;
				}
			}


        });

        return view;
    });