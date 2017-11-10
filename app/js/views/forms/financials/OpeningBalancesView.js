define(['StratFile', 'Financial', 'OpeningBalances', 'BaseFinancialView'],

function(StratFile, Financial, OpeningBalances, BaseFinancialView) {

    var view = BaseFinancialView.extend({

        el: '#openingBalances',

        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadOpeningBalancesForCurrentStratFile", 'applyPermissions', 'updateRetainedEarnings');

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this;

            // restrict input on financial changes (no decimals)
            this.$el.find("input[type='number']")
                .keydown($.stratweb.integerField)
                .keydown($.stratweb.returnField)
                .change(function(e) {
                    // set model (which emits backbone change event)
                    var $this = $(this),
                        val = $this.val(),
                        fieldname = $this.data('field');
                    if ($.stratweb.isNumber(val)) {
                        self.openingBalances.set(fieldname, val*1);
                    }
                    else {
                        self.openingBalances.unset(fieldname);
                    }

                    self.updateRetainedEarnings();

                    self.save();
                    
                });


            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadOpeningBalancesForCurrentStratFile();   
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e) {
                console.debug("Load up new openingBalances form data.");
                this.load();
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                // todo: now seems like we're throwing a pageChanged when we reload the page -> no stratfile yet -> error (but the financialsLoaded event populates anyway)
                this.loadOpeningBalancesForCurrentStratFile();
            }.bind(this));

        },

        updateRetainedEarnings: function() {
            // update retained earnings field
            var cash = this.openingBalances.get('cash') || 0;
            var ap = this.openingBalances.get('accountsPayable') || 0;
            var ar = this.openingBalances.get('accountsReceivable') || 0;

            var re = cash + ar - ap;

            this.$el.find('#retainedEarnings').text(re);
        },

        loadOpeningBalancesForCurrentStratFile: function() {
            this.$el.spin();
            var stratFileId = this.stratFile ? this.stratFile.get('id') : this.router.stratFileManager.stratFileId;
            var financial = new Financial({
                stratFileId: stratFileId
            });
            var self = this;
            router.dispatchManager.fetch(financial, {
                success: function(financial) {
                    console.debug('Financial fetched: ' + financial.get('id'));

                    self.openingBalances = new OpeningBalances({
                        stratFileId: stratFileId,
                        financialId: financial.id
                    });

                    router.dispatchManager.fetch(self.openingBalances, {
                        success: function(openingBalances) {
                            $(document).trigger("financialsLoaded");
                            self.$el.spin(false);
                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't load openingBalances. Status: %s %s", xhr.status, xhr.statusText));
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

            this.$el.find('input').each(function() {
                var $this = $(this);
                $this.val(self.openingBalances.get($this.data('field')));
            });

            this.applyPermissions();

            this.updateRetainedEarnings();

        },

        save: function() {

	        var isError = false, 
                self = this;

            this.openingBalances.save(this.openingBalances.changedAttributes(), {
                success: function(response) {
                    // we rely on refreshing the stratfile when necessary, rather than updating the stratfile immediately, ie when saving a Theme, and then looking at F2
                    console.debug("saved openingBalances: " + JSON.stringify(self.openingBalances));
                    router.showSaveMessage(self.localizable.get('allChangesSaved'), isError);
                    self.updateRetainedEarnings();

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save openingBalances. Status: %s %s", xhr.status, xhr.statusText) );
	                isError = true;
                    router.showSaveMessage(self.localizable('changesNotSaved'), isError);
                    self.updateRetainedEarnings();
                }
            });
        },

        applyPermissions: function() {

            var stratFile = this.stratFile ? this.stratFile : this.router.stratFileManager.stratFileCollection.get(this.router.stratFileManager.stratFileId);
            
            // permissions status field
            var $perms = this.$el.find('.permissions');

            // field can be readonly or disabled (with data wiped)
            if (stratFile.hasWriteAccess('PLAN')) {
                $perms.hide();

                this.$el.find('input').prop('disabled', false);
                this.$el.find('input').prop('readonly', false);
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$el.find('input').prop('disabled', false);
                this.$el.find('input').prop('readonly', true);

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // disabled - probably won't actually get here, but just to be safe

                this.$el.find('input').prop('disabled', true);

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }

        }        


    });

    return view;
});