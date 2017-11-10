define(['StratFile', 'Dictionary'],

function(StratFile, Dictionary) {

    var view = Backbone.View.extend({

        initialize: function(router, localizable) {
            _.bindAll(this, "load");

            this.router = router;
            this.localizable = new Dictionary(localizable);

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

                            var templatePath = origin.data('template-path'),
                                template = Handlebars.templates[templatePath],
                                context = _.extend({}, self.localizable.all(), self.financial.toJSON()),
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
            var user = $.parseJSON($.localStorage.getItem('user'));
            if (!user) {
                console.error("No logged in user available. Need to relogin.");
                return;
            }

            // let shared users know what page we're on
            this.router.messageManager.sendPageUpdate();            
        },

    });

    return view;
});