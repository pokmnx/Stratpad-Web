define(['i18n!nls/PageLandingView.i18n', 'Dictionary', 'Config', 'jscd', 'EditionManager', 'PageStructure'], 
	function(localizable, Dictionary, config, jscd, EditionManager, pageStructure) {
		
		var LandingView = Class.extend({

			initialize: function(router) {
				_.bindAll(this, 
					"showLogin", "showForgot", "showSignup", 'showSignupForProduct', 'showSignupForConnect', 'showSignupForServiceProviders',
					"signup", "forgot", "login", 
					"reveal", "showMessage", "toggleGeneratedPassword",
					"showLoginForTimeout", "showLoginForVerified", "showLoginForEmail", "showLoginForForgot", "showConstructionMessage", 'showCheckEmailMessage', 'showLoginForAcceptingInvite', 'showLoginForIpadUsers',
					'notFound', 'showVerify', 'handleHelper', 'passwordStrength', 'updatePasswordValidation', 'resendSignupEmail', 'showLoginForResendSignupEmail', 'showSignupVideo', 'validateEmail', 'addUserPreference');

				this.localizable = new Dictionary(localizable);

	            // all of our #...Content divs are initially display:none
	            // we then show the appropriate one based on the route given

				this.router = router;
				this.router.route('*notFound', "page", this.notFound);
				this.router.route("", "page", this.showLogin);
				this.router.route("home", "page", this.showLogin);
				this.router.route("signup", "page", this.showSignup);
				this.router.route("signup/:productId", "page", this.showSignupForProduct);
				this.router.route("signup/:productId/", "page", this.showSignupForProduct); // WordPress convention is to end URL's with slashes
				this.router.route("signup/:productId/:email", "page", this.showSignupForProduct); // WordPress convention is to end URL's with slashes
				this.router.route("signup/connect", "page", this.showSignupForConnect);
				this.router.route("signup/connect/:serviceProviderId", "page", this.showSignupForServiceProviders);
				this.router.route("forgot", "page", this.showForgot);
				this.router.route("resendSignupEmail", "page", this.resendSignupEmail);
				this.router.route("checkEmail/:email", "page", this.showCheckEmailMessage); // post signup completion page
				this.router.route("verify", "page", this.showVerify);

				// nb latter wins with eg. login/forgot and login/:email, so avoid
				this.router.route("login", "page", this.showLogin);
				this.router.route("login/timeout", "page", this.showLoginForTimeout);
				this.router.route("login/forgot", "page", this.showLoginForForgot);
				this.router.route("login/resendSignupEmail", "page", this.showLoginForResendSignupEmail);
				this.router.route("login/email/:email", "page", this.showLoginForEmail);
				this.router.route("login/verified/:email", "page", this.showLoginForVerified);
				this.router.route("login/ipad/:email", "page", this.showLoginForIpadUsers);
				this.router.route("login/invite/:token", "page", this.showLoginForAcceptingInvite);

				this.signupContent = $("#signUpContent");

	            this.signinMessageArea = $('#signInContent .message');
	            this.signupMessageArea = this.signupContent.find('.message');
				this.forgotMessageArea = $('#forgotPasswordContent .message');

				this.helpers = $('.hasHelper');
				this.forgotLink = $('.forgotLink');
				this.signUpPassword = $('#signUpPassword');
				this.confirmPassword = $('#confirmPassword');
				this.passwordMessage = $('#passwordMessage');
				this.passValidate = $('.passValidate');
				this.loginMenu = $('#loginMenu');

				this.clicktype = 'click';
				if('ontouchstart' in document.documentElement && ($('html').is('.mobile') || $('html').is('.ios')))
					this.clicktype = "touchstart";

				var self = this;

				// there's a curious problem here where if you enter the URL manually and press return, it will trigger these handlers when using keyup
				this.loginForm = $("#signInContent form");
	            this.loginForm
					.on('keydown', function (e){
						if(e.keyCode == 13)
							self.login();
					})
					.on(self.clicktype, "#submitSignIn", self.login);

				this.forgotForm = $("#forgotPasswordContent form");
				this.forgotForm
					.on('keydown', function (e){
						if(e.keyCode == 13)
							self.forgot(e);
					})
					.on(self.clicktype, "#submitReset", self.forgot);

	            this.signupForm = this.signupContent.find('form');
	            this.signupForm
					.on('keydown', function (e){
						if(e.keyCode == 13)
							self.signup(e);
					})
					.on(self.clicktype, "#submitSignUp", self.signup)
		            .on(self.clicktype, '#togglePasswordGen', this.toggleGeneratedPassword)
					.on('keyup', '#signUpPassword, #confirmPassword', this.passwordStrength)
					.on('keyup', '#signUpEmail', this.validateEmail);

				this.signupContent
					.on(self.clicktype, "#submitSignUp2", function(e){e.preventDefault();$("html, body").animate({ scrollTop: 0 }, 1000);})
					.on(self.clicktype, "#showSignupVideo", self.showSignupVideo);

				this.helpers
					.on("focus blur", self.handleHelper);

				// email support
				this.loginMenu.on(self.clicktype, '#navSupport', function(e) {
					e.preventDefault();
					e.stopPropagation();
					var decode = function(encoded) {
						var ele = document.createElement('div');
						ele.innerHTML = encoded;
						var s = ele.textContent;
						ele.textContent = '';
						return s;
					}
					document.location.href = sprintf("%s%s:%s@%s", decode('&#x6D;&#x61;&#x69;&#x6C;'), decode('&#x74;&#x6F;'), decode('&#x73;&#x75;&#x70;&#x70;&#x6F;&#x72;&#x74;'), decode('&#115;&#116;&#114;&#97;&#116;&#112;&#97;&#100;&#46;&#99;&#111;&#109;'));
				});

				// default signupType - StratPad or Connect - informs server of which verify email to use
				this.signupType = 'StratPad';

				// hide getting to business
				$('#initialLoader').hide();

	            if (!Modernizr.cookies) {
	            	console.warn('no cookies');
	            	setTimeout(function() {
						this.showMessage(this.localizable.get('COOKIES_REQUIRED'), 'error');
					}.bind(this), 3000);
	            }

	            // should we show SSO button?
	            if (config.qbo) {	            	
		            // ipp - http://jstratpad.appspot.com/openid?auth=0
		            $('ipp\\:login, ipp\\:login a').attr('href', config.serverBaseUrl + '/openid?auth=0');
	            }
	            else {
					$('.qbo-or').hide();
					$('ipp\\:login').hide();	            	
	            }

			},

			notFound: function() {
				$('#notFoundContent .message').show();
				this.reveal( $('#notFoundContent') );
			},

			showSignupVideo: function(e){
				e.preventDefault();

				var videoMarkup = '<iframe height="415" frameborder="0" width="715" src="//player.vimeo.com/video/75816791"></iframe>';

				vex.dialog.open({
					className: 'vex-theme-plain welcomeVideo',
					message: '',
					input: videoMarkup,
					buttons:[$.extend({}, vex.dialog.buttons.YES, {text: 'OK Thanks!'})]
				});
			},

			resendSignupEmail: function() {
				// can be sent from either the forgotPassword page or the signin page, when we get a user/email not verified message
				var self = this,
					$loader = $('#fullLoader'),
					email = {"email": $('#forgotEmail').val() || $('#signInEmail').val()};

				$("html, body").animate({ scrollTop: 0 }, 0);

				// hide the message areas (but not whichever container is holding them)
				self.forgotMessageArea.hide();
				self.signinMessageArea.hide();

				$loader
					.show()
					.spin();

				$.ajax({
					url: config.serverBaseUrl + "/sendEmailSignUp",
					type: "POST",
					data: JSON.stringify(email),
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {

						// back to the login page with a message
						self.router.navigate('login/resendSignupEmail', {
							trigger: true,
							replace: false
						});

					})
					.fail(function(jqXHR, textStatus, errorThrown) {

						var messageKey = $.stratweb.firstError(jqXHR.responseJSON, 'resendSignupEmail.unknownError').key;
						var message = self.localizable.get(messageKey);

						var $messageArea = ($('#forgotPasswordContent').is(':visible')) ? self.forgotMessageArea : self.signinMessageArea;
						$messageArea
							.html(message) // xss safe
							.removeClass()
							.addClass('error message')
							.show();													

					})
					.always(function() {
						$loader
							.spin(false)
							.fadeOut(150);
					});

			},

			signup: function(e) {
	            console.debug("signing up");

	            e.preventDefault();
	            e.stopPropagation();

                var self = this,
					$loader = $('#fullLoader'),
					productId = $('#productId').val(),
					$btn = $('#submitSignUp');

				$btn.prop('disabled', true);

				$loader
					.show()
					.spin();

				$("html, body").animate({ scrollTop: 0 }, 0);

				// demographics; remember this is just the signup info (rather useless, really)
				var data = {
					"email": $('#signUpEmail').val(),
					"firstname": $('#signUpFirstName').val(),
					"lastname": $('#signUpLastName').val(),
					"password": $('#signUpPassword').val(),
					"passwordConfirmation": $('#confirmPassword').val(),
					"browser": jscd.browser,
					"browserVersion": jscd.browserVersion,
					"os": jscd.os,
					"osVersion": jscd.osVersion,
					"viewPortDimension": sprintf('%sx%s', $(window).width(), $(window).height()),
					"screenDimension": sprintf('%sx%s', window.screen.width, window.screen.height)
				};
				if (this.serviceProviderId) {
					data.serviceProviderId = this.serviceProviderId;
				};

				// any accumulated userPrefs from signup process
				data.userPreferences = this.userPreferences;

				// StratPad or Connect -oriented user?
				data.signupType = this.signupType;

				$.ajax({
					url: config.serverBaseUrl + "/signUp",
					type: "POST",
					data: JSON.stringify(data),
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})

					.done(function(response, textStatus, jqXHR) {
						console.debug("signed up: " + response.data.user.firstname);

						if(productId.length && productId !== 'trial'){

							// pass through to cart, if this is a signup coming from somewhere else with a productId already attached
							var productUrl = config.cartUrl.replace('PRODUCT_ID', productId);
							window.location.href = sprintf('%s&CUSTOMERID=%s&fname=%s&lname=%s&email=%s', productUrl, response.data.user.id, response.data.user.firstname, response.data.user.lastname, response.data.user.email);

						} else {
							// go to login with a message, updating the history
							self.router.navigate('checkEmail/' + response.data.user.email, {
								trigger: true,
								replace: false
							});
						}
					})

					.fail(function(jqXHR, textStatus, errorThrown) {

						// todo: some ui for multiple validation errors
						var error = $.stratweb.firstError(jqXHR.responseJSON, 'signup.unknownError');
						var messageKey = error.key;						
						var message = self.localizable.get(messageKey);

						if (messageKey == 'REQUIRED_FIELD') {
							message = sprintf(message, error.fieldName);
						}
						else if (messageKey == 'INVALID_FIELD' && error.fieldName == 'email') {
							message = sprintf(self.localizable.get('INVALID_EMAIL'), error.fieldName);
							$('#signUpEmail').focus();
						}

						message += " [" + jqXHR.status + "]";

						self.showMessage(message, 'error', true);

						$btn.prop('disabled', false);
						$loader.spin(false).fadeOut(150);
					});



				return false;
			},

			toggleGeneratedPassword: function(e){

				e.preventDefault();
				e.stopPropagation();

				var $this = $(e.currentTarget),
					$message = $this.next(),
					$generatedPassword = $message.find('#generatedPassword');

				$generatedPassword.text('\xa0');

				if ($message.is(':hidden')) {
					$this.find('b').spin('small');
				}

				$message
					.slideToggle(200, function() {
		
						if ($message.is(':visible')) {

							// go grab a password
							$.ajax({
								url: config.serverBaseUrl + "/generatePassword",
								type: "GET",
								dataType: 'json',
								contentType: "application/json; charset=utf-8"
							})
								.done(function(response, textStatus, jqXHR) {

									$generatedPassword.text(response.password);

									// populate password, but not confirm									
									$('#signUpPassword').val(response.password);
									$('#confirmPassword').val('');

								})
								.fail(function(jqXHR, textStatus, errorThrown) {
									console.error(sprintf("%s: %s", textStatus, errorThrown));
								})
								.always(function() {
									$this.find('b').spin(false);
								});

						}
						
					});


			},

			validateEmail: function (event) {
				var $input = $(event.currentTarget);
				var email = $input.val();

				// silly to do any blocking, because we can't know for sure all email addresses, but we can warn if it doesn't look like an email address
			    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			    var isValid = re.test(email);

			    var message = this.localizable.get(isValid ? "signup_email_good" : "signup_email_bad");
			    var type = isValid ? 'email-success' : 'email-warn';
				var classes = sprintf('clear helpWrapper emailValidate %s', type);

			    var $message = $('#emailMessage');
				$message.html(message); // xss safe

				$input
					.closest('.helpWrapper')
					.removeClass()
					.addClass(classes)					
					.addClass('active');

			},

			passwordStrength: function(data){

				var $this = $(data.currentTarget);

				if($this.is('#signUpPassword'))
					this.passwordMessage.insertAfter(this.signUpPassword);
				else
					this.passwordMessage.insertAfter(this.confirmPassword);

				if(this.signUpPassword.val() != '' && this.confirmPassword.val() != '' && this.signUpPassword.val() != this.confirmPassword.val()){

					this.updatePasswordValidation($this, this.localizable.get('signup_password_mismatch'), 'pass-error');

					return false;
				}

				// Must have capital letter, numbers and lowercase letters or sufficient length (ie passphrase)

				var strongRegex1 = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
				var strongRegex2 = new RegExp("(?=.{14,}).*", "g");

				// Must have either capitals and lowercase letters or lowercase and numbers

				var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

				// Must be at least 6 characters long

				var okRegex = new RegExp("(?=.{6,}).*", "g");

				if (okRegex.test($this.val()) === false) {

					// If okRegex doesn't match the password

					this.updatePasswordValidation($this, this.localizable.get('signup_password_min'), 'pass-error');

				} else if (strongRegex1.test($this.val()) || strongRegex2.test($this.val())) {

					// If reg ex matches strong password

					this.updatePasswordValidation($this, this.localizable.get('signup_password_good'), 'pass-success');

				} else if (mediumRegex.test($this.val())) {

					// If medium password matches the reg ex

					this.updatePasswordValidation($this, this.localizable.get('signup_password_medium'), '');

				} else {

					// If password is ok

					this.updatePasswordValidation($this, this.localizable.get('signup_password_weak'), 'pass-warn');

				}

				return true;

			},

			updatePasswordValidation: function(input, message, type){

				var classes = sprintf('helpWrapper passValidate %s', type);

				this.passwordMessage
					.html(message); // xss safe

				this.passValidate
					.removeClass()
					.addClass(classes);

				input
					.closest('.helpWrapper')
					.addClass('active');

			},

			login: function(data) {

	            console.debug("logging in");

                var $loader = $('#fullLoader');
                $loader.show().spin();

				$("html, body").animate({ scrollTop: 0 }, 0);

                var credentials;
                if (data && data.email && data.password) {
                	credentials = {"email": data.email, "password": data.password};
                } else {
                	credentials = {"email": $('#signInEmail').val().toLowerCase(), "password": $('#signInPassword').val()};
                }

                // we don't want the old timer getting rid of our new message
                clearTimeout(this.messageTimer);

	            $.ajax({
	                url: config.serverBaseUrl + "/logIn" + ($('#rememberMe').is(':checked') ? '?rememberMe=true' : ''),
	                type: "POST",
	                data: JSON.stringify(credentials),
	                dataType: 'json',
					contentType: "application/json; charset=utf-8",
					global: false // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
				})
				.done(function(response, textStatus, jqXHR) {
					response.data.user.fullname = $.stratweb.fullname(response.data.user.firstname, response.data.user.lastname);
					console.debug("Welcome: " + response.data.user.fullname);
					response.data.user.loginTime = new Date().getTime();
					$.localStorage.setItem('user', JSON.stringify(response.data.user));

					// look to see if we need to forward on for accepting a token (for receiving a share)
					var token = $.localStorage.getItem('acceptToken');
					if (token) {
						$.localStorage.removeItem('acceptToken');
						window.location = "stratweb.html#invite/" + token;
					}
					else {
						// see if we should nav to a different page
						var firstPage = _.findWhere(response.data.userPreferences, {'key': 'general.firstPage'});
						if (firstPage) {
							var parts = firstPage.value.split(','); // expect eg. 3,4,5
							var loc = sprintf('stratweb.html#nav/%s/%s/%s', parts[0]*1, parts[1]*1, parts[2]*1);
							window.location = loc;
						} else {
							window.location = "stratweb.html#nav/0/0/0";
						}
					}
				}.bind(this))
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.warn("problems logging in");

					var error = $.stratweb.firstError(jqXHR.responseJSON, 'login.unknownError');
					var messageKey = error.key;
					
					var message = this.localizable.get(messageKey);
					if (messageKey == 'USER_NOT_VERIFIED' || messageKey == 'LICENSE_EXPIRED') {
						// keep it showing
						this.showMessage(message, 'error', false);
						$('#signInPassword').val('');
					}
					else if (messageKey == 'LICENSE_PAST_DUE') {
						// keep it showing
						// https://secure.avangate.com/order/checkout.php?LICENSE=B0DA05C845&QTY=1&PRODS=4615224
						// cartUrl: 'https://store.stratpad.com/order/checkout.php?PRODS=PRODUCT_ID&QTY=1&CART=1&CARD=2&DOTEST=1&CURRENCY=USD&LANG=en',

						var userData = jqXHR.responseJSON.data.user;
						$.localStorage.setItem('user', JSON.stringify(userData));
						var url = config.cartUrl.replace('PRODUCT_ID', EditionManager.avangateId());
						url = sprintf('%s&LICENSE=%s&fname=%s&lname=%s&email=%s', url, userData.licenseCode, userData.firstname, userData.lastname, userData.email);
						this.showMessage(sprintf(message, url), 'error', false);
						$('#signInPassword').val('');
					}
					else if (messageKey == 'INVALID_CREDENTIALS') {
						this.showMessage(message, 'error', true);
						$('#signInPassword').val('');
					}					
					else if(messageKey == 'FREE_TRIAL_EXPIRED'){
						// redirect to stratpad.com and prompt to upgrade. pass user data.
						var userData = jqXHR.responseJSON.data.user;
						window.location = sprintf('%sprice-editions/?NOSIGNUP=%s&CUSTOMERID=%s&fname=%s&lname=%s&email=%s', config.siteUrl, '1', userData.id, userData.firstname, userData.lastname, userData.email);
					}
					else if (messageKey == 'REQUIRED_FIELD') {
						this.showMessage(sprintf(message, error.fieldName), 'error', true);
					}
					else if (message == messageKey) {
						// there are a bunch of error codes for which we don't have localizations - so use the default english localization
						this.showMessage(error.message, 'error', true);
					} 
					else {
						// use the localized message from server
						this.showMessage(message, 'error', true);
					}

					$loader.spin(false).fadeOut(150);
				}.bind(this));

	            return false;
	        },

			forgot: function(e) {

				e.preventDefault();

				console.debug("resetting password");

				var self = this,
					$loader = $('#fullLoader'),
					formValues = {"email": $('#forgotEmail').val()};

				$("html, body").animate({ scrollTop: 0 }, 0);

				self.forgotMessageArea
					.hide();

				$loader
					.show()
					.spin();

				$.ajax({
					url: config.serverBaseUrl + "/forgotPassword",
					type: "POST",
					data: JSON.stringify(formValues),
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {

						$loader
							.spin(false)
							.fadeOut(150);

						// back to login page with a message
						self.router.navigate('login/forgot', {
							trigger: true, // also run the handler for this route
							replace: false // ie add a new item to the history
						});

					}.bind(this))
					.fail(function(jqXHR, textStatus, errorThrown) {

						$loader
							.spin(false)
							.fadeOut(150);

						var error = $.stratweb.firstError(jqXHR.responseJSON, 'resetPassword.unknownError');

						var message = this.localizable.get(error.key);

						self.forgotMessageArea
							.html(message)
							.removeClass()
							.addClass('error message')
							.show();							

					}.bind(this));

				return false;
			},

	        showMessage: function(t, type, timeout) {
	        	var $messageArea,
					$body = $('body');
	        	if ($("#signInContent").is(":visible")) {
	        		$messageArea = this.signinMessageArea;
	        	} else if($("#forgotPasswordContent").is(":visible")){
					$messageArea = this.forgotMessageArea;
				} else {
					$body.addClass('signupError');
	        		$messageArea = this.signupMessageArea;
	        	}
	            $messageArea.removeClass().addClass(type + ' message').html(t);
	            $messageArea.show();
				if (timeout) {
					clearTimeout(this.messageTimer);
					this.messageTimer = setTimeout(function() {
						$messageArea.fadeOut();
						$body.removeClass('signupError');

					}, typeof timeout == 'number' ? timeout : 8000);
				}
	            
	        },

			handleHelper: function(data){

				if(data.type == 'focus'){
					$(data.currentTarget)
						.closest('.helpWrapper')
						.addClass('active');
				} else {
					setTimeout(function(){
						$(data.currentTarget)
							.closest('.helpWrapper')
							.removeClass('active');
					}, 200);
				}
			},

			reveal: function( $target ){
				var $loader = $('#fullLoader'),
					$navLi = this.loginMenu.find('.homeNav');

				$loader.show().spin();

				if($target.length){
					// hide all other content divs
					$('#landingPage > div:visible').fadeOut(150);

					// show forgot for login
					if($target.is('#signInContent'))
						this.forgotLink.show();

					$target.fadeIn(400, function() {
						// hide the buttons for signup/login, in the top right corner
						$navLi.hide();

						// show the apropriate button for the content (specified by data-nav attribute) eg. #navLogin, #navSignup, #navVerify
						// default if not specified is support
						$($target.data('nav') || '#navSupport').show();
						$loader.spin(false).fadeOut(150);
					});
				} else {
					// default when $target is not found - should never happen
					console.warn("Couldn't find $target: " + ($target ? $target.selector : $target));
					this.showLogin();
				}

			},

			// can route logins to this method if you want to disable login
			showConstructionMessage: function() {
				this.reveal( $('#constructionContent') );
			},

			// this will disable login after signup
			showCheckEmailMessage: function(email) {
				var $content = $('#checkEmailContent');
				this.reveal( $content );
				$content.find('#checkEmail').text(sprintf("« %s »", email));
				$content.find('.message').show();
				if (config.analytics) {
					ga('send', 'event', 'SalesFunnel', 'CompleteOrder', 'Free', 0);			
				}				
			},
			
			showLogin: function() {
				// if we're already logged in, forward them on to the app
				var user = $.localStorage.getItem('user');
				if (user) {
					// if they aren't really logged in, we'll get a redirect back to login anyway, but this should be the desired action 99% of the time
					window.location = "stratweb.html#nav/0/0/0";	
				} else {
					// make sure message is hidden
					this.signinMessageArea.hide();
					this.signupMessageArea.hide();
					this.reveal( $('#signInContent') );
					$('html').addClass('signinbg');
				}

			},

			showForgot: function() {
				this.forgotMessageArea.hide();
				this.reveal( $('#forgotPasswordContent') );
				$('#forgotEmail').val($('#signInEmail').val());
			},

			showLoginForForgot: function() {
				this.reveal( $('#signInContent') );
				this.showMessage(this.localizable.get('PASSWORD_RESET_SUCCESS'), 'success', false);
				$('#signInEmail').val($('#forgotEmail').val());
				$('#signInPassword').val('');
			},

			// after resending verification, show this login and message
			showLoginForResendSignupEmail: function() {
				this.reveal( $('#signInContent') );
				this.showMessage(this.localizable.get('RESEND_SIGNUP_EMAIL_SUCCESS'), 'success', false);
			},

			showLoginForAcceptingInvite: function(token) {
				var self = this,
					$loader = $('#fullLoader');

				$loader.show().spin();

				// check with server to see if logged in
				$.ajax({
					url: config.serverBaseUrl + "/users/current",
					type: "GET",
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {
						response.data.user.fullname = $.stratweb.fullname(response.data.user.firstname, response.data.user.lastname);
						console.debug("Welcome: " + response.data.user.fullname);
						response.data.user.loginTime = new Date().getTime();
						$.localStorage.setItem('user', JSON.stringify(response.data.user));

						window.location = "stratweb.html#invite/" + token;

					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						// we'll need to show the login form, but also forward on the token for accept
						$.localStorage.setItem('acceptToken', token);
						self.showLogin();
					})
					.always(function() {
						$loader.spin(false);
					});

			},

			showLoginForTimeout: function() {
				this.reveal( $('#signInContent') );
				this.showMessage(this.localizable.get('SESSION_TIMEOUT'), 'info', false);
			},   

			showLoginForVerified: function(email) {				
				this.reveal( $('#signInContent') );
				this.showMessage(this.localizable.get('VERIFICATION_SUCCESS'), 'success', false);
				$('#signInEmail').val(email);
			},   

			showLoginForEmail: function(email) {				
				this.reveal( $('#signInContent') );
				$('#signInEmail').val(email);
			},   

			showLoginForIpadUsers: function(email) {				
				this.reveal( $('#signInContent') );
				this.showMessage(this.localizable.get('IPAD_FREE_TRIAL'), 'success', false);
				$('#signInEmail').val(email);
			},   

			showSignup: function() {
				// we have two signups - one for if you are coming straight to this page, and thus signing up for the trial (ie StratPad Free),
				// and one for if you were sent with a product id from a referring page
				// we show different content depending on the signup (stuff is displayed or not in scss)
				$('#submitSignUp').text(this.localizable.get('SIGNUP_BUTTON_TRIAL'));
				this.signupContent.removeClass().addClass('isTrialSignUp');
				this.reveal( $('#signUpContent') );

				if (config.analytics) {
					ga('send', 'event', 'SalesFunnel', 'ViewSignup', 'Free', 0);
				}

			},

			showSignupForConnect: function() {
				// here we've let users refer other users into Connect for a price
				// it's still the free/trial version of stratpad

				// there's a lot of different content, in 4 main sections:
				// the header area above the form but below the navbar
				// the aside box
				// the signup button
				// the background, faq and awards? leave this alone

				$('#submitSignUp').text(this.localizable.get('SIGNUP_BUTTON_CONNECT'));

				// display .connectContent
				this.signupContent.removeClass().addClass('isConnectSignup');

				this.reveal( $('#signUpContent') );

				// goto Connect on first login
				this.addUserPreference("general.firstPage", sprintf('%s,%s,%s', pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0));
				this.signupType = 'Connect';

				if (config.analytics) {
					ga('send', 'event', 'SalesFunnel', 'ViewSignup', 'Connect', 0);
				}

			},

			showSignupForServiceProviders: function(serviceProviderId) {
				// here we've given a link to a user which includes a service provider id
				// it's still the free/trial version of stratpad
				// we will link the resultant user with the service provider

				this.serviceProviderId = serviceProviderId;

				$('#submitSignUp').text(this.localizable.get('SIGNUP_BUTTON_CONNECT'));

				// display .serviceProviderContent
				this.signupContent.removeClass().addClass('isServiceProviderSignup');

				this.reveal( $('#signUpContent') );

				// goto Connect on first login
				this.addUserPreference("general.firstPage", sprintf('%s,%s,%s', pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0));
				this.addUserPreference("community.showTenMinuteWarning", true);
				this.signupType = 'Connect';

				if (config.analytics) {
					ga('send', 'event', 'SalesFunnel', 'ViewSignup', 'ServiceProvider', 0);
				}

			},


			showSignupForProduct: function(productid, email) {

				var signupEventLabel;
				if (productid == config.prodIdStartup) {
					$('#signUpVersion').append(this.localizable.get('SIGNUP_HEADER_STARTUP'));
					signupEventLabel = 'Startup';
				} else if (productid == config.prodIdBusiness) {
					$('#signUpVersion').append(this.localizable.get('SIGNUP_HEADER_BUSINESS'));
					signupEventLabel = 'Business';
				} else if (productid == config.prodIdUnlimited) {
					$('#signUpVersion').append(this.localizable.get('SIGNUP_HEADER_UNLIMITED'));
					signupEventLabel = 'Unlimited';
				}

				// todo: 'trial' is really free, which is now akin to student/startup; student/startup is deprecated
				if(productid == 'trial' || productid == 'free') { 
					this.signupContent.removeClass().addClass('isTrialSignUp');
					$('#submitSignUp').text(this.localizable.get('SIGNUP_BUTTON_TRIAL'));
					signupEventLabel = 'Free';
				} else {
					this.signupContent.removeClass().addClass('isProductPurchase');
					$('#submitSignUp').text(this.localizable.get('SIGNUP_BUTTON_CHECKOUT'));
				}

				// sometimes we provide an email
				$('#signUpEmail').val(email);

				this.reveal( $('#signUpContent') );
				$('#productId').val(productid);

				$('#signUpFirstName').focus();

				if (config.analytics) {
					ga('send', 'event', 'SalesFunnel', 'ViewSignup', signupEventLabel, 0);
				}		

			},

			showVerify: function() {
				// verify didn't succeed 
				// problems could be unregistered email, wrong token, or missing either of those fields (though you have to assemble your own link nefariously to get these errors)
				// if already verified, just send to success
				// solution: sign up again, send registration email again
				$('#verifyContent .message').show();
				this.reveal( $('#verifyContent') );
			},

			// userprefs are submitted on signup
			addUserPreference: function(key, val) {
				if (!this.userPreferences) {
					this.userPreferences = {};
				}
				this.userPreferences[key] = val;
			}
		    
		});
		
		return LandingView;
		
	}
);