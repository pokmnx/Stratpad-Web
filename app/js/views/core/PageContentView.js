// the content of a page
define(function() {

    var ContentView = Class.extend({

        el: '#pageContent',

        initialize: function(router) {
            _.bindAll(this, "swipe", "selection");
            this.router = router;

           // $(this.el).hammer({}).bind('swipe', this.swipe);
        },

        swipe: function(e) {

            // if we have a selection, don't change the page
            var sel = this.selection();
            if(sel) {
                return;
            }

            // note gets mixed up with text selection
            var isLeft = e.direction == 'left';
            var isRight = e.direction == 'right';

            // on touch, swipes are generally reversed
            if(isRight) {
                // $('#contentPager').removeClass('left paging').addClass('swiping right').show();
                this.router.prevPage();
            } else if(isLeft) {
                // $('#contentPager').removeClass('right paging').addClass('swiping left').show();
                this.router.nextPage();
            }

        },

        selection: function() {
            var html = "";
            if(typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if(sel.rangeCount) {
                    var container = document.createElement("div");
                    for(var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if(typeof document.selection != "undefined") {
                if(document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        }
    });

    return ContentView;
});