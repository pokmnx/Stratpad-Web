// for F1, F2 and F3 which have simple text fields
define(['StratFile', 'Config', 'AccessControlEntry', 'Dictionary', 'ipp'],

function(StratFile, config, AccessControlEntry, Dictionary) {

    var view = Backbone.View.extend({

        el: $('#pageContent'),

        initialize: function(router, localizable) {            
            _.bindAll(this, 'load', 'applyPermissions');

            this.router = router;
            this.localizable = new Dictionary(localizable);
            var self = this;
        
            // resize large text fields around their content
            this.$el.find('fieldset :input').autosize();

            // on page reload, when stratfile has loaded, start loading up form data
            $(document).on("stratFileLoaded.genericForm", function(e, stratFile) {
                console.debug("Load up new discussion form data.");
                self.stratFile = stratFile;
                self.load();
            });

            // on pageChanged, load up the discussion again
            $(document).on("pageChanged.genericForm", function() {
                self.stratFile = self.router.stratFileManager.currentStratFile();
                self.load();
            });

        },  

        load: function() {
            var self = this,
                user = $.parseJSON($.localStorage.getItem('user'));
            if (!user) {
                console.error("No logged in user available. Need to relogin.");
                window.location = "index.html#login";
                return;
            }

            // let shared users know what page we're on
            this.router.messageManager.sendPageUpdate();

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