// shows a list of assets in the Financials -> Options page
define(['AssetRowView', 'backbone'],
  function(AssetRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el: '#assets ul.sortable',

      assetRowViews: {},

      initialize: function(router, assetCollection, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne");
        this.router = router;
        this.assetCollection = assetCollection;
        this.localizable = localizable;

        // listen for new assets being added to the model, and render
        this.assetCollection.on("add", function(asset) {
          console.debug("Rendering assetRowView: " + asset.get("name"));
          var pos = this.$el.find('> li').length;
          this.renderOne(asset, pos);
        }.bind(this));

        this.assetCollection.on("destroy", function(asset) {
          // destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.debug("Removing assetRowView from display: " + asset.get("name"));
          this.removeOne(asset);
        }.bind(this));

        this.assetCollection.on("reset", function() {
          console.debug("Resetting/removing all assetRowViews");
          this.assetRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug("Rendering assetRowViews: " + this.assetCollection.length);
        this.$el.find('li').remove();
        this.assetCollection.each(function(asset, idx) {
          this.renderOne(asset, idx);
        }.bind(this));
      },

      // adds one rendered assetRowView to the end of the list
      renderOne: function(asset, idx) {
        var assetRowView = new AssetRowView(this.router, asset, this.localizable);

        asset.on("change", function(asset) {
          console.debug("Updating the asset row: " + asset.get("name")  );
          assetRowView.render();
        });

        this.$el.append(assetRowView.render().el);
        this.assetRowViews[asset.id.toString()] = assetRowView;
      },

      removeOne: function(asset) {
        // look through assetRowViews for a matching asset
        var assetRowView = this.assetRowViews[asset.id.toString()];
        if (assetRowView) {
          assetRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.assetRowViews[asset.id.toString()];

        };
      }

    });

    return view;
  });