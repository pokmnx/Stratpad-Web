// shows a list of equities in the Financials -> Options page
define(['EquityRowView', 'backbone'],
  function(EquityRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el: '#equities ul.sortable',

      equityRowViews: {},

      initialize: function(router, equityCollection, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne");
        this.router = router;
        this.equityCollection = equityCollection;
        this.localizable = localizable;

        // listen for new equities being added to the model, and render
        this.equityCollection.on("add", function(equity) {
          console.debug("Rendering equityRowView: " + equity.get("name"));
          var pos = this.$el.find('> li').length;
          this.renderOne(equity, pos);
        }.bind(this));

        this.equityCollection.on("destroy", function(equity) {
          // destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.debug("Removing equityRowView from display: " + equity.get("name"));
          this.removeOne(equity);
        }.bind(this));

        this.equityCollection.on("reset", function() {
          console.debug("Resetting/removing all equityRowViews");
          this.equityRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug("Rendering equityRowViews: " + this.equityCollection.length);
        this.$el.find('li').remove();
        this.equityCollection.each(function(equity, idx) {
          this.renderOne(equity, idx);
        }.bind(this));
      },

      // adds one rendered equityRowView to the end of the list
      renderOne: function(equity, idx) {
        var equityRowView = new EquityRowView(this.router, equity, this.localizable);

        equity.on("change", function(equity) {
          console.debug("Updating the equity row: " + equity.get("name")  );
          equityRowView.render();
        });

        this.$el.append(equityRowView.render().el);
        this.equityRowViews[equity.id.toString()] = equityRowView;
      },

      removeOne: function(equity) {
        // look through equityRowViews for a matching equity
        var equityRowView = this.equityRowViews[equity.id.toString()];
        if (equityRowView) {
          equityRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.equityRowViews[equity.id.toString()];

        };
      }

    });

    return view;
  });