define(['PageStructure', 'backbone'],

function(pageStructure) {

    var sliderView = Backbone.View.extend({

        el: '#pageSlider',

        contentPager: $('#contentPager aside i'),

        initialize: function(router) {
            // needs to be bound before we start assigning properties (if we want to access below)
            _.bindAll(this, "goPage", "showPageNumber", "hidePageNumber", "attachHeaderPager", "updatePageNumber");

            this.router = router;

            var $el = $(this.el);

            // while you are moving the handle back and forth
            $el.on("slide", this.showPageNumber);

            // just when you first tap on the handle
            $el.on("slidestart", this.showPageNumber);

            // when you let go of the handle
            $el.on("slidestop", this.hidePageNumber);

        },

        // go to the page indicated by the slider
        goPage: function(e, ui) {
            console.debug("goPage");
            var value = ui ? ui.value : $(this.el).slider("option", "value");
            var ct = pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter) - 1;
            var page = Math.round(ct * value / 100) + 1;

            this.router.showStratPage(this.router.section, this.router.chapter, page - 1, true);

            // get rid of the timer which will switch the page
            clearTimeout(this.timer);
        },

        attachHeaderPager: function() {
            // attach the headerPager to the page content
            $('<div id="headerPager"></div>').insertBefore('#pageContent header hgroup h1');
        },

        // hide only the contentPager
        hidePageNumber: function(e, ui) {
            $('#contentPager').removeClass('paging').hide();
        },

        // show the title corresponding to the slider position; only updates contentPager
        showPageNumber: function(e, ui) {
            console.debug("showPageNumber");
            var sliderVal = ui.value || 0;
            var ct = pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter) - 1;
            var pageNum = Math.round(ct * sliderVal / 100) + 1;
            var ele = $(this.contentPager);
            $('#contentPager').removeClass().addClass('paging').show();
            ele.text(sprintf('Page %s of %s', pageNum, ct + 1));

            // if you pause on a page, we will switch to it for you
            clearTimeout(this.timer);
            this.timer = setTimeout(this.goPage, 500);
        },

        // 0-based pageNum - coming from other methods of navigation; updates both pagers
        updatePageNumber: function(pageNum, pageCount) {
            console.trace("updatePageNumber");

            var pageCount = pageCount || pageStructure.getNumberOfPagesInChapter(this.router.section, this.router.chapter);
            
            // between 0 and 100
            var position = Math.round(pageNum / (pageCount-1) * 100);

			if(isNaN(position))
				position = 0;

            // temporarily turn this listener off so that we don't keep hitting this.goPage hundreds of times
            var $el = $(this.el);
            $el.off("slidechange", this.goPage);
            $el.slider("value", position);
            $el.on("slidechange", this.goPage);

            // adjust page slider
            if (pageCount > 1) {
                $el.slider('enable').css('opacity', '1');
            } else {
                $el.slider('disable').css('opacity', '0.3');
            }

            // show the modal
            var $ele = $(this.contentPager);
            $ele.show();
            $ele.text(sprintf('Page %s of %s', pageNum + 1, pageCount));

            // show the page in the top right
            $ele = $('#headerPager');
            $ele.text(sprintf('Page %s of %s', pageNum + 1, pageCount));            
        }

    });

    return sliderView;
});