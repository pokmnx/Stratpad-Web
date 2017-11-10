define(['StratFile', 'LoanCollection', 'LoanListView', 'BaseFinancialView', 'Loan', 'monthpicker'],

function(StratFile, LoanCollection, LoanListView, BaseFinancialView, Loan) {

    var view = BaseFinancialView.extend({

        el: '#loans',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "_loadLoansForCurrentStratFile", "_showEditLoanDialog", "_showAddLoanDialog", "_showDeleteLoanDialog", "_setUpLoanDialog", "_applyPermissions");

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this._loadLoansForCurrentStratFile();   
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.stratFile = this.router.stratFileManager.currentStratFile();
                this._loadLoansForCurrentStratFile();
            }.bind(this));

            var self = this;
            this.$el
                .on(this.router.clicktype, "li.loanItem", function(e) {
                    if (!self.stratFile.hasReadAccess('PLAN')) { return; }

                    // edit or add, depending on whether the row is an loan or a noRows                     
                    var $ele = $(this);
                    var isNoRowsItem = $ele.find('.noLoans').length;
                    if (isNoRowsItem) {
                        self._showAddLoanDialog(e);
                    } else {
                        var loanId = $(this).data().loanId;
                        self._showEditLoanDialog(e, loanId);
                    }
                })
                .on(this.router.clicktype, ".addButton", function(e) {
                    self._showAddLoanDialog(e);
                })
                .on(this.router.clicktype, "li.loanItem nav > .deleteLoan", function(e) {
                    var loanId = $(this).closest('li.loanItem').data().loanId;
                    self._showDeleteLoanDialog(e, loanId);
                });

        },

        _loadLoansForCurrentStratFile: function() {
            this.$el.find('ul.sortable').spin();
            var self = this;

            this.loanCollection = new LoanCollection(null, {stratFileId: this.stratFile.get('id')});
            this.loanCollection.fetch({
                success: function() {
                    var loanListView = new LoanListView(self.router, self.loanCollection, self.localizable );
                    loanListView.render();
                    self.$el.find('ul.sortable').spin(false);
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load loans. Status: %s %s", xhr.status, xhr.statusText));
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

        _showEditLoanDialog: function(e, loanId) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogEditLoanTitle'),
                template = $('#dialogEditAddLoan').clone().html();

            var loan = this.loanCollection.get(loanId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogEditLoanOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    onSubmit: function(e) {
                        // add the loan

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#loanFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.loanDate ? moment(data.loanDate, 'MMM YYYY').format('YYYYMM') : null;
                        var termInMonths = data.loanTermMonths*1 + data.loanTermYears*12;
                        loan.set({
                            name: data.loanName.length > 0 ? data.loanName : self.localizable.get('untitledLoan'),
                            date: date,
                            amount: data.loanAmount.length > 0 ? data.loanAmount : null,
                            term: data.loanTermYears.length > 0 || data.loanTermMonths.length > 0 ? termInMonths : null,
                            rate: data.loanRate.length > 0 ? data.loanRate : null,
                            type: data.loanType.length > 0 ? data.loanType : null,
                            frequency: data.loanFrequency.length > 0 ? data.loanFrequency : null
                        });

                        loan.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved loan with id: " + model.get("id"));
                                $vexContent.find('#loanFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#loanDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't save loan. Status: %s %s", xhr.status, xhr.statusText) );                                
                                // error message
                            }
                        });
                    }                    
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    $dialog.find('#loanFields').spin()
                    self._setUpLoanDialog($dialog);

                    // populate - nb this will send out a change event if applicable
                    loan.fetch({
                        success: function(model) {
                            console.debug("Synced loan: " + model.get('name'));
                            $dialog.find('#loanFields').spin(false);

                            // name
                            $dialog.find('#loanName').val(model.get('name'));

                            // date
                            var date = model.has('date') ? moment(model.get('date').toString(), 'YYYYMM') : null;
                            var $loanDate = $dialog.find('#loanDate');
                            $loanDate.val(date ? date.format('MMM YYYY') : null);
                            $loanDate.monthpicker({
                                pattern: 'mmm yyyy'
                            });
                            $loanDate.prev('i').on(self.router.clicktype, function() {
                                $loanDate.monthpicker("show");
                            });                            

                            // type
                            $dialog.find('#loanType').select2('val', model.get("type"));

                            // frequency
                            $dialog.find('#loanFrequency').select2('val', model.get("frequency"));

                            // amount
                            $dialog.find('#loanAmount').val(model.get('amount'));

                            // rate
                            $dialog.find('#loanRate').val(model.get('rate'));

                            // term
                            if (model.has('term')) {
                                var y = Math.floor(model.get('term')/12);
                                var m = model.get('term')%12;
                                $dialog.find('#loanTermYears').val(y);
                                $dialog.find('#loanTermMonths').val(m);                                
                            };

                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
                            $dialog.find('#loanFields').spin(false);
                        }
                    });

                });
        },

        _showAddLoanDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogAddLoanTitle'),
                template = $('#dialogEditAddLoan').clone().html();

            var loan = new Loan({
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
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogAddLoanOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],
                    onSubmit: function(e) {
                        // add the loan

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#loanFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.loanDate ? moment(data.loanDate, 'MMM YYYY').format('YYYYMM') : null;
                        var termInMonths = data.loanTermMonths*1 + data.loanTermYears*12;
                        loan.set({
                            name: data.loanName.length > 0 ? data.loanName : self.localizable.get('untitledLoan'),
                            date: date,
                            amount: data.loanAmount.length > 0 ? data.loanAmount : null,
                            term: data.loanTermYears.length > 0 || data.loanTermMonths.length > 0 ? termInMonths : null,
                            rate: data.loanRate.length > 0 ? data.loanRate : null,
                            type: data.loanType.length > 0 ? data.loanType : null,
                            frequency: data.loanFrequency.length > 0 ? data.loanFrequency : null
                        });

                        loan.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved loan with id: " + model.get("id"));
                                self.loanCollection.add(model);
                                $vexContent.find('#loanFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#loanDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error(sprintf("Oops, couldn't save loan. Status: %s %s", xhr.status, xhr.statusText) );
                                // error message
                            }
                        });
                    }
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    self._setUpLoanDialog($dialog);

                    // post setup chores
                    var $loanDate = $dialog.find('#loanDate');
                    $loanDate.monthpicker({
                        pattern: 'mmm yyyy'
                    });
                    $loanDate.prev('i').on(self.router.clicktype, function() {
                        $loanDate.monthpicker("show");
                    });                            

                });
        },

        _showDeleteLoanDialog: function(e, loanId) {
            e.preventDefault();
            e.stopPropagation();

            var loan = this.loanCollection.get(loanId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    message: sprintf(this.localizable.get('dialogDeleteLoanMessage'), loan.escape('name')),
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogDeleteLoanOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    callback: function(okPressed) {
                        if (okPressed) {
                            console.debug("deleting: " + loan.get('name'));
                            loan.destroy({
                                success: function(model, response, options) {
                                    console.debug("Deleted loan with id: " + model.get("id"));

                                }.bind(this),
                                error: function(model, xhr, options) {
                                    console.error(sprintf("Oops, couldn't delete loan. Status: %s %s", xhr.status, xhr.statusText) );
                                }
                            });
                        };
                    }
                });
        },

        _setUpLoanDialog: function($dialog) {
            // type
            $dialog.find('#loanType, #loanFrequency').select2();
            $('.select2-container').css({
                    width: '100%'
                });

            // hook up date late, once the value is known

            // restrict input on numeric fields (no decimals on changes)
            $dialog.find("#loanAmount").keydown($.stratweb.integerField).css({
                width: '100%'
            });

            $dialog.find("#loanTermYears, #loanTermMonths").keydown($.stratweb.integerField).css({
                width: '49%'
            });

            $dialog.find("#loanRate").keydown($.stratweb.decimalField).css({
                width: '100%',
                'text-align': 'right'
            });

            // max values
            $dialog.find("input[max]").change(function() {
                var $term = $(this);
                if ($term.val()*1 > $term.attr('max')*1) {
                    $term.val($term.attr('max'));
                }
            });

            // decimals
            $dialog.find("input[fixed]").change(function() {
                var $term = $(this);
                if ($term.val().length > 0) {
                    var val = ($term.val()*1).toFixed($term.attr('fixed'))
                    $term.val(val);
                }
            });

        }        

    });

    return view;
});