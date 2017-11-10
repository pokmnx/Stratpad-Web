define(['Config', 'NetBenefitsCalculator'],

    function(config, NetBenefitsCalculator) {

        /**
         * Manages the seasonal % box on Project Editor (F4.ThemeDetail) and the popup it produces.
         * Css is in F4.ThemeDetail.scss
         */
        var ProjectSeasonalManager = Class.extend({

            initialize: function(router, theme, localizable) {
            	this.router = router;
            	this.theme = theme;
            	this.localizable = localizable;

                _.bindAll(this, "populateProjectFields", "_load", "_handleInputChange", "_updateState", "_fillWithDefaults", '_fillWithQuarterlyValues', '_clearSeasonals', '_saveAndClose', '_cancel', '_suggestRemainder', '_acceptSuggestion', '_closeOnEscape');

                var self = this;

	            this.$el = $('#pageContent .content section article form');
                this.stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));

                // all the fields which can have notes
                this.$projectSeasonalIcons = $('#pageContent').find('.projectSeasonalIcon');

                // prepare for render
                var seasonalTemplate = Handlebars.templates['forms/themes/ProjectSeasonal'],
                    context = _.extend(self.localizable.all(), {readonly: this.stratFile.isReadOnly('PLAN') }),
                    noteTip = seasonalTemplate(context);

                // add tooltipster to each relevant field
                this.$projectSeasonalIcons
                    .tooltipster({
                        autoClose: true,
                        content: $(noteTip),
                        contentCloning: false,
                        positionTracker: true,
                        contentAsHTML: true,

                        // on close
                        functionAfter: function(origin) {

                            $(document)
                                .off('.seasonal');

                            origin.parent().removeClass('active');

                            $('.tooltip-overlay')
                                .fadeOut(200, function() {
                                    $(this).remove();
                                });

                        },

                        // on open
                        functionReady: function(origin, tooltip) {

                            self.$tooltip = $(tooltip);

                            // origin is the icon
                            origin.parent().addClass('active');

                            // the project field we're working on
                            self.$field = origin.next();

                            // update dialog title
                            self.$tooltip.find('header h4').text(self.localizable.get('seasonalHeader') + " - " + self.localizable.get(self.$field.data('key')))

                            // fade out background
                            $('#pageContent').find('#f4')
                                .prepend('<div class="tooltip-overlay" />')
                                .find('.tooltip-overlay')
                                .animate({
                                    opacity: 1
                                }, 200);

                            // attach handlers for seasonal controls
                            self.$tooltip
                                .off('.seasonal')
                                .on('change.seasonal', 'input', self._handleInputChange)
                                .on('click.seasonal', '#doneSeasonalItem', self._saveAndClose)
                                .on('click.seasonal', '#cancelSeasonalItem', self._cancel)
                                .on('click.seasonal', '#defaultSeasonals', self._fillWithDefaults)
                                .on('click.seasonal', '#clearSeasonals', self._clearSeasonals)
                                .on('click.seasonal', '#quarterlySeasonals', self._fillWithQuarterlyValues)
                                .on('keydown.seasonal', '.seasonalAdjustment', $.stratweb.unsignedDecimalField)
                                .on('keydown.seasonal', '.seasonalAdjustment', self._acceptSuggestion)
                                .on('keydown.seasonal', '.seasonalAdjustment', self._closeOnEscape)
                                .on('focus.seasonal', '.seasonalAdjustment', self._suggestRemainder);

                            $(document)
                                .off('.seasonal')
                                .on('keydown.seasonal', self._closeOnEscape);

                            self._load();

                            self._updateState();   

                            self.$tooltip.find('.seasonalAdjustments input:first').focus();                         

                        },
                        interactive: true,
                        offsetY: '0px',
                        maxWidth: 768,
                        onlyOne: true,
                        theme: 'tooltipster-stratpad tooltip-notes',
                        trigger: 'click'
                    });

            },

            _closeOnEscape: function(e) {
                // esc key
                if (e.which == 27) {
                    this.$projectSeasonalIcons.tooltipster('hide');
                };
                // propagate
            },

            populateProjectFields: function() {
                // populate adjustment fields on F4
                
                var self = this;
                this.$el.find('input.seasonal').each(function() {
                    var $input = $(this);
                    var prop = sprintf("seasonal%sAdjustments", $.stratweb.capitalize($input.data('key')));
                    var val = '';
                    if (self.theme.has(prop) && self.theme.get(prop).length) {
                        val = self._valueForProjectField(self.theme.get(prop));
                    }
                    $input.val(val);
                });
            },

            _valueForProjectField: function(adjustments) {
                var postiveAdjustments = _.filter(adjustments, function(val) { return val != null && val != 0; })
                var val = '';
                if (postiveAdjustments.length) {
                    var min = _.min(postiveAdjustments);
                    var max = _.max(postiveAdjustments);
                    val = sprintf("%s ➜ %s", (min || max).toFixed(2), max.toFixed(2));                    
                }
                return val;
            },

            _load: function() {
                var self = this;

                // params
                var netBenefitsCalculator = new NetBenefitsCalculator(this.theme.toJSON());
                this.numMonths = Math.min(netBenefitsCalculator.durationInMonths, 12);
                this.startDate = netBenefitsCalculator.startDate;

                // remove fields
                var $fieldset = this.$tooltip.find('.seasonalAdjustments fieldset');
                $fieldset.empty();

                // create new fields
                for (var i = 0; i < 12; i++) {
                    var monthDate = moment(this.startDate).add(i, 'month');
                    var month = monthDate.format('MMM');
                    var $node = $('<div>').addClass('monthInput');
                    $node.append($('<div>').text(month));
                    $node.append($('<input>')
                        .attr('id', month.toLowerCase() + 'Adjustment')
                        .attr('name', month.toLowerCase() + 'Adjustment')
                        .attr('maxlength', '6')
                        .attr('type', 'text')
                        .attr('tabindex', i+502)
                        .addClass('seasonalAdjustment')
                        .addClass('seasonal')
                        .prop('disabled', i>=this.numMonths)
                        .data('month', monthDate.format('M')-1)
                        )
                    $fieldset.append($node);
                };

                // loop the tabbing, but doesn't work nicely for shift-tabbing
                $fieldset.find('input:last')
                    .on('focus', function() {this.tabIndex=501;})
                    .on('blur', function() {this.tabIndex=513;});

                // populate fields for first time
                // html fields could start on any month, but the array is always stored with jan, first
                this.$tooltip.find('.seasonalAdjustment').each(function() {
                    var $this = $(this);
                    var val = self._seasonalAdjustment($this.data('month'));
                    if (val) {
                        $this.data("val", val);
                        $this.val($.stratweb.formatDecimalWithParens(val));
                    }
                    else {
                        $this.data("val", null);
                        $this.val("");
                    }
                    $this.attr('placeholder', '');
                });                

                // set value to 100% if no vals
                var prop = sprintf("seasonal%sAdjustments", $.stratweb.capitalize(this.$field.data('key')));
                if (this.theme.has(prop)) {
                    var sum = _.reduce(this.theme.get(prop), function(memo,num) { return memo+num; });
                    if (sum == 0) {
                        // doesn't matter if we save or not
                        var $firstMonth = this.$tooltip.find('.seasonalAdjustment:first');
                        $firstMonth.data("val", 100);
                        $firstMonth.val($.stratweb.formatDecimalWithParens(100));
                    }
                } else {
                        // doesn't matter if we save or not
                        var $firstMonth = this.$tooltip.find('.seasonalAdjustment:first');
                        $firstMonth.data("val", 100);
                        $firstMonth.val($.stratweb.formatDecimalWithParens(100));                    
                }

            },            

            _saveAndClose: function(e) {
                e.preventDefault();

                var adjustments = [];
                this.$tooltip.find('.seasonalAdjustment').each(function() {
                    var $this = $(this);
                    adjustments[$this.data('month')] = $this.data("val")*1;
                });

                // if all zeroes, make this null
                var sum = _.reduce(adjustments, function(memo,num) { return memo+num; });
                if (sum == 0) {
                    adjustments = null;
                };

                var prop = sprintf("seasonal%sAdjustments", $.stratweb.capitalize(this.$field.data('key')));
                this.theme.set(prop, adjustments);
                // saved by underlying F4.ThemeDetail

                // update F4 field
                this.$field.val(this._valueForProjectField(adjustments));

                this.$projectSeasonalIcons.tooltipster('hide');                

            },

            _cancel: function(e) {
                e.preventDefault();
                this.$projectSeasonalIcons.tooltipster('hide');
            },            

	        _handleInputChange: function(e){

                var $this = $(e.currentTarget);

                // field value (what we display) is set to 2 decimal points; data attr is set to 4 decimal points (what we store)
                var val = $this.val()*1;
                if (val) {
                    $this.data("val", val);
                    $this.val($.stratweb.formatDecimalWithParens(val));
                }
                else {
                    $this.data("val", null);
                    $this.val("");
                }

                this._updateState();

	        },

            _updateState: function() {
                // get total
                var total = 0, self = this;
                this.$tooltip.find('.seasonalAdjustment').each(function() {
                    var val = ($(this).data('val')||0)*1;
                    total += val;
                });
                $seasonalAdjustmentTotal = this.$tooltip.find('#seasonalAdjustmentTotal');
                $seasonalAdjustmentTotal.text(Math.round(total) + '%');                

                var saveEnabled = Math.round(total) == 100 || total == 0;
                $seasonalAdjustmentTotal.css('color',  saveEnabled ? '#898989' : 'red');
                this.$tooltip.find('#doneSeasonalItem').prop('disabled', !saveEnabled);
            },

            // return the seasonalAjdustment value for the given month, from our theme
            _seasonalAdjustment: function(month) {
                month = month % 12;
                var prop = sprintf("seasonal%sAdjustments", $.stratweb.capitalize(this.$field.data('key')));
                if (this.theme.has(prop) && month < this.theme.get(prop).length) {
                    return this.theme.get(prop)[month];
                }
                else {
                    return 0;
                }
            },

            // fill all active fields with the same number, which when summed, totals 100
            _fillWithDefaults: function(e) {
                this._clearSeasonals(e);
                var val = (100/this.numMonths);
                this.$tooltip.find('.seasonalAdjustment').not('[disabled]').data('val', val.toFixed(3)).val(val.toFixed(2));
                this._updateState();
            },

            // fill all active fields (div by 4) with the same number, which when summed, totals 100
            _fillWithQuarterlyValues: function(e) {
                this._clearSeasonals(e);
                var val = 25;
                var $fields = this.$tooltip.find('.seasonalAdjustment');
                var enabledCt = $fields.not('[disabled]').length;
                var val = 100/Math.ceil(enabledCt/3);
                $fields.not('[disabled]').each(function(i) {
                    if (i%3==0) { // optimistic
                        $(this).data('val', val.toFixed(3)).val(val.toFixed(2));
                    } else {
                        $(this).data('val', 0).val("");
                    }
                });
                this._updateState();
            },

            // clear all fields
            _clearSeasonals: function(e) {
                var $this = $(e.currentTarget);
                this.$tooltip.find('.seasonalAdjustment').data('val', null).val("").attr('placeholder', '');
                this._updateState();
            },

            // suggest what value in the focused field would sum to 100
            _suggestRemainder: function(e) {
                var $this = $(e.currentTarget);

                var total = 0;
                this.$tooltip.find('.seasonalAdjustment').each(function() {
                    var $input = $(this);
                    $input.attr('placeholder', "");
                    var val = ($input.data('val')||0)*1;
                    total += val;
                });

                var val = $this.data('val') || $this.val() || 0;
                var suggested = 100-(total-val);
                if (Math.round(suggested) > 0) {
                    $this.attr('placeholder', suggested.toFixed(2));
                };
            },

            // set the value to the suggested value
            _acceptSuggestion: function(e) {
                if (e.which == 10 || e.which == 13) {
                    $input = $(e.target);
                    var val = $input.attr('placeholder');
                    if (val.length) {
                        $input.data("val", val);
                        $input.val($.stratweb.formatDecimalWithParens(val));
                        this._updateState();
                    };
                    $input.blur();
                }
            }

        });

        return ProjectSeasonalManager;
    });
