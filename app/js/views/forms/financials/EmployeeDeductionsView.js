define(['StratFile', 'Financial', 'BaseFinancialView', 'EmployeeDeductions'],

function(StratFile, Financial, BaseFinancialView, EmployeeDeductions) {

    var view = BaseFinancialView.extend({

        el: '#employeeDeductions',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadEmployeeDeductionsForCurrentStratFile", 'applyPermissions');

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this;

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
                    self.employeeDeductions.set($this.data('field'), ui.value);
                }
            });

            this.$el.find('input:radio[name="dueDate"]').on('change', function(e) {
                self.employeeDeductions.set('dueDate', $(this).val());
            });

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadEmployeeDeductionsForCurrentStratFile();   
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e) {
                console.debug("Load up new employeeDeductions form data.");
                this.load();
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.loadEmployeeDeductionsForCurrentStratFile();
            }.bind(this));

        },

        loadEmployeeDeductionsForCurrentStratFile: function() {
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
                var val = self.employeeDeductions.get($this.data('field'));
                if (val == undefined) {
                    val = 0; // default 
                };
                $this.slider({value: val});
                $this.parent().find('.value').text(val + '%');
            });

            // special restriction for COGS
            this.$el.find('#percentCogsAreWages .slider').slider({max: 100 - (this.financial.get('percentCogsIsInventory') || 0)});

            // populate dueDate
            var dueDate = this.employeeDeductions.get('dueDate');
            if (!dueDate) {
                dueDate = 'THIS_MONTH';
            };
            this.$el.find(sprintf('input:radio[value="%s"]', dueDate)).prop('checked', true);

            // munge multiple calls into one (multiple call defined by two calls separated by less than 800 ms)
            this.employeeDeductions
                .off('change', null, 'financials')
                .on( 'change', $.debounce( 800, false, function() {
                    this.save();
                }.bind(this), 'financials'));

            this.applyPermissions();
        },

        save: function() {
            this.employeeDeductions.save(null, {
                success: function(response) {
                    console.info("saved employeeDeductions: " + this.employeeDeductions.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save employeeDeductions. Status: %s %s", xhr.status, xhr.statusText) );
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
                this.$el.find('input:radio[name="dueDate"]').prop('disabled', false);
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$el.find('.slider').slider({disabled: true});
                this.$el.find('input:radio[name="dueDate"]').prop('disabled', true);                

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // disabled - probably won't actually get here, but just to be safe

                this.$el.find('.slider').slider({disabled: true});
                this.$el.find('input:radio[name="dueDate"]').prop('disabled', true);                

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }


        }        


    });

    return view;
});