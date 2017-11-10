define(['Config', 'PageToolbarView', 'HelpDrawerView', 'PageStructure', 'backbone'],

    function(config, PageToolbarView, HelpDrawerView, pageStructure) {

        var view = Backbone.View.extend({

            el: '#pageContent',

            initialize: function(router) {

                _.bindAll(this, 'animateWelcome', 'goConnect');

                this.router = router;
                this.welcomeTimeouts = [];
                this.$body = $('body');

                var self = this;


                this.$body
                    .on('click', '#showHelp, #feedback-trigger', function(){
                        $('.spshake').removeClass('spAnimated spshake infinite');
                    })
                    .on('click', '.close-cn-helper', function(){
                        $(this).parents('.clickNextHelper').css('opacity', '0');
                    });

                // clean up any animations that made it out to other view, clear the timeouts if there are any.

                $(document).on("pageChanged", function() {

                    $('.spshake').removeClass('spAnimated spshake infinite');
                    $('#newStratfile').tooltipster('hide');

                    for (var i=0; i<self.welcomeTimeouts.length; i++) {
                        clearTimeout(self.welcomeTimeouts[i]);
                    }

                    self.welcomeTimeouts = [];
                });

            },

            animateWelcome: function(){

                if(this.$body.is('.location-chapter_welcome')){

                    var self = this,
                        $newStratFile = $('#newStratfile'),
                        $parent = $('.welcomePage'),
                        $menuGroups = $('.menuGroup, #stage5'),
                        initialTimeout = 200,
                        timeout = 1000;

                    // clear any previous welcome timeouts before starting this set

                    for (var i=0; i<self.welcomeTimeouts.length; i++) {
                        clearTimeout(self.welcomeTimeouts[i]);
                    }

                    // clean up classes for if they keep going through it

                    $newStratFile.tooltipster('hide');
                    $newStratFile.removeClass('spAnimated spshake infinite');
                    $menuGroups.removeClass('spAnimated spshake infinite');

                    // attach a close icon if needed to the click next item

                    $('.clickNextHelper span').append('<i class="close-cn-helper icon icon-new-times" />');

                    // loops over welcome pages fadein classes and sequentially fades them in

                    $parent.find('.fadeIn')
                        .each(function (i) {
                            var $this = $(this);
                            if(i === 0){
                                self.welcomeTimeouts.push(setTimeout(function(){
                                    $this.addClass('loaded');
                                }, initialTimeout));
                            } else {

                                self.welcomeTimeouts.push(setTimeout(function(){
                                    $this.addClass('loaded');
                                }, timeout));
                                timeout = timeout + 1200;
                            }
                        });

                    // page-specific behaviour

                    var nextHelperDelay = (this.$body.is('.location-page_0')) ? 0 : 2000;

                    self.welcomeTimeouts.push(setTimeout(function(){
                        $('.clickNextHelper').css('opacity', '1');
                    }, timeout + nextHelperDelay));                        

                    // some highlighting with shake animations when needed

                    if(this.$body.is('.location-page_2')){
                        // welcome03.html

                        this.router.pageToolbarView.addToolbarToPage();
                        this.router.helpDrawerView.addHelpToPage($('#pageContent'));

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $('#showHelp').addClass('spAnimated spshake infinite');
                        }, timeout));

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $('#feedback-form').addClass('spAnimated spshake infinite');
                        }, timeout + 1200));

                    }

                    else if(this.$body.is('.location-page_3')){
                        // welcome04.html

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $('#stratpad').addClass('spAnimated spshake infinite');
                        }, timeout));
                    }

                    else if(this.$body.is('.location-page_4')){
                        // welcome05.html

                        this.$el.find('#goConnect').on(router.clicktype, this.goConnect);

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $('#stage6').addClass('spAnimated spshake infinite');
                        }, timeout));
                    }

                    else if(this.$body.is('.location-page_5')){
                        // welcome06.html

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $('#stage7').addClass('spAnimated spshake infinite');
                        }, timeout));
                    }

                    else if(this.$body.is('.location-page_6')){
                        // welcome07.html

                        self.welcomeTimeouts.push(setTimeout(function(){
                            $newStratFile.addClass('spAnimated spshake infinite');
                        }, timeout));
                        self.welcomeTimeouts.push(setTimeout(function(){
                            $newStratFile.tooltipster('show');
                        }, timeout + 1200));
                    }

                }

            },

            goConnect: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0);
                router.emitPageChangeEvent = true;
                router.navigate(url, {
                    trigger: true,
                    replace: false
                });
            }


        });

        return view;
    });