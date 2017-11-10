define(['Config', 'backbone', 'bootgrid', 'bootstrap'],

function(config) {
	var view = Backbone.View.extend({

		dateFormat: "MMM D, YYYY, hh:mm:ss z",

		initialize: function() {
            _.bindAll(this, 'showError', 'login',  'showCertificationsEditor', 'saveCertifications', 'exportStratFile');
		},

		showError: function(status, message) {
			var self = this;
			if (status == 401) {
				vex.dialog.confirm({
		            className: 'vex-theme-default',
		            message: sprintf('%s <p class="small">%s<p>', "Had a small problem. Want to log back in?", message),
		            callback: function(value) {
		                if (value) {
		                	self.login();
		                }
		            }
				});
			}
		},

		login: function(e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			};

			vex.dialog.open({
              className: 'vex-theme-default',
			  message: 'Enter your username and password:',
			  input: '<input name="username" type="text" placeholder="Username" required />\n<input name="password" type="password" placeholder="Password" required />',
			  buttons: [
			    $.extend({}, vex.dialog.buttons.YES, {
			      text: 'Login'
			    }), $.extend({}, vex.dialog.buttons.NO, {
			      text: 'Cancel'
			    })
			  ],
			  callback: function(data) {
			    if (data === false) {
			      return console.log('Cancelled');
			    }

			    credentials = {"email": data.username, "password": data.password};
			    
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

					$('table#results').bootgrid("reload");
				}.bind(this))
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.warn("problems logging in");

					var error = $.stratweb.firstError(jqXHR.responseJSON, 'login.unknownError');

					alert("Login fail: " + error.message);

				}.bind(this));			    


			  }
			});

		},

		showCertificationsEditor: function($origin, serviceProvider) {

			// switch content to a certifications form

        	var source   = $("#serviceProviderCertificationTooltipTemplate").html();
			var template = Handlebars.compile(source);
			var context  = {};
			var $html    = $(template(context));
			var self	 = this;

			// hook up submit
			$html.find('.save button')
				.on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					self.saveCertifications($origin, $(e.target.form), serviceProvider);
				})
			$html.find('#toggleAll')
				.on('click', function(e) {
					if ($(e.target).is(':checked')) {
						$(e.target.form).find('input[value="StratPadCoachLevel3"]').prop('checked', true);
						$(e.target.form).find('input[name="certifications[]"]').prop('checked', true);
					} else {
						$(e.target.form).find('input').prop('checked', false);
					}
				});

			// populate
			if (serviceProvider.certifications) {
				for (var i = 0; i < serviceProvider.certifications.length; i++) {
					var fieldVal = serviceProvider.certifications[i];
					$html.find(sprintf("[value=%s]", fieldVal)).prop('checked', true);
				};
			};

			$origin.tooltipster('content', $html);

		},

		saveCertifications: function($origin, $form, serviceProvider) {
			console.debug('Save certifications for id: ' + serviceProvider.id);

			var coach = $form.find('[name=stratPadCoachLevel]:checked').val();

			var certs = $form.find('[name="certifications[]"]:checked');

			var certifications = [];
			if (coach) certifications.push(coach);
			for (var i = 0; i < certs.length; i++) {
				var cert = $(certs[i]).val();
				certifications.push(cert);
			};

			var data = {
				id: serviceProvider.id,
				certifications: certifications
			};

			$.ajax({
                url: config.serverBaseUrl + "/admin/serviceProviders?action=updateCertifications",
                type: "PUT",
                data: JSON.stringify(data),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                	// just close the tooltip
                	$origin.tooltipster('hide');
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
					var msg = sprintf("Oops, couldn't mark as paid. Status: %s %s", jqXHR.status, jqXHR.statusText);
					console.error(msg);
					self.showError(jqXHR.status, msg);
                });	

		},

		exportStratFile: function($origin, stratFile)	{
			var opts = {
				extension: 'stratfile', reportName: 'N/A', subcontext: 'N/A', 
				normalizedStratFileName: stratFile.name.replace(/[^A-Za-z0-9\. ]/g, "").replace(/ /g, "_")
			};
			var downloadUrl = config.serverBaseUrl + "/stratfiles/" + stratFile.id;
			opts.fileName = sprintf('%s-%s.%s', opts.normalizedStratFileName, moment().format('YYYYMMDD'), opts.extension);

			var $form = $('<form></form>').attr({'action': downloadUrl, 'method': 'GET'});
			$('<input type="hidden" name="stratfile">').val(true).appendTo($form); // same as ACCEPT: application/stratfile; note that json is the default
			$('<input type="hidden" name="filename">').val(opts.fileName).appendTo($form);
			$form.appendTo('body').submit();
			$form.remove();

		}


	});
	return view;
});

