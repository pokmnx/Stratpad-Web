define(['Config', 'PageStructure', 'sprintf'],

function(config, pageStructure) {
	var Helper = {

		fixImages: function(content) {
			// look for img tags, prepend "images/" to the value of the src attribute
			var s = "";
			var startIdx = 0;
			var re = new RegExp('<img.+src="([^"]+)"[^/]*/>', "igm");
			while(m = re.exec(content)) {
				s += content.substring(startIdx, m.index);

				var imgTag = m[0].replace(m[1], sprintf("images/reference/%s.lproj/", config.lang) + m[1]);
				s += imgTag;
				startIdx = m.index + m[0].length;
			}
			s += content.substr(startIdx);

			return s;

		},

		fixLinks: function(content) {
			// these were all links to other parts of the reference
			// all in each TOC
			// they have a custom url scheme. eg. toolkit://toolkit02.htm
			// that need to become /#nav/0/3/1, for instance

			var s = "";
			var startIdx = 0;
			var re = new RegExp('<a +href="[^:]+://([^"]+)" ?>', "igm");
			while(m = re.exec(content)) {
				s += content.substring(startIdx, m.index);

				var pageName = m[1];
				var replacement = sprintf("<a href='%s'>", pageStructure.navForPageName(pageName));

				s += replacement;
				startIdx = m.index + m[0].length;
			}
			s += content.substr(startIdx);

			return s;
		},

	};

	return Helper;

});