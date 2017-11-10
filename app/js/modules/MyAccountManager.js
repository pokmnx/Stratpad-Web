define(['Config', 'i18n!nls/MyAccount.i18n', 'PageStructure', 'Dictionary', 'backbone'],

    function(config, localizable, pageStructure, Dictionary) {

        // when we change pages, and the last item isn't yet saved:
        // PUT is issued, GET is issued, PUT is received, GET is received -- no good
        // PUT is issued, PUT is received, GET is issued, GET is received -- good
        // so, often, the long description is overwritten (making it seem like it didn't save)
        // here we fix that problem by making the calls synchronous

        var MyAccountManager = Class.extend({

            initialize: function() {

                this.localizable = new Dictionary(localizable);

                _.bindAll(this, "save", "fetch", 'startTimer', 'timeRemaining', 'isTiming', 'stopTimer');

                this.deferred = $.Deferred();
                this.deferred.resolve();

            },

            save: function(model, handlers) {
                router.dispatchManager.save(model, handlers);
            },

            fetch: function(model, handlers) {
                router.dispatchManager.fetch(model, handlers);
            },

            startTimer: function(serviceProvider) {
                // just counts down from 10 minutes
                this.startTime = moment();

                var self = this;

                $(document)
                    .off('.MyAccountManager')
                    .on('asecond.MyAccountManager', function (e) {
                        // check to see if we expired
                        var diff = moment().diff(self.startTime, 'seconds');
                        if (diff >= 10*60) {
                            self.stopTimer();
                            
                            vex.dialog.alert({
                                className: 'vex-theme-plain',
                                message: self.localizable.get('community.titleTenMinuteExpired'),
                                input: sprintf(self.localizable.get('community.msgTenMinuteExpired'), serviceProvider.get('name')),
                                callback: function(value) {
                                    // delete the link/clone (even though it will happen server-side anyway) and then navigate back
                                    $.ajax({
                                        url: sprintf("%s/serviceProviders/%s/link", config.serverBaseUrl, serviceProvider.get('id')),
                                        type: "DELETE",
                                        contentType: "application/json; charset=utf-8"
                                    })
                                        .done(function(response, textStatus, jqXHR) {
                                            // goto/reload first page - expectation is that this is gone from the server, and your default serviceProvider will load
                                            router.showStratPage(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0, true); 
                                        })
                                        .fail(function(jqXHR, textStatus, errorThrown) {
                                            console.error(sprintf("%s: %s", textStatus, errorThrown));                            
                                            var error = $.stratweb.firstError(jqXHR.responseJSON, 'unknownError');
                                            var message = self.localizable.get(error.key);
                                            if (message == error.key) {
                                                message = error.message;
                                            }
                                            console.error(sprintf("%s: %s", error.key, message));
                                        });                                    

                                }
                            });

                        };

                    });
            },

            timeRemaining: function() {
                if (!this.isTiming()) { return '0m 0s'};
                var diff = moment.duration(10*60 - moment().diff(this.startTime, 'seconds'), 'seconds');
                return sprintf('%dm %ds', diff.minutes(), diff.seconds());
            },

            isTiming: function() {
                return this.startTime != null;
            },

            stopTimer: function() {
                $(document).off('.MyAccountManager');
                this.startTime = null;
            }

        });

        return MyAccountManager;
    }
);