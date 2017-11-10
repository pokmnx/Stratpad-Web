// for this to work, it needs to go under a live webserver (cause of x-domain ajax restrictions = CORS)
// easiest is to fire up a python server in the parent dir: python -m SimpleHTTPServer

var noInternetMessage = "No internet connection. Reload page when back online.";
var timeoutMessage = 'Poor network connectivity. Please reload page.';

// if we don't get somewhere within 45s, reload
var reloader = window.setTimeout(function() {
	location.reload();
}, 45*1000);

if (!navigator.onLine) {
	$('<div class="warning"></div>').css({
		margin: '100px auto',
		width: '500px'
	}).text(noInternetMessage).appendTo($('#pageContent .content'));
	
}
// todo: sometimes we have something like ShawOpen which puts you online but redirects all requests; we get an error in that situation

requirejs.onError = function(err, modules) {
	// most common cause
	if (!navigator.onLine) {
		$('<div class="warning"></div>').css({
			margin: '100px auto',
			width: '500px'
		}).text(noInternetMessage).appendTo($('#pageContent .content'));
	}
	else if (err.requireType === 'timeout') {
        $('<div class="warning"></div>').css({
			margin: '100px auto',
			width: '500px'
		}).text(timeoutMessage).appendTo($('#pageContent .content'));
    } 
    // else {
    //     throw err;
    // } 	
};

requirejs.config({
	waitSeconds: 0, // peruvian timeout
	config: {
		// NB. only english is inlined; we have to include all other scripts individually
		i18n: {
			locale: 'fr-fr'
		}
		
		// for whatever reason, trying to config text kills it!
	},
	paths: {
		// $ and _ are exported globally
		underscore: 'lib/underscore/underscore',

		modernizr: 'lib/modernizr/modernizr-2.7.0',
		modernizrTests: 'lib/modernizr/modernizr.tests',

		// jquery
		jquery: 'lib/jquery/jquery-2.1.1',

		// jquery ui

		jqueryUICore: 'lib/jquery-ui-1.10.3/jquery.ui.core',
		jqueryUIEffect: 'lib/jquery-ui-1.10.3/jquery.ui.effect',
		jqueryUIWidget: 'lib/jquery-ui-1.10.3/jquery.ui.widget',
		jqueryUIDatepicker: 'lib/jquery-ui-1.10.3/jquery.ui.datepicker',
		jqueryUIDialog: 'lib/jquery-ui-1.10.3/jquery.ui.dialog',
		jqueryUIMouse: 'lib/jquery-ui-1.10.3/jquery.ui.mouse',
		jqueryUISlider: 'lib/jquery-ui-1.10.3/jquery.ui.slider',
		jqueryUISortable: 'lib/jquery-ui-1.10.3/jquery.ui.sortable',
		jqueryUITooltip: 'lib/jquery-ui-1.10.3/jquery.ui.tooltip',
		jqueryUIButton: 'lib/jquery-ui-1.10.3/jquery.ui.button',

		// jquery plugins

		contenteditable: 'lib/jquery/jquery.contenteditable',
		spinjs: 'lib/jquery/spin/spin-1.3.2',
		jquerySpin: 'lib/jquery/spin/spin',
		transit: 'lib/jquery/jquery.transit.min',
		nanoscroll: 'lib/jquery/jquery.nanoscroller',
		autosize: 'lib/jquery/jquery.autosize',
		select2: 'lib/select2/select2-3.3.2', // @deprecated - use selectize
		sifter: 'lib/selectize/sifter-0.3.4',
		microplugin: 'lib/selectize/microplugin-0.0.3',
		Selectize: 'lib/selectize/selectize-0.11.0',
		hammerjq: 'lib/hammer/jquery.hammer',
		touchpunch: 'lib/jquery/jquery.ui.touch-punch',
		moment: 'lib/moment/moment',
		momenti18n: 'lib/moment/nls/moment.i18n',
		postmessage: 'lib/jquery/jquery.ba-postmessage',
		cookie: 'lib/jquery/jquery.cookie',
		localstorage: 'lib/jquery/jquery.html5storage',
		vex: 'lib/jquery/jquery-vex.combined',
		fileUpload: 'lib/jquery/fileupload/jquery.fileupload',
		fileUploadTransport: 'lib/jquery/fileupload/jquery.iframe-transport',
		tooltipster: 'lib/jquery/jquery.tooltipster',
		debounce: 'lib/jquery/jquery.ba-throttle-debounce',
		formats: 'lib/jquery/formats',
		numericFields: 'lib/jquery/numericFields',
		md5: 'lib/jquery/jquery.md5',
		util: 'lib/jquery/util',
		monthpicker: 'lib/jquery/jquery.mtz.monthpicker',
		spectrum: 'lib/jquery/spectrum',
		rangy: 'lib/jquery/rangyinputs-jquery-1.1.2',
		bootgrid: 'lib/jquery/jquery.bootgrid',
		bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
		visibility: 'lib/jquery/jquery-visibility',
		bonsai: 'lib/jquery/jquery.bonsai',

		// charting (actually svg graphics)
		d3: 'lib/nv.d3/d3.v3',
		nvd3: 'lib/nv.d3/nv.d3',
		svg: 'lib/svg/svg',

		// require plugins
		text: 'lib/require/text',
		i18n: 'lib/require/i18n',

		// misc libs
		hammer: 'lib/hammer/hammer',
		backbone: 'lib/backbone/backbone',
		backboneCache: 'lib/backbone/backbone.fetch-cache',
		sprintf: 'lib/sprintf/sprintf',
		jrespond: 'lib/jrespond/jrespond.0.8.3.min',
		logLevel: 'lib/log/loglevel',
		jscd: 'lib/jquery/jscd',
		ipp: 'https://js.appcenter.intuit.com/Content/IA/intuit.ipp.anywhere-1.3.0',
		blob: 'lib/filesaver/Blob',
		filesaver: 'lib/filesaver/FileSaver',
		stacktrace: 'lib/stacktrace/stacktrace',
		channel: 'https://rest.stratpad.com/_ah/channel/jsapi',

		// handlebars
		handlebars: "lib/handlebars/handlebars-v1.3.0",
		templates: "modules/PrecompiledTemplates",

		// modules
		Config: 'modules/Config',
		Router: 'modules/Router',
		PublicRouter: 'modules/PublicRouter',
		PageStructure: 'modules/PageStructure',
		Class: 'modules/Class',
		StratFileManager: 'modules/StratFileManager',
		StratBoardManager: 'modules/StratBoardManager',
		MessageManager: 'modules/MessageManager',
		EditionManager: 'modules/EditionManager',
		Dictionary: 'modules/Dictionary',
		MyAccountManager: 'modules/MyAccountManager',
		DispatchManager: 'modules/DispatchManager',

		// basic forms
		BaseForm: 'views/forms/BaseForm',
		GenericForm: 'views/forms/GenericForm',
		'F1.AboutYourStrategy': 'views/forms/F1.AboutYourStrategy',
		'DiscussionBase': 'views/forms/discussion/DiscussionBase',
		'Customers': 'views/forms/discussion/Customers',
		'KeyProblems': 'views/forms/discussion/KeyProblems',
		'AddressProblems': 'views/forms/discussion/AddressProblems',
		'Competitors': 'views/forms/discussion/Competitors',
		'BizModel': 'views/forms/discussion/BizModel',
		'Expansion': 'views/forms/discussion/Expansion',
		'Aspiration': 'views/forms/discussion/Aspiration',
		'StrategyStatement': 'views/forms/discussion/StrategyStatement',
		'Management': 'views/forms/discussion/Management',
		'SalesAndMarketing': 'views/forms/discussion/SalesAndMarketing',

		// User models
		User: 'models/User',
		UserPreference: 'models/UserPreference',
		UserPreferenceCollection: 'models/UserPreferenceCollection',
        AccessControlEntry: 'models/AccessControlEntry',
        AccessControlEntryCollection: 'models/AccessControlEntryCollection',

		// StratFile models
		StratFile: 'models/StratFile',
		StratFileInfo: 'models/StratFileInfo',
		Discussion: 'models/Discussion',
		Theme: 'models/Theme',
		Objective: 'models/Objective',
		Activity: 'models/Activity',
		Metric: 'models/Metric',
		MetricMeasurement: 'models/MetricMeasurement',
		ProjectNoteItem: 'models/ProjectNoteItem',
        Chart: 'models/Chart',
		ProjectionChart: 'models/ProjectionChart',
		MetricChart: 'models/MetricChart',
		Projection: 'models/Projection',
		ThemeCollection: 'models/ThemeCollection',
		StratFileCollection: 'models/StratFileCollection',
		ObjectiveCollection: 'models/ObjectiveCollection',
		ActivityCollection: 'models/ActivityCollection',
		MetricCollection: 'models/MetricCollection',
		ProjectNoteItemCollection: 'models/ProjectNoteItemCollection',

		// community models
		BusinessBackground: 'models/BusinessBackground',
		PersonalCreditHistory: 'models/PersonalCreditHistory',
		ServiceProvider: 'models/ServiceProvider',
		ServiceProviderSearchCollection: 'models/ServiceProviderSearchCollection',
		UserServiceProvider: 'models/UserServiceProvider',
		CommunityTracking: 'models/CommunityTracking',
		CommunityTrackingCollection: 'models/CommunityTrackingCollection',
		BusinessLocation: 'models/BusinessLocation',
		BusinessLocationCollection: 'models/BusinessLocationCollection',

		// chart models
		ChartCollection: 'models/ChartCollection',
		MetricMeasurementCollection: 'models/MetricMeasurementCollection',
		ProjectionMeasurement: 'models/ProjectionMeasurement',
		ProjectionMeasurementCollection: 'models/ProjectionMeasurementCollection',

		// financial models
		Financial: 'models/Financial',
		OpeningBalances: 'models/OpeningBalances',
		Loan: 'models/Loan',
		LoanCollection: 'models/LoanCollection',
		Asset: 'models/Asset',
		AssetCollection: 'models/AssetCollection',
		Equity: 'models/Equity',
		EquityCollection: 'models/EquityCollection',
		EmployeeDeductions: 'models/EmployeeDeductions',
		SalesTax: 'models/SalesTax',
		IncomeTax: 'models/IncomeTax',

		// core views
		BasePageView: 'views/core/BasePageView',
		PageControlView: 'views/core/PageControlView',
		PageNavigationView: 'views/core/PageNavigationView',
		PageContentView: 'views/core/PageContentView',
		PageLandingView: 'views/core/PageLandingView',
        WelcomeView: 'views/core/WelcomeView',
		FeedbackView: 'views/core/FeedbackView',

		// objectives views
		ObjectivesDetail: 'views/forms/ObjectivesDetail',		
		ObjectivesNavListView: 'views/navbar/ObjectivesNavListView',
		ObjectivesNavCellView: 'views/navbar/ObjectivesNavCellView',
		ObjectiveListView: 'views/forms/ObjectiveListView',
		ObjectiveRowView: 'views/forms/ObjectiveRowView',
		MetricListView: 'views/forms/MetricListView',
		MetricRowView: 'views/forms/MetricRowView',

		// activities	
		ActivitiesDetail: 'views/forms/ActivitiesDetail',
		ActivitiesNavListView: 'views/navbar/ActivitiesNavListView',
		ActivitiesNavCellView: 'views/navbar/ActivitiesNavCellView',
		ActivityListView: 'views/forms/ActivityListView',
		ActivityRowView: 'views/forms/ActivityRowView',

		// themes
		ProjectNotesManager: 'views/forms/themes/ProjectNotesManager',
		SeasonalManager: 'views/forms/themes/SeasonalManager',
		'F4.ThemeDetail': 'views/forms/F4.ThemeDetail',		
		ProjectNoteItemListView: 'views/forms/themes/ProjectNoteItemListView',
		ProjectNoteItemRowView: 'views/forms/themes/ProjectNoteItemRowView',
		ThemeListView: 'views/navbar/ThemeListView',
		ThemeCellView: 'views/navbar/ThemeCellView',
		NetBenefitsCalculator: 'views/forms/themes/NetBenefitsCalculator',
		ThemeCalculator: 'views/forms/themes/ThemeCalculator',

		// chart views
		ChartNavListView: 'views/navbar/ChartNavListView',
		ChartNavCellView: 'views/navbar/ChartNavCellView',
		ChartListView: 'views/stratboard/ChartListView',
		ChartRowView: 'views/stratboard/ChartRowView',
		ChartControlView: 'views/stratboard/ChartControlView',
		MeasurementListView: 'views/stratboard/MeasurementListView',
		MeasurementRowView: 'views/stratboard/MeasurementRowView',

		// financial views
		BaseFinancialView: 'views/forms/financials/BaseFinancialView',
		LoanListView: 'views/forms/financials/LoanListView',
		LoanRowView: 'views/forms/financials/LoanRowView',
		AssetListView: 'views/forms/financials/AssetListView',
		AssetRowView: 'views/forms/financials/AssetRowView',
		EquityListView: 'views/forms/financials/EquityListView',
		EquityRowView: 'views/forms/financials/EquityRowView',
		InventoryView: 'views/forms/financials/InventoryView',
		EmployeeDeductionsView: 'views/forms/financials/EmployeeDeductionsView',
		SalesTaxView: 'views/forms/financials/SalesTaxView',
		IncomeTaxView: 'views/forms/financials/IncomeTaxView',

		// community views
		LenderView: 'views/community/lendersAndInvestors/LenderView',
		BusinessBackgroundView: 'views/community/lendersAndInvestors/BusinessBackgroundView',
		PersonalCreditHistoryView: 'views/community/lendersAndInvestors/PersonalCreditHistoryView',
		MatchingLendersAndInvestorsView: 'views/community/lendersAndInvestors/MatchingLendersAndInvestorsView',
		SearchDetailView: 'views/community/SearchDetailView',
		CommunityAgreementView: 'views/community/CommunityAgreementView',
		BasicSearchResultsView: 'views/community/matching/BasicSearchResultsView',
		MyAccountBasePageView: 'views/community/myAccount/MyAccountBasePageView',
		HowItWorksView: 'views/community/myAccount/HowItWorksView',
		CompanyInfoAndBudgetView: 'views/community/myAccount/CompanyInfoAndBudgetView',
		LocationView: 'views/community/myAccount/LocationView',
		ReportView: 'views/community/myAccount/ReportView',
		FormDialog: 'views/community/FormDialog',

		// menus
		PageMenubarView: 'views/menubar/PageMenubarView',
		StratFileListView: 'views/menubar/StratFileListView',
		StratFileCellView: 'views/menubar/StratFileCellView',
        ShareMenuView: 'views/menubar/share/ShareMenuView',
        AccessControlEntryRowView: 'views/menubar/share/AccessControlEntryRowView',
        AccessControlEntryListView: 'views/menubar/share/AccessControlEntryListView',
		ProfileMenuView: 'views/menubar/ProfileMenuView',
		StratFileMenuView: 'views/menubar/StratFileMenuView',
		InfoMenuView: 'views/menubar/InfoMenuView',
		UpgradeMenuView: 'views/menubar/UpgradeMenuView',

		// misc dialogs
		AcceptInviteDialog: 'views/dialogs/AcceptInviteDialog',

		// pagetoolbar
		PageToolbarView: 'views/pagetoolbar/PageToolbarView',
		HelpDrawerView: 'views/pagetoolbar/HelpDrawerView',
        ProjectGuideView: 'views/pagetoolbar/ProjectGuideView',
		BaseDialog: 'views/pagetoolbar/BaseDialog',
		ExportDialog: 'views/pagetoolbar/ExportDialog',
		EmailDialog: 'views/pagetoolbar/EmailDialog',
		PrintWindow: 'views/pagetoolbar/PrintWindow',

		// reports
		BaseReport: 'views/reports/BaseReport',
		BizPlanGanttChart: 'views/reports/R9.BizPlanGanttChart',
		BizPlanGoalsChart: 'views/reports/R9.BizPlanGoalsChart',
		BizPlanProgressChart: 'views/reports/R9.BizPlanProgressChart',
		Playbook: 'views/reports/Playbook',
		PlaybookGantt: 'views/reports/Playbook.Gantt',
		PlaybookAgenda: 'views/reports/Playbook.Agenda',
		PlaybookBizPlanSummary: 'views/reports/Playbook.BizPlanSummary',
		PlaybookWorksheet: 'views/reports/Playbook.Worksheet',
		PlaybookCashFlow: 'views/reports/Playbook.CashFlow',
		PlaybookIncome: 'views/reports/Playbook.Income',
		FinancialStatement: 'views/reports/FinancialStatement',

		// admin
		AdminRouter: 'admin/AdminRouter',
		BaseAdminView: 'admin/BaseAdminView',
		ConnectIntroductionsAdmin: 'admin/ConnectIntroductionsAdmin',
		ServiceProvidersAdmin: 'admin/ServiceProvidersAdmin',
		ConnectReferralsAdmin: 'admin/ConnectReferralsAdmin',
		UsersAdmin: 'admin/UsersAdmin',
		LocationsAdmin: 'admin/LocationsAdmin'

	},
	shim: {
		// if the module defines it's own dependencies, and it uses an AMD define init, doesn't need to go here
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone' // our global
		},
		'backboneCache': ['backbone'],
		'modernizrTests': ['modernizr'],
		'jquerySpin': ['jquery', 'spinjs'],
		'vex': ['jquery'],
		'transit': ['jquery'],
		'jqueryUICore': ['jquery'],
		'jqueryUIEffect': ['jqueryUICore'],
		'jqueryUIWidget': ['jqueryUIEffect'],
		'jqueryUIDatepicker': ['jqueryUIWidget'],
		'jqueryUIDialog': ['jqueryUIDatepicker'],
		'jqueryUIMouse': ['jqueryUIDialog'],
		'jqueryUISlider': ['jqueryUIMouse'],
		'jqueryUISortable': ['jqueryUISlider'],
		'jqueryUITooltip': ['jqueryUIWidget'],
		'jqueryUIButton': ['jqueryUIWidget'],
		'fileUpload': ['jqueryUIWidget', 'fileUploadTransport'],
		'touchpunch': ['jqueryUISortable'],
		'jrespond': ['jquery'],
		'autosize': ['jquery'],
		'postmessage': ['jquery'],
		'nanoscroll': ['jquery'],
		'tooltipster': ['jquery'],
		'select2': ['jquery'],
		'moment': ['jquery'],
		'momenti18n': ['moment'],
		'hammerjq': ['jquery'],
		'localstorage': ['jquery'],
		'templates': ['handlebars'],
		'md5': ['jquery'],
		'debounce': ['jquery'],
		'monthpicker': ['jquery'],
		'nvd3': ['d3'],
		'bootstrap': ['jquery'],
		'bonsai': ['jquery'],
	}
});

define(
	// globally used js libs only
	['jquery', 'backbone', 'Router', 'PublicRouter', 'Config', 'logLevel', 'i18n!nls/Global.i18n', 'AdminRouter',
		'contenteditable', 'sprintf', 'modernizr', 'modernizrTests', 'jqueryUICore', 'jqueryUIEffect',
		'jqueryUIWidget', 'jqueryUIDatepicker', 'jqueryUIDialog', 'jqueryUIMouse',
		'jqueryUISlider', 'jqueryUISortable', 'jquerySpin', 'vex', 'transit', 'postmessage', 'autosize', 'jrespond', 'nanoscroll', 'hammer', 'hammerjq', 'select2', 'Class', 'moment',
		'momenti18n', 'touchpunch', 'cookie', 'handlebars', 'templates', 'tooltipster', 'localstorage', 'formats', 'numericFields', 'util', 'md5', 'debounce', 'stacktrace'
	],

	function($, Backbone, Router, PublicRouter, config, log, gLocalizable, AdminRouter) {
		log.setLevel(config.logLevel);
		log.info('Initing log');

		console.trace = log.trace;
		console.debug = log.debug;
		console.info = log.info;
		console.warn = log.warn;
		console.error = log.error;
		console.log = log.debug;

		// we still get Uncaught Error: Script error http://requirejs.org/docs/errors.html#scripterror, eg when a laptop wakes up
		requirejs.onError = function(err) {
			console.log(err.requireType);
			console.log('modules: ' + err.requireModules);
			throw err;
		};

		// get rid of this catch all
		clearTimeout(reloader);

		// make sure we can send server cookies back and forth, also CORS
		$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			options.xhrFields = {
				withCredentials: true
			};
		});

		// note that you should handle these per ajax by setting global:false
		$(document).ajaxComplete(function(event, jqXHR, settings) {
			console.debug("AJAX complete with status: " + jqXHR.status + '; ' + settings.url);

			// catch all for unhandled 401's
			if (jqXHR.status == 401) {
				var messageKey = $.stratweb.firstError(jqXHR.responseJSON, 'resendSignupEmail.unknownError').key;
				if (messageKey == 'PERMISSION_DENIED') {

					console.warn('Permission denied. Ignoring.');

				} else if (messageKey == 'FREE_TRIAL_EXPIRED') {
					console.warn('Free trial expired.');
					vex.dialog.open({
						className: 'vex-theme-plain',
						message: gLocalizable[messageKey],
						buttons: [$.extend({}, vex.dialog.buttons.YES, {
							text: 'OK'
						})],
						callback: function() {
							$.localStorage.removeItem('user');
							window.location = "http://www.stratpad.com/price-editions/";
						}
					});
				} else {
					// we seem to be hitting this on first login quite a lot
					console.warn('Unknown 401. ' + messageKey);
					console.warn(jqXHR.responseText);
					$.localStorage.removeItem('user');
					window.location = "index.html#login/timeout";
				}

			} 

			// at least make sure it is coming from one of our jstratpad instances
			else if (jqXHR.status == 404 && jqXHR.responseJSON === undefined && $.stratweb.parseUrl(settings.url).host.indexOf('stratpad') != -1) {
				// these are really 401's, from everything we can tell, but it is being changed to a 404 by jquery
				console.warn('Received 404 - probably need to re-login');
				$.localStorage.removeItem('user');
				window.location = "index.html#login";				
			}

			// CORS killed us - need to login
			// todo: try and differentiate between CORS problem and ajax cancel (used in select2 responsible)
			// NB part of this problem was that the server was not returning CORS headers when permission was denied
			else if (jqXHR.status === 0) {
				console.warn("Couldn't contact server due to CORS - probably need to re-login");
				$.localStorage.removeItem('user');
				window.location = "index.html#login";				
			}

			else if (!navigator.onLine) {
				$('<div class="warning"></div>').css({
					margin: '100px auto',
					width: '500px'
				}).text(noInternetMessage).appendTo($('#pageContent .content'));
			}
		});

		if (window.location.pathname == "/stratweb.html") {

			var self = this;

			// get us out of here if we're not logged in
			var userData = $.parseJSON($.localStorage.getItem('user'));
			if (!userData) {
				console.warn("Not logged in!! Checking with server.");

				$('#pageContent').spin();

				// check with server
				$.ajax({
					url: config.serverBaseUrl + "/users/current",
					type: "GET",
					dataType: 'json',
					contentType: "application/json; charset=utf-8"
				})
					.done(function(response, textStatus, jqXHR) {
						response.data.user.fullname = $.stratweb.fullname(response.data.user.firstname, response.data.user.lastname);
						console.debug("Welcome: " + response.data.user.fullname);
						response.data.user.loginTime = new Date().getTime();
						$.localStorage.setItem('user', JSON.stringify(response.data.user));

						// kick off the app
						window.router = new Router();
						Backbone.history.start();

					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						// now we really are done
						console.error("%s: %s", textStatus, errorThrown);
						window.location = "index.html#login";
					})
					.always(function() {
						$('#pageContent').spin(false);
					});
			} else {
				// kick off the app
				window.router = new Router();
				Backbone.history.start();				
			}

		} 

		else if (window.location.pathname == '/sp-admin.html') {
			window.router = new AdminRouter();
			Backbone.history.start();
		}

		else {
			// light app with no security - eg index.html and pagelanding
			window.router = new PublicRouter();
			Backbone.history.start();
		}

	}
);