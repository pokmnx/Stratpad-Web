define(['BaseDialog', 'Config', "i18n!nls/Global.i18n", "i18n!nls/EmailDialog.i18n", 'Dictionary', 'EditionManager', 'UpgradeMenuView'],

    function(BaseDialog, config, gLocalizable, localizable, Dictionary, EditionManager, UpgradeMenuView) {

    var EmailDialog = BaseDialog.extend({

		initialize: function(router) {
			BaseDialog.prototype.initialize.call(this, router);			
			_.bindAll(this, "_setActiveEmailOption", "_showEmailInputs", "_resetVex", "_spinVex", "_emailStratfile", "_addEmailFieldData", "_emailDocx", "showEmailDialog", "_emailPDF", '_emailCSV');
			this.localizable = new Dictionary(gLocalizable, localizable);
		},

		_setActiveEmailOption: function(e){

			var $this = $(e.currentTarget),
				$emailInfo = $('#emailFileInfo'),
				messageKey = sprintf('%s%s', $this.attr('data-fileType'), 'EmailMessage' ),
				disabledMessageKey = sprintf('%s%s', $this.attr('data-fileType'), 'EmailDisabled' );

			// test if the clicked label has a disabled class and either disable that file type or set it as active. Provides messaging.

			if($this.is('.disabled')){
				$emailInfo.addClass('active').html(this.localizable.get(disabledMessageKey)); // xss safe
			} else {
				$('.emailOptionLabel').removeClass('active');
				$this.addClass('active');
				$emailInfo.addClass('active').html(this.localizable.get(messageKey)); // xss safe
			}

			// enable submit button
			$this.closest('.vex-content').find(".vex-dialog-buttons input").prop('disabled', false);

		},

		_showEmailInputs: function(e){

			e.preventDefault();

			$('#emailOthers')
				.addClass('active');

			$('#mailtoOthersTrigger')
				.hide();

			$('#emailRecepients')
				.focus();

			var sfm = this.router.stratFileManager,
				stratFile = sfm.stratFileCollection.get(sfm.stratFileId),
				stratFileName = stratFile.get('name'),
				reportName = this.router.report.localizedReportName();

			var sel = $('input[name=emailSelection]:checked', '#emailDialog').val();
			var subject = sprintf(this.localizable.get('emailDialog_defaultSubjectValue'), stratFileName, reportName);
			var message = this.localizable.get('emailDialog_stratFileMessageValue');

			if (sel == 'stratfile') {
				subject = sprintf(this.localizable.get('emailDialog_stratFileSubjectValue'), stratFileName);
				message = sprintf(this.localizable.get('emailDialog_stratFileMessageValue'), stratFileName);
			}
			else if (sel == 'csv') {
				message = sprintf(this.localizable.get('emailDialog_defaultMessageValue'), reportName, 'CSV file', stratFileName);
			}
			else if (sel == 'pdf') {
				message = sprintf(this.localizable.get('emailDialog_defaultMessageValue'), reportName, 'PDF file', stratFileName);
			}
			else if (sel == 'docx') {
				message = sprintf(this.localizable.get('emailDialog_defaultMessageValue'), reportName, 'DocX file', stratFileName);
			}

			$('#emailSubject')
				.val(subject);
			
			$('#emailMessage')
				.val(message);

		},

		_hideEmailInputs: function(e){

			if(e)
				e.preventDefault();

			$('#emailOthers')
				.removeClass('active')
				.find('.emailInput')
				.val('');

			$('#mailtoOthersTrigger')
				.show();

		},

		_resetVex: function($vexContent){

			// clear email fields
			$vexContent.find('#emailDialog fieldset input').val('');

			// clear filetype selection
			$vexContent.find('.fileTypeGrid label').removeClass('active');
			$vexContent.find('.fileTypeGrid input').prop('checked', false);

			// disable submit/cancel buttons
			$vexContent.find(".vex-dialog-buttons input").prop('disabled', true);

			// don't show the email to others stuff
			this._hideEmailInputs();

			// show success message and then restore full dialog after a few seconds
			setTimeout(function(){
				$vexContent.find('#emailSuccessError').fadeOut(300, function(){$(this).empty();});
				$vexContent.find('#emailDialog').fadeIn(300);

				// re-enable cancel button
				$vexContent.find(".vex-dialog-button-secondary").prop('disabled', false);

			}, 4000);

		},

		_spinVex: function($vexContent, spin){

			if(spin){

				$vexContent
					.find('.vex-dialog-button-primary')
					.wrap('<div class="spinner-wrap" />')
					.parent()
					.spin('small', '#fff');

			} else {

				$vexContent
					.find('.spinner-wrap')
					.spin(false)
					.find('input')
					.unwrap();
			}

		},

		_addEmailFieldData: function($vexContent, data){

			if($vexContent.find('#emailOthers').is('.active')){

				$vexContent.find('#emailOthers .emailInput')
					.each(function () {
						var $this = $(this);
						data[$this.attr('data-key')] = $this.val();
					});

			}

		},

		_emailPDF: function($vexContent) {

			var isPdfReportsEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportPDF);
			if(!isPdfReportsEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportPDF);				
			} else {
				this._spinVex($vexContent, true);

				var self = this;
				var opts = this.defaultOpts({
					extension: 'pdf',
					postUrl: sprintf('%s/pdfService', config.serverBaseUrl)
				});
				var data = {
					uuid: opts.stratFile.get('uuid'),
					dateModified: opts.stratFile.get('modificationDate'),
					reportName: opts.reportName,
					filename: opts.fileName,
					stratfileName: opts.stratFile.get('name'),
					content: this.reportMarkup(opts)
				};

				this._addEmailFieldData($vexContent, data);

				$.ajax({
					url: opts.postUrl,
					type: "POST",
					dataType: 'html',
					data: data,
					contentType: "text/html; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {

						console.debug("Export to pdf went well");

						var user = $.parseJSON($.localStorage.getItem('user')),
							email = user.email;

						if(data.hasOwnProperty('to') && data.to.length > 0){
							email = data.to;
						}

						var	formatString = self.localizable.get('emailDialog_msg_pdf_success'),
							message = sprintf(formatString, opts.reportName, email);

						$vexContent.find('#emailDialog').hide();
						$vexContent.find('#emailSuccessError').show().append(message);

						self._resetVex($vexContent);

					})
					.fail(function(jqXHR, textStatus, errorThrown) {

						console.debug("Export to pdf failed");

					})
					.always(function(jqXHR, textStatus, errorThrown) {

						self._spinVex($vexContent, false);
					});

			}

		},

		_emailCSV: function($vexContent) {

			var isCsvEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportCSV);
			if(!isCsvEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportCSV);				
			} else {

				var self = this,
					opts = this.defaultOpts({extension: 'csv'}),
					post_url = sprintf('%s/csvService', config.serverBaseUrl),
					data = {
						reportName: opts.reportName,
						filename: opts.fileName,
						stratfileName: opts.stratFile.get('name'),
						content: this.router.report.contentForCsv()
					};

				self._spinVex($vexContent, true);

				this._addEmailFieldData($vexContent, data);

				$.ajax({
					url: post_url,
					type: "POST",
					dataType: 'html',
					data: data,
					contentType: "text/html; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {

						console.debug("Email csv went well");

						var user = $.parseJSON($.localStorage.getItem('user')),
							email = user.email;

						if(data.hasOwnProperty('to') && data.to.length > 0){
							email = data.to;
						}

						var	formatString = self.localizable.get('emailDialog_msg_pdf_success'),
							message = sprintf(formatString, data.reportName, email);

						$vexContent.find('#emailDialog').hide();
						$vexContent.find('#emailSuccessError').show().append(message);

						self._resetVex($vexContent);


					})
					.fail(function(jqXHR, textStatus, errorThrown) {

						console.debug("Email csv failed");

					})
					.always(function(jqXHR, textStatus, errorThrown) {

						self._spinVex($vexContent, false);
					});

			}

		},		

		_emailDocx: function($vexContent) {
			// only available on the summary bizplan page

			var isDocxExportEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportDocx);
			if(!isDocxExportEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportDocx);				
			} else {
				this._spinVex($vexContent, true);

				var self = this;
				var postUrl = sprintf('%s/summarybizplan', config.serverBaseUrl);
				var opts = self.defaultOpts({extension: 'docx'});
				var json = self.jsonForSummaryBizPlan(opts);				

				var data = {
					uuid: opts.stratFile.get('uuid'),
					dateModified: opts.stratFile.get('modificationDate'),
					reportName: opts.reportName,
					filename: opts.fileName,
					stratfileName: opts.stratFile.get('name'),
					content: JSON.stringify(json)
				};

				// append email-specific data
				self._addEmailFieldData($vexContent, data);

				// send data to our email docx service
				$.ajax({
					url: postUrl,
					type: "POST",
					data: data
				})
					.done(function(response, textStatus, jqXHR) {

						console.debug("Export to docx went well");

						var user = $.parseJSON($.localStorage.getItem('user')),
							email = user.email;

						if(data.hasOwnProperty('to') && data.to.length > 0){
							email = data.to;
						}

						var	formatString = self.localizable.get('emailDialog_msg_docx_success'),
							message = sprintf(formatString, opts.reportName, email);

						$vexContent.find('#emailDialog').hide();
						$vexContent.find('#emailSuccessError').show().append(message);

						self._resetVex($vexContent);

					})
					.fail(function(jqXHR, textStatus, errorThrown) {

						console.error("Export to docs failed");

					})
					.always(function(jqXHR, textStatus, errorThrown) {

						self._spinVex($vexContent, false);
					});
			}

		},

		_emailStratfile: function($vexContent) {

			var isStratfileEnabled = EditionManager.isFeatureEnabled(EditionManager.FeatureExportStratFile);
			if(!isStratfileEnabled){
            	new UpgradeMenuView().showUpgradeDialog(EditionManager.FeatureExportStratFile);				
			} else {

				var self = this,
					opts = this.defaultOpts({extension: 'stratfile', reportName: this.localizable.get('summaryBizPlanReportName')}),
					get_url = sprintf('%s/stratfiles/%s', config.serverBaseUrl, opts.stratFile.get('id')),
					data = {
						filename: opts.fileName,
						stratfile: true, // Accept: application/stratfile (if false we'll get this back as json and sendEmail is ignored)
						sendEmail: true, // send email (true) or download (false)?
					};

				self._spinVex($vexContent, true);

				this._addEmailFieldData($vexContent, data);

				$.ajax({
					url: get_url,
					type: "GET",
					data: data
				})
					.done(function(response, textStatus, jqXHR) {

						console.debug("Email stratfile went well");

						var user = $.parseJSON($.localStorage.getItem('user')),
							email = user.email;

						if(data.hasOwnProperty('to') && data.to.length > 0){
							email = data.to;
						}

						var	formatString = self.localizable.get('emailDialog_msg_stratfile_success'),
							message = sprintf(formatString, opts.stratFile.get('name'), email);

						$vexContent.find('#emailDialog').hide();
						$vexContent.find('#emailSuccessError').show().append(message);

						self._resetVex($vexContent);

					})
					.fail(function(jqXHR, textStatus, errorThrown) {

						console.debug("Export to stratfile failed");

					})
					.always(function(jqXHR, textStatus, errorThrown) {

						self._spinVex($vexContent, false);
					});

			}

		},		

		showEmailDialog: function(e){

			e.preventDefault();
			e.stopPropagation();

			var compiledTemplate = Handlebars.templates['dialogs/EmailDialog'],
				html = compiledTemplate(this.localizable.all()),
				self = this;

			vex
				.dialog.open({
					className : 'vex-theme-plain vex-email',
					message   : self.localizable.get('emailDialog_title'),
					input     : html,
					buttons   : [
						{
							text     : self.localizable.get('emailDialog_submit'),
							type     : 'button',
							className: 'vex-dialog-button-primary',
							click    : function ($vexContent, event) {
								var sel = $('input[name=emailSelection]:checked', '#emailDialog').val();
								if (sel == 'csv') {
									self._emailCSV($vexContent);
								}
								else if (sel == 'pdf') {
									self._emailPDF($vexContent);
								}
								else if (sel == 'docx') {
									self._emailDocx($vexContent);
								}
								else if (sel == 'stratfile') {
									self._emailStratfile($vexContent);
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
					]
				})
				.bind('vexOpen', function (e, v) {

					var $dialog = v.$vexContent.find('#emailDialog');
					$dialog
						.on(self.router.clicktype, '.emailOptionLabel', self._setActiveEmailOption)
						.on(self.router.clicktype, '#mailtoOthersTrigger', self._showEmailInputs)
						.on(self.router.clicktype, '#cancelmailtoOthers', self._hideEmailInputs);

					// loop over the file type labels and enable or disable them with a class
					$dialog
						.find('.emailOptionLabel')
						.each(function () {

							var $this = $(this);

							if(self.router.report && !self.router.report.isExportEnabled($this.attr('data-fileType')))
								$this.addClass('disabled').find('input').prop('disabled', true);

						});

					// disable submit until filetype selected
					v.$vexContent
					.find('.vex-dialog-button-primary')
					.prop('disabled', true);
				});

		}

    });

    return EmailDialog;
});