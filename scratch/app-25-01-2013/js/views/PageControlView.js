define([	
		'views/PageSliderView', 'backbone'
	],

    function(PageSliderView) {
	   
		var pcView = Backbone.View.extend({

            el: $('#pageControl'),
            
			initialize : function(router) {
                this.router = router;
                this.pageSliderView = new PageSliderView(router);
                this.pageSliderView.$el.slider({'animate': 'fast'});
			},
            
            events : {
                'click #first' : 'goFirst',
                'click #last' : 'goLast',
                'click #next' : 'goNext',
                'click #prev' : 'goPrev',
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
            },

		});

		return pcView;
	}
);