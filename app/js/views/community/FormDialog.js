// generic simple form dialog; hooks up the button to submit a form
define(['Config', 'Dictionary', 'i18n!nls/MyAccount.i18n', 'i18n!nls/Global.i18n', 'backbone'],

function(config, Dictionary, localizable, gLocalizable) {

    var view = Backbone.View.extend({

        // template to use for the form showing in the popup
        // context to use when rendering the provided template
        initialize: function(router, templateId, context) {
        	this.router = router;
        	this.templateId = templateId; // SuggestCategoryDialog or ConnectLinkDialog or ConnectRequestDialog or similar
        	this.context = context;

            _.bindAll(this, "showFormDialog", 'doSuggestCategory', 'doReferFriend', 'doSuggestCity');      

            this.localizable = new Dictionary(localizable, gLocalizable);

        },

        /**
         * e                event
         * submitFunction   name of function that exists here, to call when submit button is pressed
         * submitContext    we'll store this context for you, and use it when your submitFunction is called
         */
        showFormDialog: function(e, submitFunction, submitContext) {
            e.preventDefault();
            e.stopPropagation();

            var self = this,

                // what we clicked
                $target = $(e.target),

                // the anchor wrapper
                $a = $target.closest('a');

            // should be equivalent to tooltipster origin
            this.$origin = $a.length ? $a : $target;

            // store context for the submit func
            this.submitContext = submitContext;

            // only attach once
            if (this.$origin.data('template') !== 'cached') {

                this.$origin.tooltipster({
                    autoClose: true,
                    content: '',
                    contentCloning: false,
                    positionTracker: true,
                    contentAsHTML: true,

                    // after added to the dom, we can hook up the submit button
                    functionReady: function($origin, $tooltip) {
                        $tooltip.find('button').on(self.router.clicktype, submitFunction);
                    },

                    // on open
                    functionBefore: function(origin, continueTooltip) {

                        if (origin.data('template') !== 'cached') {

                            var template = Handlebars.templates[self.templateId],
                            	context = _.defaults(self.context, self.localizable.all()),
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
                    theme: 'tooltipster-stratpad tooltip-small tooltip-important tooltip-form-dialog',
                    trigger: 'click'
                });
            }

            this.$origin.tooltipster('show');
        },        

        // submit handlers --- 
        // don't need to be here, but convenient if they are being reused in the app

        doSuggestCategory: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $btn = $(e.target),
                $input = $btn.prev(),
                $msg = $btn.next();

            var opts = _.extend({left: '-40px', top: '-25px'}, $.fn.spin.presets.small);
            $msg.spin(opts);

            $.ajax({
                url: config.serverBaseUrl + "/suggestCategory",
                type: "GET",
                data: {category: $input.val()},
                contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                    console.debug("Suggest category success.");
                    $input.val("");
                    $msg.text('Thanks!');

                })
                .fail(function(jqXHR, textStatus, errorThrown) {

                    console.warn("Suggest category fail");
                    $msg.text('Sorry, there was a problem. Try again later.');

                })
                .always(function(jqXHR, textStatus, errorThrown) {
                    setTimeout(function() {$msg.text('');}, 3000);
                    $msg.spin(false);
                });
        },

        doReferFriend: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $btn = $(e.target),
                $input = $btn.prev(),
                $msg = $btn.next();

            var opts = _.extend({left: '-40px', top: '-25px'}, $.fn.spin.presets.small);
            $msg.spin(opts);

            $.ajax({
                url: config.serverBaseUrl + "/connectReferrals",
                type: "POST",
                data: {email: $input.val(), category: this.submitContext},
                contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                    console.debug("Refer a friend success.");
                    $input.val("");
                    $msg.text('Thanks!');

                })
                .fail(function(jqXHR, textStatus, errorThrown) {

                    if (jqXHR.status == 417) {
                        console.debug("Refer a friend fail - 417");
                        $input.val("");
                        $msg.text('Thanks!');                        
                    } else {
                        console.warn("Refer a friend fail");
                        $msg.text(jqXHR.responseJSON.data.title);
                    }

                })
                .always(function(jqXHR, textStatus, errorThrown) {
                    setTimeout(function() {$msg.text('');}, 3000);
                    $msg.spin(false);
                });

        },         

        doSuggestCity: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $btn = $(e.target),
                $input = $btn.prev(),
                $msg = $btn.next(),
                self = this;

            var opts = _.extend({left: '-40px', top: '-25px'}, $.fn.spin.presets.small);
            $msg.spin(opts);

            $input.prop('disabled', true);
            $btn.prop('disabled', true);

            $.ajax({
                url: config.serverBaseUrl + "/suggestCity",
                type: "GET",
                data: {city: $input.val()},
                contentType: "application/json; charset=utf-8"
            })
                .done(function(response, textStatus, jqXHR) {

                    console.debug("Add city success.");
                    $msg.text('Thanks!');

                    setTimeout(function() {
                        self.$origin.tooltipster('hide');
                    }, 3000);

                })
                .fail(function(jqXHR, textStatus, errorThrown) {

                    console.warn("Add city fail");
                    $msg.text('Sorry, there was a problem. Try again later.');

                    $input.prop('disabled', false);
                    $btn.prop('disabled', false);

                })
                .always(function(jqXHR, textStatus, errorThrown) {
                    setTimeout(function() {$msg.text('');}, 3000);
                    $msg.spin(false);
                });
        }


    });

    return view;
});