define(['Config', 'Dictionary', 'BasePageView', 'UserServiceProvider', 
    'MyAccountBasePageView', 'BusinessLocation', 'BusinessLocationCollection', 'FormDialog'],

function(config, Dictionary, BasePageView, UserServiceProvider, 
    MyAccountBasePageView, BusinessLocation, BusinessLocationCollection, FormDialog) {

    var view = MyAccountBasePageView.extend({

        el: '#location',

        template: 'community/myAccount/LocationView',

        initialize: function(router) {            
            MyAccountBasePageView.prototype.initialize.call(this, router);
            _.bindAll(this, 'serviceProviderLoaded', 'showPaymentDialog', 'showTermsDialog');
        },  

        renderPage: function() {
            MyAccountBasePageView.prototype.renderPage.call(this);

            var self = this;

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

            this.$el.find('#location').selectize({
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
                selectOnTab: true,
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

            // return commits changes
            this.$el.find('#address1, #zipPostal').keydown($.stratweb.returnField);

            // show payment button
            this.$el.find('#payment').on(self.router.clicktype, this.showPaymentDialog);

            // disable button until service provider is loaded, or if we already know we are paid
            var $btn = this.$el.find('button#payment');
            $btn.prop('disabled', true);

            if (this.user.get('hasPaidConnect')) {
                $btn.text(this.localizable.get('btnThanksPayment'));
            }

            // terms dialog
            this.$el.find('.formPanel .termsWrapper label a').on(router.clicktype, this.showTermsDialog);

            // add city
            this.suggestCityDialog = new FormDialog(this.router, 'community/SuggestCityDialog', {});
            this.$el.find('#suggestCity').on(this.router.clicktype, function(e) {
                self.suggestCityDialog.showFormDialog(e, self.suggestCityDialog.doSuggestCity);
            });


        },

        load: function() {
            MyAccountBasePageView.prototype.load.call(this);

        },

        // @override - save all fields each time to negate some of the effect of chrome's autofill disaster
        save: function() {
            // NB Server will sync the default bizloc (used in search) with the serviceprovider

            console.debug("save: " + this.serviceProvider.cid);
            var data = {};

            data['address1'] = this.$el.find('#address1').val();
            data['zipPostal'] = this.$el.find('#zipPostal').val();
            var     $target = this.$el.find('#location'),
                    $location = $target.selectize(),
                    cityId = $target.val(),
                    $option = $($location[0].selectize.getOption(cityId));
            data['city'] = $option.data('city');
            data['provinceState'] = $option.data('region');
            data['country'] = $option.data('country');
            data['termsAccepted'] = this.$el.find('#termsAccepted').prop('checked');

            this.serviceProvider.set(data);

            console.debug(this.serviceProvider.toJSON());

            this.updateProgressBar();

            this.serviceProvider.save(null, {
                success: function(response) {
                    console.info("saved serviceProvider: " + this.serviceProvider.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save serviceProvider. Status: %s %s", xhr.status, xhr.statusText) );
                    this.router.showSaveMessage(this.localizable.get('changesNotSaved'), true);
                }.bind(this)
            });

        },

        serviceProviderLoaded: function() {
            MyAccountBasePageView.prototype.serviceProviderLoaded.call(this);
            
            var self = this,
                model = this.serviceProvider;

            // populate text fields and areas
            self.$el.find('#address1, #zipPostal').each(function() {
                var $this = $(this),
                    propertyName = $this.attr('id');
                if (model.has(propertyName)) {
                    $this.val(model.get(propertyName).toString());
                } 
                else {
                    $this.val('');
                }                       
            });

            // populate location
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

            // populate terms
            var $termsAccepted = this.$el.find('#termsAccepted');
            if (this.serviceProvider.has('termsAccepted')) {
                $termsAccepted.prop('checked', this.serviceProvider.get('termsAccepted'));
            } else {
                $termsAccepted.prop('checked', false);
            }            

        },

        showTermsDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;

            var template = Handlebars.templates['community/tooltips/Terms'],
                context = self.localizable.all(),
                content = template(context);

            vex.dialog.confirm({
                className: 'vex-theme-plain',
                contentClassName: 'termsDialog',
                message: content,
                buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('btn_agree') }),
                          $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                                        
                callback: function(value) {
                    if (value) {

                        // can click the agreement
                        self.$el.find('#termsAccepted').prop('checked', true);
                        self.save();

                    };
                }
            })
            .bind('vexOpen', function() {
                $(this).find('#print').on(router.clicktype, function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // quick and dirty print
                    var $printDoc = $('<html>');
                    var $head = $('<head>'),
                        $body = $('<body>');
                    $head.append('<style>html, body { font-family: Helvetica, Arial, "Lucida Grande", sans-serif; }</style>');
                    $head.append('<title>StratPad Connect</title>');
                    $body.append(content);
                    $printDoc.append($head).append($body);

                    var myWindow=window.open();
                    myWindow.document.write('<html>' + $printDoc.html() + '</html>');
                    myWindow.document.close();

                    myWindow.focus();
                    myWindow.print(); 
                });
            });

        },

        showPaymentDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            // gather up the fields and save again because Chrome doesn't fire change events on autofill (of the non-focused field)
            this.save(e);
            
            var message = this.localizable.get('paymentDialogTitle'),
                compiledTemplate = Handlebars.templates['community/myAccount/PaymentDialog'],
                context = _.extend({}, this.localizable.all()),
                html = compiledTemplate(context),
                self = this;

            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: html,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('payNow') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    onSubmit: function(e) {
                        // submit the payment

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#paymentFields').spin();

                        $vexContent.find('.response').text(self.localizable.get('msgPleaseWait'));

                        $vexContent.find('.vex-dialog-buttons input').prop('disabled', true);

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});
                        data.paymentType = config.connectTestPayments ? 'TEST' : 'CC';

                        $.ajax({
                            url: config.serverBaseUrl + "/orderConnect",
                            type: "POST",
                            data: JSON.stringify(data),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8"
                        })

                            .done(function(response, textStatus, jqXHR) {
                                console.debug("signed up: " + JSON.stringify(response));

                                $vexContent.find('#paymentFields').spin(false);

                                // update buttons
                                $vexContent.find('.vex-dialog-buttons input').prop('disabled', false);
                                $vexContent.find('.vex-dialog-buttons .vex-dialog-button-primary').hide();
                                $vexContent.find('.vex-dialog-buttons .vex-dialog-button-secondary').val(self.localizable.get('btn_done'));

                                // show message
                                $vexContent.find('.response').text(self.localizable.get('msgThanksPayment'));

                                // update underlying form
                                var $btn = self.$el.find('button#payment')
                                $btn.text(self.localizable.get('btnThanksPayment'));
                                $btn.prop('disabled', true);

                                // update user - server synced prop (inferred)
                                self.user.set('hasPaidConnect', true);
                                self.user.save();

                                // update progress bar
                                self.updateProgressBar();

                            })

                            .fail(function(jqXHR, textStatus, errorThrown) {

                                // would need to change to a validation error on server
                                var error = $.stratweb.firstError(jqXHR.responseJSON, 'payment.unknownError');
                                var messageKey = error.key;                     

                                // ie if we are unaware of the provided error key
                                if (messageKey == 'payment.unknownError') {
                                    // use server-provided message
                                    if (error.message) {
                                        message = sprintf(self.localizable.get('paymentError'), error.message);
                                    } else {
                                        message = self.localizable.get('payment.unknownError')
                                    }
                                } else {
                                    // wrap message
                                   message = sprintf(self.localizable.get('paymentError'), self.localizable.get(messageKey));
                                }

                                console.error(message);

                                $vexContent.find('.response').text(message);
                                $vexContent.find('.vex-dialog-buttons input').prop('disabled', false);

                                $vexContent.find('#paymentFields').spin(false);
                            });

                    }                    
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    
                    // populate name
                    $dialog.find('#holderName').val($.stratweb.fullname(self.user.get('firstname'), self.user.get('lastname')));
                    $dialog.find('#firstName').val(self.user.get('firstname'));
                    $dialog.find('#lastName').val(self.user.get('lastname'));
                    $dialog.find('#email').val(self.user.get('email'));

                    // integers only
                    $dialog.find('#cardNumber, #expirationMonth, #expirationYear, #ccid').keydown($.stratweb.unsignedIntegerField);

                    // dropdown
                    $('#cardType').selectize({
                        hideSelected: false,
                        create: false,
                        maxItems: 1,
                    });

                    $dialog.find("#firstName, #lastName").blur(function(e) {
                        $dialog.find('#holderName').val($.stratweb.fullname($dialog.find('#firstName').val(), $dialog.find('#lastName').val()));
                    });

                    $dialog.find('#expirationMonth').blur(function(e) {
                        var $this = $(this),
                            val = $this.val()*1;
                        if (val > 12) {
                            $this.val(12);
                        } else if (val < 10 && val > 0) {
                            $this.val("0" + val);
                        }
                    });

                    $dialog.find('#expirationYear').blur(function(e) {
                        var $this = $(this), 
                            val = $this.val();
                        if (val < 100 && val > 0) {
                            $this.val('20' + $this.val());
                        };
                    });

                });

        }     

    });

    return view;
});