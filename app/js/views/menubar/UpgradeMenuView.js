define(['Config', 'EditionManager', 'i18n!nls/UpgradeMenuView.i18n', 'i18n!nls/Global.i18n', 'Dictionary', 'backbone'],

    function(config, EditionManager, localizable, gLocalizable, Dictionary) {

        var view = Backbone.View.extend({

			initialize: function() {
				_.bindAll(this, 'showUpgradeDialog', 'sendToCart');

				this.localizable = new Dictionary(localizable, gLocalizable);

			},

			sendToCart: function(e, sku){

				e.preventDefault();

				$('.vex .vex-dialog-buttons').spin('small');

				var userData = $.parseJSON($.localStorage.getItem('user')),
					productUrl = '',
					isUpgrade = !(userData.ipnProductCode == config.skuFree),
					// note that the upgrade will redirect to the cart url anyway
					linkType = isUpgrade ? config.upgradeUrl : config.cartUrl,
					product = EditionManager.product(sku);

				if(sku != config.skuFree) {
					productUrl = linkType.replace('PRODUCT_ID', product.productId);
				}

				if(isUpgrade)
					productUrl = productUrl.replace('LICENSE_CODE', userData.licenseCode);
				else
					productUrl = sprintf('%s&CUSTOMERID=%s', productUrl, userData.id);

				productUrl = sprintf('%s&fname=%s&lname=%s&email=%s', productUrl, userData.firstname, userData.lastname, userData.email);

				if (isUpgrade) {
					productUrl += sprintf('&EXISTINGPRODUCTKEY=%s', EditionManager.productKey());
				};

				// we need to logout so that when a user comes back after purchase, they won't be autologged in (with their existing free trial)
				router.doLogout({windowLocation: productUrl});
			},

			// provide a feature, and the upgrade dialog will have a custom message about needing to unlock the feature;
			// otherwise, just a generic upgrade message
			showUpgradeDialog: function(feature) {

				console.debug("Feature locked: " + feature);

				var sku = EditionManager.productCode();

				// is this upgrade message due to a feature needing to be unlocked?
				var featureLocked = (feature >= 0);

				router.pageMenubarView.dismissMenuWithBodyClick = false;

				var compiledTemplate = Handlebars.templates['menu/UpgradeMenuView'];
				var html = compiledTemplate(this.localizable.all());

				var self = this;
				vex
					.dialog.open({
						className: 'vex-theme-plain',
						contentCSS: {
							width: '920px'
						},
						message: html,
						buttons: [$.extend({}, vex.dialog.buttons.NO, { text: self.localizable.get('btn_cancel') }) ],
	                    afterClose: function() {
	                        router.pageMenubarView.dismissMenuWithBodyClick = true;
	                    }						
					})
					.bind('vexOpen', function() {

						var $this = $(this);

						$this
							.parent()
							.css('padding-top', '30px');

						// was this an upgrade request? or did they encounter a locked feature?
						if(featureLocked) {
							var suffix = self.localizable.get('Suffix' + EditionManager.featureName(feature));
							$this.find('.main').text(sprintf(self.localizable.get('headerFeatureLocked'), suffix));
						}
						else {
							$this.find('.main').text(self.localizable.get('headerUpgradeMessage'));
						}

						// disable columns for which you already have the upgrade
						if(sku == config.skuStudent){
							$this
								.find('li.student')
								.addClass('disabled');

						} else if(sku == config.skuBusiness || sku == config.skuBusinessMonthly){
							$this
								.find('li.student, li.business')
								.addClass('disabled');
						}

						// hook up actions
						$this
							.on(router.clicktype, '.product-purchase', function(e){
								self.sendToCart(e, $(this).data('sku'));
							})
							.on(router.clicktype, 'button.chooseBilling', function(e){
								e.preventDefault(); e.stopPropagation();

								// just change the classes to reflect new selected billing
								var $btn = $(e.currentTarget),
									sku = $btn.data('sku'),
									$radio = $btn.find('.radio'),
									$radios = $btn.closest('.table').find('button.chooseBilling .radio'),
									$btnChoose = $btn.closest('.pt-column').find('.product-purchase');

								// clear all
								$radios.removeClass('icon-misc-checkbox').addClass('icon-misc-checkbox-unchecked');

								// select
								$radio.removeClass('icon-misc-checkbox-unchecked').addClass('icon-misc-checkbox');

								// store choice
								$btnChoose.data('sku', sku)

							});

					});

			}

        });

        return view;
    });