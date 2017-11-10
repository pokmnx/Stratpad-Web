define(['BasicSearchResultsView'],

function(BasicSearchResultsView) {

    var view = BasicSearchResultsView.extend({

        el: '#matchingLawyers',

        category: 'Lawyer'
        
    });

    return view;
});