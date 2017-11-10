/**
 * We should use this for most backbone calls, unless you know they can proceed in parallel. This makes one AJAX call (ie backbone fetch or save)
 * wait until the preceeding one finished. We need that in most cases, because we are operating on the same entity which cannot be locked out, but might be
 * shared or used in multiple places. See example below.
 */
define([],

    function() {

        // when we change pages, and the last item isn't yet saved:
        // PUT is issued, GET is issued, PUT is received, GET is received -- no good
        // PUT is issued, PUT is received, GET is issued, GET is received -- good
        // so, often, the long description is overwritten (making it seem like it didn't save)
        // here we fix that problem by making the calls sequential

        // for multiple, quick save situations:
        // the thing is, even if they are queued, we can still have problems; consider:
        // we have a model, 
        // a. change an attribute and save
        // b. change an attribute and save
        // c. first change comes back, and on parse, sets the state of this model to (a)
        // d. change an attribute and save - this uses the current state of the model (a) as its base, and thus we lose the change in (b)
        // the key is thus to use a Deferred queue, and to use the model.save(changedAttributes, options) form of the save method (see OpeningBalances)
        // NB the server-returned model is still parsed, and the modificationDate is updated, but backbone must use the state of the model at the time the update is issued

        var DispatchManager = Class.extend({

            initialize: function() {
                _.bindAll(this, "save", "fetch");

                this.queue = $.Deferred();
                this.queue.resolve();
            },

            // this form of save is fine when doing a longer input and more likely to switch pages (initiating some fetches)
            save: function(model, options) {
                console.debug("queuing save");
                this.queue = this.queue.then(function() {
                    return model.save(null, options);
                });
            },

            // use this form of save, when rapid saves are a possibility
            save: function(model, attrs, options) {
                console.debug("queuing attr save");
                this.queue = this.queue.then(function() {
                    return Backbone.Model.prototype.save.call(model, attrs, options);
                });
            },

            fetch: function(model, options) {
                console.debug("queuing fetch");
                this.queue = this.queue.then(function() {
                    return model.fetch(options);
                });
            }

        });

        return DispatchManager;
    }
);