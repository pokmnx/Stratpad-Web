// a mixin for localstorage saving
// user is never saved explicitly back to the server
// we do however need global access to it and its properties, and sometimes we update it via other methods (eg. if the user successfully orders connect, changes name)
// would also be nice to listen for changes to user
// we keep a single instance of User in router - can just use that one, or keep a local pointer to it

define(['backbone'],

    function() {

        var UserModel = Backbone.Model.extend({

            entityName: "User",

            parse: function (json) {
                this.set('fullname', $.stratweb.fullname(json.firstname, json.lastname));
                // triggers 'change' events
                return json;
            },

            fetch: function(options) {
                this.set(JSON.parse($.localStorage.getItem('user')));
                this.trigger('sync', this);
                return this;
            },
            
            save : function(key, value, options) {
                $.localStorage.setItem('user', JSON.stringify(this.toJSON()));
                this.trigger('sync', this);
            },

            destroy: function(options) {
                this.clear();
                $.localStorage.removeItem('user');
                this.trigger('destroy', this);
            }          

        });
        return UserModel;
    });