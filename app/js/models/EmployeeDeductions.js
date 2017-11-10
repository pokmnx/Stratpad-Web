define(['Config', 'backbone'], 

function(config) {
    var EmployeeDeductionsModel = Backbone.Model.extend({

        // NB our model is EmployeeDeductions, but the json uses the singular employeeDeduction        
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/financials/%s/employeeDeductions",
        defaults: {
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
            this.set('financialId', model.financialId || options.financialId);
            console.debug('Initing EmployeeDeductions with name: ' + model.name);
            if ("id" in model) {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId')) + "/" + model.id;
            } else {
                this.url = sprintf(this.urlRoot, this.get('stratFileId'), this.get('financialId'));
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            this.url = sprintf(this.urlRoot, json.data.employeeDeduction.stratFileId, json.data.employeeDeduction.financialId) + "/" + json.data.employeeDeduction.id;
            return json.data.employeeDeduction;
        }
    }, {
        entityName: "EmployeeDeductions"
    });
    return EmployeeDeductionsModel;
 });