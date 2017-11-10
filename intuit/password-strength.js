if (typeof(intuit) === 'undefined' || !intuit) { intuit = {}; }
if (!intuit.ius) { intuit.ius = {}; }

intuit.ius.passwordMeter = function ($){
	/* top 30 most common password we should reject */
	var commonPwd = ['123456','password','12345678','dragon','qwerty','696969',
	                 'mustang','letmein','baseball','master','michael','football',
	                 'shadow','monkey','abc123','jordan','harley','soccer',
	                 'ranger','iwantu','jennifer','hunter','batman','trustno1',
	                 'thomas','tigger','robert','access','buster','1234567'];
	
	/* baselineStrength is calculated as P=120 days expire * 10 tries per day/ 36^6 */
	var baselineStrength = 0.000000551272389597340062208222,
		strongStrength = 5.496012731080276e-12; // password space of 62^8
		baselineEntropy = 2.5,
		passwordChangeRate = 120, // days
		passwordTriesPerDay = 10; // tries per day
	
	
	var log2ofX = function(x) {
		return Math.log(x) / Math.LN2;
	};
	
	var calculateEntropy = function(pwd) {
		var ent = 0;
		var ccount = [{character:"newline", count:1}];
		var pwdChars = pwd.split('');
		var totalc = pwd.length + 1;
		var prob = [];
		
		for(var i = 0; i < pwdChars.length; i++) {
			var charFound = false;
			for(var j = 0; j < ccount.length; j++) {
				if(ccount[j].character === pwdChars[i]) {
					charFound = true;
					ccount[j].count ++;
					break;
				}
			}
			
			if(!charFound) {
				ccount.push({character: pwdChars[i], count: 1});	
			}
		}
		
		for(var i = 0; i < ccount.length; i++) {
			var prob = ccount[i].count / totalc;
			ent += prob * log2ofX(1 / prob);
		}
		
		return ent;		
	};
	
	var isCommonPassword = function(pwd) {
		var pwdWithNoDigits = pwd.replace(/[0-9]/g, '').toLowerCase();
		
		for(var i = 0, j = commonPwd.length; i < j; i++) {
			var common = commonPwd[i];
			if(pwdWithNoDigits === common) {
				return true;
			}
			
			/* this is to check password abc12345 will get compared to abc123 and returns true for common password */
			if(common.match(/[0-9]/g) && pwd.indexOf(common) !== -1) {
				var result = pwd.replace(common, '');
				if(result.replace(/[0-9]/g, '') === '') {
					return true;
				}
			}
			
		}
		return false;
	};
	
	var getPasswordStrength = function(pwd) {		
		var alphabetsize = 0, passwordSpace;
		var escapedPwd = escape(pwd); // to support globalization
		if(escapedPwd.match(/[a-z]/)) { alphabetsize += 26; } // lower case
		if(escapedPwd.match(/[A-Z]/)) { alphabetsize += 26; } // upper case
		if(escapedPwd.match(/\d+/)) { alphabetsize += 10; } // digit
		if(escapedPwd.match(/[!@#$%^&*()+-.,=_`~]/)) { alphabetsize += 19; } // common special character
		if(escapedPwd.match(/[:;"'<>?{|}\[\]\\\/]/)) {alphabetsize += 15; }  // more special character
		
		passwordSpace = Math.pow(alphabetsize, escapedPwd.length);
		return (passwordChangeRate * passwordTriesPerDay / passwordSpace);
	};
	
	var getOverallStrength = function(pwd, username) {
		var strength = getPasswordStrength(pwd);
		var entropy = calculateEntropy(pwd);
		var common = isCommonPassword(pwd);
		
		// password cannot be part of username and username cannot be part of password
		// password intuit01 not valid if username is intuit01@intuit.com
		// password intuit01 not valid if username is intuit
		if(username && pwd.length >= 6 && (username.indexOf(pwd) != -1 || pwd.indexOf(username) != -1) ) {
			return 'bad-contains';
		}
		
		// too weak (smaller the strength the better)
		if(strength > 0.09 || entropy < baselineEntropy 
		   || common || pwd.match(/ +/) !== null || pwd.length < 6) {
			return 'bad';
		} else if (strength <= 0.09 && strength > baselineStrength ) {
			return 'weak';
		} else if(strength <= baselineStrength && strength > strongStrength) {
			return 'medium';
		} else if(strength <= strongStrength) {
			return 'strong';
		}
	};
	
	var getIndicatorId = function (elem) {
		var elemId = $(elem).attr('id') || "";
		return elemId + "_pwdStrengthIndicator";
	};

	var buildIndicator = function (elem) {
		var indicatorId = getIndicatorId(elem) ;
		var outerDiv = 
			$('<div aria-live="polite"></div>').attr( 'id', indicatorId)
				.hide()
				.append(
					$("<span></span>").addClass('indicator_text')
					.css({
						display : "inline-block",
						margin : "5px 0 0 0"
					})
				)
				.append(				
				 	$('<div></div>').attr('id', indicatorId+"_progressBar")
					.css({
						margin : "2px 0",
						height : "10px",
						width : $(elem).outerWidth() + "px",
						border : "#CCCCCC 1px solid"
					})					
					.append(
						$('<div><span class="accessible"></span></div>').addClass('progressBar_fill').css({
							height : "10px",
							border : "#ffffff 0px none"
						})
					)
				);
		return outerDiv.clone().wrap('<p>').parent().html();
	};
	
	
	$.fn.ius_passwordStrength = function(options) {
		var opts = $.extend({}, $.fn.ius_passwordStrength.defaults, options);
		
		return this.filter('input[type=password]').each(function() {		
			$this = $(this);
			$this.after( buildIndicator(this) );
		
			$this.keyup(function() {
				var elem = $(this), 
					indicator = $( "#"+getIndicatorId(this) ), 
					progressBar = indicator.find("div.progressBar_fill"),
					progressText = indicator.find("span.indicator_text"),
					accessibleText = indicator.find("span.accessible"),
					pwd = elem.val();
			
				var username = null;
				if(opts.usernameInputEl && opts.usernameInputEl.val()) {
					username = opts.usernameInputEl.val();
				}
				
				var strength = getOverallStrength(pwd, username);	
				
				if(pwd.length > 0) {
					switch(strength) {
						case 'bad-contains':
							progressBar.css({background : opts.bad.color, width:opts.bad.barLength + "%"});
							progressText.text('Password cannot be part of the user ID and vice versa.');
							accessibleText.text('Password cannot be part of the user ID and vice versa.');
							elem.attr('data-password-strength', 'bad');
							break;
						case 'bad':
							progressBar.css({background : opts.bad.color, width:opts.bad.barLength + "%"});
							progressText.text('Keep going. Your password is too weak.');
							accessibleText.text('This password is too weak');
							elem.attr('data-password-strength', 'bad');
							break;
						case 'weak':
							progressBar.css({ background : opts.weak.color, width : opts.weak.barLength + "%" });
							progressText.text('Your password is fair.');
							accessibleText.text('This password is acceptable, but weak.');
							elem.attr('data-password-strength', 'weak');
							break;
						case 'medium':
							progressBar.css({ background : opts.medium.color, width: opts.medium.barLength + "%" });
							progressText.text('Your password is good.');
							accessibleText.text('This password is acceptable, but could be stronger.');
							elem.attr('data-password-strength', 'medium');
							break;
						case 'strong':
							progressBar.css({ background : opts.strong.color, width : opts.strong.barLength + "%" });
							progressText.text('Your password is excellent.');
							accessibleText.text('This is a strong password.');
							elem.attr('data-password-strength', 'strong');
							break;					
					}
					
					indicator.show();
				} else {
					indicator.hide();
				}
		
			});				
		});		
	};
	
	$.fn.ius_passwordStrength.getStrength = function(pwd, username) {
		return getOverallStrength(pwd, username);
	};
	
	$.fn.ius_passwordStrength.defaults = {
		strong : { color: '#228B22', barLength: 100 },
    	medium : { color: '#FFD700', barLength: 75 },
    	weak : { color : '#FF8C30', barLength: 50 },
    	bad: { color : '#DC143C', barLength: 20 }
	}
};

if(intuit.ius.jQuery) {
	intuit.ius.passwordMeter(intuit.ius.jQuery);
} else if(window.jQuery){
	intuit.ius.passwordMeter(window.jQuery);
}
