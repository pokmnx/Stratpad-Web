define(['Config', 'backbone'], 

function(config) {
    var PersonalCreditHistoryModel = Backbone.Model.extend({
        
        // note that a GET on this URL will give us a single PCH, rather than an array that we normally expect
        // ie 1:1 with User
        urlRoot: config.serverBaseUrl + "/users/%s/personalCreditHistories",
        defaults: {
            // Boolean bankrupt;
            // Integer birthdate;
            // Boolean criminalRecord;
            // Integer fico;
            // Gender gender; MALE/FEMALE
            // String ssnSin;
            // Boolean veteran;
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("userId" in options));
            var isInModel = ("userId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a userId!! Breaking.");
                return;
            };
            this.set('userId', model.userId || options.userId);
            console.debug('Initing personalCreditHistory for user: ' + model.userId);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('userId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, this.get('userId')) + "/" + json.data.personalCreditHistory.id;
            return json.data.personalCreditHistory;
        }
    }, {
        entityName: "PersonalCreditHistory"
    });
    return PersonalCreditHistoryModel;
 });