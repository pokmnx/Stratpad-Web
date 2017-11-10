// shows a list of activities for a given Objective
define(['ActivityRowView', 'backbone'],
  function(ActivityRowView) {

    var view = Backbone.View.extend({

      el: '#activitiesSortable',

      activityRowViews: {},

      initialize: function(router, activityCollection, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne", "_checkNoRowsAndShowMessage");
        this.router = router;
        this.activityCollection = activityCollection;
        this.localizable = localizable;

        // listen for new activities being added to the model, and render
        this.activityCollection.on("add", function(activity) {
            console.log("Rendering activity: " + activity.get("action"));
            var pos = this.$el.find('> li').length;
            this.renderOne(activity, pos);
            this._checkNoRowsAndShowMessage();
        }.bind(this));

        this.activityCollection.on("destroy", function(activity) {
            console.log("Removing activity: " + activity.get("action"));
            this.removeOne(activity);
            this._checkNoRowsAndShowMessage();
        }.bind(this));

        this.activityCollection.on("reset", function() {
          console.log("Resetting/removing all activities");
          this.activityRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells and appends to our #[sortable] ul
      render: function() {
        console.debug(sprintf("Rendering %s activityRowViews.", this.activityCollection.length));
        this.activityCollection.each(function(activity, idx){
          this.renderOne(activity, idx);
        }.bind(this));
        this._checkNoRowsAndShowMessage();
      },

      // adds one rendered activityRowView to the end of the list
      renderOne: function(activity, idx) {
        var activityRowView = new ActivityRowView(this.router, activity, this.localizable);

        // listen for the name changing in F4
        activity.on("change", function(activity) {
          console.debug("Updating the activity: " + activity.get("action")  );
          activityRowView.render();
        });

        this.$el.append(activityRowView.render().el);
        this.activityRowViews[activity.id.toString()] = activityRowView;
      },

      removeOne: function(activity) {
        // look through activityRowViews for a matching activity
        var activityRowView = this.activityRowViews[activity.id.toString()];
        activityRowView.$el.fadeOut(400, function() {
          $(this).remove();
        });
        delete this.activityRowViews[activity.id.toString()];
      },

      _checkNoRowsAndShowMessage: function() {
          if (this.activityCollection.length == 0) {
            // no activities
            var compiledTemplate = Handlebars.templates['forms/NoActivitiesRow'];
            var html = compiledTemplate(this.localizable);
            this.$el.append(html);
          } 
          else {
            // remove it
            this.$el.find('.noActivities').closest('.activitySortableItem').remove();
          }
      }

    });

    return view;
  });