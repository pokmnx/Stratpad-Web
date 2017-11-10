define(['Config', 'Loan', 'backbone'], 

function(config, Loan) {
	var LoanCollection = Backbone.Collection.extend({
		model: Loan,
        // there is only ever one (and always one) financials object
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/-1/loans",
 		initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.url = sprintf(this.urlRoot, this.stratFileId);                
            };
 		},

        setStratFileId:function(stratFileId) {
            this.stratFileId = stratFileId;
            this.url = sprintf(this.urlRoot, this.stratFileId);            
        },

        parse: function(json) {
            if ("data" in json && "loans" in json.data) {
                return json.data.loans;
            } else {
                console.warn("Raw Loans being parsed!!!");
                return json;
            }
        },

		comparator: function(loan) {
			return loan.get("date");
		}

	}, {
        entityName: "LoanCollection"
    });
	return LoanCollection;
});