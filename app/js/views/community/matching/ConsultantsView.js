define(['BasicSearchResultsView'],

function(BasicSearchResultsView) {

    var view = BasicSearchResultsView.extend({

        el: '#matchingConsultants',

        category: 'Consultant'

    });

    return view;
});