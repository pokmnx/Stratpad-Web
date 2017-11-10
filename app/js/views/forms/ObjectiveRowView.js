define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.objectiveSortableItem
      tagName: 'li',
      className: 'objectiveSortableItem',

      initialize: function(router, objective, localizable) {
        _.bindAll(this, 'render');
        this.router = router;
        this.objective = objective;
        this.localizable = localizable;
      },

      render: function() {
        var compiledTemplate = Handlebars.templates['forms/ObjectiveRowView'];
        var context = _.extend(this.objective.toJSON(), {
          localizedReviewFrequency: this.localizable[this.objective.get('reviewFrequency')]
        });

        // get metrics
        var metrics = this.objective.get('metricCollection');
        if (metrics && metrics.length == 1) {
          var metric = metrics.at(0);
          context.metricSummary = metric.get('summary');
          context.targetDate = (metric.has('targetDate')) ? moment(metric.get('targetDate').toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out) : '&nbsp;';
          if (metric.has('targetValue')) {
            var val = metric.get('targetValue');
            var targetValue = $.stratweb.isNumber(val) ? $.stratweb.formatNumberWithParens(val) : val;
            context.targetValue = new Handlebars.SafeString(_.escape(targetValue));
          } else {
            context.targetValue = new Handlebars.SafeString('&nbsp;');
          }
        } 
        else if (metrics && metrics.length > 1) {
          context.metricSummary = this.localizable.multipleMetricsName;
          context.targetDate = new Handlebars.SafeString('&nbsp;');
          context.targetValue = new Handlebars.SafeString('&nbsp;');
          context.metricSummaryClassname = 'italic';
        } 
        else {
          context.metricSummary = this.localizable.noMetrics;
          context.targetDate = new Handlebars.SafeString('&nbsp;');
          context.targetValue = new Handlebars.SafeString('&nbsp;');
          context.metricSummaryClassname = 'italic';
        }

        var html = compiledTemplate(context);
        this.$el.html(html); // xss safe
        this.$el.data('objectiveId', this.objective.id);
        return this;
      }

    });

    return view;
  });