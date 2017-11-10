define(['Config', 'i18n!nls/PageToolbarView.i18n', 'Dictionary', 'ExportDialog', 'EmailDialog', 'PrintWindow', 'backbone'],

    function(config, localizable, Dictionary, ExportDialog, EmailDialog, PrintWindow) {

        var view = Backbone.View.extend({

            el: '#pageContent',

            initialize: function(router, gLocalizable) {
                _.bindAll(this, "addToolbarToPage");

				this.router = router;
				this.localizable = new Dictionary(localizable, gLocalizable);
				this.exportDialog = new ExportDialog(this.router);
				this.emailDialog = new EmailDialog(this.router);
				this.printWindow = new PrintWindow(this.router);

				// must be late binding
				this.$el
					.on(this.router.clicktype, '#showPrintPopup', this.printWindow.printCurrentReport)
					.on(this.router.clicktype, '#showExportDialog', this.exportDialog.showExportDialog)
					.on(this.router.clicktype, '#showEmailDialog', this.emailDialog.showEmailDialog)

            },

            // this is a single page toolbar with all possible components/icons in the app
            // they are turned on and off, contextually, for all dynamic pages, in PageToolbarView.css
			addToolbarToPage: function(){

				var compiledTemplate = Handlebars.templates['pagetoolbar/PageToolbarView'],
					html = compiledTemplate(this.localizable.all());

				this.$el.find('header').append(html);

				this.$pageToolbar = this.$el.find('#pageToolbar');

				var $toolBarLi = this.$pageToolbar.find('li');

				$toolBarLi
					.each(function () {
						var $this = $(this);
						$this.attr('data-display', $this.css('display'));
					});

				this.$pageToolbar.find('.tooltip').tooltipster({position:'top', touchDevices:false, delay:150, fixedWidth: 250});

			}

        });

        return view;
    });
