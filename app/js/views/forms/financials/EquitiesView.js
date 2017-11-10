define(['StratFile', 'EquityCollection', 'EquityListView', 'BaseFinancialView', 'Equity', 'monthpicker'],

function(StratFile, EquityCollection, EquityListView, BaseFinancialView, Equity) {

    var view = BaseFinancialView.extend({

        el: '#equities',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "_loadEquitiesForCurrentStratFile", "_showEditEquityDialog", "_showAddEquityDialog", "_showDeleteEquityDialog", "_setUpEquityDialog", "_applyPermissions");

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this._loadEquitiesForCurrentStratFile();   
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.stratFile = this.router.stratFileManager.currentStratFile();
                this._loadEquitiesForCurrentStratFile();
            }.bind(this));

            var self = this;
            this.$el
                .on(this.router.clicktype, "li.equityItem", function(e) {
                    if (!self.stratFile.hasReadAccess('PLAN')) { return; }

                    // edit or add, depending on whether the row is an equity or a noRows                     
                    var $ele = $(this);
                    var isNoRowsItem = $ele.find('.noEquities').length;
                    if (isNoRowsItem) {
                        self._showAddEquityDialog(e);
                    } else {
                        var equityId = $(this).data().equityId;
                        self._showEditEquityDialog(e, equityId);
                    }
                })
                .on(this.router.clicktype, ".addButton", function(e) {
                    self._showAddEquityDialog(e);
                })
                .on(this.router.clicktype, "li.equityItem nav > .deleteEquity", function(e) {
                    var equityId = $(this).closest('li.equityItem').data().equityId;
                    self._showDeleteEquityDialog(e, equityId);
                });

        },

        _loadEquitiesForCurrentStratFile: function() {
            this.$el.find('ul.sortable').spin();
            var self = this;

            this.equityCollection = new EquityCollection(null, {stratFileId: this.stratFile.get('id') });
            this.equityCollection.fetch({
                success: function() {
                    var equityListView = new EquityListView(self.router, self.equityCollection, self.localizable );
                    equityListView.render();
                    self.$el.find('ul.sortable').spin(false);
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load equities. Status: %s %s", xhr.status, xhr.statusText));
                    self.$el.find('ul.sortable').spin(false);
                }
            });

            this._applyPermissions();
        },

        _applyPermissions: function() {

            var stratFile = this.stratFile ? this.stratFile : this.router.stratFileManager.currentStratFile();

            // permissions status field
            var $perms = this.$el.find('.permissions');            

            if (stratFile.hasWriteAccess('PLAN')) {

                this.$el.find('.addButton').show();

                $perms.hide();
                
            }
            else if (stratFile.hasReadAccess('PLAN')) {

                this.$el.find('.addButton').hide();

                $perms.text(this.localizable.get('warn_readonly'));
                $perms.show();                  

            }
            else {
                // no access

                this.$el.find('.addButton').hide();                    

                $perms.text(this.localizable.get('LBL_NO_ACCESS'));
                $perms.show();

            }

        },        

        _showEditEquityDialog: function(e, equityId) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogEditEquityTitle'),
                template = $('#dialogEditAddEquity').clone().html();

            var equity = this.equityCollection.get(equityId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogEditEquityOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    onSubmit: function(e) {
                        // add the equity

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#equityFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.equityDate ? moment(data.equityDate, 'MMM YYYY').format('YYYYMM') : null;
                        equity.set({
                            name: data.equityName.length > 0 ? data.equityName : self.localizable.get('untitledEquity'),
                            date: date,
                            value: data.equityValue.length > 0 ? data.equityValue : null
                        });

                        equity.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved equity with id: " + model.get("id"));
                                $vexContent.find('#equityFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#equityDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't save equity. Status: %s %s", xhr.status, xhr.statusText) );                                
                                // error message
                            }
                        });
                    }                    
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    $dialog.find('#equityFields').spin();
                    self._setUpEquityDialog($dialog);

                    // populate - nb this will send out a change event if applicable
                    equity.fetch({
                        success: function(model) {
                            console.debug("Synced equity: " + model.get('name'));
                            $dialog.find('#equityFields').spin(false);

                            // name
                            $dialog.find('#equityName').val(model.get('name'));

                            // date
                            var date = model.has('date') ? moment(model.get('date').toString(), 'YYYYMM') : null;
                            var $equityDate = $dialog.find('#equityDate');
                            $equityDate.val(date ? date.format('MMM YYYY') : null);
                            $equityDate.monthpicker({
                                pattern: 'mmm yyyy'
                            });
                            $equityDate.prev('i').on(self.router.clicktype, function() {
                                $equityDate.monthpicker("show");
                            });                            

                            // value
                            $dialog.find('#equityValue').val(model.get('value'));

                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
                            $dialog.find('#equityFields').spin(false);
                        }
                    });

                });
        },

        _showAddEquityDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogAddEquityTitle'),
                template = $('#dialogEditAddEquity').clone().html();

            var equity = new Equity({
                'stratFileId': this.stratFile.get('id') 
            });

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogAddEquityOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],
                    onSubmit: function(e) {
                        // add the equity

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#equityFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.equityDate ? moment(data.equityDate, 'MMM YYYY').format('YYYYMM') : null;
                        equity.set({
                            name: data.equityName.length > 0 ? data.equityName : self.localizable.get('untitledEquity'),
                            date: date,
                            value: data.equityValue.length > 0 ? data.equityValue : null
                        });

                        equity.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved equity with id: " + model.get("id"));
                                self.equityCollection.add(model);
                                $vexContent.find('#equityFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#equityDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't save equity. Status: %s %s", xhr.status, xhr.statusText) );
                                // error message
                            }
                        });
                    }
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    self._setUpEquityDialog($dialog);

                    // post setup chores
                    var $equityDate = $dialog.find('#equityDate');
                    $equityDate.monthpicker({
                        pattern: 'mmm yyyy'
                    });
                    $equityDate.prev('i').on(self.router.clicktype, function() {
                        $equityDate.monthpicker("show");
                    });                            

                });
        },

        _showDeleteEquityDialog: function(e, equityId) {
            e.preventDefault();
            e.stopPropagation();

            var equity = this.equityCollection.get(equityId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    message: sprintf(this.localizable.get('dialogDeleteEquityMessage'), equity.escape('name')),
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogDeleteEquityOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    callback: function(okPressed) {
                        if (okPressed) {
                            console.debug("deleting: " + equity.get('name'));
                            equity.destroy({
                                success: function(model, response, options) {
                                    console.debug("Deleted equity with id: " + model.get("id"));

                                }.bind(this),
                                error: function(model, xhr, options) {
                                    console.error(sprintf("Oops, couldn't delete equity. Status: %s %s", xhr.status, xhr.statusText) );
                                }
                            });
                        };
                    }
                });
        },

        _setUpEquityDialog: function($dialog) {

            // hook up date late, once the value is known

            // restrict input on numeric fields (no decimals on changes)
            $dialog.find("input[type='number']").keydown($.stratweb.integerField).css({
                width: '100%'
            });

        }        

    });

    return view;
});