define(['Config', "i18n!nls/Global.i18n", 'i18n!nls/AcceptInviteDialog.i18n', 'Dictionary', 'AccessControlEntry', 'EditionManager', 'UpgradeMenuView'],

	function(config, gLocalizable, localizable, Dictionary, AccessControlEntry, EditionManager, UpgradeMenuView) {

		var AcceptInviteDialog = Class.extend({

			initialize: function(router) {
				this.router = router;
				this.localizable = new Dictionary(gLocalizable, localizable);
			},

	        showSharedStratfileDialog: function(sharedStratFileId){

	            var self = this,
	                sharedStratFile = this.router.stratFileManager.stratFileCollection.get(sharedStratFileId),
	                ace = new AccessControlEntry(sharedStratFile.get('accessControlEntry')),
	                context = _.extend(this.localizable.all(), {
	                    'acceptanceDialogMessage': sprintf(this.localizable.get('acceptanceDialogMessage'), ace.get('owner').fullName, ace.get('stratFileName')),
	                    'canAddSharedFile': EditionManager.isFeatureEnabled(EditionManager.FeatureCreateStratFile)
	                }),
	                btnAccept = $.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('acceptanceDialogBtnAccept'), click: function($vexContent, event) {
			            $vexContent.data().vex.value = 'accept';
			            vex.close($vexContent.data().vex.id);
			        	} });
	                btnUpgrade = $.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('acceptanceDialogBtnUpgrade'), click: function($vexContent, event) {
			            $vexContent.data().vex.value = 'upgrade';
			            vex.close($vexContent.data().vex.id);
			        	} });
	                buttons = [
		              context.canAddSharedFile ? btnAccept : btnUpgrade,
	                  $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('acceptanceDialogBtnReject'), click: function($vexContent, event) {
			            $vexContent.data().vex.value = 'reject';
			            vex.close($vexContent.data().vex.id);
				        } }), 
	                  $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel'), click: function($vexContent, event) {
			            $vexContent.data().vex.value = 'cancel';
			            vex.close($vexContent.data().vex.id);
				        } }) 
	                ]
	                compiledTemplate = Handlebars.templates['dialogs/AcceptInviteDialog'],
	                html = compiledTemplate(context);

	            vex
	                .dialog.open({
	                    className: 'vex-theme-plain',
	                    message: this.localizable.get('acceptanceDialogTitle'),
	                    input: html,
	                    buttons: buttons,
	                    callback: function(choice) {
	                        if(choice == 'accept'){
	                            $.ajax({
	                                    url: config.serverBaseUrl + "/invite/" + ace.get('acceptToken') + "/accept",
	                                    type: "GET",
	                                    dataType: 'json',
	                                    contentType: "application/json; charset=utf-8"
	                                })
	                                .success(function(response, textStatus, jqXHR) {

	                                    self.router.stratFileManager.loadStratFile(sharedStratFile.get('id'));

	                                })
	                                .fail(function(jqXHR, textStatus, errorThrown) {
	                                    console.error("%s: %s", textStatus, errorThrown);
	                                });
	                        } 
	                        else if (choice == 'reject') {
	                            $.ajax({
	                                    url: config.serverBaseUrl + "/invite/" + ace.get('acceptToken') + "/reject",
	                                    type: "GET",
	                                    dataType: 'json',
	                                    contentType: "application/json; charset=utf-8"

	                                })
	                                .success(function(response, textStatus, jqXHR) {

	                                    self.router.stratFileManager.stratFileCollection.remove(sharedStratFile);

	                                })
	                                .fail(function(jqXHR, textStatus, errorThrown) {
	                                    console.error("%s: %s", textStatus, errorThrown);
	                                });
	                        }
	                        else if (choice == 'upgrade') {
	                        	// trying to accept a share but they are at their plan limit
	                        	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureCreateStratFile);
	                        }
	                    }
	                })
	                .bind('vexOpen', function(e, vex) {


	                });


	        }			

				

		});

		return AcceptInviteDialog;
	});