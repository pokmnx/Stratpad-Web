define(['StratFile', 'Chart', 'PageStructure', 'backbone'],
    function (StratFile, Chart, pageStructure) {

        var view = Backbone.View.extend({

            tagName  : 'li',
            className: 'navItem',

            initialize: function (router, chart, nthChart) {
                _.bindAll(this, "render", "select");
                this.router = router;
                this.chart = chart;
                this.nthChart = nthChart;
            },

            render: function () {

                var compiledTemplate = Handlebars.templates['navbar/ChartNavCellView'],
                    context = _.extend(this.chart.toJSON(), {pageref: sprintf('%s,%s,0', pageStructure.SECTION_STRATBOARD, this.nthChart) }),
                    navTitle = context.title,
                    html = compiledTemplate(context);

                this.$el
                    .html(html) // xss safe
                    .find('span')
                    .attr('title', navTitle)
                    .text(navTitle);

                return this;
            },

            select: function () {
                this.$el.find(sprintf('span[data-key="%s,%s,0"]', pageStructure.SECTION_STRATBOARD, this.nthChart)).addClass('active');
            }

        });

        return view;
    });