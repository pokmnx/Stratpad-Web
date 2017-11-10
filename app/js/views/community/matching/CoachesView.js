define(['BasicSearchResultsView'],

function(BasicSearchResultsView) {

    var view = BasicSearchResultsView.extend({

        el: '#matchingCoaches',

        category: 'CoachOrMentor'
    });

    return view;
});