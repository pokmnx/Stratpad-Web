define(['LenderView', 'PersonalCreditHistory'],

function(LenderView, PersonalCreditHistory) {

    var view = LenderView.extend({

        el: '#personalCreditHistory',

        initialize: function(router, localizable) {
        	LenderView.prototype.initialize.call(this, router, localizable);

            _.bindAll(this, "load", 'save');

            var self = this;

            // basic dropdowns
            this.$el.find('#bankrupt, #gender, #criminalRecord, #veteran').selectize();

            // int only
            this.$el.find('#ssnSin, #fico').keydown($.stratweb.integerField);

            // birthdate
            var $birthDate = this.$el.find('#birthdate');
            $birthDate.datepicker({
                    // todo: localized dates?
                    dateFormat : "yy-mm-dd", // strangely, this means eg. 2014-06-12
                    changeMonth: true,
                    changeYear : true,
                    showAnim   : "slideDown",
                    yearRange: "-70:+0",
                }
            );
            $birthDate.prev('i').on(self.router.clicktype, function () {
                $birthDate.datepicker("show");
            });

            // will need this later, when switching stratfiles, in concert with special treatment for readonly stratfiles
            this.title = this.localizable.get('li_pch_title');            

        },

        load: function() {
            LenderView.prototype.load.call(this);

            if (!this.stratFile.isOwner()) {
                // don't bother loading anything else
                return;
            }            
            
            $('#pageContent').nanoScroller({scrollTop: 0});

            var self = this;

            var opts = _.extend({top: '100px'}, $.fn.spin.presets.default);
            this.$el.spin(opts);

            // drop down the agreement page as required
            this.communityAgreementView.maybeShowAgreement();

            // special treatment for this label
            var idents = {
                'Canada': 'pch_label_sin',
                'United States': 'pch_label_ssn',
                'Other': 'pch_label_nin'
            };
            var country = this.router.stratFileManager.currentStratFile().get('country');
            $('#ssnSin').prev().text(this.localizable.get(idents[country] || idents['Other']));

            var userData = $.parseJSON($.localStorage.getItem('user'));
            this.personalCreditHistory = new PersonalCreditHistory({userId: userData.id});
            this.personalCreditHistory.fetch({
                success: function(model) {

                    $('#bankrupt, #gender, #criminalRecord, #veteran').each(function() {
                        var $this = $(this),
                            propertyName = $this.attr('id');
                        if (model.has(propertyName)) {
                            $this.selectize()[0].selectize.setValue(model.get(propertyName).toString());
                        } 
                        else {
                            $this.selectize()[0].selectize.setValue('');    
                        }
                    });

                    $('#ssnSin, #fico').each(function() {
                        var $this = $(this),
                            propertyName = $this.attr('id');
                        if (model.has(propertyName)) {
                            $this.val(model.get(propertyName).toString());
                        } 
                        else {
                            $this.val('');
                        }                       
                    });

                    // populate birthdate
                    self.$el.find('#birthdate').datepicker().val($.stratweb.formattedDateForDatePicker(model.get('birthdate')));

                    // save on any change - attach late so that we don't invoke saves while populating
                    var $els = self.$el.find('form :input');
                    $els.off('change.personalCreditHistory');                  
                    $els.on('change.personalCreditHistory', $.debounce(1000, false, function(evt) {
                        self.save(evt);
                    }));

                    self.$el.spin(false);

                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load personalCreditHistory. Status: %s %s", xhr.status, xhr.statusText) );
                    self.$el.spin(false);
                }
            });
        },

        save: function(evt) {
            // the idea is that only 1 field could have changed, so update and save
            console.debug("sf save: " + this.personalCreditHistory.cid);
            var $target = $(evt.currentTarget);
            var data = {};
            var fieldName = $target.attr('name');
            if (fieldName == 'birthdate') {
                data[fieldName] = $.stratweb.formattedInterchangeDate($target.val(), '');
            }
            else {
                data[$target.attr('name')] = $target.val() ? $target.val() : null;
            }

            this.personalCreditHistory.set(data);                

            this.personalCreditHistory.save(null, {
                success: function(response) {
                    console.info("saved personalCreditHistory: " + this.personalCreditHistory.id);
                    this.router.showSaveMessage(this.localizable.get('allChangesSaved'), false);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't save personalCreditHistory. Status: %s %s", xhr.status, xhr.statusText) );
                    this.router.showSaveMessage(this.localizable.get('changesNotSaved'), true);
                }.bind(this)
            });
        }

    });

    return view;
});