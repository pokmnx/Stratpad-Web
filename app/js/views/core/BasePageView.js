// the base of all views which have some dynamic content, especially those provided by Backbone (the back end)
// very new: only in use in Connect right now, but can be applied backwards as needed

define(['Config', 'backbone'],

function(config) {

    var view = Backbone.View.extend({

        // this happens before the pageContent is rendered, and is a good place to attach general events, bind handlers, deal with localization
        initialize: function(router) {            
            _.bindAll(this, 'load', 'renderPage');

            this.router = router;  
            this.user = this.router.user;      
        },  

        // this is generally called by a subclass listening to stratFileLoaded events (ie once the stratfile model has finished loading)
        load: function() {

            // let shared users know what page we're on
            this.router.messageManager.sendPageUpdate();

        },

        // this is called from Router to fill out the template and attach it to the page, after page initialize, but before page load
        renderPage: function() {
            $.stratweb.assert(this.template, "Please define this.template.");
            $.stratweb.assert(this.localizable, "Please define this.localizable.");

            // grab the handlebars template
            var compiledTemplate = Handlebars.templates[this.template];
            var html = compiledTemplate(this.localizable.all());
            var $pageContentWrap = $('#pageContent');
            var $pageContent = $pageContentWrap.find('.content');
            $pageContent.empty();
            $pageContent.append(html);

            // re-establish $el since it just got deleted
            this.$el = $(this.$el.selector);                        

            // add toolbar
            this.router.pageToolbarView.addToolbarToPage();

            // affix help
            this.router.helpDrawerView.addHelpToPage($pageContent);

            // update the pageSlider (and headerPager)
            this.router.pageControlView.pageSliderView.attachHeaderPager();
            this.router.pageControlView.pageSliderView.updatePageNumber(this.router.page);

            $pageContentWrap.nanoScroller(this.router.nanoScrollOpts);
        }

    });

    return view;
});