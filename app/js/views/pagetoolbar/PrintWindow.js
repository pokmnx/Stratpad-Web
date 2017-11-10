define(['BaseDialog', 'Config', 'EditionManager', 'UpgradeMenuView'],

    function(BaseDialog, config, EditionManager, UpgradeMenuView) {

    var PrintWindow = BaseDialog.extend({

		initialize: function(router) {
			BaseDialog.prototype.initialize.call(this, router);			
			_.bindAll(this, "printCurrentReport", "checkPdfComplete");
		},

		checkPdfComplete: function() {
			// won't work on localhost or staging either because of CORS (should work on cloud)
			try {
				// user may have closed it prematurely
				if (this.printWindow.closed) {
					this.printWindow = null;
					return;
				};

				// add some loading text to the window
				var $printBody = $(this.printWindow.document.body);
				if ( $printBody.is(':empty') || $printBody.is("[loading]")) {
					console.debug('body is empty - waiting');
					$printBody.attr('loading', 'true');

					var compiledTemplate = Handlebars.templates['dialogs/PrintPopup'],
						markup = compiledTemplate({}); // xss safe

					$printBody.html(markup);

					setTimeout(this.checkPdfComplete.bind(this), 500);
				}
				else {
					// not empty as soon as we put something there, but now loading attr will have disappeared
					this.printWindow.print();
				}

			} 
			catch (err) {
				// silent - no big deal
				// in fact, in FF, once the PDF loads we will no longer get access to it, and thus get an error
				// same in chrome - only possibility would be to install the script first
				console.warn(err);

				// still can't print either
				// this.printWindow.print();
			}

		},

		printCurrentReport: function(e){

			e.preventDefault();
			e.stopPropagation();

			var isPrintEnabled = EditionManager.isFeatureEnabled(EditionManager.FeaturePrint);
			if(!isPrintEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeaturePrint);				
			}
			else {

				// markup for conversion to pdf
				var self = this;
				var opts = this.defaultOpts({
					extension: 'pdf',
					postUrl: sprintf('%s/pdfService', config.serverBaseUrl)
				});
				var markup = this.reportMarkup(opts);				

				// set up a form so we can submit some html
				var $pdfForm = $('<form></form>').attr({'action': opts.postUrl, 'method': 'POST'});
				$('<input type="hidden" name="content">').val(markup).appendTo($pdfForm);
				$('<input type="hidden" name="inline">').val('true').appendTo($pdfForm);
				$('<input type="hidden" name="filename">').val(encodeURIComponent(opts.fileName)).appendTo($pdfForm);
				$('<input type="hidden" name="dateModified">').val(opts.stratFile.get('modificationDate')).appendTo($pdfForm);

				$pdfForm.on('submit', function() {
					self.printWindow = window.open('','Print_Window','toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=620,left=100,top=100');
					self.printWindow.focus();
				    this.target = 'Print_Window';
				});

				$pdfForm.appendTo('body').submit();
				$pdfForm.remove();

				// bring up print menu once pdf is loaded
				setTimeout(self.checkPdfComplete.bind(self), 500);

			}

		}

    });

    return PrintWindow;
});