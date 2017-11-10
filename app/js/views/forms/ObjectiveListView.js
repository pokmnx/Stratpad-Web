// shows a list of objectives, of a certain type, inside an ObjectivesDetail
define(['ObjectiveRowView', 'backbone'],
  function(ObjectiveRowView) {

    var view = Backbone.View.extend({

      objectiveRowViews: {},

      // $listEle is the ul that we should be adding/removing items from
      initialize: function(router, objectiveCollection, localizable, objectiveType, $listEle, theme) {
        _.bindAll(this, "render", "renderOne", "removeOne", "_checkNoRowsAndShowMessage");
        this.router = router;
        this.objectiveCollection = objectiveCollection;
        this.localizable = localizable;
        this.objectiveType = objectiveType;
        this.$el = $listEle;
        this.theme = theme;

        // listen for new objectives being added to the model, and render
        this.objectiveCollection.on("add", function(objective) {
          var themeId = objective.themeId || objective.get('themeId');
          if (objective.get("type") == this.objectiveType && themeId == this.theme.id) {
            console.log("Rendering objective: " + objective.get("summary"));
            var pos = this.$el.find('> li').length;
            this.renderOne(objective, pos);
            this._checkNoRowsAndShowMessage();
          };
        }.bind(this));

        this.objectiveCollection.on("destroy", function(objective) {
          var themeId = objective.themeId || objective.get('themeId');
          if (objective.get("type") == this.objectiveType && themeId == this.theme.id) {
            console.log("Removing objective: " + objective.get("summary"));
            this.removeOne(objective);
            this._checkNoRowsAndShowMessage();
          };
        }.bind(this));

        this.objectiveCollection.on("reset", function() {
          console.log("Resetting/removing all objectives of type: " + this.objectiveType);
          this.objectiveRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        var filteredCollection = this.objectiveCollection.where({
          'type': this.objectiveType,
          'themeId': this.theme.id
        });
        console.debug(sprintf("Rendering %s objectiveRowViews of type %s ", filteredCollection.length, this.objectiveType));
        _.each(filteredCollection, function(objective, idx) {
          this.renderOne(objective, idx);
        }.bind(this));
        this._checkNoRowsAndShowMessage();
      },

      // adds one rendered objectiveRowView to the end of the list
      renderOne: function(objective, idx) {
        var objectiveRowView = new ObjectiveRowView(this.router, objective, this.localizable);

        // listen for any change in the objective and re-render
        objective.on("change", function() {
          console.debug("Updating the objective: " + this.get("summary")  );
          objectiveRowView.render();
        });

        this.$el.append(objectiveRowView.render().el);
        this.objectiveRowViews[objective.id.toString()] = objectiveRowView;
      },

      removeOne: function(objective) {
        // look through objectiveRowViews for a matching objective
        console.debug("removing objective from view: " + JSON.stringify(objective.toJSON()));
        var objectiveRowView = this.objectiveRowViews[objective.id.toString()];
        if (!objectiveRowView) {
          console.warn("Couldn't find objectiveRowView for removal: " + JSON.stringify(objective.toJSON()));
          return;
        };
        objectiveRowView.$el.fadeOut(400, function() {
          $(this).remove();
        });
        delete this.objectiveRowViews[objective.id.toString()];
      },

      // select: function(objective) {
      //     this.objectiveRowViews[objective.id.toString()].select();          
      // },

      // // if we delete cells in the middle, have to update data-key attr and page
      // updateCellDataKeys: function() {
      //     this.$el.find('li span').each(function(idx, ele) {
      //       var id = $(ele).attr("model");
      //       var objectiveRowView = this.objectiveRowViews[id.toString()];
      //       objectiveRowView.page = idx;
      //       objectiveRowView.render();
      //     }.bind(this));
      // }

      _checkNoRowsAndShowMessage: function() {
          if (this.objectiveCollection.where({'type': this.objectiveType, 'themeId': this.theme.id}).length == 0) {
            // no objectives
            console.debug(sprintf('Adding NoObjectivesRow for: %s, %s', this.objectiveType, this.theme.id));
            var compiledTemplate = Handlebars.templates['forms/NoObjectivesRow'];
            var html = compiledTemplate(this.localizable);
            this.$el.append(html);
          } 
          else {
            // remove it
            this.$el.find('.noObjectives').closest('.objectiveSortableItem').remove();
          }
      }

    });

    return view;
  });