define(['Config', "i18n!nls/Global.i18n"],

	function(config, gLocalizable) {

		var BaseDialog = Class.extend({

			initialize: function(router) {
				this.router = router;

				// make these funcs/objs available elsewhere
				$.stratweb.export(this.defaultOpts, 'defaultExportOpts');
				$.stratweb.export(this.splitTable, 'splitTable');
			},

			splitTable: function($table) {
				// for docx, it can't deal with big huge images, so split them up
				// always return a cloned element, leaving the original alone
				// note that even the original table might not be displayed, so add to body

                // attach it, so that we can compute heights
                var $tblClone = $table.clone().appendTo('body');

				var init_height = $tblClone.height();
				var max_height = 1200; // px
				if (init_height <= max_height) {
					// don't mess up the original, which may be displayed already (ie R9)
					return $tblClone.remove();
				}

				// we're going to have multiple tables
				var $wrap = $tblClone.wrap('<div class="temp">').parent();

				// tag each row in the original table with 'new', which should start a new table
				var start_height = 0;
				$tblClone.find("tr").each(function() {
					start_height = start_height + $(this).height();
					if (start_height > max_height) {
						$(this).addClass("new");
						start_height = 0;
					}
				});

				$tblClone.find(".new").each(function() {
					// add a new table after the original table
					
					var $tblLast = $wrap.find("table:last");
					$("<table>").attr('id', 'gantt').addClass('reportTable').insertAfter($tblLast);

					// add a thead to our new table
					var $tblNew = $wrap.find("table:last");
					$tblLast.find('thead').clone().appendTo($tblNew);

					// now move existing rows, up until the next .new row, into our new table
					$(this)
						.nextUntil('.new')
						.addBack() // puts all those rows into our jquery object
						.appendTo($tblNew);
				});

				// pull out of body
				$wrap.remove();

				// all the new (split) tables in $wrap
				return $wrap.find('table');
			},

			// this version relies on the summary charts being shown
			jsonForSummaryBizPlan: function(opts) {

				// eg. /css/style.1311260205.css or /css/style.css - both will work but first is cache-proof
				var baseUrl = sprintf('https://%s', config.staticServerName);
				var compiledTemplate = Handlebars.templates['reports/BizPlanPageWrapperForDocx'];

				var summaryBizPlan = this.router.report;

				var user = $.parseJSON($.localStorage.getItem('user'));
				var currency = summaryBizPlan.stratFileInfo.get('currency') || user.preferredCurrency || '$';

				var json = {
				  "report" : summaryBizPlan.localized("heading"), 
				  "company" : summaryBizPlan.stratFileInfo.get('companyName'),
				  "title" : summaryBizPlan.stratFileInfo.get('name'),
				  "lang" : "en",
				  "currency" : currency,
				  "text_a" : summaryBizPlan.generateSectionAContentForStratFile(summaryBizPlan.stratFileInfo, summaryBizPlan.discussion).html().replace(/<br>/g, "\n"),
				  "text_b" : summaryBizPlan.generateSectionBContentForStratFile(summaryBizPlan.discussion).html().replace(/<br>/g, "\n"),
				  "image_cs" : [],
				  "image_ds" : [],
				  "image_es" : []
				};


				// need one of these for each of our 3 charts
				// each chart could potentially be divided into pages, but for now just do one single chart
				// also, should be able to access even if we're not on the bizplan page

				// 1 or more <table> approximately the size of a page
				// each one must be encoded separately and placed in an array
				this
					.splitTable($('#gantt'))
					.each(
						function() {
							var pageMarkup = compiledTemplate({
								baseUrl: baseUrl,
								content: $('<div></div>').append($(this)).html() // wrap with div just so we can get innerhtml
							});
							json.image_cs.push(encodeURIComponent(pageMarkup));
							pageMarkup = null;
						}
					);

				this
					.splitTable($('#goals'))
					.each(
						function() {
							var pageMarkup = compiledTemplate({
								baseUrl: baseUrl,
								content: $('<div></div>').append($(this)).html() // wrap with div just so we can get innerhtml
							});
							json.image_ds.push(encodeURIComponent(pageMarkup));
							pageMarkup = null;
						}
					);

				var progressMarkup = compiledTemplate({
					baseUrl: baseUrl,
					content: $('<div></div>').append($('#progress').clone()).html()
				});
				json.image_es.push(encodeURIComponent(progressMarkup));
				progressMarkup = null;		

				return json;

			},

			reportMarkup: function(opts) {

				// eg. /css/style.1311260205.css or /css/style.css - both will work but first is cache-proof
				var baseUrl = sprintf('https://%s', config.staticServerName);
				var bodyClass = $('body').attr('class');

				// context for our HTML template, which will be sent to server
				var context = {
					documentTitle: document.title,
					mainCss: sprintf('%s/css/style.css', baseUrl),
					princeCss: sprintf('%s/css/prince.css', baseUrl),
					bodyClass: bodyClass,
					reportName: opts.reportName,
					subcontext: opts.subcontext,
					now: moment().format($.stratweb.dateFormats.full),
					company: opts.stratFile.get('companyName'),
					stratFileName: opts.stratFile.get('name'),
					content: this.router.report.contentForPdf().html()
				};
				_.extend(context, gLocalizable);

				var compiledTemplate = Handlebars.templates['reports/princePDF'],
					markup = compiledTemplate(context);

				return markup;
			},

			defaultOpts: function(opts) {
				var sfm = window.router.stratFileManager;
				opts.stratFile = sfm.stratFileCollection.get(sfm.stratFileId);
				opts.normalizedStratFileName = opts.stratFile.get('name').replace(/[^A-Za-z0-9\. ]/g, "").replace(/ /g, "_");
				opts.subcontext = opts.subcontext || (window.router.report && window.router.report.subcontext()) || null;
				opts.reportName = opts.reportName || (window.router.report && window.router.report.localizedReportName()) || null;
				opts.normalizedReportName = opts.reportName.replace(/[^A-Za-z0-9\. ]/g, "").replace(/ /g, "_");
				opts.extension = opts.extension || 'undef';
				opts.fileName = sprintf('%s-%s-%s.%s', opts.normalizedStratFileName, opts.normalizedReportName, moment().format('YYYYMMDD'), opts.extension);
				return opts;
			}		

		});

		return BaseDialog;
	});