define([	
		'backbone'
	],

    function() {
	   
		var pcView = Backbone.View.extend({

            el: $('#pageControl'),
            
			initialize : function(router) {
                this.router = router;
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