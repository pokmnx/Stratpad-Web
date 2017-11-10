define(['Config', 'i18n!nls/Global.i18n', 'PageStructure', 'Dictionary', 'backbone', 'channel'],

    function(config, gLocalizable, pageStructure, Dictionary) {

        var MessageManager = Class.extend({

            // https://developers.google.com/appengine/docs/java/channel/javascript

            // when we load a stratfile, we can open a socket for that stratfile - close any old ones
            // need a manager to listen for messages on the socket (MessageManager)
            // send a message: editing(field) 
            // - all people who have the stratfile open will get the message, including the new user
            // - server should include list of users who are editing that field (including the new user)
            // - forms can listen for events sent by MessageManager
            // close socket at logout, stratfile switch
            // will get messages if the token times out (2h), so we should probably get a new one

            initialize: function(router) {

                this.router = router;
                this.localizable = new Dictionary(gLocalizable);

                _.bindAll(this, 'sendPageUpdate', 'close', '_showMessage');

                console.debug("initing MessageManager");

                var self = this;
                $(document).bind("stratFileLoaded", function(e, stratFile) {

                    self.stratFile = stratFile;

                    // changing stratfiles
                    if (self.socket) {
                        self.close();
                    }

                    console.debug("re-initting message channel");

                    self._openSocket();

                });


            },

            _openSocket: function() {
                    var self = this;

                    // get a new token and channel when we switch stratfiles
                    $.ajax({
                        url: config.serverBaseUrl + "/stratfiles/" + self.stratFile.get('id') + '/channel',
                        type: "GET",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8"
                    })
                    .done(function(response, textStatus, jqXHR) {
                        console.debug('token for stratfile: ' + response.token);
                        var channel = new goog.appengine.Channel(response.token);

                        self.socket = channel.open();

                        self.socket.onopen = function() {
                            console.debug('socket opened: ' + self.stratFile.get('id'));
                            window.setTimeout(function() {self.sendPageUpdate();}, 1000)
                        };

                        self.socket.onmessage = function(response) {
                            // messages come as strings - need to parse into JSON
                            var message = JSON.parse(response.data)
                            console.debug('Received a message: ' + JSON.stringify(message));

                            var currentUser = $.parseJSON($.localStorage.getItem('user'));
                            var pageRef = pageStructure.urlForCoords(self.router.section, self.router.chapter, self.router.page)

                            // remove currentUser and anyone not on the same page
                            var usersOnSamePage = _.filter(message, function(user) {
                                return (user.email != currentUser.email && user.field == pageRef);
                            });

                            // anybody besides us editing?
                            if (usersOnSamePage.length) {

                                // who was first to edit?
                                var firstUserToEdit = _.sortBy(message, "editStartDate")[0];
                                if (firstUserToEdit.email != currentUser.email) {
                                    // means we just arrived on scene, so show an extra message
                                    vex.dialog.alert({
                                        className: 'vex-theme-plain',
                                        'message': sprintf(self.localizable.get('alreadyBeingEdited'), firstUserToEdit.firstName)
                                    });
                                }

                                // show message listing all users
                                var firstNames = _.pluck(usersOnSamePage, 'firstName');
                                var editMessage = sprintf(self.localizable.get('currentlyEditing'), currentUser.firstname, firstNames.join(', '));
                                self._showMessage(editMessage);
                            } else {
                                self._showMessage('');
                            }
                        };

                        self.socket.onerror = function(error) {
                            // eg. {"description":"","code":400}
                            console.debug("error: " + JSON.stringify(error));
                            // try and reopen socket - this is usually when the socket times out (2h) and then we try to use it
                            self._openSocket();
                        };

                        self.socket.onclose = function() {
                            console.debug('socket closed: ' + self.stratFile.get('id'));
                        };
                        
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            _showMessage: function(message) {

	            $('#currentlyEditing')
		            .text(message)
		            .toggleClass('active', (message.length > 1));

            },

            close: function() {
                // basically, we're logging out, so close the socket (don't need to worry about old close handler)

                console.debug('closing socket');

                var deferred = $.Deferred();

                // might not be a socket for an unaccepted, shared stratfile
                if (this.socket) {
                    this.socket.onclose = function() {
                        deferred.resolve();
                        console.debug('socket closed');
                    };

                    this.socket.close();
                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            },

            sendPageUpdate:function() {

                // if we're reloading the page, we possibly won't have a stratfile yet, but it will be called again with a stratFile
                if (!this.stratFile) return;

                // only worried about F2 and F3 really
                if (this.router.section != pageStructure.SECTION_FORM) {
                    return;
                };

                // don't care if it is on a sample stratfile
                if (this.stratFile.isSampleFile()) {
                    return;
                };

                // send a message to the channel
                $.ajax({
                    url: config.serverBaseUrl + "/stratfiles/" + this.stratFile.get('id') + '/channel',
                    type: "POST",
                    dataType: 'json',
                    data: JSON.stringify({'field': pageStructure.urlForCoords(this.router.section, this.router.chapter, this.router.page)}),
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {
                    console.debug('Field update sent.');
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                });

            }



        });

        return MessageManager;
    }
);