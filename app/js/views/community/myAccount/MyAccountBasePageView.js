define(['Config', 'Dictionary', 'BasePageView', 'i18n!nls/MyAccount.i18n', 'i18n!nls/Global.i18n', 'UserServiceProvider'],

function(config, Dictionary, BasePageView, localizable, gLocalizable, UserServiceProvider) {

    var view = BasePageView.extend({

        initialize: function(router) {            
            this.localizable = new Dictionary(localizable, gLocalizable);
            BasePageView.prototype.initialize.call(this, router);

            _.bindAll(this, 'load', 'renderPage', 'save', 'updateProgressBar');

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

            this.$progressBar = $('#pageToolbar #connectProgressBar .progress');

            var self = this;

            // field tooltips
            this.$el.find('.important-info')
                .tooltipster({
                    autoClose: true,
                    content: '',
                    contentCloning: false,
                    positionTracker: true,
                    contentAsHTML: true,
                    // on open
                    functionBefore: function(origin, continueTooltip) {

                        if (origin.data('template') !== 'cached') {

                            var fieldId = origin.closest('li').find('label[for]').attr('for'),
                                templateId = sprintf('community/tooltips/%s/%s', self.$el.attr('id'), fieldId),
                                template = Handlebars.templates[templateId],
                                context = self.localizable.all(),
                                content = template(context);

                            origin.tooltipster('content', content).data('template', 'cached');

                            continueTooltip();

                        } else {

                            continueTooltip();

                        }

                    },
                    interactive: true,
                    offsetY: '0px',
                    maxWidth: 500,
                    onlyOne: true,
                    theme: 'tooltipster-stratpad tooltip-small tooltip-important',
                    trigger: 'hover'
                });

        },

        load: function() {
            BasePageView.prototype.load.call(this);

            var self = this;

            this.$el.spin({top: '20px'});

            this.serviceProvider = new UserServiceProvider({userId: this.user.get('id')});
            router.myAccountManager.fetch(this.serviceProvider, {
                success: function(model) {

                    console.info("fetched serviceProvider: " + model.id);

                    self.serviceProviderLoaded();

                    // save on any change - attach late so that we don't invoke saves while populating
                    var $els = self.$el.find('form :input');
                    $els.off('change.connect');                  
                    $els.on('change.connect', self.save);

                    self.$el.spin(false);

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load UserServiceProvider. Status: %s %s", xhr.status, xhr.statusText) );
                    self.$el.spin(false);
                }
            });
        },

        serviceProviderLoaded: function() {
            this.updateProgressBar();
        },

        save: function(evt) {
            // the idea is that only 1 field could have changed, so update and save
            console.debug("save: " + this.serviceProvider.cid);
            var $target = $(evt.currentTarget),
                data = {},
                fieldName = $target.attr('name'),
                self = this;
            if ($target.attr('type') == 'checkbox') {
                data[$target.attr('name')] = $target.prop('checked');
            } else if ($target.attr('type') == 'file') {
                // handle file uploads separately
                return;
            } else {
                data[$target.attr('name')] = $target.val() ? $target.val() : null;
            }

            // sets the one field on the existing model
            // even if another one hadn't finished saving, this should contain the latest attributes
            this.serviceProvider.set(data);

            this.updateProgressBar();

            router.myAccountManager.save(self.serviceProvider, {
                success: function(response) {
                    console.info("saved serviceProvider: " + self.serviceProvider.id);
                    self.router.showSaveMessage(self.localizable.get('allChangesSaved'), false);

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save serviceProvider. Status: %s %s", xhr.status, xhr.statusText) );
                    self.router.showSaveMessage(self.localizable.get('changesNotSaved'), true);
                }
            });
        },

        // look at the fields in serviceProvider and give a percent complete
        updateProgressBar: function() {

            var self = this;

            // figure out html
            var compiledTemplate = Handlebars.templates['community/tooltips/ConnectProgress'];
            var context = this.localizable.all();
            var html = compiledTemplate(context);
            var $tooltipContent = $(html);
            var $missing = $tooltipContent.find('ul');
            $missing.empty();

            // get progress and missing fields
            var progress = this.serviceProvider.progress(this.user);
            for (var i = 0; i < progress.missing.length; i++) {
                var fieldName = progress.missing[i];
                $missing.append($('<li>').text(this.localizable.get(fieldName + '_fieldName')));
            };

            // enable payment button once everything except payment is done
            var readyForPayment = (progress.missing.length == 1 && progress.missing[0] == 'payment');
            var shouldDisableButton = !readyForPayment || progress.missing.length == 0; // disable if already paid too
            this.$el.find('button#payment').prop('disabled', shouldDisableButton);

            // update progress bar
            // note that we need to also put the tooltip on the progress well (the filled part and the empty part are separate pieces)
            this.$progressBar.css('width', progress.progress*100 + '%');

            // update user (also updates underlying router.user, and any listeners are notified)
            this.user.set('hasCompletedConnect', progress.progress == 1); // convenience prop (not synced with server)
            this.user.save();

            var $messages = $tooltipContent.find('.progressMessage'),
                $progressBarWrapper = this.$progressBar.closest('#connectProgressBar'),
                hasShownConnectSuccessKey = sprintf('%s-%s', 'hasShownConnectSuccess', this.user.get('id')),
                hasShownConnectSuccess = $.localStorage.getItem(hasShownConnectSuccessKey) == 'true';

            // update tooltip
            if (progress.progress == 1) {
                // show the tooltip with the complete message, but only once
                $messages.hide();
                $tooltipContent.find('#progressComplete').show();
                if (!hasShownConnectSuccess) {
                    $.localStorage.setItem(hasShownConnectSuccessKey, true);
                    setTimeout(function() {$progressBarWrapper.tooltipster('hide')}, 5000);
                };
            } else if (progress.progress == 0) {
                // show the tooltip with the start message
                $messages.hide();
                $tooltipContent.find('#progressStart').show();
            } else {
                // reset key
                $.localStorage.setItem(hasShownConnectSuccessKey, false);

                // hide the tooltip and update the content to its in progress mode
                $messages.hide();
                $tooltipContent.find('#progressMissing').show();
            }

            var funcBefore = function($origin, continueTooltip) {
                var $timeRemaining = $origin.tooltipster('content').find('#timeRemaining');
                    if (router.myAccountManager.isTiming()) {
                        var msg = sprintf(self.localizable.get('community.msgTenMinuteExpiry'), self.serviceProvider.escape('name'), router.myAccountManager.timeRemaining());
                        $timeRemaining.html(msg).show(); // xss safe
                    } else {
                        $timeRemaining.hide();
                    }

                    continueTooltip();
                };

            // remember, nodes with class 'tooltip' are initialized with tooltipster in pagetoolbar.js
            $progressBarWrapper.tooltipster('content', $tooltipContent);
            $progressBarWrapper.tooltipster('option', 'functionBefore', funcBefore );

        },        
    });

    return view;
});