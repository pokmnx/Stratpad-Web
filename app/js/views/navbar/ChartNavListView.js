define(['StratFile', 'Chart', 'ChartNavCellView', 'backbone'],
  function(StratFile, Chart, ChartNavCellView) {

    var view = Backbone.View.extend({

      el:'.stratboard ul',

      chartCellViews: {},
      
      initialize: function(router, chartCollection) {
        _.bindAll(this, "render", "renderOne", "removeOne", "select", "updateCellDataKeys");
        this.router = router;
        this.chartCollection = chartCollection;

        // listen for new charts being added to the model, and render
        // we only list chart cells which are not overlays (zLayer == 0)
        this.chartCollection.on("add", function(chart) {
          if (chart.get('zLayer') == 0) {
            console.log("Rendering chartCellView: " + chart.get("title")  );
            var pos = $(this.el).find('li').length;
            this.renderOne(chart, pos);            
          };
        }.bind(this));

        this.chartCollection.on("destroy", function(chart) {
          console.log("Removing chartCellView: " + chart.get("title")  );
          if (chart.get('zLayer') == 0) {
            this.removeOne(chart);
          }
        }.bind(this));

        this.chartCollection.on("reset", function() {
          console.log("Removing all chartCellViews" );
          this.chartCellViews = {};
          this.$el.find('li:not(.summary)').remove();
        }.bind(this));

      },

      // renders all cells and appends to our .stratboard ul
      render: function() {
        var filteredChartCollection = this.chartCollection.where( {zLayer: 0} );
        console.debug("Rendering filtered chartCellViews: " + filteredChartCollection.length);
        _.each(filteredChartCollection, function(chart, idx){
          // add 1 for the summary page
          var pos = idx+1;
          this.renderOne(chart, pos);
        }.bind(this));
      },

      // adds one rendered chart view to the end of the list
      renderOne: function(chart, idx) {
          var chartCellView = new ChartNavCellView(this.router, chart, idx);

          // listen for the title changing
          chart.off('change', null, "NavBar");
          chart.on("change:title", function(chart) {
            console.debug("Updating the chartCellView: " + chart.get("title")  );
            chartCellView.render();
            chartCellView.select();
          }, 'NavBar');

          this.$el.append( chartCellView.render().el );
          this.chartCellViews[chart.id.toString()]=chartCellView;
      },

      removeOne: function(chart) {
          // in fact, we need to re-render the whole list to keep the page references correct
          // little tricky though, because this list is open already (unlike objectives and activities), so the UI effects are important
          this.chartCellViews = {};
          $('li.stratboard ul.navSection li.navItem:not(.summary)').remove();
          this.render();
      },

      select: function(chart) {
          this.chartCellViews[chart.id.toString()].select();          
      },

      // if we delete cells in the middle, have to update data-key attr and page
      updateCellDataKeys: function() {
        console.warn("todo: Don't think we are using this");
          // this.$el.find('li span').each(function(idx, ele) {
          //   var id = $(ele).attr("model");
          //   var chartCellView = this.chartCellViews[id.toString()];
          //   chartCellView.page = idx;
          //   chartCellView.render();
          // }.bind(this));
      }

    });

    return view;
  });