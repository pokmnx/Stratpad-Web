define(['PageStructure', 'UpgradeMenuView', 'Config', 'i18n!nls/ProfileMenuView.i18n', 'i18n!nls/PageLandingView.i18n', 'Dictionary', 'EditionManager', 'i18n!nls/Quotes.i18n', 'UserServiceProvider', 'backbone'],

    function(pageStructure, UpgradeMenuView, config, pmLocalizable, plLocalizable, Dictionary, EditionManager, quotes, UserServiceProvider) {

        var view = Backbone.View.extend({

            el: 'li#navUser',

            initialize: function(router, gLocalizable) {
                _.bindAll(this, 'changePassword', 'validateChangePass', 'editionDetails', 'updateChangePassVex',
                    'passwordStrength', 'editProfile', 'saveUserInfo', 'updateRecurringBillingMessage', 'toggleRecurringBilling', 'goConnect', 'goConnectReport', 'goConnectForm');

				this.localizable = new Dictionary(pmLocalizable, gLocalizable, plLocalizable);

                this.router = router;
				this.user = this.router.user;

				// context for template
				var context = _.extend({
						md5: $.md5(this.user.get('email').toLowerCase().trim())
					}, 
					this.localizable.all(), 
					this.user.toJSON(), 
					this.editionDetails()
				),
				self = this;

				// template
                var compiledTemplate = Handlebars.templates['menu/ProfileMenuView'];
				var html = compiledTemplate(context);
				this.$el.find('.menu').append(html);

				// event handlers
				this.$el
					.on(this.router.clicktype, '#editProfile', this.editProfile)
					.on(this.router.clicktype, '#changePassword', this.changePassword)
					.on(this.router.clicktype, '#showUpgrade', function(){
						new UpgradeMenuView().showUpgradeDialog();
					})
					.on(this.router.clicktype, '.trigger', function() {
						self.$el.find('.nano').nanoScroller();
					})
					.on(this.router.clicktype, '#goConnect', this.goConnect)
					.on(this.router.clicktype, '#goConnectReport', this.goConnectReport)
					.on(this.router.clicktype, '#goConnectForm', this.goConnectForm)
					.on(this.router.clicktype, '#recurringBilling', this.toggleRecurringBilling);

				$('#navMenubar').bind('menuOpened', function(e, menu) {
					if($(menu).is('#navUser')){

						// plan expiry notice; recurring billing

						var $planExpiry = self.$el.find('#planExpiry');
						$planExpiry.empty();
						var opts = _.extend({top: '-5px'}, $.fn.spin.presets.small);
						$planExpiry.spin(opts);

						$.ajax({
                            url: config.serverBaseUrl + "/recurringbilling",
                            type: "GET",
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8"
                        })
                        .done(function(response, textStatus, jqXHR) {
							self.updateRecurringBillingMessage(response);
							$planExpiry.spin(false);
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.error("Oops couldn't load recurring billing. %s: %s", textStatus, errorThrown);
							$planExpiry.text(jqXHR.responseJSON.data.title);
                            $planExpiry.spin(false);
                        });


                        // connect status

                        var $connectStatus = self.$el.find('.connect p');
                        $connectStatus.empty(); 
                        $connectStatus.spin(opts);

			            this.serviceProvider = new UserServiceProvider({userId: self.user.get('id')});
			            this.serviceProvider.fetch({
			                success: function(model) {

			                    $connectStatus.spin(false);

			                    var progress = model.progress(self.user);

                                var compiledTemplate = Handlebars.templates['menu/ConnectStatus'];
								var context = {
									isConnectComplete: progress.progress == 1, 
									isConnectNotStarted: progress.progress <= 1/10 // there is a default name
								};
								var html = compiledTemplate(context);

			                    $connectStatus.html(html); // xss safe

			                },
			                error: function(model, xhr, options) {
			                    console.error(sprintf("Oops, couldn't load UserServiceProvider. Status: %s %s", xhr.status, xhr.statusText) );
			                    $connectStatus.spin(false);
			                }
			            });            

					}
				});
            },

            goConnect: function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.router.pageMenubarView.closeMenu(this.$el);
				var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_HOW_CONNECT_WORKS, pageStructure.PAGE_HOW_CONNECT_WORKS);
				this.router.emitPageChangeEvent = true;
                this.router.navigate(url, {
                    trigger: true,
                    replace: false
                });
            },

            goConnectReport: function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.router.pageMenubarView.closeMenu(this.$el);
				var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, pageStructure.PAGE_CONNECT_REPORT);
				this.router.emitPageChangeEvent = true;
                this.router.navigate(url, {
                    trigger: true,
                    replace: false
                });
            },

            goConnectForm: function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.router.pageMenubarView.closeMenu(this.$el);
				var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0);
				this.router.emitPageChangeEvent = true;
                this.router.navigate(url, {
                    trigger: true,
                    replace: false
                });
            },

            updateRecurringBillingMessage: function(response) {
            	var sku = this.user.get('ipnProductCode'),
            		// a message about when your subscription expires or renews
					message, 
					// the date your subscription expires
					expiry, 
					// the date we will "erase" your data
					erasure,
					// is autorenew enabled?
					isRecurringBilling = response.data.recurringBilling,
					now = moment();

            	if (EditionManager.isMonthly(sku)) {
					expiry = moment(this.user.get('subscriptionStartDate')).endOf('day').add('months', 1);
					erasure = moment(expiry).add('days', 90);

            	} else {

	            	// what we really want is the next Feb 1 after now, for example, if your subscription start date was feb 1
					expiry = moment(this.user.get('subscriptionStartDate')).endOf('day').add('years', 1);
					while (expiry.isBefore(now, 'day')) {
						expiry.add('years', 1);
					}
					erasure = moment(expiry).add('days', 90);

		        }

		        // messaging
	        	if (isRecurringBilling !== null) {
	        		if (isRecurringBilling) {
	            		message = sprintf(this.localizable.get('planRenewal'), 
							expiry.format($.stratweb.dateFormats.out));                            			
	        		} else {
	            		message = sprintf(this.localizable.get('planExpiryNoRenewal'), 
							expiry.format($.stratweb.dateFormats.out), erasure.format($.stratweb.dateFormats.out));                            			
	        		}

	        	} else {
	        		// we can't change this person's recurringBilling status anyway
	        		var messageKey = $.stratweb.firstError(response.responseJSON, 'unknownError').key;
	        		console.warn("Problem fetching recurringBilling status. " + self.localizable.get(messageKey));
	        		message = sprintf(this.localizable.get('planExpiry'), expiry.format($.stratweb.dateFormats.out));
	        	}


		        // dislay
				var $planExpiry = this.$el.find('#planExpiry');
	        	$planExpiry.html(message); // xss safe
	        	$planExpiry.find('#recurringBilling').prop('checked', isRecurringBilling);

            },

            toggleRecurringBilling: function(e) {
            	e.preventDefault();
            	e.stopPropagation();

            	var self = this,
            		isChecked = $(e.target).prop("checked"),
					$planExpiry = self.$el.find('#planExpiry');
				$planExpiry.empty();
				var opts = _.extend({top: '-5px'}, $.fn.spin.presets.small);
				$planExpiry.spin(opts);

				$.ajax({
                    url: config.serverBaseUrl + "/recurringbilling",
                    type: "POST",
                    data: JSON.stringify({"recurringBilling": isChecked}),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    global: false
                })
                .done(function(response, textStatus, jqXHR) {

                	console.debug(response);

					self.updateRecurringBillingMessage(response.data.recurringBilling);

		        	$planExpiry.spin(false);

                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("Oops couldn't enable recurring billing. %s: %s", textStatus, errorThrown);

                    if ( jqXHR.responseJSON.data.title.indexOf('INVALID_SUBSCRIPTION_OPERATION') === 0 ) {
                    	$planExpiry.html(self.localizable.get('error_no_autorenew')); // xss safe
                    } else {
                    	// use server-side error message
                    	$planExpiry.html(sprintf("%s. [%s]", jqXHR.responseJSON.data.title, jqXHR.responseJSON.data.code)); // xss safe
                    }


    	        	$planExpiry.spin(false);
                });

            },

            editProfile: function(e) {
            	e.preventDefault();
            	e.stopPropagation();

				this.router.pageMenubarView.dismissMenuWithBodyClick = false;

    			var compiledTemplate = Handlebars.templates['dialogs/EditProfile'],
					html = compiledTemplate(this.localizable.all()),
					self = this;

    			vex.dialog.open({
    				className: 'vex-theme-plain',
    				message: self.localizable.get('editProfile_title'),
    				input: html,
    				buttons: [
	    				$.extend({}, vex.dialog.buttons.YES, {text: self.localizable.get('btn_ok')}),
	    				$.extend({}, vex.dialog.buttons.NO, {text: self.localizable.get('btn_cancel')})
    				],
    				callback: function(data) {
    					if (data) {
    						console.debug(sprintf('First: %s, Last: %s', data.firstname, data.lastname));
    						self.saveUserInfo( data.firstname, data.lastname );
    					}
    				},
					afterClose: function() {
						self.router.pageMenubarView.dismissMenuWithBodyClick = true;
					}

    			})
				.bind('vexOpen', function(e, v) {

					// populate
					v.$vex
						.find('input[name=firstname]')
						.val(self.user.get('firstname'));

					v.$vex
						.find('input[name=lastname]')
						.val(self.user.get('lastname'));

				});

            },

            saveUserInfo: function(firstname, lastname) {
            	// save to server and then update localstorage, menu
            	// this would of course be modeled well by backbone too

            	var self = this;
        		var data = JSON.stringify({
					"firstname": firstname,
					"lastname": lastname
				});
				$.ajax({
					url: config.serverBaseUrl + "/users/" + self.user.get('id'),
					type: "PUT",
					data: data,
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {

						// also updates router.user
						self.user.set(response.data.user);
						self.user.save();

						// update menu
						self.$el
							.find('#profileDisplay figcaption b')
							.text(self.user.get('fullname'));

					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						console.error("%s: %s", textStatus, errorThrown);
					});

            },

			editionDetails: function(){

				var ipnCode = this.user.get('ipnProductCode'),
					// defaults - compute values below
					editionDetails = {
						name: '',
						message: '',
						className: '',
						buttonText: '',
						showUpgrade: true,
						// trialRemaining: false,
						planExpiry: false
					},
					product = EditionManager.product(ipnCode);

				editionDetails.name = product.name;
				if(ipnCode == config.skuFree){
					editionDetails.message = this.localizable.get('upgradeTrialMessage');
					editionDetails.buttonText = this.localizable.get('btnBuy');
					editionDetails.className = 'skuStudent';
					// editionDetails.trialRemaining = this.trialRemainingMeassage();

				} else if(ipnCode == config.skuStudent){
					editionDetails.name = product.name;
					editionDetails.message = this.localizable.get('upgradeMessage');
					editionDetails.buttonText = this.localizable.get('btnUpgrade');
					editionDetails.className = 'skuFree';
				} else if(ipnCode == config.skuBusiness || ipnCode == config.skuBusinessMonthly){
					editionDetails.message = this.localizable.get('upgradeMessage');
					editionDetails.buttonText = this.localizable.get('btnUpgrade');
					editionDetails.className = 'skuBusiness';
				} else if(ipnCode == config.skuUnlimited || ipnCode == config.skuUnlimitedMonthly
						|| ipnCode == config.skuCoach || ipnCode == config.skuCoachMonthly
						|| ipnCode == config.skuAssociation || ipnCode == config.skuAssociationMonthly
					){
					// NB. has no button
					// editionDetails.message = quotes['quote' + _.random(1,50)];
					editionDetails.message = '';
					editionDetails.className = 'skuUnlimited';
					editionDetails.showUpgrade = false;
				}

				return editionDetails;

			},

			changePassword: function(e) {

				e.preventDefault();

				this.router.pageMenubarView.dismissMenuWithBodyClick = false;

				var compiledTemplate = Handlebars.templates['dialogs/ChangePassword'],
					html = compiledTemplate(this.localizable.all()),
					self = this;

				vex
					.dialog.open({
						className: 'vex-theme-plain',
						message: self.localizable.get('changePassword_title'),
						input: html,
						buttons: [{
							  text: self.localizable.get('changePassword_submit'),
							  type: 'button',
							  className: 'vex-dialog-button-primary',
							  click: function($vexContent, event) {

								  var $inputs = $vexContent.find('#changePasswordDialog input'),
									  $oldPass = $inputs.filter('#oldPassword'),
									  $newPass = $inputs.filter('#newPassword');

								  $.ajax({
									  url: config.serverBaseUrl + "/changePassword",
									  type: "POST",
									  dataType: 'json',
									  data: JSON.stringify({
										  "email": self.user.get('email'),
										  "oldPassword": $oldPass.val(),
										  "newPassword": $newPass.val()
									  }),
									  contentType: "application/json; charset=utf-8"
								  })
									  .done(function(response, textStatus, jqXHR) {

										  console.log(response);

										  self.updateChangePassVex($vexContent, null);

									  })
									  .fail(function(response, textStatus, errorThrown) {

										var messageKey = $.stratweb.firstError(response.responseJSON, 'unknownError').key;
										self.updateChangePassVex($vexContent, self.localizable.get(messageKey));

									  });
							  }
						  },
						  {
							  text: self.localizable.get('btn_cancel'),
							  type: 'button',
							  className: 'vex-dialog-button-secondary',
							  click: function($vexContent, event) {
								  return vex.close($vexContent.data().vex.id);
							  }
						  }],
						callback: function(submit) {
							if (submit) {

							}
						},
						afterClose: function() {
							self.router.pageMenubarView.dismissMenuWithBodyClick = true;
						}
					})
					.bind('vexOpen', function(e, v) {

						console.debug("ChangePassword dialog ready!");

						var $submit = v.$vex.find('.vex-dialog-button-primary'),
							$inputs = v.$vex.find('#changePasswordDialog input'),
							$oldPass = $inputs.filter('#oldPassword'),
							$newPass = $inputs.filter('#newPassword'),
							$confirmPass = $inputs.filter('#confirmNewPassword');

						self.validateChangePass($submit, $oldPass, $newPass, $confirmPass);

						v.$vex
							.on('keyup', 'input', function(){
								self.validateChangePass($submit, $oldPass, $newPass, $confirmPass);
							})
                            .on('keyup ', '#newPassword, #confirmNewPassword', function(){
                                self.passwordStrength($(this), v.$vex);
                            });

					});

			},

            passwordStrength: function($input, vex){

                var $newPass = vex.find('#newPassword'),
                    $confirmNewPass = vex.find('#confirmNewPassword');

                if($newPass.val() != '' && $confirmNewPass.val() != '' && $newPass.val() != $confirmNewPass.val()){

                    this.updateValidation($input, this.localizable.get('signup_password_mismatch'), 'pass-error', vex);

                    return false;
                }

                // Must have capital letter, numbers and lowercase letters or sufficient length (ie passphrase)

                var strongRegex1 = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
                var strongRegex2 = new RegExp("(?=.{14,}).*", "g");

                // Must have either capitals and lowercase letters or lowercase and numbers

                var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

                // Must be at least 6 characters long

                var okRegex = new RegExp("(?=.{6,}).*", "g");

                if (okRegex.test($input.val()) === false) {

                    // If okRegex doesn't match the password

                    this.updateValidation($input, this.localizable.get('signup_password_min'), 'pass-error', vex);

                } else if (strongRegex1.test($input.val()) || strongRegex2.test($input.val())) {

                    // If reg ex matches strong password

                    this.updateValidation($input, this.localizable.get('signup_password_good'), 'pass-success', vex);

                } else if (mediumRegex.test($input.val())) {

                    // If medium password matches the reg ex

                    this.updateValidation($input, this.localizable.get('signup_password_medium'), '', vex);

                } else {

                    // If password is ok

                    this.updateValidation($input, this.localizable.get('signup_password_weak'), 'pass-warn', vex);

                }

                return true;

            },

            updateValidation: function(input, message, type, vex){

                var classes = sprintf('passValidate %s', type);

                vex.find('#validatePasswordMessage')
                    .removeClass()
                    .addClass(classes)
                    .html(message); // xss safe

                vex.find('.validatePasswordWrap')
                    .removeClass()
                    .addClass(classes);

            },

			updateChangePassVex: function(modal, message){

				var self = this,
					$target;

				if(message){

					$target = modal.find('#changePasswordError');

					$target
						.fadeIn();
					modal
						.find('#changePasswordErrorMessage')
						.empty()
						.append(message);

					setTimeout(function(){
						$target.fadeOut()
					},4000);
				} else {

					$target = modal.find('#changePasswordSuccess');

					modal
						.find('.vex-dialog-buttons')
						.hide();

					$target
						.fadeIn();


					setTimeout(function(){
						vex.closeAll();
						self.router.pageMenubarView.closeMenu(self.$el);
					},2000);

				}

			},

			validateChangePass: function(button, oldPass, newPass, confirmPass) {

				var oldVal = oldPass.val(),
					newVal = newPass.val(),
					confirmVal = confirmPass.val();

				if(oldVal.length && newVal.length && confirmVal.length && (newVal === confirmVal)){
					button
						.prop('disabled', false);
				} else {
					button
						.prop('disabled', true);
				}

			}

        });

        return view;
    });