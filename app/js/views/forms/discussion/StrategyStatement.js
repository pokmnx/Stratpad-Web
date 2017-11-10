define(['Config', 'Dictionary', 'DiscussionBase', 'i18n!nls/StrategyStatement.i18n', 'PageStructure'],

function(config, Dictionary, DiscussionBase, localizable, pageStructure) {

    var view = DiscussionBase.extend({

        el: '#pageContent',

        template: 'forms/discussion/StrategyStatement',

        initialize: function(router) {            
            DiscussionBase.prototype.initialize.call(this, router, localizable);
        }

    });

    return view;
});