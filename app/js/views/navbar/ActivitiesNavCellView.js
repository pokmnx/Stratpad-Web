define(['StratFile', 'Objective', 'PageStructure', 'backbone'],
    function (StratFile, Objective, pageStructure) {

        var view = Backbone.View.extend({

            tagName  : 'li',
            className: 'navItem',

            initialize: function (router, objective, page) {
                _.bindAll(this, "render", "select");
                this.router = router;
                this.objective = objective;
                this.page = page;
            },

            render: function () {

                // remember, the activities nav section lists _objectives_; when you click an objectives, you see activities in the content area
                var compiledTemplate = Handlebars.templates['navbar/ActivitiesNavCellView'],
                    context = _.extend(
                        this.objective.toJSON(), 
                        {   pageref: sprintf('%s,%s,%s', pageStructure.SECTION_FORM, pageStructure.CHAPTER_ACTIVITIES, this.page) }
                        ),
                    html = compiledTemplate(context);

                this.$el.html(html) // xss safe

                return this;
            },

            select: function () {
                this.$el.find(sprintf('span[data-key="%s,%s,%s"]', pageStructure.SECTION_FORM, pageStructure.CHAPTER_ACTIVITIES, this.page)).addClass('active');
            }

        });

        return view;
    });