define(['Config', 'Dictionary', 'BasePageView', 'UserServiceProvider', 'MyAccountBasePageView', 'FormDialog', 'backboneCache'],

function(config, Dictionary, BasePageView, UserServiceProvider, MyAccountBasePageView, FormDialog) {

    var view = MyAccountBasePageView.extend({

        el: '#companyInfoAndBudget',

        template: 'community/myAccount/CompanyInfoAndBudgetView',

        initialize: function(router) {            
            MyAccountBasePageView.prototype.initialize.call(this, router);
            _.bindAll(this, 'serviceProviderLoaded', 'renderPage', 'load', 'setAccreditationImages', 'deleteLogo');
        },  

        renderPage: function() {
            MyAccountBasePageView.prototype.renderPage.call(this);

            var self = this,
                $companyLogo = this.$el.find('#companyLogo'),
                $labelCompanyLogo = $companyLogo.prev(),
                $accreditationLogosInput = this.$el.find('#accreditationLogos'),
                $labelAccreditationLogos = $accreditationLogosInput.prev();

            self.$accreditationLogosContainer = this.$el.find('.accreditationLogos');

            // continue
            this.$el.find('button.continue').on(router.clicktype, function(e) {
                e.preventDefault(); e.stopPropagation();
                router.nextPage();
            });

            // decimals
            this.$el.find('#monthlyAdBudget, #priceForInvitation').keydown($.stratweb.unsignedDecimalField);

            // min bid
            this.$el.find('#priceForInvitation').on('blur', function(e) {
                var $this = $(this);
                if ($this.val() < 10) {
                    $this.val(10);
                };
            });

            // categories
            this.$el.find('#categories').selectize({
                plugins: ['drag_drop', 'remove_button'],
                create: false,
                hideSelected: false,
                maxItems: 2,
            });

            // return to save
            self.$el.find('#name, #priceForInvitation, #servicesDescription, #monthlyAdBudget').keydown($.stratweb.returnField);

            // fake div invokes the file dialog
            this.$el.find('.companyLogo').on(this.router.clicktype, function() { 
                $companyLogo.trigger('click'); 
            });

            // hook up delete and file dialog
            self.$accreditationLogosContainer
                .on(this.router.clicktype, function() { 
                    $accreditationLogosInput.trigger('click'); 
                })
                .on(this.router.clicktype, 'i', this.deleteLogo);

            $labelAccreditationLogos.find('a').on(this.router.clicktype, function(e) {
                e.preventDefault();e.stopPropagation();
                $accreditationLogosInput.trigger('click'); 
            })

            // suggest category
            this.suggestCategoryDialog = new FormDialog(this.router, 'community/SuggestCategoryDialog', {});
            this.$el.find('#suggestCategoryLink').on(this.router.clicktype, function(e) {
                self.suggestCategoryDialog.showFormDialog(e, self.suggestCategoryDialog.doSuggestCategory);
            });

            // initialize fileupload plugin
            $companyLogo.fileupload({
                // url comes on load of serviceProvider
                dataType: 'json',
                dropZone: this.$el.find('.companyLogo'),
                add: function (e, data) {
                    var goUpload = true;
                    var uploadFile = data.files[0];

                    // validation
                    if (!(/\.(gif|png|jpe?g)$/i).test(uploadFile.name)) {
                        self.router.showSaveMessage(self.localizable.get('ci_error_logo_type'), true);
                        console.warn('invalid file');
                        goUpload = false;
                    }
                    if (uploadFile.size > 500000) { 
                        self.router.showSaveMessage(self.localizable.get('ci_error_logo_size'), true);
                        console.warn('file too large');
                        goUpload = false;
                    }

                    // start upload
                    if (goUpload == true) {
                        // note this submits all inputs on the page
                        data.submit();
                        var opts = _.extend({}, $.fn.spin.presets.small);
                        $labelCompanyLogo.spin(opts);
                    }

                    // bit of a hack, to allow us to upload more than once
                    $companyLogo = $(this);
                },
                done: function(e, data) {
                    if (data.result.status == 'success') {
                        console.debug('yay: ' + data.result.data.path);
                        var url = config.gcsBaseUrl + data.result.data.path;
                        self.$el.find('.companyLogo').css({'background-image': sprintf('url(%s?%s)', url, $.stratweb.generateUUID())});
                    } else {
                        var messageKey = $.stratweb.firstError(data.result, 'import.unknownError').key;
                        var message = self.localizable.get(messageKey);

                        console.error("Problem uploading stratfile: " + message);
                        self.router.showSaveMessage(message, true);
                    }
                    $labelCompanyLogo.spin(false);
                },
                fail: function(e, data) {
                    // 500, 409 errors
                    console.error("Problem uploading file: " + data.errorThrown);
                    self.router.showSaveMessage(self.localizable.get('ci_error_logo_generic') + data.errorThrown, true);
                    $labelCompanyLogo.spin(false);
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    console.debug('progress: ' + progress);
                }
            });

            // number of files dropped or selected
            var filecount = 0,
                filecountMax = 3;

            // initialize fileupload plugin
            $accreditationLogosInput.fileupload({
                // url comes on load of serviceProvider
                dataType: 'json',
                dropZone: self.$accreditationLogosContainer,
                sequentialUploads: true, // prevents race conditions when getting the returned array; also helps with memory
                add: function (e, data) {
                    // called once for each file selected/dropped
                    // will only upload the first [filecountMax] images - others skipped with an error message
                    // serviceProvider.accreditationLogos should have the 3 current image names
                    // generally we will append images to the list if we can fifo
                    // eg drag one, then drag two -> all good
                    //    drag another one, then pop the first and push the last
                    var goUpload = true;
                    var uploadFile = data.files[0];

                    // validation
                    if (!(/\.(gif|png|jpe?g)$/i).test(uploadFile.name)) {
                        self.router.showSaveMessage(self.localizable.get('ci_error_logo_type'), true);
                        console.warn('invalid file');
                        goUpload = false;
                    }
                    if (uploadFile.size > 500000) { 
                        self.router.showSaveMessage(self.localizable.get('ci_error_logo_size'), true);
                        console.warn('file too large');
                        goUpload = false;
                    }
                    if (filecount >= filecountMax) {
                        self.router.showSaveMessage(self.localizable.get('ci_error_logo_too_many'), true);
                        console.warn('too many files: skipping ' + uploadFile);
                        goUpload = false;
                    };

                    // start upload
                    if (goUpload == true) {
                        filecount += 1;
                        data.paramName = 'logo';
                        // note this submits all inputs on the page, but they are ignored
                        data.submit();
                        var opts = _.extend({left: '450px'}, $.fn.spin.presets.small);
                        $labelAccreditationLogos.spin(opts);
                    }

                    // bit of a hack, to allow us to upload more than once
                    $accreditationLogosInput = $(this);
                },
                done: function(e, data) {
                    if (data.result.status == 'success') {
                        console.debug('yay: ' + data.result.data.accreditationLogos);
                        self.setAccreditationImages(data.result.data.accreditationLogos);
                    } else {
                        var messageKey = $.stratweb.firstError(data.result, 'import.unknownError').key;
                        var message = self.localizable.get(messageKey);

                        console.error("Problem uploading stratfile: " + message);
                        self.router.showSaveMessage(message, true);
                    }
                    filecount = 0;
                    $labelAccreditationLogos.spin(false);
                },
                fail: function(e, data) {
                    // 500, 409 errors
                    console.error("Problem uploading file: " + data.errorThrown);
                    self.router.showSaveMessage(self.localizable.get('ci_error_logo_generic') + data.errorThrown, true);
                    filecount = 0;
                    $labelAccreditationLogos.spin(false);
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    console.debug('progress: ' + progress);
                }
            });


        },

        load: function() {
            MyAccountBasePageView.prototype.load.call(this);
        },

        serviceProviderLoaded: function() {
            MyAccountBasePageView.prototype.serviceProviderLoaded.call(this);

            var self = this,
                model = this.serviceProvider;

            // update logo editing url
            self.$el.find('#companyLogo').fileupload({
                url: sprintf("%s/users/%s/serviceProviders/%s/logo", config.serverBaseUrl, self.user.get('id'), self.serviceProvider.get('id')),
            });

            self.$el.find('#accreditationLogos').fileupload({
                url: sprintf("%s/users/%s/serviceProviders/%s/accreditationLogos", config.serverBaseUrl, self.user.get('id'), self.serviceProvider.get('id')),
            });                

            // show the logo itself if possible
            var url = sprintf('%s/users/%s/serviceProviders/%s/logo', 
                config.serverBaseUrl, self.user.get('id'), self.serviceProvider.get('id'));
            self.$el.find('.companyLogo').css({'background-image': sprintf("url(%s)", url)});  

            // show accreditation logos
            self.setAccreditationImages(model.get("accreditationLogos"));

            // multiple selections in a dropdown
            if (model.has('categories')) {
                $('#categories').selectize()[0].selectize.setValue(model.get('categories'));
            } else {
                $('#categories').selectize()[0].selectize.setValue([]);    
            }

            // text fields and areas
            self.$el.find('#name, #priceForInvitation, #monthlyAdBudget, #servicesDescription, #welcomeMessage').each(function() {
                var $this = $(this),
                    propertyName = $this.attr('id');
                if (model.has(propertyName)) {
                    $this.val(model.get(propertyName).toString());
                } 
                else {
                    $this.val('');
                }                       
            });

            // the file upload is separate from the other fields, so don't issue a change in that case
            self.$el.find('#companyLogo').off('change.connect');

            // show ten minute warning
            router.userPrefs.fetch({ cache: true, expires: 5*60 });
            var showTenMinuteWarningPref = router.userPrefs.findWhere({ key: 'community.showTenMinuteWarning' });
            if (showTenMinuteWarningPref && showTenMinuteWarningPref.get('value') == 'true') {
                vex.dialog.alert({
                    className: 'vex-theme-plain',
                    message: self.localizable.get('community.showTenMinuteWarningTitle'),
                    input: sprintf(self.localizable.get('community.showTenMinuteWarning'), model.get('name')),
                    callback: function(value) {
                        showTenMinuteWarningPref.destroy({
                            success: function(model) {
                                console.debug("Destroyed userPref: " + JSON.stringify(model.toJSON()));
                            }
                        });

                        // 10 minute timer
                        router.myAccountManager.startTimer(model);
                    }
                });

            }
        },

        setAccreditationImages: function(accreditationLogos) {

            var self = this;

            // update serviceProvider silently - it will be reloaded anyway
            self.serviceProvider.set({'accreditationLogos': accreditationLogos}, 'silent');

            var imageUrls = _.map(self.serviceProvider.get('accreditationLogos'), function(filename) {
                return sprintf('%s/financial-institutions/%s/%s', config.gcsBaseUrl, self.serviceProvider.get("docsFolderName"), encodeURIComponent(filename));
            });

            if (imageUrls.length) {
                self.$accreditationLogosContainer.empty();

                // hide the cloud upload logo
                self.$accreditationLogosContainer.css('background', '#fff');

                var filenames = self.serviceProvider.get('accreditationLogos');
                _.each(filenames, function(filename) {
                    var imageUrl = sprintf('%s/financial-institutions/%s/%s', config.gcsBaseUrl, self.serviceProvider.get("docsFolderName"), encodeURIComponent(filename));
                    var $logo = $('<div>').addClass('accreditationLogo').append( $('<i>').addClass('icon-new-times') );
                    $logo.css({'background-image': sprintf('url(%s?%s)', imageUrl, $.stratweb.generateUUID())});
                    $logo.data('filename', filename);
                    self.$accreditationLogosContainer.append($logo);                    
                });
            } else {
                // show the cloud upload logo
                self.$accreditationLogosContainer.css('background', '');
            }

            console.debug('imageUrls:' + imageUrls);

        },

        deleteLogo: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this, 
                $this = $(e.target).closest('.accreditationLogo'),
                filename = $this.data('filename');

            $.ajax({
                url: sprintf("%s/users/%s/serviceProviders/%s/accreditationLogos/%s", 
                    config.serverBaseUrl, self.user.get('id'), self.serviceProvider.get('id'), encodeURIComponent(filename)),
                type: "DELETE",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                    // update serviceProvider silently - it will be reloaded anyway
                    var logos = self.serviceProvider.get('accreditationLogos');
                    var idx = logos.indexOf(filename);
                    logos.splice(idx, 1);

                    $this.remove();

                    if (logos.length == 0) {
                        // show the cloud upload logo
                        self.$accreditationLogosContainer.css('background', '');
                    };

                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error(sprintf("%s: %s", textStatus, errorThrown));
                });
            
        }  

    });

    return view;
});