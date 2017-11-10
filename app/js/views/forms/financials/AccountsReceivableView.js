define(['StratFile', 'Financial', 'BaseFinancialView'],

function(StratFile, Financial, BaseFinancialView) {

    var view = BaseFinancialView.extend({

        el: '#ar',

        prop: 'accountsReceivableTerm',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "load", "save", "loadFinancialForCurrentStratFile", "applyPermissions");

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            var self = this,
                $days = this.$el.find('.days'),
                $slider = this.$el.find('#slider');

            $slider.slider({
                min: -30,
                max: 180,
                step: 1,
                value: -30,
                disabled: true,
                slide: function( event, ui ) {
                    $days.text(sprintf(self.localizable.get('days_format'), ui.value));
                },
                change: function ( event, ui ) {
                    $days.text(sprintf(self.localizable.get('days_format'), ui.value));
                    self.financial.set(self.prop, ui.value);
                }
            });

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this.loadFinancialForCurrentStratFile();
                
            }.bind(this));

            // load form data once financials are loaded
            $(document).bind("financialsLoaded.financials", function(e, financial) {
                console.debug("Load up new financial form data.");
                this.financial = financial;
                this.load();
            }.bind(this));


            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.loadFinancialForCurrentStratFile();
            }.bind(this));

        },

        loadFinancialForCurrentStratFile: function() {
            var stratFileId = this.stratFile ? this.stratFile.get('id') : this.router.stratFileManager.stratFileId;
            var financial = new Financial({
                stratFileId: stratFileId
            });
            financial.fetch({
                success: function(model) {
                    console.debug('Financial fetched: ' + model.get('id'));
                    $(document).trigger("financialsLoaded", model);
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load financial. Status: %s %s", xhr.status, xhr.statusText));
                }
            });
        },

        load: function() {
            BaseFinancialView.prototype.load.call(this);

            // munge multiple calls into one (multiple call defined by two calls separated by less than 800 ms)
            this.financial
                .off('change', null, 'financials')
                .on( 'change', $.debounce( 800, false, function(financial) {
                    this.save();
                }.bind(this), 'financials'));

            var days = this.financial.get(this.prop);
            if (days == undefined) {
                days = 30; // default 
            };
            this.$el.find('#slider').slider({value: days});
            this.$el.find('.days').text(sprintf(this.localizable.get('days_format'), days));

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
                // prevent us getting into an infinite loop
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

                this.$el.find('#slider').slider({disabled: false});
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$el.find('#slider').slider({disabled: true});

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // disabled - probably won't actually get here, but just to be safe

                this.$el.find('#slider').slider({disabled: true});

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }

        }        

    });

    return view;
});