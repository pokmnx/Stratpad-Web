// the bottom bar containing next/prev/slider
define(['views/core/PageSliderView', 'backbone'],

    function(PageSliderView) {
	   
		var pcView = Backbone.View.extend({

            el: '#pageControl',
            
			initialize : function(router) {

                _.bindAll(this, "goNext", "goPrev", "goFirst", "goLast");

                this.router = router;
                this.pageSliderView = new PageSliderView(router);
                this.pageSliderView.$el.slider({'animate': 'fast'});

                // move the click handler for this nav up a node so we can hijack the click if we need in other areas and prevent these from executing.

                $('#contentWrapper')
                    .on(this.router.clicktype, '#first', this.goFirst)
                    .on(this.router.clicktype, '#last', this.goLast)
                    .on(this.router.clicktype, '#next', this.goNext)
                    .on(this.router.clicktype, '#prev', this.goPrev);

			},

            goNext: function() {
                this.router.nextPage();
            },

            goPrev: function() {
                this.router.prevPage();
            },

            goFirst: function() {
                this.router.firstPage();
            },

            goLast: function() {
                this.router.lastPage();
            }

		});

		return pcView;
	}
);