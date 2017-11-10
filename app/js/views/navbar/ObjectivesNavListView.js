// shows a list of cells under Objectives in the side navbar, each corresponding to a theme, but when clicked shows a list of objectives
define(['StratFile', 'ObjectivesNavCellView', 'backbone'],
  function(StratFile, ObjectivesNavCellView) {

    var view = Backbone.View.extend({

      el:'#objectives ul',

      objectivesCellViews: {},
      
      initialize: function(router, themeCollection) {
        _.bindAll(this, "render", "renderOne", "removeOne", "select", "updateCellDataKeys");
        this.router = router;
        this.themeCollection = themeCollection;

        // listen for new themes being added to the model, and render
        this.themeCollection.on("add", function(theme) {
          console.log("Rendering objectives cell for theme: " + theme.get("name")  );
          var pos = $(this.el).find('li').length;
          this.renderOne(theme, pos);
        }.bind(this));

        this.themeCollection.on("destroy", function(theme) {
          console.log("Removing objectivesNavCellView: " + theme.get("name")  );
          this.removeOne(theme);
        }.bind(this));

        this.themeCollection.on("reset", function() {
          console.log("Removing all objectivesCellViews" );
          this.objectivesCellViews = {};
          $(this.el).find('li').remove();
        }.bind(this));

      },

      // renders all cells and appends to our #objectives ul
      render: function() {
        console.debug("Rendering all objectivesCellViews: " + this.themeCollection.length);
        this.themeCollection.each(function(theme, idx){
          this.renderOne(theme, idx);
        }.bind(this));
      },

      // adds one rendered ObjectivesNavCellView to the end of the list
      renderOne: function(theme, idx) {
          var objectivesNavCellView = new ObjectivesNavCellView(this.router, theme, idx);

          // listen for the name changing in F4
          theme.on("change:name", function(theme) {
            console.debug("Updating the theme name under objectives: " + theme.get("name")  );
            objectivesNavCellView.render();
            // themeCellView.select();
          });

          this.$el.append( objectivesNavCellView.render().el );
          this.objectivesCellViews[theme.id.toString()]=objectivesNavCellView;
      },

      removeOne: function(theme) {
          // in fact, we need to re-render the whole list to keep the page references correct
          this.objectivesCellViews = {};
          $('li#objectives .navSubSection li.navItem').remove();
          this.render();

          // // look through objectivesCellViews for a matching theme
          // var objectivesNavCellView = this.objectivesCellViews[theme.id.toString()];
          // objectivesNavCellView.$el.fadeOut(400, function() {
          //     $(this).remove();
          // });
          // delete this.objectivesCellViews[theme.id.toString()];
      },

      select: function(theme) {
          this.objectivesCellViews[theme.id.toString()].select();          
      },

      // if we delete cells in the middle, have to update data-key attr and page (we keep the same order as themes)
      updateCellDataKeys: function() {
          this.$el.find('li span').each(function(idx, ele) {
            var id = $(ele).attr("model");
            var objectivesNavCellView = this.objectivesCellViews[id.toString()];
            objectivesNavCellView.page = idx;
            objectivesNavCellView.render();
          }.bind(this));
      }

    });

    return view;
  });