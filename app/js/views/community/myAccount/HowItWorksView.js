define(['Config', 'Dictionary', 'BasePageView', 'i18n!nls/MyAccount.i18n', 'PageStructure'],

function(config, Dictionary, BasePageView, localizable, pageStructure) {

    var view = BasePageView.extend({

        el: '#pageContent',

        template: 'community/myAccount/HowItWorksView',

        initialize: function(router) {            
            this.localizable = new Dictionary(localizable);
            BasePageView.prototype.initialize.call(this, router);

            _.bindAll(this, 'load', 'goConnect');
        },  

        renderPage: function() {
            BasePageView.prototype.renderPage.call(this);

            this.$el.find('#howItWorks #goConnect').on(this.router.clicktype, this.goConnect);

        },  

        goConnect: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0);
            this.router.emitPageChangeEvent = true;
            this.router.navigate(url, {
                trigger: true,
                replace: false
            });
        }


    });

    return view;
});