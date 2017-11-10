// shows a list of charts in the Financials -> Options page
define(['ChartRowView', 'backbone'],
  function(ChartRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el: '#charts ul.sortable',

      chartRowViews: {},

      initialize: function(router, chartCollection, startDate, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne");
        this.router = router;
        this.chartCollection = chartCollection;
        this.startDate = startDate;
        this.localizable = localizable;

        this.chartCollection.off(null, null, 'ChartListView');

        // listen for new charts being added to the model, and render
        this.chartCollection.on("add", function(chart) {
          console.debug("Rendering chartRowView: " + chart.get("title"));
          var pos = this.$el.find('> li').length;
          this.renderOne(chart, pos);
        }.bind(this), 'ChartListView');

        this.chartCollection.on("destroy", function(chart) {
          // destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.debug("Removing chartRowView from display: " + chart.get("title"));
          this.removeOne(chart);
        }.bind(this), 'ChartListView');

        this.chartCollection.on("reset", function() {
          console.debug("Resetting/removing all chartRowViews");
          this.chartRowViews = {};
          this.$el.find('li').remove();
        }.bind(this), 'ChartListView');

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug("Rendering chartRowViews: " + this.chartCollection.length);
        this.$el.find('li').remove();
        this.chartCollection.each(function(chart, idx) {
          this.renderOne(chart, idx);
        }.bind(this));
      },

      // adds one rendered chartRowView to the end of the list
      renderOne: function(chart, idx) {
        var chartRowView = new ChartRowView(this.router, chart, this.startDate, this.localizable);

        // todo: HIGH we need to look for proliferating listeners like this
        chart.off('change', null, "StratBoardSummary");
        chart.on("change", function(chart) {
          console.debug("Updating the chart row: " + chart.get("title")  );
          chartRowView.render();
        }, 'StratBoardSummary');

        this.$el.append(chartRowView.render().el);
        this.chartRowViews[chart.id.toString()] = chartRowView;
      },

      removeOne: function(chart) {
        // look through chartRowViews for a matching chart
        var chartRowView = this.chartRowViews[chart.id.toString()];
        if (chartRowView) {
          chartRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.chartRowViews[chart.id.toString()];

        };
      }

    });

    return view;
  });