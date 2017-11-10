define(['StratFile', 'Theme', 'ThemeCellView', 'backbone'],
  function(StratFile, Theme, ThemeCellView) {

    var view = Backbone.View.extend({

      el:'#themes ul',

      themeCellViews: {},
      
      initialize: function(router, themeCollection) {
        _.bindAll(this, "render", "renderOne", "removeOne", "select", "updateCellDataKeys");
        this.router = router;
        this.themeCollection = themeCollection;

        // listen for new themes being added to the model, and render
        this.themeCollection.on("add", function(theme) {
          console.log("Rendering theme: " + theme.get("name")  );
          var pos = $(this.el).find('li').length;
          this.renderOne(theme, pos);
        }.bind(this));

        this.themeCollection.on("destroy", function(theme) {
          console.log("Removing themeCellView: " + theme.get("name")  );
          this.removeOne(theme);
        }.bind(this));

        this.themeCollection.on("reset", function() {
          console.log("Removing all themes" );
          this.themeCellViews = {};
          $(this.el).find('li').remove();
        }.bind(this));

      },

      // renders all cells and appends to our #themes ul
      render: function() {
        console.debug("Rendering all themes: " + this.themeCollection.length);
        this.themeCollection.each(function(theme, idx){
          this.renderOne(theme, idx);
        }.bind(this));
      },

      // adds one rendered theme view to the end of the list
      renderOne: function(theme, idx) {
          var themeCellView = new ThemeCellView(this.router, theme, idx);

          // listen for the name changing in F4
          theme.on("change:name", function(theme) {
            console.debug("Updating the theme: " + theme.get("name")  );
            themeCellView.render();
            themeCellView.select();
          });

          this.$el.append( themeCellView.render().el );
          this.themeCellViews[theme.id.toString()]=themeCellView;
      },

      removeOne: function(theme) {
          // in fact, we need to re-render the whole list to keep the page references correct
          // little tricky though, because this list is open already (unlike objectives and activities), so the UI effects are important
          this.themeCellViews = {};
          $('li#themes ul.navSubSection li.navItem').remove();
          this.render();
      },

      select: function(theme) {
          this.themeCellViews[theme.id.toString()].select();          
      },

      // if we delete cells in the middle, have to update data-key attr and page
      updateCellDataKeys: function() {
          this.$el.find('li span').each(function(idx, ele) {
            var id = $(ele).attr("model");
            var themeCellView = this.themeCellViews[id.toString()];
            themeCellView.page = idx;
            themeCellView.render();
          }.bind(this));
      }

    });

    return view;
  });