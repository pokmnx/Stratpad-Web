var Player = Backbone.Model.extend({

  // Default attributes for the todo item.
  defaults: function() {
    return {
      name: "unknown",
      position: "",
    };
  },

  // Ensure that each todo created has `title`.
  initialize: function() {
    if(!this.get("name")) {
      this.set({
        "name": this.defaults().title
      });
    }
  },

});

var Team = Backbone.SimperiumCollection.extend({

  // Reference to this collection's model.
  model: Player,

});


var app_id = 'railroad-hashmarks-e6f';
var simperium = new Simperium(app_id, {
  token: '16723ee1bf6d499b9ffbc024ff30aeac'
});

todoBucket = simperium.bucket("teams");

