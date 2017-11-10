define(['modules/Sections', 'Config', 'backbone', 'sprintf'],

function(sections, config) {
	var Router = Backbone.Router.extend({

		routes: {
			"": "showPage",
			"help": "help",
			"nav/:section/:chapter/:page": "showPage" // /#nav/1/1/3
		},

		initialize: function() {

			// rejig sections so that it is linear
			this.pages = {};
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				for (var j = 0; j < section.length; j++) {
					var chapter = section[j];
					for (var k = 0; k < chapter.length; k++) {
						var page = chapter[k];
						this.pages[this.key(i, j, k)] = page;
					};
				};
			};

			// 001,001,001:welcome01.htm
			// 001,001,002:welcome02.htm
			// 001,001,003:welcome03.htm
			// 001,002,001:onStratPad01.htm

		},

		help: function() {

		},

		showPage: function(s, c, p) {
			// load up page structure

			// figure out an ajax URL to load the content
			this.sanitize(s, c, p);

			var filename = this.pages[this.key(this.section, this.chapter, this.page)];

			var url = sprintf('text!../static/%s.lproj/%s!strip', config.lang, filename);

			// load up a page
			require([url, "HtmlHelper"], function(content, helper) {
				var html = helper.fixImages(content);
				html = helper.fixLinks(html);
				$('#pageContent').html(html);
			});
		},

		nextPage: function() {

			var curPageKey = this.key(this.section, this.chapter, this.page);
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

			// figure out the new hash route
			var url = sprintf('nav/%s/%s/%s', this.section, this.chapter, this.page);

			// update the address bar and the history
			this.navigate(url, {
				trigger: false,
				replace: false
			});

		},

		prevPage: function() {
			var curPageKey = this.key(this.section, this.chapter, this.page);
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

			var url = sprintf('nav/%s/%s/%s', this.section, this.chapter, this.page);

			this.navigate(url, {
				trigger: false,
				replace: false
			});

		},

		firstPage: function() {
			this.showPage(this.section, this.chapter, 0);

			var url = sprintf('nav/%s/%s/%s', this.section, this.chapter, this.page);

			this.navigate(url, {
				trigger: false,
				replace: false
			});
		},

		lastPage: function() {
			var pages = sections[this.section][this.chapter];
			this.showPage(this.section, this.chapter, pages.length-1);

			var url = sprintf('nav/%s/%s/%s', this.section, this.chapter, this.page);

			this.navigate(url, {
				trigger: false,
				replace: false
			});
		},

		zfill: function(number, size) {
			return (Math.pow(10,size) + number + '').substr(1);
		},

		key: function(s, c, p) {
			// zero-pad the numbers so that we can sort the keys effectively
			return sprintf('%s,%s,%s', this.zfill(s,3), this.zfill(c,3), this.zfill(p,3));
		},

		sanitize: function(s, c, p) {
			// make sure s,c,p are within limits and then assign to properties
			// in other words after this, s, c, and p will always resolve to a page that exists

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
		},		

	});

	return Router;
});