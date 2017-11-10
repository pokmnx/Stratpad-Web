define(['BasicSearchResultsView'],

function(BasicSearchResultsView) {

    var view = BasicSearchResultsView.extend({

        el: '#matchingBookkeepers',

        category: 'Bookkeeper'

    });

    return view;
});