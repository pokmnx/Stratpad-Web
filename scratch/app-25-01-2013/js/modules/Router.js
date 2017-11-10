define(['Config', 'PageStructure', 'PageNavigationView', 'PageControlView', 'backbone', 'sprintf', 'spinjs', 'HtmlHelper'],

function(config, pageStructure, PageNavigationView, PageControlView) {
	var Router = Backbone.Router.extend({

		routes: {
			"": "showPage",
			"help": "help",
			"nav/:section/:chapter/:page": "showPage" // /#nav/1/1/3
		},

		initialize: function() {
			_.bindAll(this, "help", "showPage", "nextPage", "prevPage", "firstPage", "lastPage", "sanitize");
			this.pages = pageStructure.getPageMap();

			// hook up the next/prev
			this.pageControlView = new PageControlView(this);

			// the sidebar
			this.pageNavigationView = new PageNavigationView(this);

		},

		help: function() {

		},

		showPage: function(s, c, p) {
			
			$pageContent = $('#pageContent');
			
			// start loading spinner
			
			$pageContent.spin({lines:11,length:19,width:9,radius:24,corners:1.0,rotate:0,trail:60,speed:1.0,shadow:'off',hwaccel:'on'});
			
			// load up page structure

			// figure out an ajax URL to load the content
			this.sanitize(s, c, p);
			var filename = pageStructure.getFilename(this.section, this.chapter, this.page);
			var url = sprintf('text!../static/%s.lproj/%s!strip', config.lang, filename);

			// load up a page
			require([url, "HtmlHelper"], function(content, helper) {
				var html = helper.fixImages(content);
				html = helper.fixLinks(html);
				$pageContent.html(html).spin(false).niceScroll({bouncescroll:true, horizrailenabled:false, cursorwidth:'8px', cursorcolor:'#999', cursoropacitymin:'0.3'});			
			});

			// figure out the new hash route
			var url = sprintf('nav/%s/%s/%s', this.section, this.chapter, this.page);

			// update the address bar and the history
			this.navigate(url, {
				trigger: false,
				replace: false
			});

            // update the sidebar
            var ele = $('#pageNavigation').find('span[class~="active"]');
            ele.removeClass('active');
            var selected = $('#pageNavigation').find(sprintf('span[data-key^="%s,%s"]', this.section, this.chapter));
            selected.addClass('active');

            // update the pageSlider
            this.pageControlView.pageSliderView.update(this.page);
		},

		nextPage: function() {

			var curPageKey = pageStructure.key(this.section, this.chapter, this.page);
			var keys = Object.keys(this.pages).sort();
			var idx = _.indexOf(keys, curPageKey, true);

			var nextIdx = idx + 1;
			if (nextIdx >= keys.length) {
				nextIdx = 0;
			}

			var nextPageKey = keys[nextIdx];
			var parts = nextPageKey.split(',');

			// show the new page
			this.showPage(parts[0], parts[1], parts[2]);

		},

		prevPage: function() {
			var curPageKey = pageStructure.key(this.section, this.chapter, this.page);
			var keys = Object.keys(this.pages).sort();
			var idx = _.indexOf(keys, curPageKey, true);

			var prevIdx = idx - 1;
			if (prevIdx < 0) {
				prevIdx = keys.length-1;
			}

			var prevPageKey = keys[prevIdx];
			var parts = prevPageKey.split(',');

			// show the new page
			this.showPage(parts[0], parts[1], parts[2]);

		},

		firstPage: function() {
			this.showPage(this.section, this.chapter, 0);
		},

		lastPage: function() {
			var sections = pageStructure.getPageTree();
			var pages = sections[this.section][this.chapter];
			this.showPage(this.section, this.chapter, pages.length-1);
		},

		sanitize: function(s, c, p) {
			// make sure s,c,p are within limits and then assign to properties
			// in other words after this, s, c, and p will always resolve to a page that exists
			
			var sections = pageStructure.getPageTree();

			// don't allow 0's or nils, etc
			this.section = s ? s : 0;
			this.chapter = c ? c : 0;
			this.page = p ? p : 0;

			// confine to limits; 0-based for sections, chapters, pages
			this.section = Math.max(0, this.section); 
			this.section = Math.min(Object.keys(sections).length-1, this.section);
			var chapters = sections[this.section];

			this.chapter = Math.max(0, this.chapter);
			this.chapter = Math.min(Object.keys(chapters).length-1, this.chapter);
			var pages = chapters[this.chapter];

			this.page = Math.max(0, this.page);
			this.page = Math.min(pages.length-1, this.page);
		}		

	});

	return Router;
});