define(['StratFile', 'Financial', 'views/forms/financials/AccountsReceivableView'],

function(StratFile, Financial, AccountsReceivableView) {

    var view = AccountsReceivableView.extend({

        el: '#ap',

        prop: 'accountsPayableTerm'

    });

    return view;
});