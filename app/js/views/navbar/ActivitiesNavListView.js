// shows a list of cells under Activities in the side navbar, each corresponding to an objective, but when clicked shows a list of activities
// order should look at theme order, then objective order (ie category and then order within category)
define(['StratFile', 'ActivitiesNavCellView', 'backbone'],
  function(StratFile, ActivitiesNavCellView) {

    var view = Backbone.View.extend({

      el:'#activities ul',

      activitiesCellViews: {},
      
      initialize: function(router, objectiveCollection) {
        _.bindAll(this, "render", "renderOne", "removeOne", "select");
        this.router = router;
        this.objectiveCollection = objectiveCollection;

        // listen for new objectives being added to the model, and render
        this.objectiveCollection.on("add", function(objective) {
          console.log("Rendering activities cell for objective: " + objective.get("summary")  );
          var pos = $(this.el).find('li').length;
          this.renderOne(objective, pos);

          // make sure activities are enabled
          $('#activities h6.subLevel').removeClass('disabled');
        }.bind(this));

        this.objectiveCollection.on("destroy", function(objective) {
          // the issue here is that the section/chapter/page encoding in the navbar is important, so we must maintain it
          console.log("Removing activitiesNavCellView: " + objective.get("summary")  );
          this.removeOne(objective);

          // if this is the last objective, then we should disable activities
          if (this.objectiveCollection.length == 0) {
            $('#activities h6.subLevel').addClass('disabled');
          };

        }.bind(this));

        this.objectiveCollection.on("reset", function() {
          console.log("Removing all activitiesCellViews" );
          this.activitiesCellViews = {};
          $(this.el).find('li').remove();
          $('#activities h6.subLevel').addClass('disabled');
        }.bind(this));

      },

      // renders all cells and appends to our #activities ul
      render: function() {
        console.debug("Rendering all activitiesCellViews: " + this.objectiveCollection.length);
        this.objectiveCollection.each(function(objective, idx){
          this.renderOne(objective, idx);
        }.bind(this));
      },

      // adds one rendered ActivitiesNavCellView to the end of the list
      renderOne: function(objective, idx) {
          var activitiesNavCellView = new ActivitiesNavCellView(this.router, objective, idx);

          // listen for the summary changing in edit objective dialog
          objective.on("change:summary", function(objective) {
            console.debug("Updating the objective summary under activities: " + objective.get("summary")  );
            activitiesNavCellView.render();
          });

          this.$el.append( activitiesNavCellView.render().el );
          this.activitiesCellViews[objective.id.toString()]=activitiesNavCellView;
      },

      removeOne: function(objective) {
          // in fact, we need to re-render the whole list to keep the page references correct
          this.activityCellViews = {};
          $('li#activities .navSubSection li.navItem').remove();
          this.render();
      },

      select: function(objective) {
          this.activitiesCellViews[objective.id.toString()].select();          
      },

      // if we delete cells in the middle, have to update data-key attr and page (we keep the same order as themes)
      updateCellDataKeys: function() {
          this.$el.find('li span').each(function(idx, ele) {
            var id = $(ele).attr("model");
            var activitiesNavCellView = this.activitiesCellViews[id.toString()];
            activitiesNavCellView.page = idx;
            activitiesNavCellView.render();
          }.bind(this));
      }


    });

    return view;
  });