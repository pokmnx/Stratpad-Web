define(['Config', 'sprintf'],

function(config) {
	var Helper = {

		fixImages: function(content) {
			// look for img tags, prepend "images/" to the value of the src attribute
			var s = "";
			var startIdx = 0;
			var re = new RegExp('<img.+src="([^"]+)" ?/>', "igm");
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
			// that need to become 

		},

	};

	return Helper;

});