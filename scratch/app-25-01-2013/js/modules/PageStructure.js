define(function () {

    return {

    	getPageTree: function() {
    		if(!this.pageTree) {
    			this.pageTree = [
    				[
    					['welcome01.htm', 'welcome02.htm', 'welcome03.htm', ],
    					['onStratPad01.htm', 'onStratPad02.htm', 'onStratPad03.htm', 'onStratPad04.htm', 'onStratPad05.htm', ],
    					['onStrategy01.htm', 'onStrategy02.htm', 'onStrategy03.htm', 'onStrategy04.htm', 'onStrategy05.htm', 'onStrategy06.htm', 'onStrategy07.htm', 'onStrategy08.htm', 'onStrategy09.htm', 'onStrategy10.htm', 'onStrategy11.htm', 'onStrategy12.htm', 'onStrategy13.htm', 'onStrategy14.htm', 'onStrategy15.htm', 'onStrategy16.htm', 'onStrategy17.htm', 'onStrategy18.htm', 'onStrategy19.htm', 'onStrategy20.htm', 'onStrategy21.htm', 'onStrategy22.htm', 'onStrategy23.htm', 'onStrategy24.htm', 'onStrategy25.htm', 'onStrategy26.htm', 'onStrategy27.htm', 'onStrategy28.htm', ],
    					['toolkit01.htm', 'toolkit02.htm', 'toolkit03_5.htm', 'toolkit03.htm', 'toolkit04.htm', 'toolkit05.htm', 'toolkit06.htm', 'toolkit07.htm', 'toolkit08.htm', 'toolkit09.htm', 'toolkit10.htm', 'toolkit11.htm', 'toolkit12.htm', 'toolkit13.htm', 'toolkit14.htm', 'toolkit15.htm', 'toolkit16.htm', 'toolkit17.htm', 'toolkit18.htm', 'toolkit19.htm', 'toolkit20.htm', ]
    				],
    				// [],
    				// [],
    				// [],
    				];
    		};
    		return this.pageTree;
    	},

        getPageMap: function() {
        	// {"000,000,000":"welcome01.htm", "000,000,001":"welcome02.htm", ...}
        	// ie 0-based section,chapter,page:filename 
        	if (!this.pageMap) {
        		pageTree = this.getPageTree();
				this.pageMap = {};
				for (var i = 0; i < pageTree.length; i++) {
					var section = pageTree[i];
					for (var j = 0; j < section.length; j++) {
						var chapter = section[j];
						for (var k = 0; k < chapter.length; k++) {
							var page = chapter[k];
							this.pageMap[this.key(i, j, k)] = page;
						}
					}
				}
        	}
        	return this.pageMap;
        },

		zfill: function(number, size) {
			return (Math.pow(10,size) + number*1 + '').substr(1);
		},

		key: function(s, c, p) {
			// zero-pad the numbers so that we can sort the keys effectively
			return sprintf('%s,%s,%s', this.zfill(s,3), this.zfill(c,3), this.zfill(p,3));
		},

		navForPageName: function(pageName) {
			var pageMap = this.getPageMap();
			var keys = _.keys(pageMap);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var p = pageMap[key];
				if (p == pageName) {
					var parts = key.split(',');
					var nav = sprintf('/#nav/%s/%s/%s', parts[0]*1, parts[1]*1, parts[2]*1);
					return nav;
				};
			};
		},

		getFilename: function(section, chapter, page) {
			var pageMap = this.getPageMap();
			var key = this.key(section, chapter, page);
			return pageMap[key];
		},

		getNumberOfPagesInChapter: function(section, chapter) {
			var pageTree = this.getPageTree();
			var pages = pageTree[section][chapter];
			return pages.length; 
		}

    };
});