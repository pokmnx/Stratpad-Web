define(['backbone'],
	function() {

		var view = Backbone.View.extend({

			// will surround the handlebar template with a li.accessControlEntryItem
			tagName: 'li',
			className: 'user-entry group',

			initialize: function(router, accessControlEntry, localizable) {
				_.bindAll(this, 'render');
				this.router = router;
				this.accessControlEntry = accessControlEntry;
				this.localizable = localizable;
			},

			render: function() {

				// properties are simply absent if they were not set

				var compiledTemplate = Handlebars.templates['menu/share/AccessControlEntryRowView'],
                    aceJson = this.accessControlEntry.toJSON(),
                    principal = this.accessControlEntry.get('principal'),
                    invitee = principal.hasOwnProperty('fullName') ? sprintf('%s <%s>', principal.fullName, principal.email) : principal.email,
                    inviteeStatus = (this.accessControlEntry.get('accepted')) ? this.localizable.get('inviteeAccepted') : this.localizable.get('inviteePending'),
                    permissionContext = this._setPermissionContext(aceJson.permissions),
                    context = _.extend(aceJson,
                        permissionContext,
                        this.localizable.all(),
                        {
                            md5: $.md5(this.accessControlEntry.get('principal').email.toLowerCase().trim()),
                            inviteeStatus:inviteeStatus,
                            invitee: invitee
                        }
                    );

				var html = compiledTemplate(context);

				this.$el.html(html); // xss safe
				this.$el.data('accessControlEntryId', this.accessControlEntry.id);

				return this;
			},

            lockMenuForUpdate: function(){

                //used during a save for row to lock the menu and give a spinner. called in acelistview.

                this.$el.append('<div id="userUpdateSpinner" />');
                $('#userUpdateSpinner').spin('small');
                this.$el.parents('.content').append('<div id="userUpdateLockMask" />');


            },

            unlockMenu: function(){

                $('#userUpdateSpinner').spin(false).remove();
                $('#userUpdateLockMask').remove();

            },

            _setPermissionContext: function(permissions){

                var aceEdit = this.localizable.get('aceSelect_edit'),
                    aceView = this.localizable.get('aceSelect_view'),
                    aceNone = this.localizable.get('aceSelect_none'),
                    currentPermissions = {
                        "acePlanCurrent":aceNone,
                        "aceStratBoardCurrent":aceNone,
                        "acePlanCurrentPermissions":'NONE',
                        "aceStratboardCurrentPermissions":'NONE'
                    };

                // as well as sending current permissions for storage on el
                // we also have to map the localized permission select values to the server codes for those permissions
                // and add them to the context for render

                _.each(permissions, function (permission) {
                    if (permission.domain === 'PLAN') {
                        currentPermissions["acePlanCurrentPermissions"] = permission.permission;
                        if (permission.permission === 'WRITE'){
                            currentPermissions["acePlanCurrent"] = aceEdit;
                        } else if(permission.permission === 'READ'){
                            currentPermissions["acePlanCurrent"] = aceView;
                        }
                    } else if (permission.domain === 'STRATBOARD') {
                        currentPermissions["aceStratboardCurrentPermissions"] = permission.permission;
                        if (permission.permission === 'WRITE'){
                            currentPermissions["aceStratBoardCurrent"] = aceEdit;
                        } else if(permission.permission === 'READ'){
                            currentPermissions["aceStratBoardCurrent"] = aceView;
                        }
                    }
                });

                return currentPermissions;

            }

		});

		return view;
	});