define(['Config', 'i18n!nls/ShareMenuView.i18n', 'Dictionary', 'AccessControlEntry', 'AccessControlEntryCollection', 'AccessControlEntryListView', 'EditionManager', 'UpgradeMenuView', 'backbone'],

	function(config, localizable, Dictionary, AccessControlEntry, AccessControlEntryCollection, AccessControlEntryListView, EditionManager, UpgradeMenuView) {

		var view = Backbone.View.extend({

			el: 'li#navShare',

			initialize: function(router, gLocalizable) {

				_.bindAll(this, '_populate', '_addStratfileAce', '_deleteStratfileAce', '_togglePermissionSelect', '_applyPermissionSelection');

				this.localizable = new Dictionary(localizable, gLocalizable);
				this.router = router;
				this.userData = $.parseJSON($.localStorage.getItem('user'));
                this.$nano = this.$el.find('.nano');

				var self = this;

				$('#navMenubar').on('menuOpened', function(e, parent){
					if($(parent).is('#navShare'))
						self._populate(parent);
				});

				this.$el
                    .on(this.router.clicktype, '.trigger', function() {self.$nano.nanoScroller();})
                    .on(this.router.clicktype, function(){self.$el.find('.access-level').removeClass('active');})
                    .on(this.router.clicktype, '.permission-type', this._applyPermissionSelection)
                    .on(this.router.clicktype, '.access-level', this._togglePermissionSelect)
					.on(this.router.clicktype, '#sendAceInvite', this._addStratfileAce)
					.on(this.router.clicktype, '.deleteUser', this._deleteStratfileAce);


			},

            _injectTemplate: function(template, stratFile){

                // can be either the owner or invitee template

                var compiledTemplate = Handlebars.templates[template],
                    ace = stratFile.get('accessControlEntry'),
                    acePlanCurrentPermission = '',
                    aceStratBoardCurrentPermission = '',
                    aceOwnerMail = '',
                    aceOwnerName = '',
                    aceEdit = this.localizable.get('aceSelect_edit'),
                    aceView = this.localizable.get('aceSelect_view'),
                    aceNone = this.localizable.get('aceSelect_none');

                if(ace){

                    aceOwnerMail = (ace.owner.email === 'root@stratpad.com') ? '' : ace.owner.email ;
                    aceOwnerName = ace.owner.fullName;

                    acePlanCurrentPermission = aceNone;
                    aceStratBoardCurrentPermission =  aceNone;

                    _.each(ace.permissions, function (permission) {
                        if (permission.domain === 'PLAN') {
                            if (permission.permission === 'WRITE')
                                acePlanCurrentPermission = aceEdit;
                            else if(permission.permission === 'READ')
                                acePlanCurrentPermission = aceView;
                        } else if (permission.domain === 'STRATBOARD') {
                            if (permission.permission === 'WRITE')
                                aceStratBoardCurrentPermission = aceEdit;
                            else if(permission.permission === 'READ')
                                aceStratBoardCurrentPermission = aceView;
                        }
                    });
                }

                var context = _.extend(this.localizable.all(), {
                    aceOwnerEmail: aceOwnerMail,
                    aceOwnerName: aceOwnerName,
                    acePlanCurrentPermission: acePlanCurrentPermission,
                    aceStratBoardCurrentPermission: aceStratBoardCurrentPermission,
                    aceOwnerPermissions: sprintf(this.localizable.get('aceOwnerPermissions'), aceEdit, aceEdit), // owner can always edit
                    sharedWithPermissions: sprintf(this.localizable.get('sharedWithPermissions'), acePlanCurrentPermission, aceStratBoardCurrentPermission),
                    fullName: this.userData.fullname,
                    email: this.userData.email,
                    md5: (aceOwnerMail.length && aceOwnerMail !== this.userData.email) ? $.md5(aceOwnerMail.toLowerCase().trim()) : $.md5(this.userData.email.toLowerCase().trim())
                });

                var html = compiledTemplate(context);

                this.$el.find('.content').empty().append(html);

                this.$el.find('h4.tooltip')
                    .tooltipster({position:'bottom-left', touchDevices:false, delay:150, maxWidth: 665, offsetX: 20, theme: 'tooltipster-default tooltipster-share'});

            },

			_populate: function(parent){

				var stratFileId = this.router.stratFileManager.stratFileId,
                    stratFile = this.router.stratFileManager.stratFileCollection.get(stratFileId);

                this.$nano.find('.content').scrollTop(0);

                this.$el.find('.content').append('<div id="shareLoadingMask"></div>');
                $('#shareLoadingMask').height(this.$el.find('.menu').height() + 40).spin();

                this.$el.data('stratFileId', stratFileId);

				this.accessControlEntryCollection = new AccessControlEntryCollection(null, {stratFileId:stratFileId});

				var self = this;
				// populate - nb this will send out a change event if applicable
				this.accessControlEntryCollection.fetch({
					success: function(models) {
						console.debug("Synced access control entries: " + models.length);

                        self._injectTemplate('menu/share/ShareMenuOwnerView', stratFile);

						// render lists
						var accessControlEntryListView = new AccessControlEntryListView(
                            self.router,
                            self.accessControlEntryCollection,
                            self.localizable
                        );

						accessControlEntryListView.render();
                        self.$nano.nanoScroller();

					},
					error: function(models, xhr, options) {

                        var messageKey = $.stratweb.firstError(xhr.responseJSON, 'unknownError').key;
                        if (messageKey == 'PERMISSION_DENIED') {

                            // you probably arent the owner or the file is read only, we'll load the invited variant template

                            self._injectTemplate('menu/share/ShareMenuInvitedView', stratFile);

                            console.log(sprintf("You aren't the owner, the current stratfile is read only, or something has gone horribly wrong. Status: %s %s", xhr.status, xhr.statusText));

                        } else {

                            // hey lets do a styley error message to soften the blow

                            self.$el
                                .find('.content')
                                .empty()
                                .append(sprintf('<div class="error">%s</div>', self.localizable.get('errorGettingAce')));

                            console.error(sprintf("Couldn't sync access control entries.", self.localizable.get(messageKey)));

                        }
                    }
				});
			},

			_addStratfileAce: function(e){

                // lets add the email to the ace (maybe)

				e.preventDefault();
                e.stopPropagation();

				var self = this,
                    $inviteInput = this.$el.find('#accessControlInvite'),
					email = $inviteInput.val();

                if (!EditionManager.isFeatureEnabled(EditionManager.FeatureShareStratFile)) {
                    new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureShareStratFile);
                }
                else if(email.length){

                    // we have an email, lets harvest the permissions

                    var $wrapper = $inviteInput.parent(),
                        permissions = this._getPermissions($wrapper);

                    // if for some reason both permissions are none lets warn them about it otherwise send

                    if(!$.isEmptyObject(permissions)){

                        var $spinner = $wrapper.find('#shareSpinner'),
                            stratFile = this.router.stratFileManager.stratFileCollection.get(this.router.stratFileManager.stratFileId),
                            ace = new AccessControlEntry({
                                stratFileId:stratFile.id,
                                principal:{email: email},
                                permissions:permissions
                            });

                        $spinner.spin('small');

                        ace.save(null, {
                            success: function(model) {

                                self.accessControlEntryCollection.add(model);
                                $spinner.spin(false);

                                self.router.pageMenubarView.dismissMenuWithBodyClick = false;
                                $inviteInput.val('');

                                vex.dialog.alert({
                                    className: 'vex-theme-plain',
                                    'message': sprintf(self.localizable.get('aceInviteSent'), email),
                                    callback: function() {
                                        self.router.pageMenubarView.dismissMenuWithBodyClick = true;
                                    }
                                });

                                self.$nano.nanoScroller();

                            },
                            error: function(model, xhr, options) {
                                console.log("error saving ace.");
                                $spinner.spin(false);

                                self.router.pageMenubarView.dismissMenuWithBodyClick = false;                                

                                vex.dialog.alert({
                                    className: 'vex-theme-plain',
                                    'message': self.localizable.get($.stratweb.firstError(xhr.responseJSON, 'share.unknownError').key),
                                    callback: function() {
                                        self.router.pageMenubarView.dismissMenuWithBodyClick = true;
                                    }
                                });

                            }
                        });

                    } else {

                        self.router.pageMenubarView.dismissMenuWithBodyClick = false;

                        vex.dialog.alert({
                            className: 'vex-theme-plain',
                            'message': self.localizable.get('warnNoPermissionsSelected'),
                            callback: function() {
                                self.router.pageMenubarView.dismissMenuWithBodyClick = true;
                            }
                        });

                    }
                }

			},

			_deleteStratfileAce: function(e){

				e.preventDefault();

				var self = this,
					aceId = $(e.currentTarget).parent().data('accessControlEntryId'),
					ace = self.accessControlEntryCollection.get(aceId);

				ace.destroy(null, {
					success: function(model) {

						self.accessControlEntryCollection.remove(model);

                        self.$nano.nanoScroller();

					},
					error: function(model, xhr, options) {
                        console.log("error removing ace.");
					}
				})

			},

            _getPermissions: function($parent){

                // get permissions from the invite form and return as appropriate array

                var permissions = [],
                    i = 0;

                $parent
                    .find('.access-level')
                    .each(function () {

                        // each select
                        var $this = $(this),
                            accessLevel = $this.attr('data-permission');

                        if(accessLevel !== 'NONE'){
                            permissions[i] = {
                                domain: $this.attr('data-type'),
                                permission: accessLevel
                            };
                            i++;
                        }
                    });

                return permissions;

            },

            _togglePermissionSelect: function(e){

                // toggles any permission selects in the share menu.

                e.preventDefault();
                e.stopPropagation();
                var $this = $(e.currentTarget);
                this.$el.find('.access-level').not($this).removeClass('active');
                $this.toggleClass('active');

            },

            _applyPermissionSelection: function(e){

                // swaps the access level and stores the selected permission level on the toggle

                e.preventDefault();
                e.stopPropagation();

                var self = this,
                    $this = $(e.currentTarget),
                    $parent = $this.parents('.access-level'),
                    previousPerm = $parent.attr('data-permission'),
                    previousText = $parent.find('i').text();

                $parent
                    .attr('data-permission', $this.attr('data-permission'))
                    .find('i')
                    .text($this.text());

                $parent.removeClass('active');

                if($parent.is('.al-invited')){

                    var $user = $this.parents('.user-entry'),
                        aceId = $user.data('accessControlEntryId'),
                        ace = this.accessControlEntryCollection.get(aceId),
                        permissions = [],
                        index = 0;

                    $user
                        .find('.access-level')
                        .each(function () {

                            var $this = $(this),
                                perm = $this.attr('data-permission'),
                                type = $this.attr('data-type');

                            if(perm === 'READ' || perm === 'WRITE'){
                                permissions[index] = {
                                    domain: type,
                                    permission: perm
                                };
                                index++;
                            }

                        });

                    if(index === 0){
                        self.router.pageMenubarView.dismissMenuWithBodyClick = false;

                        vex.dialog.alert({
                            className: 'vex-theme-plain',
                            'message': self.localizable.get('aceEditErrorNoPerms'),
                            callback: function() {
                                self.router.pageMenubarView.dismissMenuWithBodyClick = true;
                            }
                        });

                        $parent
                            .attr('data-permission', previousPerm)
                            .find('i')
                            .text(previousText);
                    } else
                        ace.set('permissions', permissions);

                }

            }

		});

		return view;
	});