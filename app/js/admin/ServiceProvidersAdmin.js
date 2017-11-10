define(['Config', 'BaseAdminView', 'backbone', 'bootgrid', 'bootstrap'],

function(config, BaseAdminView) {

	var view = BaseAdminView.extend({

		initialize: function() {

			var self = this;

        	var source   = $("#serviceProvidersTemplate").html();
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
    			templates: {
    				// add our own checkbox to the existing header template
			        header: '<div id="{{ctx.id}}" class="{{css.header}}"><div class="row"><div class="col-sm-12 actionBar"><div class="btn-group userServiceProvidersOnly"><label class="checkbox-inline"><input type="checkbox" id="userServiceProvidersOnly" name="userServiceProvidersOnly" value="true">Connect Users Only</label></div><p class="{{css.search}}"></p><p class="{{css.actions}}"></p></div></div></div>'
			    },            						    				    
			    url: config.serverBaseUrl + "/admin/serviceProviders",
			    rowCount: [10, 25, 50],
			    requestHandler: function(request) {
			    	// if we're doing a search, turn off sort and userServiceProvidersOnly
			    	// if we're doing a sort, turn off the other two
			    	// if we're doing userServiceProviders, turn off the other two!
			    	console.debug(request);
			    	var data = $tbl.data('.rs.jquery.bootgrid');
			    	console.debug('userServiceProvidersOnly:' + data.userServiceProvidersOnly);
			    	console.debug('sortDictionary:' + data.sortDictionary);
			    	console.debug('sortKeys: ' + Object.keys(data.sortDictionary));
			    	console.debug('searchPhrase:' + data.searchPhrase);

			    	request.userServiceProvidersOnly = $tbl.data('.rs.jquery.bootgrid').userServiceProvidersOnly;


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
			    	"owner": function(column, row)
                    {
                    	var $a = $('<a>').text(row.userEmail).attr('href', '#').attr('data-owner-id', row.userId).addClass('showOwner');
                    	return $('<div>').append($a).html();
                    },
			    	"serviceProvider": function(column, row)
                    {
                    	var $a = $('<a>').text(row.name).attr('href', '#').attr('data-service-provider-id', row.id).addClass('showServiceProvider');
                    	return $('<div>').append($a).html();
                    }
			    }

			})
			.on("loaded.rs.jquery.bootgrid", function (e) {
				$tbl.find('#login').on('click', self.login);
				$tbl.find('a.showOwner').tooltipster({
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
			        	// so we don't see the switched content
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
								$html.find('.certifications a.edit')
									.data({'serviceProvider': serviceProvider})
									.on('click', function(e) {
										e.preventDefault();
										e.stopPropagation();
										self.showCertificationsEditor($origin, $(this).data('serviceProvider'));
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

				// impl dependent
				var unSort = function (prop) {
					if (prop) {
						$tbl.find(sprintf('thead [data-column-id="%s"] a span.icon',prop)).removeClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
					}
				};

				// would be nice if we could update the internal sortDictionary and searchPhrase, but not sure that's possible
				var $userServiceProvidersOnly = $('#results-header').find('#userServiceProvidersOnly');
				var $searchField = $('#results-header').find('input.search-field');
				$userServiceProvidersOnly.on('change', function(e) {
						var data = $tbl.data('.rs.jquery.bootgrid'),
							sortKeys = Object.keys(data.sortDictionary),
							sortKey = sortKeys.length ? sortKeys[0] : null;

						data.userServiceProvidersOnly = $(e.target).is(':checked');
						data.sortDictionary = {};
						data.searchPhrase = '';
						$tbl.bootgrid("reload");
						$userServiceProvidersOnly.prop('checked', data.userServiceProvidersOnly);
						$searchField.val(data.searchPhrase);
						unSort(sortKey);
					});
				$searchField.on('change', function(e) {
						var data = $tbl.data('.rs.jquery.bootgrid'),
							sortKeys = Object.keys(data.sortDictionary),
							sortKey = sortKeys.length ? sortkeys[0] : null;

						data.userServiceProvidersOnly = false;
						data.sortDictionary = {};
						// reloads itself

						$userServiceProvidersOnly.prop('checked', data.userServiceProvidersOnly);
						unSort(sortKey);
					});
				$tbl.find('thead a.sortable').on('click', function(e) {
					var data = $tbl.data('.rs.jquery.bootgrid');
					data.userServiceProvidersOnly = false;
					data.searchPhrase = '';
					// reloads itself

					$userServiceProvidersOnly.prop('checked', data.userServiceProvidersOnly);
					$searchField.val(data.searchPhrase);
				});

		    });

		}


	});
	return view;
});

