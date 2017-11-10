define([	
		'PageStructure', 'backbone'
	],

    function(pageStructure) {
	   
		var sliderView = Backbone.View.extend({

            el: $('#pageSlider'),

            displayEl: $('#pageSlider div'),
            
			initialize : function(router) {
                // needs to be bound before we start assigning properties (if we want to access below)
                _.bindAll(this, "goPage", "showTitle");

                this.router = router;

                var el = $(this.el);
                el.on( "slide", this.showTitle );
                el.on( "slidechange", this.goPage );
                el.on( "slidestart", this.showTitle );
			},
            
            goPage : function(e, ui) {
                var ct = pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter)-1;
                var page = Math.round(ct*ui.value/100)+1;

                this.router.showPage(this.router.section, this.router.chapter, page-1);

                var ele = $(this.displayEl);
                clearTimeout(this.timer);
                this.timer = setTimeout(function(){ele.fadeOut()}, 5000);

            },

            showTitle : function(e, ui) {
                var ct = pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter)-1;
                var page = Math.round(ct*ui.value/100)+1;
                var ele = $(this.displayEl)
                ele.show();
                ele.html(sprintf('Page %s', page));
            },

            // 0-based pageNum
            update: function(pageNum) {
                var ct = pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter)-1;
                var idx = Math.round(pageNum/ct*100);

                var el = $(this.el);
                el.off( "slidechange", this.goPage );
                $(this.el).slider("value", idx);
                el.on( "slidechange", this.goPage );

                var ele = $(this.displayEl);
                ele.show();
                ele.html(sprintf('Page %s', pageNum+1));
                clearTimeout(this.timer);
                this.timer=setTimeout(function(){ele.fadeOut()}, 5000);
            }

		});

		return sliderView;
	}
);