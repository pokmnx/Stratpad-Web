define(['StratFileCellView', 'backbone'],
  function(StratFileCellView) {

    var view = Backbone.View.extend({

      // a <section> full of <article> items
      el: '#stratFiles',

      stratFileCellViews: {},

      initialize: function(router, stratFileCollection) {
        _.bindAll(this, "render", "renderOne", "removeOne", "select");
        this.router = router;
        this.stratFileCollection = stratFileCollection;

        this.$content = this.$el.find('.content');

        // listen for new stratFiles being added to the model, and render
        this.stratFileCollection.on("add", function(stratFile) {
          // unfortunately, notifications don't come in the order specified
          // the collection itself though, is ordered and appears to be in place at this time (after a full fetch)
          console.log(sprintf("Rendering stratFile: %s %s", stratFile.get("name"), moment(stratFile.get("modificationDate"))));
          this.renderOne(stratFile);
        }.bind(this));

        this.stratFileCollection.on("destroy", function(stratFile) {
          console.log("Removing stratFile (destroy): " + stratFile.get("name"));
          this.removeOne(stratFile);
        }.bind(this));

        this.stratFileCollection.on("remove", function(stratFile) {
          console.log("Removing stratFile (remove): " + stratFile.get("name"));
          this.removeOne(stratFile);
        }.bind(this));

        // after fetching the whole collection
        this.stratFileCollection.on('sync', function(models) {
          console.debug('stratFileCollection synced');

          // stratFiles go in order of lastAccess, but we display time since modified
          // remember, to update lastAccess, we have to do a get on the stratfile (not the collection)
          this.$content.empty();          
          this.render();
          this.select(this.router.stratFileManager.stratFileId);

          // need to hit nanoscroller twice to get it to scroll to active
          this.$el.nanoScroller();
          this.$el.nanoScroller({scrollTo: $('.stratFileItem.active')});


        }.bind(this));


        this.stratFileCollection.on("change", function(stratFile) {
          // when the user makes a change to a stratfile
          // but also just when we go to a page, because when we fetch the stratfile, we get a new lastAccessDate
          // after delete stratfile, change also occurs on the newly selected (and thus loaded) stratfile, because of lastAccessDate
          console.log("Changed stratFile: " + stratFile.get("name"));
          
          // this stratFile has now become the last edited, and should be top of the list
          // remove all, and then re-render
          this.stratFileCollection.sort();
          this.$content.empty();
          this.render();

          // select it
          this.select(stratFile.get('id'));

        }.bind(this));

      },

      // renders all cells and appends to our #stratFiles menu
      render: function() {
        console.debug("Rendering all stratFiles: " + this.stratFileCollection.length);

        this.stratFileCollection.each(function(stratFile) {
          this.renderOne(stratFile);
        }.bind(this));

        this.$el.nanoScroller();
      },

      // adds one rendered stratFile view to the end of the list
      renderOne: function(stratFile) {
        var stratFileCellView = new StratFileCellView(this.router, stratFile);

        // listen for the name changing in F1
        stratFile.on("change:name", function(stratFile) {
          console.debug("Updating the stratFile: " + stratFile.get("name"));
          stratFileCellView.render();
          stratFileCellView.select();
        });

        if (stratFile.id == this.stratFileCollection.at(0).id) {
          // special case for when we are adding a new stratfile
          this.$content.prepend(stratFileCellView.render().el);
        } else {
          this.$content.append(stratFileCellView.render().el);
        }

        this.stratFileCellViews[stratFile.id.toString()] = stratFileCellView;
      },

      // removed a stratfile from the collection, so update our StratFileListView to match
      removeOne: function(stratFile) {
        var stratFileId = stratFile.id.toString();
        var stratFileCellView = this.stratFileCellViews[stratFileId];

        // because we have both destroy and remove listeners, don't do this twice
        if (stratFileCellView) {
          stratFileCellView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.stratFileCellViews[stratFileId];          
        };
      },

      select: function(stratFileId) {
        var $active = this.$el.find('.stratFileItem.active');
        if ($active.data('id') != stratFileId) {
          this.stratFileCellViews[stratFileId.toString()].select();
        };        
      }

    });

    return view;
  });