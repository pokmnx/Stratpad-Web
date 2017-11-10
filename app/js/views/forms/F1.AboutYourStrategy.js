define(['GenericForm', 'Config', 'StratFileInfo', 'FormDialog', 'Selectize', 'ipp'],

function(GenericForm, config, StratFileInfo, FormDialog, Selectize) {

    var view = GenericForm.extend({

        initialize: function(router, localizable) {
        	GenericForm.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", 'save');      

            var self = this,
                $body = $('body'),
                $nextHelper = $('.clickNextHelper');

            // sent each time this page is loaded, and also when we dismiss the connect window
            $(document).bind("ippAuthStatus.genericForm", function(e, status) {
                var $btnIppConnect = $('ipp\\:connecttointuit');

                if (status === true) {
                    $btnIppConnect.hide();
                    $('#ippConnected').show();
                } else {
                    $btnIppConnect.show();
                    $('#ippConnected').hide();
                    intuit.ipp.anywhere.view.connectToIntuit.render($btnIppConnect);
                }
            });

            // disconnect button
            $('#ippConnected a').on(this.router.clicktype, function(e) {
                e.preventDefault();
                e.stopPropagation();

                // hide
                $('ipp\\:connecttointuit').hide();
                $('#ippConnected').hide();

                // spin
                var opts = _.extend({top: '7px', left: 0}, $.fn.spin.presets.small);
                $("#ippConnection").spin(opts);

                $.ajax({
                    url: config.serverBaseUrl + "/ipp/v3/disconnect?stratFileId=" + self.stratFile.get('id'),
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {
                        
                        $(document).trigger('ippAuthStatus', response.disconnected != true);
         
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        $("#ippConnection").spin(false);
                    });                
            });

            // sequential show of click next button if they just clicked the new stratfile button
            if($body.is('.new-strafile-created')){

                $body.removeClass('new-strafile-created');
                $nextHelper.show();

                setTimeout(function(){
                    $nextHelper.css('opacity', '1');
                }, 2000);

                setTimeout(function(){
                    $nextHelper.css('opacity', '0');
                }, 6000);

                setTimeout(function(){
                    $nextHelper.hide();
                }, 7000);
            } else {
                $nextHelper.hide();
            }

            // setup industries
            $('#industry').selectize({
                plugins: ['drag_drop', 'remove_button'],
                valueField: 'code',
                labelField: 'description',
                searchField: 'description',
                hideSelected: false,
                options: [],
                create: true,
                maxItems: 2,
                render: {
                    option: function(item, escape) {
                        return '<div>' + item.description + '</div>';
                    }
                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    $.ajax({
                        url: config.serverBaseUrl + "/industries",
                        type: 'GET',
                        data: {
                            prefix: query
                        },
                        error: function(response) {
                            callback();
                        },
                        success: function(response) {
                            callback(response.data.industries);
                        }
                    });
                }
            });

            // setup location
            // custom render to deal with city, region and country
            var render = function(item, escape) {
                var $item = $('<div>');
                if (item.region) {
                    $item.text(sprintf("%s, %s, %s", item.city, item.region, item.country));
                    $item.attr('data-region', item.region);
                } else {
                    $item.text(sprintf("%s, %s", item.city, item.country));
                }
                $item.attr('data-city', item.city);
                $item.attr('data-country', item.country);
                return $('<div>').append($item.clone()).html();
            };

            $('#location').selectize({
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
                create: false,
                maxItems: 1,
                persist: false,
                render: {
                    // the dropdown options
                    option: render,

                    // the selected item
                    item: render,

                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    $.ajax({
                        url: config.regionsUrl,
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
                }
            });

            // add city
            this.suggestCityDialog = new FormDialog(this.router, 'community/SuggestCityDialog', {});
            this.$el.find('#suggestCity').on(this.router.clicktype, function(e) {
                self.suggestCityDialog.showFormDialog(e, self.suggestCityDialog.doSuggestCity);
            });

        },

        load: function() {
        	GenericForm.prototype.load.call(this);
            
            var self = this;

            this.stratFileInfo = new StratFileInfo({stratFileId: this.stratFile.get('id')});
            this.stratFileInfo.fetch({
                success: function(model) {

                    // populate
                    self.$el.find("fieldset :input").each(function() {
                        var $this = $(this);

                        // load the value into the field
                        if (model.has(this.id)) {
                            var value = model.get(this.id);
                            if (value) {
                                $this.val(value).trigger('autosize.resize');
                            }
                        } else {
                            $this.val('');
                        }
                    });

                    var $industry = self.$el.find('#industry').selectize(),
                        codes = [];
                    if (model.has('industry')) {
                        // if we don't have a code, use the free form as its code
                        var code = model.has('industryCodeNaics') ? model.get('industryCodeNaics') : model.get('industry');
                        $industry[0].selectize.addOption({'description': model.get('industry'), 'code': code});
                        codes.push(code);
                    };

                    if (model.has('industryAlt')) {
                        // if we don't have a code, use the free form as its code
                        var code = model.has('industryCodeNaicsAlt') ? model.get('industryCodeNaicsAlt') : model.get('industryAlt');
                        $industry[0].selectize.addOption({'description': model.get('industryAlt'), 'code': code});
                        codes.push(code);                        
                    };
                    $industry[0].selectize.setValue(codes);

                    var $location = self.$el.find('#location').selectize();
                    if (model.has('city') || model.has('provinceState') || model.has('country')) {
                        var location = '';
                        if (model.has('city')) {
                            location += model.get('city');
                        };
                        if (model.has('provinceState')) {
                            location += ', ' + model.get('provinceState');
                        };
                        if (model.has('country')) {
                            location += ', ' + model.get('country');
                        };
                        $location[0].selectize.addOption({"cityId":0, "city":model.get('city'), "region":model.get('provinceState'), "country":model.get('country'), "currency":model.get('currency')});
                    }
                    $location[0].selectize.setValue(0);

                    self.applyPermissions();

                    // save on any change
                    var $els = self.$el.find('fieldset :input');
                    $els.off('change', self.save);                  
                    $els.on('change', self.save);                  

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load stratFileInfo. Status: %s %s", xhr.status, xhr.statusText) );
                }
            });            

            if (this.stratFile.isOwner() && config.qbo) {

                $('#ippConnection').closest('li').show();

                // hide to begin with
                $('ipp\\:connecttointuit').hide();
                $('#ippConnected').hide();

                // check if IPP authenticated
                var opts = _.extend({top: '7px', left: 0}, $.fn.spin.presets.small);
                $("#ippConnection").spin(opts);
                $.ajax({
                    url: config.serverBaseUrl + "/ipp/v3/isAuthenticated?stratFileId=" + this.stratFile.get('id'),
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    global: false // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
                })
                    .done(function(response, textStatus, jqXHR) {
                        
                        $(document).trigger('ippAuthStatus', response.isAuthenticated);
         
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.warn("%s: %s", textStatus, errorThrown);
                        $(document).trigger('ippAuthStatus', false);
                    })
                    .always(function() {
                        $("#ippConnection").spin(false);
                    });

            }
            else {
                $('#ippConnection').closest('li').hide();
            }

        },

        save: function(evt) {
            // the idea is that only 1 field could have changed, so update and save
            console.debug("sf save: " + this.stratFileInfo.cid);
            var $target = $(evt.currentTarget);
            var data = {};
            var fieldName = $target.attr('name');
            if (fieldName == 'industry') {
                // for backwards compatibility, we need to split this array
                // we are supplied with the codes, or the name if it is freeform
                var codes = $target.val();
                var $industry = this.$el.find('#industry').selectize();                

                // reset
                this.stratFileInfo.set({
                    industry: null,
                    industryCodeNaics: null,
                    industryAlt: null,
                    industryCodeNaicsAlt: null
                });                    

                // first code
                if (codes && codes.length >= 1) {
                    // don't bother with the code if it is not a real NAICS code
                    var code = codes[0];
                    if ($.stratweb.isNumber(code)) {
                        this.stratFileInfo.set('industryCodeNaics', code);
                    };

                    // set the industry
                    var industry = $industry[0].selectize.getOption(code).text();                
                    this.stratFileInfo.set('industry', industry);

                }

                // if there is a second code, set the alt fields
                if (codes && codes.length > 1) {
                    var altCode = codes[1];
                    if ($.stratweb.isNumber(altCode)) {
                        this.stratFileInfo.set('industryCodeNaicsAlt', altCode);
                    };

                    // set the industry
                    var industryAlt = $industry[0].selectize.getOption(altCode).text();
                    this.stratFileInfo.set('industryAlt', industryAlt);
                };

            }
            else if (fieldName == 'location') {
                var $location = $target.selectize(),
                    cityId = $target.val(),
                    $option = $($location[0].selectize.getOption(cityId));

                // todo: set the currency? if not already set

                data['city'] = $option.data('city');
                data['provinceState'] = $option.data('region');
                data['country'] = $option.data('country');
                this.stratFileInfo.set(data);

            }
            else {
                data[$target.attr('name')] = $target.val();
                this.stratFileInfo.set(data);                
            }

            // keep track so that we can update stratFileCollection
            var changed = this.stratFileInfo.changedAttributes();

            this.stratFileInfo.save(null, {
                success: function(response) {
                    console.info("saved stratFileInfo: " + this.stratFileInfo.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                    // update stratfile in collection, since these are aliases. that will also trigger the stratfile:name change when needed
                    this.router.stratFileManager.currentStratFile().set(changed);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save stratFileInfo. Status: %s %s", xhr.status, xhr.statusText) );
                    this.router.showSaveMessage(this.localizable.get('changesNotSaved'), true);
                }.bind(this)
            });

        }


    });

    return view;
});