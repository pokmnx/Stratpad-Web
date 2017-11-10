define(['StratFile', 'Financial', 'BaseFinancialView', 'SalesTax', 'Selectize'],

function(StratFile, Financial, BaseFinancialView, SalesTax, Selectize) {

    var view = BaseFinancialView.extend({

        el: '#salesTax',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadSalesTaxForCurrentStratFile", 'applyPermissions');

            Selectize.define('no-delete', function(options) {
              this.deleteSelection = function() {};
            });

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this;

            // percent revenues taxable
            this.$el.find('.slider').slider({
                min: 0,
                max: 100,
                step: 1,
                value: 10,
                disabled: true,
                slide: function( event, ui ) {
                    $(this).parent().find('.value').text(ui.value + '%');
                },
                change: function ( event, ui ) {
                    var $this = $(this);
                    $this.parent().find('.value').text(ui.value + '%');
                    self.salesTax.set($this.data('field'), ui.value);
                }
            });

            // rate
            this.$el.find("#salesTaxRate")
                .keydown($.stratweb.unsignedDecimalField)
                .keydown($.stratweb.returnField)
                .change(function(e) {
                    var $rate = $(this);
                    var val = $rate.val();
                    if (val.length > 0) {
                        if (val*1 > $rate.attr('sp-max')) {
                            val = $rate.attr('sp-max');
                        }
                        val = (val*1).toFixed($rate.attr('sp-fixed'));
                        $rate.val(val);
                        self.salesTax.set('rate', val*1);
                    };
                });

            // frequency
            this.$el.find('input[name=remittanceFrequency]').on('change', function(e) {
                var frequency = $(this).val();
                self.salesTax.set('remittanceFrequency', frequency);
                if (frequency == 'ANNUALLY') {
                    self.$el.find('div.section.remittanceMonth').show();
                } else {
                    self.$el.find('div.section.remittanceMonth').hide();
                }
            });

            // month
            this.$el.find('#remittanceMonth')
                .selectize({
                  plugins: {
                    'no-delete': {}
                  }
                })
                .on('change', function(e) {
                    self.salesTax.set('remittanceMonth', $(this).val());
                });            

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadSalesTaxForCurrentStratFile();   
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e) {
                console.debug("Load up new salesTax form data.");
                this.load();
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.loadSalesTaxForCurrentStratFile();
            }.bind(this));

        },

        loadSalesTaxForCurrentStratFile: function() {
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

                    self.salesTax = new SalesTax({
                        stratFileId: stratFileId,
                        financialId: financial.id
                    });

                    self.salesTax.fetch({
                        success: function(salesTax) {
                            $(document).trigger("financialsLoaded");
                            self.$el.spin(false);
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load salesTax. Status: %s %s", xhr.status, xhr.statusText));
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
                var val = self.salesTax.get($this.data('field'));
                if (val == undefined) {
                    val = 0; // default 
                };
                $this.slider({value: val});
                $this.parent().find('.value').text(val + '%');
            });

            // rate
            this.$el.find("#salesTaxRate").val(this.salesTax.get('rate'));

            // frequency
            var frequency = this.salesTax.get('remittanceFrequency');
            this.$el.find(sprintf('input[name=remittanceFrequency][value=%s]', frequency)).prop('checked', true);

            // month
            this.$el.find('#remittanceMonth').selectize()[0].selectize.setValue(this.salesTax.get('remittanceMonth') || 3);
            if (frequency == 'ANNUALLY') {
                this.$el.find('div.section.remittanceMonth').show();
            };

            // munge multiple calls into one (multiple call defined by two calls separated by less than 800 ms)
            this.salesTax
                .off('change', null, 'financials')
                .on( 'change', $.debounce( 800, false, function() {
                    this.save();
                }.bind(this), 'financials'));

            this.applyPermissions();
        },

        save: function() {
            this.salesTax.save(null, {
                success: function(response) {
                    console.info("saved salesTax: " + this.salesTax.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save salesTax. Status: %s %s", xhr.status, xhr.statusText) );
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