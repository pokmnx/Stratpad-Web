// shows a list of metrics inside an objective dialog
define(['MetricRowView', 'backbone'],
  function(MetricRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el:'li.metrics > ul',

      metricRowViews: {},

      initialize: function(router, metricCollection, localizable, $listEle, objective) {
        _.bindAll(this, "render", "renderOne", "removeOne", "_checkNoRowsAndShowMessage");
        this.router = router;
        this.metricCollection = metricCollection;
        this.localizable = localizable;
        this.objective = objective;

        // listen for new metrics being added to the model, and render
        this.metricCollection.on("add", function(metric) {
          var themeId = metric.themeId || metric.get('themeId');
          console.log("Rendering metric: " + metric.get("summary"));
          var pos = this.$el.find('> li').length;
          this.renderOne(metric, pos);
          this._checkNoRowsAndShowMessage();
        }.bind(this));

        this.metricCollection.on("destroy", function(metric) {
          console.log("Removing metric from display: " + metric.get("summary"));
          this.removeOne(metric);
          this._checkNoRowsAndShowMessage();
        }.bind(this));

        this.metricCollection.on("remove", function(metric) {
          // destry was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.log("Removing metric from display: " + metric.get("summary"));
          this.removeOne(metric);
          this._checkNoRowsAndShowMessage();
        }.bind(this));

        this.metricCollection.on("reset", function() {
          console.log("Resetting/removing all metrics");
          this.metricRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug(sprintf("Rendering %s metricRowViews", this.metricCollection.length));
        this.metricCollection.each(function(metric, idx) {
          this.renderOne(metric, idx);
        }.bind(this));
        this._checkNoRowsAndShowMessage();
      },

      // adds one rendered metricRowView to the end of the list
      renderOne: function(metric, idx) {
        var metricRowView = new MetricRowView(this.router, metric, this.localizable);
        this.$el.append(metricRowView.render().el);
        this.metricRowViews[metric.id.toString()] = metricRowView;
      },

      removeOne: function(metric) {
        // look through metricRowViews for a matching metric
        var metricRowView = this.metricRowViews[metric.id.toString()];
        if (metricRowView) {
          metricRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.metricRowViews[metric.id.toString()];

        };
      },

      _checkNoRowsAndShowMessage: function() {
          // if (this.metricCollection.length == 0) {
          //   // no metrics
          //   console.debug(sprintf('Adding NoMetricsRow for: %s, %s', this.objective.get('summary')));
          //   var compiledTemplate = Handlebars.templates['forms/NoMetricsRow'];
          //   var html = compiledTemplate(this.localizable);
          //   this.$el.append(html);
          // } 
          // else {
          //   // remove it
          //   this.$el.find('.noMetrics').closest('.metricItem').remove();
          // }
      }

    });

    return view;
  });