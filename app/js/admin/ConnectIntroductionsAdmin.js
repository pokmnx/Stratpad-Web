define(['Config', 'BaseAdminView', 'backbone', 'bootgrid', 'bootstrap'],

function(config, BaseAdminView) {
	var view = BaseAdminView.extend({

		initialize: function() {
			_.bindAll(this, 'markAsPaid');

			var self = this;

            var source   = $("#connectIntroductionsTemplate").html();
			var template = Handlebars.compile(source);
			var context = {};
			var $tbl   = $(template(context));

        	$('section').html($tbl);

			$tbl.bootgrid({
			    ajax: true,
			    ajaxSettings: {
			        global: false,
			    },
				labels: {
			        noResults: 'No results found. Maybe you need to <a id="login" href="#">login!</a>'
			    },				    
			    url: config.serverBaseUrl + "/admin/introductions",
			    rowCount: [10, 25, 50],
			    requestHandler: function(request) {
			    	// can customize request here if needed
			    	return request;
			    },
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
			    	"user": function(column, row)
                    {
                    	var $a = $('<a>').text(row.userEmail).attr('href', '#').attr('data-owner-id', row.userId).addClass('showUser');
                    	return $('<div>').append($a).html();
                    },
			    	"serviceProvider": function(column, row)
                    {
                    	var $a = $('<a>')
                    		.text(row.serviceProviderName)
                    		.attr('href', '#').attr('data-service-provider-id', row.serviceProviderId)
                    		.addClass('showServiceProvider');
                    	return $('<div>').append($a).html();
                    },
                    "stratFile": function(column, row)
                    {
                    	var $a = $('<a>').text(row.stratFileName).attr('href', '#').attr('data-stratfile-id', row.stratFileId).addClass('showStratFile');
                    	return $('<div>').append($a).html();
                    },
					"commands": function(column, row)
			        {
			        	var $btnPaid = $('<button>')
			        		.addClass('btn btn-xs btn-default command command-paid')
			        		.attr('type', 'button')
			        		.data('row-id', row.id)
			        		.attr('title', 'Set as paid')
			        		.append($('<span>').addClass('icon-ui-user'));
		
						return $('<span>')
							.append($btnPaid)
							.html();

			        },
			        "bool": function(column, row)
			        {
			        	var prop = column.id;
			        	return row[prop] ? 'Yes' : '';
			        }

			    }

			})
			.on("loaded.rs.jquery.bootgrid", function (e) {
				$tbl.find('#login').on('click', self.login);
				$tbl.find('.command-paid').on('click', self.markAsPaid);
				$tbl.find('a.showUser').tooltipster({
				    content: 'Loading...',
			        maxWidth: 800,
			        interactive: true,
				    functionBefore: function(origin, continueTooltip) {

				        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
				        continueTooltip();
				        
				        // next, we want to check if our data has already been cached
				        if (origin.data('ajax') !== 'cached') {

							$.ajax({
								url: config.serverBaseUrl + "/users/" + origin.data('owner-id'),
						        type: "GET",
								contentType: "application/json; charset=utf-8",
								global: false
							})
							.done(function(response, textStatus, jqXHR) {

									var user 	 = response.data.user;
				                	var source   = $("#userSummaryTooltipTemplate").html();
									var template = Handlebars.compile(source);
									var context  = $.extend(user, {lastLogin: moment.utc(user.lastLoginDate).local().format(self.dateFormat)});
									var $html    = $(template(context));

				                    // update our tooltip content with our returned data and cache it
				                    origin.tooltipster('content', $html).data('ajax', 'cached');										
							})
							.fail(function(jqXHR, textStatus, errorThrown) {
								var msg = sprintf("Oops, couldn't load user. Status: %s %s", jqXHR.status, jqXHR.statusText);
								self.showError(jqXHR.status, msg);
								console.error(msg);
							});

				        }
				    }
				});
				$tbl.find('a.showServiceProvider').tooltipster({
				    content: 'Loading...',
			        maxWidth: 800,
			        interactive: true,
			        autoClose: true,
			        functionAfter: function($origin, continueTooltip) {
			        	$origin.tooltipster('content', 'Loading...');										
			        },
				    functionBefore: function($origin, continueTooltip) {

				        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
				        continueTooltip();

				        // no caching
				        
						$.ajax({
							// todo: move to an admin version which has community trackings, etc
							url: config.serverBaseUrl + "/serviceProviders/" + $origin.data('service-provider-id'),
					        type: "GET",
							contentType: "application/json; charset=utf-8",
							global: false
						})
						.done(function(response, textStatus, jqXHR) {

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
								$html.find('.certifications a.edit').hide();

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
				$tbl.find('a.showStratFile').tooltipster({
				    content: 'Loading...',
			        maxWidth: 800,
			        interactive: true,
			        autoClose: true,
			        functionAfter: function($origin, continueTooltip) {
			        	$origin.tooltipster('content', 'Loading...');										
			        },
				    functionBefore: function($origin, continueTooltip) {

				        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
				        continueTooltip();

				        // no caching
				        
						$.ajax({
							url: config.serverBaseUrl + "/admin/stratfiles/" + $origin.data('stratfile-id'),
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
							var msg = sprintf("Oops, couldn't load stratFile. Status: %s %s", jqXHR.status, jqXHR.statusText)
							console.error(msg);
							self.showError(jqXHR.status, msg);
						});

				    }
				});

		    });

		}, 

		markAsPaid: function(e) {
			var self = this;
			var $tbl = $('section table#results');
			// we support batch update server-side, but just going to use single update
			var id = $(e.target).closest('tr').data('row-id');
			var data = {"communityTrackingIds": [id]};
			$.ajax({
                url: config.serverBaseUrl + "/admin/introductions?batch=true",
                type: "PUT",
                data: JSON.stringify(data),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                	$tbl.bootgrid("reload");

                })
                .fail(function(jqXHR, textStatus, errorThrown) {
					var msg = sprintf("Oops, couldn't mark as paid. Status: %s %s", jqXHR.status, jqXHR.statusText);
					console.error(msg);
					self.showError(jqXHR.status, msg);
                });	
		}


	});
	return view;
});

