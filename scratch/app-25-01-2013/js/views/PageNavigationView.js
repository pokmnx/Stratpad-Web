// this is the sidebar

define(['PageStructure', 'backbone'],

function(pageStructure) {

    var pnView = Backbone.View.extend({

        el: $('#pageNavigation'),

        initialize: function(router) {
            this.router = router;
            _.bindAll(this, 'goPage');

            // hook up headers
            $(this.el).find('h6').click(function() {
                var ele = $(this);
                ele.next('ul').toggle("blind");
                var arrow = ele.find('i');
                arrow.toggleClass('icon-arrow-down-3');
                arrow.toggleClass('icon-arrow-right-3')
            });        
        },

        events: {
            // can be really difficult to use any sort of complicated selectors here
            // note it has to be a descendant of this.el
            'click li.navItem': 'goPage',
        },

        goPage: function(e) {
            console.log("event", e.target.attributes['data-key']);

            var dataKey = e.target.attributes['data-key'].value;
            var pageMap = pageStructure.getPageMap();
            var parts = dataKey.split(',');

            this.router.showPage(parts[0], parts[1], parts[2]);

            // todo: do something about the sidebar ele's with no page

        }

    });

    return pnView;
});