define(['Config', 'BaseAdminView', 'backbone', 'bootgrid', 'bootstrap'],

function(config, BaseAdminView) {

	var view = BaseAdminView.extend({

        adminUrl: 'https://cloud.stratpad.com/regions-admin.php',

		initialize: function() {
			_.bindAll(this, 'updateSQL', 'viewAllRegions');
			var self = this;

        	var source   = $("#locationsTemplate").html();
			var template = Handlebars.compile(source);
			var context = {};
			var $html   = $(template(context));

            $html.find('#viewAllRegions').on('click', this.viewAllRegions);

        	$('section').html($html);

        	self.insertStatement = "insert into Cities (CountryID, RegionID, City, Latitude, Longitude, TimeZone) VALUES (%s, %s, '%s', 0, 0, '00:00');";
			self.countryId = 0;
			self.regionId = 0;
			self.cityName = 'CityName';

        	var renderCity = function(item, escape) {
                var $item = $('<div>');
                if (item.region) {
                    $item.text(sprintf("%s, %s, %s", item.city, item.region, item.country));
                    $item.attr('data-region', item.region);
                } else if (item.country) {
                    $item.text(sprintf("%s, %s", item.city, item.country));
                } else {
                	$item.text(item.city);
                }
                $item.attr('data-city', item.city);
                $item.attr('data-country', item.country);
                return $('<div>').append($item.clone()).html();
            };


        	$('#city').selectize({
                valueField: 'cityId',
                labelField: 'city',
                searchField: 'city',
                sortField   : [{
                            field: 'country',
                            direction: 'asc'
                        }, {
                            field: 'city',
                            direction: 'asc'
                        }, {
                            field: '$score',
                            direction: 'asc'
                        }],
                options: [],
                create: true,
                maxItems: 1,
                persist: false,
                render: {
                    // the dropdown options
                    option: renderCity,

                    // the selected item
                    item: renderCity,

                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    $.ajax({
                        url: self.adminUrl,
                        type: 'GET',
                        data: {
                            q: query
                        },
                        error: function(response) {
                            callback();
                        },
                        success: function(response) {
                            // could possible arrange your country at the head of the options here
                            callback(response.data.locations);
                        }
                    });
                },
                onItemAdd: function(value, $item) {
                	var isNumber = value*1 > 0;
                	if (!isNumber) {
	                	self.cityName = value;
	                	self.updateSQL();                		
                	};
                }

            });

            var renderRegion = function(item, escape) {
                var $item = $('<div>');
                $item.text(sprintf("%s, %s", item.region, item.country));
                return $('<div>').append($item.clone()).html();
            };

        	$('#region').selectize({
                valueField: 'regionId',
                labelField: 'region',
                searchField: 'region',
                options: [],
                create: false,
                maxItems: 1,
                persist: false,
                render: {
                    // the dropdown options
                    option: renderRegion

                },                
                load: function(query, callback) {
                    if (!query.length) return callback();
                    $.ajax({
                        url: self.adminUrl,
                        type: 'GET',
                        data: {
                            region: query
                        },
                        error: function(response) {
                            callback();
                        },
                        success: function(response) {
                            callback(response.data.locations);
                        }
                    });
                },
                onChange: function(value) {
                	self.regionId = value;
					self.updateSQL();                }
            });

        	$('#country')
	        	.selectize({
	                valueField: 'countryId',
	                labelField: 'country',
	                searchField: 'country',
	                options: [],
	                create: false,
	                maxItems: 1,
	                persist: false,
	                load: function(query, callback) {
	                    if (!query.length) return callback();
	                    $.ajax({
	                        url: self.adminUrl,
	                        type: 'GET',
	                        data: {
	                            country: query
	                        },
	                        error: function(response) {
	                            callback();
	                        },
	                        success: function(response) {
	                            // could possible arrange your country at the head of the options here
	                            callback(response.data.locations);
	                        }
	                    });
	                },
	                onChange: function(value) {
	                	self.countryId = value;
	                	self.updateSQL();
	                }

	            });

        },

        updateSQL: function() {
        	var insert = sprintf(this.insertStatement, this.countryId, this.regionId, this.cityName);
	        $('#location #insert textarea').val(insert);
        },

        viewAllRegions: function(e) {
            e.stopPropagation();
            e.preventDefault();

            // grab the country
            if (this.countryId) {
                
                $.ajax({
                    url: this.adminUrl,
                    type: "GET",
                    data: {'countryId': this.countryId},
                    dataType: 'json',
                    global: false // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
                })
                .done(function(response, textStatus, jqXHR) {

                    var control = $('#country').selectize()[0].selectize;
                    var countryName = control.getItem(control.getValue()).text();
                    
                    // show them
                    $html = $('<ul>');
                    _.each(response.data.locations, function(region) {
                        $html.append($('<li>').text(region.region));
                    });

                    vex.dialog.open({
                      className: 'vex-theme-default',
                      message: 'Regions for country: ' + countryName,
                      input: $html
                    });

                }.bind(this))
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("couldn't fetch regions");
                });              
            } else {
                vex.dialog.open({
                  className: 'vex-theme-default',
                  message: 'Choose a country first!',
                  buttons: [$.extend({}, vex.dialog.buttons.YES, {text: 'OK'})]
                });
            }
        }

	});
	return view;
});

