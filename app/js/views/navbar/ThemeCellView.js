define(['StratFile', 'Theme', 'PageStructure', 'backbone'],
  function(StratFile, Theme, pageStructure) {

    var view = Backbone.View.extend({
      
      tagName: 'li',
      className: 'navItem',

      initialize: function(router, theme, page) {
        _.bindAll(this, "render", "select");
        this.router = router;
        this.theme = theme;
        this.page = page;
      },

      render: function() {
        var compiledTemplate = Handlebars.templates['navbar/ThemeCellView'];
        var context = _.extend(this.theme.toJSON(), {pageref: sprintf('%s,%s,%s', pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, this.page) });
        var html = compiledTemplate(context);
        this.$el.html(html); // xss safe
        return this;
      }, 

      select: function() {
        this.$el.find(sprintf('span[data-key="%s,%s,%s"]', pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, this.page)).addClass('active');
      }     

    });

    return view;
  });