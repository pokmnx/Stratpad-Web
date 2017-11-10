define(['BaseDialog', 'Config', 'UpgradeMenuView', "i18n!nls/Global.i18n", "i18n!nls/ExportDialog.i18n", 'Dictionary', 'EditionManager', 'blob', 'filesaver'],

    function(BaseDialog, config, UpgradeMenuView, gLocalizable, localizable, Dictionary, EditionManager) {

    var ExportDialog = BaseDialog.extend({

		initialize: function(router) {
			BaseDialog.prototype.initialize.call(this, router);
			_.bindAll(this, "_setActiveExportOption", "exportPdf", "showExportDialog", "exportStratFile");
			this.localizable = new Dictionary(gLocalizable, localizable);
		},

		_setActiveExportOption: function(e){

			var $this = $(e.currentTarget),
				$exportInfo = $('#exportFileInfo'),
				messageKey = sprintf('%s%s', $this.attr('data-fileType'), 'Message' ),
				disabledMessageKey = sprintf('%s%s', $this.attr('data-fileType'), 'Disabled' );

			// test if the clicked label has a disabled class and either disable that file type or set it as active. Provides messaging.

			if($this.is('.disabled')){
				$exportInfo.addClass('active').html(this.localizable.get(disabledMessageKey)); // xss safe
			} else {
				$('.exportOptionLabel').removeClass('active');
				$this.addClass('active');
				$exportInfo.addClass('active').html(this.localizable.get(messageKey)); // xss safe
			}

			// enable submit buttons
			$this.closest('.vex-content').find(".vex-dialog-buttons input").prop('disabled', false);

		},

		exportPdf: function(e) {

			var isPdfExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportPDF);
			if(!isPdfExportEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportPDF);				
			} else {

				var opts = this.defaultOpts({
					extension: 'pdf',
					postUrl: sprintf('%s/pdfService', config.serverBaseUrl)
				});
				var markup = this.reportMarkup(opts);

				// set up a form so we can submit some html
				var $pdfForm = $('<form></form>').attr({'action': opts.postUrl, 'method': 'POST'});
				$('<input type="hidden" name="content">').val(markup).appendTo($pdfForm);
				$('<input type="hidden" name="inline">').val('false').appendTo($pdfForm);
				$('<input type="hidden" name="filename">').val(encodeURIComponent(opts.fileName)).appendTo($pdfForm);
				$('<input type="hidden" name="dateModified">').val(opts.stratFile.get('modificationDate')).appendTo($pdfForm);

				$pdfForm.appendTo('body').submit();
				$pdfForm.remove();

			}

		},

		exportCSV: function(e) {

			var isCsvExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportCSV);
			if(!isCsvExportEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportCSV);				
			} else {
				var opts = this.defaultOpts({extension: 'csv'});
				var content = this.router.report.contentForCsv();

				var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
				saveAs(blob, opts.fileName);
			}

		},

		exportDocx: function(e) {
			// only available on the summary bizplan page
			var isDocxExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportDocx);
			if(!isDocxExportEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportDocx);				
			} else {

				var postUrl = sprintf('%s/summarybizplan', config.serverBaseUrl);
				var opts = this.defaultOpts({extension: 'docx'});
				var json = this.jsonForSummaryBizPlan(opts);

				// no html for docx
				json.text_a = $.stratweb.stripHTML(json.text_a);

				// set up a form so we can submit some html
				var $docxForm = $('<form></form>').attr({'action': postUrl, 'method': 'POST'});
				$('<input type="hidden" name="content">').val(JSON.stringify(json)).appendTo($docxForm);
				$('<input type="hidden" name="inline">').val('false').appendTo($docxForm);
				$('<input type="hidden" name="filename">').val(opts.fileName).appendTo($docxForm);
				$('<input type="hidden" name="dateModified">').val(opts.stratFile.get('modificationDate')).appendTo($docxForm);
				$docxForm.appendTo('body').submit();
				$docxForm.remove();
			}

		},

		exportStratFile: function(e) {

			// available anywhere!! so don't rely on reportName, etc

			e.preventDefault();
			e.stopPropagation();

			var isStratFileExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportStratFile);
			if(!isStratFileExportEnabled){

				console.debug("StratFile Export not allowed!");

            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportStratFile);				

			} else {

				console.debug("File export");

				var opts = this.defaultOpts({extension: 'stratfile', reportName: 'N/A', subcontext: 'N/A'});
				var downloadUrl = config.serverBaseUrl + "/stratfiles/" + opts.stratFile.get('id');
				opts.fileName = sprintf('%s-%s.%s', opts.normalizedStratFileName, moment().format('YYYYMMDD'), opts.extension);

				var $form = $('<form></form>').attr({'action': downloadUrl, 'method': 'GET'});
				$('<input type="hidden" name="stratfile">').val(true).appendTo($form); // same as ACCEPT: application/stratfile; note that json is the default
				$('<input type="hidden" name="filename">').val(opts.fileName).appendTo($form);
				$form.appendTo('body').submit();
				$form.remove();

			}
		},

		showExportDialog: function(e){

			e.preventDefault();
			e.stopPropagation();

			var compiledTemplate = Handlebars.templates['dialogs/ExportDialog'],
				html = compiledTemplate(this.localizable.all()),
				self = this;				

			vex
				.dialog.open({
					className : 'vex-theme-plain vex-export',
					message   : this.localizable.get('exportDialog_title'),
					input     : html,
					buttons   : [
						{
							text     : self.localizable.get('exportDialog_submit'),
							type     : 'button',
							className: 'vex-dialog-button-primary',
							click    : function ($vexContent, event) {
								var sel = $('input[name=exportSelection]:checked', '#exportDialog').val();
								if (sel == 'csv') {
									self.exportCSV(event);
									return vex.close($vexContent.data().vex.id);
								}
								else if (sel == 'pdf') {
									self.exportPdf(event);
									return vex.close($vexContent.data().vex.id);									
								}
								else if (sel == 'docx') {
									self.exportDocx(event);
									return vex.close($vexContent.data().vex.id);									
								}
								else if (sel == 'stratfile') {
									self.exportStratFile(event);
									return vex.close($vexContent.data().vex.id);
								}
							}
						},
						{
							text     : self.localizable.get('btn_cancel'),
							type     : 'button',
							className: 'vex-dialog-button-secondary',
							click    : function ($vexContent, event) {
								return vex.close($vexContent.data().vex.id);
							}
						}
					],
					afterClose: function () {

					}
				})
				.bind('vexOpen', function (e, v) {

					var $dialog = v.$vexContent.find('#exportDialog');
					$dialog
						.on(self.router.clicktype, '.exportOptionLabel', self._setActiveExportOption);

					// loop over the file type labels and enable or disable them with a class

					$dialog
						.find('.exportOptionLabel')
						.each(function () {

							var $this = $(this);

							if(self.router.report && !self.router.report.isExportEnabled($this.attr('data-fileType')))
								$this.addClass('disabled').find('input').prop('disabled', true);

						});

					v.$vexContent.find(".vex-dialog-button-primary").prop('disabled', true);


				});

		}

    });

    return ExportDialog;
});