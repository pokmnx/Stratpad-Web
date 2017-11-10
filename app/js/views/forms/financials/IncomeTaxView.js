define(['StratFile', 'Financial', 'BaseFinancialView', 'IncomeTax'],

function(StratFile, Financial, BaseFinancialView, IncomeTax) {

    var view = BaseFinancialView.extend({

        el: '#incomeTax',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadIncomeTaxForCurrentStratFile", 'applyPermissions');

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this;

            // percent revenues taxable
            this.$el.find('.slider').not("[data-field=yearsCarryLossesForward]").slider({
                min: 0,
                max: 100,
                step: 1,
                value: 10, // default
                disabled: true,
                slide: function( event, ui ) {
                    $(this).parent().find('.value').text(ui.value + '%');
                },
                change: function ( event, ui ) {
                    var $this = $(this);
                    $this.parent().find('.value').text(ui.value + '%');
                    self.incomeTax.set($this.data('field'), ui.value);
                }
            });

            // income tax limits - have to go from the parent for this plugin
            this.$el.find("[contenteditable]").each(function() {
                var $this = $(this);
                $this
                    .contentEditable('field', $this)
                    .on('change', function(e) {
                        var field = e.changedField.data('key')
                            val = e.changed[field];
                        if (e.action == 'save') {
                            self.incomeTax.set(field, val);                            
                        } else if (field == 'salaryLimit2') {
                            self.$el.find('#rate3 .salaryLimit').text(val);
                        }
                    })
                    .on('keydown', $.stratweb.unsignedIntegerField)
                    .on('keydown', $.stratweb.returnField);
            });

            this.$el.find('#yearsCarryLossesForward .slider').slider({
                min: 0,
                max: 80,
                step: 1,
                value: 10, // default
                disabled: true,
                slide: function( event, ui ) {
                    $(this).parent().find('.value').text(sprintf(self.localizable.get('years_format'), ui.value));
                },
                change: function ( event, ui ) {
                    var $this = $(this);
                    $this.parent().find('.value').text(sprintf(self.localizable.get('years_format'), ui.value));
                    self.incomeTax.set($this.data('field'), ui.value);
                }
            });

            // month
            this.$el.find('#remittanceMonth')
                .selectize()
                .on('change', function(e) {
                    self.incomeTax.set('remittanceFrequency', 'ANNUALLY');
                    self.incomeTax.set('remittanceMonth', $(this).val());
                });            

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadIncomeTaxForCurrentStratFile();   
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e) {
                console.debug("Load up new IncomeTax form data.");
                this.load();
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.loadIncomeTaxForCurrentStratFile();
            }.bind(this));

        },

        loadIncomeTaxForCurrentStratFile: function() {
            // load the financial and then the deductions
            this.$el.spin();
            var stratFileId = this.stratFile ? this.stratFile.get('id') : this.router.stratFileManager.stratFileId;
            this.financial = new Financial({
                stratFileId: stratFileId
            });
            var self = this;
            this.financial.fetch({
                success: function(financial) {
                    console.debug('Financial fetched: ' + financial.get('id'));

                    self.incomeTax = new IncomeTax({
                        stratFileId: stratFileId,
                        financialId: financial.id
                    });

                    self.incomeTax.fetch({
                        success: function(incomeTax) {
                            $(document).trigger("financialsLoaded");
                            self.$el.spin(false);
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load IncomeTax. Status: %s %s", xhr.status, xhr.statusText));
                            self.$el.spin(false);
                        }
                    })

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load financial. Status: %s %s", xhr.status, xhr.statusText));
                    self.$el.spin(false);
                }
            });
        },

        load: function() {
            BaseFinancialView.prototype.load.call(this);

            var self = this;

            // populate sliders
            this.$el.find('.slider').each(function() {
                // populate percent wages
                var $this = $(this);
                var val = self.incomeTax.get($this.data('field'));
                if (val == undefined) {
                    val = 0; // default 
                };
                $this.slider({value: val});
                var displayVal = $this.data('field') == 'yearsCarryLossesForward' ? sprintf(self.localizable.get('years_format'), val) : val + '%';
                $this.parent().find('.value').text(displayVal);
            });

            // salary limits
            this.$el.find(".salaryLimit").each(function() {
                var $this = $(this);
                var val = self.incomeTax.get($this.data('key'));
                $this.text(val);
            });

            // month
            this.$el.find('#remittanceMonth').selectize()[0].selectize.setValue(this.incomeTax.get('remittanceMonth'));

            // munge multiple calls into one (multiple call defined by two calls separated by less than 800 ms)
            this.incomeTax
                .off('change', null, 'financials')
                .on( 'change', $.debounce( 800, false, function() {
                    this.save();
                }.bind(this), 'financials'));

            this.applyPermissions();
        },

        save: function() {
            this.incomeTax.save(null, {
                success: function(response) {
                    console.info("saved IncomeTax: " + this.incomeTax.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save IncomeTax. Status: %s %s", xhr.status, xhr.statusText) );
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

                this.$el.find('.slider').slider({disabled: false});
                this.$el.find(':input,select').prop('disabled', false);
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$el.find('.slider').slider({disabled: true});
                this.$el.find(':input,select').prop('disabled', true);                

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // disabled - probably won't actually get here, but just to be safe

                this.$el.find('.slider').slider({disabled: true});
                this.$el.find(':input,select').prop('disabled', true);                

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }


        }        


    });

    return view;
});