define(['StratFile', 'Financial', 'BaseFinancialView', 'EmployeeDeductions'],

function(StratFile, Financial, BaseFinancialView, EmployeeDeductions) {

    var view = BaseFinancialView.extend({

        el: '#inventory',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadInventoryForCurrentStratFile", 'applyPermissions');

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this;
            self.$inventoryLeadTimeSlider = this.$el.find('#inventoryLeadTimeSlider');
            self.$percentCogsIsInventorySlider = this.$el.find('#percentCogsIsInventorySlider');

            self.$inventoryLeadTimeSlider.slider({
                min: 0,
                max: 90,
                step: 1,
                value: 0,
                disabled: true,
                slide: function( event, ui ) {
                    self.$inventoryLeadTimeSlider.prev().text(sprintf(self.localizable.get('days_format'), ui.value));
                },
                change: function ( event, ui ) {
                    self.$inventoryLeadTimeSlider.prev().text(sprintf(self.localizable.get('days_format'), ui.value));
                    self.financial.set('inventoryLeadTime', ui.value);
                }
            });

            self.$percentCogsIsInventorySlider.slider({
                min: 0,
                max: 100,
                step: 1,
                value: 10,
                disabled: true,
                slide: function( event, ui ) {
                    self.$percentCogsIsInventorySlider.prev().text(ui.value + '%');
                },
                change: function ( event, ui ) {
                    self.$percentCogsIsInventorySlider.prev().text(ui.value + '%');
                    self.financial.set('percentCogsIsInventory', ui.value);
                }
            });

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadInventoryForCurrentStratFile();   
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e) {
                console.debug("Load up new financial form data.");
                this.load();
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.loadInventoryForCurrentStratFile();
            }.bind(this));

        },

        loadInventoryForCurrentStratFile: function() {
            var stratFileId = this.stratFile ? this.stratFile.get('id') : this.router.stratFileManager.stratFileId
                self = this;
            this.financial = new Financial({
                stratFileId: stratFileId
            });
            this.financial.fetch({
                success: function(financial) {
                    console.debug('Financial fetched: ' + financial.get('id'));

                    // we need deductions because percent COGS are related
                    self.employeeDeductions = new EmployeeDeductions({
                        stratFileId: stratFileId,
                        financialId: financial.id
                    });

                    self.employeeDeductions.fetch({
                        success: function(employeeDeductions) {
                            $(document).trigger("financialsLoaded");
                            self.$el.spin(false);
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load employeeDeductions. Status: %s %s", xhr.status, xhr.statusText));
                            self.$el.spin(false);
                        }
                    });

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load financial. Status: %s %s", xhr.status, xhr.statusText));
                    self.$el.spin(false);
                }
            });
        },


        load: function() {
            BaseFinancialView.prototype.load.call(this);

            // populate lead time
            var days = this.financial.get('inventoryLeadTime');
            if (days == undefined) {
                days = 30; // default 
            };
            this.$inventoryLeadTimeSlider.slider({value: days});
            this.$inventoryLeadTimeSlider.prev().text(sprintf(this.localizable.get('days_format'), days));

            // populate percent cogs
            var max = 100 - (this.employeeDeductions.get('percentCogsAreWages') || 0); // special restriction for COGS
            var val = this.financial.get('percentCogsIsInventory');
            if (val == undefined) {
                val = Math.min(10, max); // default 
            };
            this.$percentCogsIsInventorySlider.slider({
                value: val,
                max: max
            });
            this.$percentCogsIsInventorySlider.prev().text(val + '%');

            // munge multiple calls into one (multiple call defined by two calls separated by less than 800 ms)
            this.financial
                .off('change', null, 'financials')
                .on( 'change', $.debounce( 800, false, function(financial) {
                    this.save();
                }.bind(this), 'financials'));

            this.applyPermissions();
        },

        save: function() {
            this.financial.save(null, {
                success: function(response) {
                    console.info("saved financial: " + this.financial.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save financial. Status: %s %s", xhr.status, xhr.statusText) );
                    this.router.showSaveMessage(this.localizable('changesNotSaved'), true);
                }.bind(this),
                // prevent us getting into an infinite loop - server changes mod date, we don't care
                silent: true
            });

        },

        applyPermissions: function() {

            var stratFile = this.stratFile ? this.stratFile : this.router.stratFileManager.stratFileCollection.get(this.router.stratFileManager.stratFileId);
            
            // permissions status field
            var $perms = this.$el.find('.permissions');

            // field can be readonly or disabled (with data wiped)
            if (stratFile.hasWriteAccess('PLAN')) {
                $perms.hide();

                this.$inventoryLeadTimeSlider.slider({disabled: false});
                this.$percentCogsIsInventorySlider.slider({disabled: false});
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$inventoryLeadTimeSlider.slider({disabled: true});
                this.$percentCogsIsInventorySlider.slider({disabled: true});

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // disabled - probably won't actually get here, but just to be safe

                this.$inventoryLeadTimeSlider.slider({disabled: true});
                this.$percentCogsIsInventorySlider.slider({disabled: true});

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }


        }        


    });

    return view;
});