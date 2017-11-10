define(['BasePageView', 'Discussion', 'Config', 'PageStructure', 'i18n!nls/Global.i18n', 'Dictionary', 'rangy'],

function(BasePageView, Discussion, config, pageStructure, gLocalizable, Dictionary) {

    var view = BasePageView.extend({

        initialize: function(router, localizable) {
            this.localizable = new Dictionary(localizable, gLocalizable);
            BasePageView.prototype.initialize.call(this, router);

            _.bindAll(this, 'load', 'renderPage', 'save', 'applyPermissions');

            var self = this;

            // on page reload, when stratfile has loaded, start loading up form data
            $(document).on("stratFileLoaded.genericForm", function(e, stratFile) {
                console.debug("Load up new form data.");
                self.stratFile = stratFile;
                self.load();
            });

            // on pageChanged, load up the form data again
            $(document).on("pageChanged.genericForm", function() {
                self.stratFile = self.router.stratFileManager.currentStratFile();
                self.load();
            });

        }, 

        renderPage: function() {
            BasePageView.prototype.renderPage.call(this);

            // save the stratfile on any change (ie when losing focus)
            this.$el.find('fieldset :input').bind('change', this.save);
        },          

        load: function() {
            BasePageView.prototype.load.call(this);

            var self = this;

            // queue the fetch
            this.discussion = new Discussion({stratFileId: this.stratFile.get('id')});
            router.dispatchManager.fetch(this.discussion, {
                success: function(model) {

                    self.$el.find(":input").each(function() {
                        var $this = $(this);

                        // load the value into the field
                        if (model.has(this.id)) {
                            var value = model.get(this.id);
                            if (value) {
                                $this.val(value).trigger('autosize.resize');
                            }
                        } else {
                            $this.val('');
                        }
                    });

                    self.applyPermissions();

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load discussion. Status: %s %s", xhr.status, xhr.statusText) );
                }
            });

            // save once in idletime after 5s if needed
            $(document).on('checkSave.genericForm', function (e, secs) {
                if (secs == 5) {
                    if (self.stratFile.hasWriteAccess('PLAN')) {
                        console.log('running auto save');

                        // triggers the change event (if something in the field actually changed), but don't lose focus
                        // NB. if we don't have focus, the field has already saved on blur
                        var $fd = self.$el.find('fieldset :input:focus');

                        // trigger a change event so we get a save if needed
                        if ($fd.length) {
                            $fd.trigger('change');
                        };
                    }
                };
                
            });
            
        },

        save: function(evt) {
            console.debug("sf save: " + this.discussion.cid);
            var target = $(evt.currentTarget);
            var data = {};
	        var isError = false;
            data[target.attr('name')] = target.val();
            this.discussion.set(data);

            router.dispatchManager.save(this.discussion, {
                success: function(response) {
                    console.info("saved discussion: " + this.discussion.id);
                    router.showSaveMessage(this.localizable.get('allChangesSaved'), isError);

                }.bind(this),
                error: function(model, xhr, options) {
                    isError = true;
                    console.error(sprintf("Oops, couldn't save discussion. Status: %s %s", xhr.status, xhr.statusText) );
                    router.showSaveMessage(this.localizable.get('changesNotSaved'), isError);
                }.bind(this)
            });

        },

        applyPermissions: function() {

            var self = this;            
            
            // permissions status field
            var $perms = this.$el.find('fieldset .permissions');

            // field can be readonly or disabled (with data wiped)
            if (this.stratFile.hasWriteAccess('PLAN')) {
                $perms.hide();
                this.$el.find('fieldset :input').each(function() {
                    $(this).prop('readonly', false);
                    $(this).prop('disabled', false);  
                });
            }
            else if (this.stratFile.hasReadAccess('PLAN')) {
                this.$el.find('fieldset :input').each(function() {
                    $(this).prop('readonly', true);
                    $(this).prop('disabled', false);  
                    $perms.text(self.localizable.get('LBL_READ_ONLY'));
                    $perms.show();
                });
            }
            else {
                // disabled
                this.$el.find('fieldset :input').each(function() {
                    $(this).prop('disabled', true);
                    $(this).val('');
                    $perms.text(self.localizable.get('LBL_NO_ACCESS'));
                    $perms.show();
                });

            }

        }



    });

    return view;
});