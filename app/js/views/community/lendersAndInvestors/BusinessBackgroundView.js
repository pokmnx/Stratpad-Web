define(['BusinessBackground', 'LenderView', 'Config'],

function(BusinessBackground, LenderView, config) {

    var view = LenderView.extend({

    	el: '#businessBackground',

        initialize: function(router, localizable) {
        	LenderView.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", 'save');      

            var self = this;

	        $('#moneyRequired, #profitable, #revenue, #businessStructure, #financingTypeRequested, #preferredLanguage').selectize();

            // setup requestedAssetTypes
            $('#requestedAssetTypes').selectize({
                plugins: ['remove_button'],
                hideSelected: false,
                create: false,
                maxItems: 3,
            });


	        // db lookup for naics
	        $('#industry').selectize({
		        plugins: ['drag_drop', 'remove_button'],
		        valueField: 'code',
		        labelField: 'description',
		        searchField: 'description',
		        hideSelected: false,
		        options: [],
		        create: false,
		        // selectOnTab: true,
		        maxItems: 1,
		        render: {
			        option: function(item, escape) {
				        return '<div>' + item.description + '</div>';
			        }
		        },
		        load: function(query, callback) {
			        if (!query.length) return callback();
			        $.ajax({
				        url: config.serverBaseUrl + "/industries",
				        type: 'GET',
				        data: {
					        prefix: query
				        },
				        error: function(response) {
					        callback();
				        },
				        success: function(response) {
					        callback(response.data.industries);
				        }
			        });
		        }
	        });

	        // int only
	        $('#yearsInBusiness').keydown($.stratweb.integerField);

	        // will need this later, when switching stratfiles, in concert with special treatment for readonly stratfiles
	        this.title = this.localizable.get('li_bb_title');

        },

        load: function() {
        	LenderView.prototype.load.call(this);
            
            var self = this;

			if (!this.stratFile.isOwner()) {
				// don't bother loading anything else
				return;
			}

			$('#pageContent').nanoScroller({scrollTop: 0});

			var opts = _.extend({top: '100px'}, $.fn.spin.presets.default);
			this.$el.spin(opts);

            // drop down the agreement page as required
   			this.communityAgreementView.maybeShowAgreement();

            // todo: could prepopulate codeNAICS (StratFileInfo), language (User) and primary asset (financials/assets) and financingTypeRequested

            this.businessBackground = new BusinessBackground({stratFileId: this.stratFile.get('id')});
            this.businessBackground.fetch({
                success: function(model) {

                	// dropdowns
					$('#moneyRequired, #profitable, #revenue, #businessStructure, #financingTypeRequested, #preferredLanguage').each(function() {
						var $this = $(this),
							propertyName = $this.attr('id');
						if (model.has(propertyName)) {
							$this.selectize()[0].selectize.setValue(model.get(propertyName).toString());
						} 
						else {
							$this.selectize()[0].selectize.setValue('');	
						}
					});

					// multiple selections in a dropdown
					if (model.has('requestedAssetTypes')) {
						$('#requestedAssetTypes').selectize()[0].selectize.setValue(model.get('requestedAssetTypes'));
					} else {
						$('#requestedAssetTypes').selectize()[0].selectize.setValue([]);	
					}

					// simple text fields
					$('#yearsInBusiness, #duns, #businessTaxId, #zipOrPostalCode').each(function() {
						var $this = $(this),
							propertyName = $this.attr('id');
						if (model.has(propertyName)) {
							$this.val(model.get(propertyName).toString());
						} 
						else {
							$this.val('');
						}						
					});

					// revenue min and max dropdown
					if (model.has('revenueMin')) {
						var revenueMax = model.get('revenueMax') ? model.get('revenueMax') : ''
						var val = model.get('revenueMin') + '-' + revenueMax;
						$('#revenue').selectize()[0].selectize.setValue(val);
					}

					if (model.has('moneyRequiredMin')) {
						var moneyRequiredMax = model.get('moneyRequiredMax') ? model.get('moneyRequiredMax') : ''
						var val = model.get('moneyRequiredMin') + '-' + moneyRequiredMax;
						$('#moneyRequired').selectize()[0].selectize.setValue(val);
					}

					// industry code lookup
					if (model.has('industry')) {
						var $industry = self.$el.find('#industry').selectize();
						$industry[0].selectize.addOption({'description': model.get('industry'), 'code': model.get('industryCodeNaics')});
						$industry[0].selectize.setValue(model.get('industryCodeNaics'));
					}

                    // todo: permissions
                    // self.applyPermissions();

			        // save on any change - attach late so that we don't invoke saves while populating
			        var $els = self.$el.find('form :input');
			        $els.off('change.businessBackground');                  
			        $els.on('change.businessBackground', $.debounce(1000, false, function(evt) {
			        	self.save(evt);
			        }));

                    self.$el.spin(false);

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load businessBackground. Status: %s %s", xhr.status, xhr.statusText) );
                    self.$el.spin(false);
                }
            });            


        },

        save: function(evt) {
            // the idea is that only 1 field could have changed, so update and save
            // console.debug("sf save: " + this.businessBackground.cid);
            var $target = $(evt.currentTarget);
            var data = {};
            var fieldName = $target.attr('name');
            if (fieldName == 'revenue') {
        		var vals = $target.val().split('-');
        		data['revenueMin'] = vals[0];
        		data['revenueMax'] = vals[1];
            }
        	else if (fieldName == 'moneyRequired') {
        		var vals = $target.val().split('-');
        		data['moneyRequiredMin'] = vals[0];
        		data['moneyRequiredMax'] = vals[1];
        	}
        	else if (fieldName == 'industry') {
				var $industry = $target.selectize(),
					code = $target.val();
        		data['industryCodeNaics'] = code;
        		data['industry'] = $industry[0].selectize.getOption(code).text();
        	}
            else {
                data[$target.attr('name')] = $target.val();
            }        	
            this.businessBackground.set(data);                

            this.businessBackground.save(null, {
                success: function(response) {
                    console.info("saved businessBackground: " + this.businessBackground.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save businessBackground. Status: %s %s", xhr.status, xhr.statusText) );
                    this.router.showSaveMessage(this.localizable.get('changesNotSaved'), true);
                }.bind(this)
            });
        }

    });

    return view;
});