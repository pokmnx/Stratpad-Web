define(['Config', 'i18n!nls/FeedbackView.i18n', 'Dictionary', 'backbone'],

    function(config, localizable, Dictionary) {

        var view = Backbone.View.extend({

            el: '#feedback-form',

            initialize: function(router) {
                _.bindAll(this, "toggleFeedbackPanel", "submitFeedback");

                this.localizable = new Dictionary(localizable);
                this.router = router;

                var compiledTemplate = Handlebars.templates['FeedbackView'];
                var html = compiledTemplate(this.localizable.all());
                $(this.el).append($(html).html());

                var self = this;
                $("body").on(this.router.clicktype, "#feedback-trigger", function(e) {
                    self.toggleFeedbackPanel(e, $(this));
                });

                this.$el.find('#feedback-panel button').on(this.router.clicktype, this.submitFeedback);

            },

            submitFeedback: function(ele) {
                var user = $.parseJSON($.localStorage.getItem('user')),
                    data = {
                        page: window.location.hash.slice(1),
                        browser: navigator.userAgent,
                        category: this.$el.find('form input[name=category]:checked').val(),
                        feedback: this.$el.find('form #feedback').val()
                    },
                    $btnSubmit = this.$el.find('#feedback-panel button'),
                    btnWidth = $btnSubmit.width(),
                    $message = $btnSubmit.next(),
                    self = this;

                $btnSubmit.prop('disabled', true);
                $btnSubmit.width(btnWidth);
                $btnSubmit.text('');
                $btnSubmit.spin('small');

                $.ajax({
                    url: config.serverBaseUrl + "/feedback",
                    type: "POST",
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {
                        console.debug('Thanks for your feedback!');
                        $btnSubmit.prop('disabled', false);
                        $btnSubmit.spin(false);
                        $btnSubmit.text('Submit');
                        
                        $message.text('Thanks for your feedback!');
                        setTimeout(function() {
                            $message.text('');
                        }, 3000);

                        self.$el.find('form input[name=category]').prop('checked', false);
                        self.$el.find('form #feedback').val('');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                        $btnSubmit.prop('disabled', false);
                        $btnSubmit.spin(false);
                        $btnSubmit.text('Submit');
                        $message.text('Sorry, there was a problem. Please try again later.');
                        setTimeout(function() {
                            $message.text('');
                        }, 3000);                        
                    });

            },

            toggleFeedbackPanel: function(e, $ele) {

                e.preventDefault();

                var $content = $ele.parent();
                if ($ele.is('.open')) {
                    $ele
                        .removeClass('open')
                        .find('i')
                        .removeClass()
                        .addClass('icon-ui-arrow-up-2');
                    $ele
                        .find('span')
                        .text(this.localizable.get('feedbackOpen'));
                    $content
                        .removeClass('active');

                    // prevent forms from tabbing to this hidden panel
                    $content
                        .find(':input').each(function() {
                            $(this).prop('tabindex', "-1");
                        });
                } else {
                    $ele
                        .addClass('open')
                        .find('i')
                        .removeClass()
                        .addClass('icon-ui-arrow-down-2');
                    $ele
                        .find('span')
                        .text(this.localizable.get('feedbackClose'));
                    $content
                        .addClass('active');

                    var $start = 4000;
                    $content
                        .find(':input').each(function() {
                            $(this).prop('tabindex', $start++);
                        });                        
                }
            }

        });

        return view;
    });