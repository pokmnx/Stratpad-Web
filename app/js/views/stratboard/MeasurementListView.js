// shows a list of measurements in the Financials -> Options page
define(['MeasurementRowView', 'backbone'],
  function(MeasurementRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el: '#measurements ul.sortable',

      measurementRowViews: {},

      initialize: function(router, measurementCollection, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne");
        this.router = router;
        this.measurementCollection = measurementCollection;
        this.localizable = localizable;

        // listen for new measurements being added to the model, and render
        this.measurementCollection.on("add", function(measurement) {
          console.debug("Rendering measurementRowView: " + measurement.get("id"));

          this.renderOne(measurement, true);
        }.bind(this));

        this.measurementCollection.on("destroy", function(measurement) {
          // destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.debug("Removing measurementRowView from display: " + measurement.get("id"));
          this.removeOne(measurement);
        }.bind(this));

        this.measurementCollection.on("reset", function() {
          console.debug("Resetting/removing all measurementRowViews");
          this.measurementRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug("Rendering measurementRowViews: " + this.measurementCollection.length);
        this.$el.find('li').remove();
        this.measurementCollection.each(function(measurement) {
          this.renderOne(measurement);
        }.bind(this));
      },

      // adds one rendered measurementRowView to the end of the list
      renderOne: function(measurement, byOrder) {
        var measurementRowView = new MeasurementRowView(this.router, measurement, this.localizable);

        measurement.on("change", function(measurement) {
          console.debug("Updating the measurement row: " + measurement.get("id")  );
          measurementRowView.render();
          measurementRowView.emphasize();
        });

        if (byOrder) {
          // need to insert in proper (date) order; the measurementCollection is in order
          var index = this.measurementCollection.indexOf(measurement);
          var modelAbove = this.measurementCollection.at(Math.max(0, index-1));
          var $modelAbove = this.$el.find(sprintf("li[measurementId=%s]", modelAbove.get('id')));
          if ($modelAbove.length) {
            $modelAbove.after(measurementRowView.render().el);
          } else {
            this.$el.append(measurementRowView.render().el);
          }
          // only emphasize on user addition 
          measurementRowView.emphasize();
        } else {
          this.$el.append(measurementRowView.render().el);
        }

        // store
        this.measurementRowViews[measurement.id.toString()] = measurementRowView;
      },

      removeOne: function(measurement) {
        // look through measurementRowViews for a matching measurement
        var measurementRowView = this.measurementRowViews[measurement.id.toString()];
        if (measurementRowView) {
          measurementRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.measurementRowViews[measurement.id.toString()];

        };
      }

    });

    return view;
  });