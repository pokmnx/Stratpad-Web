define(['Config', 'backbone'], 

function(config) {
    var LoanModel = Backbone.Model.extend({

        // there is only ever one (and always one) financials object
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/-1/loans",
        defaults: {
            // equal(loan.name, 'Car');
            // equal(loan.date, 201206);
            // equal(loan.amount, 11000);
            // equal(loan.term, 24);
            // equal(loan.rate, 8.35);
            // equal(loan.type, 'PRINCIPAL_PLUS_INTEREST');
            // equal(loan.frequency, 'QUARTERLY');            
        },

        initialize:function(model, options) {
            // we can't send unknown keys to the server
            var isInOptions = (options && ("stratFileId" in options));
            var isInModel = ("stratFileId" in model);
            if (!isInModel && !isInOptions) {
                console.error("You must provide a stratFileId!! Breaking.");
                return;
            };
            this.set('stratFileId', model.stratFileId || options.stratFileId);
            console.debug('Initing loan with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "loan" in json.data) {
                this.url = sprintf(this.urlRoot, json.data.loan.stratFileId) + "/" + json.data.loan.id;
                return json.data.loan;
            } else {
                // when we get a collection of loans, then we don't need to do this parsing
                return json;
            }
        }
    }, {
        entityName: "Loan"
    });
    return LoanModel;
 });