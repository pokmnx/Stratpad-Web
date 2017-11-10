define(['jquery'],
	function() {

		if (typeof String.prototype.endsWith !== 'function') {
		    String.prototype.endsWith = function(suffix) {
		        return this.indexOf(suffix, this.length - suffix.length) !== -1;
		    };
		}


		if ($.type($.stratweb) !== 'object') {
			$.stratweb = {};
		};

		// throw an error if a condition is false
		$.stratweb.assert = function (condition, message) {
		    if (!condition) {
		        message = message || "Assertion failed";
		        if (typeof Error !== "undefined") {
		            throw new Error(message);
		        }
		        throw message; // Fallback
		    }
		};

		// replaces html tags from s, except for the ones specified by excludeTags, using _.escape
		$.stratweb.escape = function(s, excludeTags) {
			var ret =_.escape(s);
			if (!_.isArray(excludeTags)) {
				return ret;
			};
			for (var i = 0; i < excludeTags.length; i++) {
				var tag = excludeTags[i];
				var pattern = sprintf('\&lt;(\/?%s)\&gt;', tag);
				var regex = new RegExp(pattern, 'gi');
				ret = ret.replace(regex, '<$1>');
			};
			return ret;
		};

        // save if we press return
		$.stratweb.returnField = function(e) {
	        var code = e.keyCode || e.which;
	        if(code == 13) {
	            $(e.target).blur();
	        }
	    };

	    // remove chars c from start or end of string s
		$.stratweb.strip = function(s, c) {
			if (s==undefined || c == undefined) return s;
			var regexp = new RegExp(c+'+$', 'i');
			var r = s.replace(regexp, "");
			var regexp = new RegExp('^'+c+'+', 'i');
			r = r.replace(regexp, "");
			return r;
		};

		$.stratweb.stripHTML = function(dirtyString) {
		  return $('<div>').append(dirtyString).text();
		};	

		$.stratweb.fullname = function(first, last) {
			if (_.isEmpty(first) && _.isEmpty(last)) {
				return '';
			} 
			else if (_.isEmpty(first)) {
				return last;
			}
			else if (_.isEmpty(last)) {
				return first;
			}
			else {
				return sprintf("%s %s", first, last);
			}
		};

		$.stratweb.firstname = function (str) {
	        if (str.indexOf(' ') === -1)
	            return str;
	        else
	            return str.substr(0, str.indexOf(' '));
	    };

		// ??
		$.fn.fix_radios = function() {
			function focus() {
				if (!this.checked) return;
				if (!this.was_checked) {
					$(this).change();
				}
			}

			function change(e) {
				if (this.was_checked) {
					e.stopImmediatePropagation();
					return;
				}
				$("input[name=" + this.name + "]").each(function() {
					this.was_checked = this.checked;
				});
			}
			return this.focus(focus).change(change);
		};

		// create unique id
		$.stratweb.generateUUID = function() {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
            return uuid;
        };

        // is string a number?
        $.stratweb.isNumber = function(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		};

		// capitalize first char of string
        $.stratweb.capitalize = function(string) {
        	if (!string || string.length == 0) { return string; };
		    return string.charAt(0).toUpperCase() + string.slice(1);
		};

		// a generic open window script
		$.stratweb.popUp = function(config){

			var url = config.url || '',
				winTitle = config.winTitle || 'StratPad',
				noPopUp = config.noPopUp || false,
				content = config.content || '',
				print = config.print || false,
				pdf = config.pdf || false,
				status = config.status || 'no',
				location = config.location || 'no',
				menubar = config.menubar || 'no',
				resizable = config.resizable || 'yes',
				toolbar = config.toolbar || 'no',
				scrollbars = config.scrollbars || 'yes',
				addressbar = config.addressbar || 'no',
				w = config.w || 800,
				h = config.h || 600;


			if (window.open) {

				var windowX = ($(window).width()/2)-(w/2),
					windowY = ($(window).height()/2)-(h/2),
					popUpSettings = 'status=' + status + ',menubar=' + menubar + ',resizable=' + resizable + ',toolbar=' + toolbar + ',scrollbars=' + scrollbars + ',addressbar=' + addressbar + ',location=' + location,
					popUpWindow = window.open(url, winTitle, 'width=' + w + ',height=' + h + ',top=' + windowY + ',left=' + windowX + ',' + popUpSettings + '');


				if(content)
					popUpWindow.document.write(content);

				if(print)
					popUpWindow.print();


			} else if(noPopUp) {
				alert(noPopUp);
			}
		};

		// true if string null, empty or white space
		$.stratweb.isBlank = function(string) {
            return string == undefined || string.trim() == "" || string == null;
        };

        // add new functions to $.stratweb ns
        $.stratweb.export = function(func, name) {
        	$.stratweb[name] = func;
        };

        // returns an object from which you can grab components of the url
        $.stratweb.parseUrl = function( url ) {
			var a = document.createElement('a');
			a.href = url;
			return a;
		};

		// takes a putative date string in YYYY-MM-DD format, used by all our date widgets, (but could be null, empty string, bad format) and returns
		//  a date formatted for sending to our server (or ''); 
		//  will use defaultFormattedDate (current date if null), if it can't parse date (eg xss injections)
		//  will return empty string, if it's an empty string, so that user can delete dates
		$.stratweb.formattedInterchangeDate = function (date, defaultFormattedDate) {
			if (defaultFormattedDate === undefined) {
				defaultFormattedDate = moment().format($.stratweb.dateFormats.in);
			};

			var isEmpty = (date === '');
			if (isEmpty) { return ''};

			var isValid = !$.stratweb.isBlank(date) && moment(date, 'YYYY-MM-DD').isValid();
			return isValid ? moment(date, 'YYYY-MM-DD').format($.stratweb.dateFormats.in) : defaultFormattedDate;
		};


		/*
		format 1:
		{
			"data": {
				"errors": [{
					"applicationError": "ACCESS_CONTROL_ENTRY_ALREADY_EXISTS",
					"message": "Access control entry already exists"
				}],
				"title": "Access control entry already exists"
			},
			"status": "fail"
		}

		format 2:
		{
			data {
				validations[{
					validationError
					field
					message
				}]
			}
			status
		}

		format 3:
		{
			"status": "fail",
			"data": {
				"title": "Simple error message",
				"code": 100
			}
		}		

		new:
		{
			errors: [{
				error: ACCESS_CONTROL_ENTRY_ALREADY_EXISTS
				field: null // if field != null then it is a ValidationError
				message: "Access control entry already exists"
			}]
			status
		}


		unify:
		{
			key: 'SOME_KEY_THAT_SHOULD_BE_LOCALIZABLE_AND_IDENTIFIES_THE_ERROR',
			fieldName: 'exists only if a validation error',
			message: 'a localized message from the server or doesn't exist
			isValidation: true if fieldName is not empty,
		}
		@param json - typically the response
		@param unknownkey - if we can't find errors, then in our universal format, this will be the value of 'key'
		@return - always some variation of the unify map (fieldName and message are optional)
		*/
		$.stratweb.firstError = function(json, unknownKey) {

			// universal format
			if ((json || {}).hasOwnProperty('errors')) {
				if (json.errors && json.errors.length) {
					return {
						key: json.errors[0].error,
						fieldName: json.errors[0].field,
						message: json.errors[0].message,
						isValidation: !$.stratweb.isBlank(this.fieldName)
					}
				}
				else {
					return {
						key: unknownKey,
						isValidation: false
					}						
				}

			}
			else {

				var isValidation = ((json || {}).data || {}).hasOwnProperty('validations');
				if (isValidation) {
					errors = ((json || {}).data || {}).validations;
					if (errors && errors.length) {
						return {
							key: errors[0].validationError,
							fieldName: errors[0].field,
							message: errors[0].message,
							isValidation: true
						}						
					}
					else {
						return {
							key: unknownKey,
							isValidation: false
						}						
					}
				}
				else {
					errors = ((json || {}).data || {}).errors;
					var title = ((json || {}).data || {}).title;
					if (errors && errors.length) {
						return {
							key: errors[0].applicationError,
							message: errors[0].message,
							isValidation: false
						}						
					}
					else if (!$.stratweb.isBlank(title)) {
						return {
							key: unknownKey,
							message: title,
							isValidation: false
						}												
					}
					else {
						return {
							key: unknownKey,
							isValidation: false,
						}						

					}
				}
			}
		}

	});



