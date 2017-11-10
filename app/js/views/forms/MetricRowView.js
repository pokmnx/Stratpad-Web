define(['backbone'],
	function () {

		var view = Backbone.View.extend({

			// will surround the handlebar template with a li.metricItem
			tagName  : 'li',
			className: 'metricItem',

			initialize: function (router, metric, localizable) {
				_.bindAll(this, 'render');
				this.router = router;
				this.metric = metric;
				this._localizable = localizable;
			},

			render: function () {
				var compiledTemplate = Handlebars.templates['forms/MetricRowView'];
				var context = _.extend(this.metric.toJSON(), this._localizable, {
					gt: 'Exceeds',
					lt: 'Is less than'
				});
				var self = this;
				var html = compiledTemplate(context);
				this.$el.html(html); // xss safe
				this.$el.data('metricId', this.metric.id);

				// change hooks for text fields
				this.$el.find('#metricSummary_' + this.metric.id).change(function (e) {
					this.metric.set({'summary': $(e.target).val()});
				}.bind(this));

				this.$el.find('#targetValue_' + this.metric.id).change(function (e) {
					this.metric.set({'targetValue': $(e.target).val()});
				}.bind(this));

				// hook up date picker (should only be 1)
				var $targetDate = this.$el.find('.datepicker');
				$targetDate.datepicker({
						// todo: localized dates?
						dateFormat : "yy-mm-dd", // strangely, this means eg. 2014-06-12
						onSelect   : function (dateText) {
							// silent because we defer save
							// this doesn't pick up when you delete the date text
							var formattedDate = $.stratweb.formattedInterchangeDate(dateText, '')
							this.metric.set({'targetDate': formattedDate});
						}.bind(this),
						onClose   : function (dateText) {
							// silent because we defer save
							// picks up when you delete the date text
							var formattedDate = $.stratweb.formattedInterchangeDate(dateText, '')
							this.metric.set({'targetDate': formattedDate});
						}.bind(this),

						changeMonth: true,
						changeYear : true,
						showAnim   : "slideDown"
					}
				);
				$targetDate.prev('i').on(self.router.clicktype, function () {
					$targetDate.datepicker("show");
				});

				// populate target date
				$targetDate.datepicker().val($.stratweb.formattedDateForDatePicker(this.metric.get('targetDate')));

				// populate successIndicator
				var successIndicator = this.metric.get('successIndicator');
				if (successIndicator == 'MEET_OR_EXCEED') {
					this.$el.find('#successIndicator_gt_' + this.metric.id).prop('checked', true);
				} else if (successIndicator == 'MEET_OR_SUBCEDE') {
					this.$el.find('#successIndicator_lt_' + this.metric.id).prop('checked', true);
				}

				// change hook for successIndicator
				this.$el.find("input[type=radio]").fix_radios();
				this.$el.find('input[type=radio]').change(function () {
					var val = this.$el.find('input[type=radio]:checked').val();
					this.metric.set({'successIndicator': val});
				}.bind(this));

				// delete button
				this.$el
					.on(this.router.clicktype, ".deleteMetric", function (e) {
						e.preventDefault();
						e.stopPropagation();

						// just remove from collection - doesn't destroy it yet
						var metricCollection = this.metric.collection;
						metricCollection.remove([this.metric]);
					}.bind(this));

				return this;
			}

		});

		return view;
	});