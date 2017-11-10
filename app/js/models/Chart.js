define(['Config', 'backbone'],

    function(config) {

        // we need to be able to handle both metric-based charts and projection-based charts in the ChartCollection
        var ChartModel = Backbone.Model.extend({

            entityName: "Chart",

            defaults: {
                // String chartType;
                // String colorScheme;
                // Integer order;
                // String overlay;
                // Boolean showTarget;
                // Boolean showTrend;
                // String title;
                // String uuid;
                // Integer yAxisMax;
                // Integer zLayer;
            }    

        }, 

        {

            // legacy is a number, in the form of a string, which matches this index; preferred is the string constant
            colorSchemes: {
                'Red': {
                    idx: 0,
                    colors: ['C00023', '380001']
                },
                'Orange': {
                    idx: 1,
                    colors: ['C4691E', '482403']
                },
                'Yellow': {
                    idx: 2,
                    colors: ['EED635', '473F07']
                },
                'Green': {
                    idx: 3,
                    colors: ['7FCF51', '204F07']
                },
                'Royal': {
                    idx: 4,
                    colors: ['1F5092', '051A2F']
                },
                'Turquoise': {
                    idx: 5,
                    colors: ['3B636C', '02151E']
                },
                'Grey': {
                    idx: 6,
                    colors: ['555555', '797979'] // different from ipad
                },
                'Sky': {
                    idx: 7,
                    colors: ['5BB0C6', '1D2C33']
                },
            },

            // legacy is a number, in the form of a string, which matches this index; preferred is the string constant
            chartTypes: [
                'ChartTypeNone', // eg.the overlay could be none
                'ChartTypeLine',
                'ChartTypeBar',
                'ChartTypeArea',
                'ChartTypeComments' // only valid on the overlay
            ],

            hexColor: function(colorScheme, which) {
                if (which === undefined) {
                    which = 0
                }; // colorSchemes are pairs (for gradients) - can just use first colour for flat
                return '#' + _.findWhere(this.colorSchemes, {
                    idx: colorScheme * 1
                }).colors[which];
            }


        });
        return ChartModel;
    });