define(['Config', 'BaseAdminView', 'backbone', 'bootgrid', 'bootstrap'],

function(config, BaseAdminView) {
	var view = BaseAdminView.extend({

		initialize: function() {
			_.bindAll(this, 'markAsPaid');

			var self = this;

			 $.ajax({
                url: config.serverBaseUrl + "/admin/connectReferrals",
                type: "GET",
				contentType: "application/json; charset=utf-8",
				global: false
            })
                .done(function(response, textStatus, jqXHR) {

                	var referrals = response.data.connectReferralOuts;

                	var source   = $("#connectReferralsTemplate").html();
					var template = Handlebars.compile(source);
					var context = {};
					var $tbl   = $(template(context));

					var $tbody = $tbl.find('tbody');
					for (var i = 0; i < referrals.length; i++) {
						var referral = referrals[i];
						var $tr = $('<tr>');
						$tr.append($('<td>').text(referral.id));
						$tr.append($('<td>').text(referral.key));
						$tr.append($('<td>').text(referral.referrerLastname + ', ' + referral.referrerFirstname) );
						$tr.append($('<td>').text(referral.referrerEmail));
						$tr.append($('<td>').text(referral.creationDate));
						$tr.append($('<td>').text(referral.modificationDate));
						$tr.append($('<td>').text(referral.email));
						$tr.append($('<td>').text(referral.dateOfSignup));
						$tr.append($('<td>').text(referral.paid));
						$tbody.append($tr);
					};

                	$('section').html($tbl);

                	$tbl.bootgrid({
            			caseSensitive: false,
            			selection: true,
            			// rowSelect: true,
            			multiSelect: true,
            			templates: {
            				// add our own button to the existing header template
					        header: '<div id="{{ctx.id}}" class="{{css.header}}"><div class="row"><div class="col-sm-12 actionBar">	<div class="payment btn-group"><button class="btn btn-default" type="button">Mark as Paid</button></div><p class="{{css.search}}"></p><p class="{{css.actions}}"></p></div></div></div>'       
					    },            			
                		converters: {
					        datetime: {
					            from: function (value) { 
					            	return value ? moment.utc(value*1) : null; 
					            },
					            to: function (value) { 
					            	return value ? value.local().format(self.dateFormat) : ''; 
					            }
					        },
					        bool: {
					            from: function (value) { 
					            	return value === 'true' ? true : false; 
					            },
					            to: function (value) { 
					            	return value ? 'Yes' : '';
					            }					        	
					        }
					    },
					    formatters: {
					    	"link": function(column, row)
                            {
                            	var $a = $('<a>').text(row.referrerName).attr('href', '#').attr('data-referrer-email', row.referrer).addClass('showReferrer');
                            	return $('<div>').append($a).html();
                            }
					    }

                	})
					.on("loaded.rs.jquery.bootgrid", function (e) {
						$tbl.find('#login').on('click', self.login);
						$('#results tbody a.showReferrer').tooltipster({
						    content: 'Loading...',
	    			        maxWidth: 800,
	    			        interactive: true,
						    functionBefore: function(origin, continueTooltip) {

						        // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
						        continueTooltip();
						        
						        // next, we want to check if our data has already been cached
						        if (origin.data('ajax') !== 'cached') {

									$.ajax({
										url: config.serverBaseUrl + "/users/email/" + origin.data('referrer-email'),
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
										console.error(msg);
										self.showError(jqXHR.status, msg);
									});

						        }
						    }
						});
				    });

					$('.bootgrid-header .actionBar .payment button').on('click', self.markAsPaid);

                })
                .fail(function(jqXHR, textStatus, errorThrown) {
					var msg = sprintf("Oops, couldn't load referrals. Status: %s %s", jqXHR.status, jqXHR.statusText);
					console.error(msg);
					self.showError(jqXHR.status, msg);
                });



		}, 

		markAsPaid: function(e) {
			var $tbl = $('section table#results');
			var data = {"referralKeys": $tbl.bootgrid('getSelectedRows')};
			$.ajax({
                url: config.serverBaseUrl + "/admin/connectReferrals?batch=true",
                type: "PUT",
                data: JSON.stringify(data),
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                	$tbl.bootgrid("deselect");

					var rows = $tbl.bootgrid("getCurrentRows");

					// update the paid row manually
                	for (var i = 0; i < data.referralKeys.length; i++) {
                		var key = data.referralKeys[i];
                		var row = _.findWhere(rows, {'key': key});
                		row.paid = true;
                	};

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

