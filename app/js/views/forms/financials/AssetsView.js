define(['StratFile', 'AssetCollection', 'AssetListView', 'BaseFinancialView', 'Asset', 'monthpicker'],

function(StratFile, AssetCollection, AssetListView, BaseFinancialView, Asset) {

    var view = BaseFinancialView.extend({

        el: '#assets',

        // FinancialForms.i18n.js
        initialize: function(router, localizable) {
            _.bindAll(this, "_loadAssetsForCurrentStratFile", "_showEditAssetDialog", "_showAddAssetDialog", "_showDeleteAssetDialog", "_setUpAssetDialog", "_applyPermissions");

            BaseFinancialView.prototype.initialize.call(this, router, localizable);

            // load financials once stratfile is loaded
            $(document).bind("stratFileLoaded.financials", function(e, stratFile) {
                console.debug("Get ready to fetch some financial data");
                this.stratFile = stratFile;
                this._loadAssetsForCurrentStratFile();   
            }.bind(this));

            // new paradigm for us - on pageChanged, load up the financials again
            $(document).bind("pageChanged.financials", function() {
                this.stratFile = this.router.stratFileManager.currentStratFile();                
                this._loadAssetsForCurrentStratFile();
            }.bind(this));

            var self = this;
            this.$el
                .on(this.router.clicktype, "li.assetItem", function(e) {
                    if (!self.stratFile.hasReadAccess('PLAN')) { return; }

                    // edit or add, depending on whether the row is an asset or a noRows                     
                    var $ele = $(this);
                    var isNoRowsItem = $ele.find('.noAssets').length;
                    if (isNoRowsItem) {
                        self._showAddAssetDialog(e);
                    } else {
                        var assetId = $(this).data().assetId;
                        self._showEditAssetDialog(e, assetId);
                    }
                })
                .on(this.router.clicktype, ".addButton", function(e) {
                    self._showAddAssetDialog(e);
                })
                .on(this.router.clicktype, "li.assetItem nav > .deleteAsset", function(e) {
                    var assetId = $(this).closest('li.assetItem').data().assetId;
                    self._showDeleteAssetDialog(e, assetId);
                });

        },

        _loadAssetsForCurrentStratFile: function() {
            this.$el.find('ul.sortable').spin();
            var self = this;

            this.assetCollection = new AssetCollection(null, {stratFileId: this.stratFile.get('id') });
            this.assetCollection.fetch({
                success: function() {
                    var assetListView = new AssetListView(self.router, self.assetCollection, self.localizable );
                    assetListView.render();
                    self.$el.find('ul.sortable').spin(false);
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load assets. Status: %s %s", xhr.status, xhr.statusText));
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

        _showEditAssetDialog: function(e, assetId) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogEditAssetTitle'),
                template = $('#dialogEditAddAsset').clone().html();

            var asset = this.assetCollection.get(assetId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    // contentCSS: {
                    //     width: '700px'
                    // },
                    message: message,
                    input: template,
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogEditAssetOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    onSubmit: function(e) {
                        // add the asset

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#assetFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.assetDate ? moment(data.assetDate, 'MMM YYYY').format('YYYYMM') : null;
                        asset.set({
                            name: data.assetName.length > 0 ? data.assetName : self.localizable.get('untitledAsset'),
                            date: date,
                            type: data.assetType.length > 0 ? data.assetType : null,
                            value: data.assetValue.length > 0 ? data.assetValue : null,
                            salvageValue: data.assetSalvageValue.length > 0 ? data.assetSalvageValue : null,
                            depreciationTerm: data.assetDepreciationTerm.length > 0 ? data.assetDepreciationTerm : null
                        });

                        asset.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved asset with id: " + model.get("id"));
                                $vexContent.find('#assetFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#assetDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error("Oops, couldn't save asset.");
                                // error message
                            }
                        });
                    }                    
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    $dialog.find('#assetFields').spin();
                    self._setUpAssetDialog($dialog);

                    // populate - nb this will send out a change event if applicable
                    asset.fetch({
                        success: function(model) {
                            console.debug("Synced asset: " + model.get('name'));
                            $dialog.find('#assetFields').spin(false);

                            // name
                            $dialog.find('#assetName').val(model.get('name'));

                            // date
                            var date = model.has('date') ? moment(model.get('date').toString(), 'YYYYMM') : null;
                            var $assetDate = $dialog.find('#assetDate');
                            $assetDate.val(date ? date.format('MMM YYYY') : null);
                            $assetDate.monthpicker({
                                pattern: 'mmm yyyy'
                            });
                            $assetDate.prev('i').on(self.router.clicktype, function() {
                                $assetDate.monthpicker("show");
                            });                            

                            // type
                            $dialog.find('#assetType').select2('val', model.get("type"));

                            // value
                            $dialog.find('#assetValue').val(model.get('value'));

                            // salvage
                            $dialog.find('#assetSalvageValue').val(model.get('salvageValue'));

                            // depreciation term
                            $dialog.find('#assetDepreciationTerm').val(model.get('depreciationTerm'));

                            // depreciation type
                            $dialog.find('#assetDepreciationType').val(self.localizable.get(model.get('depreciationType')));

                        },
                        error: function(model, xhr, options) {
                            console.error(sprintf("Oops, couldn't sync objective. Status: %s %s", xhr.status, xhr.statusText));
                            $dialog.find('#assetFields').spin(false);
                        }
                    });

                });
        },

        _showAddAssetDialog: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var message = this.localizable.get('dialogAddAssetTitle'),
                template = $('#dialogEditAddAsset').clone().html();

            var asset = new Asset({
                'stratFileId': this.stratFile.get('id') ,
                'depreciationType': 'STRAIGHT_LINE' // always this val for now
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
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogAddAssetOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],
                    onSubmit: function(e) {
                        // add the asset

                        var $form, $vexContent;
                        $form = $(this);
                        $vexContent = $form.parent();
                        e.preventDefault();
                        e.stopPropagation();

                        $vexContent.find('#assetFields').spin();

                        var data = _.reduce($form.serializeArray(),function(a,b){a[b.name]=b.value;return a},{});

                        // NB depreciationType is not included in the data (readonly)
                        var date = data.assetDate ? moment(data.assetDate, 'MMM YYYY').format('YYYYMM') : null;
                        asset.set({
                            name: data.assetName.length > 0 ? data.assetName : self.localizable.get('untitledAsset'),
                            date: date,
                            type: data.assetType.length > 0 ? data.assetType : null,
                            value: data.assetValue.length > 0 ? data.assetValue : null,
                            salvageValue: data.assetSalvageValue.length > 0 ? data.assetSalvageValue : null,
                            depreciationTerm: data.assetDepreciationTerm.length > 0 ? data.assetDepreciationTerm : null
                        });

                        asset.save(null, {
                            success: function(model, response, options) {
                                console.debug("Saved asset with id: " + model.get("id"));
                                self.assetCollection.add(model);
                                $vexContent.find('#assetFields').spin(false);
                                
                                // clean up month picker
                                var id = $('#assetDate').monthpicker().data('monthpicker').settings.id;
                                $('#' + id).remove();

                                // close
                                return vex.close($vexContent.data().vex.id);
                            },
                            error: function(model, xhr, options) {
                                console.error("Oops, couldn't save asset.");
                                // error message
                            }
                        });
                    }
                })
                .bind('vexOpen', function() {
                    var $dialog = $(this);
                    self._setUpAssetDialog($dialog);

                    // post setup chores
                    var $assetDate = $dialog.find('#assetDate');
                    $assetDate.monthpicker({
                        pattern: 'mmm yyyy'
                    });
                    $assetDate.prev('i').on(self.router.clicktype, function() {
                        $assetDate.monthpicker("show");
                    });                            

                    // depreciation type
                    $dialog.find('#assetDepreciationType').val(self.localizable.get(asset.get('depreciationType')));

                });
        },

        _showDeleteAssetDialog: function(e, assetId) {
            e.preventDefault();
            e.stopPropagation();

            var asset = this.assetCollection.get(assetId);

            var self = this;
            vex
                .dialog.open({
                    className: 'vex-theme-plain',
                    message: sprintf(this.localizable.get('dialogDeleteAssetMessage'), asset.escape('name')),
                    buttons: [$.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('dialogDeleteAssetOk') }),
                              $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_cancel') }) ],                    
                    callback: function(okPressed) {
                        if (okPressed) {
                            console.debug("deleting: " + asset.get('name'));
                            asset.destroy({
                                success: function(model, response, options) {
                                    console.debug("Deleted asset with id: " + model.get("id"));

                                }.bind(this),
                                error: function(model, xhr, options) {
                                    console.error("Oops, couldn't delete asset.");
                                }
                            });
                        };
                    }
                });
        },

        _setUpAssetDialog: function($dialog) {
            // type
            $dialog.find('#assetType').select2();
            $('.select2-container').css({
                    width: '100%'
                });

            // hook up date late, once the value is known

            // restrict input on numeric fields (no decimals on changes)
            $dialog.find("input[type='number']").keydown($.stratweb.integerField).css({
                width: '100%'
            });

            // max value on term
            $dialog.find("input[type='number'][max]").change(function() {
                var $term = $(this);
                if ($term.val()*1 > $term.attr('max')*1) {
                    $term.val($term.attr('max'));
                }
            });
        }        

    });

    return view;
});