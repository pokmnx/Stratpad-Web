define(['Config', 'BaseAdminView', 'backbone', 'bootgrid', 'bootstrap'],

function(config, BaseAdminView) {

	var view = BaseAdminView.extend({

		initialize: function() {
			_.bindAll(this, "showServiceProvider", "showStratFile");

			var self = this;

        	var source   = $("#usersTemplate").html();
			var template = Handlebars.compile(source);
			var context = {};
			var $tbl   = $(template(context));

        	$('section').html($tbl);

			$tbl.bootgrid({
			    ajax: true,
			    ajaxSettings: {
			        global: false,
			    },
				searchSettings: {
			        delay: 250,
			        characters: 3
			    },		    
				labels: {
			        noResults: 'No results found. Maybe you need to <a id="login" href="#">login!</a>'
			    },
			    url: config.serverBaseUrl + "/admin/users",
			    rowCount: [10, 25, 50],
        		converters: {
			        datetime: {
			        	// converts string to desired type
			            from: function (value) { 
			            	return value ? moment.utc(value*1) : null; 
			            },
			            // converts type to display string
			            to: function (value) { 
			            	return value ? moment.utc(value*1).local().format(self.dateFormat) : ''; 
			            }
			        }
			    },
			    formatters: {
			    	"ipnProductCode": function(column, row)
                    {
                    	return row.ipnProductCode.replace("com.stratpad.cloud.", '');
                    },
                    'escape': function(column, row) {
                    	return _.escape(row[column.id]);
                    },
                    'email': function(column, row) {
                    	return sprintf('<a href="mailto:%s">%s</a>', row['email'], row['email']);
                    },
					"commands": function(column, row)
			        {
			        	var $btnUser = $('<button>')
			        		.addClass('btn btn-xs btn-default command command-user-detail')
			        		.attr('type', 'button')
			        		.attr('data-user-id', row.id)
			        		.attr('title', 'User Details')
			        		.append($('<span>').addClass('icon-ui-user'));

			        	var $btnStratFiles = $('<button>')
			        		.addClass('btn btn-xs btn-default command command-stratfiles')
			        		.attr('type', 'button')
			        		.attr('data-user-id', row.id)
			        		.attr('title', 'User StratFiles')
			        		.append($('<span>').addClass('icon-ui-stack'));
		

						return $('<span>')
							.append($btnUser)
							.append(' ')
							.append($btnStratFiles)
							.html();
			        }                    
			    }

			})
			.on("loaded.rs.jquery.bootgrid", function (e) {
				$tbl.find('#login').on('click', self.login);
				$tbl.find('button.command-user-detail').tooltipster({
				    content: 'Loading...',
			        maxWidth: 800,
			        minWidth: 400,
			        interactive: true,
			        functionAfter: function($origin, continueTooltip) {
			        	// so we don't see the switched content
			        	$origin.tooltipster('content', 'Loading...');										
			        },			        
				    functionBefore: function(origin, continueTooltip) {

				        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
				        continueTooltip();
				        
						$.ajax({
							url: config.serverBaseUrl + "/users/" + origin.data('user-id'),
					        type: "GET",
							contentType: "application/json; charset=utf-8",
							global: false
						})
						.done(function(response, textStatus, jqXHR) {

								var user 	 = response.data.user;
			                	var source   = $("#userDetailTooltipTemplate").html();
								var template = Handlebars.compile(source);
								var context  = $.extend(user, {
									lastLogin: moment.utc(user.lastLoginDate).local().format(self.dateFormat),
									created: moment.utc(user.creationDate).local().format(self.dateFormat),
									modified: moment.utc(user.modificationDate).local().format(self.dateFormat),
									subscribed: moment.utc(user.sunscriptionStartDate).local().format(self.dateFormat)
								});
								var $html    = $(template(context));

								// show service provider
								$html.find('a#showServiceProvider')
									.data({'user-id': user.id})
									.on('click', function(e) {
										e.preventDefault();
										e.stopPropagation();
										self.showServiceProvider(origin, $(this).data('user-id'));
									});

			                    // update our tooltip content with our returned data
			                    origin.tooltipster('content', $html);									
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							var msg = sprintf("Oops, couldn't load user. Status: %s %s", jqXHR.status, jqXHR.statusText);
							self.showError(jqXHR.status, msg);
							console.error(msg);
						});

				    }
				});
				$tbl.find('button.command-stratfiles').tooltipster({
				    content: 'Loading...',
			        maxWidth: 800,
			        minWidth: 400,
			        interactive: true,
			        autoClose: true,
			        functionAfter: function($origin, continueTooltip) {
			        	// so we don't see the switched content
			        	$origin.tooltipster('content', 'Loading...');										
			        },			        
				    functionBefore: function(origin, continueTooltip) {

				        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
				        continueTooltip();
				        
				        // next, we want to check if our data has already been cached
						$.ajax({
							url: config.serverBaseUrl + "/users/" + origin.data('user-id') + '/stratfiles',
					        type: "GET",
							contentType: "application/json; charset=utf-8",
							global: false
						})
						.done(function(response, textStatus, jqXHR) {

								var stratFiles 	 = response.data.stratFiles;
			                	var source   = $("#stratFilesTooltipTemplate").html();
								var template = Handlebars.compile(source);
								var context  = {};
								var $html    = $(template(context));

								for (var i = 0; i < stratFiles.length; i++) {
									var stratFile = stratFiles[i];
									var $anchor = $('<a>')
										.attr('href', '')
										.text(stratFile.name)
										.data('stratfile-id', stratFile.id)										
										.on('click', function(e) {
											e.preventDefault();
											e.stopPropagation();
											self.showStratFile(origin, $(e.target).data('stratfile-id'));
										});
									$('<li>')
										.append($anchor)
										.appendTo($html.find('ul'));
								};

			                    // update our tooltip content with our returned data
			                    origin.tooltipster('content', $html);										
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							var msg = sprintf("Oops, couldn't load user. Status: %s %s", jqXHR.status, jqXHR.statusText);
							self.showError(jqXHR.status, msg);
							console.error(msg);
						});

				    }
				});

		    });
		},

		showServiceProvider: function($origin, userId) {

			var self = this;

			// switch content
			$origin.tooltipster('content', 'Loading...');

			// get serviceProvider for this user
			$.ajax({
				url: config.serverBaseUrl + "/admin/users/" + userId + "/serviceProviders",
		        type: "GET",
				contentType: "application/json; charset=utf-8",
				global: false
			})
			.done(function(response, textStatus, jqXHR) {

					if (jqXHR.status == 204) {
						// no content
						$origin.tooltipster('content', 'This user has not become a service provider (ie. did not sign up for StratPad Connect).');
					} 
					else {
						var serviceProvider 	 = response.data.serviceProvider;
	                	var source   = $("#serviceProviderTooltipTemplate").html();
						var template = Handlebars.compile(source);
						var context  = $.extend(serviceProvider, {
							location:  sprintf('%s, %s', serviceProvider.city, serviceProvider.provinceState ? serviceProvider.provinceState : serviceProvider.country),
							created: moment.utc(serviceProvider.creationDate).local().format(self.dateFormat),
							modified: moment.utc(serviceProvider.modificationDate).local().format(self.dateFormat),
							accreditationLogoUrls: _.map(serviceProvider.accreditationLogos, function(filename) {
								return sprintf('%s/financial-institutions/%s/%s', config.gcsBaseUrl, serviceProvider.docsFolderName, filename);
							}),
						});
						var $html    = $(template(context));
						$html.find('.certifications a.edit')
							.data({'serviceProvider': serviceProvider})
							.on('click', function(e) {
								e.preventDefault();
								e.stopPropagation();
								self.showCertificationsEditor($origin, $(this).data('serviceProvider'));
							});

	                    // update our tooltip content with our returned data
	                    $origin.tooltipster('content', $html);										
					}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				var msg = sprintf("Oops, couldn't load serviceProvider. Status: %s %s", jqXHR.status, jqXHR.statusText)
				console.error(msg);
				self.showError(jqXHR.status, msg);
			});
		},

		showStratFile: function($origin, stratFileId) {
			var self = this;

			// switch content
			$origin.tooltipster('content', 'Loading...');

			// get stratfile
			$.ajax({
				url: config.serverBaseUrl + "/admin/stratfiles/" + stratFileId,
		        type: "GET",
				contentType: "application/json; charset=utf-8",
				global: false
			})
			.done(function(response, textStatus, jqXHR) {

				var stratFile 	 = response.data.stratFile;
            	var source   = $("#stratFileTooltipTemplate").html();
				var template = Handlebars.compile(source);
				var context  = $.extend(stratFile, {
					location:  sprintf('%s, %s', stratFile.city, stratFile.provinceState ? stratFile.provinceState : stratFile.country),
					created: moment.utc(stratFile.creationDate).local().format(self.dateFormat),
					modified: moment.utc(stratFile.modificationDate).local().format(self.dateFormat),
					accessed: moment.utc(stratFile.lastAccessDate).local().format(self.dateFormat)
				});
				var $html    = $(template(context));

				$html.find('a#exportStratFile')
					.data({'stratfile': stratFile})
					.on('click', function(e) {
						e.preventDefault();
						e.stopPropagation();
						self.exportStratFile($origin, $(this).data('stratfile'));
					});

                // update our tooltip content with our returned data
                $origin.tooltipster('content', $html);										

			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				var msg = sprintf("Oops, couldn't load serviceProvider. Status: %s %s", jqXHR.status, jqXHR.statusText)
				console.error(msg);
				self.showError(jqXHR.status, msg);
			});

		}

	});
	return view;
});

