define(['Config', 'GenericForm', 'Selectize', 'CommunityAgreementView', 'PageStructure', 'EditionManager', 'UpgradeMenuView', 'FormDialog'],

function(config, GenericForm, Selectize, CommunityAgreementView, pageStructure, EditionManager, UpgradeMenuView, FormDialog) {

    var view = GenericForm.extend({

        initialize: function(router, localizable) {
        	GenericForm.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", 'continue');      

            var self = this;

	        // the agreement
	        this.communityAgreementView = new CommunityAgreementView(this.router);

	        // field tooltips
	        $('.important-info')
		        .tooltipster({
			        autoClose: true,
			        content: '',
			        contentCloning: false,
			        positionTracker: true,
			        contentAsHTML: true,
			        // on open
			        functionBefore: function(origin, continueTooltip) {

				        if (origin.data('template') !== 'cached') {

					        var fieldId = origin.parent('li').find('label').attr('for'),
					        	templateId = sprintf('community/tooltips/%s/%s', self.$el.attr('id'), fieldId),
						        template = Handlebars.templates[templateId],
						        context = self.localizable.all(),
						        content = template(context);

					        origin.tooltipster('content', content).data('template', 'cached');

					        continueTooltip();

				        } else {

					        continueTooltip();

				        }

			        },
			        interactive: true,
			        offsetY: '0px',
			        maxWidth: 500,
			        onlyOne: true,
			        theme: 'tooltipster-stratpad tooltip-small tooltip-important',
			        trigger: 'hover'
		        });

            // hook up functionality to our special toolbar item
            $('#pageContent')
                .off('click.community')
                .on('click.community', '.continue', this.continue);

        },

        continue: function(e) {
        	e.preventDefault();
        	e.stopPropagation();
        	this.router.nextPage();
        },

        load: function() {
        	GenericForm.prototype.load.call(this);

            var self = this;

            // todo: add COMMUNITY domain on backend instead of doing isOwner
            var isReadOnly = !this.stratFile.isOwner();
            if (isReadOnly) {
                console.debug("readonly file - don't show community options`");

                // move us to page 0 properly and remove the other pages temporarily
                pageStructure.toggleCommunityPages(isReadOnly);

                if (this.router.page == pageStructure.PAGE_BUSINESS_BACKGROUND) {

                    this.router.pageControlView.pageSliderView.updatePageNumber(0);

                    this.$el.find('.instructions, .formPanel, .security, .searchResults').hide();

                    var $readOnlyPlan = this.$el.find('.readOnlyPlan');
                    $readOnlyPlan.html($('#communityAgreement .howItWorks').html());
                    $readOnlyPlan.show();

                    if (this.stratFile.isSampleFile()) {
                        $('header > hgroup > h2').text(this.localizable.get('sampleFile'));
                    }
                    else {
                        $('header > hgroup > h2').text(this.localizable.get('readOnlyFile'));
                    }
                }
                else {
                    this.router.showStratPage(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_LENDERS_AND_INVESTORS, pageStructure.PAGE_BUSINESS_BACKGROUND, true);
                }

            }
        }

    });

    return view;
});