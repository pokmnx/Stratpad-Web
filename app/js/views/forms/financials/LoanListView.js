// shows a list of loans in the Financials -> Options page
define(['LoanRowView', 'backbone'],
  function(LoanRowView) {

    var view = Backbone.View.extend({

      // the ul that we should be adding/removing items from
      el: '#loans ul.sortable',

      loanRowViews: {},

      initialize: function(router, loanCollection, localizable) {
        _.bindAll(this, "render", "renderOne", "removeOne");
        this.router = router;
        this.loanCollection = loanCollection;
        this.localizable = localizable;

        // listen for new loans being added to the model, and render
        this.loanCollection.on("add", function(loan) {
          console.debug("Rendering loanRowView: " + loan.get("name"));
          var pos = this.$el.find('> li').length;
          this.renderOne(loan, pos);
        }.bind(this));

        this.loanCollection.on("destroy", function(loan) {
          // destroy was a model that was deleted; remove was a model that we simply pulled out of the collection
          console.debug("Removing loanRowView from display: " + loan.get("name"));
          this.removeOne(loan);
        }.bind(this));

        this.loanCollection.on("reset", function() {
          console.debug("Resetting/removing all loanRowViews");
          this.loanRowViews = {};
          this.$el.find('li').remove();
        }.bind(this));

      },

      // renders all cells in a section and appends to our #[sortable] ul
      render: function() {
        console.debug("Rendering loanRowViews: " + this.loanCollection.length);
        this.$el.find('li').remove();
        this.loanCollection.each(function(loan, idx) {
          this.renderOne(loan, idx);
        }.bind(this));
      },

      // adds one rendered loanRowView to the end of the list
      renderOne: function(loan, idx) {
        var loanRowView = new LoanRowView(this.router, loan, this.localizable);

        loan.on("change", function(loan) {
          console.debug("Updating the loan row: " + loan.get("name")  );
          loanRowView.render();
        });

        this.$el.append(loanRowView.render().el);
        this.loanRowViews[loan.id.toString()] = loanRowView;
      },

      removeOne: function(loan) {
        // look through loanRowViews for a matching loan
        var loanRowView = this.loanRowViews[loan.id.toString()];
        if (loanRowView) {
          loanRowView.$el.fadeOut(400, function() {
            $(this).remove();
          });
          delete this.loanRowViews[loan.id.toString()];

        };
      }

    });

    return view;
  });